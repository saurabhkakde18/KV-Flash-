"use client";

import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { CONTACTS_DATA } from "@/lib/constants";
import { ExportActions } from "@/components/common/ExportActions";
import {
  PhoneCall,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Mail,
  Building,
  UserCheck,
  Shield,
  Sparkles,
  Zap,
  MapPin
} from "lucide-react";

export default function ContactsPage() {
  const { addRecentlyViewed } = useData();
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    addRecentlyViewed("contacts");
  }, []);

  const departments = ["All", "Credit", "Sales", "Valuation & Legal", "Operations"];

  const filteredContacts = CONTACTS_DATA.filter(c => {
    const matchDept = departmentFilter === "All" || c.department === departmentFilter;
    const matchQ = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase()) || c.branch.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery);
    return matchDept && matchQ;
  });

  const getExcelData = () => {
    return CONTACTS_DATA.map(c => ({
      Name: c.name,
      Role: c.role,
      Department: c.department,
      Branch: c.branch,
      Region: c.region,
      Phone: c.phone,
      Email: c.email,
      Availability: c.availability
    }));
  };

  const getWhatsAppSummary = () => {
    return `*KV Flash - Key Credit & Branch Directory*\n` +
      `-----------------------------------------\n` +
      CONTACTS_DATA.map(c => `👤 *${c.name}* (${c.role})\n  • Branch: ${c.branch}\n  • Phone: ${c.phone} | Status: ${c.availability}`).join("\n\n") +
      `\n-----------------------------------------\n_Kredit Venture / Jads Services Pvt Ltd_`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-teal-500/15 text-teal-400 border border-teal-500/30">
              <PhoneCall className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Module 12</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Contacts &amp; Credit Escalation Directory
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Direct 1-tap phone and WhatsApp directory for Branch Managers, Credit Approval Authorities (ACM/RCM/NCM), and Valuators.
          </p>
        </div>

        <ExportActions
          title="KV Flash - Contacts Directory"
          moduleKey="contacts_directory"
          getDataForExcel={getExcelData}
          getWhatsAppText={getWhatsAppSummary}
        />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                departmentFilter === dept
                  ? "bg-accent text-white shadow-soft"
                  : "bg-surface border border-border text-muted hover:text-foreground"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, ACM, branch..."
            className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder-muted focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Contacts Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => {
          const availColor =
            contact.availability === "Available" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
            contact.availability === "In Field" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" :
            "bg-rose-500/15 text-rose-400 border-rose-500/30";

          return (
            <div
              key={contact.id}
              className="bg-card border border-border rounded-3xl p-5 shadow-soft hover:border-accent/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-surface border border-border flex items-center justify-center font-black text-accent text-sm">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-foreground">{contact.name}</h3>
                      <span className="text-[11px] font-semibold text-accent block">{contact.role}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-surface border border-border/60 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-muted">
                    <span>Department:</span>
                    <span className="font-semibold text-foreground">{contact.department}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted">
                    <span>Branch &amp; Region:</span>
                    <span className="font-semibold text-foreground">{contact.branch} ({contact.region})</span>
                  </div>
                  <div className="flex items-center justify-between text-muted">
                    <span>Availability:</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${availColor}`}>
                      {contact.availability}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                <a
                  href={`tel:${contact.phone}`}
                  className="py-2 px-3 rounded-xl bg-surface border border-border text-foreground hover:bg-elevated transition-colors text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(`Hello ${contact.name}, this is regarding a vehicle finance credit proposal on KV Flash.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
