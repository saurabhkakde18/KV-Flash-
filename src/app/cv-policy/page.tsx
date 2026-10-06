"use client";

import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { ExportActions } from "@/components/common/ExportActions";
import { CV_POLICY_SECTIONS } from "@/lib/constants";
import {
  Truck,
  ChevronDown,
  ChevronUp,
  Search,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  FileText
} from "lucide-react";

export default function CVPolicyPage() {
  const { addRecentlyViewed } = useData();
  const [openSections, setOpenSections] = useState<string[]>(CV_POLICY_SECTIONS.map(s => s.id));
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    addRecentlyViewed("cv-policy");
  }, []);

  const toggleSection = (id: string) => {
    setOpenSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const expandAll = () => setOpenSections(CV_POLICY_SECTIONS.map(s => s.id));
  const collapseAll = () => setOpenSections([]);

  const getExcelData = () => {
    const rows: any[] = [];
    CV_POLICY_SECTIONS.forEach(sec => {
      sec.items.forEach(item => {
        rows.push({
          Section: sec.title,
          Parameter: item.label,
          Norms: item.description,
          Highlight: item.highlight || "",
          "Last Revised": sec.lastRevised
        });
      });
    });
    return rows;
  };

  const getWhatsAppSummary = () => {
    return `*KV Flash - CV Credit Policy Summary (Aug 2024)*\n` +
      `-----------------------------------------\n` +
      `🚚 *Branch Approval Limit:* Up to ₹ 100 Lakhs\n` +
      `🚛 *M&HCV / Tipper CAT B Max Cap:* ₹ 100 Lakhs\n` +
      `⚡ *Fast Track Tatkal:* Max ₹ 25 Lakhs (Tippers up to 28T)\n` +
      `📋 *Sahaj Scheme (450-549 CIBIL):* Max ₹ 25L (Branch Delinquency <= 15%)\n` +
      `🏢 *RC Limit Cap:* Cat A 15 Nos/100L | Cat B 12 Nos/75L | Cat C 10 Nos/50L\n` +
      `-----------------------------------------\n` +
      `_Kredit Venture / Jads Services Pvt Ltd_`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <Truck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Module 03</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Commercial Vehicle (CV) Policy
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Master credit norms, Category A-F funding limits, Tatkal criteria, RC caps & asset classifications.
          </p>
        </div>

        <ExportActions
          title="KV Flash - Commercial Vehicle Policy"
          moduleKey="cv_policy"
          getDataForExcel={getExcelData}
          getWhatsAppText={getWhatsAppSummary}
        />
      </div>

      {/* Policy Search & Accordion Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Tatkal, CAT B, Tipper, Sahaj..."
            className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-foreground placeholder-muted focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 rounded-xl bg-surface border border-border text-muted hover:text-foreground transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-xl bg-surface border border-border text-muted hover:text-foreground transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Accordion Policy Sections */}
      <div className="space-y-4">
        {CV_POLICY_SECTIONS.map((section) => {
          const isOpen = openSections.includes(section.id);
          const filteredItems = section.items.filter(
            item => !searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (searchQuery && filteredItems.length === 0) return null;

          return (
            <div
              key={section.id}
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft transition-all"
            >
              {/* Section Header Accordion Trigger */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between bg-surface/40 hover:bg-surface transition-colors"
              >
                <div className="flex items-center gap-3 pr-2">
                  <div className="p-2 rounded-xl bg-accent-muted text-accent shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-foreground">
                      {section.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3" /> Revised: {section.lastRevised}
                      </span>
                      {section.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-muted text-accent border border-accent/20">
                          {section.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-1 rounded-lg text-muted">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="p-4 sm:p-6 divide-y divide-border/60">
                  {filteredItems.map((item, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          {item.label}
                        </h3>
                        {item.highlight && (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                            {item.highlight}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted leading-relaxed pl-3.5">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
