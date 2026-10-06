"use client";

import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { ExportActions } from "@/components/common/ExportActions";
import { DOCUMENT_CHECKLIST_DATA } from "@/lib/constants";
import {
  FileCheck,
  CheckSquare,
  Square,
  Share2,
  Download,
  Copy,
  Check,
  Search,
  Sparkles,
  Info
} from "lucide-react";

export default function DocumentsChecklistPage() {
  const { addRecentlyViewed } = useData();
  const [checkedItems, setCheckedItems] = useState<{ [id: string]: boolean }>({});
  const [selectedProfile, setSelectedProfile] = useState("All");

  useEffect(() => {
    addRecentlyViewed("documents");
  }, []);

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getWhatsAppSummary = () => {
    let msg = `*KV Flash - Loan Documentation Checklist*\n-----------------------------------------\n`;
    DOCUMENT_CHECKLIST_DATA.forEach(cat => {
      msg += `📌 *${cat.category}:*\n`;
      cat.items.forEach((item, idx) => {
        const isChecked = checkedItems[item.id];
        msg += ` ${isChecked ? "✅" : "⬜"} ${item.label}\n`;
      });
      msg += `\n`;
    });
    msg += `-----------------------------------------\n_Kredit Venture / Jads Services Pvt Ltd_`;
    return msg;
  };

  const getExcelData = () => {
    const rows: any[] = [];
    DOCUMENT_CHECKLIST_DATA.forEach(cat => {
      cat.items.forEach(item => {
        rows.push({
          Category: cat.category,
          "Required Document": item.label,
          Collected: checkedItems[item.id] ? "YES" : "NO"
        });
      });
    });
    return rows;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <FileCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Module 09</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Documents Checklist
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Interactive verification checklist by customer profile (Salaried, Self-Employed, Transporter &amp; Farmer).
          </p>
        </div>

        <ExportActions
          title="KV Flash - Documents Checklist"
          moduleKey="documents_checklist"
          getDataForExcel={getExcelData}
          getWhatsAppText={getWhatsAppSummary}
        />
      </div>

      {/* Profile Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["All", ...DOCUMENT_CHECKLIST_DATA.map(d => d.category)].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedProfile(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedProfile === cat
                ? "bg-accent text-white shadow-soft"
                : "bg-surface border border-border text-muted hover:text-foreground hover:bg-card"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Checklists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DOCUMENT_CHECKLIST_DATA.filter(
          cat => selectedProfile === "All" || cat.category === selectedProfile
        ).map((categoryGroup, idx) => {
          const totalInGroup = categoryGroup.items.length;
          const checkedInGroup = categoryGroup.items.filter(i => checkedItems[i.id]).length;
          const pct = Math.round((checkedInGroup / totalInGroup) * 100);

          return (
            <div
              key={idx}
              className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-foreground">
                    {categoryGroup.category}
                  </h2>
                  <span className="text-[11px] text-muted">{checkedInGroup} of {totalInGroup} collected</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-accent">{pct}%</span>
                  <div className="w-12 h-2 bg-surface rounded-full overflow-hidden border border-border">
                    <div className="h-full bg-accent transition-all duration-300" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {categoryGroup.items.map((item) => {
                  const isChecked = Boolean(checkedItems[item.id]);

                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                        isChecked
                          ? "bg-accent-muted/20 border-accent/40 text-foreground"
                          : "bg-surface/50 border-border/60 hover:bg-surface text-muted hover:text-foreground"
                      }`}
                    >
                      <div className="p-0.5 mt-0.5 shrink-0">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-accent" />
                        ) : (
                          <Square className="w-4 h-4 text-muted" />
                        )}
                      </div>
                      <span className={`text-xs sm:text-sm font-medium leading-relaxed ${isChecked ? "line-through text-muted" : ""}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
