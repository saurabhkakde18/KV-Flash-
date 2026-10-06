"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Lock,
  ShieldCheck,
  Mail,
  CheckCircle2,
  AlertTriangle,
  X,
  RotateCcw,
  Sparkles,
  LogOut,
  Zap
} from "lucide-react";

export function SignOutLockModal() {
  const {
    user,
    isSignOutLockModalOpen,
    closeSignOutLockModal,
    activeSignOutOtp,
    requestSignOutOtp,
    verifySignOutOtp,
    instantSignOut
  } = useAuth();

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [copied, setCopied] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isSignOutLockModalOpen) {
      setOtpDigits(["", "", "", "", "", ""]);
      setErrorMsg("");
      setSuccessMsg("");
      setTimer(30);
      setCopied(false);
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    }
  }, [isSignOutLockModalOpen]);

  useEffect(() => {
    let interval: any;
    if (isSignOutLockModalOpen && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isSignOutLockModalOpen, timer]);

  if (!isSignOutLockModalOpen) return null;

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Paste handling for 6 digits
      const cleaned = value.replace(/\D/g, "").slice(0, 6);
      if (cleaned.length > 0) {
        const newDigits = [...otpDigits];
        for (let i = 0; i < 6; i++) {
          newDigits[i] = cleaned[i] || "";
        }
        setOtpDigits(newDigits);
        inputsRef.current[Math.min(cleaned.length, 5)]?.focus();
        return;
      }
    }

    const digit = value.slice(-1).replace(/\D/g, "");
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto advance focus
    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const entered = otpDigits.join("");
    if (entered.length < 6) {
      setErrorMsg("Please enter all 6 digits of your security code.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    const res = await verifySignOutOtp(entered);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setLoading(true);
    const res = await requestSignOutOtp();
    setLoading(false);
    setTimer(30);
    setErrorMsg("");
    setOtpDigits(["", "", "", "", "", ""]);
    inputsRef.current[0]?.focus();
  };

  const handleCopyOtp = () => {
    if (activeSignOutOtp) {
      navigator.clipboard.writeText(activeSignOutOtp);
      setCopied(true);
      // Auto fill
      const chars = activeSignOutOtp.split("");
      setOtpDigits(chars);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-card border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeSignOutLockModal}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-surface border border-border text-muted hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Header */}
        <div className="text-center space-y-2 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <Lock className="w-7 h-7 animate-pulse" />
          </div>
          <h3 className="text-lg font-black text-foreground tracking-tight">
            Sign Out Security Lock
          </h3>
          <p className="text-xs text-muted max-w-xs mx-auto">
            To securely lock your field session, verify with the 6-digit security code sent to{" "}
            <strong className="text-foreground">{user?.email || "your Gmail"}</strong>.
          </p>
        </div>

        {/* Live Gmail OTP Simulation Toast */}
        {activeSignOutOtp && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-muted block font-semibold uppercase">
                  Gmail Security Alert
                </span>
                <span className="font-mono font-black text-amber-300 text-sm tracking-widest">
                  {activeSignOutOtp}
                </span>
              </div>
            </div>
            <button
              onClick={handleCopyOtp}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold text-[11px] transition-colors"
            >
              {copied ? "Copied!" : "Auto-Fill PIN"}
            </button>
          </div>
        )}

        {/* 6-Digit PIN Inputs */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="flex items-center justify-center gap-2 sm:gap-2.5">
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 sm:w-12 sm:h-14 rounded-2xl bg-surface border-2 border-border focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25 text-center text-xl font-mono font-black text-foreground focus:outline-none transition-all"
              />
            ))}
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 text-center font-bold flex items-center justify-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {errorMsg}
            </p>
          )}

          {successMsg && (
            <p className="text-xs text-emerald-400 text-center font-bold flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {successMsg}
            </p>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={loading || otpDigits.join("").length < 6}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <LogOut className="w-4 h-4" />
              <span>{loading ? "Verifying..." : "Verify OTP & Secure Sign Out"}</span>
            </button>

            <div className="flex items-center justify-between pt-1 text-[11px] text-muted">
              <button
                type="button"
                onClick={handleResend}
                disabled={timer > 0}
                className="hover:text-amber-400 font-semibold disabled:opacity-50 transition-colors"
              >
                {timer > 0 ? `Resend code in ${timer}s` : "Resend Security Code"}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm("Execute Emergency Instant Sign Out?")) {
                    instantSignOut();
                  }
                }}
                className="text-rose-400 hover:text-rose-300 font-bold transition-colors"
              >
                Instant Force Lock
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
