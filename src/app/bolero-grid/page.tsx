"use client";

import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { ExportActions } from "@/components/common/ExportActions";
import { formatINR } from "@/lib/utils";
import {
  BOLERO_MULTI_YEAR_GRIDS,
  BOLERO_CUSTOMER_CATEGORIES,
  BOLERO_SPECIAL_PARAMETERS
} from "@/lib/constants";
import {
  ShieldCheck,
  Zap,
  Calculator,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Truck,
  Sparkles,
  Info,
  ChevronRight,
  UserCheck,
  Layers,
  FileSpreadsheet,
  Grid
} from "lucide-react";

export default function BoleroGridPage() {
  const { addRecentlyViewed } = useData();
  const [selectedGridType, setSelectedGridType] = useState<"New KV Grid" | "Existing KV Grid">("New KV Grid");
  const [activeTab, setActiveTab] = useState<"quickcheck" | "multiyear" | "categories" | "policy">("quickcheck");

  // Quick Check Widget State
  const [qcModel, setQcModel] = useState<string>("Bolero Pickup / Maxx Pickup");
  const [qcYear, setQcYear] = useState<number>(2024);
  const [qcCategoryCode, setQcCategoryCode] = useState<string>("FTB");
  const [qcOwnerNo, setQcOwnerNo] = useState<number>(1);
  const [isRentedProfile, setIsRentedProfile] = useState<boolean>(false);

  useEffect(() => {
    addRecentlyViewed("bolero-grid");
  }, []);

  const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012];
  const models = ["Bolero Pickup / Maxx Pickup", "Bolero Maxitruck Plus", "Bolero Camper"];

  // Filter grid by active gridType (New vs Existing)
  const currentGrids = BOLERO_MULTI_YEAR_GRIDS.filter(g => g.gridType === selectedGridType);

  // Quick Check Lookup
  const matchedGrid = currentGrids.find(g => g.model === qcModel || (qcModel.includes("Pickup") && g.model.includes("Pick")) || (qcModel.includes("Maxi") && g.model.includes("Maxi"))) || currentGrids[0];
  const baseValuationLacs = matchedGrid?.ratesByYear[qcYear] || 9.95;
  const valuationRupees = Math.round(baseValuationLacs * 100000);

  // Customer Category Profile LTV
  const selectedCat = BOLERO_CUSTOMER_CATEGORIES.find(c => c.code === qcCategoryCode) || BOLERO_CUSTOMER_CATEGORIES[2];
  let applicableLtv = selectedCat.ltv;
  if (isRentedProfile) {
    applicableLtv = Math.max(50, applicableLtv - 5); // 5% standard deduction for rented
  }

  // Owner serial adjustment
  let ownerMultiplier = 1.0;
  if (qcOwnerNo === 2) ownerMultiplier = 0.95;
  else if (qcOwnerNo === 3) ownerMultiplier = 0.90;
  else if (qcOwnerNo === 4) ownerMultiplier = 0.84;
  else if (qcOwnerNo === 5) ownerMultiplier = 0.78;

  const adjustedValuation = Math.round(valuationRupees * ownerMultiplier);
  const eligibleLoan = Math.round((adjustedValuation * applicableLtv) / 100);
  const estimatedEMI = Math.round((eligibleLoan * (18 / 1200) * Math.pow(1 + 18 / 1200, 48)) / (Math.pow(1 + 18 / 1200, 48) - 1));

  const getExcelData = () => {
    return BOLERO_MULTI_YEAR_GRIDS.map(g => {
      const row: any = {
        "Grid Version": g.gridType,
        Manufacturer: g.manufacturer,
        Model: g.model,
        "Max Owner Permitted": g.maxOwner,
        "Max LTV": `${g.maxLTV}%`
      };
      years.forEach(y => {
        row[`${y} (₹ Lacs)`] = g.ratesByYear[y] ? `₹ ${g.ratesByYear[y].toFixed(2)}L` : "-";
      });
      return row;
    });
  };

  const getWhatsAppSummary = () => {
    const ownerText = qcOwnerNo === 1 ? "1st Owner" : `${qcOwnerNo} Owner`;
    return `*KV Flash - Official Bolero Pickup Valuation Quote*\n` +
      `-----------------------------------------\n` +
      `🛻 *Model:* ${qcModel}\n` +
      `📊 *Grid Version:* ${selectedGridType}\n` +
      `📅 *Mfg Year:* ${qcYear} | 👤 *Owner:* ${ownerText}\n` +
      `🏷️ *Grid Baseline Value:* *₹ ${baseValuationLacs.toFixed(2)} Lacs* (${formatINR(valuationRupees)})\n` +
      `🏢 *Profile:* ${selectedCat.name} (${applicableLtv}% LTV${isRentedProfile ? ' [Rented -5%]' : ''})\n` +
      `💰 *Eligible Loan Sanction:* *${formatINR(eligibleLoan)}*\n` +
      `📈 *Est. 48M Monthly EMI (@18%):* *${formatINR(estimatedEMI)} / mo*\n` +
      `⚠️ *Policy Norm:* Bolero/SCV funded up to 5th Owner • EOT < 15 Yrs.\n` +
      `-----------------------------------------\n` +
      `_Kredit Venture / Jads Services Pvt Ltd_`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-orange-500/15 text-orange-400 border border-orange-500/30">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Module 06 • Official Policy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Bolero Pickup Grid &amp; Policy Matrix
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Official valuation matrices for Mahindra Bolero Pickup / Maxx Pickup, Maxitruck Plus &amp; Camper (2012-2024) with Transporter / Captive LTV categories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ExportActions
            title="KV Flash - Bolero Pickup Grid"
            moduleKey="bolero_grid"
            getDataForExcel={getExcelData}
            getWhatsAppText={getWhatsAppSummary}
          />
        </div>
      </div>

      {/* Grid Version Switcher + Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl bg-card border border-border shadow-soft">
        <div className="flex items-center gap-1.5 bg-surface p-1 rounded-xl border border-border/80">
          <button
            onClick={() => setSelectedGridType("New KV Grid")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedGridType === "New KV Grid"
                ? "bg-accent text-white shadow-soft"
                : "text-muted hover:text-foreground"
            }`}
          >
            🔥 New KV Grid (2012-2024)
          </button>
          <button
            onClick={() => setSelectedGridType("Existing KV Grid")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedGridType === "Existing KV Grid"
                ? "bg-accent text-white shadow-soft"
                : "text-muted hover:text-foreground"
            }`}
          >
            📋 Existing KV Grid (2012-2024)
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "quickcheck", label: "Instant Calculator", icon: Zap },
            { id: "multiyear", label: "Multi-Year Matrix", icon: Grid },
            { id: "categories", label: "Customer LTV Slabs", icon: Layers },
            { id: "policy", label: "15-Point Policy", icon: Info }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === tab.id
                    ? "bg-foreground text-background font-bold shadow-soft"
                    : "bg-surface border border-border text-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. QUICK CHECK & LOAN QUOTE CALCULATOR */}
      {activeTab === "quickcheck" && (
        <div className="bg-card border border-border rounded-3xl p-5 sm:p-7 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-400" />
              <h2 className="text-base sm:text-lg font-black text-foreground">
                Bolero Quick Valuation &amp; Category LTV Calculator
              </h2>
            </div>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
              Active: {selectedGridType} &bull; Max 5th Owner
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-bold text-muted block mb-1.5">Bolero Asset Model</label>
              <select
                value={qcModel}
                onChange={(e) => setQcModel(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
              >
                {models.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-muted block mb-1.5">Manufacturing Year</label>
              <select
                value={qcYear}
                onChange={(e) => setQcYear(Number(e.target.value))}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
              >
                {years.map(y => {
                  const val = matchedGrid?.ratesByYear[y] || 0;
                  return (
                    <option key={y} value={y}>{y} (₹ {val.toFixed(2)} Lacs)</option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-muted block mb-1.5">Customer Category / Profile</label>
              <select
                value={qcCategoryCode}
                onChange={(e) => setQcCategoryCode(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
              >
                <optgroup label="Transporter Segment">
                  {BOLERO_CUSTOMER_CATEGORIES.filter(c => c.category === "Transporter").map(c => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.ltv}% LTV)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Captive User Segment">
                  {BOLERO_CUSTOMER_CATEGORIES.filter(c => c.category === "Captive").map(c => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.ltv}% LTV)
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-muted block mb-1.5">RC Owner Serial No.</label>
              <select
                value={qcOwnerNo}
                onChange={(e) => setQcOwnerNo(Number(e.target.value))}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
              >
                <option value={1}>1st Owner (100% Value)</option>
                <option value={2}>2nd Owner (95% Value)</option>
                <option value={3}>3rd Owner (90% Value)</option>
                <option value={4}>4th Owner (84% Value)</option>
                <option value={5}>5th Owner (78% Value - Max Permitted)</option>
              </select>
            </div>
          </div>

          {/* Rented Profile Checkbox */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface/60 border border-border text-xs">
            <input
              type="checkbox"
              id="rentedCheckbox"
              checked={isRentedProfile}
              onChange={(e) => setIsRentedProfile(e.target.checked)}
              className="rounded accent-accent w-4 h-4 cursor-pointer"
            />
            <label htmlFor="rentedCheckbox" className="cursor-pointer font-medium text-foreground">
              Applicant lives in <strong>Rented Residence</strong> (Applies standard 5% deduction from applicable LTV; external guarantor with property ownership required).
            </label>
          </div>

          {/* Calculated Output Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-3xl bg-surface/80 border border-border/80 shadow-soft">
            <div className="space-y-1">
              <span className="text-[10px] text-muted uppercase font-bold block">
                {selectedGridType} Baseline
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground tabular-nums">
                ₹ {baseValuationLacs.toFixed(2)} Lacs
              </span>
              <span className="text-xs text-muted block">
                ({formatINR(valuationRupees)})
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Applicable LTV
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 tabular-nums">
                {applicableLtv}%
              </span>
              <span className="text-xs text-emerald-500/90 block">
                {selectedCat.code} &bull; {isRentedProfile ? "Rented (-5%)" : "Owned Property"}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Eligible Loan Amount
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums">
                {formatINR(eligibleLoan)}
              </span>
              <span className="text-xs text-muted block">
                {qcOwnerNo > 1 ? `Adjusted for Owner #${qcOwnerNo}` : "Full 1st Owner"}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-muted uppercase font-bold block">Est. 48M EMI (@18%)</span>
                <span className="text-xl sm:text-2xl font-black text-accent tabular-nums">
                  {formatINR(estimatedEMI)}
                </span>
              </div>
              <button
                onClick={() => {
                  const text = getWhatsAppSummary();
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-soft"
              >
                Share Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MULTI-YEAR VALUATION MATRIX (2012 - 2024) */}
      {activeTab === "multiyear" && (
        <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-accent" />
                <h2 className="text-base sm:text-lg font-black text-foreground">
                  Mahindra Bolero Multi-Year Valuation Grid (2012 - 2024)
                </h2>
              </div>
              <p className="text-xs text-muted">
                Showing authentic valuations in ₹ Lacs from the official Kredit Venture rate book.
              </p>
            </div>
            <span className="text-xs font-bold text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/30">
              {selectedGridType}
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface/80 border-b border-border text-muted font-bold text-[10px] uppercase">
                  <th className="p-3 sticky left-0 bg-surface z-10 w-52">Model Name</th>
                  <th className="p-3 text-center">Max Owner</th>
                  {years.map(y => (
                    <th key={y} className="p-2 text-center font-mono w-16">
                      {y}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {currentGrids.map((row) => (
                  <tr key={row.id} className="hover:bg-surface/40 transition-colors">
                    <td className="p-3 font-bold text-foreground sticky left-0 bg-card z-10 border-r border-border/40">
                      <span className="text-foreground block">{row.model}</span>
                      <span className="text-[10px] text-muted font-normal">M&amp;M SCV Segment</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
                        <UserCheck className="w-3 h-3" /> Up to 5th
                      </span>
                    </td>
                    {years.map(y => {
                      const val = row.ratesByYear[y] || 0;
                      return (
                        <td
                          key={y}
                          className="p-2 text-center tabular-nums font-mono text-xs font-bold text-foreground/90"
                        >
                          ₹ {val.toFixed(2)}L
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CUSTOMER CATEGORIES & LTV MATRIX */}
      {activeTab === "categories" && (
        <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Layers className="w-5 h-5 text-accent" />
            <h2 className="text-base sm:text-lg font-black text-foreground">
              Customer Categories &amp; LTV Eligibility Slabs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Transporters */}
            <div className="p-4 rounded-2xl bg-surface/60 border border-border space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400" /> Transporter Category (Commercial Sourcing)
              </h3>
              <div className="space-y-2">
                {BOLERO_CUSTOMER_CATEGORIES.filter(c => c.category === "Transporter").map(c => (
                  <div key={c.code} className="p-3 rounded-xl bg-card border border-border/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-foreground block">{c.name}</span>
                      <span className="text-[11px] text-muted">{c.remarks}</span>
                    </div>
                    <span className="text-base font-black text-accent tabular-nums px-2 py-1 rounded-lg bg-accent/15 border border-accent/20">
                      {c.ltv}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Captive */}
            <div className="p-4 rounded-2xl bg-surface/60 border border-border space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Captive User Category (Own Business Transport)
              </h3>
              <div className="space-y-2">
                {BOLERO_CUSTOMER_CATEGORIES.filter(c => c.category === "Captive").map(c => (
                  <div key={c.code} className="p-3 rounded-xl bg-card border border-border/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-foreground block">{c.name}</span>
                      <span className="text-[11px] text-muted">{c.remarks}</span>
                    </div>
                    <span className="text-base font-black text-emerald-400 tabular-nums px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/20">
                      {c.ltv}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. 15-POINT CREDIT POLICY PARAMETERS */}
      {activeTab === "policy" && (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Official Kredit Venture Bolero Credit Policy Parameters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BOLERO_SPECIAL_PARAMETERS.map((param, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-surface/60 border border-border flex items-start gap-3"
              >
                <div className="p-1 rounded-full bg-accent/15 text-accent shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">{param}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
