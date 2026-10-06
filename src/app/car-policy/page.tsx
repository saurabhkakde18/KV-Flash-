"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { ExportActions } from "@/components/common/ExportActions";
import { CAR_POLICY_SECTIONS, APPROVED_CARS_DATA } from "@/lib/constants";
import {
  Car,
  ChevronDown,
  ChevronUp,
  Search,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Wheat,
  ArrowRight
} from "lucide-react";

export default function CarPolicyPage() {
  const { addRecentlyViewed } = useData();
  const [openSections, setOpenSections] = useState<string[]>(CAR_POLICY_SECTIONS.map(s => s.id));
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    addRecentlyViewed("car-policy");
  }, []);

  const toggleSection = (id: string) => {
    setOpenSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const expandAll = () => setOpenSections(CAR_POLICY_SECTIONS.map(s => s.id));
  const collapseAll = () => setOpenSections([]);

  const getExcelData = () => {
    const rows: any[] = [];
    CAR_POLICY_SECTIONS.forEach(sec => {
      sec.items.forEach(item => {
        rows.push({
          Program: sec.title,
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
    return `*KV Flash - Private Car Amended Credit Policy (Feb 2026)*\n` +
      `-----------------------------------------\n` +
      `🚗 *Salaried IP:* Max FOIR 60% | Min ₹20k Salary | Max 90% LTV\n` +
      `🏢 *NIP (Non-Income):* Min 2 yrs biz | Max ₹8L Capping | 80% LTV\n` +
      `📈 *Repayment Surrogate:* AL 12M (1.4x), 24M (1.5x) | 85% LTV\n` +
      `🏦 *Banking Surrogate:* ABB to EMI >= 1.5x | 80% LTV\n` +
      `🌾 *Agri Funding:* 2-3 Acre (5L), 3-5 Acre (8L), >=5 Acre (10L) | 80% LTV\n` +
      `🚘 *Approved Models:* 54 OEM Models (Maruti, Hyundai, Tata, Toyota, Mahindra...)\n` +
      `⏱️ *General Norms:* EOT max 12 yrs | Discontinued models 60% LTV | Max 4th owner\n` +
      `-----------------------------------------\n` +
      `_Kredit Venture / Jads Services Pvt Ltd_`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <Car className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Module 04</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Car Policy (Amended Credit Policy)
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Salaried IP, Self-Employed NIP, Repayment Surrogate, Banking Surrogate &amp; Agri funding programs.
          </p>
        </div>

        <ExportActions
          title="KV Flash - Private Car Policy"
          moduleKey="car_policy"
          getDataForExcel={getExcelData}
          getWhatsAppText={getWhatsAppSummary}
        />
      </div>

      {/* Direct Link Banner to Approved Car List */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-surface to-card border border-emerald-500/30 rounded-3xl p-5 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Official Approved Car Models Master List</h3>
            <p className="text-xs text-muted">54 passenger &amp; commercial car models approved across Maruti, Hyundai, Tata, Mahindra, Toyota, Honda, Kia, Jeep &amp; Renault.</p>
          </div>
        </div>

        <Link
          href="/approved-cars"
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors shadow-soft flex items-center justify-center gap-2 shrink-0"
        >
          <span>View 54 Models</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Policy Search & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Salaried, Surrogate, ABB, Agri..."
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

      {/* Quick Comparison Table: Car Programs At A Glance */}
      <div className="bg-card border border-border rounded-3xl p-5 shadow-soft">
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" /> Private Car Programs Quick Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-surface border-b border-border text-muted font-bold text-[10px] uppercase">
                <th className="p-2.5">Program Name</th>
                <th className="p-2.5 text-center">Max LTV</th>
                <th className="p-2.5 text-center">Max Loan Cap</th>
                <th className="p-2.5 text-center">Max Tenure</th>
                <th className="p-2.5">Key Eligibility Requirement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              <tr className="hover:bg-surface/30">
                <td className="p-2.5 font-bold text-foreground">Salaried IP</td>
                <td className="p-2.5 text-center text-emerald-400 font-bold tabular-nums">90.00%</td>
                <td className="p-2.5 text-center font-bold tabular-nums">₹ 10 Lakhs</td>
                <td className="p-2.5 text-center tabular-nums">48 - 60 M</td>
                <td className="p-2.5 text-muted">Min salary ₹20k/mo • Form 16 / ITR • FOIR 60%</td>
              </tr>
              <tr className="hover:bg-surface/30">
                <td className="p-2.5 font-bold text-foreground">Self Employed NIP</td>
                <td className="p-2.5 text-center text-emerald-400 font-bold tabular-nums">80.00%</td>
                <td className="p-2.5 text-center font-bold tabular-nums">₹ 8 Lakhs</td>
                <td className="p-2.5 text-center tabular-nums">48 M</td>
                <td className="p-2.5 text-muted">2 yrs stability • 6M banking • Property proof</td>
              </tr>
              <tr className="hover:bg-surface/30">
                <td className="p-2.5 font-bold text-foreground">Repayment Surrogate</td>
                <td className="p-2.5 text-center text-emerald-400 font-bold tabular-nums">85.00%</td>
                <td className="p-2.5 text-center font-bold tabular-nums">₹ 10 Lakhs</td>
                <td className="p-2.5 text-center tabular-nums">48 M</td>
                <td className="p-2.5 text-muted">12/24 MOB Auto Loan (1.4x / 1.5x) • Zero bounce in 6M</td>
              </tr>
              <tr className="hover:bg-surface/30">
                <td className="p-2.5 font-bold text-foreground">Banking Surrogate</td>
                <td className="p-2.5 text-center text-emerald-400 font-bold tabular-nums">80.00%</td>
                <td className="p-2.5 text-center font-bold tabular-nums">₹ 10 Lakhs</td>
                <td className="p-2.5 text-center tabular-nums">48 M</td>
                <td className="p-2.5 text-muted">ABB to EMI &gt;= 1.5x • Property &gt;= 4x loan value</td>
              </tr>
              <tr className="hover:bg-surface/30">
                <td className="p-2.5 font-bold text-foreground">Agri Land Based</td>
                <td className="p-2.5 text-center text-emerald-400 font-bold tabular-nums">80.00%</td>
                <td className="p-2.5 text-center font-bold tabular-nums">₹ 10 Lakhs</td>
                <td className="p-2.5 text-center tabular-nums">48 M</td>
                <td className="p-2.5 text-muted">2 to 5+ Acres 7/12 &amp; 8A extract • No LTV deviation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Accordion Policy Sections */}
      <div className="space-y-4">
        {CAR_POLICY_SECTIONS.map((section) => {
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
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between bg-surface/40 hover:bg-surface transition-colors"
              >
                <div className="flex items-center gap-3 pr-2">
                  <div className="p-2 rounded-xl bg-accent-muted text-accent shrink-0">
                    <Car className="w-4 h-4" />
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
