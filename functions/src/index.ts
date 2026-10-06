import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as crypto from "crypto";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// 5-minute expiry, 5 max attempts, 30s cooldown, 5/hr rate limit
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 30 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const OTP_MAX_SENDS_PER_HOUR = 5;
const OTP_LOCKOUT_MS = 15 * 60 * 1000;

function hashOtp(otp: string, salt: string): string {
  return crypto.createHash("sha256").update(otp + salt).digest("hex");
}

/**
 * Callable Function: sendOtp
 * Requires authenticated Google user.
 */
export const sendOtp = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated via Google first.");
  }

  const uid = context.auth.uid;
  const email = context.auth.token.email || data.email;

  if (!email) {
    throw new functions.https.HttpsError("invalid-argument", "Missing user email address.");
  }

  // Check allowlist in Firestore `users/{uid}`
  const userDoc = await db.collection("users").doc(uid).get();
  if (!userDoc.exists || userDoc.data()?.status !== "active") {
    throw new functions.https.HttpsError("permission-denied", "Access pending. Your account is not approved by an admin.");
  }

  const now = Date.now();
  const otpRef = db.collection("otp_requests").doc(uid);
  const otpSnap = await otpRef.get();

  if (otpSnap.exists) {
    const existing = otpSnap.data()!;
    if (existing.lockoutUntil && existing.lockoutUntil > now) {
      const minsLeft = Math.ceil((existing.lockoutUntil - now) / 60000);
      throw new functions.https.HttpsError("resource-exhausted", `Account temporarily locked. Try again in ${minsLeft} minutes.`);
    }

    if (existing.lastSentAt && now - existing.lastSentAt < OTP_RESEND_COOLDOWN_MS) {
      const secondsLeft = Math.ceil((OTP_RESEND_COOLDOWN_MS - (now - existing.lastSentAt)) / 1000);
      throw new functions.https.HttpsError("resource-exhausted", `Please wait ${secondsLeft}s before requesting a new OTP.`);
    }

    if (existing.firstSendInWindow && now - existing.firstSendInWindow < 3600000) {
      if (existing.sendCount >= OTP_MAX_SENDS_PER_HOUR) {
        throw new functions.https.HttpsError("resource-exhausted", "Hourly OTP rate limit exceeded (max 5 per hour).");
      }
    }
  }

  // Generate cryptographically secure 6-digit OTP
  const min = 100000;
  const max = 999999;
  const plainOtp = crypto.randomInt(min, max + 1).toString();
  const salt = crypto.randomBytes(16).toString("hex");
  const hashedOtp = hashOtp(plainOtp, salt);

  const existingData = otpSnap.exists ? otpSnap.data()! : {};
  const isWithinWindow = existingData.firstSendInWindow && (now - existingData.firstSendInWindow < 3600000);
  const sendCount = isWithinWindow ? (existingData.sendCount || 0) + 1 : 1;
  const firstSendInWindow = isWithinWindow ? existingData.firstSendInWindow : now;

  // Store ONLY hashed OTP and salt in Firestore (never log or store plain OTP)
  await otpRef.set({
    uid,
    email: email.toLowerCase().trim(),
    hashedOtp,
    salt,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: now + OTP_EXPIRY_MS,
    lastSentAt: now,
    sendCount,
    firstSendInWindow,
    attempts: 0,
    lockoutUntil: 0
  });

  // Log audit event
  await db.collection("audit_logs").add({
    userId: uid,
    userEmail: email,
    action: "otp_sent",
    module: "two_factor_auth",
    details: `Dispatched 2FA OTP to ${email}`,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    ip: context.rawRequest?.ip || "unknown",
    userAgent: context.rawRequest?.headers["user-agent"] || "unknown"
  });

  // Dispatch Email via Resend / SendGrid / SMTP
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    // Send external email via Resend
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: process.env.OTP_FROM_EMAIL || "security@kreditventure.com",
          to: [email],
          subject: `🔐 KV Flash Security Code: ${plainOtp}`,
          html: `<p>Your KV Flash 2FA security code is: <strong>${plainOtp}</strong> (Valid for 5 minutes).</p>`
        })
      });
    } catch (e) {
      console.error("Resend dispatch error:", e);
    }
  }

  // Dev bypass logging only if explicitly enabled
  if (process.env.OTP_DEV_MODE === "true") {
    console.log(`[DEV ONLY] OTP for ${email}: ${plainOtp}`);
  }

  return {
    success: true,
    message: "Security code sent to your registered Gmail address."
  };
});

/**
 * Callable Function: verifyOtp
 * Verifies OTP, sets custom claim `otpVerified: true`.
 */
export const verifyOtp = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  const uid = context.auth.uid;
  const enteredOtp = String(data.otp || "").trim();

  if (!enteredOtp || enteredOtp.length !== 6) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid OTP format. Must be 6 digits.");
  }

  const now = Date.now();
  const otpRef = db.collection("otp_requests").doc(uid);
  const otpSnap = await otpRef.get();

  if (!otpSnap.exists) {
    throw new functions.https.HttpsError("not-found", "No active OTP request found.");
  }

  const record = otpSnap.data()!;

  if (record.lockoutUntil && record.lockoutUntil > now) {
    const minsLeft = Math.ceil((record.lockoutUntil - now) / 60000);
    throw new functions.https.HttpsError("resource-exhausted", `Account locked. Please try again in ${minsLeft} minutes.`);
  }

  if (now > record.expiresAt) {
    await otpRef.delete();
    throw new functions.https.HttpsError("deadline-exceeded", "Security code expired. Please request a new code.");
  }

  // Constant time comparison
  const enteredHash = hashOtp(enteredOtp, record.salt);
  const bufA = Buffer.from(enteredHash, "utf8");
  const bufB = Buffer.from(record.hashedOtp, "utf8");
  const isMatch = bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);

  if (!isMatch) {
    const attempts = (record.attempts || 0) + 1;
    const remaining = OTP_MAX_ATTEMPTS - attempts;

    if (attempts >= OTP_MAX_ATTEMPTS) {
      await otpRef.update({
        attempts,
        lockoutUntil: now + OTP_LOCKOUT_MS
      });

      await db.collection("audit_logs").add({
        userId: uid,
        userEmail: record.email,
        action: "locked_out",
        module: "two_factor_auth",
        details: `Account locked after 5 failed OTP attempts`,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      throw new functions.https.HttpsError("resource-exhausted", "Maximum 5 failed attempts reached. Locked for 15 minutes.");
    }

    await otpRef.update({ attempts });

    await db.collection("audit_logs").add({
      userId: uid,
      userEmail: record.email,
      action: "otp_failed",
      module: "two_factor_auth",
      details: `Failed OTP attempt (${remaining} remaining)`,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    throw new functions.https.HttpsError("permission-denied", `Incorrect code. ${remaining} attempts left.`);
  }

  // Success: Delete OTP doc and assign custom claim otpVerified: true
  await otpRef.delete();

  await admin.auth().setCustomUserClaims(uid, {
    otpVerified: true,
    verifiedAt: now
  });

  await db.collection("users").doc(uid).update({
    otpVerified: true,
    lastVerifiedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  await db.collection("audit_logs").add({
    userId: uid,
    userEmail: record.email,
    action: "otp_verified",
    module: "two_factor_auth",
    details: `Two-step verification completed successfully`,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  return {
    success: true,
    message: "Two-step verification verified successfully."
  };
});
