import { NextRequest, NextResponse } from "next/server";
import { verifyUserOtp } from "@/lib/otp-service";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const cleanOtp = String(body.otp || body.enteredOtp || "").trim();
    const cleanUid = String(body.uid || (body.email ? "uid-" + String(body.email).replace(/[^a-z0-9]/g, "") : "admin-kv-001")).trim();
    const trustDevice = Boolean(body.trustDevice);

    if (!cleanOtp) {
      return NextResponse.json(
        { success: false, message: "Please enter your 6-digit security OTP." },
        { status: 400 }
      );
    }

    // Constant-time constant verification against stored SHA-256 hash
    const result = await verifyUserOtp(cleanUid, cleanOtp);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          attemptsLeft: result.attemptsLeft,
          isLockedOut: result.isLockedOut
        },
        { status: result.isLockedOut ? 423 : 401 }
      );
    }

    // Generate a 30-day hashed trusted device token if requested
    let trustedDeviceToken: string | undefined = undefined;
    if (trustDevice) {
      trustedDeviceToken = crypto.randomBytes(32).toString("hex");
    }

    return NextResponse.json({
      success: true,
      message: "Two-step OTP verification complete. Session approved.",
      otpVerified: true,
      verifiedAt: Date.now(),
      trustedDeviceToken
    });
  } catch (error: any) {
    console.error("[verify-otp API error]:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify security OTP. Please try again." },
      { status: 500 }
    );
  }
}
