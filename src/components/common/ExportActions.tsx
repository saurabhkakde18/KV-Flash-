"use client";

import React, { useState } from "react";
import { FileSpreadsheet, FileText, Share2, Copy, Check, MessageSquare } from "lucide-react";
import { exportToExcel, exportTableToPDF, openWhatsAppShare } from "@/lib/utils";
import { useData } from "@/context/DataContext";

interface ExportActionsProps {
  title: string;
  moduleKey: string;
  getDataForExcel: () => any[];
  getDataForPDF?: () => { headers: string[]; rows: (string | number)[][] };
  getWhatsAppText?: () => string;
  className?: string;
}

export function ExportActions({
  title,
  moduleKey,
  getDataForExcel,
  getDataForPDF,
  getWhatsAppText,
  className = ""
}: ExportActionsProps) {
  const { logAction } = useData();
  const [copied, setCopied] = useState(false);

  const handleExcelExport = () => {
    try {
      const data = getDataForExcel();
      exportToExcel(data, `${moduleKey}_${new Date().toISOString().split("T")[0]}`);
      logAction("EXPORT_EXCEL", moduleKey, `Exported ${title} to Excel`);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePDFExport = () => {
    try {
      if (getDataForPDF) {
        const { headers, rows } = getDataForPDF();
        exportTableToPDF(title, headers, rows, `${moduleKey}_${new Date().toISOString().split("T")[0]}`);
      } else {
        const data = getDataForExcel();
        if (data.length > 0) {
          const headers = Object.keys(data[0]);
          const rows = data.map(item => headers.map(h => String(item[h] ?? "")));
          exportTableToPDF(title, headers, rows, `${moduleKey}_export`);
        }
      }
      logAction("EXPORT_PDF", moduleKey, `Exported ${title} to PDF`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleWhatsAppShare = () => {
    if (getWhatsAppText) {
      const text = getWhatsAppText();
      openWhatsAppShare(text);
      logAction("CALCULATE", moduleKey, `Shared ${title} via WhatsApp`);
    }
  };

  const handleCopy = () => {
    if (getWhatsAppText) {
      navigator.clipboard.writeText(getWhatsAppText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex items-center flex-wrap gap-2 ${className}`}>
      {/* Excel Button */}
      <button
        onClick={handleExcelExport}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold hover:bg-emerald-500/20 transition-colors shadow-soft"
        title="Export to Excel (.xlsx)"
      >
        <FileSpreadsheet className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Excel</span>
      </button>

      {/* PDF Button */}
      <button
        onClick={handlePDFExport}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold hover:bg-rose-500/20 transition-colors shadow-soft"
        title="Export to PDF"
      >
        <FileText className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">PDF</span>
      </button>

      {/* WhatsApp Share Button */}
      {getWhatsAppText && (
        <button
          onClick={handleWhatsAppShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors shadow-soft"
          title="Share on WhatsApp"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </button>
      )}

      {/* Copy Text Button */}
      {getWhatsAppText && (
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface border border-border text-muted hover:text-foreground text-xs font-semibold transition-colors"
          title="Copy formatted text"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
        </button>
      )}
    </div>
  );
}
