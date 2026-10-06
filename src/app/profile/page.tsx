"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { ThemeSelector } from "@/components/common/ThemeSelector";
import {
  User,
  Shield,
  LogOut,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2
} from "lucide-react";

export default function ProfilePage() {
  const { user, signOut, isAdmin } = useAuth();

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-accent-muted text-accent border border-accent/20">
            <User className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-accent">User Account</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Field Officer Profile &amp; Preferences
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Session security, active branch assignment, and visual appearance themes.
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-surface border border-border flex items-center justify-center font-black text-accent text-2xl shadow-soft">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">{user?.displayName || "Field User"}</h2>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  user?.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                  user?.role === 'staff' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {user?.role?.toUpperCase() || 'VIEWER'}
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-colors self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-surface border border-border/60">
            <span className="text-muted block text-[11px] mb-1">Branch Location</span>
            <span className="font-bold text-foreground">{user?.branch || "Pune Central Hub"}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface border border-border/60">
            <span className="text-muted block text-[11px] mb-1">Session Security</span>
            <span className="font-bold text-emerald-400">Active (30-Day Persist)</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface border border-border/60">
            <span className="text-muted block text-[11px] mb-1">Role Permissions</span>
            <span className="font-bold text-foreground">
              {isAdmin ? "Full Admin & Data Edit" : "Rate Quotes & Field CRM"}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Theme Selection */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-soft space-y-4">
        <ThemeSelector />
      </div>
    </div>
  );
}
