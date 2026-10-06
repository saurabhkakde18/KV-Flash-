"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Car,
  Truck,
  Bus,
  Layers,
  Sparkles,
  ArrowRight,
  Calculator,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Filter
} from "lucide-react";
import { APPROVED_CARS_DATA, BOLERO_GRID_DATA } from "@/lib/constants";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type VehicleCategoryFilter = "all" | "car" | "bolero" | "cv" | "bus" | "tipper" | "tractor";

interface VehicleSearchResult {
  id: string;
  name: string;
  oem: string;
  category: "Car" | "Bolero" | "CV" | "Bus" | "Tipper" | "Tractor";
  categoryLabel: string;
  bodyType: string;
  maxOwner: string;
  maxOwnerNum: number;
  ratePreview?: string;
  gridUrl: string;
  calcUrl: string;
  leadUrl: string;
}

// Complete Master Commercial Vehicles list for instant search
const MASTER_CV_SEARCH_ITEMS: VehicleSearchResult[] = [
  // --- BUSES ---
  { id: "cv-b1", name: "AL - AC Bus (30-40 seater Staff)", oem: "Ashok Leyland", category: "Bus", categoryLabel: "Staff AC Bus", bodyType: "AC Seater", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 24.01 L", gridUrl: "/cv-grid?tab=grid&cat=Bus", calcUrl: "/calculator?cat=CV&veh=AL+AC+Bus", leadUrl: "/leads?veh=AL+AC+Bus" },
  { id: "cv-b2", name: "AL HCV - Bus (40-50 seat)", oem: "Ashok Leyland", category: "Bus", categoryLabel: "Route / School Bus", bodyType: "Non AC Route", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 26.07 L", gridUrl: "/cv-grid?tab=grid&cat=Bus", calcUrl: "/calculator?cat=CV&veh=AL+HCV+Bus", leadUrl: "/leads?veh=AL+HCV+Bus" },
  { id: "cv-b3", name: "AL HCV - Luxury Coach (40-50 seat)", oem: "Ashok Leyland", category: "Bus", categoryLabel: "Luxury Coach", bodyType: "AC Seater Coach", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 37.74 L", gridUrl: "/cv-grid?tab=grid&cat=Bus", calcUrl: "/calculator?cat=CV&veh=AL+Luxury+Coach", leadUrl: "/leads?veh=AL+Luxury+Coach" },
  { id: "cv-b5", name: "AL HCV - Luxury Sleeper (30-40 seat)", oem: "Ashok Leyland", category: "Bus", categoryLabel: "AC Sleeper Bus", bodyType: "AC Sleeper", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 41.17 L", gridUrl: "/cv-grid?tab=grid&cat=Bus", calcUrl: "/calculator?cat=CV&veh=AL+Sleeper", leadUrl: "/leads?veh=AL+Sleeper" },
  { id: "cv-b8", name: "Eicher - 31 to 40 Seater Route/Staff Bus", oem: "Eicher", category: "Bus", categoryLabel: "Staff / School Bus", bodyType: "Standard Seater", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 18.47 L", gridUrl: "/cv-grid?tab=grid&cat=Bus", calcUrl: "/calculator?cat=CV&veh=Eicher+Bus", leadUrl: "/leads?veh=Eicher+Bus" },
  { id: "cv-b12", name: "Force / Tempo Traveller (13-15 Seater)", oem: "Force Motors", category: "Bus", categoryLabel: "Mini Bus / Van", bodyType: "Passenger Van", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 13.68 L", gridUrl: "/cv-grid?tab=grid&cat=Bus", calcUrl: "/calculator?cat=CV&veh=Force+Traveller+15", leadUrl: "/leads?veh=Force+Traveller+15" },
  { id: "cv-b13", name: "Force / Tempo Traveller (16-20 Seater)", oem: "Force Motors", category: "Bus", categoryLabel: "Mini Bus / Staff", bodyType: "Passenger Van", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 15.96 L", gridUrl: "/cv-grid?tab=grid&cat=Bus", calcUrl: "/calculator?cat=CV&veh=Force+Traveller+20", leadUrl: "/leads?veh=Force+Traveller+20" },
  { id: "cv-b14", name: "Force / Tempo Traveller (21-25 Seater)", oem: "Force Motors", category: "Bus", categoryLabel: "Maxi Cab Bus", bodyType: "Commercial Bus", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 18.24 L", gridUrl: "/cv-grid?tab=grid&cat=Bus", calcUrl: "/calculator?cat=CV&veh=Force+Traveller+25", leadUrl: "/leads?veh=Force+Traveller+25" },
  { id: "cv-b19", name: "Tata - 31 to 40 Seater Bus", oem: "Tata", category: "Bus", categoryLabel: "Route / Staff Bus", bodyType: "Staff Bus", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 18.24 L", gridUrl: "/cv-grid?tab=grid&cat=Bus", calcUrl: "/calculator?cat=CV&veh=Tata+31-40+Bus", leadUrl: "/leads?veh=Tata+31-40+Bus" },
  { id: "cv-b22", name: "Tata HCV - Luxury Seating Coach (40-50)", oem: "Tata", category: "Bus", categoryLabel: "Luxury AC Coach", bodyType: "AC Seater", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 37.74 L", gridUrl: "/cv-grid?tab=grid&cat=Bus", calcUrl: "/calculator?cat=CV&veh=Tata+Luxury+Coach", leadUrl: "/leads?veh=Tata+Luxury+Coach" },
  { id: "cv-b24", name: "Tata HCV - Luxury Sleeper (30-40 seat)", oem: "Tata", category: "Bus", categoryLabel: "Luxury AC Sleeper", bodyType: "AC Sleeper", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 41.17 L", gridUrl: "/cv-grid?tab=grid&cat=Bus", calcUrl: "/calculator?cat=CV&veh=Tata+Sleeper", leadUrl: "/leads?veh=Tata+Sleeper" },
  { id: "cv-b27", name: "SML - 31 to 40 Seater Bus", oem: "SML", category: "Bus", categoryLabel: "School / Staff Bus", bodyType: "Standard Bus", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 16.74 L", gridUrl: "/cv-grid?tab=grid&cat=Bus", calcUrl: "/calculator?cat=CV&veh=SML+31-40+Bus", leadUrl: "/leads?veh=SML+31-40+Bus" },

  // --- HCV & MULTI AXLE ---
  { id: "cv-h1", name: "AL - 28 Ton (10 Wheeler) Cowl / Cabin", oem: "Ashok Leyland", category: "CV", categoryLabel: "Heavy Haulage", bodyType: "10 Tyre Truck", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 27.67 L", gridUrl: "/cv-grid?tab=grid&cat=HCV", calcUrl: "/calculator?cat=CV&veh=AL+28+Ton", leadUrl: "/leads?veh=AL+28+Ton" },
  { id: "cv-h2", name: "AL - 35 Ton (12 Wheeler) Multi-Axle", oem: "Ashok Leyland", category: "CV", categoryLabel: "Heavy Haulage", bodyType: "12 Tyre Truck", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 33.45 L", gridUrl: "/cv-grid?tab=grid&cat=HCV", calcUrl: "/calculator?cat=CV&veh=AL+35+Ton", leadUrl: "/leads?veh=AL+35+Ton" },
  { id: "cv-h3", name: "AL - 42 Ton (14 Wheeler) Multi-Axle", oem: "Ashok Leyland", category: "CV", categoryLabel: "Heavy Haulage", bodyType: "14 Tyre Truck", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 37.05 L", gridUrl: "/cv-grid?tab=grid&cat=HCV", calcUrl: "/calculator?cat=CV&veh=AL+42+Ton", leadUrl: "/leads?veh=AL+42+Ton" },
  { id: "cv-h4", name: "AL - 48 Ton (16 Wheeler) Multi-Axle", oem: "Ashok Leyland", category: "CV", categoryLabel: "Heavy Haulage", bodyType: "16 Tyre Truck", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 41.59 L", gridUrl: "/cv-grid?tab=grid&cat=HCV", calcUrl: "/calculator?cat=CV&veh=AL+48+Ton", leadUrl: "/leads?veh=AL+48+Ton" },
  { id: "cv-h5", name: "BharatBenz - 28 Ton (10 Wheeler)", oem: "BharatBenz", category: "CV", categoryLabel: "Heavy Haulage", bodyType: "10 Tyre Truck", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 29.83 L", gridUrl: "/cv-grid?tab=grid&cat=HCV", calcUrl: "/calculator?cat=CV&veh=BharatBenz+28T", leadUrl: "/leads?veh=BharatBenz+28T" },
  { id: "cv-h7", name: "BharatBenz - 42 Ton (14 Wheeler)", oem: "BharatBenz", category: "CV", categoryLabel: "Heavy Haulage", bodyType: "14 Tyre Truck", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 40.09 L", gridUrl: "/cv-grid?tab=grid&cat=HCV", calcUrl: "/calculator?cat=CV&veh=BharatBenz+42T", leadUrl: "/leads?veh=BharatBenz+42T" },
  { id: "cv-h13", name: "Tata - 28 Ton (10 Wheeler) Cowl / Cabin", oem: "Tata", category: "CV", categoryLabel: "Heavy Haulage", bodyType: "10 Tyre Truck", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 27.67 L", gridUrl: "/cv-grid?tab=grid&cat=HCV", calcUrl: "/calculator?cat=CV&veh=Tata+28+Ton", leadUrl: "/leads?veh=Tata+28+Ton" },
  { id: "cv-h14", name: "Tata - 35 Ton (12 Wheeler) Multi-Axle", oem: "Tata", category: "CV", categoryLabel: "Heavy Haulage", bodyType: "12 Tyre Truck", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 33.45 L", gridUrl: "/cv-grid?tab=grid&cat=HCV", calcUrl: "/calculator?cat=CV&veh=Tata+35+Ton", leadUrl: "/leads?veh=Tata+35+Ton" },
  { id: "cv-h15", name: "Tata - 42 Ton (14 Wheeler) Multi-Axle", oem: "Tata", category: "CV", categoryLabel: "Heavy Haulage", bodyType: "14 Tyre Truck", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 37.05 L", gridUrl: "/cv-grid?tab=grid&cat=HCV", calcUrl: "/calculator?cat=CV&veh=Tata+42+Ton", leadUrl: "/leads?veh=Tata+42+Ton" },
  { id: "cv-h16", name: "Tata - 48 Ton (16 Wheeler) Multi-Axle", oem: "Tata", category: "CV", categoryLabel: "Heavy Haulage", bodyType: "16 Tyre Truck", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 41.59 L", gridUrl: "/cv-grid?tab=grid&cat=HCV", calcUrl: "/calculator?cat=CV&veh=Tata+48+Ton", leadUrl: "/leads?veh=Tata+48+Ton" },

  // --- LCV & ICV ---
  { id: "cv-l1", name: "AL Partner - 4 Tyre (LCV)", oem: "Ashok Leyland", category: "CV", categoryLabel: "Light Commercial", bodyType: "4 Tyre LCV", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 11.23 L", gridUrl: "/cv-grid?tab=grid&cat=LCV+%2F+ICV", calcUrl: "/calculator?cat=CV&veh=AL+Partner+4T", leadUrl: "/leads?veh=AL+Partner+4T" },
  { id: "cv-l2", name: "AL Partner - 6 Tyre (LCV)", oem: "Ashok Leyland", category: "CV", categoryLabel: "Light Commercial", bodyType: "6 Tyre LCV", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 12.35 L", gridUrl: "/cv-grid?tab=grid&cat=LCV+%2F+ICV", calcUrl: "/calculator?cat=CV&veh=AL+Partner+6T", leadUrl: "/leads?veh=AL+Partner+6T" },
  { id: "cv-l3", name: "AL Boss - 9 to 14 Ton (ICV)", oem: "Ashok Leyland", category: "CV", categoryLabel: "Intermediate CV", bodyType: "6 Tyre ICV", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 18.05 L", gridUrl: "/cv-grid?tab=grid&cat=LCV+%2F+ICV", calcUrl: "/calculator?cat=CV&veh=AL+Boss+ICV", leadUrl: "/leads?veh=AL+Boss+ICV" },
  { id: "cv-l7", name: "Eicher Pro 2049 / 2059 (4 Tyre)", oem: "Eicher", category: "CV", categoryLabel: "City LCV", bodyType: "4 Tyre Truck", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 10.97 L", gridUrl: "/cv-grid?tab=grid&cat=LCV+%2F+ICV", calcUrl: "/calculator?cat=CV&veh=Eicher+Pro+2049", leadUrl: "/leads?veh=Eicher+Pro+2049" },
  { id: "cv-l8", name: "Eicher Pro 2095 / 2110 (6 Tyre)", oem: "Eicher", category: "CV", categoryLabel: "Intermediate CV", bodyType: "6 Tyre Truck", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 16.51 L", gridUrl: "/cv-grid?tab=grid&cat=LCV+%2F+ICV", calcUrl: "/calculator?cat=CV&veh=Eicher+Pro+2095", leadUrl: "/leads?veh=Eicher+Pro+2095" },
  { id: "cv-l11", name: "Tata 407 Gold / SFC 407 (4 Tyre)", oem: "Tata", category: "CV", categoryLabel: "Legendary LCV", bodyType: "4 Tyre LCV", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 9.87 L", gridUrl: "/cv-grid?tab=grid&cat=LCV+%2F+ICV", calcUrl: "/calculator?cat=CV&veh=Tata+407+Gold", leadUrl: "/leads?veh=Tata+407+Gold" },
  { id: "cv-l12", name: "Tata 709 / 710 SFC / LPT (4/6 Tyre)", oem: "Tata", category: "CV", categoryLabel: "Intermediate CV", bodyType: "6 Tyre Truck", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 12.35 L", gridUrl: "/cv-grid?tab=grid&cat=LCV+%2F+ICV", calcUrl: "/calculator?cat=CV&veh=Tata+709", leadUrl: "/leads?veh=Tata+709" },
  { id: "cv-l13", name: "Tata 1109 / 1412 / 1512 LPT (6 Tyre)", oem: "Tata", category: "CV", categoryLabel: "Medium ICV", bodyType: "6 Tyre Heavy", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 18.05 L", gridUrl: "/cv-grid?tab=grid&cat=LCV+%2F+ICV", calcUrl: "/calculator?cat=CV&veh=Tata+1109", leadUrl: "/leads?veh=Tata+1109" },
  { id: "cv-l15", name: "SML Sartaj / Prestige (4/6 Tyre)", oem: "SML", category: "CV", categoryLabel: "Light / Medium CV", bodyType: "4/6 Tyre Truck", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 12.35 L", gridUrl: "/cv-grid?tab=grid&cat=LCV+%2F+ICV", calcUrl: "/calculator?cat=CV&veh=SML+Sartaj", leadUrl: "/leads?veh=SML+Sartaj" },

  // --- TIPPERS ---
  { id: "cv-t1", name: "AL - 28 Ton Tipper (2820/2825 / 10W)", oem: "Ashok Leyland", category: "Tipper", categoryLabel: "Mining & Heavy Tipper", bodyType: "10 Tyre Box / Rock", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 33.45 L", gridUrl: "/cv-grid?tab=grid&cat=Tipper", calcUrl: "/calculator?cat=CV&veh=AL+28+Ton+Tipper", leadUrl: "/leads?veh=AL+28+Ton+Tipper" },
  { id: "cv-t2", name: "AL - 35 Ton Tipper (3525 / 12W)", oem: "Ashok Leyland", category: "Tipper", categoryLabel: "Heavy Construction Tipper", bodyType: "12 Tyre Tipper", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 41.59 L", gridUrl: "/cv-grid?tab=grid&cat=Tipper", calcUrl: "/calculator?cat=CV&veh=AL+35+Ton+Tipper", leadUrl: "/leads?veh=AL+35+Ton+Tipper" },
  { id: "cv-t4", name: "BharatBenz - 2828C / 2823C (10W Tipper)", oem: "BharatBenz", category: "Tipper", categoryLabel: "Mining & Infrastructure", bodyType: "10 Tyre Heavy", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 36.48 L", gridUrl: "/cv-grid?tab=grid&cat=Tipper", calcUrl: "/calculator?cat=CV&veh=BharatBenz+2828C", leadUrl: "/leads?veh=BharatBenz+2828C" },
  { id: "cv-t8", name: "Tata - 28 Ton Tipper (Prima / Signa 2825)", oem: "Tata", category: "Tipper", categoryLabel: "Mining & Infrastructure", bodyType: "10 Tyre Tipper", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 33.45 L", gridUrl: "/cv-grid?tab=grid&cat=Tipper", calcUrl: "/calculator?cat=CV&veh=Tata+28+Ton+Tipper", leadUrl: "/leads?veh=Tata+28+Ton+Tipper" },
  { id: "cv-t9", name: "Tata - 35 Ton Tipper (Signa 3525.TK)", oem: "Tata", category: "Tipper", categoryLabel: "Heavy Haulage Tipper", bodyType: "12 Tyre Tipper", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 41.59 L", gridUrl: "/cv-grid?tab=grid&cat=Tipper", calcUrl: "/calculator?cat=CV&veh=Tata+35+Ton+Tipper", leadUrl: "/leads?veh=Tata+35+Ton+Tipper" },

  // --- TRACTOR & TRAILER ---
  { id: "cv-tr1", name: "AL - 4020 / 4620 Tractor Head (4x2)", oem: "Ashok Leyland", category: "Tractor", categoryLabel: "Tractor Prime Mover", bodyType: "Prime Mover 4x2", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 27.67 L", gridUrl: "/cv-grid?tab=grid&cat=Tractor+%26+Trailer", calcUrl: "/calculator?cat=CV&veh=AL+4020+Tractor", leadUrl: "/leads?veh=AL+4020+Tractor" },
  { id: "cv-tr2", name: "AL - 5525 Tractor Head (6x4 Prime Mover)", oem: "Ashok Leyland", category: "Tractor", categoryLabel: "Heavy Tractor Trailer", bodyType: "Prime Mover 6x4", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 34.49 L", gridUrl: "/cv-grid?tab=grid&cat=Tractor+%26+Trailer", calcUrl: "/calculator?cat=CV&veh=AL+5525+Tractor", leadUrl: "/leads?veh=AL+5525+Tractor" },
  { id: "cv-tr5", name: "Tata - 5525.S / 5530.S Tractor (6x4)", oem: "Tata", category: "Tractor", categoryLabel: "Heavy Prime Mover", bodyType: "Prime Mover 6x4", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 34.49 L", gridUrl: "/cv-grid?tab=grid&cat=Tractor+%26+Trailer", calcUrl: "/calculator?cat=CV&veh=Tata+5525+Tractor", leadUrl: "/leads?veh=Tata+5525+Tractor" },

  // --- SCV & PICK UP CV ---
  { id: "cv-p1", name: "AL Dost+ / Dost Strong (1.25T)", oem: "Ashok Leyland", category: "CV", categoryLabel: "Small Commercial", bodyType: "Pick Up", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 6.95 L", gridUrl: "/cv-grid?tab=grid&cat=SCV", calcUrl: "/calculator?cat=CV&veh=AL+Dost", leadUrl: "/leads?veh=AL+Dost" },
  { id: "cv-p2", name: "AL Bada Dost i2 / i3 / i4 (1.4T - 1.8T)", oem: "Ashok Leyland", category: "CV", categoryLabel: "Pick Up Truck", bodyType: "Deck Pick Up", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 8.55 L", gridUrl: "/cv-grid?tab=grid&cat=Pick+Up", calcUrl: "/calculator?cat=CV&veh=AL+Bada+Dost", leadUrl: "/leads?veh=AL+Bada+Dost" },
  { id: "cv-p4", name: "Tata Ace Gold / HT / EV (SCV Mini)", oem: "Tata", category: "CV", categoryLabel: "Chhota Hathi SCV", bodyType: "Mini Truck", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 4.95 L", gridUrl: "/cv-grid?tab=grid&cat=SCV", calcUrl: "/calculator?cat=CV&veh=Tata+Ace+Gold", leadUrl: "/leads?veh=Tata+Ace+Gold" },
  { id: "cv-p5", name: "Tata Intra V10 / V30 / V50 Smart Pick Up", oem: "Tata", category: "CV", categoryLabel: "Smart SCV Pick Up", bodyType: "Deck Pick Up", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 7.85 L", gridUrl: "/cv-grid?tab=grid&cat=Pick+Up", calcUrl: "/calculator?cat=CV&veh=Tata+Intra+V30", leadUrl: "/leads?veh=Tata+Intra+V30" },
  { id: "cv-p7", name: "Maruti Super Carry (Petrol / CNG)", oem: "Maruti", category: "CV", categoryLabel: "Mini SCV Truck", bodyType: "Mini Truck", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, ratePreview: "2024: ₹ 4.85 L", gridUrl: "/cv-grid?tab=grid&cat=SCV", calcUrl: "/calculator?cat=CV&veh=Maruti+Super+Carry", leadUrl: "/leads?veh=Maruti+Super+Carry" }
];

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<VehicleCategoryFilter>("all");
  const [selectedOem, setSelectedOem] = useState<string>("all");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery("");
      setActiveCategory("all");
      setSelectedOem("all");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Combine and normalize all vehicle databases
  const allVehicles = useMemo<VehicleSearchResult[]>(() => {
    const list: VehicleSearchResult[] = [];

    // 1. Approved Private Cars
    APPROVED_CARS_DATA.forEach((c) => {
      list.push({
        id: `car-${c.sNo}-${c.asset.replace(/\s+/g, "_")}`,
        name: c.asset,
        oem: c.oem,
        category: "Car",
        categoryLabel: c.segment ? `${c.segment} Car` : "Passenger Car",
        bodyType: c.segment || "Passenger Car",
        maxOwner: c.maxOwner || "Up to 4th Owner",
        maxOwnerNum: c.maxOwnerNum || 4,
        ratePreview: "Approved LTV: 85%",
        gridUrl: `/approved-cars?search=${encodeURIComponent(c.asset)}`,
        calcUrl: `/calculator?cat=Car&veh=${encodeURIComponent(c.asset)}`,
        leadUrl: `/leads?veh=${encodeURIComponent(c.asset)}`
      });
    });

    // 2. Bolero & SCV Pickup Range
    const boleroMap = new Map<string, typeof BOLERO_GRID_DATA[0]>();
    BOLERO_GRID_DATA.forEach((b) => {
      if (!boleroMap.has(b.model)) {
        boleroMap.set(b.model, b);
      }
    });

    boleroMap.forEach((b, modelName) => {
      list.push({
        id: `bolero-${modelName.replace(/\s+/g, "_")}`,
        name: `${b.model} (${b.variant || "All Variants"})`,
        oem: "Mahindra",
        category: "Bolero",
        categoryLabel: "Bolero / SCV Range",
        bodyType: b.variant || "Commercial Pick Up",
        maxOwner: "Up to 5th Owner",
        maxOwnerNum: 5,
        ratePreview: `2024: ₹ ${b.valuationLacs} L`,
        gridUrl: `/bolero-grid?search=${encodeURIComponent(b.model)}`,
        calcUrl: `/calculator?cat=Bolero&veh=${encodeURIComponent(b.model)}`,
        leadUrl: `/leads?veh=${encodeURIComponent(b.model)}`
      });
    });

    // 3. Commercial Vehicles (CVs)
    MASTER_CV_SEARCH_ITEMS.forEach((cv) => {
      list.push(cv);
    });

    return list;
  }, []);

  // Filter list by query, category, and OEM
  const filteredVehicles = useMemo(() => {
    let res = allVehicles;

    // Filter by Category
    if (activeCategory !== "all") {
      if (activeCategory === "car") res = res.filter((v) => v.category === "Car");
      else if (activeCategory === "bolero") res = res.filter((v) => v.category === "Bolero");
      else if (activeCategory === "cv") res = res.filter((v) => v.category === "CV");
      else if (activeCategory === "bus") res = res.filter((v) => v.category === "Bus");
      else if (activeCategory === "tipper") res = res.filter((v) => v.category === "Tipper");
      else if (activeCategory === "tractor") res = res.filter((v) => v.category === "Tractor");
    }

    // Filter by OEM
    if (selectedOem !== "all") {
      res = res.filter((v) => v.oem.toLowerCase() === selectedOem.toLowerCase());
    }

    // Filter by Search Query
    if (query.trim()) {
      const q = query.toLowerCase();
      res = res.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.oem.toLowerCase().includes(q) ||
          v.bodyType.toLowerCase().includes(q) ||
          v.categoryLabel.toLowerCase().includes(q)
      );
    }

    return res;
  }, [allVehicles, query, activeCategory, selectedOem]);

  // List of unique OEMs
  const oemList = useMemo(() => {
    const set = new Set<string>();
    allVehicles.forEach((v) => set.add(v.oem));
    return Array.from(set).sort();
  }, [allVehicles]);

  const handleNavigate = (url: string) => {
    onClose();
    router.push(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-14 px-3 sm:px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-3xl bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Banner */}
        <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-b from-surface/80 to-surface/40">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-accent-muted border border-accent/30 flex items-center justify-center text-accent shadow-sm">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-1.5">
                  KV Flash Vehicle Search
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                    {allVehicles.length}+ Models
                  </span>
                </h3>
                <p className="text-[11px] text-muted hidden sm:block">
                  Instant lookup for Approved Cars, Bolero Range, Commercial Vehicles & Tippers
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-card border border-border text-muted hover:text-foreground hover:bg-surface transition-colors"
              aria-label="Close vehicle search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dedicated Vehicle Input */}
          <div className="relative flex items-center px-4 py-3 rounded-2xl bg-card border border-border focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/25 shadow-inner transition-all">
            <Search className="w-5 h-5 text-accent shrink-0 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type vehicle name... (e.g., Swift, Creta, Bolero Pikup, Tata 407, AL 2820, Force Traveller)"
              className="w-full bg-transparent text-foreground placeholder-muted text-sm sm:text-base focus:outline-none font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-surface mr-2 transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-muted bg-surface border border-border rounded-md">
              ESC
            </kbd>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeCategory === "all"
                  ? "bg-accent text-white shadow-md shadow-accent/20"
                  : "bg-card border border-border text-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              All Vehicles
            </button>

            <button
              onClick={() => setActiveCategory("car")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeCategory === "car"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-card border border-border text-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              🚗 Approved Cars
            </button>

            <button
              onClick={() => setActiveCategory("bolero")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeCategory === "bolero"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-500/20"
                  : "bg-card border border-border text-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              🛻 Bolero Range
            </button>

            <button
              onClick={() => setActiveCategory("cv")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeCategory === "cv"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "bg-card border border-border text-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              🚚 CV Trucks / LCV
            </button>

            <button
              onClick={() => setActiveCategory("bus")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeCategory === "bus"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                  : "bg-card border border-border text-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              <Bus className="w-3.5 h-3.5" />
              🚌 Buses
            </button>

            <button
              onClick={() => setActiveCategory("tipper")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeCategory === "tipper"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-500/20"
                  : "bg-card border border-border text-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              🚛 Tippers & HCV
            </button>

            <button
              onClick={() => setActiveCategory("tractor")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeCategory === "tractor"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/20"
                  : "bg-card border border-border text-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              🚜 Tractors
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-border/40">
          {filteredVehicles.length === 0 ? (
            <div className="py-14 text-center text-muted">
              <Car className="w-12 h-12 mx-auto mb-3 opacity-25 text-accent animate-pulse" />
              <h4 className="text-sm font-bold text-foreground">No vehicles found matching &ldquo;{query}&rdquo;</h4>
              <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
                Try searching for models like Swift, Creta, Bolero Extra Long, Tata 407, Ashok Leyland 2820, or Eicher Pro.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1 py-1 text-[11px] font-bold text-muted uppercase tracking-wider">
                <span>Matching Vehicles ({filteredVehicles.length})</span>
                <span>Actions: Grid • EMI • Lead</span>
              </div>

              {filteredVehicles.slice(0, 30).map((v) => (
                <div
                  key={v.id}
                  className="p-3.5 rounded-2xl bg-surface/50 border border-border/70 hover:border-accent/50 hover:bg-surface transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  {/* Left: Vehicle Title, OEM, Body, Serial */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-foreground group-hover:text-accent transition-colors">
                        {v.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-accent-muted text-accent border border-accent/20">
                        {v.oem}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-elevated text-muted">
                        {v.categoryLabel}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-muted">
                      <span>Type: <strong className="text-foreground/80">{v.bodyType}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        {v.maxOwner}
                      </span>
                      {v.ratePreview && (
                        <>
                          <span>•</span>
                          <span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                            {v.ratePreview}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Action Triggers */}
                  <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <button
                      onClick={() => handleNavigate(v.gridUrl)}
                      className="px-2.5 py-1.5 rounded-xl bg-card border border-border hover:border-accent/50 text-foreground text-xs font-bold flex items-center gap-1 hover:bg-surface transition-colors"
                      title="Open Rate Matrix"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-accent" />
                      <span>Grid</span>
                    </button>

                    <button
                      onClick={() => handleNavigate(v.calcUrl)}
                      className="px-2.5 py-1.5 rounded-xl bg-accent text-white text-xs font-bold flex items-center gap-1 hover:bg-accent-hover shadow-sm shadow-accent/20 transition-colors"
                      title="Calculate Loan & EMI"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>EMI</span>
                    </button>

                    <button
                      onClick={() => handleNavigate(v.leadUrl)}
                      className="p-1.5 rounded-xl bg-card border border-border hover:border-emerald-500/50 text-muted hover:text-emerald-400 transition-colors"
                      title="Create Loan Lead for this vehicle"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-3 bg-surface/80 border-t border-border flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted">
          <div className="flex items-center gap-3">
            <span>Click <strong>Grid</strong> for 2011–2024 rates</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Click <strong>EMI</strong> for instant eligibility</span>
          </div>
          <span className="flex items-center gap-1 font-bold text-accent">
            <Sparkles className="w-3.5 h-3.5" /> KV Flash Vehicle Engine
          </span>
        </div>
      </div>
    </div>
  );
}
