"use client";

import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { ExportActions } from "@/components/common/ExportActions";
import { formatINR } from "@/lib/utils";
import {
  Receipt,
  Calculator,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Sparkles,
  Zap,
  ArrowRight
} from "lucide-react";

export default function ChargesPage() {
  const { chargesData, addRecentlyViewed } = useData();
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [vehicleType, setVehicleType] = useState<"Car" | "SCV" | "LCV/ICV" | "M&HCV" | "Tractor">("Car");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    addRecentlyViewed("charges");
  }, []);

  // Calculate upfront charges
  const pfRate = vehicleType === "Tractor" ? 1.5 : 1.25;
  const processingFee = Math.round((loanAmount * pfRate) / 100);
  const pfGst = Math.round(processingFee * 0.18);

  const docFee = loanAmount <= 500000 ? 1000 : 2000;
  const docGst = Math.round(docFee * 0.18);

  let valuationFee = 1000;
  if (vehicleType === "LCV/ICV") valuationFee = 1200;
  else if (vehicleType === "M&HCV" || vehicleType === "Tractor") valuationFee = 1500;

  const stampDuty = Math.round((loanAmount * 0.6) / 100);
  const cibilReport = 350;
  const rtoFee = 2000;

  const totalDeductions = processingFee + pfGst + docFee + docGst + valuationFee + stampDuty + cibilReport + rtoFee;
  const netDisbursement = Math.max(0, loanAmount - totalDeductions);

  const filteredCharges = chargesData.filter(
    chg => !searchQuery || chg.description.toLowerCase().includes(searchQuery.toLowerCase()) || chg.charges.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getExcelData = () => {
    return chargesData.map(c => ({
      Description: c.description,
      "Schedule of Charges": c.charges,
      "Applicable On": c.applicableOn,
      "GST Applicable": c.gstApplicable ? "Yes (18%)" : "No",
      Notes: c.notes || ""
    }));
  };

  const getWhatsAppSummary = () => {
    return `*KV Flash - Upfront Loan Charges Estimation*\n` +
      `-----------------------------------------\n` +
      `💰 *Sanctioned Loan Amount:* ${formatINR(loanAmount)}\n` +
      `🚗 *Vehicle Category:* ${vehicleType}\n\n` +
      `📋 *Breakdown of Deductions:*\n` +
      ` • Processing Fee (${pfRate}%): ${formatINR(processingFee)} (+ ${formatINR(pfGst)} GST)\n` +
      ` • Document Charges: ${formatINR(docFee)} (+ ${formatINR(docGst)} GST)\n` +
      ` • Valuation Charges: ${formatINR(valuationFee)}\n` +
      ` • Stamp Duty (0.60%): ${formatINR(stampDuty)}\n` +
      ` • CIBIL Check: ${formatINR(cibilReport)}\n` +
      ` • RTO / Hypothecation: ${formatINR(rtoFee)}\n` +
      `-----------------------------------------\n` +
      `🏷️ *Total Upfront Deductions:* *${formatINR(totalDeductions)}*\n` +
      `✅ *Estimated Net Disbursement:* *${formatINR(netDisbursement)}*\n` +
      `-----------------------------------------\n` +
      `_Kredit Venture / Jads Services Pvt Ltd_`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <Receipt className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Module 07</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Schedule of Charges & Total Estimator
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Official vehicle finance fees schedule, statutory stamp duties, bounce charges, and net disbursement calculator.
          </p>
        </div>

        <ExportActions
          title="KV Flash - Schedule of Charges"
          moduleKey="charges_schedule"
          getDataForExcel={getExcelData}
          getWhatsAppText={getWhatsAppSummary}
        />
      </div>

      {/* Upfront Charges & Net Disbursement Estimator */}
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-accent" />
            <h2 className="text-base font-bold text-foreground">Total Charges & Net Disbursement Estimator</h2>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Disbursement Net Cash
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted block mb-1.5">Sanctioned Loan Amount (₹)</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
              className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-foreground tabular-nums focus:outline-none focus:border-accent"
              step="50000"
            />
            <span className="text-[10px] text-muted mt-1 block">{formatINR(loanAmount)}</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted block mb-1.5">Vehicle Type / Segment</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as any)}
              className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:border-accent"
            >
              <option value="Car">Personal / Commercial Car (1.25% PF)</option>
              <option value="SCV">SCV Pickup (1.25% PF)</option>
              <option value="LCV/ICV">LCV / ICV (1.25% PF)</option>
              <option value="M&HCV">M&HCV (1.25% PF)</option>
              <option value="Tractor">Tractor Loan (1.50% PF)</option>
            </select>
          </div>
        </div>

        {/* Breakdown & Result Summary */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="space-y-1.5 text-xs text-muted md:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-card border border-border/40">
                <span className="text-[10px] block">Processing Fee ({pfRate}%)</span>
                <span className="font-bold text-foreground tabular-nums">{formatINR(processingFee + pfGst)}</span>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border/40">
                <span className="text-[10px] block">Document + GST</span>
                <span className="font-bold text-foreground tabular-nums">{formatINR(docFee + docGst)}</span>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border/40">
                <span className="text-[10px] block">Valuation Fee</span>
                <span className="font-bold text-foreground tabular-nums">{formatINR(valuationFee)}</span>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border/40">
                <span className="text-[10px] block">Stamp Duty (0.6%)</span>
                <span className="font-bold text-foreground tabular-nums">{formatINR(stampDuty)}</span>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border/40">
                <span className="text-[10px] block">CIBIL + RTO Assist</span>
                <span className="font-bold text-foreground tabular-nums">{formatINR(cibilReport + rtoFee)}</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <span className="text-[10px] block">Total Deductions</span>
                <span className="font-black tabular-nums">{formatINR(totalDeductions)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-accent/30 text-center flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">Net In Hand to Customer</span>
            <span className="text-2xl font-black text-emerald-400 tabular-nums mt-1">
              {formatINR(netDisbursement)}
            </span>
            <button
              onClick={() => {
                const text = getWhatsAppSummary();
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
              }}
              className="mt-2.5 w-full py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors shadow-soft"
            >
              Share via WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Charges Master Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Schedule of Charges & Fee Master</h3>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search charges..."
              className="w-full bg-card border border-border rounded-xl pl-8 pr-3 py-1 text-xs text-foreground placeholder-muted focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface border-b border-border text-muted font-bold text-[10px] uppercase">
                <th className="p-3.5 sm:p-4">Charge Description</th>
                <th className="p-3.5 sm:p-4">Standard Charges Schedule</th>
                <th className="p-3.5 sm:p-4">Applicable Basis</th>
                <th className="p-3.5 sm:p-4 text-center">GST (18%)</th>
                <th className="p-3.5 sm:p-4">Operational Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredCharges.map((item) => (
                <tr key={item.id} className="hover:bg-surface/40 transition-colors">
                  <td className="p-3.5 sm:p-4 font-bold text-foreground">
                    {item.description}
                  </td>
                  <td className="p-3.5 sm:p-4 font-bold text-accent">
                    {item.charges}
                  </td>
                  <td className="p-3.5 sm:p-4 text-xs text-muted">
                    {item.applicableOn}
                  </td>
                  <td className="p-3.5 sm:p-4 text-center">
                    {item.gstApplicable ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        +18% GST
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted">Exempt / Included</span>
                    )}
                  </td>
                  <td className="p-3.5 sm:p-4 text-xs text-muted">
                    {item.notes || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
