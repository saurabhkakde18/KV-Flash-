"use client";

import React, { useState } from "react";
import { BrandLogo } from "../common/BrandLogo";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useData } from "@/context/DataContext";
import {
  Search,
  Palette,
  Wifi,
  WifiOff,
  Bell,
  Shield,
  Lock,
  User as UserIcon,
  Sparkles,
  Layers,
  LogOut
} from "lucide-react";
import { GlobalSearchModal } from "./GlobalSearchModal";
import { ThemeSelector } from "../common/ThemeSelector";
import Link from "next/link";

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const { isOffline, circularsData } = useData();
  const [searchOpen, setSearchOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);

  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-card/85 backdrop-blur-md border-b border-border transition-colors">
        {/* Offline Banner */}
        {isOffline && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-500 px-4 py-1.5 text-xs font-semibold flex items-center justify-center gap-2">
            <WifiOff className="w-3.5 h-3.5 animate-pulse" />
            <span>Working Offline • Viewing cached KV Flash records & rate sheets</span>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo & Greeting */}
          <div className="flex items-center gap-3">
            <BrandLogo size="md" />
            <div className="hidden lg:block h-6 w-px bg-border mx-1" />
            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-semibold text-foreground">
                Namaste, {user?.displayName?.split(" ")[0] || "Officer"}
              </span>
              <span className="text-[11px] text-muted">{todayStr}</span>
            </div>
          </div>

          {/* Center Dedicated Vehicle Search Bar Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex-1 max-w-lg mx-2 hidden sm:flex items-center justify-between px-3.5 py-2 rounded-2xl bg-surface border border-border hover:border-accent/50 text-muted hover:text-foreground transition-all shadow-sm group hover:shadow-md hover:shadow-accent/5"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-6 h-6 rounded-lg bg-accent-muted flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <Search className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs sm:text-sm font-medium truncate text-foreground/80 group-hover:text-foreground">
                Search Vehicle (Swift, Creta, Bolero, Tata 407, AL 2820, Eicher)...
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-card border border-border text-accent">
                250+ Vehicles
              </span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-border text-subtle">
                ⌘K
              </kbd>
            </div>
          </button>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Mobile Vehicle Search Icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden p-2 rounded-xl bg-surface border border-border text-accent hover:text-foreground"
              aria-label="Search Vehicles"
              title="Search Vehicles"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Theme Picker Trigger */}
            <button
              onClick={() => setThemeModalOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-surface border border-border hover:border-accent/50 text-muted hover:text-foreground flex items-center gap-2 text-xs font-semibold transition-all group"
              title="Switch Visual Theme"
            >
              <Palette className="w-4 h-4 text-accent group-hover:rotate-12 transition-transform" />
              <span className="hidden md:inline font-bold">Theme</span>
            </button>

            {/* Circulars Bell */}
            <Link
              href="/circulars"
              className="relative p-2 rounded-xl bg-surface border border-border hover:border-accent/40 text-muted hover:text-foreground transition-colors"
              title="Circulars & Updates"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-black text-white">
                {circularsData.filter(c => c.isNew).length || 3}
              </span>
            </Link>

            {/* Admin Badge with Lock Icon */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black hover:bg-amber-500/25 shadow-sm shadow-amber-500/10 transition-all group"
                title="Admin Control Center (Secured)"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Admin</span>
              </Link>
            )}

            {/* Profile Avatar */}
            <Link
              href="/profile"
              className="flex items-center gap-2 pl-1 group"
              title="Profile & Settings"
            >
              <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-accent font-bold text-xs ring-2 ring-transparent group-hover:ring-accent/40 transition-all">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
            </Link>

            {/* Direct Sign Out Button */}
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-all cursor-pointer shadow-sm"
              title="Sign Out Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Theme Modal */}
      {themeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-card border border-border rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setThemeModalOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-foreground p-1 rounded-lg"
            >
              ✕
            </button>
            <ThemeSelector onClose={() => setThemeModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
