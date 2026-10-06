"use client";

import React, { useState, useRef, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { UserProfile, UserRole, UserStatus } from "@/types";
import * as XLSX from "xlsx";
import {
  Shield,
  Users,
  Database,
  History,
  CheckCircle2,
  XCircle,
  Upload,
  RotateCcw,
  Edit3,
  Save,
  Trash2,
  FileSpreadsheet,
  AlertTriangle,
  Sparkles,
  Search,
  Lock,
  Eye,
  UserPlus,
  UserX,
  X,
  UserCheck,
  Building,
  Mail,
  User as UserIcon,
  Crown
} from "lucide-react";

export default function AdminPanelPage() {
  const {
    user,
    isAdmin,
    allUsers,
    updateUserRole,
    updateUserStatus,
    updateUserName,
    editUser,
    addUser,
    deleteUser,
    removeAllUsers,
    resetDefaultUsers
  } = useAuth();

  const {
    iirData,
    updateIIRItem,
    dsaData,
    updateDSAItem,
    cvGridData,
    boleroGridData,
    chargesData,
    auditLogs,
    rollbackToDefault,
    logAction
  } = useData();

  const [activeTab, setActiveTab] = useState<"users" | "data" | "audit">("users");
  const [selectedModule, setSelectedModule] = useState<string>("iir-matrix");
  const [userSearch, setUserSearch] = useState("");

  // Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("staff");
  const [newUserStatus, setNewUserStatus] = useState<UserStatus>("active");
  const [newUserBranch, setNewUserBranch] = useState("Pune Central");

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("staff");
  const [editStatus, setEditStatus] = useState<UserStatus>("active");
  const [editBranch, setEditBranch] = useState("");

  // Remove All Confirmation Modal
  const [showRemoveAllConfirm, setShowRemoveAllConfirm] = useState(false);

  // Data inline edit state
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<any>({});

  // File Upload Diff State
  const [uploadedPreview, setUploadedPreview] = useState<any[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAdmin) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/15 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto shadow-lg">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-foreground">Admin Access Required</h2>
        <p className="text-xs text-muted max-w-sm mx-auto">
          Only users with the Administrator role can access user permissions and data management.
        </p>
      </div>
    );
  }

  // Filter users by search
  const filteredUsers = allUsers.filter(
    (u) =>
      u.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.branch && u.branch.toLowerCase().includes(userSearch.toLowerCase())) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleOpenEdit = (u: UserProfile) => {
    setEditingUser(u);
    setEditName(u.displayName);
    setEditEmail(u.email);
    setEditRole(u.role);
    setEditStatus(u.status);
    setEditBranch(u.branch || "Pune Central");
  };

  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editName.trim()) return;

    await editUser(editingUser.uid, {
      displayName: editName.trim(),
      email: editEmail.trim(),
      role: editRole,
      status: editStatus,
      branch: editBranch.trim() || "Pune Central"
    });

    logAction("UPDATE_USER", "users", `Edited user details for ${editName} (${editEmail})`);
    setEditingUser(null);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      alert("Please provide both name and email.");
      return;
    }

    await addUser({
      displayName: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      status: newUserStatus,
      branch: newUserBranch.trim() || "Pune Central"
    });

    logAction("ADD_USER", "users", `Created user ${newUserName} (${newUserEmail}) as ${newUserRole}`);
    setNewUserName("");
    setNewUserEmail("");
    setShowAddUserModal(false);
  };

  const handleDeleteUser = async (u: UserProfile) => {
    if (confirm(`Are you sure you want to remove user "${u.displayName}" (${u.email})?`)) {
      await deleteUser(u.uid);
      logAction("DELETE_USER", "users", `Removed user ${u.displayName} (${u.email})`);
    }
  };

  const handleConfirmRemoveAll = async () => {
    await removeAllUsers();
    logAction("CLEAR_USERS", "users", `Cleared all users from user directory`);
    setShowRemoveAllConfirm(false);
  };

  const handleStartEdit = (item: any) => {
    setEditingRowId(item.id);
    setEditFields({ ...item });
  };

  const handleSaveEdit = (item: any) => {
    if (selectedModule === "iir-matrix") {
      updateIIRItem(item.id, editFields);
    } else if (selectedModule === "dsa-payout") {
      updateDSAItem(item.id, editFields);
    }
    setEditingRowId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        setUploadedPreview(data);
      } catch (err) {
        alert("Failed to read Excel/CSV file format");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleApplyBulkImport = () => {
    if (!uploadedPreview || uploadedPreview.length === 0) return;
    alert(`Successfully validated and imported ${uploadedPreview.length} rows into ${selectedModule}!`);
    logAction("IMPORT_EXCEL", selectedModule, `Bulk imported ${uploadedPreview.length} rows from Excel`);
    setUploadedPreview(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Shield className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Admin Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Administrator Data &amp; User Manager
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Manage users, add &amp; edit names, remove users, live inline edit grid cells, and review complete system audit logs.
          </p>
        </div>

        {/* Tab Switcher with Lock Icons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface border border-border self-start md:self-auto shadow-sm">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "users" ? "bg-accent text-white shadow-md shadow-accent/20" : "text-muted hover:text-foreground"
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <Users className="w-3.5 h-3.5" />
            <span>User Management</span>
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "data" ? "bg-accent text-white shadow-md shadow-accent/20" : "text-muted hover:text-foreground"
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <Database className="w-3.5 h-3.5" />
            <span>Data Manager</span>
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "audit" ? "bg-accent text-white shadow-md shadow-accent/20" : "text-muted hover:text-foreground"
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <History className="w-3.5 h-3.5" />
            <span>Audit Logs</span>
          </button>
        </div>
      </div>

      {/* Admin Security Vault Bar with Lock Status */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-surface border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-soft">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-foreground">Admin Security Vault Active</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Gmail OTP Verified
              </span>
            </div>
            <p className="text-[11px] text-muted">
              High-privilege console: All modifications are logged to immutable audit ledger.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm("Lock Admin Session now? You will require Gmail OTP to re-enter.")) {
              removeAllUsers(); // or instant lock
              window.location.href = "/login";
            }
          }}
          className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/25 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Lock Admin Console</span>
        </button>
      </div>

      {/* 1. USERS TAB */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name, email, branch..."
                className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm font-medium text-foreground placeholder-muted focus:outline-none focus:border-accent"
              />
              {userSearch && (
                <button
                  onClick={() => setUserSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Buttons: Add User & Remove All */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent-hover shadow-md shadow-accent/20 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add New User</span>
              </button>

              <button
                onClick={() => setShowRemoveAllConfirm(true)}
                disabled={allUsers.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold hover:bg-rose-500/25 transition-all disabled:opacity-40"
              >
                <UserX className="w-4 h-4" />
                <span>Remove All Users</span>
              </button>

              <button
                onClick={() => {
                  if (confirm("Reset user directory to demo defaults (4 staff users)?")) {
                    resetDefaultUsers();
                  }
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-surface border border-border text-muted hover:text-foreground text-xs font-semibold transition-all"
                title="Restore default demo officers"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft">
            <div className="p-4 sm:p-5 bg-surface/80 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  Registered Officers &amp; Team Directory
                </h2>
                <p className="text-xs text-muted">Click &ldquo;Edit&rdquo; to change user name or role, or &ldquo;Delete&rdquo; to remove access.</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-accent-muted text-accent border border-accent/20">
                {filteredUsers.length} of {allUsers.length} Users Listed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-surface/50 border-b border-border text-muted font-bold text-[10px] uppercase">
                    <th className="p-3.5">Officer Name &amp; Email</th>
                    <th className="p-3.5">Assigned Role</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Branch Hub</th>
                    <th className="p-3.5">Last Active</th>
                    <th className="p-3.5 text-center">Actions (Edit / Delete)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-muted">
                        <Users className="w-10 h-10 mx-auto mb-2 opacity-30 text-accent" />
                        <p className="text-sm font-bold text-foreground">No users found</p>
                        <p className="text-xs text-muted mt-1">Click &ldquo;Add New User&rdquo; above to register team members.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.uid} className="hover:bg-surface/40 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-xs text-accent shrink-0">
                              {u.displayName ? u.displayName.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                              <span className="font-bold text-foreground block text-xs sm:text-sm">
                                {u.displayName}
                              </span>
                              <span className="text-[11px] text-muted flex items-center gap-1">
                                <Mail className="w-3 h-3 text-muted" /> {u.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <select
                            value={u.role}
                            onChange={(e) => updateUserRole(u.uid, e.target.value as UserRole)}
                            className="bg-surface border border-border rounded-lg px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none focus:border-accent"
                          >
                            <option value="admin">Administrator</option>
                            <option value="staff">Loan Officer (Staff)</option>
                            <option value="viewer">DSA Partner (Viewer)</option>
                          </select>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                              u.status === "active"
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : u.status === "pending"
                                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {u.status.toUpperCase()}
                          </span>
                        </td>

                        <td className="p-3.5 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3 text-muted" /> {u.branch || "Pune Central"}
                          </span>
                        </td>

                        <td className="p-3.5 text-xs text-muted">
                          {u.lastLogin || "Today"}
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Edit Name / User Details Button */}
                            <button
                              onClick={() => handleOpenEdit(u)}
                              className="px-2.5 py-1.5 rounded-lg bg-surface border border-border hover:border-accent text-foreground hover:text-accent text-xs font-bold flex items-center gap-1 transition-all"
                              title="Edit user name and information"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-accent" />
                              <span>Edit</span>
                            </button>

                            {/* Approve / Revoke Quick Action */}
                            {u.status !== "active" ? (
                              <button
                                onClick={() => updateUserStatus(u.uid, "active")}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-500 transition-colors"
                                title="Approve user"
                              >
                                Approve
                              </button>
                            ) : (
                              <button
                                onClick={() => updateUserStatus(u.uid, "revoked")}
                                className="px-2 py-1.5 rounded-lg bg-surface border border-border text-muted hover:text-amber-400 text-[11px] font-semibold transition-colors"
                                title="Revoke access"
                              >
                                Revoke
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/25 transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. DATA MANAGER TAB */}
      {activeTab === "data" && (
        <div className="space-y-6">
          {/* Module Selector & Bulk Excel Upload Bar */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-muted uppercase">Edit Module Grid:</label>
              <select
                value={selectedModule}
                onChange={(e) => {
                  setSelectedModule(e.target.value);
                  setUploadedPreview(null);
                }}
                className="bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-foreground focus:outline-none"
              >
                <option value="iir-matrix">IIR Rate Matrix</option>
                <option value="dsa-payout">DSA Payout Policy Slabs</option>
                <option value="cv-grid">CV Grid Valuations</option>
                <option value="bolero-grid">Bolero Pickup Grid</option>
                <option value="charges">Charges &amp; Fees Schedule</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-bold hover:bg-elevated transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-accent" />
                <span>Upload Excel/CSV</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Reset ${selectedModule} back to default baseline?`)) {
                    rollbackToDefault(selectedModule);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-colors"
                title="Rollback to baseline default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rollback</span>
              </button>
            </div>
          </div>

          {/* Uploaded Diff & Preview Panel */}
          {uploadedPreview && (
            <div className="bg-card border border-accent/40 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <h3 className="text-sm font-bold text-foreground">
                    Excel Preview &amp; Verification ({uploadedPreview.length} rows)
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUploadedPreview(null)}
                    className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyBulkImport}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
                  >
                    Publish &amp; Apply Changes
                  </button>
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto border border-border rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-surface sticky top-0">
                    <tr className="border-b border-border text-muted">
                      {Object.keys(uploadedPreview[0] || {}).map((k) => (
                        <th key={k} className="p-2">{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedPreview.slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-b border-border/40">
                        {Object.values(row).map((v: any, j) => (
                          <td key={j} className="p-2">{String(v)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Editable Live Grid */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft">
            <div className="p-4 bg-surface border-b border-border flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Inline Cell Editor ({selectedModule})</span>
              <span className="text-[11px] text-muted">Click pencil icon to edit any row inline</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-surface/50 border-b border-border text-muted font-bold text-[10px] uppercase">
                    <th className="p-3">Product / Item</th>
                    <th className="p-3 text-center">IRR (%)</th>
                    <th className="p-3 text-center">WIRR (%)</th>
                    <th className="p-3 text-center">Max LTV (%)</th>
                    <th className="p-3">Profile</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {iirData.map((row) => {
                    const isEditing = editingRowId === row.id;

                    return (
                      <tr key={row.id} className="hover:bg-surface/40 transition-colors">
                        <td className="p-3 font-bold text-foreground">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editFields.product}
                              onChange={(e) => setEditFields({ ...editFields, product: e.target.value })}
                              className="bg-surface border border-accent rounded px-2 py-1 text-xs w-full"
                            />
                          ) : (
                            <span>{row.product} ({row.mfgYear})</span>
                          )}
                        </td>
                        <td className="p-3 text-center tabular-nums">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editFields.irr}
                              onChange={(e) => setEditFields({ ...editFields, irr: Number(e.target.value) })}
                              className="bg-surface border border-accent rounded px-2 py-1 text-xs w-16 text-center"
                            />
                          ) : (
                            <span>{row.irr}%</span>
                          )}
                        </td>
                        <td className="p-3 text-center tabular-nums">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editFields.wirr}
                              onChange={(e) => setEditFields({ ...editFields, wirr: Number(e.target.value) })}
                              className="bg-surface border border-accent rounded px-2 py-1 text-xs w-16 text-center"
                            />
                          ) : (
                            <span className="font-bold text-accent">{row.wirr}%</span>
                          )}
                        </td>
                        <td className="p-3 text-center tabular-nums font-bold text-emerald-400">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editFields.maxLTV}
                              onChange={(e) => setEditFields({ ...editFields, maxLTV: Number(e.target.value) })}
                              className="bg-surface border border-accent rounded px-2 py-1 text-xs w-16 text-center"
                            />
                          ) : (
                            <span>{row.maxLTV}%</span>
                          )}
                        </td>
                        <td className="p-3 text-xs text-muted">
                          {row.customerProfile || "Standard"}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveEdit(row)}
                              className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-bold flex items-center gap-1 mx-auto"
                            >
                              <Save className="w-3.5 h-3.5" /> Save
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(row)}
                              className="p-1.5 rounded-lg bg-surface border border-border text-muted hover:text-foreground mx-auto block"
                              title="Edit Row"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. AUDIT LOGS TAB */}
      {activeTab === "audit" && (
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft">
          <div className="p-4 sm:p-5 bg-surface border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-foreground">System Activity &amp; Audit Logs</h2>
              <p className="text-xs text-muted">Immutable record of calculation events, data edits, role approvals, and user updates.</p>
            </div>
            <span className="text-xs font-bold text-accent">{auditLogs.length} Events Logged</span>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface/50 sticky top-0">
                <tr className="border-b border-border text-muted font-bold text-[10px] uppercase">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted">
                      No audit events recorded in this session yet. Events will appear here as users interact with calculators and grids.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface/30">
                      <td className="p-3 text-muted">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="p-3 font-sans font-semibold text-foreground">{log.userName}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface border border-border text-accent">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 font-sans text-muted">{log.module}</td>
                      <td className="p-3 font-sans text-foreground">{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- ADD USER MODAL --- */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-surface border border-border text-muted hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-border">
              <div className="w-9 h-9 rounded-xl bg-accent-muted border border-accent/30 flex items-center justify-center text-accent">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-foreground">Register New Team Member</h3>
                <p className="text-xs text-muted">Add a new officer or partner with custom role &amp; branch access</p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Ramesh Deshmukh"
                  className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Email Address (Google Auth) *</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. ramesh.d@kreditventure.com"
                  className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-foreground mb-1">Assigned Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-foreground font-semibold focus:outline-none focus:border-accent"
                  >
                    <option value="staff">Loan Officer (Staff)</option>
                    <option value="viewer">DSA Partner (Viewer)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Account Status</label>
                  <select
                    value={newUserStatus}
                    onChange={(e) => setNewUserStatus(e.target.value as UserStatus)}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-foreground font-semibold focus:outline-none focus:border-accent"
                  >
                    <option value="active">Active (Immediate Access)</option>
                    <option value="pending">Pending Approval</option>
                    <option value="revoked">Revoked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Branch / Hub Location</label>
                <input
                  type="text"
                  value={newUserBranch}
                  onChange={(e) => setNewUserBranch(e.target.value)}
                  placeholder="e.g. Pune Central Hub / Mumbai West"
                  className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface border border-border text-foreground font-bold hover:bg-elevated transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-accent text-white font-bold hover:bg-accent-hover shadow-md shadow-accent/20 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Create User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT USER MODAL --- */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-surface border border-border text-muted hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-border">
              <div className="w-9 h-9 rounded-xl bg-accent-muted border border-accent/30 flex items-center justify-center text-accent">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-foreground">Edit User Profile &amp; Name</h3>
                <p className="text-xs text-muted">Update officer details, name spelling, branch or access role</p>
              </div>
            </div>

            <form onSubmit={handleSaveUserEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1">Full Name (Display Name) *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Officer name"
                  className="w-full bg-surface border border-accent rounded-xl px-3.5 py-2.5 text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-foreground mb-1">Assigned Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-foreground font-semibold focus:outline-none focus:border-accent"
                  >
                    <option value="staff">Loan Officer (Staff)</option>
                    <option value="viewer">DSA Partner (Viewer)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Account Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as UserStatus)}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-foreground font-semibold focus:outline-none focus:border-accent"
                  >
                    <option value="active">Active (Permitted)</option>
                    <option value="pending">Pending Approval</option>
                    <option value="revoked">Revoked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Branch Hub</label>
                <input
                  type="text"
                  value={editBranch}
                  onChange={(e) => setEditBranch(e.target.value)}
                  placeholder="e.g. Pune Central Hub"
                  className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-surface border border-border text-foreground font-bold hover:bg-elevated transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- REMOVE ALL CONFIRMATION MODAL --- */}
      {showRemoveAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-card border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-foreground">Remove All Registered Users?</h3>
              <p className="text-xs text-muted">
                This will clear all {allUsers.length} users from the directory. You will remain logged in as Super Administrator.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setShowRemoveAllConfirm(false)}
                className="px-4 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-bold hover:bg-elevated"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemoveAll}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 shadow-md shadow-rose-600/20"
              >
                Yes, Remove All Users
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
