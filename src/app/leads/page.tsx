"use client";

import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { formatINR } from "@/lib/utils";
import { CustomerLead } from "@/types";
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  FileSpreadsheet,
  Zap,
  ArrowRight,
  UserCheck
} from "lucide-react";
import { exportToExcel } from "@/lib/utils";

export default function LeadsPage() {
  const { leadsData, addLead, updateLead, deleteLead, addRecentlyViewed } = useData();
  const [selectedStage, setSelectedStage] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formCategory, setFormCategory] = useState("SCV Pickup");
  const [formModel, setFormModel] = useState("Bolero Maxi Truck");
  const [formOwnerNo, setFormOwnerNo] = useState<number>(1);
  const [formAmount, setFormAmount] = useState<number>(600000);
  const [formCibil, setFormCibil] = useState<number>(700);
  const [formStage, setFormStage] = useState<CustomerLead["stage"]>("Lead");
  const [formNotes, setFormNotes] = useState("");
  const [formDsa, setFormDsa] = useState("");
  const [formFollowUp, setFormFollowUp] = useState("");

  useEffect(() => {
    addRecentlyViewed("leads");
  }, []);

  const stages: (CustomerLead["stage"] | "All")[] = [
    "All",
    "Lead",
    "Documents Collected",
    "Login / PD",
    "Sanctioned",
    "Disbursed",
    "Rejected"
  ];

  const filteredLeads = leadsData.filter(l => {
    const matchStage = selectedStage === "All" || l.stage === selectedStage;
    const matchQ = !searchQuery ||
      l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery);
    return matchStage && matchQ;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormName("");
    setFormPhone("");
    setFormLocation("");
    setFormCategory("SCV Pickup");
    setFormModel("Bolero Maxi Truck");
    setFormOwnerNo(1);
    setFormAmount(600000);
    setFormCibil(700);
    setFormStage("Lead");
    setFormNotes("");
    setFormDsa("");
    setFormFollowUp(new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lead: CustomerLead) => {
    setEditingId(lead.id);
    setFormName(lead.customerName);
    setFormPhone(lead.phone);
    setFormLocation(lead.location);
    setFormCategory(lead.vehicleCategory);
    setFormModel(lead.vehicleModel);
    setFormOwnerNo(lead.ownerNo || 1);
    setFormAmount(lead.loanAmountRequired);
    setFormCibil(lead.cibilScore || 700);
    setFormStage(lead.stage);
    setFormNotes(lead.notes);
    setFormDsa(lead.dsaPartner || "");
    setFormFollowUp(lead.followUpDate || "");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      alert("Please fill customer name and contact phone number");
      return;
    }

    if (editingId) {
      updateLead(editingId, {
        customerName: formName,
        phone: formPhone,
        location: formLocation,
        vehicleCategory: formCategory,
        vehicleModel: formModel,
        ownerNo: formOwnerNo,
        loanAmountRequired: formAmount,
        cibilScore: formCibil,
        stage: formStage,
        notes: formNotes,
        dsaPartner: formDsa,
        followUpDate: formFollowUp,
      });
    } else {
      addLead({
        customerName: formName,
        phone: formPhone,
        location: formLocation,
        vehicleCategory: formCategory,
        vehicleModel: formModel,
        ownerNo: formOwnerNo,
        loanAmountRequired: formAmount,
        cibilScore: formCibil,
        stage: formStage,
        notes: formNotes,
        dsaPartner: formDsa,
        assignedStaffId: "staff-1",
        followUpDate: formFollowUp,
      });
    }
    setIsModalOpen(false);
  };

  const handleExportLeads = () => {
    const data = leadsData.map(l => ({
      "Customer Name": l.customerName,
      Phone: l.phone,
      Location: l.location,
      "Vehicle Category": l.vehicleCategory,
      "Vehicle Model": l.vehicleModel,
      "RC Owner Serial No.": l.ownerNo ? `${l.ownerNo} Owner` : "1st Owner",
      "Loan Required (₹)": l.loanAmountRequired,
      "CIBIL Score": l.cibilScore || "N/A",
      Stage: l.stage,
      "DSA Partner": l.dsaPartner || "Direct",
      "Follow Up Date": l.followUpDate,
      Notes: l.notes,
      "Created At": l.createdAt
    }));
    exportToExcel(data, `kv_leads_pipeline_${new Date().toISOString().split("T")[0]}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Module 11</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Customer Leads &amp; Pipeline (Mini CRM)
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Field staff loan application tracker with owner serial tracking (1st to 5th Owner), pipeline stage management, and follow-up logging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportLeads}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-bold hover:bg-elevated transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent-hover transition-colors shadow-soft"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {stages.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStage(st)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStage === st
                  ? "bg-accent text-white shadow-soft"
                  : "bg-surface border border-border text-muted hover:text-foreground"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer, vehicle, phone..."
            className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder-muted focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Leads Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeads.map((lead) => {
          const stageColors: { [key: string]: string } = {
            "Lead": "bg-blue-500/15 text-blue-400 border-blue-500/30",
            "Documents Collected": "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
            "Login / PD": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
            "Sanctioned": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
            "Disbursed": "bg-green-500/20 text-green-300 border-green-500/40",
            "Rejected": "bg-rose-500/15 text-rose-400 border-rose-500/30",
          };

          return (
            <div
              key={lead.id}
              className="bg-card border border-border rounded-3xl p-5 shadow-soft hover:border-accent/40 transition-all flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${stageColors[lead.stage] || "bg-surface text-muted"}`}>
                    {lead.stage}
                  </span>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => handleOpenEdit(lead)}
                      className="p-1 rounded text-muted hover:text-foreground hover:bg-surface"
                      title="Edit Lead"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete lead for ${lead.customerName}?`)) deleteLead(lead.id);
                      }}
                      className="p-1 rounded text-muted hover:text-rose-400 hover:bg-surface"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground line-clamp-1">{lead.customerName}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-muted font-medium">{lead.location}</span>
                    {lead.dsaPartner && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-muted">
                        DSA: {lead.dsaPartner}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-surface/80 border border-border/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground truncate">{lead.vehicleModel}</span>
                    <span className="text-[11px] font-bold text-accent tabular-nums">{formatINR(lead.loanAmountRequired)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted">
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-accent" />
                      <span className="font-semibold text-foreground">
                        {lead.ownerNo ? `${lead.ownerNo}${lead.ownerNo === 1 ? 'st' : lead.ownerNo === 2 ? 'nd' : lead.ownerNo === 3 ? 'rd' : 'th'} Owner` : '1st Owner'}
                      </span>
                    </span>
                    <span>CIBIL: <strong className="text-foreground font-semibold">{lead.cibilScore || "N/A"}</strong></span>
                  </div>
                </div>

                {lead.notes && (
                  <p className="text-xs text-muted line-clamp-2 bg-surface/40 p-2.5 rounded-xl border border-border/40 italic">
                    &ldquo;{lead.notes}&rdquo;
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-muted">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  <span>Next: {lead.followUpDate || "No Date"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${lead.phone}`}
                    className="p-2 rounded-xl bg-surface border border-border text-foreground hover:text-accent hover:border-accent transition-colors"
                    title={`Call ${lead.phone}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/91${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${lead.customerName}, this is regarding your ${lead.vehicleModel} loan application of ${formatINR(lead.loanAmountRequired)} with Kredit Venture.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                    title="WhatsApp Customer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 my-8 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">
                {editingId ? "Edit Customer Lead" : "Create New Customer Lead"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted hover:text-foreground p-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted block mb-1">Customer / Entity Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Rameshwar Transport"
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted block mb-1">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted block mb-1">Location / Branch</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Hadapsar, Pune"
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted block mb-1">DSA / Channel Partner</label>
                  <input
                    type="text"
                    value={formDsa}
                    onChange={(e) => setFormDsa(e.target.value)}
                    placeholder="e.g. Omkar Finance"
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-muted block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none text-xs"
                  >
                    <option value="SCV Pickup">SCV Pickup</option>
                    <option value="Personal Car">Personal Car</option>
                    <option value="Commercial Car">Commercial Car</option>
                    <option value="LCV / ICV">LCV / ICV</option>
                    <option value="M&HCV">M&HCV Truck</option>
                    <option value="Tractor">Tractor</option>
                    <option value="Construction Equipment">CE</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-muted block mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    placeholder="e.g. Bolero 1.7T"
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted block mb-1">RC Owner No.</label>
                  <select
                    value={formOwnerNo}
                    onChange={(e) => setFormOwnerNo(Number(e.target.value))}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none text-xs font-bold"
                  >
                    <option value={1}>1st Owner</option>
                    <option value={2}>2nd Owner</option>
                    <option value={3}>3rd Owner</option>
                    <option value={4}>4th Owner</option>
                    <option value={5}>5th Owner</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-muted block mb-1">Loan Required (₹)</label>
                  <input
                    type="number"
                    value={formAmount}
                    onChange={(e) => setFormAmount(Number(e.target.value))}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-foreground tabular-nums focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted block mb-1">CIBIL Score</label>
                  <input
                    type="number"
                    value={formCibil}
                    onChange={(e) => setFormCibil(Number(e.target.value))}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-foreground tabular-nums focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted block mb-1">Pipeline Stage</label>
                  <select
                    value={formStage}
                    onChange={(e) => setFormStage(e.target.value as any)}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none text-xs font-bold"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Documents Collected">Docs Collected</option>
                    <option value="Login / PD">Login / PD</option>
                    <option value="Sanctioned">Sanctioned</option>
                    <option value="Disbursed">Disbursed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-muted block mb-1">Follow-up Date</label>
                <input
                  type="date"
                  value={formFollowUp}
                  onChange={(e) => setFormFollowUp(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-muted block mb-1">Underwriting &amp; Discussion Notes</label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. 2nd Owner vehicle, 3.5 Acres Satbara verified, PD completed..."
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none resize-none text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface border border-border text-foreground hover:bg-elevated font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-accent text-white font-bold hover:bg-accent-hover shadow-soft text-xs"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
