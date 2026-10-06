"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { MODULES_LIST } from "@/lib/constants";
import {
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
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
  Bookmark,
  Layers,
  ChevronRight
} from "lucide-react";
import { GlobalSearchModal } from "@/components/layout/GlobalSearchModal";

export default function DashboardPage() {
  const { user } = useAuth();
  const { favorites, toggleFavorite, recentlyViewed, circularsData } = useData();
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Rates & Matrix", "Grids & Valuations", "Policies", "Tools & Utilities", "Operations & Leads"];

  const iconMap: { [key: string]: React.ReactNode } = {
    "iir-matrix": <Percent className="w-5 h-5 text-amber-500" />,
    "dsa-payout": <Wallet className="w-5 h-5 text-emerald-500" />,
    "cv-policy": <Truck className="w-5 h-5 text-blue-500" />,
    "car-policy": <Car className="w-5 h-5 text-purple-500" />,
    "cv-grid": <Grid className="w-5 h-5 text-cyan-500" />,
    "bolero-grid": <ShieldCheck className="w-5 h-5 text-orange-500" />,
    "charges": <Receipt className="w-5 h-5 text-rose-500" />,
    "calculator": <Calculator className="w-5 h-5 text-emerald-400" />,
    "documents": <FileCheck className="w-5 h-5 text-indigo-400" />,
    "circulars": <BellRing className="w-5 h-5 text-red-400" />,
    "leads": <Users className="w-5 h-5 text-yellow-400" />,
    "contacts": <PhoneCall className="w-5 h-5 text-teal-400" />,
  };

  const filteredModules = selectedCategory === "All"
    ? MODULES_LIST
    : MODULES_LIST.filter(m => m.category === selectedCategory);

  const favoriteModules = MODULES_LIST.filter(m => favorites.includes(m.id));
  const recentModules = recentlyViewed.map(id => MODULES_LIST.find(m => m.id === id)).filter(Boolean) as typeof MODULES_LIST;

  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Greeting & Quick Stats */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-card via-surface to-card border border-border p-6 sm:p-8 shadow-soft">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-accent-muted text-accent border border-accent/20">
                <Zap className="w-3 h-3 fill-accent" /> Field Officer Desk
              </span>
              <span className="text-xs text-muted font-medium">{todayFormatted}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome, {user?.displayName || "Loan Officer"}
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-xl">
              Instant access to Kredit Venture vehicle valuations, IIR matrix, DSA payouts, and credit policy rules.
            </p>
          </div>

          {/* Quick Calculator Action Box */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/calculator"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-accent text-white font-bold text-sm hover:bg-accent-hover transition-all shadow-medium hover:scale-[1.02]"
            >
              <Calculator className="w-4 h-4" />
              <span>Fast EMI Calculator</span>
            </Link>
            <Link
              href="/bolero-grid"
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-surface border border-border hover:border-accent/40 text-foreground font-semibold text-sm hover:bg-elevated transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>Bolero Check</span>
            </Link>
          </div>
        </div>

        {/* Live Key Highlights Pill Row */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border/60">
          <div className="bg-surface/60 rounded-xl p-3 border border-border/40">
            <span className="text-[11px] text-muted block font-medium">Starting WIRR</span>
            <span className="text-lg font-black text-foreground tabular-nums">16.00%</span>
            <span className="text-[10px] text-emerald-500 font-semibold block">Used Cars & SCV</span>
          </div>
          <div className="bg-surface/60 rounded-xl p-3 border border-border/40">
            <span className="text-[11px] text-muted block font-medium">Max DSA Payout</span>
            <span className="text-lg font-black text-foreground tabular-nums">4.25%</span>
            <span className="text-[10px] text-accent font-semibold block">&gt; ₹ 20L Volume Slabs</span>
          </div>
          <div className="bg-surface/60 rounded-xl p-3 border border-border/40">
            <span className="text-[11px] text-muted block font-medium">Branch Approval Cap</span>
            <span className="text-lg font-black text-foreground tabular-nums">₹ 100 Lakhs</span>
            <span className="text-[10px] text-purple-400 font-semibold block">Empowered TAT</span>
          </div>
          <div className="bg-surface/60 rounded-xl p-3 border border-border/40">
            <span className="text-[11px] text-muted block font-medium">Max Pickup LTV</span>
            <span className="text-lg font-black text-foreground tabular-nums">95.00%</span>
            <span className="text-[10px] text-amber-500 font-semibold block">Captive Profile</span>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Global Quick Search Bar */}
      <div className="relative">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border border-border hover:border-accent/40 text-left transition-all shadow-soft group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent-muted text-accent">
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Global Knowledge & Rate Search</p>
              <p className="text-xs text-muted">Type &ldquo;Bolero 2023&rdquo;, &ldquo;Tata 407&rdquo;, &ldquo;DSA slab 18%&rdquo;, &ldquo;Valuation charge&rdquo;...</p>
            </div>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-muted bg-surface border border-border rounded-lg">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Favorites (Pinned Modules) Section */}
      {favoriteModules.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <h2 className="text-base font-bold text-foreground">Pinned Favorites</h2>
            </div>
            <span className="text-xs text-muted font-medium">{favoriteModules.length} Pinned</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {favoriteModules.map((mod) => (
              <Link
                key={mod.id}
                href={mod.href}
                className="p-4 rounded-2xl bg-card border border-border hover:border-accent/40 hover:bg-surface/50 transition-all flex flex-col justify-between group relative shadow-soft"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-surface border border-border/60">
                    {iconMap[mod.id]}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(mod.id);
                    }}
                    className="text-amber-400 p-1 hover:scale-110 transition-transform"
                    title="Unpin"
                  >
                    <Star className="w-4 h-4 fill-amber-400" />
                  </button>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-accent transition-colors truncate">
                    {mod.title}
                  </h3>
                  <span className="text-[10px] text-muted font-medium block mt-0.5 truncate">
                    Updated: {mod.lastUpdated}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Row */}
      {recentModules.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted" />
            <h2 className="text-base font-bold text-foreground">Recently Viewed</h2>
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {recentModules.map((mod) => (
              <Link
                key={mod.id}
                href={mod.href}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-border hover:border-accent/30 text-xs font-semibold text-foreground shrink-0 hover:bg-card transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>{mod.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted ml-1" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Main 12 Modules Grid */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black tracking-tight text-foreground">All Reference Modules</h2>
            <p className="text-xs text-muted">Complete master tables, calculators, and operational guidelines</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-accent text-white shadow-soft"
                    : "bg-surface text-muted hover:text-foreground hover:bg-card border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((mod) => {
            const isPinned = favorites.includes(mod.id);

            return (
              <Link
                key={mod.id}
                href={mod.href}
                className="p-5 rounded-2xl bg-card border border-border hover:border-accent/40 hover:shadow-medium transition-all flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-surface border border-border/80 group-hover:scale-105 transition-transform">
                      {iconMap[mod.id]}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {mod.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-muted text-accent border border-accent/20">
                          {mod.badge}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(mod.id);
                        }}
                        className="p-1 text-muted hover:text-amber-400 transition-colors"
                        title={isPinned ? "Unpin Favorite" : "Pin Favorite"}
                      >
                        <Star className={`w-4 h-4 ${isPinned ? "fill-amber-400 text-amber-400" : ""}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-foreground group-hover:text-accent transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">
                    {mod.shortDesc}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50 text-xs">
                  <span className="text-[11px] text-subtle font-medium">
                    Updated: <strong className="text-muted">{mod.lastUpdated}</strong>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-accent group-hover:translate-x-1 transition-transform">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
