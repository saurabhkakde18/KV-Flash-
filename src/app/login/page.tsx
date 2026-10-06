"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Lock,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  Zap,
  Sparkles
} from "lucide-react";

export default function LoginPage() {
  const {
    user,
    isOtpVerified,
    loginAsAdmin,
  } = useAuth();

  const [empCode, setEmpCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // Direct access: redirect to dashboard if already authenticated
  useEffect(() => {
    if (user && isOtpVerified) {
      router.replace("/");
    }
  }, [user, isOtpVerified, router]);

  const handleOfficerUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const code = empCode.trim().toUpperCase();
    const pass = password.trim();

    // Enforce credentials: ID = KV0001 and Password = 0007
    if (code !== "KV0001" || pass !== "0007") {
      setTimeout(() => {
        setLoading(false);
        setErrorMsg("Invalid Employee Code or Password. Access Denied.");
      }, 300);
      return;
    }

    // Authenticate exclusively as Admin Officer (KV0001)
    setTimeout(() => {
      loginAsAdmin("KV0001");
      setLoading(false);
      router.push("/");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#070D1C] text-foreground flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-300">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-b from-sky-600/10 via-amber-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      <div className="w-full max-w-[430px] flex flex-col items-center z-10 my-auto">
        {/* Top Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="font-serif font-black text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 drop-shadow-[0_2px_12px_rgba(245,158,11,0.35)]">
              KV
            </span>
            <span className="text-sky-300 font-bold text-xl sm:text-2xl tracking-[0.35em] ml-1 font-sans">
              FLASH
            </span>
          </div>

          <p className="text-sky-200/90 text-xs sm:text-[13px] font-medium tracking-wide mt-2">
            You&apos;re one step closer to what you want
          </p>

          {/* Security Protocol Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1527] border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)] mt-5 mb-5">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse shrink-0" />
            <span className="text-slate-400 font-mono text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
              SECURITY PROTOCOL
            </span>
            <span className="text-amber-400 font-mono text-[11px] sm:text-[12px] font-bold tracking-wide">
              Authorized Officer Terminal
            </span>
          </div>
        </div>

        {/* Main Authentication Card */}
        <div className="w-full bg-[#111726]/95 border border-[#222E46] rounded-[24px] p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative">
          {/* Card Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <h2 className="font-serif font-bold text-sm sm:text-base tracking-wider text-white uppercase">
                OFFICER AUTHENTICATION
              </h2>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed pl-6">
              Enter your assigned Employee Code and Password to unlock.
            </p>
          </div>

          <div className="h-px bg-slate-800/80 my-4" />

          {/* Form */}
          <form onSubmit={handleOfficerUnlock} className="space-y-4">
            {/* Field 1: Employee Code */}
            <div>
              <label className="flex items-center gap-2 text-slate-300 font-bold text-[11px] tracking-wider uppercase mb-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>EMPLOYEE CODE</span>
              </label>
              <input
                type="text"
                value={empCode}
                onChange={(e) => setEmpCode(e.target.value.toUpperCase())}
                placeholder="e.g. KV0001"
                className="w-full bg-[#0A0E18] border border-[#232F48] focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-4 py-3 text-white font-mono text-sm tracking-wider placeholder:text-slate-600 outline-none transition-all shadow-inner"
              />
            </div>

            {/* Field 2: Password */}
            <div>
              <label className="flex items-center gap-2 text-slate-300 font-bold text-[11px] tracking-wider uppercase mb-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>PASSWORD</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0A0E18] border border-[#232F48] focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-4 py-3 pr-11 text-white font-mono text-sm tracking-wider placeholder:text-slate-600 outline-none transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errorMsg}
              </p>
            )}

            {/* Submit Unlock Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-[0_4px_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Unlocking Terminal..." : "Unlock KV FLASH"}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Footer inside card */}
          <div className="mt-6 pt-4 border-t border-slate-800/70 text-center flex flex-col items-center">
            <div className="flex items-center justify-center flex-wrap gap-1 text-xs">
              <span className="text-slate-400">Designed &amp; Built by</span>
              <span className="text-amber-400 font-bold">Akshay Sonawane</span>
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-amber-500/15 border border-amber-500/40 text-amber-400 rounded">
                KV0067
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-mono text-slate-500 mt-1.5 tracking-tight text-center">
              Internal Policy Desk &amp; Commercial Vehicle Valuation Grid
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
