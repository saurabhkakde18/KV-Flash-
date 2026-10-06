"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  IIRRateItem,
  DSAPayoutSlab,
  CVGridItem,
  BoleroGridItem,
  ChargeItem,
  CircularItem,
  CustomerLead,
  AuditLog,
  ModuleCardInfo
} from "@/types";
import {
  IIR_MATRIX_DATA,
  DSA_PAYOUT_SLABS,
  CV_GRID_DATA,
  BOLERO_GRID_DATA,
  CHARGES_DATA,
  CIRCULARS_DATA,
  INITIAL_LEADS,
  MODULES_LIST
} from "@/lib/constants";
import { useAuth } from "./AuthContext";

interface DataContextType {
  favorites: string[];
  toggleFavorite: (moduleId: string) => void;
  recentlyViewed: string[];
  addRecentlyViewed: (moduleId: string) => void;
  
  // Data items
  iirData: IIRRateItem[];
  setIirData: (data: IIRRateItem[]) => void;
  updateIIRItem: (id: string, updated: Partial<IIRRateItem>) => void;
  
  dsaData: DSAPayoutSlab[];
  setDsaData: (data: DSAPayoutSlab[]) => void;
  updateDSAItem: (id: string, updated: Partial<DSAPayoutSlab>) => void;
  
  cvGridData: CVGridItem[];
  setCvGridData: (data: CVGridItem[]) => void;
  updateCVGridItem: (id: string, updated: Partial<CVGridItem>) => void;
  
  boleroGridData: BoleroGridItem[];
  setBoleroGridData: (data: BoleroGridItem[]) => void;
  updateBoleroGridItem: (id: string, updated: Partial<BoleroGridItem>) => void;
  
  chargesData: ChargeItem[];
  setChargesData: (data: ChargeItem[]) => void;
  updateChargeItem: (id: string, updated: Partial<ChargeItem>) => void;
  
  leadsData: CustomerLead[];
  addLead: (lead: Omit<CustomerLead, "id" | "createdAt" | "updatedAt">) => void;
  updateLead: (id: string, lead: Partial<CustomerLead>) => void;
  deleteLead: (id: string) => void;
  
  circularsData: CircularItem[];
  
  auditLogs: AuditLog[];
  logAction: (action: AuditLog["action"], module: string, details: string) => void;
  
