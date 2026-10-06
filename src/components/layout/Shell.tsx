"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "./Header";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { BrandLogo } from "../common/BrandLogo";
import {
  Home,
  Percent,
  Wallet,
  Truck,
  Car,
  Grid,
  ShieldCheck,
  Receipt,
  Calculator,
  FileCheck,
  BellRing,
  Users,
  PhoneCall,
  Search,
  Star,
  User,
  Shield,
  Layers,
  LogOut,
  ChevronRight,
  Sparkles,
  Lock,
  Clock
} from "lucide-react";
import { MODULES_LIST } from "@/lib/constants";
import { GlobalSearchModal } from "./GlobalSearchModal";

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, sessionStatus, isOtpVerified, isAllowlisted, pendingApproval, signOut, switchDemoUser, isAdmin } = useAuth();
  const { favorites } = useData();
  const [searchOpen, setSearchOpen] = useState(false);

  // Route protection rules:
  useEffect(() => {
    if (loading) return;

    if (!user && pathname !== "/login") {
      router.replace("/login");
    } else if (user && pathname === "/verify-otp") {
      router.replace("/");
    }
  }, [user, loading, pathname, router]);

  // Auth pages render clean without the application shell
  if (pathname === "/login") {
    return <main className="min-h-screen">{children}</main>;
  }

  // If unauthenticated on protected route
  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-xs text-muted font-medium">Securing session...</p>
        </div>
      </div>
    );
  }

  // If access pending approval by admin
  if (pendingApproval || (user && !isAllowlisted)) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mb-5">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <BrandLogo size="lg" asLink={false} />
          <h2 className="text-xl font-black mt-4 text-foreground">Access Pending Approval</h2>
          <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
            Your email <strong className="text-foreground">{user?.email}</strong> is registered. A KV Flash administrator needs to pre-approve your account before access is granted.
          </p>

          <div className="w-full bg-surface border border-border rounded-2xl p-4 mt-6 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-muted">Account Status:</span>
              <span className="font-bold text-amber-500 uppercase tracking-wider">Pending Review</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Role Assigned:</span>
              <span className="font-semibold text-foreground">Viewer / Partner</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 w-full mt-6">
            <button
              onClick={() => signOut()}
              className="w-full py-2.5 px-4 rounded-xl bg-accent text-white font-bold text-xs hover:bg-accent-hover transition-colors shadow-soft flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navIconMap: { [key: string]: React.ReactNode } = {
    "iir-matrix": <Percent className="w-4 h-4" />,
    "dsa-payout": <Wallet className="w-4 h-4" />,
    "cv-policy": <Truck className="w-4 h-4" />,
    "car-policy": <Car className="w-4 h-4" />,
    "cv-grid": <Grid className="w-4 h-4" />,
    "bolero-grid": <ShieldCheck className="w-4 h-4" />,
    "charges": <Receipt className="w-4 h-4" />,
    "calculator": <Calculator className="w-4 h-4" />,
    "documents": <FileCheck className="w-4 h-4" />,
    "circulars": <BellRing className="w-4 h-4" />,
    "leads": <Users className="w-4 h-4" />,
    "contacts": <PhoneCall className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      <Header />

      <div className="max-w-7xl w-full mx-auto flex-1 flex">
        {/* Desktop Left Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-border bg-surface/30 shrink-0 p-4 space-y-6">
          {/* Main Navigation List */}
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted flex items-center justify-between">
              <span>Navigation</span>
              <span className="text-[10px] text-accent font-semibold">{MODULES_LIST.length} Modules</span>
            </div>

            <Link
              href="/"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                pathname === "/"
                  ? "bg-accent text-white shadow-soft"
                  : "text-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Dashboard Home</span>
            </Link>

            <Link
              href="/calculator"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                pathname === "/calculator"
                  ? "bg-accent text-white shadow-soft"
                  : "text-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              <Calculator className="w-4 h-4 shrink-0" />
              <span>EMI & Eligibility</span>
            </Link>

            <Link
              href="/compare"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                pathname === "/compare"
                  ? "bg-accent text-white shadow-soft"
                  : "text-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Compare Tool</span>
            </Link>
          </div>

          {/* All Modules Accordion */}
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
              Reference Modules
            </div>
            <div className="max-h-[380px] overflow-y-auto space-y-0.5 pr-1">
              {MODULES_LIST.map((mod) => {
                const isActive = pathname === mod.href;
                const isPinned = favorites.includes(mod.id);

                return (
                  <Link
                    key={mod.id}
                    href={mod.href}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? "bg-accent-muted text-accent font-bold border border-accent/20"
                        : "text-muted hover:text-foreground hover:bg-surface/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={isActive ? "text-accent" : "text-muted group-hover:text-foreground"}>
                        {navIconMap[mod.id] || <Sparkles className="w-3.5 h-3.5" />}
                      </span>
                      <span className="truncate">{mod.title}</span>
                    </div>
                    {isPinned && <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Demo Switcher / User Profile Card */}
          <div className="mt-auto pt-4 border-t border-border space-y-3">
            <div className="bg-card border border-border rounded-2xl p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Active Role</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  user?.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                  user?.role === 'staff' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {user?.role || 'viewer'}
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground truncate mt-1">{user?.displayName || "Loan Officer"}</p>
              <p className="text-[10px] text-muted truncate">{user?.email}</p>

              {/* Quick switch demo button */}
              <div className="grid grid-cols-3 gap-1 mt-2.5 pt-2 border-t border-border/50 text-[10px] font-semibold text-center">
                <button
                  onClick={() => switchDemoUser("admin")}
                  className={`py-1 rounded border transition-colors ${user?.role === 'admin' ? 'bg-accent text-white border-accent' : 'bg-surface border-border text-muted hover:text-foreground'}`}
                >
                  Admin
                </button>
                <button
                  onClick={() => switchDemoUser("staff")}
                  className={`py-1 rounded border transition-colors ${user?.role === 'staff' ? 'bg-accent text-white border-accent' : 'bg-surface border-border text-muted hover:text-foreground'}`}
                >
                  Staff
                </button>
                <button
                  onClick={() => switchDemoUser("viewer")}
                  className={`py-1 rounded border transition-colors ${user?.role === 'viewer' ? 'bg-accent text-white border-accent' : 'bg-surface border-border text-muted hover:text-foreground'}`}
                >
                  Viewer
                </button>
              </div>
            </div>

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold hover:bg-purple-500/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Admin Data Manager</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (5 Primary Tabs) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <Link
          href="/"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors ${
            pathname === "/" ? "text-accent" : "text-muted hover:text-foreground"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </Link>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-semibold text-muted hover:text-foreground"
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span>Search</span>
        </button>

        <Link
          href="/calculator"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors ${
            pathname === "/calculator" ? "text-accent" : "text-muted hover:text-foreground"
          }`}
        >
          <div className="relative">
            <Calculator className="w-5 h-5 mb-0.5" />
          </div>
          <span>Calculator</span>
        </Link>

        <Link
          href="/leads"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors ${
            pathname === "/leads" ? "text-accent" : "text-muted hover:text-foreground"
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>Leads</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors ${
            pathname === "/profile" ? "text-accent" : "text-muted hover:text-foreground"
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </Link>
      </nav>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
