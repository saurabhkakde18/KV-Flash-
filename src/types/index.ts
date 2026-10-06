export type UserRole = 'admin' | 'staff' | 'viewer';
export type UserStatus = 'active' | 'pending' | 'revoked';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLogin: string;
  phoneNumber?: string;
  branch?: string;
}

export type ThemeType = 'ivory' | 'midnight' | 'emerald' | 'graphite' | 'royal' | 'cyberpunk' | 'amber' | 'auto';

export interface ApprovedCarItem {
  sNo: number;
  status: 'Approved';
  oem: 'Honda' | 'Hyundai' | 'Jeep' | 'Kia' | 'Mahindra' | 'Maruti' | 'Renault' | 'Tata' | 'Toyota';
  asset: string;
  maxOwner: string; // e.g. "Up to 4th Owner" or "Up to 5th Owner"
  maxOwnerNum: number; // 4 or 5
  segment?: string; // "Hatchback" | "Sedan" | "SUV" | "MUV" | "Utility"
  fuelType?: string; // "Petrol / Diesel / CNG"
  notes?: string;
}

export interface IIRRateItem {
  id: string;
  category: 'Used Cars' | 'Used Commercial Vehicles' | 'Construction Equipment' | 'Tractor';
  product: string;
  mfgYear: string;
  irr: number; // e.g. 18%
  wirr: number; // e.g. 16%
  tenureMaxMonths: number;
  maxLTV: number;
  customerProfile?: string;
  scoreBand?: string;
  updatedAt: string;
}

export interface DSAPayoutSlab {
  id: string;
  category: 'Used Car' | 'Used CV' | 'M&HCV / CE';
  wirrSlab: string;
  minWirr: number;
  maxWirr: number;
  payoutUnder20Lacs: number; // percentage
  payoutOver20Lacs: number; // percentage
  notes?: string;
  updatedAt: string;
}

export interface PolicySection {
  id: string;
  title: string;
  badge?: string;
  lastRevised: string;
  items: {
    label: string;
    description: string;
    details?: string[];
    highlight?: string;
  }[];
  attachments?: {
    name: string;
    size: string;
    url: string;
  }[];
}

export interface CVGridItem {
  id: string;
  category: 'Bus' | 'HCV' | 'LCV' | 'SCV' | 'ICV' | 'Tractor' | 'CE';
  manufacturer: string;
  model: string;
  body: string;
  fuelType?: 'Diesel' | 'CNG' | 'Electric' | 'Petrol';
  gvwTonnes?: number;
  seatingOrPayload?: string;
  maxOwner?: string; // "Up to 5th Owner"
  maxOwnerNum?: number; // 5
  ratesByAge: {
    [year: string]: number; // valuation in Lacs, e.g. { '2024': 24.01, '2023': 21.61, ... }
  };
  maxFundingLacs: number;
  maxLTV: number;
  updatedAt: string;
}

export interface BoleroGridItem {
  id: string;
  model: string; // e.g., 'Bolero Maxi Truck Plus', 'Bolero Pikup ExtraLong 1.7T', 'Bolero Camper'
  variant: string;
  bodyType: 'Pickup' | 'Camper' | 'Maxi Truck' | 'Delivery Van';
  year: number;
  condition: 'New' | 'Used';
  maxOwner?: string; // "Up to 5th Owner"
  maxOwnerNum?: number; // 5
  valuationLacs: number;
  maxLTV: number;
  maxTenureMonths: number;
  ftbLtv: number;
  captiveLtv: number;
  notes?: string;
  updatedAt: string;
}

export interface ChargeItem {
  id: string;
  description: string;
  charges: string;
  basis: 'percentage' | 'fixed' | 'slab';
  percentage?: number;
  fixedAmount?: number;
  applicableOn: string;
  notes?: string;
  gstApplicable: boolean;
  updatedAt: string;
}

export interface CircularItem {
  id: string;
  title: string;
  circularNo: string;
  date: string;
  effectiveDate: string;
  category: 'Rate Change' | 'Credit Policy' | 'Payout Update' | 'Operational Guideline';
  importance: 'high' | 'normal' | 'urgent';
  summary: string;
  details: string;
  pdfUrl?: string;
  viewCount: number;
  isNew?: boolean;
}

export interface CustomerLead {
  id: string;
  customerName: string;
  phone: string;
  location: string;
  vehicleCategory: string;
  vehicleModel: string;
  mfgYear?: number;
  ownerNo?: number; // 1 = 1st Owner, 2 = 2nd Owner, 3 = 3rd Owner, 4 = 4th Owner, 5 = 5th Owner
  loanAmountRequired: number;
  cibilScore?: number;
  stage: 'Lead' | 'Documents Collected' | 'Login / PD' | 'Sanctioned' | 'Disbursed' | 'Rejected';
  notes: string;
  dsaPartner?: string;
  assignedStaffId: string;
  followUpDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactItem {
  id: string;
  name: string;
  role: 'Branch Manager' | 'Credit Manager (L1 ACM)' | 'Regional Credit Manager (L2 RCM)' | 'National Credit Manager (NCM)' | 'Regional Manager (RM)' | 'Valuator / Field Agency' | 'Legal Partner';
  department: 'Sales' | 'Credit' | 'Operations' | 'Valuation & Legal';
  branch: string;
  region: string;
  phone: string;
  email: string;
  whatsapp: string;
  availability: 'Available' | 'In Field' | 'On Leave';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: 'VIEW' | 'CALCULATE' | 'EXPORT_PDF' | 'EXPORT_EXCEL' | 'EDIT_DATA' | 'IMPORT_EXCEL' | 'USER_APPROVED' | 'ROLE_CHANGE' | 'ADD_USER' | 'UPDATE_USER' | 'DELETE_USER' | 'CLEAR_USERS';
  module: string;
  details: string;
  timestamp: string;
}

export interface ModuleCardInfo {
  id: string;
  title: string;
  shortDesc: string;
  iconName: string;
  href: string;
  category: 'Rates & Matrix' | 'Grids & Valuations' | 'Policies' | 'Tools & Utilities' | 'Operations & Leads';
  lastUpdated: string;
  badge?: string;
}
