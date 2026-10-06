"use client";

import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { IIRRateItem, BoleroGridItem } from "@/types";
import { formatINR } from "@/lib/utils";
import {
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Car,
  Truck,
  ShieldCheck
} from "lucide-react";

export default function ComparePage() {
  const { iirData, boleroGridData, cvGridData } = useData();

  // Compare Option 1 and Option 2
  const [item1Id, setItem1Id] = useState<string>(iirData[0]?.id || "");
  const [item2Id, setItem2Id] = useState<string>(iirData[6]?.id || "");

  const item1 = iirData.find(i => i.id === item1Id) || iirData[0];
  const item2 = iirData.find(i => i.id === item2Id) || iirData[6] || iirData[1];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-accent-muted text-accent border border-accent/20">
            <Layers className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-accent">Comparison Utility</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Side-by-Side Product &amp; Rate Compare
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Compare interest rates, loan-to-value ratios, tenure caps, and borrower eligibility between two vehicle segments.
        </p>
      </div>

      {/* Selector Headers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Product Select */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-2 shadow-soft">
          <label className="text-xs font-bold text-accent uppercase tracking-wider block">Select Segment A</label>
          <select
            value={item1Id}
            onChange={(e) => setItem1Id(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none"
          >
            {iirData.map(i => (
              <option key={i.id} value={i.id}>
                {i.category} - {i.product} ({i.mfgYear})
              </option>
            ))}
          </select>
        </div>

        {/* Right Product Select */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-2 shadow-soft">
          <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Select Segment B</label>
          <select
            value={item2Id}
            onChange={(e) => setItem2Id(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none"
          >
            {iirData.map(i => (
              <option key={i.id} value={i.id}>
                {i.category} - {i.product} ({i.mfgYear})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Grid Matrix */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface border-b border-border text-muted font-bold text-[10px] uppercase">
                <th className="p-4 w-1/3">Feature / Parameter</th>
                <th className="p-4 w-1/3 text-accent">{item1?.product} ({item1?.mfgYear})</th>
                <th className="p-4 w-1/3 text-emerald-400">{item2?.product} ({item2?.mfgYear})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="p-4 font-bold text-muted">Vehicle Category</td>
                <td className="p-4 font-semibold text-foreground">{item1?.category}</td>
                <td className="p-4 font-semibold text-foreground">{item2?.category}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-muted">Customer WIRR (Net Rate)</td>
                <td className="p-4">
                  <span className="text-base font-black text-accent tabular-nums">{item1?.wirr}%</span>
                </td>
                <td className="p-4">
                  <span className="text-base font-black text-emerald-400 tabular-nums">{item2?.wirr}%</span>
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-muted">Gross IRR</td>
                <td className="p-4 tabular-nums font-semibold text-foreground">{item1?.irr}%</td>
                <td className="p-4 tabular-nums font-semibold text-foreground">{item2?.irr}%</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-muted">Maximum LTV</td>
                <td className="p-4 font-black tabular-nums text-foreground">{item1?.maxLTV}%</td>
                <td className="p-4 font-black tabular-nums text-foreground">{item2?.maxLTV}%</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-muted">Max Tenure Cap</td>
                <td className="p-4 tabular-nums font-semibold text-foreground">{item1?.tenureMaxMonths} Months</td>
                <td className="p-4 tabular-nums font-semibold text-foreground">{item2?.tenureMaxMonths} Months</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-muted">Target Customer Profile</td>
                <td className="p-4 text-xs text-muted">{item1?.customerProfile || "Standard"}</td>
                <td className="p-4 text-xs text-muted">{item2?.customerProfile || "Standard"}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-muted">Minimum CIBIL Score</td>
                <td className="p-4 font-mono font-semibold text-foreground">{item1?.scoreBand || ">=600"}</td>
                <td className="p-4 font-mono font-semibold text-foreground">{item2?.scoreBand || ">=600"}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-muted">Max Owner Permitted</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl border ${
                    item1?.category === "Used Cars"
                      ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                      : "bg-purple-500/15 text-purple-400 border-purple-500/30"
                  }`}>
                    {item1?.category === "Used Cars" ? "Up to 4th Owner" : "Up to 5th Owner"}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl border ${
                    item2?.category === "Used Cars"
                      ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                      : "bg-purple-500/15 text-purple-400 border-purple-500/30"
                  }`}>
                    {item2?.category === "Used Cars" ? "Up to 4th Owner" : "Up to 5th Owner"}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-muted">Example EMI on ₹ 8 Lakhs (48M)</td>
                <td className="p-4 font-black text-accent tabular-nums">
                  {formatINR(Math.round((800000 * (item1.wirr / 1200) * Math.pow(1 + item1.wirr / 1200, 48)) / (Math.pow(1 + item1.wirr / 1200, 48) - 1)))} / mo
                </td>
                <td className="p-4 font-black text-emerald-400 tabular-nums">
                  {formatINR(Math.round((800000 * (item2.wirr / 1200) * Math.pow(1 + item2.wirr / 1200, 48)) / (Math.pow(1 + item2.wirr / 1200, 48) - 1)))} / mo
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
