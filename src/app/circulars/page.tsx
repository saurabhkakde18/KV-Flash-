"use client";

import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { ExportActions } from "@/components/common/ExportActions";
import {
  BellRing,
  Search,
  Calendar,
  AlertTriangle,
  FileText,
  Sparkles,
  Zap,
  ArrowRight,
  Eye,
  CheckCircle2
} from "lucide-react";
import { CircularItem } from "@/types";

export default function CircularsPage() {
  const { circularsData, addRecentlyViewed } = useData();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCircular, setActiveCircular] = useState<CircularItem | null>(null);

  useEffect(() => {
    addRecentlyViewed("circulars");
  }, []);

  const categories = ["All", "Rate Change", "Credit Policy", "Payout Update", "Operational Guideline"];

  const filteredCirculars = circularsData.filter(circ => {
    const matchCat = selectedCategory === "All" || circ.category === selectedCategory;
    const matchQ = !searchQuery || circ.title.toLowerCase().includes(searchQuery.toLowerCase()) || circ.circularNo.toLowerCase().includes(searchQuery.toLowerCase()) || circ.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });

  const getExcelData = () => {
    return circularsData.map(c => ({
      "Circular No": c.circularNo,
      Title: c.title,
      Date: c.date,
      "Effective Date": c.effectiveDate,
      Category: c.category,
      Importance: c.importance,
      Summary: c.summary
    }));
  };

  const getWhatsAppSummary = () => {
    return `*KV Flash - Latest Policy Circulars & Rate Updates*\n` +
      `-----------------------------------------\n` +
      circularsData.map(c => `📢 *${c.title}* (${c.circularNo})\n  • Category: ${c.category} | Effective: ${c.effectiveDate}\n  • Summary: ${c.summary}`).join("\n\n") +
      `\n-----------------------------------------\n_Kredit Venture / Jads Services Pvt Ltd_`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <BellRing className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Module 10</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Rate Change Updates &amp; Circulars
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Official circulars, regulatory announcements, and revised lending rate bulletins.
          </p>
        </div>

        <ExportActions
          title="KV Flash - Official Circulars"
          moduleKey="circulars_bulletin"
          getDataForExcel={getExcelData}
          getWhatsAppText={getWhatsAppSummary}
        />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-accent text-white shadow-soft"
                  : "bg-surface border border-border text-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars..."
            className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder-muted focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Circulars List */}
      <div className="space-y-4">
        {filteredCirculars.map((circ) => (
          <div
            key={circ.id}
            className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft hover:border-accent/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-xs font-mono font-bold text-accent bg-accent-muted px-2.5 py-0.5 rounded-full border border-accent/20">
                  {circ.circularNo}
                </span>
                <span className="text-xs text-muted flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Date: {circ.date}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface border border-border text-foreground">
                  {circ.category}
                </span>
                {circ.isNew && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    NEW UPDATE
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                {circ.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {circ.summary}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
              <button
                onClick={() => setActiveCircular(circ)}
                className="px-4 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-bold hover:bg-elevated transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" /> View Full Text
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal View */}
      {activeCircular && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveCircular(null)}
              className="absolute top-5 right-5 text-muted hover:text-foreground p-1 rounded-lg text-lg"
            >
              ✕
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-accent bg-accent-muted px-2.5 py-0.5 rounded-full">
                  {activeCircular.circularNo}
                </span>
                <span className="text-xs text-muted">Effective Date: {activeCircular.effectiveDate}</span>
              </div>
              <h2 className="text-xl font-black text-foreground">{activeCircular.title}</h2>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-border text-xs sm:text-sm leading-relaxed text-foreground whitespace-pre-line">
              {activeCircular.details}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted">
              <span>Published by Head of Vehicle Finance Credit</span>
              <button
                onClick={() => {
                  const text = `*${activeCircular.title}* (${activeCircular.circularNo})\n\n${activeCircular.details}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors"
              >
                Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
