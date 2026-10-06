import {
  IIRRateItem,
  DSAPayoutSlab,
  PolicySection,
  CVGridItem,
  BoleroGridItem,
  ChargeItem,
  CircularItem,
  CustomerLead,
  ContactItem,
  ModuleCardInfo,
  ApprovedCarItem
} from '@/types';

export const APP_NAME = "KV Flash";
export const COMPANY_NAME = "Kredit Venture";
export const PARENT_COMPANY = "Jads Services Pvt Ltd";
export const TAGLINE = "You're one step closer to what you want";

export const APPROVED_CARS_DATA: ApprovedCarItem[] = [
  { sNo: 1, status: "Approved", oem: "Honda", asset: "Honda Amaze", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Sedan", fuelType: "Petrol / Diesel", notes: "Personal / Commercial" },
  { sNo: 2, status: "Approved", oem: "Honda", asset: "Honda City", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Sedan", fuelType: "Petrol / Diesel", notes: "Personal / Commercial" },
  { sNo: 3, status: "Approved", oem: "Honda", asset: "Honda WR-V", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Compact SUV", fuelType: "Petrol / Diesel", notes: "Personal" },
  { sNo: 4, status: "Approved", oem: "Hyundai", asset: "Hyundai Aura", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Sedan", fuelType: "Petrol / CNG / Diesel", notes: "Personal / Commercial" },
  { sNo: 5, status: "Approved", oem: "Hyundai", asset: "Hyundai Creta", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "SUV", fuelType: "Petrol / Diesel", notes: "Personal" },
  { sNo: 6, status: "Approved", oem: "Hyundai", asset: "Hyundai Grand I 10", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Hatchback", fuelType: "Petrol / CNG / Diesel", notes: "Personal / Commercial" },
  { sNo: 7, status: "Approved", oem: "Hyundai", asset: "Hyundai I 10", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Hatchback", fuelType: "Petrol / CNG", notes: "Personal" },
  { sNo: 8, status: "Approved", oem: "Hyundai", asset: "Hyundai I 20", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Premium Hatchback", fuelType: "Petrol / Diesel", notes: "Personal" },
  { sNo: 9, status: "Approved", oem: "Hyundai", asset: "Hyundai Venue", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Compact SUV", fuelType: "Petrol / Diesel", notes: "Personal" },
  { sNo: 10, status: "Approved", oem: "Hyundai", asset: "Hyundai Verna", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Sedan", fuelType: "Petrol / Diesel", notes: "Personal" },
  { sNo: 11, status: "Approved", oem: "Hyundai", asset: "Hyundai Xcent", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Sedan", fuelType: "Petrol / CNG / Diesel", notes: "Personal / Commercial" },
  { sNo: 12, status: "Approved", oem: "Jeep", asset: "Jeep Compass", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Premium SUV", fuelType: "Diesel / Petrol", notes: "Personal" },
  { sNo: 13, status: "Approved", oem: "Kia", asset: "Kia Seltos", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "SUV", fuelType: "Petrol / Diesel", notes: "Personal" },
  { sNo: 14, status: "Approved", oem: "Kia", asset: "Kia Sonet", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Compact SUV", fuelType: "Petrol / Diesel", notes: "Personal" },
  { sNo: 15, status: "Approved", oem: "Mahindra", asset: "Mahindra Bolero", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, segment: "MUV / Utility", fuelType: "Diesel", notes: "Personal / Commercial (Up to 5th Owner allowable)" },
  { sNo: 16, status: "Approved", oem: "Mahindra", asset: "Mahindra Scorpio S 10", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "SUV", fuelType: "Diesel", notes: "Personal / Commercial" },
  { sNo: 17, status: "Approved", oem: "Mahindra", asset: "Mahindra Scorpio S 11", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "SUV", fuelType: "Diesel", notes: "Personal / Commercial" },
  { sNo: 18, status: "Approved", oem: "Mahindra", asset: "Mahindra Thar", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "4x4 Lifestyle SUV", fuelType: "Diesel / Petrol", notes: "Personal" },
  { sNo: 19, status: "Approved", oem: "Mahindra", asset: "Mahindra XUV 300", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Compact SUV", fuelType: "Petrol / Diesel", notes: "Personal" },
  { sNo: 20, status: "Approved", oem: "Maruti", asset: "Maruti Alto", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Entry Hatchback", fuelType: "Petrol / CNG", notes: "Personal" },
  { sNo: 21, status: "Approved", oem: "Maruti", asset: "Maruti Alto 800", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Entry Hatchback", fuelType: "Petrol / CNG", notes: "Personal" },
  { sNo: 22, status: "Approved", oem: "Maruti", asset: "Maruti Alto K 10", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Hatchback", fuelType: "Petrol / CNG", notes: "Personal" },
  { sNo: 23, status: "Approved", oem: "Maruti", asset: "Maruti Baleno", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Premium Hatchback", fuelType: "Petrol / CNG", notes: "Personal" },
  { sNo: 24, status: "Approved", oem: "Maruti", asset: "Maruti Celerio", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Hatchback", fuelType: "Petrol / CNG", notes: "Personal" },
  { sNo: 25, status: "Approved", oem: "Maruti", asset: "Maruti Ciaz", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Sedan", fuelType: "Petrol / Diesel / Hybrid", notes: "Personal / Commercial" },
  { sNo: 26, status: "Approved", oem: "Maruti", asset: "Maruti Eeco", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, segment: "Van / MUV", fuelType: "Petrol / CNG", notes: "Personal / Commercial (Up to 5th Owner allowable)" },
  { sNo: 27, status: "Approved", oem: "Maruti", asset: "Maruti Ertiga", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "MUV", fuelType: "Petrol / CNG / Diesel", notes: "Personal / Commercial" },
  { sNo: 28, status: "Approved", oem: "Maruti", asset: "Maruti Ignis", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Urban Hatchback", fuelType: "Petrol", notes: "Personal" },
  { sNo: 29, status: "Approved", oem: "Maruti", asset: "Maruti Omni", maxOwner: "Up to 5th Owner", maxOwnerNum: 5, segment: "Van", fuelType: "Petrol / CNG / LPG", notes: "Personal / Commercial (Up to 5th Owner allowable)" },
  { sNo: 30, status: "Approved", oem: "Maruti", asset: "Maruti S Cross", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Crossover SUV", fuelType: "Petrol / Diesel", notes: "Personal" },
  { sNo: 31, status: "Approved", oem: "Maruti", asset: "Maruti S-Presso", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Mini SUV", fuelType: "Petrol / CNG", notes: "Personal" },
  { sNo: 32, status: "Approved", oem: "Maruti", asset: "Maruti Swift", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Hatchback", fuelType: "Petrol / Diesel / CNG", notes: "Personal / Commercial" },
  { sNo: 33, status: "Approved", oem: "Maruti", asset: "Maruti Swift Dzire", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Sedan", fuelType: "Petrol / Diesel / CNG", notes: "Personal / Commercial" },
  { sNo: 34, status: "Approved", oem: "Maruti", asset: "Maruti Vitara Brezza", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Compact SUV", fuelType: "Diesel / Petrol", notes: "Personal" },
  { sNo: 35, status: "Approved", oem: "Maruti", asset: "Maruti Wagon R", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Tall Boy Hatchback", fuelType: "Petrol / CNG", notes: "Personal / Commercial" },
  { sNo: 36, status: "Approved", oem: "Maruti", asset: "Maruti XL 6", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Premium MPV", fuelType: "Petrol / Smart Hybrid", notes: "Personal" },
  { sNo: 37, status: "Approved", oem: "Renault", asset: "Renault Kwid", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Hatchback", fuelType: "Petrol", notes: "Personal" },
  { sNo: 38, status: "Approved", oem: "Tata", asset: "Tata Altroz", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Premium Hatchback", fuelType: "Petrol / Diesel / CNG", notes: "Personal" },
  { sNo: 39, status: "Approved", oem: "Tata", asset: "Tata Bolt", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Hatchback", fuelType: "Petrol / Diesel", notes: "Personal" },
  { sNo: 40, status: "Approved", oem: "Tata", asset: "Tata Harrier", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Mid-size SUV", fuelType: "Diesel", notes: "Personal" },
  { sNo: 41, status: "Approved", oem: "Tata", asset: "Tata Hexa", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "MUV / SUV", fuelType: "Diesel", notes: "Personal" },
  { sNo: 42, status: "Approved", oem: "Tata", asset: "Tata Nexon", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Compact SUV", fuelType: "Petrol / Diesel / EV", notes: "Personal" },
  { sNo: 43, status: "Approved", oem: "Tata", asset: "Tata Tiago", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Hatchback", fuelType: "Petrol / CNG / EV", notes: "Personal" },
  { sNo: 44, status: "Approved", oem: "Toyota", asset: "Toyota Fortuner", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Full Size SUV", fuelType: "Diesel / Petrol 4x4", notes: "Personal" },
  { sNo: 45, status: "Approved", oem: "Toyota", asset: "Toyota Glanza", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Premium Hatchback", fuelType: "Petrol / CNG", notes: "Personal" },
  { sNo: 46, status: "Approved", oem: "Toyota", asset: "Toyota Innova", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "MUV", fuelType: "Diesel / Petrol", notes: "Personal / Commercial" },
  { sNo: 47, status: "Approved", oem: "Toyota", asset: "Toyota Innova Crysta", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Premium MUV", fuelType: "Diesel / Petrol", notes: "Personal / Commercial" },
  { sNo: 48, status: "Approved", oem: "Toyota", asset: "Toyota Urban Cruiser", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Compact SUV", fuelType: "Petrol", notes: "Personal" },
  { sNo: 49, status: "Approved", oem: "Mahindra", asset: "Mahindra XUV 700", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Premium SUV", fuelType: "Diesel / Petrol", notes: "Personal" },
  { sNo: 50, status: "Approved", oem: "Tata", asset: "Tata Punch", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Micro SUV", fuelType: "Petrol / CNG / EV", notes: "Personal" },
  { sNo: 51, status: "Approved", oem: "Toyota", asset: "Toyota Hyryder", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Hybrid SUV", fuelType: "Hybrid / Petrol / CNG", notes: "Personal" },
  { sNo: 52, status: "Approved", oem: "Mahindra", asset: "Mahindra Scorpio N", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "SUV", fuelType: "Diesel / Petrol 4x4", notes: "Personal" },
  { sNo: 53, status: "Approved", oem: "Tata", asset: "Tata Tigor", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Sedan", fuelType: "Petrol / CNG / EV", notes: "Personal / Commercial" },
  { sNo: 54, status: "Approved", oem: "Toyota", asset: "Etios (For commercial use only)", maxOwner: "Up to 4th Owner", maxOwnerNum: 4, segment: "Commercial Sedan", fuelType: "Diesel / Petrol", notes: "For commercial use only (Yellow Board / Taxi permit required)" }
];

export const MODULES_LIST: ModuleCardInfo[] = [
  {
    id: "approved-cars",
    title: "Approved Car List",
    shortDesc: "54 official eligible passenger & commercial car models",
    iconName: "CheckCircle",
    href: "/approved-cars",
    category: "Grids & Valuations",
    lastUpdated: "Aug 2024",
    badge: "54 Models"
  },
  {
    id: "iir-matrix",
    title: "IIR Matrix",
    shortDesc: "Vehicle rate chart by age, category, IRR & WIRR",
    iconName: "Percent",
    href: "/iir-matrix",
    category: "Rates & Matrix",
    lastUpdated: "Aug 2024",
    badge: "Active Slabs"
  },
  {
    id: "dsa-payout",
    title: "DSA Payout",
    shortDesc: "Commission grids, slab calculator & monthly tracker",
    iconName: "Wallet",
    href: "/dsa-payout",
    category: "Rates & Matrix",
    lastUpdated: "Aug 2024",
    badge: "Updated"
  },
  {
    id: "cv-policy",
    title: "Commercial Vehicle Policy",
    shortDesc: "Cat A-F funding, LTV, Tatkal, RC caps & asset norms",
    iconName: "Truck",
    href: "/cv-policy",
    category: "Policies",
    lastUpdated: "Aug 2024",
    badge: "Amended"
  },
  {
    id: "car-policy",
    title: "Car Policy",
    shortDesc: "Salaried, NIP, Banking & Repayment surrogate norms",
    iconName: "Car",
    href: "/car-policy",
    category: "Policies",
    lastUpdated: "Feb 2026",
    badge: "Amended"
  },
  {
    id: "cv-grid",
    title: "CV Grid",
    shortDesc: "Valuations & max funding from 1 to 14 years old",
    iconName: "Grid",
    href: "/cv-grid",
    category: "Grids & Valuations",
    lastUpdated: "Jul 2024",
    badge: "50+ Models"
  },
  {
    id: "bolero-grid",
    title: "Bolero Pickup Grid",
    shortDesc: "Dedicated Pickup, Camper & Maxi Truck valuation matrix",
    iconName: "ShieldCheck",
    href: "/bolero-grid",
    category: "Grids & Valuations",
    lastUpdated: "Aug 2024",
    badge: "Quick Check"
  },
  {
    id: "charges",
    title: "Charges & Fees",
    shortDesc: "Processing fees, documentation, valuation & stamp duty",
    iconName: "Receipt",
    href: "/charges",
    category: "Rates & Matrix",
    lastUpdated: "Jul 2024",
    badge: "Schedule"
  },
  {
    id: "calculator",
    title: "EMI & Eligibility",
    shortDesc: "EMI, amortization chart, FOIR & Flat-to-Reducing",
    iconName: "Calculator",
    href: "/calculator",
    category: "Tools & Utilities",
    lastUpdated: "Live Tool",
    badge: "Quote PDF"
  },
  {
    id: "documents",
    title: "Documents Checklist",
    shortDesc: "KYC, banking, ITR & vehicle papers by profile",
    iconName: "FileCheck",
    href: "/documents",
    category: "Tools & Utilities",
    lastUpdated: "Aug 2024",
    badge: "Checklist"
  },
  {
    id: "circulars",
    title: "Rate Updates / Circulars",
    shortDesc: "Policy notices, rate changes & official bulletins",
    iconName: "BellRing",
    href: "/circulars",
    category: "Operations & Leads",
    lastUpdated: "Sept 2026",
    badge: "3 New"
  },
  {
    id: "leads",
    title: "Quick Notes / Leads",
    shortDesc: "Mini CRM for field staff, lead pipeline & follow-ups",
    iconName: "Users",
    href: "/leads",
    category: "Operations & Leads",
    lastUpdated: "Local Sync",
    badge: "Field CRM"
  },
  {
    id: "contacts",
    title: "Contacts Directory",
    shortDesc: "Branch Managers, Credit ACM/RCM, Valuators & RM",
    iconName: "PhoneCall",
    href: "/contacts",
    category: "Operations & Leads",
    lastUpdated: "Active",
    badge: "1-Tap Dial"
  }
];

export const IIR_MATRIX_DATA: IIRRateItem[] = [
  // Used Cars - Personal Car
  { id: "iir-1", category: "Used Cars", product: "Personal Car", mfgYear: "2021-2025", irr: 18.0, wirr: 16.0, tenureMaxMonths: 60, maxLTV: 90, customerProfile: "Salaried / SEP", scoreBand: ">=700", updatedAt: "2024-08-01" },
  { id: "iir-2", category: "Used Cars", product: "Personal Car", mfgYear: "2016-2020", irr: 19.0, wirr: 17.0, tenureMaxMonths: 48, maxLTV: 85, customerProfile: "Salaried / SENP", scoreBand: ">=650", updatedAt: "2024-08-01" },
  { id: "iir-3", category: "Used Cars", product: "Personal Car", mfgYear: "2011-2015", irr: 20.0, wirr: 18.0, tenureMaxMonths: 36, maxLTV: 75, customerProfile: "All Profiles", scoreBand: ">=600", updatedAt: "2024-08-01" },

  // Used Cars - Commercial Car
  { id: "iir-4", category: "Used Cars", product: "Commercial Car (Taxi/Fleet)", mfgYear: "2021-2025", irr: 18.0, wirr: 17.0, tenureMaxMonths: 48, maxLTV: 80, customerProfile: "Fleet / Tour Operator", scoreBand: ">=675", updatedAt: "2024-08-01" },
  { id: "iir-5", category: "Used Cars", product: "Commercial Car (Taxi/Fleet)", mfgYear: "2016-2020", irr: 20.0, wirr: 18.0, tenureMaxMonths: 36, maxLTV: 75, customerProfile: "Fleet Operator", scoreBand: ">=650", updatedAt: "2024-08-01" },
  { id: "iir-6", category: "Used Cars", product: "Commercial Car (Taxi/Fleet)", mfgYear: "2011-2015", irr: 21.0, wirr: 19.0, tenureMaxMonths: 24, maxLTV: 65, customerProfile: "Experienced Driver", scoreBand: ">=600", updatedAt: "2024-08-01" },

  // Used CV - SCV
  { id: "iir-7", category: "Used Commercial Vehicles", product: "SCV (Small Commercial Vehicle)", mfgYear: "2021-2025", irr: 18.0, wirr: 17.0, tenureMaxMonths: 48, maxLTV: 90, customerProfile: "Captive / FTB / FTU", scoreBand: ">=650", updatedAt: "2024-08-01" },
  { id: "iir-8", category: "Used Commercial Vehicles", product: "SCV (Small Commercial Vehicle)", mfgYear: "2016-2020", irr: 19.0, wirr: 18.0, tenureMaxMonths: 36, maxLTV: 80, customerProfile: "Captive / Transporter", scoreBand: ">=600", updatedAt: "2024-08-01" },
  { id: "iir-9", category: "Used Commercial Vehicles", product: "SCV (Small Commercial Vehicle)", mfgYear: "2011-2015", irr: 20.0, wirr: 19.0, tenureMaxMonths: 24, maxLTV: 70, customerProfile: "Existing Owner", scoreBand: ">=550", updatedAt: "2024-08-01" },

  // Used CV - LCV/ICV
  { id: "iir-10", category: "Used Commercial Vehicles", product: "LCV / ICV (Light & Intermediate CV)", mfgYear: "2021-2025", irr: 18.0, wirr: 17.0, tenureMaxMonths: 48, maxLTV: 85, customerProfile: "Fleet Owner / Transporter", scoreBand: ">=650", updatedAt: "2024-08-01" },
  { id: "iir-11", category: "Used Commercial Vehicles", product: "LCV / ICV (Light & Intermediate CV)", mfgYear: "2016-2020", irr: 19.0, wirr: 18.0, tenureMaxMonths: 36, maxLTV: 75, customerProfile: "Transporter", scoreBand: ">=600", updatedAt: "2024-08-01" },
  { id: "iir-12", category: "Used Commercial Vehicles", product: "LCV / ICV (Light & Intermediate CV)", mfgYear: "2011-2015", irr: 20.0, wirr: 19.0, tenureMaxMonths: 24, maxLTV: 65, customerProfile: "Experienced Operator", scoreBand: ">=550", updatedAt: "2024-08-01" },

  // Used CV - M&HCV
  { id: "iir-13", category: "Used Commercial Vehicles", product: "M&HCV (Medium & Heavy CV)", mfgYear: "2021-2025", irr: 18.0, wirr: 17.0, tenureMaxMonths: 48, maxLTV: 85, customerProfile: "Fleet >= 3 Vehicles", scoreBand: ">=650", updatedAt: "2024-08-01" },
  { id: "iir-14", category: "Used Commercial Vehicles", product: "M&HCV (Medium & Heavy CV)", mfgYear: "2016-2020", irr: 19.0, wirr: 18.0, tenureMaxMonths: 36, maxLTV: 75, customerProfile: "Fleet >= 2 Vehicles", scoreBand: ">=600", updatedAt: "2024-08-01" },
  { id: "iir-15", category: "Used Commercial Vehicles", product: "M&HCV (Medium & Heavy CV)", mfgYear: "2011-2015", irr: 20.0, wirr: 19.0, tenureMaxMonths: 24, maxLTV: 65, customerProfile: "Fleet Operator", scoreBand: ">=550", updatedAt: "2024-08-01" },

  // Construction Equipment
  { id: "iir-16", category: "Construction Equipment", product: "Used CE (JCB BHL's Upto 20 Ton's)", mfgYear: "2021-2025", irr: 18.0, wirr: 17.0, tenureMaxMonths: 48, maxLTV: 80, customerProfile: "Contractor / Plant Owner", scoreBand: ">=650", updatedAt: "2024-08-01" },
  { id: "iir-17", category: "Construction Equipment", product: "Used CE (JCB BHL's Upto 20 Ton's)", mfgYear: "2016-2020", irr: 19.0, wirr: 18.0, tenureMaxMonths: 36, maxLTV: 70, customerProfile: "Contractor", scoreBand: ">=600", updatedAt: "2024-08-01" },
  { id: "iir-18", category: "Construction Equipment", product: "Used CE (JCB BHL's Upto 20 Ton's)", mfgYear: "2011-2015", irr: 20.0, wirr: 19.0, tenureMaxMonths: 24, maxLTV: 60, customerProfile: "Individual Operator", scoreBand: ">=550", updatedAt: "2024-08-01" },

  // Tractor
  { id: "iir-19", category: "Tractor", product: "Used Tractor (Agricultural / Commercial)", mfgYear: "2021-2025", irr: 21.0, wirr: 20.0, tenureMaxMonths: 48, maxLTV: 80, customerProfile: "Farmer / Agri-Commercial", scoreBand: ">=600", updatedAt: "2024-08-01" },
  { id: "iir-20", category: "Tractor", product: "Used Tractor (Agricultural / Commercial)", mfgYear: "2016-2020", irr: 22.0, wirr: 21.0, tenureMaxMonths: 36, maxLTV: 70, customerProfile: "Farmer with Agri Land", scoreBand: ">=550", updatedAt: "2024-08-01" },
  { id: "iir-21", category: "Tractor", product: "Used Tractor (Agricultural / Commercial)", mfgYear: "2011-2015", irr: 23.0, wirr: 22.0, tenureMaxMonths: 24, maxLTV: 60, customerProfile: "Farmer with Land Proof", scoreBand: ">=500", updatedAt: "2024-08-01" },
];

export const DSA_PAYOUT_SLABS: DSAPayoutSlab[] = [
  // Car Payout Policy
  { id: "dsa-c-1", category: "Used Car", wirrSlab: ">= 16.00% - <= 16.99%", minWirr: 16.00, maxWirr: 16.99, payoutUnder20Lacs: 2.00, payoutOver20Lacs: 2.25, notes: "Excluding GST", updatedAt: "2024-08-01" },
  { id: "dsa-c-2", category: "Used Car", wirrSlab: ">= 17.00% - <= 17.99%", minWirr: 17.00, maxWirr: 17.99, payoutUnder20Lacs: 2.50, payoutOver20Lacs: 2.75, notes: "Excluding GST", updatedAt: "2024-08-01" },
  { id: "dsa-c-3", category: "Used Car", wirrSlab: ">= 18.00% - <= 18.99%", minWirr: 18.00, maxWirr: 18.99, payoutUnder20Lacs: 3.00, payoutOver20Lacs: 3.25, notes: "Excluding GST", updatedAt: "2024-08-01" },
  { id: "dsa-c-4", category: "Used Car", wirrSlab: ">= 19.00% - <= 19.99%", minWirr: 19.00, maxWirr: 19.99, payoutUnder20Lacs: 3.25, payoutOver20Lacs: 3.50, notes: "Excluding GST", updatedAt: "2024-08-01" },
  { id: "dsa-c-5", category: "Used Car", wirrSlab: ">= 20.00% - <= 20.99%", minWirr: 20.00, maxWirr: 20.99, payoutUnder20Lacs: 3.50, payoutOver20Lacs: 3.75, notes: "Excluding GST", updatedAt: "2024-08-01" },
  { id: "dsa-c-6", category: "Used Car", wirrSlab: ">= 21.00% - <= 21.99%", minWirr: 21.00, maxWirr: 21.99, payoutUnder20Lacs: 3.75, payoutOver20Lacs: 4.00, notes: "Excluding GST", updatedAt: "2024-08-01" },
  { id: "dsa-c-7", category: "Used Car", wirrSlab: ">= 22.00%", minWirr: 22.00, maxWirr: 99.99, payoutUnder20Lacs: 4.00, payoutOver20Lacs: 4.25, notes: "Excluding GST", updatedAt: "2024-08-01" },

  // CV Payout Policy
  { id: "dsa-v-1", category: "Used CV", wirrSlab: ">= 16.00% - <= 17.99%", minWirr: 16.00, maxWirr: 17.99, payoutUnder20Lacs: 1.50, payoutOver20Lacs: 2.00, notes: "SCV & LCV/ICV", updatedAt: "2024-08-01" },
  { id: "dsa-v-2", category: "Used CV", wirrSlab: ">= 18.00% - <= 18.99%", minWirr: 18.00, maxWirr: 18.99, payoutUnder20Lacs: 2.00, payoutOver20Lacs: 2.25, notes: "SCV & LCV/ICV", updatedAt: "2024-08-01" },
  { id: "dsa-v-3", category: "Used CV", wirrSlab: ">= 19.00% - <= 19.99%", minWirr: 19.00, maxWirr: 19.99, payoutUnder20Lacs: 2.50, payoutOver20Lacs: 2.50, notes: "SCV & LCV/ICV", updatedAt: "2024-08-01" },
  { id: "dsa-v-4", category: "Used CV", wirrSlab: ">= 20.00%", minWirr: 20.00, maxWirr: 99.99, payoutUnder20Lacs: 3.00, payoutOver20Lacs: 3.00, notes: "SCV & LCV/ICV", updatedAt: "2024-08-01" },

  // M&HCV & Construction Equipment
  { id: "dsa-m-1", category: "M&HCV / CE", wirrSlab: "Flat Rate on Volume", minWirr: 0, maxWirr: 99.99, payoutUnder20Lacs: 1.25, payoutOver20Lacs: 1.25, notes: "Flat 1.25% on volume for all M&HCV and Construction Equipment", updatedAt: "2024-08-01" },
];

export const DSA_TERMS = [
  "DSA payout will be released in the next month of the disbursement month.",
  "PDD (Post-Disbursement Documents) should be updated within 60 days of disbursement date.",
  "If PDD is pending for > 90 days, all payouts will be withheld till >90 days PDD updation.",
  "Above payouts are excluding GST (GST added if invoice provided by registered DSA).",
  "Processing fees & Stamping should NOT be included in IRR calculation.",
  "Loan cancellation as per cancellation policy. If payout was released, it will be clawed back / deducted from next month's payout.",
  "In PDD, original RC with hypothecation and Insurance policy are mandatory."
];

export const CHARGES_DATA: ChargeItem[] = [
  { id: "chg-1", description: "Processing Fees", charges: "1.25% + GST (1.50% + GST for Tractor Loan)", basis: "percentage", percentage: 1.25, applicableOn: "Sanctioned Loan Amount", notes: "Deducted at disbursement", gstApplicable: true, updatedAt: "2024-08-01" },
  { id: "chg-2", description: "Document Charges", charges: "Upto ₹ 5 Lac: ₹ 1,000/- | Above ₹ 5 Lac: ₹ 2,000/- per loan account", basis: "slab", fixedAmount: 1000, applicableOn: "Per Loan Account", notes: "Non-refundable documentation fee", gstApplicable: true, updatedAt: "2024-08-01" },
  { id: "chg-3", description: "Valuation Charges", charges: "₹ 1,000/- (Car & SCV) | ₹ 1,200/- (LCV/ICV) | ₹ 1,500/- (M&HCV, Tractor, CE)", basis: "slab", fixedAmount: 1000, applicableOn: "Per Asset Inspection", notes: "Payable to authorized technical valuator", gstApplicable: false, updatedAt: "2024-08-01" },
  { id: "chg-4", description: "Stamp Duty Charges", charges: "0.60% of Loan Amount", basis: "percentage", percentage: 0.60, applicableOn: "Loan Agreement Value", notes: "State stamp act statutory charge", gstApplicable: false, updatedAt: "2024-08-01" },
  { id: "chg-5", description: "Foreclosure / Prepayment Charges", charges: "5.00% + GST on principal outstanding", basis: "percentage", percentage: 5.0, applicableOn: "Principal Outstanding", notes: "Permitted only after 6 EMIs clearance", gstApplicable: true, updatedAt: "2024-08-01" },
  { id: "chg-6", description: "Part-Payment Charges", charges: "3.00% + GST on amount prepaid", basis: "percentage", percentage: 3.0, applicableOn: "Prepaid Capital Amount", notes: "Allowed up to 25% of POS per financial year", gstApplicable: true, updatedAt: "2024-08-01" },
  { id: "chg-7", description: "Cheque / NACH Bounce Charges", charges: "₹ 590/- (₹ 500 + 18% GST) per return", basis: "fixed", fixedAmount: 590, applicableOn: "Per Failed Payment Instance", notes: "Plus penal interest of 2% per month", gstApplicable: true, updatedAt: "2024-08-01" },
  { id: "chg-8", description: "Hypothecation & RTO Assistance", charges: "₹ 1,500/- to ₹ 2,500/- (As per state RTO norms)", basis: "fixed", fixedAmount: 2000, applicableOn: "Form 34 Endorsement & NOC", notes: "RTO agent handling charges", gstApplicable: false, updatedAt: "2024-08-01" },
  { id: "chg-9", description: "CIBIL / Credit Bureau Verification", charges: "₹ 350/- per borrower / co-borrower", basis: "fixed", fixedAmount: 350, applicableOn: "Per Profile Check", notes: "Statutory credit pull", gstApplicable: false, updatedAt: "2024-08-01" },
  { id: "chg-10", description: "Legal & Title Search (Agri / High Ticket)", charges: "₹ 2,500/- to ₹ 5,000/- for property/land evaluation", basis: "fixed", fixedAmount: 3000, applicableOn: "Cases > ₹ 15 Lakhs or Agri Land Security", notes: "Advocate legal search report", gstApplicable: false, updatedAt: "2024-08-01" },
];

export const CV_POLICY_SECTIONS: PolicySection[] = [
  {
    id: "cv-funding-limits",
    title: "1. Maximum Funding Amount by Vehicle Category (Aug 2024 Revision)",
    badge: "Revised Limits",
    lastRevised: "August 2024",
    items: [
      {
        label: "M&HCV (other than Tipper) - New & Used",
        description: "CAT A1 (Captive Large): ₹ 75 Lakhs | CAT A2 (Captive Small): ₹ 35 Lakhs or 1 vehicle | CAT B: ₹ 100 Lakhs | CAT C: ₹ 75 Lakhs | CAT D: ₹ 40 Lakhs | CAT E (First Time Buyer): ₹ 35 Lakhs or 1 vehicle | CAT F (First Time User): ₹ 30 Lakhs or 1 vehicle.",
        highlight: "CAT B max limit raised to ₹ 100 Lacs."
      },
      {
        label: "LCV - New & Used",
        description: "CAT A1: ₹ 40 Lakhs | CAT A2: ₹ 25 Lakhs or 1 vehicle | CAT B: ₹ 100 Lakhs | CAT C: ₹ 50 Lakhs | CAT D: ₹ 35 Lakhs | CAT E: ₹ 25 Lakhs or 1 vehicle | CAT F: ₹ 22 Lakhs or 1 vehicle.",
        highlight: "CAT B max limit ₹ 100 Lacs."
      },
      {
        label: "SCV - New & Used",
        description: "CAT A1: ₹ 25 Lakhs | CAT A2: ₹ 12 Lakhs or 1 vehicle | CAT B: ₹ 60 Lakhs | CAT C: ₹ 40 Lakhs | CAT D: ₹ 25 Lakhs | CAT E: ₹ 12 Lakhs or 1 vehicle | CAT F: ₹ 10 Lakhs or 1 vehicle.",
        highlight: "SCV Cat B ₹ 60 Lacs."
      },
      {
        label: "Tipper - New & Used",
        description: "CAT A1: ₹ 60 Lakhs | CAT A2: ₹ 35 Lakhs or 1 vehicle | CAT B: ₹ 100 Lakhs | CAT C: ₹ 60 Lakhs | CAT D: ₹ 45 Lakhs or 1 vehicle | CAT E: ₹ 35 Lakhs or 1 vehicle.",
        highlight: "Tipper funding allowed up to ₹ 100 Lacs for Cat B."
      },
      {
        label: "School / College Bus Funding",
        description: "Category A (>1000 Students): ₹ 100 Lakhs | Category B (500-1000 Students): ₹ 75 Lakhs | Category C (<500 Students): ₹ 50 Lakhs or 1 Bus.",
        highlight: "Increased to ₹ 100 Lakhs for Cat A."
      },
      {
        label: "Bus Screen - NEW (HCV, LCV, SCV - other than School Buses)",
        description: "CAT B: ₹ 100 Lakhs | CAT C: ₹ 80 Lakhs | CAT D: ₹ 40 Lakhs | CAT E: ₹ 30 Lakhs or 1 Bus.",
        highlight: "Max funding ₹ 100 Lakhs."
      }
    ]
  },
  {
    id: "cv-tatkal-sahaj",
    title: "2. Fast Track Tatkal Screen & Sahaj Scheme",
    badge: "Special Schemes",
    lastRevised: "August 2024",
    items: [
      {
        label: "Fast Track Tatkal Screen (Used)",
        description: "No funding on Trailers under Tatkal Scheme. Tippers up to only 28 Ton can be funded under Tatkal (max ₹ 25 Lakhs). ICV funding restricted to 12 Ton segment (max ₹ 15 Lakhs). LTV: CAT E - 75%, CAT F - 70%. Ext Guarantor with property ownership is acceptable. 5% additional LTV if CIBIL score >= 730 and property ownership >= 2x loan amount.",
        highlight: "Tatkal max funding capped at ₹ 25 Lakhs for Tippers."
      },
      {
        label: "Sahaj Scheme (Low CIBIL)",
        description: "Eligible for CIBIL score 549 to 450 or Bureau score 549 to 450. Max funding ₹ 25 Lakhs. Only those Regions with overall Delinquency <= 15% are eligible for this scheme.",
        highlight: "Region delinquency must be <= 15%."
      }
    ]
  },
  {
    id: "cv-branches-norms",
    title: "3. Branch Limits, RC Cap, Property & Asset Categorization",
    badge: "Operational Norms",
    lastRevised: "August 2024",
    items: [
      {
        label: "Approval Authority",
        description: "Branch Credit Manager & Branch Head: New & Used up to ₹ 100 Lakhs. (Previously ₹ 20 Lakhs). Faster TAT and local empowerment.",
        highlight: "Branch approval limit enhanced to ₹ 100 Lakhs."
      },
      {
        label: "RC Limit Cap for Branches",
        description: "Branch Category A: 15 Nos / ₹ 100 Lakhs | Branch Category B: 12 Nos / ₹ 75 Lakhs | Branch Category C: 10 Nos / ₹ 50 Lakhs (whichever is earlier).",
        highlight: "Strict PDD tracking within 60 days."
      },
      {
        label: "Residence Stability & Property Proof",
        description: "For funding up to ₹ 8.0 Lacs, electricity bill can be accepted as property proof. Above ₹ 8.0 Lacs, registered title deeds or 7/12 land extract mandatory.",
        highlight: "Electricity bill accepted up to ₹ 8.0 Lakhs."
      },
      {
        label: "CV Asset Level Categorisation",
        description: "Level 1: Good market resale & widely used (Normal LTV). Level 2: Moderate market resale (LTV restricted by 5%). Level 3: Low market resale & specialized (LTV restricted by 10%, CAT A small & CAT F not eligible).",
        highlight: "Level 3 vehicles carry 10% LTV haircut."
      },
      {
        label: "Corporate DSA Limits",
        description: "Limit is capped at ₹ 500 Lakhs for multi-state corporate DSA partners.",
        highlight: "₹ 500 Lakhs exposure cap."
      }
    ]
  }
];

export const CAR_POLICY_SECTIONS: PolicySection[] = [
  {
    id: "car-salaried",
    title: "1. Salaried Profile (Private Car - Amended Credit Policy)",
    badge: "Salaried IP",
    lastRevised: "February 9, 2026",
    items: [
      {
        label: "Income & Eligibility Norms",
        description: "Max FOIR 60%. Minimum job stability 2 years (at least 1 year in same organization). Last 3 months salary slip and latest Form 16 / ITR. Minimum Net Salary ₹ 20,000/month or Minimum Annual Income ₹ 2.5 Lakhs.",
        highlight: "Min Net Salary: ₹ 20,000/mo."
      },
      {
        label: "Banking & Documents",
        description: "Last 6-month bank statement mandatory (salary credit reflected). Company ID card and appointment letter. Cash salary strictly NOT acceptable. Relative working in proprietorship firm not eligible under direct relationship.",
        highlight: "Cash salary not eligible."
      },
      {
        label: "Max Tenure & LTV",
        description: "Tenure: Used - up to 48 / 60 Months. Refinance / Used LTV: Up to 90.00% of valuation. Loan capping: ₹ 10 Lakhs (L2 ACM deviation for higher).",
        highlight: "Max LTV: 90.00%."
      }
    ]
  },
  {
    id: "car-nip",
    title: "2. Self Employed Non-Profession (NIP - Non-Income Program)",
    badge: "NIP Capping ₹ 8L",
    lastRevised: "February 9, 2026",
    items: [
      {
        label: "Experience & Business Verification",
        description: "Minimum 2 years business stability. Experience validated through Personal Discussion (PD) and Tele-Verification (TVR). Business visit with stock/premises photos documented by RM/BM.",
        highlight: "Min 2 years stability required."
      },
      {
        label: "Income Validation & Banking",
        description: "Minimum 6 months banking, RTR, GST Certificate, business transaction receipts/bills. Last 6 months bank statement or passbook.",
        highlight: "Last 6 months banking mandatory."
      },
      {
        label: "LTV & Property Requirement",
        description: "Used LTV: 80.00%. Tenure: 48 Months. Property ownership proof mandatory (Applicant/Co-applicant with 1 yr stability or Agri land >= 2 Acres). For purely Agri land, property value must be >= 4x loan amount.",
        highlight: "LTV: 80.00% | Loan Capping: ₹ 8 Lakhs."
      }
    ]
  },
  {
    id: "car-repayment-surrogate",
    title: "3. Repayment Surrogate Program",
    badge: "Capping ₹ 10L",
    lastRevised: "February 9, 2026",
    items: [
      {
        label: "Eligibility & Track Record",
        description: "Max FOIR 60%. Min 2 years business stability. Minimum 1 year satisfactory repayment track in Auto Loan (AL), Business Loan (BL), Home Loan (HL), or LAP. Only fixed EMI dates accepted.",
        highlight: "Min 12 MOB satisfactory track."
      },
      {
        label: "Multipliers by Loan Type",
        description: "Auto Loan (12 MOB): 1.4x | Auto Loan (24 MOB): 1.5x | BL/Property Loan < 15L (12 MOB): 1.4x | BL/Property Loan < 15L (24 MOB): 1.5x | LAP / HL (12 MOB): 0.5x.",
        highlight: "AL 24 MOB gives 1.5x multiplier."
      },
      {
        label: "DPD / Bounce Norms",
        description: "Max 2 bounce instances (< 30 days per year). Max 1 instance of 30+ DPD per year. ZERO bounce in last 6 months (except technical error).",
        highlight: "Zero bounce in last 6 months."
      },
      {
        label: "LTV & Capping",
        description: "Used LTV: 85.00%. Tenure: 48 Months. Loan capping: ₹ 10 Lakhs.",
        highlight: "LTV: 85.00%."
      }
    ]
  },
  {
    id: "car-banking-surrogate",
    title: "4. Banking Surrogate Program",
    badge: "ABB to EMI >= 1.5x",
    lastRevised: "February 9, 2026",
    items: [
      {
        label: "Banking Criteria",
        description: "Min 6 months statement of main business account (account >= 1 yr old). Average Bank Balance (ABB) to EMI ratio >= 1.5 times. Min 4 credit business transactions per month.",
        highlight: "ABB >= 1.5x proposed EMI."
      },
      {
        label: "Clean Banking Record",
        description: "No EMI bounce and zero penal charges in last 6 months. Not applicable for CC/OD limit accounts. Business visit with photo documentation.",
        highlight: "No penal charges in last 6 months."
      },
      {
        label: "LTV & Property Ownership",
        description: "Used LTV: 80.00%. Tenure: 48 Months. Loan capping ₹ 10 Lakhs. Property ownership mandatory (market value >= 4x proposed loan amount).",
        highlight: "LTV: 80.00%."
      }
    ]
  },
  {
    id: "car-agri-based",
    title: "5. Agri Based Funding & General Car Norms",
    badge: "Agri Land Rules",
    lastRevised: "February 9, 2026",
    items: [
      {
        label: "Agri Land Ownership Tiers",
        description: "Upto ₹ 5.0 Lacs: >= 2-3 Acres land | Upto ₹ 8.0 Lacs: >= 3-5 Acres | Upto ₹ 10.0 Lacs: >= 5 Acres. Fresh 7/12 and 8A extract mandatory. Property owner must be part of deal. LTV: 80.00%.",
        highlight: "No LTV deviation allowed in Agri."
      },
      {
        label: "General Private Car Norms",
        description: "Car End of Tenure (EOT) capped at 12 years across all segments. Discontinued models restricted to max 60% LTV. RC serial ownership allowed up to 4th owner. Yellow board (commercial) NOT allowed under private car policy. For commercial use, 10% standard LTV deduction.",
        highlight: "EOT max 12 years | Max 4th owner."
      }
    ]
  }
];

export const CV_GRID_DATA: CVGridItem[] = [
  // Ashok Leyland Buses
  {
    id: "cvg-1",
    category: "Bus",
    manufacturer: "Ashok Leyland",
    model: "AL - AC Bus (30-40 Seater Staff Bus)",
    body: "AC - Staff Bus",
    ratesByAge: { "2024": 24.01, "2023": 21.61, "2022": 19.95, "2021": 18.29, "2020": 16.63, "2019": 14.96, "2018": 13.63, "2017": 12.30, "2016": 10.97, "2015": 9.64, "2014": 7.65, "2013": 6.65, "2012": 5.65, "2011": 4.66 },
    maxFundingLacs: 24.0,
    maxLTV: 85,
    updatedAt: "2024-07-15"
  },
  {
    id: "cvg-2",
    category: "Bus",
    manufacturer: "Ashok Leyland",
    model: "AL HCV - Bus (40-50 Seater)",
    body: "Route Permit / Staff / School Bus",
    ratesByAge: { "2024": 26.07, "2023": 23.47, "2022": 21.66, "2021": 19.86, "2020": 18.05, "2019": 16.25, "2018": 14.80, "2017": 13.00, "2016": 11.19, "2015": 9.75, "2014": 8.30, "2013": 6.86, "2012": 5.78, "2011": 5.05 },
    maxFundingLacs: 26.0,
    maxLTV: 85,
    updatedAt: "2024-07-15"
  },
  {
    id: "cvg-3",
    category: "Bus",
    manufacturer: "Ashok Leyland",
    model: "AL HCV - Luxury Seater Coach (40-50 Seat)",
    body: "AC Seater Coach Bus",
    ratesByAge: { "2024": 37.74, "2023": 33.96, "2022": 31.35, "2021": 28.74, "2020": 26.13, "2019": 23.51, "2018": 21.42, "2017": 18.81, "2016": 16.20, "2015": 14.11, "2014": 12.02, "2013": 9.93, "2012": 8.36, "2011": 7.32 },
    maxFundingLacs: 37.5,
    maxLTV: 85,
    updatedAt: "2024-07-15"
  },
  {
    id: "cvg-4",
    category: "Bus",
    manufacturer: "Ashok Leyland",
    model: "AL HCV - Luxury Sleeper Coach (30-40 Seat)",
    body: "AC Sleeper Coach Bus",
    ratesByAge: { "2024": 41.17, "2023": 37.05, "2022": 34.20, "2021": 31.35, "2020": 28.50, "2019": 25.65, "2018": 23.37, "2017": 20.52, "2016": 17.67, "2015": 15.39, "2014": 13.11, "2013": 10.83, "2012": 9.12, "2011": 7.98 },
    maxFundingLacs: 41.0,
    maxLTV: 85,
    updatedAt: "2024-07-15"
  },
  {
    id: "cvg-5",
    category: "Bus",
    manufacturer: "Ashok Leyland",
    model: "AL Lynx - ICV Bus (25-25 Seater)",
    body: "Route Permit / Staff / School Bus",
    ratesByAge: { "2024": 20.58, "2023": 18.53, "2022": 17.10, "2021": 15.68, "2020": 14.25, "2019": 12.83, "2018": 11.69, "2017": 10.26, "2016": 8.84, "2015": 7.70, "2014": 6.56, "2013": 5.42, "2012": 4.56, "2011": 3.99 },
    maxFundingLacs: 20.0,
    maxLTV: 85,
    updatedAt: "2024-07-15"
  },

  // Eicher Buses
  {
    id: "cvg-6",
    category: "Bus",
    manufacturer: "Eicher",
    model: "Eicher - 31 to 40 Seater Route/Staff",
    body: "Route Permit / Staff / School Bus",
    ratesByAge: { "2024": 18.47, "2023": 16.63, "2022": 15.44, "2021": 14.25, "2020": 13.06, "2019": 11.88, "2018": 10.69, "2017": 9.50, "2016": 8.31, "2015": 7.13, "2014": 5.94, "2013": 4.99, "2012": 4.28, "2011": 3.56 },
    maxFundingLacs: 18.0,
    maxLTV: 85,
    updatedAt: "2024-07-15"
  },
  {
    id: "cvg-7",
    category: "Bus",
    manufacturer: "Eicher",
    model: "Eicher - 41 to 50 Seater Route/Staff",
    body: "Route Permit / Staff / School Bus",
    ratesByAge: { "2024": 20.69, "2023": 18.62, "2022": 17.29, "2021": 15.96, "2020": 14.63, "2019": 13.30, "2018": 11.97, "2017": 10.64, "2016": 9.31, "2015": 7.98, "2014": 6.65, "2013": 5.59, "2012": 4.79, "2011": 3.99 },
    maxFundingLacs: 20.5,
    maxLTV: 85,
    updatedAt: "2024-07-15"
  },

  // Force Traveller
  {
    id: "cvg-8",
    category: "Bus",
    manufacturer: "Force Motors",
    model: "Force / Tempo Traveller (13-15 Seater)",
    body: "Route Permit / Staff / School Bus",
    ratesByAge: { "2024": 13.68, "2023": 12.31, "2022": 11.80, "2021": 11.12, "2020": 10.43, "2019": 9.92, "2018": 9.23, "2017": 8.55, "2016": 8.04, "2015": 7.18, "2014": 6.50, "2013": 5.13, "2012": 4.62, "2011": 3.93 },
    maxFundingLacs: 13.5,
    maxLTV: 85,
    updatedAt: "2024-07-15"
  },
  {
    id: "cvg-9",
    category: "Bus",
    manufacturer: "Force Motors",
    model: "Force / Tempo Traveller (21-25 Seater)",
    body: "Route Permit / Staff / School Bus",
    ratesByAge: { "2024": 18.24, "2023": 16.42, "2022": 15.73, "2021": 14.82, "2020": 13.91, "2019": 13.22, "2018": 12.31, "2017": 11.40, "2016": 10.72, "2015": 9.58, "2014": 8.66, "2013": 6.84, "2012": 6.16, "2011": 5.24 },
    maxFundingLacs: 18.0,
    maxLTV: 85,
    updatedAt: "2024-07-15"
  },

  // Tata Buses & Heavy Commercial
  {
    id: "cvg-10",
    category: "Bus",
    manufacturer: "Tata Motors",
    model: "LP 1109 / 1112 / LPO 10.2 (25-35 Seat)",
    body: "Route Permit / Staff / School Bus",
    ratesByAge: { "2024": 21.27, "2023": 19.14, "2022": 17.67, "2021": 16.20, "2020": 14.73, "2019": 13.25, "2018": 12.07, "2017": 10.90, "2016": 9.72, "2015": 8.54, "2014": 7.07, "2013": 6.18, "2012": 5.30, "2011": 4.71 },
    maxFundingLacs: 21.0,
    maxLTV: 85,
    updatedAt: "2024-07-15"
  },
  {
    id: "cvg-11",
    category: "Bus",
    manufacturer: "Tata Motors",
    model: "Tata HCV - Luxury Sleeper (30-40 Seat)",
    body: "AC Sleeper Coach Bus",
    ratesByAge: { "2024": 37.91, "2023": 34.11, "2022": 31.41, "2021": 28.70, "2020": 25.99, "2019": 23.28, "2018": 21.12, "2017": 18.41, "2016": 15.70, "2015": 13.54, "2014": 11.37, "2013": 9.75, "2012": 8.12, "2011": 7.04 },
    maxFundingLacs: 37.5,
    maxLTV: 85,
    updatedAt: "2024-07-15"
  },

  // HCV Trucks (AL 4825/4830, AL 3118, AL 3520/3518, AL 4220)
  {
    id: "cvg-12",
    category: "HCV",
    manufacturer: "Ashok Leyland",
    model: "AL 4825 / 4830 (16 Wheeler)",
    body: "Goods High Deck / Cabin Chassis",
    ratesByAge: { "2024": 40.28, "2023": 36.25, "2022": 34.24, "2021": 32.22, "2020": 30.21, "2019": 0, "2018": 0, "2017": 0, "2016": 0, "2015": 0, "2014": 0, "2013": 0, "2012": 0, "2011": 0 },
    maxFundingLacs: 40.0,
    maxLTV: 85,
    updatedAt: "2024-07-15"
  },
  {
    id: "cvg-13",
    category: "HCV",
    manufacturer: "Ashok Leyland",
    model: "AL 4825 / 4830 - Tanker/Bulker",
    body: "MS Tanker / Bulker / Container",
    ratesByAge: { "2024": 41.97, "2023": 37.77, "2022": 35.64, "2021": 33.52, "2020": 31.39, "2019": 0, "2018": 0, "2017": 0, "2016": 0, "2015": 0, "2014": 0, "2013": 0, "2012": 0, "2011": 0 },
    maxFundingLacs: 41.5,
    maxLTV: 85,
    updatedAt: "2024-07-15"
  },
  {
    id: "cvg-14",
    category: "HCV",
    manufacturer: "Ashok Leyland",
    model: "HCV AL - 2820 / 2523 / 2825",
    body: "Goods Truck",
    ratesByAge: { "2024": 27.36, "2023": 24.62, "2022": 23.26, "2021": 21.89, "2020": 20.52, "2019": 0, "2018": 0, "2017": 0, "2016": 0, "2015": 0, "2014": 0, "2013": 0, "2012": 0, "2011": 0 },
    maxFundingLacs: 27.0,
    maxLTV: 85,
    updatedAt: "2024-07-15"
  },
  {
    id: "cvg-15",
    category: "HCV",
    manufacturer: "Ashok Leyland",
    model: "HCV AL - 3118 (12 Wheeler)",
    body: "Goods Truck",
    ratesByAge: { "2024": 0, "2023": 0, "2022": 0, "2021": 0, "2020": 21.55, "2019": 20.18, "2018": 18.81, "2017": 17.78, "2016": 16.42, "2015": 15.05, "2014": 14.02, "2013": 11.29, "2012": 8.89, "2011": 6.84 },
    maxFundingLacs: 21.5,
    maxLTV: 85,
    updatedAt: "2024-07-15"
  },
  {
    id: "cvg-16",
    category: "HCV",
    manufacturer: "Ashok Leyland",
    model: "HCV AL - 3520 / 3518 (14 Wheeler)",
    body: "Goods Carrier",
    ratesByAge: { "2024": 32.68, "2023": 29.41, "2022": 27.78, "2021": 26.14, "2020": 24.51, "2019": 0, "2018": 0, "2017": 0, "2016": 0, "2015": 0, "2014": 0, "2013": 0, "2012": 0, "2011": 0 },
    maxFundingLacs: 32.5,
    maxLTV: 85,
    updatedAt: "2024-07-15"
  },
  {
    id: "cvg-17",
    category: "HCV",
    manufacturer: "Ashok Leyland",
    model: "HCV AL - 4220 / 4225 / 4120 (14 Wheeler)",
    body: "Goods / Flat Bed",
    ratesByAge: { "2024": 36.48, "2023": 32.83, "2022": 31.01, "2021": 29.18, "2020": 27.36, "2019": 0, "2018": 0, "2017": 0, "2016": 0, "2015": 0, "2014": 0, "2013": 0, "2012": 0, "2011": 0 },
    maxFundingLacs: 36.0,
    maxLTV: 85,
    updatedAt: "2024-07-15"
  },
  {
    id: "cvg-18",
    category: "HCV",
    manufacturer: "Ashok Leyland",
    model: "HCV AL - 2214 / 2515 / 2516 / 2518 (10 Wheeler)",
    body: "Goods Truck",
    ratesByAge: { "2024": 0, "2023": 0, "2022": 0, "2021": 0, "2020": 17.10, "2019": 16.53, "2018": 15.68, "2017": 14.82, "2016": 13.11, "2015": 11.97, "2014": 10.55, "2013": 8.27, "2012": 6.27, "2011": 5.13 },
    maxFundingLacs: 17.0,
    maxLTV: 85,
    updatedAt: "2024-07-15"
  }
];

export interface BoleroMultiYearItem {
  id: string;
  manufacturer: string;
  model: string;
  gridType: 'New KV Grid' | 'Existing KV Grid';
  ratesByYear: Record<number, number>; // in Rupees or Lacs
  maxFundingLacs?: number;
  maxLTV: number;
  maxOwner: string;
}

export const BOLERO_MULTI_YEAR_GRIDS: BoleroMultiYearItem[] = [
  // 1. New KV Grid
  {
    id: "bmg-new-1",
    manufacturer: "M&M",
    model: "Bolero Pickup / Maxx Pickup",
    gridType: "New KV Grid",
    maxOwner: "Up to 5th Owner",
    maxLTV: 90,
    ratesByYear: {
      2024: 9.95, 2023: 9.65, 2022: 9.30, 2021: 8.95, 2020: 8.54,
      2019: 8.10, 2018: 7.75, 2017: 7.33, 2016: 6.95, 2015: 6.55,
      2014: 6.00, 2013: 5.40, 2012: 4.85
    }
  },
  {
    id: "bmg-new-2",
    manufacturer: "M&M",
    model: "Bolero Maxitruck Plus",
    gridType: "New KV Grid",
    maxOwner: "Up to 5th Owner",
    maxLTV: 90,
    ratesByYear: {
      2024: 9.05, 2023: 8.25, 2022: 7.89, 2021: 7.59, 2020: 7.30,
      2019: 6.85, 2018: 6.53, 2017: 6.10, 2016: 5.80, 2015: 5.30,
      2014: 5.00, 2013: 4.50, 2012: 4.20
    }
  },
  {
    id: "bmg-new-3",
    manufacturer: "M&M",
    model: "Bolero Camper",
    gridType: "New KV Grid",
    maxOwner: "Up to 5th Owner",
    maxLTV: 85,
    ratesByYear: {
      2024: 8.70, 2023: 7.95, 2022: 7.60, 2021: 7.32, 2020: 6.89,
      2019: 6.40, 2018: 5.70, 2017: 5.40, 2016: 5.00, 2015: 4.60,
      2014: 4.25, 2013: 3.70, 2012: 3.20
    }
  },

  // 2. Existing KV Grid
  {
    id: "bmg-exist-1",
    manufacturer: "M&M",
    model: "Bolero Pick Up / Max Pick Up",
    gridType: "Existing KV Grid",
    maxOwner: "Up to 5th Owner",
    maxLTV: 90,
    ratesByYear: {
      2024: 10.22, 2023: 9.20, 2022: 8.60, 2021: 8.20, 2020: 7.80,
      2019: 7.40, 2018: 7.10, 2017: 6.70, 2016: 6.40, 2015: 6.10,
      2014: 5.50, 2013: 5.10, 2012: 4.50
    }
  },
  {
    id: "bmg-exist-2",
    manufacturer: "M&M",
    model: "Bolero Maxi Truck",
    gridType: "Existing KV Grid",
    maxOwner: "Up to 5th Owner",
    maxLTV: 90,
    ratesByYear: {
      2024: 8.89, 2023: 8.00, 2022: 7.50, 2021: 7.10, 2020: 6.70,
      2019: 6.30, 2018: 6.00, 2017: 5.60, 2016: 5.30, 2015: 5.00,
      2014: 4.75, 2013: 4.20, 2012: 4.00
    }
  },
  {
    id: "bmg-exist-3",
    manufacturer: "M&M",
    model: "Bolero Camper",
    gridType: "Existing KV Grid",
    maxOwner: "Up to 5th Owner",
    maxLTV: 85,
    ratesByYear: {
      2024: 8.22, 2023: 7.40, 2022: 7.10, 2021: 6.80, 2020: 6.40,
      2019: 6.00, 2018: 5.40, 2017: 5.10, 2016: 4.70, 2015: 4.40,
      2014: 4.00, 2013: 3.50, 2012: 3.00
    }
  }
];

export const BOLERO_CUSTOMER_CATEGORIES = [
  // Transporters
  { category: "Transporter", code: "Suvidha", name: "Suvidha (Driver turning owner, without DL)", ltv: 60, remarks: "60% No Guarantor; if +5% then Guarantor Req (Specially for Rented Profile)" },
  { category: "Transporter", code: "FTU", name: "FTU (First Time User, without DL)", ltv: 80, remarks: "Loan amount capped up to ₹ 8.0 Lacs" },
  { category: "Transporter", code: "FTB", name: "FTB (First Time Buyer, with TR-DL)", ltv: 85, remarks: "Min 2 yrs biz proof (DL/RC/Invoices/ITR)" },
  { category: "Transporter", code: "STO", name: "Small Transporter (STO)", ltv: 85, remarks: "1 to 2 vehicles fleet" },
  { category: "Transporter", code: "SFO-1", name: "Small Fleet Operator (SFO-1)", ltv: 90, remarks: "3 to 5 vehicles fleet" },
  { category: "Transporter", code: "SFO-2", name: "Small Fleet Operator (SFO-2)", ltv: 90, remarks: "6 to 10 vehicles fleet" },
  { category: "Transporter", code: "MFO", name: "Medium Fleet Operator (MFO)", ltv: 90, remarks: "11 to 20 vehicles fleet" },
  { category: "Transporter", code: "LFO", name: "Large Fleet Operator (LFO)", ltv: 95, remarks: "> 20 vehicles fleet" },

  // Captive
  { category: "Captive", code: "CATA", name: "Captive CAT A (Prime Corporates/Factories)", ltv: 90, remarks: "Audited financials & strong balance sheet" },
  { category: "Captive", code: "CATB", name: "Captive CAT B (Established Business/Traders)", ltv: 90, remarks: "GST / ITR verified own goods transport" },
  { category: "Captive", code: "CATC", name: "Captive CAT C (Retail / Agri / Dairy Users)", ltv: 85, remarks: "2.0+ Acres Agri land / shop license" },
  { category: "Captive", code: "CATD", name: "Captive CAT D (Small Local Traders)", ltv: 80, remarks: "Funding restricted up to Pickup only" }
];

export const BOLERO_GRID_DATA: BoleroGridItem[] = [
  { id: "bg-1", model: "Bolero Pickup / Maxx Pickup", variant: "1.7T / 1.5T HD (New Grid)", bodyType: "Pickup", year: 2024, condition: "Used", valuationLacs: 9.95, maxLTV: 90, maxTenureMonths: 48, ftbLtv: 85, captiveLtv: 90, maxOwner: "Up to 5th Owner", notes: "New KV Grid Baseline (₹ 9,95,000)", updatedAt: "2024-08-01" },
  { id: "bg-2", model: "Bolero Pickup / Maxx Pickup", variant: "1.7T / 1.5T HD (New Grid)", bodyType: "Pickup", year: 2023, condition: "Used", valuationLacs: 9.65, maxLTV: 90, maxTenureMonths: 48, ftbLtv: 85, captiveLtv: 90, maxOwner: "Up to 5th Owner", notes: "New KV Grid Baseline (₹ 9,65,000)", updatedAt: "2024-08-01" },
  { id: "bg-3", model: "Bolero Pickup / Maxx Pickup", variant: "1.7T / 1.5T HD (New Grid)", bodyType: "Pickup", year: 2022, condition: "Used", valuationLacs: 9.30, maxLTV: 90, maxTenureMonths: 48, ftbLtv: 85, captiveLtv: 90, maxOwner: "Up to 5th Owner", notes: "New KV Grid Baseline (₹ 9,30,000)", updatedAt: "2024-08-01" },
  { id: "bg-4", model: "Bolero Pickup / Maxx Pickup", variant: "1.7T / 1.5T HD (New Grid)", bodyType: "Pickup", year: 2021, condition: "Used", valuationLacs: 8.95, maxLTV: 90, maxTenureMonths: 48, ftbLtv: 85, captiveLtv: 90, maxOwner: "Up to 5th Owner", notes: "New KV Grid Baseline (₹ 8,95,000)", updatedAt: "2024-08-01" },
  { id: "bg-5", model: "Bolero Pickup / Maxx Pickup", variant: "1.7T / 1.5T HD (New Grid)", bodyType: "Pickup", year: 2020, condition: "Used", valuationLacs: 8.54, maxLTV: 90, maxTenureMonths: 48, ftbLtv: 85, captiveLtv: 90, maxOwner: "Up to 5th Owner", notes: "New KV Grid Baseline (₹ 8,54,000)", updatedAt: "2024-08-01" },
  { id: "bg-6", model: "Bolero Maxitruck Plus", variant: "1.2T Power Steering (New Grid)", bodyType: "Maxi Truck", year: 2024, condition: "Used", valuationLacs: 9.05, maxLTV: 90, maxTenureMonths: 48, ftbLtv: 85, captiveLtv: 90, maxOwner: "Up to 5th Owner", notes: "New KV Grid Baseline (₹ 9,05,000)", updatedAt: "2024-08-01" },
  { id: "bg-7", model: "Bolero Maxitruck Plus", variant: "1.2T Power Steering (New Grid)", bodyType: "Maxi Truck", year: 2023, condition: "Used", valuationLacs: 8.25, maxLTV: 90, maxTenureMonths: 48, ftbLtv: 85, captiveLtv: 90, maxOwner: "Up to 5th Owner", notes: "New KV Grid Baseline (₹ 8,25,000)", updatedAt: "2024-08-01" },
  { id: "bg-8", model: "Bolero Maxitruck Plus", variant: "1.2T Power Steering (New Grid)", bodyType: "Maxi Truck", year: 2022, condition: "Used", valuationLacs: 7.89, maxLTV: 90, maxTenureMonths: 48, ftbLtv: 85, captiveLtv: 90, maxOwner: "Up to 5th Owner", notes: "New KV Grid Baseline (₹ 7,89,000)", updatedAt: "2024-08-01" },
  { id: "bg-9", model: "Bolero Camper", variant: "Gold ZX 4WD / 2WD (New Grid)", bodyType: "Camper", year: 2024, condition: "Used", valuationLacs: 8.70, maxLTV: 85, maxTenureMonths: 48, ftbLtv: 80, captiveLtv: 85, maxOwner: "Up to 5th Owner", notes: "New KV Grid Baseline (₹ 8,70,000)", updatedAt: "2024-08-01" },
  { id: "bg-10", model: "Bolero Camper", variant: "Gold ZX 4WD / 2WD (New Grid)", bodyType: "Camper", year: 2023, condition: "Used", valuationLacs: 7.95, maxLTV: 85, maxTenureMonths: 48, ftbLtv: 80, captiveLtv: 85, maxOwner: "Up to 5th Owner", notes: "New KV Grid Baseline (₹ 7,95,000)", updatedAt: "2024-08-01" }
];

export const BOLERO_SPECIAL_PARAMETERS = [
  "Goods segment - Mahindra Bolero Pickup, Camper and Maxi truck.",
  "Only for Non breach branches (Portfolio delinquency < 10%).",
  "For FTB and above, Business experience - 2 years (Biz Proof: LMV or above category DL with transport validity / RC / Invoice / RTR / ITR / GSTR etc).",
  "Property ownership (Resi Or Commercial) / Agri land min 2.00 acres in name of applicant or co-applicant. (If Rented Profile: 5% standard deduction from applicable LTV and External guarantor with Property ownership mandatory).",
  "Immediate family member to be co-applicant.",
  "Captive Cat D user - Funding to be restrict up to Pickup only.",
  "EOT (End of Tenure) to be < 15 YRS, as respective RTO authority (Existing Norms for SCV/Pickup < 12 yrs).",
  "Used asset funding to be restrict up to 5th owner, including Proposed ownership.",
  "Funding based on LMV-TR DL to be restrict up to LCV or < 8 Ton of GVW only.",
  "As per CV Policy guidelines.",
  "Personal Discussion (PD) by RM / CRM / BM & above mandatory for every case.",
  "90% LTV Or Loan amount up to ₹ 8.0 Lacs applicable for FTU and FTB client.",
  "Max Tenure: 48 Months (For add 06 month @ RCM/PH level, But EOT norms to be followed).",
  "Mandatory Banking: Last Six months continuous statement.",
  "IRR: As per official Kredit Venture IRR Matrix."
];

export const CIRCULARS_DATA: CircularItem[] = [
  {
    id: "circ-1",
    circularNo: "KV/VF/2026/02-09",
    title: "Amended Credit Policy - Private Car Financing & Surrogate Programs",
    date: "2026-02-09",
    effectiveDate: "2026-02-15",
    category: "Credit Policy",
    importance: "high",
    summary: "Updated salaried FOIR up to 60%, introduced clear multipliers for 12/24 MOB Auto Loan and Banking surrogate with ABB >= 1.5x.",
    details: "All branches and DSA partners are advised to follow the updated Private Car policy. Car EOT capped at 12 years. Discontinued models capped at 60% LTV. Loan capping for Salaried IP, Repayment Surrogate, and Banking Surrogate set at ₹ 10 Lakhs.",
    viewCount: 428,
    isNew: true
  },
  {
    id: "circ-2",
    circularNo: "KV/VF/2024/08-01",
    title: "Revision in Commercial Vehicle (CV) Policy & Category B/A Caps",
    date: "2024-08-01",
    effectiveDate: "2024-08-01",
    category: "Credit Policy",
    importance: "urgent",
    summary: "Enhanced Branch approval limit to ₹ 100 Lakhs, increased Tipper & M&HCV Cat B caps to ₹ 100 Lakhs, Sahaj scheme restricted to delinquency < 15%.",
    details: "Owing to rise in secondary commercial vehicle asset prices, regional and branch empowerment limits have been updated. CAT B funding limits revised to ₹ 100 Lacs across M&HCV, Tipper, and LCV segments.",
    viewCount: 685,
    isNew: false
  },
  {
    id: "circ-3",
    circularNo: "KV/DSA/2024/07-15",
    title: "DSA Payout Structure & PDD 60-Day Compliance Mandatory Notice",
    date: "2024-07-15",
    effectiveDate: "2024-07-20",
    category: "Payout Update",
    importance: "high",
    summary: "Payout slabs for Used Car (up to 4.25%) and Used CV (up to 3.00%) strictly linked to WIRR and volume slabs. Zero tolerance for PDD > 90 days.",
    details: "All channel partners must submit original RC with hypothecation and comprehensive insurance within 60 days. Cases with PDD > 90 days will result in complete hold on partner payout book until updated.",
    viewCount: 512,
    isNew: false
  }
];

export const DOCUMENT_CHECKLIST_DATA = [
  {
    category: "Salaried Borrower",
    items: [
      { id: "sal-1", label: "Identity & Address Proof (PAN Card & Aadhaar Card mandatory)" },
      { id: "sal-2", label: "Last 3 Months Salary Slips (with company seal/authorized signature)" },
      { id: "sal-3", label: "Form 16 of latest financial year or 2 Years ITR with Computation" },
      { id: "sal-4", label: "Last 6 Months Bank Statement (Salary credit account with e-statement/bank seal)" },
      { id: "sal-5", label: "Company ID Card / Appointment Letter" },
      { id: "sal-6", label: "Residence Proof (Electricity bill / House tax receipt / Rent agreement)" },
      { id: "sal-7", label: "2 Passport Size Photographs" },
      { id: "sal-8", label: "Vehicle RC copy, Insurance, Fitness & Proposed Valuation Report" }
    ]
  },
  {
    category: "Self-Employed (Business / NIP)",
    items: [
      { id: "se-1", label: "PAN Card & Aadhaar Card of Applicant & Co-applicant" },
      { id: "se-2", label: "Business Registration (GST / Shop Act / Udyam Aadhaar / Trade License)" },
      { id: "se-3", label: "Last 2 Years ITR with Computation, Balance Sheet & P&L (if audited)" },
      { id: "se-4", label: "Last 6 to 12 Months Current / Savings Account Banking Statements" },
      { id: "se-5", label: "Property Ownership Proof (Electricity bill / Index II / Tax receipt)" },
      { id: "se-6", label: "Business Place Photos with Signboard & Stock (Company PD officer verified)" },
      { id: "se-7", label: "Existing Loan Sanction Letters / Repayment Track Records (RTR)" },
      { id: "se-8", label: "Vehicle Documents & Technical Valuation Inspection" }
    ]
  },
  {
    category: "Commercial Vehicle / Transporter / Fleet",
    items: [
      { id: "cv-1", label: "KYC of Owner / Fleet Proprietor / Partners" },
      { id: "cv-2", label: "Commercial Driving License (LMV-TR / HMV with valid transport badge)" },
      { id: "cv-3", label: "Existing Fleet RC copies (to establish Category B/C/D fleet experience)" },
      { id: "cv-4", label: "Freight Contracts / Trip Sheets / Work Orders / Commission Invoices" },
      { id: "cv-5", label: "Last 12 Months Bank Statements showing freight / hire receipts" },
      { id: "cv-6", label: "Route Permit, Fitness Certificate, Commercial Insurance & Tax Token of target asset" },
      { id: "cv-7", label: "Original RC for verification & Form 29/30/34 signed set" },
      { id: "cv-8", label: "Third-party Technical Valuation Report from approved vendor" }
    ]
  },
  {
    category: "Agricultural Profile (Farmer Landowner)",
    items: [
      { id: "agri-1", label: "Applicant & Family Co-borrower KYC (Aadhaar, PAN, Voter ID)" },
      { id: "agri-2", label: "Fresh 7/12 Extract (Satbara) & 8A Extract (within 30 days old)" },
      { id: "agri-3", label: "Proof of Land Holding (Min 2.00 to 5.00+ Acres as per ticket size)" },
      { id: "agri-4", label: "Agricultural Passbook / Gram Panchayat Tax Receipt" },
      { id: "agri-5", label: "Last 6 Months Bank Statement / KCC (Kisan Credit Card) statement" },
      { id: "agri-6", label: "Crop harvest receipts / APMC Mandi bills / Sugar factory slips" },
      { id: "agri-7", label: "Field & Residence Inspection Photographs with RM/BM" },
      { id: "agri-8", label: "Vehicle RC, Valuation & Seller Consent Letter" }
    ]
  }
];

export const CONTACTS_DATA: ContactItem[] = [
  { id: "cnt-1", name: "Vikram Sharma", role: "Branch Manager", department: "Sales", branch: "Pune Central", region: "West Zone", phone: "+91 98230 11223", email: "vikram.sharma@kreditventure.com", whatsapp: "919823011223", availability: "Available" },
  { id: "cnt-2", name: "Anand Deshmukh", role: "Credit Manager (L1 ACM)", department: "Credit", branch: "Pune Central", region: "West Zone", phone: "+91 98230 44556", email: "anand.deshmukh@kreditventure.com", whatsapp: "919823044556", availability: "Available" },
  { id: "cnt-3", name: "Rajeshwar Patil", role: "Regional Credit Manager (L2 RCM)", department: "Credit", branch: "Regional Office Mumbai", region: "West Zone", phone: "+91 98201 88990", email: "rajeshwar.patil@kreditventure.com", whatsapp: "919820188990", availability: "Available" },
  { id: "cnt-4", name: "Sunil Verma", role: "National Credit Manager (NCM)", department: "Credit", branch: "Corporate HQ", region: "National", phone: "+91 98110 55667", email: "sunil.verma@kreditventure.com", whatsapp: "919811055667", availability: "Available" },
  { id: "cnt-5", name: "Mahesh Kulkarni", role: "Regional Manager (RM)", department: "Sales", branch: "Nashik Hub", region: "Maharashtra North", phone: "+91 98225 77889", email: "mahesh.k@kreditventure.com", whatsapp: "919822577889", availability: "In Field" },
  { id: "cnt-6", name: "Apex Auto Valuators Pvt Ltd", role: "Valuator / Field Agency", department: "Valuation & Legal", branch: "All Maharashtra Branches", region: "Statewide", phone: "+91 98220 99881", email: "desk@apexvaluations.in", whatsapp: "919822099881", availability: "Available" },
  { id: "cnt-7", name: "Adv. Santosh Gaikwad", role: "Legal Partner", department: "Valuation & Legal", branch: "Pune & PCMC Legal Cell", region: "West Zone", phone: "+91 98233 44112", email: "santosh.legal@kreditventure.com", whatsapp: "919823344112", availability: "Available" },
];

export const INITIAL_LEADS: CustomerLead[] = [
  {
    id: "lead-1",
    customerName: "Rameshwar Transport Co.",
    phone: "9823091823",
    location: "Hadapsar, Pune",
    vehicleCategory: "M&HCV",
    vehicleModel: "Ashok Leyland 4825 (2022)",
    mfgYear: 2022,
    ownerNo: 2,
    loanAmountRequired: 2800000,
    cibilScore: 710,
    stage: "Login / PD",
    notes: "CAT B fleet customer with 4 trucks. 2nd Owner vehicle. Valuation completed at ₹34.2L. PD scheduled tomorrow.",
    dsaPartner: "Omkar Finance (DSA #104)",
    assignedStaffId: "staff-1",
    followUpDate: "2026-10-05",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-02"
  },
  {
    id: "lead-2",
    customerName: "Ganesh Balaji Shinde",
    phone: "9822456789",
    location: "Baramati, MH",
    vehicleCategory: "SCV Pickup",
    vehicleModel: "Mahindra Bolero Maxi Truck Plus (2023)",
    mfgYear: 2023,
    ownerNo: 1,
    loanAmountRequired: 520000,
    cibilScore: 685,
    stage: "Documents Collected",
    notes: "1st Owner vehicle. Agri landowner with 3.5 Acres 7/12. Income validated through dairy sales receipts.",
    dsaPartner: "Direct Field Sourcing",
    assignedStaffId: "staff-1",
    followUpDate: "2026-10-04",
    createdAt: "2026-10-02",
    updatedAt: "2026-10-03"
  },
  {
    id: "lead-3",
    customerName: "Pooja Travels & Cabs",
    phone: "9890123456",
    location: "Viman Nagar, Pune",
    vehicleCategory: "Personal Car",
    vehicleModel: "Toyota Innova Crysta (2021)",
    mfgYear: 2021,
    ownerNo: 2,
    loanAmountRequired: 1400000,
    cibilScore: 745,
    stage: "Sanctioned",
    notes: "2nd Owner vehicle. Banking surrogate approved at 80% LTV. Sanction letter generated at 18.0% IRR.",
    dsaPartner: "Sai Capital Services",
    assignedStaffId: "staff-1",
    followUpDate: "2026-10-06",
    createdAt: "2026-09-28",
    updatedAt: "2026-10-02"
  }
];

export const DEMO_USERS = [
  {
    uid: "admin-kv-001",
    email: "kakadesaurabh18@gmail.com",
    displayName: "Saurabh Kakade (Super Admin)",
    role: "admin" as const,
    status: "active" as const,
    branch: "Corporate HQ",
    createdAt: "2024-01-01",
    lastLogin: "Just now"
  },
  {
    uid: "staff-kv-002",
    email: "staff@kreditventure.com",
    displayName: "Sanjay Kulkarni (Loan Officer)",
    role: "staff" as const,
    status: "active" as const,
    branch: "Pune Central",
    createdAt: "2024-02-15",
    lastLogin: "Today"
  },
  {
    uid: "viewer-kv-003",
    email: "viewer@kreditventure.com",
    displayName: "Rohan D (DSA Partner)",
    role: "viewer" as const,
    status: "active" as const,
    branch: "Mumbai West",
    createdAt: "2024-05-10",
    lastLogin: "Yesterday"
  }
];
