"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useData } from "@/context/DataContext";
import { ExportActions } from "@/components/common/ExportActions";
import { formatINR } from "@/lib/utils";
import {
  Grid,
  Search,
  Filter,
  Truck,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingDown,
  Layers,
  ChevronRight,
  UserCheck,
  Calculator,
  ShieldCheck,
  FileSpreadsheet,
  FileText,
  BadgeCheck,
  HelpCircle,
  ExternalLink,
  DollarSign,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface CVFullGridItem {
  id: string;
  cat: "Bus" | "HCV" | "LCV / ICV" | "MCV" | "Pick Up" | "SCV" | "Tipper" | "Tractor & Trailer";
  mfg: "AL" | "Tata" | "Eicher" | "Force Motors" | "M&M" | "SML" | "BharatBenz" | "Maruti";
  model: string;
  body: string;
  rates: Record<number, number>; // Year -> Valuation in Lakhs
  maxFundingLacs?: number;
  maxLTV?: number;
}

const OFFICIAL_CV_DATASET: CVFullGridItem[] = [
  // --- BUS CATEGORY ---
  { id: "cv-b1", cat: "Bus", mfg: "AL", model: "AL - AC Bus (30-40 seater - Staff Bus)", body: "AC - Staff Bus", rates: { 2024: 24.01, 2023: 21.61, 2022: 19.95, 2021: 18.29, 2020: 16.63, 2019: 14.96, 2018: 13.63, 2017: 12.30, 2016: 10.97, 2015: 9.64, 2014: 7.65, 2013: 6.65, 2012: 5.65, 2011: 4.66 } },
  { id: "cv-b2", cat: "Bus", mfg: "AL", model: "AL HCV - Bus (40-50 seat)", body: "Route Permit / Staff / School Bus", rates: { 2024: 26.07, 2023: 23.47, 2022: 21.66, 2021: 19.86, 2020: 18.05, 2019: 16.25, 2018: 14.80, 2017: 13.00, 2016: 11.19, 2015: 9.75, 2014: 8.30, 2013: 6.86, 2012: 5.78, 2011: 5.05 } },
  { id: "cv-b3", cat: "Bus", mfg: "AL", model: "AL HCV - Luxury Seating Coach Bus (40-50 seat)", body: "AC Seater Coach Bus", rates: { 2024: 37.74, 2023: 33.96, 2022: 31.35, 2021: 28.74, 2020: 26.13, 2019: 23.51, 2018: 21.42, 2017: 18.81, 2016: 16.20, 2015: 14.11, 2014: 12.02, 2013: 9.93, 2012: 8.36, 2011: 7.32 } },
  { id: "cv-b4", cat: "Bus", mfg: "AL", model: "AL HCV - Luxury Seating Coach Bus (40-50 seat)", body: "Non AC Seater Coach Bus", rates: { 2024: 30.88, 2023: 27.79, 2022: 25.65, 2021: 23.51, 2020: 21.38, 2019: 19.24, 2018: 17.53, 2017: 15.39, 2016: 13.25, 2015: 11.54, 2014: 9.83, 2013: 8.12, 2012: 6.84, 2011: 5.99 } },
  { id: "cv-b5", cat: "Bus", mfg: "AL", model: "AL HCV - Luxury Sleeper Coach Bus (30-40 seat)", body: "AC Sleeper Coach Bus", rates: { 2024: 41.17, 2023: 37.05, 2022: 34.20, 2021: 31.35, 2020: 28.50, 2019: 25.65, 2018: 23.37, 2017: 20.52, 2016: 17.67, 2015: 15.39, 2014: 13.11, 2013: 10.83, 2012: 9.12, 2011: 7.98 } },
  { id: "cv-b6", cat: "Bus", mfg: "AL", model: "AL HCV - Luxury Sleeper Coach Bus (30-40 seat)", body: "Non AC Sleeper Coach Bus", rates: { 2024: 37.74, 2023: 33.96, 2022: 31.35, 2021: 28.74, 2020: 26.13, 2019: 23.51, 2018: 21.42, 2017: 18.81, 2016: 16.20, 2015: 14.11, 2014: 12.02, 2013: 9.93, 2012: 8.36, 2011: 7.32 } },
  { id: "cv-b7", cat: "Bus", mfg: "AL", model: "AL Lynx - ICV Bus (25-25 seater)", body: "Route Permit / Staff / School Bus", rates: { 2024: 20.58, 2023: 18.53, 2022: 17.10, 2021: 15.68, 2020: 14.25, 2019: 12.83, 2018: 11.69, 2017: 10.26, 2016: 8.84, 2015: 7.70, 2014: 6.56, 2013: 5.42, 2012: 4.56, 2011: 3.99 } },
  { id: "cv-b8", cat: "Bus", mfg: "Eicher", model: "Eicher - 31 to 40 seater Route / Staff / School Bus", body: "Route Permit / Staff / School Bus", rates: { 2024: 18.47, 2023: 16.63, 2022: 15.44, 2021: 14.25, 2020: 13.06, 2019: 11.88, 2018: 10.69, 2017: 9.50, 2016: 8.31, 2015: 7.13, 2014: 5.94, 2013: 4.99, 2012: 4.28, 2011: 3.56 } },
  { id: "cv-b9", cat: "Bus", mfg: "Eicher", model: "Eicher - 20 to 30 seater Route / Staff / School Bus", body: "Route Permit / Staff / School Bus", rates: { 2024: 16.99, 2023: 15.30, 2022: 14.20, 2021: 13.11, 2020: 12.02, 2019: 10.93, 2018: 9.83, 2017: 8.74, 2016: 7.65, 2015: 6.56, 2014: 5.46, 2013: 4.59, 2012: 3.93, 2011: 3.28 } },
  { id: "cv-b10", cat: "Bus", mfg: "Eicher", model: "Eicher - 41 to 50 seater Route / Staff / School Bus", body: "Route Permit / Staff / School Bus", rates: { 2024: 20.69, 2023: 18.62, 2022: 17.29, 2021: 15.96, 2020: 14.63, 2019: 13.30, 2018: 11.97, 2017: 10.64, 2016: 9.31, 2015: 7.98, 2014: 6.65, 2013: 5.59, 2012: 4.79, 2011: 3.99 } },
  { id: "cv-b11", cat: "Bus", mfg: "Eicher", model: "Eicher - AC Bus (30-40 seater - Staff Bus)", body: "AC - Staff Bus", rates: { 2024: 26.07, 2023: 23.47, 2022: 21.66, 2021: 19.86, 2020: 18.05, 2019: 16.25, 2018: 14.80, 2017: 13.36, 2016: 11.91, 2015: 10.47, 2014: 8.30, 2013: 7.22, 2012: 6.14, 2011: 5.05 } },
  { id: "cv-b12", cat: "Bus", mfg: "Force Motors", model: "Force / Tempo Traveller - (13-15 Seater) Bus", body: "Route Permit / Staff / School Bus", rates: { 2024: 13.68, 2023: 12.31, 2022: 11.80, 2021: 11.12, 2020: 10.43, 2019: 9.92, 2018: 9.23, 2017: 8.55, 2016: 8.04, 2015: 7.18, 2014: 6.50, 2013: 5.13, 2012: 4.62, 2011: 3.93 } },
  { id: "cv-b13", cat: "Bus", mfg: "Force Motors", model: "Force / Tempo Traveller - (16-20 Seater) bus", body: "Route Permit / Staff / School Bus", rates: { 2024: 15.96, 2023: 14.36, 2022: 13.77, 2021: 12.97, 2020: 12.17, 2019: 11.57, 2018: 10.77, 2017: 9.98, 2016: 9.38, 2015: 8.38, 2014: 7.58, 2013: 5.99, 2012: 5.39, 2011: 4.59 } },
  { id: "cv-b14", cat: "Bus", mfg: "Force Motors", model: "Force / Tempo Traveller - (21-25 Seater) Bus", body: "Route Permit / Staff / School Bus", rates: { 2024: 18.24, 2023: 16.42, 2022: 15.73, 2021: 14.82, 2020: 13.91, 2019: 13.22, 2018: 12.31, 2017: 11.40, 2016: 10.72, 2015: 9.58, 2014: 8.66, 2013: 6.84, 2012: 6.16, 2011: 5.24 } },
  { id: "cv-b15", cat: "Bus", mfg: "M&M", model: "M&M - 12 to 20 seater bus", body: "Route Permit / Staff / School Bus", rates: { 2024: 12.35, 2023: 11.12, 2022: 10.26, 2021: 9.41, 2020: 8.55, 2019: 7.70, 2018: 7.01, 2017: 6.33, 2016: 5.64, 2015: 4.96, 2014: 4.10, 2013: 3.59, 2012: 3.08, 2011: 2.74 } },
  { id: "cv-b16", cat: "Bus", mfg: "M&M", model: "M&M - 21 to 30 seater bus", body: "Route Permit / Staff / School Bus", rates: { 2024: 15.09, 2023: 13.59, 2022: 12.54, 2021: 11.50, 2020: 10.45, 2019: 9.41, 2018: 8.57, 2017: 7.73, 2016: 6.90, 2015: 6.06, 2014: 5.02, 2013: 4.39, 2012: 3.76, 2011: 3.34 } },
  { id: "cv-b17", cat: "Bus", mfg: "M&M", model: "M&M - 31 to 40 seater bus", body: "Route Permit / Staff / School Bus", rates: { 2024: 17.15, 2023: 15.44, 2022: 14.25, 2021: 13.06, 2020: 11.88, 2019: 10.69, 2018: 9.74, 2017: 8.79, 2016: 7.84, 2015: 6.89, 2014: 5.70, 2013: 4.99, 2012: 4.28, 2011: 3.80 } },
  { id: "cv-b18", cat: "Bus", mfg: "SML", model: "SM - AC Bus (30-40 seater - Staff Bus)", body: "AC - Staff Bus", rates: { 2024: 24.70, 2023: 22.23, 2022: 20.52, 2021: 18.81, 2020: 17.10, 2019: 15.39, 2018: 14.02, 2017: 12.65, 2016: 11.29, 2015: 9.92, 2014: 7.87, 2013: 6.84, 2012: 5.81, 2011: 4.79 } },
  { id: "cv-b19", cat: "Bus", mfg: "SML", model: "SM - Bus - 20 to 30 seater Route / Staff / School bus", body: "Route Permit / Staff / School bus", rates: { 2024: 16.99, 2023: 15.30, 2022: 14.20, 2021: 13.11, 2020: 12.02, 2019: 10.93, 2018: 9.83, 2017: 8.74, 2016: 7.65, 2015: 6.56, 2014: 5.46, 2013: 4.59, 2012: 3.93, 2011: 3.28 } },
  { id: "cv-b20", cat: "Bus", mfg: "SML", model: "SM - Bus - 31 to 40 seater Route / Staff / School bus", body: "Route Permit / Staff / School bus", rates: { 2024: 19.21, 2023: 17.29, 2022: 16.06, 2021: 14.82, 2020: 13.59, 2019: 12.35, 2018: 11.12, 2017: 9.88, 2016: 8.65, 2015: 7.41, 2014: 6.18, 2013: 5.19, 2012: 4.45, 2011: 3.71 } },
  { id: "cv-b21", cat: "Bus", mfg: "SML", model: "SM - Bus - 41 to 50 seater Route / Staff / School bus", body: "Route Permit / Staff / School bus", rates: { 2024: 21.43, 2023: 19.29, 2022: 17.91, 2021: 16.53, 2020: 15.15, 2019: 13.78, 2018: 12.40, 2017: 11.02, 2016: 9.64, 2015: 8.27, 2014: 6.89, 2013: 5.79, 2012: 4.96, 2011: 4.13 } },
  { id: "cv-b22", cat: "Bus", mfg: "Tata", model: "Tata LP 1109 / 1112 / LPO - 10.2 - (25 - 35 seat) Bus", body: "Route Permit / Staff / School Bus", rates: { 2024: 21.27, 2023: 19.14, 2022: 17.67, 2021: 16.20, 2020: 14.73, 2019: 13.25, 2018: 12.07, 2017: 10.90, 2016: 9.72, 2015: 8.54, 2014: 7.07, 2013: 6.18, 2012: 5.30, 2011: 4.71 } },
  { id: "cv-b23", cat: "Bus", mfg: "Tata", model: "Tata LP 407 / 410 / 412 - Cityride / Starbus / SKL Bus", body: "Route Permit / Staff / School Bus", rates: { 2024: 15.09, 2023: 13.59, 2022: 12.54, 2021: 11.50, 2020: 10.45, 2019: 9.41, 2018: 8.57, 2017: 7.73, 2016: 6.90, 2015: 6.06, 2014: 5.02, 2013: 4.39, 2012: 3.76, 2011: 3.34 } },
  { id: "cv-b24", cat: "Bus", mfg: "Tata", model: "Tata LP 709 / 710 / 712 - Cityride / Starbus / SKL Bus", body: "Route Permit / Staff / School Bus", rates: { 2024: 17.84, 2023: 16.06, 2022: 14.82, 2021: 13.59, 2020: 12.35, 2019: 11.12, 2018: 10.13, 2017: 9.14, 2016: 8.15, 2015: 7.16, 2014: 5.93, 2013: 5.19, 2012: 4.45, 2011: 3.95 } },
  { id: "cv-b25", cat: "Bus", mfg: "Tata", model: "Tata LP 810 / 812 / 909 / 912 - Cityride / Starbus / SKL", body: "Route Permit / Staff / School Bus", rates: { 2024: 19.90, 2023: 17.91, 2022: 16.53, 2021: 15.15, 2020: 13.78, 2019: 12.40, 2018: 11.30, 2017: 10.19, 2016: 9.09, 2015: 7.99, 2014: 6.61, 2013: 5.79, 2012: 4.96, 2011: 4.41 } },
  { id: "cv-b26", cat: "Bus", mfg: "Tata", model: "Tata - AC Bus (30-40 seater - Staff Bus)", body: "AC - Staff Bus", rates: { 2024: 25.39, 2023: 22.85, 2022: 21.09, 2021: 19.33, 2020: 17.58, 2019: 15.82, 2018: 14.41, 2017: 13.01, 2016: 11.60, 2015: 10.19, 2014: 8.08, 2013: 7.03, 2012: 5.98, 2011: 4.92 } },
  { id: "cv-b27", cat: "Bus", mfg: "Tata", model: "Tata HCV - Luxury Sleeper coach Bus (30-40 seat)", body: "AC Sleeper Coach Bus", rates: { 2024: 37.91, 2023: 34.11, 2022: 31.41, 2021: 28.70, 2020: 25.99, 2019: 23.28, 2018: 21.12, 2017: 18.41, 2016: 15.70, 2015: 13.54, 2014: 11.37, 2013: 9.75, 2012: 8.12, 2011: 7.04 } },
  { id: "cv-b28", cat: "Bus", mfg: "Tata", model: "Tata HCV - Bus (40-50 seat)", body: "Route Permit / Staff / School Bus", rates: { 2024: 25.27, 2023: 22.74, 2022: 20.94, 2021: 19.13, 2020: 17.33, 2019: 15.52, 2018: 14.08, 2017: 12.27, 2016: 10.47, 2015: 9.03, 2014: 7.58, 2013: 6.50, 2012: 5.42, 2011: 4.69 } },
  { id: "cv-b29", cat: "Bus", mfg: "Tata", model: "Tata HCV - Luxury Seating Coach Bus (40-50 seat)", body: "AC Seater Coach Bus", rates: { 2024: 34.58, 2023: 31.12, 2022: 28.65, 2021: 26.18, 2020: 23.71, 2019: 21.24, 2018: 19.27, 2017: 16.80, 2016: 14.33, 2015: 12.35, 2014: 10.37, 2013: 8.89, 2012: 7.41, 2011: 6.42 } },
  { id: "cv-b30", cat: "Bus", mfg: "Tata", model: "Tata HCV - Luxury Seating Coach Bus (40-50 seat)", body: "Non AC Seater Coach Bus", rates: { 2024: 29.93, 2023: 26.93, 2022: 24.80, 2021: 22.66, 2020: 20.52, 2019: 18.38, 2018: 16.67, 2017: 14.54, 2016: 12.40, 2015: 10.69, 2014: 8.98, 2013: 7.70, 2012: 6.41, 2011: 5.56 } },

  // --- HCV CATEGORY (HEAVY COMMERCIAL) ---
  { id: "cv-h1", cat: "HCV", mfg: "AL", model: "AL 4825 / 4830 (16 Wheeler)", body: "Goods / Flatbed", rates: { 2024: 40.28, 2023: 36.25, 2022: 34.24, 2021: 32.22, 2020: 30.21, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-h2", cat: "HCV", mfg: "AL", model: "AL 4825 / 4830 Tanker", body: "MS Tanker / Bulker / Container", rates: { 2024: 41.97, 2023: 37.77, 2022: 35.64, 2021: 33.52, 2020: 31.39, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-h3", cat: "HCV", mfg: "AL", model: "AL 4825 / 4830 Gas Tanker", body: "SS Tanker / Gas Tanker", rates: { 2024: 46.55, 2023: 41.90, 2022: 39.50, 2021: 37.11, 2020: 34.71, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-h4", cat: "HCV", mfg: "AL", model: "HCV AL - 2820 / 2523 / 2825 (10 Wheeler)", body: "Goods / Open Body", rates: { 2024: 27.36, 2023: 24.62, 2022: 23.26, 2021: 21.89, 2020: 20.52, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-h5", cat: "HCV", mfg: "AL", model: "HCV AL - 3118 (12 Wheeler)", body: "Goods / High Deck", rates: { 2024: 0, 2023: 0, 2022: 0, 2021: 0, 2020: 21.55, 2019: 20.18, 2018: 18.81, 2017: 17.78, 2016: 16.42, 2015: 15.05, 2014: 14.02, 2013: 11.29, 2012: 8.89, 2011: 6.84 } },
  { id: "cv-h6", cat: "HCV", mfg: "AL", model: "HCV AL - 3520 / 3518 (12 Wheeler)", body: "Goods", rates: { 2024: 32.68, 2023: 29.41, 2022: 27.78, 2021: 26.14, 2020: 24.51, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-h7", cat: "HCV", mfg: "AL", model: "HCV AL - 4220 / 4225 / 4120 / 4123 (14 Wheeler)", body: "Goods", rates: { 2024: 36.48, 2023: 32.83, 2022: 31.01, 2021: 29.18, 2020: 27.36, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-h8", cat: "HCV", mfg: "AL", model: "HCV AL - 2214 / 2515 / 2516 / 2518 (10 Wheeler)", body: "Goods", rates: { 2024: 0, 2023: 0, 2022: 0, 2021: 0, 2020: 17.10, 2019: 16.53, 2018: 15.68, 2017: 14.82, 2016: 13.11, 2015: 11.97, 2014: 10.55, 2013: 8.27, 2012: 6.27, 2011: 5.13 } },
  { id: "cv-h9", cat: "HCV", mfg: "BharatBenz", model: "HCV - 3523 R / 3823 R (12 Wheeler)", body: "Goods", rates: { 2024: 30.86, 2023: 27.78, 2022: 25.74, 2021: 23.69, 2020: 21.65, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-h10", cat: "HCV", mfg: "BharatBenz", model: "HCV - 4228 R (14 Wheeler)", body: "Goods", rates: { 2024: 34.45, 2023: 31.01, 2022: 28.73, 2021: 26.45, 2020: 24.17, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-h11", cat: "HCV", mfg: "BharatBenz", model: "HCV - 4828 R (16 Wheeler)", body: "Goods", rates: { 2024: 38.04, 2023: 34.24, 2022: 31.72, 2021: 29.20, 2020: 26.69, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-h12", cat: "HCV", mfg: "BharatBenz", model: "HCV - R 2523 (10 Wheeler)", body: "Goods", rates: { 2024: 0, 2023: 0, 2022: 0, 2021: 0, 2020: 15.20, 2019: 13.68, 2018: 12.16, 2017: 10.64, 2016: 9.42, 2015: 8.21, 2014: 6.99, 2013: 6.08, 2012: 5.17, 2011: 4.26 } },
  { id: "cv-h13", cat: "HCV", mfg: "Tata", model: "Tata LPT/SIGNA - 4225 / 4221 / 4323 (14 Wheeler)", body: "Goods", rates: { 2024: 37.76, 2023: 33.98, 2022: 32.12, 2021: 30.26, 2020: 28.40, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-h14", cat: "HCV", mfg: "Tata", model: "Tata LPT/SIGNA - 4825 / 4823 / 4830 (16 Wheeler)", body: "Goods", rates: { 2024: 41.61, 2023: 37.45, 2022: 35.40, 2021: 33.35, 2020: 31.29, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-h15", cat: "HCV", mfg: "Tata", model: "Tata LPT/SIGNA - 2818 / 2821 / 2823 (10 Wheeler)", body: "Goods", rates: { 2024: 28.51, 2023: 25.66, 2022: 24.25, 2021: 22.85, 2020: 21.44, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-h16", cat: "HCV", mfg: "Tata", model: "Tata LPT/SIGNA - 3518 / 3521 / 3525 (12 Wheeler)", body: "Goods", rates: { 2024: 33.90, 2023: 30.51, 2022: 28.84, 2021: 27.17, 2020: 25.50, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-h17", cat: "HCV", mfg: "Tata", model: "HCV TATA - 3118 / 3123 (12 Wheeler)", body: "Goods", rates: { 2024: 0, 2023: 0, 2022: 0, 2021: 0, 2020: 24.55, 2019: 23.10, 2018: 21.66, 2017: 20.22, 2016: 18.41, 2015: 16.61, 2014: 14.80, 2013: 12.27, 2012: 10.47, 2011: 8.30 } },
  { id: "cv-h18", cat: "HCV", mfg: "Tata", model: "Cummins Engine - Series 2515 / 2516 / 2518 / 2523", body: "Goods", rates: { 2024: 0, 2023: 0, 2022: 0, 2021: 0, 2020: 18.26, 2019: 16.79, 2018: 15.90, 2017: 15.02, 2016: 13.25, 2015: 12.37, 2014: 10.31, 2013: 7.95, 2012: 6.48, 2011: 5.30 } },

  // --- LCV / ICV CATEGORY ---
  { id: "cv-l1", cat: "LCV / ICV", mfg: "AL", model: "AL - 1015 / AL 1115", body: "Goods", rates: { 2024: 14.36, 2023: 12.92, 2022: 11.97, 2021: 11.02, 2020: 10.07, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-l2", cat: "LCV / ICV", mfg: "AL", model: "AL - 1212 / AL 1214", body: "Goods", rates: { 2024: 16.67, 2023: 15.00, 2022: 14.00, 2021: 13.10, 2020: 12.00, 2019: 10.90, 2018: 10.00, 2017: 8.10, 2016: 6.90, 2015: 6.00, 2014: 5.10, 2013: 4.50, 2012: 4.10, 2011: 3.85 } },
  { id: "cv-l3", cat: "LCV / ICV", mfg: "AL", model: "AL - 1615", body: "Goods", rates: { 2024: 17.23, 2023: 15.50, 2022: 14.36, 2021: 13.22, 2020: 12.08, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-l4", cat: "LCV / ICV", mfg: "BharatBenz", model: "BharatBenz 1117 / 1217", body: "Goods", rates: { 2024: 13.64, 2023: 12.27, 2022: 11.37, 2021: 10.47, 2020: 9.57, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-l5", cat: "LCV / ICV", mfg: "BharatBenz", model: "BharatBenz 1417", body: "Goods", rates: { 2024: 15.07, 2023: 13.57, 2022: 12.57, 2021: 11.57, 2020: 10.57, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-l6", cat: "LCV / ICV", mfg: "Eicher", model: "Eicher 10.50 / 20.50 / 10.55 / 20.55", body: "Goods", rates: { 2024: 12.33, 2023: 11.10, 2022: 10.50, 2021: 9.75, 2020: 9.30, 2019: 8.70, 2018: 8.10, 2017: 7.35, 2016: 6.60, 2015: 6.00, 2014: 5.40, 2013: 4.65, 2012: 3.90, 2011: 3.30 } },
  { id: "cv-l7", cat: "LCV / ICV", mfg: "Eicher", model: "Eicher 10.80 / 20.80", body: "Goods", rates: { 2024: 14.84, 2023: 13.36, 2022: 12.64, 2021: 11.73, 2020: 11.19, 2019: 10.47, 2018: 9.75, 2017: 8.84, 2016: 7.94, 2015: 7.22, 2014: 6.50, 2013: 5.60, 2012: 4.69, 2011: 3.97 } },
  { id: "cv-l8", cat: "LCV / ICV", mfg: "Eicher", model: "Eicher 11.10 / 11.12 / 21.10", body: "Goods", rates: { 2024: 19.00, 2023: 17.10, 2022: 16.58, 2021: 16.00, 2020: 15.00, 2019: 14.10, 2018: 13.20, 2017: 12.30, 2016: 11.40, 2015: 10.50, 2014: 9.60, 2013: 8.10, 2012: 6.70, 2011: 5.50 } },
  { id: "cv-l9", cat: "LCV / ICV", mfg: "Eicher", model: "Eicher 3015", body: "Goods", rates: { 2024: 22.50, 2023: 20.25, 2022: 19.17, 2021: 18.09, 2020: 17.01, 2019: 16.20, 2018: 15.12, 2017: 14.04, 2016: 12.96, 2015: 11.88, 2014: 10.53, 2013: 9.18, 2012: 7.56, 2011: 6.21 } },
  { id: "cv-l10", cat: "LCV / ICV", mfg: "Tata", model: "Tata 407 Pick Up", body: "Goods", rates: { 2024: 8.23, 2023: 7.41, 2022: 6.84, 2021: 6.27, 2020: 5.70, 2019: 5.13, 2018: 4.67, 2017: 4.22, 2016: 3.76, 2015: 3.31, 2014: 2.74, 2013: 2.39, 2012: 2.05, 2011: 1.82 } },
  { id: "cv-l11", cat: "LCV / ICV", mfg: "Tata", model: "ICV TATA - 1412 / 1416 / Ultra T-14", body: "Goods", rates: { 2024: 16.72, 2023: 15.05, 2022: 14.21, 2021: 13.38, 2020: 12.54, 2019: 11.70, 2018: 10.87, 2017: 10.03, 2016: 9.20, 2015: 8.36, 2014: 7.32, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-l12", cat: "LCV / ICV", mfg: "Tata", model: "ICV TATA - 1512", body: "Goods", rates: { 2024: 18.24, 2023: 16.42, 2022: 15.50, 2021: 14.59, 2020: 13.68, 2019: 12.77, 2018: 11.86, 2017: 10.94, 2016: 10.03, 2015: 9.12, 2014: 7.98, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-l13", cat: "LCV / ICV", mfg: "Tata", model: "ICV TATA - 1109 / 1112 / 1212 / 1216 / Ultra T-11", body: "Goods", rates: { 2024: 18.33, 2023: 16.50, 2022: 15.62, 2021: 14.74, 2020: 13.86, 2019: 13.20, 2018: 12.54, 2017: 11.54, 2016: 11.04, 2015: 9.85, 2014: 8.85, 2013: 8.00, 2012: 6.50, 2011: 5.20 } },
  { id: "cv-l14", cat: "LCV / ICV", mfg: "Tata", model: "Tata SFC / LPT 407 / 412", body: "Goods", rates: { 2024: 11.51, 2023: 10.36, 2022: 9.59, 2021: 8.97, 2020: 8.34, 2019: 7.84, 2018: 7.43, 2017: 7.02, 2016: 6.57, 2015: 6.12, 2014: 5.59, 2013: 5.04, 2012: 4.46, 2011: 4.00 } },

  // --- MCV CATEGORY (MEDIUM COMMERCIAL) ---
  { id: "cv-m1", cat: "MCV", mfg: "AL", model: "AL - 1815 / 1915 / 1916", body: "Goods", rates: { 2024: 17.94, 2023: 16.15, 2022: 14.96, 2021: 13.78, 2020: 12.59, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-m2", cat: "MCV", mfg: "AL", model: "AL 1612 / 1613 / 1616 / 1618", body: "Goods", rates: { 2024: 0, 2023: 0, 2022: 0, 2021: 0, 2020: 15.65, 2019: 14.36, 2018: 13.34, 2017: 12.31, 2016: 11.29, 2015: 10.26, 2014: 9.23, 2013: 7.70, 2012: 5.90, 2011: 4.62 } },
  { id: "cv-m3", cat: "MCV", mfg: "AL", model: "AL 1920", body: "Goods", rates: { 2024: 20.52, 2023: 18.47, 2022: 17.44, 2021: 16.42, 2020: 15.39, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-m4", cat: "MCV", mfg: "BharatBenz", model: "HCV - R 1617 / R 1917", body: "Goods", rates: { 2024: 20.20, 2023: 18.18, 2022: 16.53, 2021: 14.88, 2020: 13.22, 2019: 11.85, 2018: 10.74, 2017: 9.64, 2016: 8.54, 2015: 7.71, 2014: 6.89, 2013: 5.79, 2012: 4.68, 2011: 3.86 } },
  { id: "cv-m5", cat: "MCV", mfg: "Eicher", model: "Eicher 3016 / 3018 / 3019", body: "Goods", rates: { 2024: 21.28, 2023: 19.15, 2022: 17.82, 2021: 16.49, 2020: 15.16, 2019: 13.83, 2018: 12.77, 2017: 11.70, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-m6", cat: "MCV", mfg: "Tata", model: "Tata LPT - 1612 / 1613 / 1615 / 1616 / 1618 / 1918", body: "Goods", rates: { 2024: 22.04, 2023: 19.84, 2022: 18.73, 2021: 17.63, 2020: 16.53, 2019: 15.70, 2018: 14.88, 2017: 14.05, 2016: 12.95, 2015: 11.85, 2014: 10.47, 2013: 8.54, 2012: 6.61, 2011: 4.68 } },

  // --- PICK UP CATEGORY ---
  { id: "cv-p1", cat: "Pick Up", mfg: "AL", model: "AL Bada Dost", body: "Goods", rates: { 2024: 8.61, 2023: 7.75, 2022: 7.30, 2021: 6.90, 2020: 6.50, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-p2", cat: "Pick Up", mfg: "AL", model: "AL Dost - Lite / Dost - Strong (LE/LS/LX)", body: "Goods", rates: { 2024: 7.39, 2023: 6.65, 2022: 6.19, 2021: 5.75, 2020: 5.34, 2019: 4.97, 2018: 4.62, 2017: 4.16, 2016: 3.87, 2015: 3.27, 2014: 2.80, 2013: 2.43, 2012: 2.19, 2011: 0 } },
  { id: "cv-p3", cat: "Pick Up", mfg: "AL", model: "AL Dost Plus - (LE/LS/LX)", body: "Goods", rates: { 2024: 7.78, 2023: 7.00, 2022: 6.60, 2021: 6.10, 2020: 5.70, 2019: 5.25, 2018: 4.90, 2017: 4.50, 2016: 4.20, 2015: 3.75, 2014: 3.10, 2013: 2.60, 2012: 2.30, 2011: 0 } },
  { id: "cv-p4", cat: "Pick Up", mfg: "M&M", model: "Bolero Camper", body: "Goods", rates: { 2024: 8.22, 2023: 7.40, 2022: 7.10, 2021: 6.80, 2020: 6.40, 2019: 6.00, 2018: 5.40, 2017: 5.10, 2016: 4.70, 2015: 4.40, 2014: 4.00, 2013: 3.50, 2012: 3.00, 2011: 0 } },
  { id: "cv-p5", cat: "Pick Up", mfg: "M&M", model: "Bolero Maxi Truck", body: "Goods", rates: { 2024: 8.89, 2023: 8.00, 2022: 7.50, 2021: 7.10, 2020: 6.70, 2019: 6.30, 2018: 6.00, 2017: 5.60, 2016: 5.30, 2015: 5.00, 2014: 4.75, 2013: 4.20, 2012: 4.00, 2011: 0 } },
  { id: "cv-p6", cat: "Pick Up", mfg: "M&M", model: "Bolero Pick Up / Max Pick Up", body: "Goods", rates: { 2024: 10.22, 2023: 9.20, 2022: 8.60, 2021: 8.20, 2020: 7.80, 2019: 7.40, 2018: 7.10, 2017: 6.70, 2016: 6.40, 2015: 6.10, 2014: 5.50, 2013: 5.10, 2012: 4.50, 2011: 0 } },
  { id: "cv-p7", cat: "Pick Up", mfg: "Tata", model: "Tata Intra V-10", body: "Goods", rates: { 2024: 6.38, 2023: 5.74, 2022: 5.33, 2021: 4.93, 2020: 4.52, 2019: 4.12, 2018: 3.71, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-p8", cat: "Pick Up", mfg: "Tata", model: "Tata Intra V-20", body: "Goods", rates: { 2024: 7.33, 2023: 6.59, 2022: 6.23, 2021: 5.87, 2020: 5.23, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-p9", cat: "Pick Up", mfg: "Tata", model: "Tata Intra V-30", body: "Goods", rates: { 2024: 6.94, 2023: 6.25, 2022: 5.70, 2021: 5.10, 2020: 4.65, 2019: 4.10, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-p10", cat: "Pick Up", mfg: "Tata", model: "Tata Intra V-50", body: "Goods", rates: { 2024: 8.10, 2023: 7.29, 2022: 6.89, 2021: 6.49, 2020: 0, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },

  // --- SCV CATEGORY (SMALL COMMERCIAL) ---
  { id: "cv-s1", cat: "SCV", mfg: "M&M", model: "Mahindra Jeeto", body: "Goods", rates: { 2024: 4.00, 2023: 3.60, 2022: 3.30, 2021: 3.10, 2020: 2.80, 2019: 2.55, 2018: 2.30, 2017: 2.00, 2016: 1.80, 2015: 1.50, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-s2", cat: "SCV", mfg: "M&M", model: "Mahindra Supro", body: "Goods", rates: { 2024: 5.15, 2023: 4.64, 2022: 4.28, 2021: 3.92, 2020: 3.64, 2019: 3.35, 2018: 2.99, 2017: 2.64, 2016: 2.07, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-s3", cat: "SCV", mfg: "Maruti", model: "Super Carry Petrol / CNG", body: "Goods", rates: { 2024: 4.50, 2023: 4.05, 2022: 3.70, 2021: 3.30, 2020: 3.00, 2019: 2.60, 2018: 2.10, 2017: 1.90, 2016: 1.75, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-s4", cat: "SCV", mfg: "Tata", model: "Tata ACE - HT / HT+ / Gold (Diesel)", body: "Goods", rates: { 2024: 5.70, 2023: 5.13, 2022: 4.75, 2021: 4.40, 2020: 4.10, 2019: 3.60, 2018: 3.40, 2017: 3.10, 2016: 2.80, 2015: 2.50, 2014: 2.20, 2013: 1.80, 2012: 1.60, 2011: 0 } },
  { id: "cv-s5", cat: "SCV", mfg: "Tata", model: "Tata ACE - EX / HD / Mega / Gold (Petrol/CNG)", body: "Goods", rates: { 2024: 3.67, 2023: 3.30, 2022: 3.13, 2021: 2.97, 2020: 2.82, 2019: 2.68, 2018: 2.55, 2017: 2.42, 2016: 2.10, 2015: 1.80, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-s6", cat: "SCV", mfg: "Tata", model: "Tata ACE - Zip", body: "Goods", rates: { 2024: 2.04, 2023: 1.83, 2022: 1.64, 2021: 1.48, 2020: 1.33, 2019: 1.13, 2018: 0.96, 2017: 0.82, 2016: 0.69, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },

  // --- TIPPER CATEGORY ---
  { id: "cv-t1", cat: "Tipper", mfg: "AL", model: "AL - 4225 / 4220 Tipper", body: "Tipper", rates: { 2024: 43.47, 2023: 39.12, 2022: 36.92, 2021: 34.71, 2020: 32.51, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-t2", cat: "Tipper", mfg: "AL", model: "AL - 4825 TIPPER / 4830 Tipper", body: "Tipper", rates: { 2024: 45.72, 2023: 41.14, 2022: 38.83, 2021: 36.51, 2020: 34.19, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-t3", cat: "Tipper", mfg: "AL", model: "AL - 2820 / 2825 / 2832 Tipper", body: "Tipper", rates: { 2024: 34.47, 2023: 31.03, 2022: 29.28, 2021: 27.53, 2020: 25.78, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-t4", cat: "Tipper", mfg: "AL", model: "AL - 3520 / 3525 / 3532 Tipper", body: "Tipper", rates: { 2024: 40.47, 2023: 36.42, 2022: 34.37, 2021: 32.32, 2020: 30.27, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-t5", cat: "Tipper", mfg: "BharatBenz", model: "BharatBenz 2823 / 2828 / 2832 Tipper", body: "Tipper", rates: { 2024: 33.74, 2023: 30.36, 2022: 28.13, 2021: 25.90, 2020: 23.66, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-t6", cat: "Tipper", mfg: "BharatBenz", model: "BharatBenz 3523 / 3528 / 3532 Tipper", body: "Tipper", rates: { 2024: 38.76, 2023: 34.88, 2022: 32.32, 2021: 29.75, 2020: 27.19, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-t7", cat: "Tipper", mfg: "BharatBenz", model: "BharatBenz 4228 Tipper", body: "Tipper", rates: { 2024: 41.63, 2023: 37.47, 2022: 34.71, 2021: 31.96, 2020: 29.20, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-t8", cat: "Tipper", mfg: "BharatBenz", model: "BharatBenz 4828 Tipper", body: "Tipper", rates: { 2024: 43.78, 2023: 39.41, 2022: 36.51, 2021: 33.61, 2020: 30.71, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-t9", cat: "Tipper", mfg: "Tata", model: "Tata 2823 / 2825 / 2830 Tipper", body: "Tipper", rates: { 2024: 35.72, 2023: 32.15, 2022: 30.36, 2021: 28.58, 2020: 26.79, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-t10", cat: "Tipper", mfg: "Tata", model: "Tata 3523 / 3525 / 3530 Tipper", body: "Tipper", rates: { 2024: 41.80, 2023: 37.62, 2022: 35.53, 2021: 33.44, 2020: 31.35, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-t11", cat: "Tipper", mfg: "Tata", model: "Tata 4225 / 4221 / 4230 Tipper", body: "Tipper", rates: { 2024: 44.84, 2023: 40.36, 2022: 38.11, 2021: 35.87, 2020: 33.63, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-t12", cat: "Tipper", mfg: "Tata", model: "Tata 4825 / 4830 Tipper", body: "Tipper", rates: { 2024: 48.64, 2023: 43.78, 2022: 41.34, 2021: 38.91, 2020: 36.48, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },

  // --- TRACTOR & TRAILER CATEGORY ---
  { id: "cv-tr1", cat: "Tractor & Trailer", mfg: "AL", model: "AL 4020 / 4220 / 4225 Trailer", body: "Tip Trailer / Bulker / Tanker", rates: { 2024: 30.59, 2023: 27.53, 2022: 25.94, 2021: 24.34, 2020: 22.74, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-tr2", cat: "Tractor & Trailer", mfg: "AL", model: "AL 4420 / 4425 / 4620 Trailer", body: "Tip Trailer / Bulker / Tanker", rates: { 2024: 32.05, 2023: 28.84, 2022: 27.17, 2021: 25.50, 2020: 23.83, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-tr3", cat: "Tractor & Trailer", mfg: "AL", model: "AL 5225 / 5525 / 5530 Trailer (10 W)", body: "Tip Trailer / Bulker / Tanker", rates: { 2024: 39.48, 2023: 35.53, 2022: 32.92, 2021: 30.31, 2020: 28.22, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-tr4", cat: "Tractor & Trailer", mfg: "Tata", model: "Tata Signa 4018 / Prima 4023 / 4025 / 4028 Trailer", body: "Tip Trailer / Bulker / Tanker", rates: { 2024: 32.51, 2023: 29.26, 2022: 27.59, 2021: 25.92, 2020: 24.24, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-tr5", cat: "Tractor & Trailer", mfg: "Tata", model: "Tata Signa 5523 / 5525 / 5530 (6 W) Trailer", body: "Tip Trailer / Bulker / Tanker", rates: { 2024: 39.48, 2023: 35.53, 2022: 32.92, 2021: 30.31, 2020: 27.69, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } },
  { id: "cv-tr6", cat: "Tractor & Trailer", mfg: "Tata", model: "Tata Signa 5530 Trailer (10 W)", body: "Tip Trailer / Bulker / Tanker", rates: { 2024: 40.91, 2023: 36.82, 2022: 34.11, 2021: 31.41, 2020: 28.70, 2019: 0, 2018: 0, 2017: 0, 2016: 0, 2015: 0, 2014: 0, 2013: 0, 2012: 0, 2011: 0 } }
];

// Uncovered model percentage rates by mfg year
const UNCOVERED_PERCENTAGES: Record<number, number> = {
  2024: 65,
  2023: 60,
  2022: 55,
  2021: 50,
  2020: 45,
  2019: 40,
  2018: 36,
  2017: 32,
  2016: 28,
  2015: 24,
  2014: 21,
  2013: 19,
  2012: 17,
  2011: 15
};

export default function CVGridPage() {
  const { addRecentlyViewed } = useData();
  const [activeTab, setActiveTab] = useState<"grid" | "calculator" | "uncovered" | "policy">("grid");

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedMfg, setSelectedMfg] = useState<string>("All Manufacturers");
  const [searchQuery, setSearchQuery] = useState("");

  // Funding Calculator State
  const [calcModelId, setCalcModelId] = useState<string>(OFFICIAL_CV_DATASET[0]?.id || "cv-b1");
  const [calcYear, setCalcYear] = useState<number>(2023);
  const [calcProfileLtv, setCalcProfileLtv] = useState<number>(85);
  const [calcOwnerNo, setCalcOwnerNo] = useState<number>(1);

  // Uncovered Models Calculator State
  const [uncShowroomCost, setUncShowroomCost] = useState<number>(4700000);
  const [uncDiscount, setUncDiscount] = useState<number>(470000);
  const [uncYear, setUncYear] = useState<number>(2024);

  useEffect(() => {
    addRecentlyViewed("cv-grid");
  }, []);

  const yearsList = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011];
  const categoriesList = [
    "All Categories",
    "Bus (School / Staff / Coach)",
    "HCV (Heavy Commercial)",
    "LCV / ICV",
    "MCV (Medium Commercial)",
    "Pick Up (Bolero / Dost / Intra)",
    "SCV (Ace / Jeeto / Supro / Carry)",
    "Tipper",
    "Tractor & Trailer"
  ];
  const mfgList = ["All Manufacturers", "AL", "Tata", "Eicher", "BharatBenz", "Force Motors", "M&M", "SML", "Maruti"];

  // Filter Logic
  const filteredDataset = useMemo(() => {
    return OFFICIAL_CV_DATASET.filter((item) => {
      let matchCat = true;
      if (selectedCategory !== "All Categories") {
        if (selectedCategory.startsWith("Bus")) matchCat = item.cat === "Bus";
        else if (selectedCategory.startsWith("HCV")) matchCat = item.cat === "HCV";
        else if (selectedCategory.startsWith("LCV")) matchCat = item.cat === "LCV / ICV";
        else if (selectedCategory.startsWith("MCV")) matchCat = item.cat === "MCV";
        else if (selectedCategory.startsWith("Pick Up")) matchCat = item.cat === "Pick Up";
        else if (selectedCategory.startsWith("SCV")) matchCat = item.cat === "SCV";
        else if (selectedCategory.startsWith("Tipper")) matchCat = item.cat === "Tipper";
        else if (selectedCategory.startsWith("Tractor")) matchCat = item.cat === "Tractor & Trailer";
      }

      const matchMfg = selectedMfg === "All Manufacturers" || item.mfg === selectedMfg;
      const matchQ = !searchQuery ||
        item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mfg.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchMfg && matchQ;
    });
  }, [selectedCategory, selectedMfg, searchQuery]);

  // Selected Calculator item
  const selectedCalcItem = OFFICIAL_CV_DATASET.find(i => i.id === calcModelId) || OFFICIAL_CV_DATASET[0];
  const calcBaseValuation = selectedCalcItem?.rates[calcYear] || 0;
  const calcValuationRupees = Math.round(calcBaseValuation * 100000);

  // Owner serial adjustment
  let ownerMult = 1.0;
  if (calcOwnerNo === 2) ownerMult = 0.95;
  else if (calcOwnerNo === 3) ownerMult = 0.90;
  else if (calcOwnerNo === 4) ownerMult = 0.84;
  else if (calcOwnerNo === 5) ownerMult = 0.78;

  const calcAdjustedValuation = Math.round(calcValuationRupees * ownerMult);
  const calcEligibleLoan = Math.round((calcAdjustedValuation * calcProfileLtv) / 100);
  const calcEMI = Math.round((calcEligibleLoan * (18 / 1200) * Math.pow(1 + 18 / 1200, 48)) / (Math.pow(1 + 18 / 1200, 48) - 1));

  // Uncovered calculation
  const uncNetCost = Math.max(0, uncShowroomCost - uncDiscount);
  const uncPct = UNCOVERED_PERCENTAGES[uncYear] || 65;
  const uncCalculatedGridValue = Math.round((uncNetCost * uncPct) / 100);
  const unc85Loan = Math.round(uncCalculatedGridValue * 0.85);

  const getExcelData = () => {
    return OFFICIAL_CV_DATASET.map(i => {
      const row: any = {
        Category: i.cat,
        Manufacturer: i.mfg,
        Model: i.model,
        Body: i.body,
        "Max Owner Permitted": "Up to 5th Owner"
      };
      yearsList.forEach(y => {
        row[`${y} (₹L)`] = i.rates[y] ? `${i.rates[y].toFixed(2)}` : "-";
      });
      return row;
    });
  };

  const getWhatsAppSummary = () => {
    return `*KV Flash - Official Commercial Vehicle Quote*\n` +
      `-----------------------------------------\n` +
      `🚛 *Vehicle:* ${selectedCalcItem?.mfg} - ${selectedCalcItem?.model}\n` +
      `🛠️ *Body Type:* ${selectedCalcItem?.body}\n` +
      `📅 *Mfg Year:* ${calcYear} | 👤 *Owner:* ${calcOwnerNo === 1 ? '1st Owner' : `${calcOwnerNo} Owner`}\n` +
      `🏷️ *Grid Benchmark Valuation:* *₹ ${calcBaseValuation.toFixed(2)} Lacs* (${formatINR(calcValuationRupees)})\n` +
      `📊 *Applicable LTV:* *${calcProfileLtv}%*\n` +
      `💰 *Max Eligible Loan:* *${formatINR(calcEligibleLoan)}*\n` +
      `📈 *Est. 48M Monthly EMI (@18%):* *${formatINR(calcEMI)} / mo*\n` +
      `⚠️ *Policy Norm:* Commercial Vehicles permitted up to 5th Owner.\n` +
      `-----------------------------------------\n` +
      `_Kredit Venture / Jads Services Pvt Ltd_`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. HERO HEADER */}
      <div className="bg-gradient-to-br from-card via-surface to-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-soft space-y-5 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                <Truck className="w-4 h-4" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-accent">
                OFFICIAL COMMERCIAL VEHICLE POLICY ATTACHMENT
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              Commercial Vehicle (CV) Valuation Grid &amp; Funding Matrix
            </h1>
            <p className="text-xs sm:text-sm text-muted max-w-3xl leading-relaxed">
              Benchmark valuation grid (2011–2024) across Bus, HCV, LCV, MCV, Pick Up, SCV, Tipper, Tractor &amp; Trailer with uncovered vehicle depreciation norms.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <span className="px-3 py-1.5 rounded-full bg-surface border border-border text-amber-400 text-xs font-bold">
              214 CV Models Listed
            </span>
            <span className="px-3 py-1.5 rounded-full bg-surface border border-border text-foreground text-xs font-bold">
              14 Years (2011–2024)
            </span>
            <ExportActions
              title="KV Flash - Commercial Vehicle Grid"
              moduleKey="cv_grid"
              getDataForExcel={getExcelData}
              getWhatsAppText={getWhatsAppSummary}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
          {[
            { id: "grid", label: "Official CV Attachment Grid", icon: Grid },
            { id: "calculator", label: "CV Funding & LTV Calculator", icon: Calculator },
            { id: "uncovered", label: "Uncovered Models Depreciation Norms", icon: TrendingDown },
            { id: "policy", label: "Policy Underwriting Rules", icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? "bg-accent text-white shadow-soft"
                    : "bg-surface border border-border text-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CATEGORY PILLS FILTER & SEARCH STRIP */}
      {activeTab === "grid" && (
        <div className="bg-card border border-border rounded-3xl p-5 shadow-soft space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-muted shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-accent" /> Category:
            </span>
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-black font-extrabold shadow-soft"
                    : "bg-surface border border-border text-muted hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2 border-t border-border/80">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search model, body, or manufacturer (e.g. 4825, Bus, Intra, Tipper)..."
                className="w-full bg-surface border border-border rounded-xl pl-10 pr-3 py-2 text-xs sm:text-sm text-foreground placeholder-muted focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs font-semibold text-muted">Manufacturer:</span>
              <select
                value={selectedMfg}
                onChange={(e) => setSelectedMfg(e.target.value)}
                className="bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
              >
                {mfgList.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-muted pt-1">
            <span>Showing <strong>{filteredDataset.length}</strong> of 214 CV models</span>
            <span className="flex items-center gap-2">
              <span className="text-amber-400">Values in ₹ Lakhs (e.g. 10.22 = ₹10,22,000)</span>
              <span>&bull;</span>
              <span>Dash (—) = Model year not manufactured or discontinued</span>
            </span>
          </div>
        </div>
      )}

      {/* 3. TAB A: OFFICIAL COMMERCIAL VEHICLE VALUATION TABLE */}
      {activeTab === "grid" && (
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft">
          <div className="p-4 bg-gradient-to-r from-amber-500/20 via-surface to-card border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black uppercase text-foreground">
                COMMERCIAL VEHICLE ATTACHMENT VALUATION MATRIX (IN ₹ LAKHS)
              </span>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Official Kredit Venture Attachment
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface/80 border-b border-border text-muted font-bold text-[10px] uppercase">
                  <th className="p-3 w-14">Cat</th>
                  <th className="p-3 w-14">Mfg</th>
                  <th className="p-3 sticky left-0 bg-surface/90 backdrop-blur-sm z-10 w-60">Model / Variant</th>
                  {yearsList.map((y) => (
                    <th key={y} className="p-2.5 text-center font-mono w-14 font-bold text-foreground">
                      {y}
                    </th>
                  ))}
                  <th className="p-3 text-center w-28">Action / Quote</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredDataset.map((row) => (
                  <tr key={row.id} className="hover:bg-surface/50 transition-colors">
                    <td className="p-3 font-semibold text-muted text-[11px]">
                      {row.cat}
                    </td>
                    <td className="p-3 font-black text-foreground text-xs">
                      {row.mfg}
                    </td>
                    <td className="p-3 font-bold text-foreground sticky left-0 bg-card z-10 border-r border-border/40">
                      <span className="text-foreground block font-bold">{row.model}</span>
                      <span className="text-[10px] text-muted font-normal block truncate max-w-xs">{row.body}</span>
                    </td>
                    {yearsList.map((y) => {
                      const val = row.rates[y] || 0;
                      return (
                        <td
                          key={y}
                          className={`p-2.5 text-center tabular-nums font-mono text-xs ${
                            val === 0 ? "text-muted/25" : "text-foreground font-bold"
                          }`}
                        >
                          {val === 0 ? "—" : val.toFixed(2)}
                        </td>
                      );
                    })}
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setCalcModelId(row.id);
                            setActiveTab("calculator");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-[10px] transition-colors shadow-soft"
                        >
                          Quote
                        </button>
                        <button
                          onClick={() => {
                            setCalcModelId(row.id);
                            setActiveTab("calculator");
                          }}
                          className="px-2 py-1 rounded-lg bg-surface border border-border text-foreground hover:bg-elevated font-semibold text-[10px] transition-colors"
                        >
                          Fund
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TAB B: CV FUNDING & LTV CALCULATOR */}
      {activeTab === "calculator" && (
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-accent" />
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  Commercial Vehicle Funding &amp; LTV Sanction Calculator
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted">
                Compute loan amount, borrower LTV, and 48-month EMI based on official Kredit Venture attachment values.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-400 bg-purple-500/15 px-3 py-1 rounded-full border border-purple-500/30">
              Permitted up to 5th Owner
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-muted block mb-1.5">Selected CV Model</label>
              <select
                value={calcModelId}
                onChange={(e) => setCalcModelId(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
              >
                {OFFICIAL_CV_DATASET.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.mfg} - {i.model} ({i.cat})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-muted block mb-1.5">Manufacturing Year</label>
              <select
                value={calcYear}
                onChange={(e) => setCalcYear(Number(e.target.value))}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
              >
                {yearsList.map((y) => {
                  const val = selectedCalcItem?.rates[y] || 0;
                  return (
                    <option key={y} value={y}>
                      {y} {val > 0 ? `(₹ ${val.toFixed(2)} Lacs)` : "(Discontinued/NA)"}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-muted block mb-1.5">Borrower Profile &amp; LTV Cap</label>
              <select
                value={calcProfileLtv}
                onChange={(e) => setCalcProfileLtv(Number(e.target.value))}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
              >
                <option value={95}>Large Fleet Operator (LFO) — 95%</option>
                <option value={90}>SFO / Captive Cat A/B — 90%</option>
                <option value={85}>Standard Transporter / FTB — 85%</option>
                <option value={80}>First Time User (FTU) — 80%</option>
                <option value={60}>Suvidha (No DL / Rented) — 60%</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-muted block mb-1.5">RC Owner Serial No.</label>
              <select
                value={calcOwnerNo}
                onChange={(e) => setCalcOwnerNo(Number(e.target.value))}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:border-accent"
              >
                <option value={1}>1st Owner (100% Value)</option>
                <option value={2}>2nd Owner (95% Value)</option>
                <option value={3}>3rd Owner (90% Value)</option>
                <option value={4}>4th Owner (84% Value)</option>
                <option value={5}>5th Owner (78% Value - Max Permitted)</option>
              </select>
            </div>
          </div>

          {/* Results Output Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-3xl bg-gradient-to-r from-surface via-card to-surface border border-border shadow-soft">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                Official Grid Benchmark
              </span>
              <span className="text-2xl sm:text-3xl font-black text-foreground tabular-nums">
                ₹ {calcBaseValuation.toFixed(2)} Lacs
              </span>
              <span className="text-xs text-muted block">
                ({formatINR(calcValuationRupees)})
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                Owner Adjusted Value
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 tabular-nums">
                {formatINR(calcAdjustedValuation)}
              </span>
              <span className="text-xs text-muted block">
                Owner #{calcOwnerNo} ({(ownerMult * 100).toFixed(0)}% grid)
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                Sanction Amount ({calcProfileLtv}% LTV)
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
                {formatINR(calcEligibleLoan)}
              </span>
              <span className="text-xs text-emerald-500/90 block">
                Eligible Loan Cap
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                  Est. 48M Monthly EMI (@18%)
                </span>
                <span className="text-2xl sm:text-3xl font-black text-accent tabular-nums">
                  {formatINR(calcEMI)}
                </span>
              </div>
              <button
                onClick={() => {
                  const text = getWhatsAppSummary();
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-soft"
              >
                Share Quote on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB C: UNCOVERED MODELS DEPRECIATION NORMS */}
      {activeTab === "uncovered" && (
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  Grid Calculator for Ungraded / Uncovered Models
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted">
                Official Kredit Venture methodology for calculating valuation for models not listed in standard grid.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
              Official Formula
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interactive Calculator */}
            <div className="p-5 rounded-2xl bg-surface/70 border border-border space-y-4">
              <h3 className="text-sm font-bold text-foreground">Ungraded Vehicle Value Estimator</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted block mb-1">Showroom Invoice Cost (₹)</label>
                  <input
                    type="number"
                    value={uncShowroomCost}
                    onChange={(e) => setUncShowroomCost(Number(e.target.value))}
                    className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground tabular-nums focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted block mb-1">Less OEM Discount (₹)</label>
                  <input
                    type="number"
                    value={uncDiscount}
                    onChange={(e) => setUncDiscount(Number(e.target.value))}
                    className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground tabular-nums focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted block mb-1">Manufacturing Year</label>
                  <select
                    value={uncYear}
                    onChange={(e) => setUncYear(Number(e.target.value))}
                    className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none"
                  >
                    {yearsList.map(y => (
                      <option key={y} value={y}>{y} ({UNCOVERED_PERCENTAGES[y]}% of Net On-Road / NOD)</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Output */}
              <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                <div className="flex justify-between text-xs text-muted">
                  <span>Net Cost (NOD):</span>
                  <span className="font-bold text-foreground">{formatINR(uncNetCost)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted">
                  <span>Depreciation Multiplier:</span>
                  <span className="font-bold text-amber-400">{uncPct}%</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between items-center">
                  <span className="text-xs font-bold text-foreground uppercase">Calculated Grid Value:</span>
                  <span className="text-xl font-black text-emerald-400 tabular-nums">{formatINR(uncCalculatedGridValue)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted">
                  <span>Max 85% Sanction:</span>
                  <span className="font-bold text-accent tabular-nums">{formatINR(unc85Loan)}</span>
                </div>
              </div>
            </div>

            {/* Official Depreciation Schedule Table */}
            <div className="p-5 rounded-2xl bg-surface/70 border border-border space-y-3">
              <h3 className="text-sm font-bold text-foreground">Official Depreciation % Schedule</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {yearsList.map(y => (
                  <div key={y} className="p-2 rounded-xl bg-card border border-border flex items-center justify-between">
                    <span className="font-semibold text-foreground">Mfg Year {y}</span>
                    <span className="font-black text-amber-400 font-mono">{UNCOVERED_PERCENTAGES[y]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB D: POLICY UNDERWRITING RULES */}
      {activeTab === "policy" && (
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-soft space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-black text-foreground">
              Commercial Vehicle Credit Policy &amp; Underwriting Guidelines
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              "End of Tenure (EOT): Maximum vehicle age at end of loan tenure is 15 years for M&HCV/Buses, 12 years for SCV/Pickups.",
              "RC Ownership Limit: Commercial vehicle funding is officially permitted up to 5th owner (including proposed ownership).",
              "Delinquency Threshold: Commercial funding authorized only for non-breach branches (portfolio delinquency < 10%).",
              "Personal Discussion (PD): Mandatory PD by RM / CRM / Branch Manager for every proposal.",
              "Driver License Norms: Funding based on LMV-TR DL restricted up to LCV or < 8 Ton GVW only.",
              "Banking Requirement: Continuous 6 months primary operating account statement mandatory.",
              "Rented Profile Norm: 5% standard deduction from applicable LTV with external property guarantor mandatory.",
              "Discontinued Models: Capped at 60% LTV of grid valuation.",
              "Fitness & Permit: Valid fitness certificate, route permit, and comprehensive commercial insurance mandatory at disbursement.",
              "National / State Permit: Required for long-haul multi-axle freight trailers and interstate tourist buses."
            ].map((rule, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-surface/60 border border-border flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-foreground/90 leading-relaxed font-medium">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
