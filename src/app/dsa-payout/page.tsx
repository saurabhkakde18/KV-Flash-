"use client";

import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { ExportActions } from "@/components/common/ExportActions";
import { formatINR } from "@/lib/utils";
import { DSA_TERMS } from "@/lib/constants";
import {
  Wallet,
  Calculator,
  Percent,
  TrendingUp,
  FileCheck2,
  AlertTriangle,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Target
} from "lucide-react";

export default function DSAPayoutPage() {
  const { dsaData, addRecentlyViewed } = useData();

  // Calculator State
  const [calcProduct, setCalcProduct] = useState<"Used Car" | "Used CV" | "M&HCV / CE">("Used Car");
  const [calcLoanAmount, setCalcLoanAmount] = useState<number>(1200000);
  const [calcRate, setCalcRate] = useState<number>(18.5);
  const [monthlyVolume, setMonthlyVolume] = useState<number>(1800000);

  // Monthly Tracker State
  const [monthlyTarget, setMonthlyTarget] = useState<number>(2500000);
  const [achievedVolume, setAchievedVolume] = useState<number>(1800000);

  useEffect(() => {
    addRecentlyViewed("dsa-payout");
  }, []);

  // Determine Commission %
  let commissionPct = 0;
  const isOver20L = monthlyVolume >= 2000000;

  if (calcProduct === "M&HCV / CE") {
    commissionPct = 1.25;
  } else {
    const matchedSlab = dsaData.find(
      s => s.category === calcProduct && calcRate >= s.minWirr && calcRate <= s.maxWirr
    );
    if (matchedSlab) {
      commissionPct = isOver20L ? matchedSlab.payoutOver20Lacs : matchedSlab.payoutUnder20Lacs;
    } else {
      commissionPct = isOver20L ? 3.0 : 2.5;
    }
  }

  const grossCommission = Math.round((calcLoanAmount * commissionPct) / 100);
  const tdsDeduction = Math.round((grossCommission * 5) / 100); // 5% TDS for DSA under Section 194H
  const netCommission = grossCommission - tdsDeduction;

  const targetProgress = Math.min(100, Math.round((achievedVolume / monthlyTarget) * 100));

  const getExcelData = () => {
    return dsaData.map(item => ({
      Category: item.category,
      "WIRR Slab": item.wirrSlab,
      "Payout (< ₹20 Lacs Volume)": `${item.payoutUnder20Lacs}%`,
      "Payout (>= ₹20 Lacs Volume)": `${item.payoutOver20Lacs}%`,
      Notes: item.notes || "Excluding GST"
    }));
  };

  const getWhatsAppSummary = () => {
    return `*KV Flash - DSA Payout Calculation*\n` +
      `-----------------------------------------\n` +
      `💼 *Product:* ${calcProduct}\n` +
      `💰 *Loan Amount:* ${formatINR(calcLoanAmount)}\n` +
      `📈 *Customer WIRR:* ${calcRate}%\n` +
      `📊 *Monthly Volume Tier:* ${isOver20L ? ">= ₹20 Lakhs" : "< ₹20 Lakhs"}\n\n` +
      `💵 *DSA Payout Rate:* *${commissionPct.toFixed(2)}%*\n` +
      `🏷️ *Gross Commission:* ${formatINR(grossCommission)}\n` +
      `✂️ *TDS (5% u/s 194H):* ${formatINR(tdsDeduction)}\n` +
      `✅ *Net Bank Payout:* *${formatINR(netCommission)}*\n` +
      `-----------------------------------------\n` +
      `_Kredit Venture / Jads Services Pvt Ltd_`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Wallet className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Module 02</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            DSA Payout Policy & Calculator
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Volume-based channel commission grids, 5% TDS calculations, and monthly earnings tracker.
          </p>
        </div>

        <ExportActions
          title="KV Flash - DSA Payout Policy"
          moduleKey="dsa_payout"
          getDataForExcel={getExcelData}
          getWhatsAppText={getWhatsAppSummary}
        />
      </div>

      {/* Payout Calculator & Monthly Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Commission Calculator */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-accent" />
              <h2 className="text-base font-bold text-foreground">Channel Payout Calculator</h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Live Estimator
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted block mb-1.5">Product Segment</label>
              <select
                value={calcProduct}
                onChange={(e) => setCalcProduct(e.target.value as any)}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:border-accent"
              >
                <option value="Used Car">Used Car (16% to 22%+)</option>
                <option value="Used CV">Used CV / SCV / LCV</option>
                <option value="M&HCV / CE">M&HCV / CE (Flat 1.25%)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted block mb-1.5">Disbursed Loan Amount (₹)</label>
              <input
                type="number"
                value={calcLoanAmount}
                onChange={(e) => setCalcLoanAmount(Math.max(0, Number(e.target.value)))}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-foreground tabular-nums focus:outline-none focus:border-accent"
                step="50000"
              />
              <span className="text-[10px] text-muted mt-1 block">{formatINR(calcLoanAmount)}</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted block mb-1.5">Customer WIRR Rate (%)</label>
              <input
                type="number"
                value={calcRate}
                onChange={(e) => setCalcRate(Number(e.target.value))}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-foreground tabular-nums focus:outline-none focus:border-accent"
                step="0.25"
                min="14"
                max="26"
              />
              <span className="text-[10px] text-muted mt-1 block">Active Slab Rate</span>
            </div>
          </div>

          {/* Monthly Sourcing Volume Tier Radio */}
          <div className="bg-surface rounded-2xl p-4 border border-border/60">
            <label className="text-xs font-semibold text-muted block mb-2">Monthly DSA Total Volume Slab</label>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setMonthlyVolume(1500000)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  !isOver20L
                    ? "bg-card border-accent text-foreground ring-1 ring-accent/30 font-bold"
                    : "bg-surface border-border text-muted hover:text-foreground"
                }`}
              >
                <span className="block text-xs font-bold">Less than ₹ 20 Lakhs</span>
                <span className="text-[10px] text-muted mt-0.5 block">Standard Commission Slab</span>
              </button>
              <button
                type="button"
                onClick={() => setMonthlyVolume(2500000)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isOver20L
                    ? "bg-card border-accent text-foreground ring-1 ring-accent/30 font-bold"
                    : "bg-surface border-border text-muted hover:text-foreground"
                }`}
              >
                <span className="block text-xs font-bold">Greater than ₹ 20 Lakhs</span>
                <span className="text-[10px] text-emerald-400 mt-0.5 block">+0.25% Higher Slab Bonus</span>
              </button>
            </div>
          </div>

          {/* Output Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-surface via-card to-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Estimated DSA Commission</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-foreground tabular-nums">
                  {formatINR(netCommission)}
                </span>
                <span className="text-xs text-muted font-medium">Net Payout</span>
              </div>
              <p className="text-xs text-muted mt-1">
                Gross: <strong className="text-foreground">{formatINR(grossCommission)}</strong> ({commissionPct}% slab) • TDS 5%: <span className="text-rose-400 font-semibold">{formatINR(tdsDeduction)}</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-accent-muted border border-accent/30 text-center shrink-0 min-w-[120px]">
              <span className="text-[10px] uppercase font-bold text-muted block">Applied Slab</span>
              <span className="text-2xl font-black text-accent tabular-nums">{commissionPct}%</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Monthly Volume Goal Tracker */}
        <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
              <Target className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-bold text-foreground">Monthly Payout Target</h3>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted">Achieved Sourcing</span>
                  <span className="font-bold text-foreground tabular-nums">{formatINR(achievedVolume)}</span>
                </div>
                <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-emerald-400 transition-all duration-500 rounded-full"
                    style={{ width: `${targetProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted mt-1">
                  <span>0L</span>
                  <span>Target: {formatINR(monthlyTarget)}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-surface border border-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Target Progress:</span>
                  <span className="font-bold text-emerald-400">{targetProgress}% Completed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Remaining for ₹20L Slab:</span>
                  <span className="font-bold text-foreground">
                    {achievedVolume >= 2000000 ? "Unlocked 20L Slab! 🎉" : formatINR(2000000 - achievedVolume)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] leading-relaxed flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>PDD original RC & Insurance must be submitted within 60 days to prevent payout hold.</span>
          </div>
        </div>
      </div>

      {/* Slabs Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Used Car Table */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft">
          <div className="p-4 bg-surface border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground">DSA Used (Car) Payout Grid</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-muted text-accent">Cars Slabs</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface/50 border-b border-border text-muted font-bold text-[10px] uppercase">
                <th className="p-3">WIRR Slab</th>
                <th className="p-3 text-center">&lt; ₹20 Lacs Volume</th>
                <th className="p-3 text-center">&gt; ₹20 Lacs Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {dsaData.filter(d => d.category === "Used Car").map((row) => (
                <tr key={row.id} className="hover:bg-surface/40 transition-colors">
                  <td className="p-3 font-bold text-foreground">{row.wirrSlab}</td>
                  <td className="p-3 text-center tabular-nums font-bold text-muted">{row.payoutUnder20Lacs}%</td>
                  <td className="p-3 text-center tabular-nums font-black text-emerald-400">{row.payoutOver20Lacs}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Used CV Table */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft">
          <div className="p-4 bg-surface border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground">DSA Used (CV) Payout Grid</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-muted text-accent">CV Slabs</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface/50 border-b border-border text-muted font-bold text-[10px] uppercase">
                <th className="p-3">WIRR Slab</th>
                <th className="p-3 text-center">&lt; ₹20 Lacs Volume</th>
                <th className="p-3 text-center">&gt; ₹20 Lacs Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {dsaData.filter(d => d.category === "Used CV").map((row) => (
                <tr key={row.id} className="hover:bg-surface/40 transition-colors">
                  <td className="p-3 font-bold text-foreground">{row.wirrSlab}</td>
                  <td className="p-3 text-center tabular-nums font-bold text-muted">{row.payoutUnder20Lacs}%</td>
                  <td className="p-3 text-center tabular-nums font-black text-emerald-400">{row.payoutOver20Lacs}%</td>
                </tr>
              ))}
              <tr className="bg-surface/60 font-bold">
                <td className="p-3 text-purple-400 font-bold">M&HCV & Construction Eq.</td>
                <td className="p-3 text-center tabular-nums text-purple-400">1.25% Flat</td>
                <td className="p-3 text-center tabular-nums text-purple-400">1.25% Flat</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Terms & Conditions Section */}
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft space-y-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-accent" />
          DSA Payout Policy Terms & Compliance Rules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted">
          {DSA_TERMS.map((term, index) => (
            <div key={index} className="flex items-start gap-2 p-2.5 rounded-xl bg-surface border border-border/40">
              <span className="w-5 h-5 rounded-full bg-card border border-border text-[10px] font-bold flex items-center justify-center shrink-0 text-foreground">
                {index + 1}
              </span>
              <p className="leading-relaxed">{term}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
