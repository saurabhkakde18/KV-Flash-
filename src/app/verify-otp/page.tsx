"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/common/BrandLogo";
import { useAuth } from "@/context/AuthContext";
import { TAGLINE, COMPANY_NAME, PARENT_COMPANY } from "@/lib/constants";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Mail,
  RotateCcw,
  CheckCircle2,
  Clock,
  LogOut,
  Smartphone,
  ShieldAlert,
  KeyRound,
  Check
} from "lucide-react";

export default function VerifyOtpPage() {
  const router = useRouter();
  const {
    user,
    pendingApproval,
    isOtpVerified,
    sessionStatus,
    activeOtpEmail,
    activeOtpCode,
    requestOtpForUser,
    verifyOtpCode,
    signOut,
    changeAccount,
  } = useAuth();

  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [trustDevice, setTrustDevice] = useState(true);
  const [shake, setShake] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // Timers: 5-minute expiry countdown & 30-second resend cooldown
  const [expirySeconds, setExpirySeconds] = useState(300); // 5 mins
  const [resendCooldown, setResendCooldown] = useState(30); // 30s
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Calculate masked email
  const displayEmail = user?.email || activeOtpEmail || "kakadesaurabh18@gmail.com";
  const maskedEmail = (() => {
    if (!displayEmail.includes("@")) return displayEmail;
    const [local, domain] = displayEmail.split("@");
    if (local.length <= 2) return `${local[0]}****@${domain}`;
    return `${local[0]}****${local[local.length - 1]}@${domain}`;
  })();

  // Direct access: redirect immediately to Home Dashboard
  useEffect(() => {
    router.replace("/");
  }, [router]);

  // Initial focus on first input box
  useEffect(() => {
    setTimeout(() => {
      inputsRef.current[0]?.focus();
    }, 200);
  }, []);

  // 5-minute OTP expiration timer
  useEffect(() => {
    if (expirySeconds <= 0) {
      setIsExpired(true);
      setErrorMsg("Security code expired. Please request a new OTP.");
      return;
    }
    const timer = setInterval(() => {
      setExpirySeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [expirySeconds]);

  // 30-second Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Lockout countdown timer if locked
  useEffect(() => {
    if (lockoutSeconds <= 0) {
      if (isLocked) setIsLocked(false);
      return;
    }
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds, isLocked]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  // Handle individual digit input
  const handleDigitChange = (index: number, value: string) => {
    // Handle paste or multi-character input
    if (value.length > 1) {
      const cleaned = value.replace(/\D/g, "").slice(0, 6);
      if (cleaned.length > 0) {
        const newDigits = [...otpDigits];
        for (let i = 0; i < 6; i++) {
          newDigits[i] = cleaned[i] || "";
        }
        setOtpDigits(newDigits);
        const nextIdx = Math.min(cleaned.length, 5);
        inputsRef.current[nextIdx]?.focus();

        if (cleaned.length === 6) {
          executeVerification(cleaned);
        }
        return;
      }
    }

    const digit = value.slice(-1).replace(/\D/g, "");
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setErrorMsg("");

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // Auto submit when all 6 digits filled
    const completeOtp = newDigits.join("");
    if (completeOtp.length === 6 && !newDigits.includes("")) {
      executeVerification(completeOtp);
    }
  };

  // Handle backspace and arrow navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle paste directly into the box container
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();

    if (pasted.length === 6) {
      executeVerification(pasted);
    }
  };

  // Execute OTP verification
  const executeVerification = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join("");
    if (code.length < 6) {
      setErrorMsg("Please enter the complete 6-digit security code.");
      triggerShake();
      return;
    }

    if (isExpired) {
      setErrorMsg("This code has expired. Please click 'Resend OTP'.");
      triggerShake();
      return;
    }

    if (isLocked) {
      setErrorMsg(`Account temporarily locked. Please wait ${Math.ceil(lockoutSeconds / 60)} minutes.`);
      triggerShake();
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await verifyOtpCode(code, trustDevice);
      if (res.success) {
        setSuccessMsg(res.message || "OTP Verified! Access granted.");
        setTimeout(() => {
          router.replace("/");
        }, 600);
      } else {
        triggerShake();
        setErrorMsg(res.message || "Incorrect code. Please try again.");
        if (res.isLockedOut) {
          setIsLocked(true);
          setLockoutSeconds(15 * 60);
        }
      }
    } catch (err: any) {
      triggerShake();
      setErrorMsg(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP with rate limit & cooldown
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLocked) return;

    setResending(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await requestOtpForUser(displayEmail);
      if (res.success) {
        setOtpDigits(["", "", "", "", "", ""]);
        setExpirySeconds(300);
        setResendCooldown(30);
        setIsExpired(false);
        setSuccessMsg("A fresh 6-digit code has been dispatched to your Gmail.");
        setTimeout(() => inputsRef.current[0]?.focus(), 150);
      } else {
        setErrorMsg(res.message || "Failed to resend code.");
        if (res.cooldownRemaining) {
          setResendCooldown(res.cooldownRemaining);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Unable to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  // Format MM:SS for countdown timer
  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(Math.max(0, totalSecs) / 60);
    const secs = Math.max(0, totalSecs) % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Dynamic luxury glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-amber-500/12 via-accent/10 to-transparent rounded-full blur-[130px] pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between max-w-5xl w-full mx-auto z-10">
        <BrandLogo size="md" asLink={false} />
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            2-Step Identity Verification
          </span>
        </div>
      </div>

      {/* Main OTP Container Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10 py-6">
        <div
          className={`bg-card border border-border/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden transition-transform duration-200 ${
            shake ? "animate-shake" : ""
          }`}
        >
          {/* Top Lock Badge & Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 mb-1 text-amber-400 shadow-md shadow-amber-500/10">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Enter Security Code
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-accent/90 italic tracking-wide">
              &ldquo;{TAGLINE}&rdquo;
            </p>
          </div>

          {/* Subtext with Masked Email */}
          <div className="bg-surface/80 border border-border rounded-2xl p-3.5 mb-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted font-medium">
              <Mail className="w-3.5 h-3.5 text-accent" />
              <span>6-digit OTP sent to your registered Gmail</span>
            </div>
            <div className="font-mono font-bold text-sm text-foreground tracking-wide">
              {maskedEmail}
            </div>
          </div>

          {/* Instant Security OTP Toast / DEV Assist Banner */}
          {activeOtpCode && (
            <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/20 to-amber-500/10 border border-amber-500/35 flex items-center justify-between animate-in fade-in shadow-lg shadow-amber-500/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted block font-bold uppercase tracking-wider">
                    Instant Security Code
                  </span>
                  <span className="font-mono font-black text-amber-300 text-base tracking-widest">
                    {activeOtpCode}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const chars = activeOtpCode.split("");
                  setOtpDigits(chars);
                  executeVerification(activeOtpCode);
                }}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-black text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Tap Fill</span>
              </button>
            </div>
          )}

          {/* 6 Digit Input Boxes */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeVerification();
            }}
            className="space-y-5"
            onPaste={handlePaste}
          >
            <div className="flex items-center justify-center gap-2 sm:gap-2.5">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputsRef.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={idx === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  disabled={loading || isLocked}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  aria-label={`Digit ${idx + 1}`}
                  className={`w-11 h-14 sm:w-12 sm:h-14 rounded-2xl bg-surface border-2 text-center text-xl sm:text-2xl font-mono font-black text-foreground focus:outline-none transition-all ${
                    errorMsg
                      ? "border-rose-500/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      : digit
                      ? "border-amber-500/60 shadow-sm shadow-amber-500/10"
                      : "border-border focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
                  } disabled:opacity-50`}
                />
              ))}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center gap-2 text-xs font-bold text-rose-400 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center gap-2 text-xs font-bold text-emerald-400 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Timer and Expiration Warning */}
            <div className="flex items-center justify-between text-xs px-1">
              <div className="flex items-center gap-1.5 text-muted">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Code expires in:</span>
                <span className={`font-mono font-bold ${expirySeconds < 60 ? "text-rose-400 animate-pulse" : "text-amber-400"}`}>
                  {formatTimer(expirySeconds)}
                </span>
              </div>

              {/* Resend OTP button */}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || resending || isLocked}
                className="font-bold text-amber-400 hover:text-amber-300 disabled:text-muted disabled:opacity-50 transition-colors flex items-center gap-1"
              >
                <RotateCcw className={`w-3 h-3 ${resending ? "animate-spin" : ""}`} />
                <span>
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : resending
                    ? "Sending..."
                    : "Resend OTP"}
                </span>
              </button>
            </div>

            {/* Trust this device checkbox */}
            <div className="pt-2 border-t border-border/80">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs select-none">
                <input
                  type="checkbox"
                  checked={trustDevice}
                  onChange={(e) => setTrustDevice(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-amber-500 focus:ring-amber-400/30 accent-amber-500 cursor-pointer"
                />
                <span className="text-foreground/90 font-medium">
                  Trust this device for 30 days (Skip OTP on next login)
                </span>
              </label>
            </div>

            {/* Submit Verification Button */}
            <button
              type="submit"
              disabled={loading || isLocked || otpDigits.join("").length < 6}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Verify OTP &amp; Unlock Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Change Account / Return to Login Link */}
          <div className="mt-6 pt-4 border-t border-border text-center">
            <button
              type="button"
              onClick={async () => {
                await changeAccount();
                router.replace("/login");
              }}
              className="text-xs font-semibold text-muted hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Change Account / Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl w-full mx-auto text-center text-xs text-muted z-10 space-y-1">
        <p className="font-semibold text-foreground">
          {COMPANY_NAME} • {PARENT_COMPANY}
        </p>
        <p className="text-[11px] text-subtle">
          Confidential Vehicle Finance Internal Reference Portal. 256-Bit Financial Encryption Active.
        </p>
      </div>
    </div>
  );
}
