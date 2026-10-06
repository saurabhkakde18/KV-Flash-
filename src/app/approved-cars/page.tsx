"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { ExportActions } from "@/components/common/ExportActions";
import { APPROVED_CARS_DATA } from "@/lib/constants";
import { formatINR } from "@/lib/utils";
import {
  CheckCircle2,
  Search,
  Filter,
  Car,
  Sparkles,
  AlertTriangle,
  Info,
  ShieldCheck,
  Zap,
  ArrowRight,
  UserCheck,
  Fuel,
  Layers,
  Sliders,
  ExternalLink,
  Calculator,
  Gauge,
  Grid,
  FileSpreadsheet,
  TrendingUp,
  FileText,
  BadgeCheck,
  Settings,
  HelpCircle,
  Clock,
  ArrowUpRight
} from "lucide-react";

// Variant families for top approved models
const CAR_VARIANTS_MAP: Record<string, { variants: string[]; defaultBaseLacs: number; segment: string }> = {
  "Hyundai Creta": { variants: ["E", "EX", "S", "SX", "SX Executive", "SX (O)", "Knight Edition", "N Line"], defaultBaseLacs: 14.5, segment: "SUV" },
  "Hyundai Venue": { variants: ["E", "S", "S+", "S(O)", "SX", "SX(O)", "N Line"], defaultBaseLacs: 10.8, segment: "Compact SUV" },
  "Hyundai I 20": { variants: ["Magna", "Sportz", "Asta", "Asta (O)", "N Line N6", "N Line N8"], defaultBaseLacs: 9.2, segment: "Premium Hatchback" },
  "Hyundai Grand I 10": { variants: ["Era", "Magna", "Sportz", "Asta"], defaultBaseLacs: 7.2, segment: "Hatchback" },
  "Hyundai Aura": { variants: ["E", "S", "SX", "SX(+)", "SX(O)"], defaultBaseLacs: 8.4, segment: "Sedan" },
  "Hyundai Verna": { variants: ["EX", "S", "SX", "SX(O)", "Turbo"], defaultBaseLacs: 13.8, segment: "Sedan" },
  "Hyundai Xcent": { variants: ["Base", "S", "SX", "SX (O)"], defaultBaseLacs: 6.8, segment: "Sedan" },
  "Hyundai I 10": { variants: ["D-Lite", "Era", "Magna", "Sportz", "Asta"], defaultBaseLacs: 5.2, segment: "Hatchback" },

  "Maruti Swift": { variants: ["LXi", "VXi", "ZXi", "ZXi+"], defaultBaseLacs: 7.8, segment: "Hatchback" },
  "Maruti Swift Dzire": { variants: ["LXi", "VXi", "ZXi", "ZXi+"], defaultBaseLacs: 8.5, segment: "Sedan" },
  "Maruti Baleno": { variants: ["Sigma", "Delta", "Zeta", "Alpha"], defaultBaseLacs: 8.6, segment: "Premium Hatchback" },
  "Maruti Ertiga": { variants: ["LXi", "VXi", "ZXi", "ZXi+"], defaultBaseLacs: 11.2, segment: "MUV" },
  "Maruti Brezza": { variants: ["LXi", "VXi", "ZXi", "ZXi+"], defaultBaseLacs: 11.0, segment: "Compact SUV" },
  "Maruti Vitara Brezza": { variants: ["LDi", "VDi", "ZDi", "ZDi+"], defaultBaseLacs: 9.8, segment: "Compact SUV" },
  "Maruti Wagon R": { variants: ["LXi 1.0", "VXi 1.0", "ZXi 1.2", "ZXi+ 1.2"], defaultBaseLacs: 6.5, segment: "Hatchback" },
  "Maruti Alto": { variants: ["Std", "LXi", "VXi"], defaultBaseLacs: 4.2, segment: "Entry Hatchback" },
  "Maruti Alto 800": { variants: ["Std", "LXi", "VXi"], defaultBaseLacs: 4.4, segment: "Entry Hatchback" },
  "Maruti Alto K 10": { variants: ["Std", "LXi", "VXi", "VXi+"], defaultBaseLacs: 5.0, segment: "Hatchback" },
  "Maruti Ciaz": { variants: ["Sigma", "Delta", "Zeta", "Alpha"], defaultBaseLacs: 10.5, segment: "Sedan" },
  "Maruti Eeco": { variants: ["5 Seater Std", "7 Seater Std", "5 Seater AC", "Cargo"], defaultBaseLacs: 5.8, segment: "Van / MUV" },
  "Maruti Omni": { variants: ["5 Seater", "8 Seater", "Cargo Van"], defaultBaseLacs: 3.2, segment: "Van" },
  "Maruti Celerio": { variants: ["LXi", "VXi", "ZXi", "ZXi+"], defaultBaseLacs: 6.2, segment: "Hatchback" },
  "Maruti Ignis": { variants: ["Sigma", "Delta", "Zeta", "Alpha"], defaultBaseLacs: 7.0, segment: "Hatchback" },
  "Maruti S-Presso": { variants: ["Std", "LXi", "VXi", "VXi+"], defaultBaseLacs: 5.2, segment: "Mini SUV" },
  "Maruti S Cross": { variants: ["Sigma", "Delta", "Zeta", "Alpha"], defaultBaseLacs: 10.8, segment: "Crossover SUV" },
  "Maruti XL 6": { variants: ["Zeta", "Alpha", "Alpha+"], defaultBaseLacs: 13.0, segment: "Premium MPV" },

  "Tata Nexon": { variants: ["Smart", "Pure", "Creative", "Fearless", "XZ+", "XZA+"], defaultBaseLacs: 12.5, segment: "Compact SUV" },
  "Tata Punch": { variants: ["Pure", "Adventure", "Accomplished", "Creative"], defaultBaseLacs: 8.2, segment: "Micro SUV" },
  "Tata Harrier": { variants: ["Smart", "Pure", "Adventure", "Fearless", "XZ+", "Dark"], defaultBaseLacs: 18.5, segment: "SUV" },
  "Tata Tiago": { variants: ["XE", "XM", "XT", "XZ", "XZ+"], defaultBaseLacs: 6.8, segment: "Hatchback" },
  "Tata Tigor": { variants: ["XE", "XM", "XT", "XZ", "XZ+"], defaultBaseLacs: 7.6, segment: "Sedan" },
  "Tata Altroz": { variants: ["XE", "XM", "XT", "XZ", "XZ+", "Racer"], defaultBaseLacs: 8.8, segment: "Premium Hatchback" },
  "Tata Hexa": { variants: ["XE", "XM", "XT", "XTA 4x4"], defaultBaseLacs: 14.5, segment: "SUV / MUV" },
  "Tata Bolt": { variants: ["XE", "XM", "XMS", "XT"], defaultBaseLacs: 5.5, segment: "Hatchback" },

  "Mahindra Scorpio N": { variants: ["Z2", "Z4", "Z6", "Z8", "Z8 Select", "Z8L 4x4"], defaultBaseLacs: 19.5, segment: "SUV" },
  "Mahindra Scorpio S 11": { variants: ["Classic S", "Classic S11", "S11 7-Str"], defaultBaseLacs: 16.5, segment: "SUV" },
  "Mahindra Scorpio S 10": { variants: ["S4", "S6", "S8", "S10 4WD"], defaultBaseLacs: 13.5, segment: "SUV" },
  "Mahindra Thar": { variants: ["AX(O) RWD", "LX RWD", "LX 4WD Hardtop", "Earth Edition"], defaultBaseLacs: 15.5, segment: "Lifestyle SUV" },
  "Mahindra XUV 700": { variants: ["MX", "AX3", "AX5", "AX7", "AX7L AWD"], defaultBaseLacs: 20.5, segment: "Premium SUV" },
  "Mahindra XUV 300": { variants: ["W4", "W6", "W8", "W8(O)", "Turbosport"], defaultBaseLacs: 11.5, segment: "Compact SUV" },
  "Mahindra Bolero": { variants: ["B4", "B6", "B6(O)", "Neo N4", "Neo N8", "Neo N10"], defaultBaseLacs: 9.8, segment: "Utility / MUV" },

  "Toyota Fortuner": { variants: ["4x2 MT", "4x2 AT", "4x4 MT", "4x4 AT", "Legender", "GR-S"], defaultBaseLacs: 38.0, segment: "Full Size SUV" },
  "Toyota Innova Crysta": { variants: ["GX 7S", "GX 8S", "VX", "ZX 7S", "Touring Sport"], defaultBaseLacs: 22.5, segment: "Premium MUV" },
  "Toyota Innova": { variants: ["E", "G", "GX", "VX", "ZX"], defaultBaseLacs: 15.0, segment: "MUV" },
  "Toyota Hyryder": { variants: ["E", "S", "G", "V", "Strong Hybrid G", "Strong Hybrid V"], defaultBaseLacs: 16.8, segment: "Hybrid SUV" },
  "Toyota Glanza": { variants: ["E", "S", "G", "V"], defaultBaseLacs: 8.8, segment: "Premium Hatchback" },
  "Toyota Urban Cruiser": { variants: ["Mid", "High", "Premium"], defaultBaseLacs: 10.5, segment: "Compact SUV" },
  "Toyota Etios": { variants: ["GD", "VD", "VXD", "Platinum", "Liva (Yellow Board)"], defaultBaseLacs: 7.0, segment: "Commercial Sedan" },

  "Honda City": { variants: ["SV", "V", "VX", "ZX", "e:HEV Hybrid"], defaultBaseLacs: 14.2, segment: "Sedan" },
  "Honda Amaze": { variants: ["E", "S", "V", "VX"], defaultBaseLacs: 8.5, segment: "Sedan" },
  "Honda WR-V": { variants: ["SV", "V", "VX"], defaultBaseLacs: 10.2, segment: "Compact SUV" },

  "Kia Seltos": { variants: ["HTE", "HTK", "HTK+", "HTX", "HTX+", "GTX+", "X-Line"], defaultBaseLacs: 15.2, segment: "SUV" },
  "Kia Sonet": { variants: ["HTE", "HTK", "HTK+", "HTX", "HTX+", "GTX+", "X-Line"], defaultBaseLacs: 11.2, segment: "Compact SUV" },

  "Jeep Compass": { variants: ["Sport", "Longitude", "Night Eagle", "Limited", "Model S 4x4"], defaultBaseLacs: 24.0, segment: "Premium SUV" },
  "Renault Kwid": { variants: ["RXE", "RXL", "RXT", "Climber"], defaultBaseLacs: 5.4, segment: "Hatchback" }
};

