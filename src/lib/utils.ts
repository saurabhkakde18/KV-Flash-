import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number according to the Indian numbering system.
 * e.g. 1234567 -> "₹ 12,34,567"
 */
export function formatINR(amount: number | string | undefined | null, showSymbol = true): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) return showSymbol ? "₹ 0" : "0";
  const num = Number(amount);
  const isNegative = num < 0;
  const absVal = Math.abs(num);

  const rounded = Math.round(absVal * 100) / 100;
  const parts = rounded.toString().split(".");
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 ? `.${parts[1].padEnd(2, "0").slice(0, 2)}` : "";

  // Indian comma formatting: last 3 digits, then groups of 2
  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    integerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  }

  const result = `${integerPart}${decimalPart}`;
  return `${isNegative ? "-" : ""}${showSymbol ? "₹ " : ""}${result}`;
}

/**
 * Formats amount in Lakhs or Crores for quick badges
 */
export function formatLakhs(amountInLacs: number): string {
  if (amountInLacs >= 100) {
    return `₹ ${(amountInLacs / 100).toFixed(2)} Cr`;
  }
  return `₹ ${amountInLacs.toFixed(2)} Lacs`;
}

/**
 * Calculate reducing balance EMI
 * P = Principal, r = monthly interest rate (annual / 12 / 100), n = tenure in months
 */
export function calculateEMI(principal: number, annualRatePct: number, tenureMonths: number): {
  emi: number;
  totalInterest: number;
  totalPayment: number;
} {
  if (principal <= 0 || tenureMonths <= 0) {
    return { emi: 0, totalInterest: 0, totalPayment: 0 };
  }
  if (annualRatePct <= 0) {
    const emi = Math.round(principal / tenureMonths);
    return { emi, totalInterest: 0, totalPayment: principal };
  }

  const r = annualRatePct / (12 * 100);
  const emi = Math.round((principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1));
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;

  return {
    emi,
    totalInterest: Math.max(0, totalInterest),
    totalPayment: Math.max(principal, totalPayment),
  };
}

/**
 * Generate complete amortization schedule
 */
export interface AmortizationRow {
  month: number;
  openingBalance: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

export function generateAmortizationSchedule(principal: number, annualRatePct: number, tenureMonths: number): AmortizationRow[] {
  const { emi } = calculateEMI(principal, annualRatePct, tenureMonths);
  if (emi === 0) return [];

  const r = annualRatePct / (12 * 100);
  let balance = principal;
  const schedule: AmortizationRow[] = [];

  for (let m = 1; m <= tenureMonths; m++) {
    const interest = Math.round(balance * r);
    const principalPaid = Math.min(balance, emi - interest);
    const closingBalance = Math.max(0, balance - principalPaid);

    schedule.push({
      month: m,
      openingBalance: Math.round(balance),
      emi,
      principalPaid,
      interestPaid: interest,
      closingBalance: Math.round(closingBalance),
    });

    balance = closingBalance;
    if (balance <= 0) break;
  }

  return schedule;
}

/**
 * Convert Flat Rate to approximate Reducing IRR Rate
 * Rule of thumb: Reducing IRR ≈ Flat Rate * (2 * n / (n + 1))
 */
export function flatToReducingRate(flatRatePct: number, tenureMonths: number): number {
  if (tenureMonths <= 0 || flatRatePct <= 0) return 0;
  const multiplier = (2 * tenureMonths) / (tenureMonths + 1);
  return Number((flatRatePct * multiplier).toFixed(2));
}

/**
 * Convert Reducing IRR to Flat Rate
 */
export function reducingToFlatRate(reducingRatePct: number, tenureMonths: number): number {
  if (tenureMonths <= 0 || reducingRatePct <= 0) return 0;
  const multiplier = (2 * tenureMonths) / (tenureMonths + 1);
  return Number((reducingRatePct / multiplier).toFixed(2));
}

/**
 * Calculate Max Loan Eligibility based on FOIR
 */
export function calculateFOIREligibility(
  monthlyIncome: number,
  existingEmi: number,
  foirPct: number,
  annualRatePct: number,
  tenureMonths: number
): {
  maxAllowableEmi: number;
  availableEmiForNewLoan: number;
  eligibleLoanAmount: number;
} {
  const maxAllowableEmi = Math.round((monthlyIncome * foirPct) / 100);
  const availableEmiForNewLoan = Math.max(0, maxAllowableEmi - existingEmi);

  if (availableEmiForNewLoan <= 0 || annualRatePct <= 0 || tenureMonths <= 0) {
    return { maxAllowableEmi, availableEmiForNewLoan, eligibleLoanAmount: 0 };
  }

  const r = annualRatePct / (12 * 100);
  // P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
  const factor = (Math.pow(1 + r, tenureMonths) - 1) / (r * Math.pow(1 + r, tenureMonths));
  const eligibleLoanAmount = Math.round(availableEmiForNewLoan * factor);

  return {
    maxAllowableEmi,
    availableEmiForNewLoan,
    eligibleLoanAmount,
  };
}

/**
 * Export structured JSON data to Excel (.xlsx)
 */
export function exportToExcel(data: any[], fileName: string, sheetName = "DataSheet") {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

/**
 * Export table to PDF
 */
export function exportTableToPDF(title: string, headers: string[], rows: (string | number)[][], fileName: string) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.setTextColor(20, 30, 50);
  doc.text(title, 14, 18);
  doc.setFontSize(9);
  doc.setTextColor(100, 110, 120);
  doc.text(`KV Flash (Kredit Venture) | Generated on ${new Date().toLocaleString('en-IN')}`, 14, 25);

  autoTable(doc, {
    startY: 30,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 3 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  doc.save(`${fileName}.pdf`);
}

/**
 * Generate formatted WhatsApp message for quotes
 */
export function openWhatsAppShare(text: string, phone = "") {
  const encodedText = encodeURIComponent(text);
  const url = phone ? `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`;
  window.open(url, "_blank");
}
