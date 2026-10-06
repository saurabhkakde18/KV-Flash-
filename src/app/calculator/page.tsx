"use client";

import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import {
  calculateEMI,
  generateAmortizationSchedule,
  flatToReducingRate,
  reducingToFlatRate,
  calculateFOIREligibility,
  formatINR,
  exportToExcel,
  exportTableToPDF,
  openWhatsAppShare
} from "@/lib/utils";
import {
  Calculator,
  PieChart as PieChartIcon,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle,
  FileText,
  Share2,
  Download,
  DollarSign,
  ArrowRight,
  Sparkles,
  Zap,
  Sliders,
  HelpCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis
} from "recharts";

export default function CalculatorPage() {
  const { addRecentlyViewed, logAction } = useData();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"emi" | "foir" | "converter">("emi");

  // 1. EMI Calculator State
  const [loanAmount, setLoanAmount] = useState<number>(800000);
  const [interestRate, setInterestRate] = useState<number>(18.0);
  const [tenureMonths, setTenureMonths] = useState<number>(48);
  const [calcCategory, setCalcCategory] = useState<"Used Car" | "SCV Bolero / Pickup" | "Used CV Truck/Bus">("SCV Bolero / Pickup");
  const [calcOwnerNo, setCalcOwnerNo] = useState<number>(1);

  // 2. FOIR Eligibility State
  const [monthlyIncome, setMonthlyIncome] = useState<number>(65000);
  const [existingEmi, setExistingEmi] = useState<number>(12000);
  const [foirPct, setFoirPct] = useState<number>(60);
  const [foirRate, setFoirRate] = useState<number>(18.0);
  const [foirTenure, setFoirTenure] = useState<number>(48);

  // 3. Flat to Reducing State
  const [flatRateInput, setFlatRateInput] = useState<number>(9.5);
  const [convTenure, setConvTenure] = useState<number>(48);

  useEffect(() => {
    addRecentlyViewed("calculator");
  }, []);

  // Compute EMI
  const { emi, totalInterest, totalPayment } = calculateEMI(loanAmount, interestRate, tenureMonths);
  const amortization = generateAmortizationSchedule(loanAmount, interestRate, tenureMonths);

  // Compute FOIR
  const foirResult = calculateFOIREligibility(monthlyIncome, existingEmi, foirPct, foirRate, foirTenure);

  // Compute Converter
  const calculatedReducing = flatToReducingRate(flatRateInput, convTenure);
  const calculatedFlat = reducingToFlatRate(interestRate, tenureMonths);

  // Chart data
  const pieData = [
    { name: "Principal Loan", value: loanAmount, color: "var(--accent-primary)" },
    { name: "Total Interest", value: totalInterest, color: "#10B981" },
  ];

  // WhatsApp Quote Share
  const handleShareEMIQuote = () => {
    const ownerLabel = calcOwnerNo === 1 ? "1st Owner" : calcOwnerNo === 2 ? "2nd Owner" : calcOwnerNo === 3 ? "3rd Owner" : calcOwnerNo === 4 ? "4th Owner" : "5th Owner";
    const text = `*KV Flash - Official Vehicle Loan Quote*\n` +
      `-----------------------------------------\n` +
      `🚗 *Category:* ${calcCategory}\n` +
      `👤 *RC Owner Serial:* *${ownerLabel}*\n` +
      `💰 *Loan Amount:* ${formatINR(loanAmount)}\n` +
      `📈 *Interest Rate (Reducing IRR):* ${interestRate}% p.a.\n` +
      `⏱️ *Loan Tenure:* ${tenureMonths} Months (${(tenureMonths / 12).toFixed(1)} Years)\n\n` +
      `🔥 *Monthly EMI:* *${formatINR(emi)} / month*\n` +
      `💵 *Total Interest Payable:* ${formatINR(totalInterest)}\n` +
      `🏷️ *Total Loan Repayment:* ${formatINR(totalPayment)}\n` +
      `-----------------------------------------\n` +
      `_Generated via KV Flash • Kredit Venture_`;

    openWhatsAppShare(text);
    logAction("CALCULATE", "EMI Calculator", `Generated EMI quote for ${formatINR(loanAmount)} (${ownerLabel})`);
  };

  const handleExportPDF = () => {
    const headers = ["Month", "Opening Balance", "Monthly EMI", "Principal", "Interest", "Closing Balance"];
    const rows = amortization.map(r => [
      `M${r.month}`,
      formatINR(r.openingBalance, false),
      formatINR(r.emi, false),
      formatINR(r.principalPaid, false),
      formatINR(r.interestPaid, false),
      formatINR(r.closingBalance, false),
    ]);

    exportTableToPDF(`KV Flash - Loan Amortization Schedule (${formatINR(loanAmount)})`, headers, rows, `amortization_${loanAmount}_${tenureMonths}m`);
    logAction("EXPORT_PDF", "EMI Calculator", `Exported amortization schedule for ${formatINR(loanAmount)}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Calculator className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Module 08</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            EMI & Eligibility Calculator Suite
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Reducing balance EMI calculator, visual amortization chart, FOIR borrower eligibility & Flat-to-Reducing converter.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface border border-border self-start md:self-auto">
          <button
            onClick={() => setActiveTab("emi")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "emi"
                ? "bg-accent text-white shadow-soft"
                : "text-muted hover:text-foreground"
            }`}
          >
            EMI Calculator
          </button>
          <button
            onClick={() => setActiveTab("foir")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "foir"
                ? "bg-accent text-white shadow-soft"
                : "text-muted hover:text-foreground"
            }`}
          >
            FOIR Eligibility
          </button>
          <button
            onClick={() => setActiveTab("converter")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "converter"
                ? "bg-accent text-white shadow-soft"
                : "text-muted hover:text-foreground"
            }`}
          >
            Flat ↔ IRR
          </button>
        </div>
      </div>

      {/* 1. EMI CALCULATOR TAB */}
      {activeTab === "emi" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Sliders & Controls */}
            <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-accent" />
                  <h2 className="text-base font-bold text-foreground">Loan Parameters</h2>
                </div>
                <span className="text-xs text-muted font-medium">Reducing Balance Model</span>
              </div>

              {/* Category & Owner Serial No. Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-surface/70 border border-border/80">
                <div>
                  <label className="text-xs font-bold text-muted block mb-1.5">Vehicle Category</label>
                  <select
                    value={calcCategory}
                    onChange={(e) => setCalcCategory(e.target.value as any)}
                    className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
                  >
                    <option value="SCV Bolero / Pickup">SCV Bolero / Pickup (Max 5th Owner)</option>
                    <option value="Used Car">Used Passenger Car (Max 4th Owner)</option>
                    <option value="Used CV Truck/Bus">Used Commercial Truck / Bus (Max 5th Owner)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted block mb-1.5">RC Owner Serial No.</label>
                  <select
                    value={calcOwnerNo}
                    onChange={(e) => setCalcOwnerNo(Number(e.target.value))}
                    className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
                  >
                    <option value={1}>1st Owner (Fresh Used)</option>
                    <option value={2}>2nd Owner</option>
                    <option value={3}>3rd Owner</option>
                    <option value={4}>4th Owner (Max for Cars)</option>
                    <option value={5}>5th Owner (Bolero / SCV / CV)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  {calcCategory === "Used Car" && calcOwnerNo > 4 ? (
                    <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>⚠️ <strong>Policy Warning:</strong> Private Cars are permitted up to 4th Owner only. 5th Owner requires L2 RCM deviation sanction.</span>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>✅ <strong>Ownership Policy Compliant:</strong> {calcOwnerNo === 1 ? '1st' : calcOwnerNo === 2 ? '2nd' : calcOwnerNo === 3 ? '3rd' : calcOwnerNo === 4 ? '4th' : '5th'} owner is eligible under standard {calcCategory} underwriting limits.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Loan Amount Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-muted">Required Loan Amount</label>
                  <span className="text-base font-black text-foreground tabular-nums">
                    {formatINR(loanAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="5000000"
                  step="25000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-[10px] text-muted font-mono">
                  <span>₹ 50,000</span>
                  <span>₹ 25 Lakhs</span>
                  <span>₹ 50 Lakhs</span>
                </div>
              </div>

              {/* Interest Rate Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-muted">Annual Interest Rate (Reducing IRR)</label>
                  <span className="text-base font-black text-accent tabular-nums">
                    {interestRate}% p.a.
                  </span>
                </div>
                <input
                  type="range"
                  min="12.0"
                  max="26.0"
                  step="0.25"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-[10px] text-muted font-mono">
                  <span>12.0%</span>
                  <span>18.0% (Standard)</span>
                  <span>26.0%</span>
                </div>
              </div>

              {/* Tenure Selector */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-muted">Loan Tenure (Months)</label>
                  <span className="text-base font-black text-foreground tabular-nums">
                    {tenureMonths} Months ({(tenureMonths / 12).toFixed(1)} Yrs)
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[12, 24, 36, 48, 60].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTenureMonths(t)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        tenureMonths === t
                          ? "bg-accent text-white shadow-soft"
                          : "bg-surface border border-border text-muted hover:text-foreground"
                      }`}
                    >
                      {t} M
                    </button>
                  ))}
                </div>
              </div>

              {/* Flat Rate Equivalent Note */}
              <div className="p-3 rounded-2xl bg-surface border border-border/60 flex items-center justify-between text-xs text-muted">
                <span>Equivalent Flat Interest Rate:</span>
                <strong className="text-accent font-mono text-sm">{calculatedFlat}% Flat</strong>
              </div>
            </div>

            {/* Output EMI Card & Pie Breakdown */}
            <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-surface to-card border border-accent/30">
                  <span className="text-[11px] font-bold text-accent uppercase tracking-wider block">Monthly EMI Payable</span>
                  <span className="text-3xl sm:text-4xl font-black text-foreground tabular-nums mt-1 block">
                    {formatINR(emi)}
                  </span>
                  <span className="text-[11px] text-muted font-medium mt-0.5 block">per month for {tenureMonths} months</span>
                </div>

                <div className="space-y-2 text-xs pt-2">
                  <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted">Principal Amount:</span>
                    <span className="font-bold text-foreground tabular-nums">{formatINR(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted">Total Interest Payable:</span>
                    <span className="font-bold text-emerald-400 tabular-nums">{formatINR(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted">Total Repayment (P + I):</span>
                    <span className="font-bold text-foreground tabular-nums">{formatINR(totalPayment)}</span>
                  </div>
                </div>

                {/* Donut Chart */}
                <div className="h-36 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={54}
                        paddingAngle={4}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: number) => formatINR(val)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleShareEMIQuote}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors shadow-soft flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> Share Quote on WhatsApp
                </button>
                <button
                  onClick={handleExportPDF}
                  className="w-full py-2 px-4 rounded-xl bg-surface border border-border text-foreground font-semibold text-xs hover:bg-elevated transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" /> Download Amortization PDF
                </button>
              </div>
            </div>
          </div>

          {/* Amortization Schedule Table */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft">
            <div className="p-4 sm:p-5 bg-surface border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Monthly Amortization Schedule</h3>
                <p className="text-xs text-muted">Complete breakdown of principal vs interest payment month by month</p>
              </div>
              <button
                onClick={() => exportToExcel(amortization, `amortization_${loanAmount}`)}
                className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-foreground hover:bg-elevated"
              >
                Export Excel
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-surface z-10">
                  <tr className="border-b border-border text-muted font-bold text-[10px] uppercase">
                    <th className="p-3">Month</th>
                    <th className="p-3">Opening Balance</th>
                    <th className="p-3">EMI Amount</th>
                    <th className="p-3">Principal Paid</th>
                    <th className="p-3">Interest Paid</th>
                    <th className="p-3">Closing Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {amortization.map((row) => (
                    <tr key={row.month} className="hover:bg-surface/40 transition-colors">
                      <td className="p-3 font-bold text-accent">Month {row.month}</td>
                      <td className="p-3 tabular-nums text-muted">{formatINR(row.openingBalance)}</td>
                      <td className="p-3 tabular-nums font-bold text-foreground">{formatINR(row.emi)}</td>
                      <td className="p-3 tabular-nums text-emerald-400 font-semibold">{formatINR(row.principalPaid)}</td>
                      <td className="p-3 tabular-nums text-muted">{formatINR(row.interestPaid)}</td>
                      <td className="p-3 tabular-nums font-bold text-foreground">{formatINR(row.closingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. FOIR ELIGIBILITY TAB */}
      {activeTab === "foir" && (
        <div className="bg-card border border-border rounded-3xl p-5 sm:p-8 shadow-soft space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <TrendingUp className="w-5 h-5 text-accent" />
            <div>
              <h2 className="text-base font-bold text-foreground">FOIR (Fixed Obligation to Income Ratio) Calculator</h2>
              <p className="text-xs text-muted">Estimate maximum loan amount a borrower can safely service under Kredit Venture credit norms</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-semibold text-muted block mb-1.5">Net Monthly Income (₹)</label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value)))}
                className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground tabular-nums focus:outline-none focus:border-accent"
                step="5000"
              />
              <span className="text-[10px] text-muted mt-1 block">{formatINR(monthlyIncome)}</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted block mb-1.5">Existing Monthly EMIs / Obligations (₹)</label>
              <input
                type="number"
                value={existingEmi}
                onChange={(e) => setExistingEmi(Math.max(0, Number(e.target.value)))}
                className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground tabular-nums focus:outline-none focus:border-accent"
                step="1000"
              />
              <span className="text-[10px] text-muted mt-1 block">{formatINR(existingEmi)}</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted block mb-1.5">Allowable FOIR Cap (%)</label>
              <select
                value={foirPct}
                onChange={(e) => setFoirPct(Number(e.target.value))}
                className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent"
              >
                <option value={50}>50% (Conservative / Low CIBIL)</option>
                <option value={60}>60% (Standard KV Policy)</option>
                <option value={65}>65% (High Income &gt; ₹50k)</option>
                <option value={70}>70% (Corporate / Large Fleet)</option>
              </select>
            </div>
          </div>

          {/* Result Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-surface via-card to-surface border border-accent/40 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left items-center">
            <div>
              <span className="text-xs font-bold text-muted uppercase tracking-wider block">Max Allowable EMI (FOIR)</span>
              <span className="text-2xl font-black text-foreground tabular-nums mt-1 block">
                {formatINR(foirResult.maxAllowableEmi)}
              </span>
              <span className="text-[11px] text-muted">{foirPct}% of ₹{monthlyIncome}</span>
            </div>

            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-wider block">Available EMI for New Loan</span>
              <span className="text-2xl font-black text-accent tabular-nums mt-1 block">
                {formatINR(foirResult.availableEmiForNewLoan)}
              </span>
              <span className="text-[11px] text-muted">After ₹{existingEmi} obligations</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Max Eligible Loan Amount</span>
              <span className="text-3xl font-black text-emerald-400 tabular-nums mt-1 block">
                {formatINR(foirResult.eligibleLoanAmount)}
              </span>
              <span className="text-[10px] text-muted">@ {foirRate}% for {foirTenure} Months</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. FLAT TO REDUCING CONVERTER */}
      {activeTab === "converter" && (
        <div className="bg-card border border-border rounded-3xl p-5 sm:p-8 shadow-soft space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Percent className="w-5 h-5 text-accent" />
            <div>
              <h2 className="text-base font-bold text-foreground">Flat Interest Rate ↔ Reducing IRR Rate Converter</h2>
              <p className="text-xs text-muted">Convert between flat quotation rates and true reducing balance IRR schedules</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Flat to Reducing */}
            <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
              <h3 className="text-sm font-bold text-foreground">Convert Flat Rate → Reducing IRR</h3>
              <div>
                <label className="text-xs text-muted block mb-1">Enter Flat Rate (% p.a.)</label>
                <input
                  type="number"
                  value={flatRateInput}
                  onChange={(e) => setFlatRateInput(Number(e.target.value))}
                  className="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground tabular-nums focus:outline-none"
                  step="0.1"
                />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">Tenure (Months)</label>
                <select
                  value={convTenure}
                  onChange={(e) => setConvTenure(Number(e.target.value))}
                  className="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none"
                >
                  <option value={12}>12 Months (1 Year)</option>
                  <option value={24}>24 Months (2 Years)</option>
                  <option value={36}>36 Months (3 Years)</option>
                  <option value={48}>48 Months (4 Years)</option>
                  <option value={60}>60 Months (5 Years)</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-accent-muted border border-accent/30 text-center">
                <span className="text-[11px] font-bold text-accent uppercase block">Approximate Reducing IRR Rate</span>
                <span className="text-3xl font-black text-foreground tabular-nums mt-1 block">
                  {calculatedReducing}% p.a.
                </span>
              </div>
            </div>

            {/* Quick Multiplier Reference */}
            <div className="p-5 rounded-2xl bg-surface border border-border space-y-3 text-xs text-muted">
              <h3 className="text-sm font-bold text-foreground">Standard Multiplier Reference Guide</h3>
              <p>Because flat interest ignores principal amortization over time, the effective reducing rate is approximately 1.8x to 1.95x higher than the flat rate.</p>
              
              <div className="space-y-1.5 pt-2 font-mono text-[11px]">
                <div className="flex justify-between p-2 rounded bg-card border border-border/40">
                  <span>12 Months Tenure:</span>
                  <strong className="text-foreground">IRR ≈ Flat × 1.846</strong>
                </div>
                <div className="flex justify-between p-2 rounded bg-card border border-border/40">
                  <span>24 Months Tenure:</span>
                  <strong className="text-foreground">IRR ≈ Flat × 1.920</strong>
                </div>
                <div className="flex justify-between p-2 rounded bg-card border border-border/40">
                  <span>36 Months Tenure:</span>
                  <strong className="text-foreground">IRR ≈ Flat × 1.946</strong>
                </div>
                <div className="flex justify-between p-2 rounded bg-card border border-border/40">
                  <span>48 Months Tenure:</span>
                  <strong className="text-foreground">IRR ≈ Flat × 1.959</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