// Base depreciation decay curve by vehicle age (Years 2024 back to 2011)
const YEAR_DEPRECIATION_FACTOR: Record<number, number> = {
  2024: 0.88, // 1st year (12% drop)
  2023: 0.79, // 2nd year
  2022: 0.70, // 3rd year
  2021: 0.62, // 4th year
  2020: 0.54, // 5th year
  2019: 0.47, // 6th year
  2018: 0.41, // 7th year
  2017: 0.35, // 8th year
  2016: 0.30, // 9th year
  2015: 0.25, // 10th year
  2014: 0.21, // 11th year
  2013: 0.17, // 12th year (EOT threshold for cars)
  2012: 0.14, // 13th year
  2011: 0.11  // 14th year
};

export default function ApprovedCarsPage() {
  const { addRecentlyViewed } = useData();
  const [activeView, setActiveView] = useState<"matrix" | "calculator" | "models" | "policy">("calculator");

  // Top Quick Finder state
  const [quickModel, setQuickModel] = useState("Hyundai Creta");
  const [quickYear, setQuickYear] = useState(2021);
  const [quickKmRange, setQuickKmRange] = useState("Under 20k km (~15,000 km)");
  const [quickOwner, setQuickOwner] = useState(1);

  // Full Calculator State
  const [calcModel, setCalcModel] = useState("Hyundai Creta");
  const [calcVariant, setCalcVariant] = useState("SX");
  const [calcTransmission, setCalcTransmission] = useState<"Manual" | "Automatic">("Manual");
  const [calcYear, setCalcYear] = useState<number>(2021);
  const [calcOwner, setCalcOwner] = useState<number>(1);
  const [calcFuel, setCalcFuel] = useState("Diesel");
  const [calcKms, setCalcKms] = useState<number>(15000);
  const [calcHealth, setCalcHealth] = useState<"Excellent" | "Good" | "Fair">("Good");
  const [carWaleOverride, setCarWaleOverride] = useState<string>("");

  // Grid Matrix Filters
  const [matrixOem, setMatrixOem] = useState("All");
  const [matrixSearch, setMatrixSearch] = useState("");
  const [matrixOwnerFilter, setMatrixOwnerFilter] = useState("All");

  useEffect(() => {
    addRecentlyViewed("approved-cars");
  }, []);

  // Update variants when model changes
  const availableVariants = useMemo(() => {
    const config = CAR_VARIANTS_MAP[calcModel];
    return config?.variants || ["Base", "Mid", "Top"];
  }, [calcModel]);

  useEffect(() => {
    if (!availableVariants.includes(calcVariant)) {
      setCalcVariant(availableVariants[0] || "SX");
    }
  }, [availableVariants, calcVariant]);

  // Real-time valuation computation algorithm
  const computeValuation = (
    modelName: string,
    variantName: string,
    year: number,
    ownerNo: number,
    transmission: "Manual" | "Automatic",
    fuel: string,
    kms: number,
    health: "Excellent" | "Good" | "Fair",
    overrideStr?: string
  ) => {
    if (overrideStr && Number(overrideStr) > 0) {
      const valLacs = Number(overrideStr);
      return {
        fairValueLacs: valLacs,
        fairValueRupees: Math.round(valLacs * 100000),
        loanCap85: Number((valLacs * 0.85).toFixed(2)),
        loanCap90: Number((valLacs * 0.90).toFixed(2)),
        isOverride: true,
        kmAdjustmentPct: 0,
        ownerMultiplier: 1
      };
    }

    const carConfig = CAR_VARIANTS_MAP[modelName] || { defaultBaseLacs: 10.0, variants: [] };
    let baseLacs = carConfig.defaultBaseLacs;

    // Variant tier adjustment (-15% for base to +20% for top variant)
    const varIdx = carConfig.variants.indexOf(variantName);
    const varTotal = Math.max(1, carConfig.variants.length - 1);
    const variantMultiplier = varIdx >= 0 ? 0.85 + (varIdx / varTotal) * 0.35 : 1.0;
    baseLacs *= variantMultiplier;

    // Transmission: Auto adds +7%
    if (transmission === "Automatic") baseLacs *= 1.07;

    // Fuel adjustment
    if (fuel === "Diesel") baseLacs *= 1.05;
    else if (fuel === "CNG") baseLacs *= 1.02;

    // Age depreciation
    const depFactor = YEAR_DEPRECIATION_FACTOR[year] || 0.5;
    let currentVal = baseLacs * depFactor;

    // Odometer Mileage adjustment:
    // Expected standard benchmark: 11,000 km/year
    const carAgeYears = Math.max(1, 2024 - year + 1);
    const benchmarkKm = carAgeYears * 11000;
    let kmAdjustmentPct = 0;

    if (kms < benchmarkKm * 0.5) {
      kmAdjustmentPct = 5; // Low running premium
    } else if (kms < benchmarkKm * 0.8) {
      kmAdjustmentPct = 2.5;
    } else if (kms > benchmarkKm * 1.5) {
      kmAdjustmentPct = -8; // High running deduction
    } else if (kms > benchmarkKm * 1.2) {
      kmAdjustmentPct = -4;
    }

    currentVal *= (1 + kmAdjustmentPct / 100);

    // Owner sequence multiplier (1st = 100%, 2nd = 95%, 3rd = 90%, 4th = 84%, 5th = 78%)
    const ownerMultipliers: Record<number, number> = { 1: 1.0, 2: 0.95, 3: 0.90, 4: 0.84, 5: 0.78, 6: 0.70 };
    const ownerMult = ownerMultipliers[ownerNo] || 0.85;
    currentVal *= ownerMult;

    // Vehicle condition health
    if (health === "Excellent") currentVal *= 1.04;
    else if (health === "Fair") currentVal *= 0.93;

    const roundedVal = Number(currentVal.toFixed(2));

    return {
      fairValueLacs: roundedVal,
      fairValueRupees: Math.round(roundedVal * 100000),
      loanCap85: Number((roundedVal * 0.85).toFixed(2)),
      loanCap90: Number((roundedVal * 0.90).toFixed(2)),
      isOverride: false,
      kmAdjustmentPct,
      ownerMultiplier: ownerMult
    };
  };

  // Quick strip valuation
  const quickKmEstimate = quickKmRange.includes("Under 20k") ? 15000 : quickKmRange.includes("20k - 40k") ? 30000 : quickKmRange.includes("40k - 60k") ? 50000 : 75000;
  const quickResult = computeValuation(quickModel, "SX", quickYear, quickOwner, "Manual", "Diesel", quickKmEstimate, "Good");

  // Full Calculator valuation
  const detailedResult = computeValuation(
    calcModel,
    calcVariant,
    calcYear,
    calcOwner,
    calcTransmission,
    calcFuel,
    calcKms,
    calcHealth,
    carWaleOverride
  );

  // Sync quick finder changes to full calculator
  const handleApplyQuickToCalc = () => {
    setCalcModel(quickModel);
    setCalcYear(quickYear);
    setCalcOwner(quickOwner);
    setCalcKms(quickKmEstimate);
    setActiveView("calculator");
  };

  const yearsList = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011];
  const oemList = ["All", "Maruti", "Hyundai", "Tata", "Toyota", "Mahindra", "Honda", "Kia", "Jeep", "Renault"];

  const filteredGridCars = APPROVED_CARS_DATA.filter(car => {
    const matchOem = matrixOem === "All" || car.oem.toLowerCase() === matrixOem.toLowerCase();
    const matchOwner = matrixOwnerFilter === "All" || car.maxOwner === matrixOwnerFilter;
    const matchQ = !matrixSearch || car.asset.toLowerCase().includes(matrixSearch.toLowerCase()) || car.oem.toLowerCase().includes(matrixSearch.toLowerCase());
    return matchOem && matchOwner && matchQ;
  });

  const getExcelData = () => {
    return APPROVED_CARS_DATA.map(c => {
      const res2024 = computeValuation(c.asset.replace("Maruti ", "Maruti ").replace("Toyota ", "Toyota "), "Standard", 2024, 1, "Manual", "Petrol", 10000, "Good");
      const res2022 = computeValuation(c.asset, "Standard", 2022, 1, "Manual", "Petrol", 25000, "Good");
      const res2020 = computeValuation(c.asset, "Standard", 2020, 1, "Manual", "Petrol", 45000, "Good");

      return {
        "S No": c.sNo,
        Status: c.status,
        OEM: c.oem,
        "Vehicle Asset / Model": c.asset,
        "Max Owner Permitted": c.maxOwner || "Up to 4th Owner",
        Segment: c.segment || "Passenger Car",
        "Fuel Type": c.fuelType || "Petrol / Diesel",
        "2024 Valuation (₹L)": res2024.fairValueLacs,
        "2022 Valuation (₹L)": res2022.fairValueLacs,
        "2020 Valuation (₹L)": res2020.fairValueLacs,
        "85% Loan Cap 2022 (₹L)": res2022.loanCap85,
        Remarks: c.notes || "Standard Eligible"
      };
    });
  };

  const getWhatsAppSummary = () => {
    return `*KV Flash - Approved Car Valuation Quote*\n` +
      `-----------------------------------------\n` +
      `🚗 *Vehicle:* ${calcModel} (${calcVariant} • ${calcTransmission})\n` +
      `📅 *Mfg Year:* ${calcYear} | ⛽ *Fuel:* ${calcFuel}\n` +
      `👤 *Owner on RC:* ${calcOwner === 1 ? "1st Owner (100% Grid)" : `${calcOwner} Owner (${(detailedResult.ownerMultiplier * 100).toFixed(0)}% Grid)`}\n` +
      `⏱️ *Odometer:* ${calcKms.toLocaleString()} KM (${detailedResult.kmAdjustmentPct >= 0 ? `+${detailedResult.kmAdjustmentPct}% Low running` : `${detailedResult.kmAdjustmentPct}% High running`})\n` +
      `🛡️ *Condition:* ${calcHealth}\n` +
      `-----------------------------------------\n` +
      `🏷️ *Instant Fair Value:* *₹ ${detailedResult.fairValueLacs} Lakhs* (${formatINR(detailedResult.fairValueRupees)})\n` +
      `💰 *85% Loan Cap:* *₹ ${detailedResult.loanCap85} Lakhs* (${formatINR(detailedResult.loanCap85 * 100000)})\n` +
      `🚀 *90% Max LTV Cap:* *₹ ${detailedResult.loanCap90} Lakhs*\n` +
      `-----------------------------------------\n` +
      `_Underwritten via KV Flash • Kredit Venture / Jads Services Pvt Ltd_`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. TOP HERO HEADER & NAVIGATION TABS */}
      <div className="bg-gradient-to-br from-card via-surface to-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-soft space-y-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            {/* Badges Pill Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent border border-accent/30 text-xs font-bold">
                <Car className="w-3.5 h-3.5" /> Approved Car Grid
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> 54 Master Approved Vehicles &amp; Variants
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-bold">
                <Gauge className="w-3.5 h-3.5" /> Kilometer &amp; Odometer Precision
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" /> Instant Value Finder
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              Approved Car Grid &amp; Policy Desk
            </h1>
            <p className="text-xs sm:text-sm text-muted max-w-3xl leading-relaxed">
              Real-time valuation based on car variant, manufacturing year, RC owner sequence, and odometer kilometers driven. Displays instant market value and complete Kredit Venture Used Car Loan Policy norms.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="https://www.carwale.com/used/car-valuation/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-soft"
            >
              <span>CarWale Live Valuation</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <ExportActions
              title="KV Flash - Approved Car Grid"
              moduleKey="approved_cars_list"
              getDataForExcel={getExcelData}
              getWhatsAppText={getWhatsAppSummary}
            />
          </div>
        </div>

        {/* View Switching Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
          <button
            onClick={() => setActiveView("matrix")}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeView === "matrix"
                ? "bg-accent text-white shadow-soft"
                : "bg-surface border border-border text-muted hover:text-foreground"
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Approved Car Grid Matrix (2011-2024)</span>
          </button>

          <button
            onClick={() => setActiveView("calculator")}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeView === "calculator"
                ? "bg-accent text-white shadow-soft"
                : "bg-surface border border-border text-muted hover:text-foreground"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Variant &amp; Kilometer Valuation Calculator</span>
          </button>

          <button
            onClick={() => setActiveView("models")}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeView === "models"
                ? "bg-accent text-white shadow-soft"
                : "bg-surface border border-border text-muted hover:text-foreground"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>54 Approved Vehicles &amp; Variant Families</span>
          </button>

          <Link
            href="/car-policy"
            className="px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30 flex items-center gap-2 transition-all ml-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Private Car Policy (Feb 2026)</span>
          </Link>
        </div>
      </div>

      {/* 2. INSTANT VALUE & LOAN ELIGIBILITY FINDER (LIVE STRIP) */}
      <div className="bg-card border border-border rounded-3xl p-5 shadow-soft space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Zap className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-foreground">
                  INSTANT VALUE &amp; LOAN ELIGIBILITY FINDER
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-muted">Change Model, Year, or Odometer Kms below to get the instant fair value and loan cap in real time.</p>
            </div>
          </div>

          {/* Quick Value Cards */}
          <div className="flex items-center gap-4 bg-surface/90 border border-border px-5 py-2.5 rounded-2xl">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted block">INSTANT FAIR VALUE:</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums">
                ₹{quickResult.fairValueLacs} Lakhs
              </span>
            </div>
            <div className="h-8 w-px bg-border/80" />
            <div>
              <span className="text-[10px] uppercase font-bold text-muted block">85% LOAN CAP:</span>
              <span className="text-xl sm:text-2xl font-black text-amber-300 tabular-nums">
                ₹{quickResult.loanCap85} Lakhs
              </span>
            </div>
          </div>
        </div>

        {/* Quick Row Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <select
              value={quickModel}
              onChange={(e) => setQuickModel(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
            >
              {Object.keys(CAR_VARIANTS_MAP).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={quickYear}
              onChange={(e) => setQuickYear(Number(e.target.value))}
              className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
            >
              {yearsList.map(y => (
                <option key={y} value={y}>Mfg: {y}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={quickKmRange}
              onChange={(e) => setQuickKmRange(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
            >
              <option value="Under 20k km (~15,000 km)">Under 20k km (~15,000 km)</option>
              <option value="20k - 40k km (~30,000 km)">20k - 40k km (~30,000 km)</option>
              <option value="40k - 60k km (~50,000 km)">40k - 60k km (~50,000 km)</option>
              <option value="60k - 80k km (~70,000 km)">60k - 80k km (~70,000 km)</option>
              <option value="80k - 1.0L km (~90,000 km)">80k - 1.0L km (~90,000 km)</option>
              <option value="1.0L+ km (~1,20,000 km)">1.0L+ km (~1,20,000 km)</option>
            </select>
          </div>

          <div>
            <select
              value={quickOwner}
              onChange={(e) => setQuickOwner(Number(e.target.value))}
              className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
            >
              <option value={1}>1st Owner</option>
              <option value={2}>2nd Owner</option>
              <option value={3}>3rd Owner</option>
              <option value={4}>4th Owner</option>
              <option value={5}>5th Owner (Bolero/Commercial)</option>
            </select>
          </div>

          <div>
            <button
              type="button"
              onClick={handleApplyQuickToCalc}
              className="w-full h-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-soft"
            >
              <span>Full Policy Desk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. VIEW TAB CONTENT */}

      {/* TAB A: VARIANT & KILOMETER VALUATION CALCULATOR */}
      {activeView === "calculator" && (
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-accent" />
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  Variant &amp; Kilometer Valuation Calculator
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted">
                Exact valuation tuned for specific variant, transmission, RC owner, and odometer kilometers driven. Displays full used car loan policy rules.
              </p>
            </div>

            <a
              href={`https://www.carwale.com/used/${calcModel.toLowerCase().replace(/ /g, "-")}-cars/`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-surface border border-border text-muted hover:text-foreground text-xs font-semibold flex items-center gap-1 self-start sm:self-auto transition-colors"
            >
              <span>CarWale Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 6 Selector Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* 1. Car Model */}
            <div>
              <label className="text-[11px] font-bold text-muted flex items-center gap-1 mb-1 uppercase tracking-wider">
                <Car className="w-3.5 h-3.5 text-accent" /> CAR MODEL
              </label>
              <select
                value={calcModel}
                onChange={(e) => setCalcModel(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
              >
                {Object.keys(CAR_VARIANTS_MAP).map(m => (
                  <option key={m} value={m}>{m} ({CAR_VARIANTS_MAP[m].segment})</option>
                ))}
              </select>
            </div>

            {/* 2. Variant Family */}
            <div>
              <label className="text-[11px] font-bold text-muted flex items-center gap-1 mb-1 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-accent" /> VARIANT FAMILY
              </label>
              <select
                value={calcVariant}
                onChange={(e) => setCalcVariant(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
              >
                {availableVariants.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            {/* 3. Transmission */}
            <div>
              <label className="text-[11px] font-bold text-muted flex items-center gap-1 mb-1 uppercase tracking-wider">
                <Settings className="w-3.5 h-3.5 text-accent" /> TRANSMISSION
              </label>
              <select
                value={calcTransmission}
                onChange={(e) => setCalcTransmission(e.target.value as any)}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic (+7% Value)</option>
              </select>
            </div>

            {/* 4. Mfg Year */}
            <div>
              <label className="text-[11px] font-bold text-muted flex items-center gap-1 mb-1 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-accent" /> MFG YEAR
              </label>
              <select
                value={calcYear}
                onChange={(e) => setCalcYear(Number(e.target.value))}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
              >
                {yearsList.map(y => {
                  const basePrice = computeValuation(calcModel, calcVariant, y, 1, calcTransmission, calcFuel, 20000, "Good");
                  return (
                    <option key={y} value={y}>{y} (₹{basePrice.fairValueLacs}L)</option>
                  );
                })}
              </select>
            </div>

            {/* 5. Owner on RC */}
            <div>
              <label className="text-[11px] font-bold text-muted flex items-center gap-1 mb-1 uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5 text-accent" /> OWNER ON RC
              </label>
              <select
                value={calcOwner}
                onChange={(e) => setCalcOwner(Number(e.target.value))}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
              >
                <option value={1}>1st Owner (100% Grid)</option>
                <option value={2}>2nd Owner (95% Grid)</option>
                <option value={3}>3rd Owner (90% Grid)</option>
                <option value={4}>4th Owner (84% Grid)</option>
                <option value={5}>5th Owner (Commercial/Bolero)</option>
              </select>
            </div>

            {/* 6. Fuel Type */}
            <div>
              <label className="text-[11px] font-bold text-muted flex items-center gap-1 mb-1 uppercase tracking-wider">
                <Fuel className="w-3.5 h-3.5 text-accent" /> FUEL TYPE
              </label>
              <select
                value={calcFuel}
                onChange={(e) => setCalcFuel(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
              >
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="CNG">CNG / Hybrid</option>
                <option value="Electric">Electric (EV)</option>
              </select>
            </div>
          </div>

          {/* Odometer Mileage Precision Slider Box */}
          <div className="p-5 rounded-2xl bg-surface/70 border border-border/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-accent" />
                  <span className="text-xs font-black uppercase text-foreground">
                    KILOMETERS DRIVEN (ODOMETER READING)
                  </span>
                  {detailedResult.kmAdjustmentPct > 0 ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      LOW RUNNING (PREMIUM) (+{detailedResult.kmAdjustmentPct}%)
                    </span>
                  ) : detailedResult.kmAdjustmentPct < 0 ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      HIGH RUNNING (DEDUCTION) ({detailedResult.kmAdjustmentPct}%)
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      STANDARD RUNNING (0% NORM)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted">
                  {calcKms < (2024 - calcYear + 1) * 7000
                    ? `Very low mileage (~${Math.round(calcKms / Math.max(1, 2024 - calcYear + 1)).toLocaleString()} km/yr vs ~11,000 km standard) — adds +${detailedResult.kmAdjustmentPct}% market premium.`
                    : calcKms > (2024 - calcYear + 1) * 16000
                    ? `Heavy usage (~${Math.round(calcKms / Math.max(1, 2024 - calcYear + 1)).toLocaleString()} km/yr vs ~11,000 km standard) — applies ${detailedResult.kmAdjustmentPct}% commercial wear deduction.`
                    : `Normal usage (~${Math.round(calcKms / Math.max(1, 2024 - calcYear + 1)).toLocaleString()} km/yr). Value aligns with standard Kredit Venture grid.`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1000}
                  max={250000}
                  step={1000}
                  value={calcKms}
                  onChange={(e) => setCalcKms(Number(e.target.value))}
                  className="w-28 bg-card border border-border rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-foreground tabular-nums text-right focus:outline-none focus:border-accent"
                />
                <span className="text-xs font-bold text-muted">KM</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={5000}
              max={150000}
              step={2000}
              value={calcKms}
              onChange={(e) => setCalcKms(Number(e.target.value))}
              className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
            />

            <div className="flex justify-between text-[10px] text-muted font-mono">
              <span>5,000 km</span>
              <span>40,000 km</span>
              <span>80,000 km</span>
              <span>1,20,000 km</span>
              <span>1,50,000+ km</span>
            </div>

            {/* Quick Presets Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-muted mr-1">Quick Presets:</span>
              {[
                { label: "Under 20k km", val: 15000 },
                { label: "20k - 40k km", val: 30000 },
                { label: "40k - 60k km", val: 50000 },
                { label: "60k - 80k km", val: 70000 },
                { label: "80k - 1.0L km", val: 90000 },
                { label: "1.0L+ km", val: 120000 }
              ].map(p => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setCalcKms(p.val)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    calcKms === p.val || (calcKms >= p.val - 5000 && calcKms <= p.val + 5000)
                      ? "bg-accent text-white shadow-soft"
                      : "bg-card border border-border text-muted hover:text-foreground"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Condition Health & Live CarWale Override */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-surface/40 border border-border">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Vehicle Health:
              </span>
              <div className="flex items-center gap-1.5">
                {(["Excellent", "Good", "Fair"] as const).map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setCalcHealth(h)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      calcHealth === h
                        ? "bg-accent text-white shadow-soft"
                        : "bg-surface border border-border text-muted hover:text-foreground"
                    }`}
                  >
                    {h} {h === "Excellent" ? "(+4%)" : h === "Fair" ? "(-7%)" : "(Std)"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted font-medium">Live CarWale Quote Override:</span>
              <span className="text-xs font-bold text-foreground">₹</span>
              <input
                type="number"
                step="0.05"
                value={carWaleOverride}
                onChange={(e) => setCarWaleOverride(e.target.value)}
                placeholder="e.g. 8.45"
                className="w-24 bg-surface border border-border rounded-xl px-2.5 py-1 text-xs font-bold text-foreground focus:outline-none focus:border-accent"
              />
              <span className="text-xs text-muted font-medium">Lakhs</span>
            </div>
          </div>

          {/* Final Output Results Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-3xl bg-gradient-to-r from-surface via-card to-surface border border-border/80 shadow-soft">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                FAIR MARKET VALUATION
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 tabular-nums">
                ₹{detailedResult.fairValueLacs} Lakhs
              </span>
              <p className="text-xs text-muted font-medium">
                {formatINR(detailedResult.fairValueRupees)} exact reference
              </p>
            </div>

            <div className="space-y-1 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                MAX SANCTION (85% LTV)
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
                ₹{detailedResult.loanCap85} Lakhs
              </span>
              <p className="text-xs text-emerald-500/90 font-medium">
                Standard Salaried &amp; Surrogate Cap
              </p>
            </div>

            <div className="space-y-1 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                PRIME LOAN CAP (90% LTV)
              </span>
              <span className="text-2xl sm:text-3xl font-black text-accent tabular-nums">
                ₹{detailedResult.loanCap90} Lakhs
              </span>
              <p className="text-xs text-muted font-medium">
                For Salaried IP (CIBIL &gt;= 750)
              </p>
            </div>
          </div>

          {/* Policy Rules & Owner Sequence Summary */}
          <div className="p-4 rounded-2xl bg-surface/70 border border-border space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Info className="w-4 h-4 text-accent" />
              <span>Underwriting &amp; Ownership Rules Applicable to this Asset:</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-muted leading-relaxed">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Max Owner Allowed:</strong> Up to 4th Owner for private cars (Up to 5th for Bolero).</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>End of Tenure (EOT):</strong> Vehicle age + loan tenure must be &lt;= 12 years.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Current Owner Deduction:</strong> {calcOwner === 1 ? "1st Owner: 100% full grid value" : `${calcOwner} Owner: ${(detailedResult.ownerMultiplier * 100).toFixed(0)}% grid multiplier`}.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Income Surrogates:</strong> Auto Loan MOB 12M (1.4x), 24M (1.5x) or ABB &gt;= 1.5x EMI.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB B: APPROVED CAR GRID MATRIX (2011 - 2024) */}
      {activeView === "matrix" && (
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft space-y-4 p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-black text-foreground">
                  Approved Car Grid Matrix (2011 - 2024)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted">
                Official valuation grid across 14 manufacturing years with serial owner limits (Up to 4th / 5th Owner).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={matrixOem}
                onChange={(e) => setMatrixOem(e.target.value)}
                className="bg-surface border border-border rounded-xl px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none"
              >
                {oemList.map(o => <option key={o} value={o}>{o === "All" ? "All OEMs" : o}</option>)}
              </select>

              <select
                value={matrixOwnerFilter}
                onChange={(e) => setMatrixOwnerFilter(e.target.value)}
                className="bg-surface border border-border rounded-xl px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none"
              >
                <option value="All">All Owner Limits</option>
                <option value="Up to 4th Owner">Up to 4th Owner (Cars)</option>
                <option value="Up to 5th Owner">Up to 5th Owner (Bolero/Van)</option>
              </select>

              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={matrixSearch}
                  onChange={(e) => setMatrixSearch(e.target.value)}
                  placeholder="Search car..."
                  className="w-full bg-surface border border-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-foreground placeholder-muted focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface/80 border-b border-border text-muted font-bold text-[10px] uppercase tracking-wider">
                  <th className="p-3 sticky left-0 bg-surface z-10 w-44">Car Model (Asset)</th>
                  <th className="p-3 w-24">OEM</th>
                  <th className="p-3 w-28 text-center">Max Owner</th>
                  {yearsList.map(y => (
                    <th key={y} className="p-2.5 text-center font-mono w-14">
                      {y.toString().slice(2)}&apos;
                    </th>
                  ))}
                  <th className="p-3 text-center w-24">85% Cap (2022)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredGridCars.map((car) => {
                  const is5th = car.maxOwner?.includes("5th");

                  return (
                    <tr key={car.sNo} className="hover:bg-surface/40 transition-colors">
                      <td className="p-3 font-bold text-foreground sticky left-0 bg-card z-10 border-r border-border/40">
                        <span className="text-foreground block">{car.asset}</span>
                        <span className="text-[10px] text-muted font-normal">{car.segment} &bull; {car.fuelType}</span>
                      </td>
                      <td className="p-3 text-xs font-semibold text-muted">
                        {car.oem}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          is5th
                            ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                            : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                        }`}>
                          <UserCheck className="w-3 h-3" /> {car.maxOwner || "Up to 4th"}
                        </span>
                      </td>
                      {yearsList.map(y => {
                        const valObj = computeValuation(car.asset, "Standard", y, 1, "Manual", "Petrol", 30000, "Good");
                        return (
                          <td
                            key={y}
                            className="p-2.5 text-center tabular-nums font-mono text-xs font-semibold text-foreground/90"
                          >
                            {valObj.fairValueLacs > 0 ? valObj.fairValueLacs.toFixed(1) : "-"}
                          </td>
                        );
                      })}
                      <td className="p-3 text-center font-black text-emerald-400 tabular-nums">
                        ₹ {computeValuation(car.asset, "Standard", 2022, 1, "Manual", "Petrol", 30000, "Good").loanCap85}L
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB C: 54 APPROVED VEHICLES & VARIANT FAMILIES */}
      {activeView === "models" && (
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-black text-foreground">
                  54 Master Approved Vehicles &amp; Variant Families
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted">
                Complete portfolio breakdown by OEM, segment, approved fuel types, and variant hierarchy.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              54 Total Eligible
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {APPROVED_CARS_DATA.map((car) => {
              const config = CAR_VARIANTS_MAP[car.asset];
              const isCommercialOnly = car.notes?.includes("commercial");

              return (
                <div
                  key={car.sNo}
                  className="p-4 rounded-2xl bg-surface/60 border border-border/80 hover:border-accent/40 transition-all space-y-3 shadow-soft group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-muted">
                      #{car.sNo} &bull; {car.oem}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Approved
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-foreground group-hover:text-accent transition-colors">
                      {car.asset}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                      <span>{car.segment}</span>
                      <span>&bull;</span>
                      <span>{car.fuelType}</span>
                    </div>
                  </div>

                  {config && config.variants && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-muted block">Approved Variant Families:</span>
                      <div className="flex flex-wrap gap-1">
                        {config.variants.map(v => (
                          <span key={v} className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-card border border-border/80 text-foreground">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="font-bold text-accent flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" /> {car.maxOwner || "Up to 4th Owner"}
                    </span>
                    {isCommercialOnly ? (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/25">
                        Yellow Board Only
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted">Private &amp; Comm.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