  // Admin Versioning & Rollback
  rollbackToDefault: (moduleKey: string) => void;
  isOffline: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  const [favorites, setFavorites] = useState<string[]>(["iir-matrix", "bolero-grid", "calculator", "dsa-payout"]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(["bolero-grid", "cv-grid", "iir-matrix"]);
  
  const [iirData, setIirData] = useState<IIRRateItem[]>(IIR_MATRIX_DATA);
  const [dsaData, setDsaData] = useState<DSAPayoutSlab[]>(DSA_PAYOUT_SLABS);
  const [cvGridData, setCvGridData] = useState<CVGridItem[]>(CV_GRID_DATA);
  const [boleroGridData, setBoleroGridData] = useState<BoleroGridItem[]>(BOLERO_GRID_DATA);
  const [chargesData, setChargesData] = useState<ChargeItem[]>(CHARGES_DATA);
  const [leadsData, setLeadsData] = useState<CustomerLead[]>(INITIAL_LEADS);
  const [circularsData, setCircularsData] = useState<CircularItem[]>(CIRCULARS_DATA);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Network status listener
    const updateOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    setIsOffline(!navigator.onLine);

    // Load persisted state from localStorage
    const savedFavs = localStorage.getItem("kv_favorites");
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch (e) {}
    }
    const savedRecent = localStorage.getItem("kv_recently_viewed");
    if (savedRecent) {
      try { setRecentlyViewed(JSON.parse(savedRecent)); } catch (e) {}
    }
    const savedLeads = localStorage.getItem("kv_leads");
    if (savedLeads) {
      try { setLeadsData(JSON.parse(savedLeads)); } catch (e) {}
    }
    const savedAudit = localStorage.getItem("kv_audit_logs");
    if (savedAudit) {
      try { setAuditLogs(JSON.parse(savedAudit)); } catch (e) {}
    }
    const savedIIR = localStorage.getItem("kv_iir_data");
    if (savedIIR) {
      try { setIirData(JSON.parse(savedIIR)); } catch (e) {}
    }
    const savedDSA = localStorage.getItem("kv_dsa_data");
    if (savedDSA) {
      try { setDsaData(JSON.parse(savedDSA)); } catch (e) {}
    }
    const savedCVG = localStorage.getItem("kv_cvgrid_data");
    if (savedCVG) {
      try { setCvGridData(JSON.parse(savedCVG)); } catch (e) {}
    }
    const savedBolero = localStorage.getItem("kv_bolero_data");
    if (savedBolero) {
      try { setBoleroGridData(JSON.parse(savedBolero)); } catch (e) {}
    }
    const savedCharges = localStorage.getItem("kv_charges_data");
    if (savedCharges) {
      try { setChargesData(JSON.parse(savedCharges)); } catch (e) {}
    }

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  const toggleFavorite = (moduleId: string) => {
    setFavorites(prev => {
      const next = prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId];
      localStorage.setItem("kv_favorites", JSON.stringify(next));
      return next;
    });
  };

  const addRecentlyViewed = (moduleId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== moduleId);
      const next = [moduleId, ...filtered].slice(0, 6);
      localStorage.setItem("kv_recently_viewed", JSON.stringify(next));
      return next;
    });
  };

  const logAction = (action: AuditLog["action"], module: string, details: string) => {
    const newLog: AuditLog = {
      id: "log-" + Date.now() + "-" + Math.random().toString(36).substring(7),
      userId: user?.uid || "guest",
      userName: user?.displayName || "Field User",
      userEmail: user?.email || "anonymous@kreditventure.com",
      action,
      module,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => {
      const next = [newLog, ...prev].slice(0, 100);
      localStorage.setItem("kv_audit_logs", JSON.stringify(next));
      return next;
    });
  };

  const updateIIRItem = (id: string, updated: Partial<IIRRateItem>) => {
    setIirData(prev => {
      const next = prev.map(item => item.id === id ? { ...item, ...updated, updatedAt: new Date().toISOString().split("T")[0] } : item);
      localStorage.setItem("kv_iir_data", JSON.stringify(next));
      logAction("EDIT_DATA", "IIR Matrix", `Updated row #${id}`);
      return next;
    });
  };

  const updateDSAItem = (id: string, updated: Partial<DSAPayoutSlab>) => {
    setDsaData(prev => {
      const next = prev.map(item => item.id === id ? { ...item, ...updated, updatedAt: new Date().toISOString().split("T")[0] } : item);
      localStorage.setItem("kv_dsa_data", JSON.stringify(next));
      logAction("EDIT_DATA", "DSA Payout", `Updated slab #${id}`);
      return next;
    });
  };

  const updateCVGridItem = (id: string, updated: Partial<CVGridItem>) => {
    setCvGridData(prev => {
      const next = prev.map(item => item.id === id ? { ...item, ...updated, updatedAt: new Date().toISOString().split("T")[0] } : item);
      localStorage.setItem("kv_cvgrid_data", JSON.stringify(next));
      logAction("EDIT_DATA", "CV Grid", `Updated model #${id}`);
      return next;
    });
  };

  const updateBoleroGridItem = (id: string, updated: Partial<BoleroGridItem>) => {
    setBoleroGridData(prev => {
      const next = prev.map(item => item.id === id ? { ...item, ...updated, updatedAt: new Date().toISOString().split("T")[0] } : item);
      localStorage.setItem("kv_bolero_data", JSON.stringify(next));
      logAction("EDIT_DATA", "Bolero Grid", `Updated variant #${id}`);
      return next;
    });
  };

  const updateChargeItem = (id: string, updated: Partial<ChargeItem>) => {
    setChargesData(prev => {
      const next = prev.map(item => item.id === id ? { ...item, ...updated, updatedAt: new Date().toISOString().split("T")[0] } : item);
      localStorage.setItem("kv_charges_data", JSON.stringify(next));
      logAction("EDIT_DATA", "Charges & Fees", `Updated charge #${id}`);
      return next;
    });
  };

  const addLead = (lead: Omit<CustomerLead, "id" | "createdAt" | "updatedAt">) => {
    const newLead: CustomerLead = {
      ...lead,
      id: "lead-" + Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0]
    };
    setLeadsData(prev => {
      const next = [newLead, ...prev];
      localStorage.setItem("kv_leads", JSON.stringify(next));
      logAction("EDIT_DATA", "Leads", `Created lead for ${newLead.customerName}`);
      return next;
    });
  };

  const updateLead = (id: string, lead: Partial<CustomerLead>) => {
    setLeadsData(prev => {
      const next = prev.map(l => l.id === id ? { ...l, ...lead, updatedAt: new Date().toISOString().split("T")[0] } : l);
      localStorage.setItem("kv_leads", JSON.stringify(next));
      return next;
    });
  };

  const deleteLead = (id: string) => {
    setLeadsData(prev => {
      const next = prev.filter(l => l.id !== id);
      localStorage.setItem("kv_leads", JSON.stringify(next));
      return next;
    });
  };

  const rollbackToDefault = (moduleKey: string) => {
    if (moduleKey === "iir-matrix") {
      setIirData(IIR_MATRIX_DATA);
      localStorage.removeItem("kv_iir_data");
    } else if (moduleKey === "dsa-payout") {
      setDsaData(DSA_PAYOUT_SLABS);
      localStorage.removeItem("kv_dsa_data");
    } else if (moduleKey === "cv-grid") {
      setCvGridData(CV_GRID_DATA);
      localStorage.removeItem("kv_cvgrid_data");
    } else if (moduleKey === "bolero-grid") {
      setBoleroGridData(BOLERO_GRID_DATA);
      localStorage.removeItem("kv_bolero_data");
    } else if (moduleKey === "charges") {
      setChargesData(CHARGES_DATA);
      localStorage.removeItem("kv_charges_data");
    }
    logAction("EDIT_DATA", moduleKey, "Rolled back grid to master baseline");
  };

  return (
    <DataContext.Provider
      value={{
        favorites,
        toggleFavorite,
        recentlyViewed,
        addRecentlyViewed,
        iirData,
        setIirData,
        updateIIRItem,
        dsaData,
        setDsaData,
        updateDSAItem,
        cvGridData,
        setCvGridData,
        updateCVGridItem,
        boleroGridData,
        setBoleroGridData,
        updateBoleroGridItem,
        chargesData,
        setChargesData,
        updateChargeItem,
        leadsData,
        addLead,
        updateLead,
        deleteLead,
        circularsData,
        auditLogs,
        logAction,
        rollbackToDefault,
        isOffline,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
