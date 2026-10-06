"use client";

import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { ExportActions } from "@/components/common/ExportActions";
import {
  Percent,
  Filter,
  Sparkles,
  Zap,
  TrendingDown,
  CheckCircle2,
  HelpCircle,
  Calculator,
  Search,
  ArrowRight
} from "lucide-react";
import { IIRRateItem } from "@/types";

export default function IIRMatrixPage() {
  const { iirData, addRecentlyViewed } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // "Find My Rate" Quick Selector State
  const [calcCategory, setCalcCategory] = useState<string>("Used Cars");
  const [calcProduct, setCalcProduct] = useState<string>("Personal Car");
  const [calcYear, setCalcYear] = useState<string>("2021-2025");
  const [calculatedRate, setCalculatedRate] = useState<IIRRateItem | null>(null);

  useEffect(() => {
    addRecentlyViewed("iir-matrix");
  }, []);

  const categories = ["All", "Used Cars", "Used Commercial Vehicles", "Construction Equipment", "Tractor"];
  const yearBands = ["All", "2021-2025", "2016-2020", "2011-2015"];

  const filteredData = iirData.filter((item) => {
    const matchCat = selectedCategory === "All" || item.category === selectedCategory;
    const matchYear = selectedYear === "All" || item.mfgYear === selectedYear;
    const matchQuery = !searchQuery || item.product.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchYear && matchQuery;
  });

  // Calculate best (lowest) WIRR in dataset
  const bestRate = Math.min(...iirData.map(i => i.wirr));

  // Run Find My Rate calculation
  const handleFindRate = () => {
    const match = iirData.find(
      item => item.category === calcCategory && item.product.includes(calcProduct) && item.mfgYear === calcYear
    ) || iirData.find(item => item.category === calcCategory && item.mfgYear === calcYear);

    setCalculatedRate(match || iirData[0]);
  };

  useEffect(() => {
    handleFindRate();
  }, [calcCategory, calcProduct, calcYear]);

  // Data helpers for export
  const getExcelData = () => {
    return filteredData.map(item => ({
      Category: item.category,
      Product: item.product,
      "Mfg Year": item.mfgYear,
      "IRR (%)": `${item.irr}%`,
      "WIRR (%)": `${item.wirr}%`,
      "Max LTV (%)": `${item.maxLTV}%`,
      "Max Tenure (Months)": item.tenureMaxMonths,
      "Customer Profile": item.customerProfile || "Standard",
      "Score Band": item.scoreBand || ">=600"
    }));
  };

  const getWhatsAppSummary = () => {
    return `*KV Flash - IIR Rate Matrix (Kredit Venture)*\n` +
      `-----------------------------------------\n` +
      `🔥 *Best Rate Starting:* ${bestRate}% WIRR\n\n` +
      filteredData.slice(0, 8).map(i => `🚗 *${i.product} (${i.mfgYear})*\n  • IRR: *${i.irr}%* | WIRR: *${i.wirr}%*\n  • Max LTV: ${i.maxLTV}% | Tenure: ${i.tenureMaxMonths}M`).join("\n\n") +
      `\n-----------------------------------------\n` +
      `_Generated via KV Flash PWA_`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-500 border border-amber-500/30">
              <Percent className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Module 01</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            IIR Rate Matrix
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Official Internal Rate of Return (IRR) & Weighted IRR (WIRR) schedule across all asset classes.
          </p>
        </div>

        <ExportActions
          title="KV Flash - IIR Rate Matrix"
          moduleKey="iir_matrix"
          getDataForExcel={getExcelData}
          getWhatsAppText={getWhatsAppSummary}
        />
      </div>

      {/* "Find My Rate" Quick Selector Card */}
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
          <Zap className="w-5 h-5 text-accent" />
          <h2 className="text-base font-bold text-foreground">Find My Exact Rate Selector</h2>
          <span className="text-[10px] font-semibold bg-accent-muted text-accent px-2 py-0.5 rounded-full border border-accent/20 ml-auto">
            Instant Lookup
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted block mb-1.5">Asset Category</label>
            <select
              value={calcCategory}
              onChange={(e) => {
                setCalcCategory(e.target.value);
                if (e.target.value === "Used Cars") setCalcProduct("Personal Car");
                else if (e.target.value === "Used Commercial Vehicles") setCalcProduct("SCV");
                else if (e.target.value === "Construction Equipment") setCalcProduct("CE");
                else setCalcProduct("Tractor");
              }}
              className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:border-accent"
            >
              <option value="Used Cars">Used Cars</option>
              <option value="Used Commercial Vehicles">Used Commercial Vehicles</option>
              <option value="Construction Equipment">Construction Equipment (CE)</option>
              <option value="Tractor">Tractor</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted block mb-1.5">Sub Product / Segment</label>
            <select
              value={calcProduct}
              onChange={(e) => setCalcProduct(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:border-accent"
            >
              {calcCategory === "Used Cars" && (
                <>
                  <option value="Personal Car">Personal Car</option>
                  <option value="Commercial Car">Commercial Car (Taxi/Fleet)</option>
                </>
              )}
              {calcCategory === "Used Commercial Vehicles" && (
                <>
                  <option value="SCV">SCV (Small Commercial Vehicle)</option>
                  <option value="LCV">LCV / ICV</option>
                  <option value="M&HCV">M&HCV (Heavy Commercial)</option>
                </>
              )}
              {calcCategory === "Construction Equipment" && (
                <option value="CE">Used CE (JCB BHL's Upto 20 Ton's)</option>
              )}
              {calcCategory === "Tractor" && (
                <option value="Tractor">Used Tractor (Agri / Comm)</option>
              )}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted block mb-1.5">Manufacturing Year</label>
            <select
              value={calcYear}
              onChange={(e) => setCalcYear(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:border-accent"
            >
              <option value="2021-2025">2021 - 2025 (Latest Models)</option>
              <option value="2016-2020">2016 - 2020 (Mid Age)</option>
              <option value="2011-2015">2011 - 2015 (Older Vehicles)</option>
            </select>
          </div>
        </div>

        {/* Result Card Pill */}
        {calculatedRate && (
          <div className="mt-5 p-4 rounded-2xl bg-surface border border-accent/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-accent text-white font-black text-xl tabular-nums">
                {calculatedRate.wirr}%
              </div>
              <div>
                <span className="text-[11px] font-bold text-accent uppercase tracking-wider">Applicable WIRR (Customer Rate)</span>
                <h4 className="text-sm font-bold text-foreground">
                  {calculatedRate.product} • {calculatedRate.mfgYear}
                </h4>
                <p className="text-xs text-muted">
                  Gross IRR: <strong className="text-foreground">{calculatedRate.irr}%</strong> • Max Tenure: <strong className="text-foreground">{calculatedRate.tenureMaxMonths} Months</strong> • Max LTV: <strong className="text-foreground">{calculatedRate.maxLTV}%</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-card border border-border text-foreground">
                CIBIL: {calculatedRate.scoreBand || ">=600"}
              </span>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                LTV: {calculatedRate.maxLTV}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 text-xs font-bold text-muted bg-surface px-2.5 py-1.5 rounded-xl border border-border shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-card border border-border rounded-xl px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none shrink-0"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-card border border-border rounded-xl px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none shrink-0"
          >
            {yearBands.map(y => <option key={y} value={y}>{y === "All" ? "All Years" : y}</option>)}
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product..."
            className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder-muted focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Main Interactive Table */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-surface border-b border-border text-muted font-bold uppercase tracking-wider text-[11px]">
                <th className="p-3.5 sm:p-4 sticky left-0 bg-surface z-10">Vehicle Category & Product</th>
                <th className="p-3.5 sm:p-4">Mfg Year</th>
                <th className="p-3.5 sm:p-4 text-center">Gross IRR</th>
                <th className="p-3.5 sm:p-4 text-center">WIRR (Net)</th>
                <th className="p-3.5 sm:p-4 text-center">Max Tenure</th>
                <th className="p-3.5 sm:p-4 text-center">Max LTV</th>
                <th className="p-3.5 sm:p-4">Customer Profile</th>
                <th className="p-3.5 sm:p-4">Score Band</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredData.map((row) => {
                const isBest = row.wirr === bestRate;

                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-surface/50 transition-colors ${
                      isBest ? "bg-accent-muted/30" : ""
                    }`}
                  >
                    <td className="p-3.5 sm:p-4 font-bold text-foreground sticky left-0 bg-card z-10">
                      <div className="flex items-center gap-2">
                        {isBest && (
                          <span className="p-1 rounded bg-amber-500 text-black font-black text-[9px]">
                            BEST
                          </span>
                        )}
                        <div>
                          <span>{row.product}</span>
                          <span className="text-[10px] text-muted block font-normal">{row.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 sm:p-4 tabular-nums font-semibold text-foreground">
                      {row.mfgYear}
                    </td>
                    <td className="p-3.5 sm:p-4 text-center tabular-nums font-bold text-muted">
                      {row.irr}%
                    </td>
                    <td className="p-3.5 sm:p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-black tabular-nums ${
                        isBest
                          ? "bg-amber-500 text-black shadow-sm"
                          : "bg-accent-muted text-accent border border-accent/20"
                      }`}>
                        {row.wirr}%
                      </span>
                    </td>
                    <td className="p-3.5 sm:p-4 text-center tabular-nums font-medium text-foreground">
                      {row.tenureMaxMonths} M
                    </td>
                    <td className="p-3.5 sm:p-4 text-center tabular-nums font-bold text-emerald-400">
                      {row.maxLTV}%
                    </td>
                    <td className="p-3.5 sm:p-4 text-xs text-muted">
                      {row.customerProfile || "Standard"}
                    </td>
                    <td className="p-3.5 sm:p-4 text-xs font-mono text-muted">
                      {row.scoreBand || ">=600"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
