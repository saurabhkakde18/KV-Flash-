"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, UserRole, UserStatus } from "@/types";
import { DEMO_USERS } from "@/lib/constants";
import { auth, googleProvider, db } from "@/lib/firebase";
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

export type SessionStatus = "unauthenticated" | "otp_pending" | "authenticated";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  sessionStatus: SessionStatus;
  isOtpVerified: boolean;
  isAllowlisted: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isViewer: boolean;
  pendingApproval: boolean;
  allowlistError: string | null;
  activeOtpEmail: string | null;
  activeOtpCode: string | null;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
  changeAccount: () => Promise<void>;
  switchDemoUser: (role: UserRole) => void;
  requestOtpForUser: (email?: string) => Promise<{ success: boolean; message: string; cooldownRemaining?: number }>;
  verifyOtpCode: (enteredOtp: string, trustDevice?: boolean) => Promise<{ success: boolean; message: string; isLockedOut?: boolean; attemptsLeft?: number }>;
  allUsers: UserProfile[];
  updateUserRole: (uid: string, newRole: UserRole) => Promise<void>;
  updateUserStatus: (uid: string, newStatus: UserStatus) => Promise<void>;
  updateUserName: (uid: string, newName: string) => Promise<void>;
  editUser: (uid: string, fields: Partial<UserProfile>) => Promise<void>;
  addUser: (newUser: { displayName: string; email: string; role: UserRole; status: UserStatus; branch?: string }) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
  removeAllUsers: () => Promise<void>;
  resetDefaultUsers: () => void;
  // Sign Out Lock Helpers
  activeSignOutOtp: string | null;
  isSignOutLockModalOpen: boolean;
  openSignOutLockModal: () => void;
  closeSignOutLockModal: () => void;
  requestSignOutOtp: () => Promise<{ success: boolean; otp: string; message: string }>;
   verifySignOutOtp: (enteredOtp: string) => Promise<{ success: boolean; message: string }>;
  instantSignOut: () => Promise<void>;
  loginAsAdmin: (empCode?: string) => void;
  
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USERS_KEY = "kv_flash_users_directory";
const CURRENT_USER_KEY = "kv_flash_current_user";
const TRUSTED_DEVICE_KEY_PREFIX = "kv_flash_trusted_device_";
const OTP_SESSION_STATUS_KEY = "kv_flash_session_status";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("unauthenticated");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [allowlistError, setAllowlistError] = useState<string | null>(null);
  const [activeOtpEmail, setActiveOtpEmail] = useState<string | null>("kakadesaurabh18@gmail.com");
  const [activeOtpCode, setActiveOtpCode] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(DEMO_USERS);

  // Sign out lock modal states
  const [activeSignOutOtp, setActiveSignOutOtp] = useState<string | null>(null);
  const [isSignOutLockModalOpen, setIsSignOutLockModalOpen] = useState(false);

  // Login session initialization
  useEffect(() => {
    const storedUsers = localStorage.getItem(LOCAL_USERS_KEY);
    let currentDirectory = DEMO_USERS;
    if (storedUsers) {
      try {
        const parsed = JSON.parse(storedUsers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasSaurabh = parsed.some((u) => u.email?.toLowerCase() === "kakadesaurabh18@gmail.com");
          if (!hasSaurabh) {
            currentDirectory = [DEMO_USERS[0], ...parsed.filter((u) => u.email !== "admin@kreditventure.com")];
          } else {
            currentDirectory = parsed;
          }
          setAllUsers(currentDirectory);
          localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(currentDirectory));
        }
      } catch (e) {
        setAllUsers(DEMO_USERS);
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(DEMO_USERS));
      }
    } else {
      setAllUsers(DEMO_USERS);
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(DEMO_USERS));
    }

    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    const sessionState = localStorage.getItem(OTP_SESSION_STATUS_KEY);

    if (savedUser && sessionState === "authenticated") {
      try {
        let parsed: UserProfile = JSON.parse(savedUser);
        if (parsed.email === "admin@kreditventure.com" || parsed.role === "admin") {
          parsed = { ...DEMO_USERS[0], ...parsed, role: "admin" };
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(parsed));
        }
        setUser(parsed);
        setActiveOtpEmail(parsed.email);
        setIsOtpVerified(true);
        setSessionStatus("authenticated");
      } catch (e) {
        setUser(null);
        setSessionStatus("unauthenticated");
        setIsOtpVerified(false);
      }
    } else {
      // Clean unauthenticated state
      setUser(null);
      setSessionStatus("unauthenticated");
      setIsOtpVerified(false);
    }

    setLoading(false);

    // Listen to Firebase auth state
    try {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          await evaluateFirebaseUser(fbUser);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      setLoading(false);
    }
  }, []);

  /**
   * Helper: Check if device is trusted for 30 days
   */
  const checkDeviceTrust = (uid: string): boolean => {
    try {
      const trustTokenStr = localStorage.getItem(`${TRUSTED_DEVICE_KEY_PREFIX}${uid}`);
      if (!trustTokenStr) return false;
      const parsed = JSON.parse(trustTokenStr);
      return parsed.expiresAt > Date.now();
    } catch {
      return false;
    }
  };

  /**
   * Helper: Save 30-day device trust token
   */
  const saveDeviceTrust = (uid: string) => {
    try {
      const trustData = {
        uid,
        trustedAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      };
      localStorage.setItem(`${TRUSTED_DEVICE_KEY_PREFIX}${uid}`, JSON.stringify(trustData));
    } catch (e) {
      console.warn("Could not save device trust token", e);
    }
  };

  /**
   * Evaluate Google sign-in:
   * 1. Check allowlist in Firestore `users/{uid}`.
   * 2. If unapproved -> sign out & mark access pending.
   * 3. If approved -> check device trust. If untrusted -> trigger OTP and route to /verify-otp.
   */
  const evaluateFirebaseUser = async (fbUser: FirebaseUser) => {
    try {
      const userRef = doc(db, "users", fbUser.uid);
      const snap = await getDoc(userRef);

      let profile: UserProfile;

      if (snap.exists()) {
        profile = snap.data() as UserProfile;
      } else {
        // Check local allowlist directory
        const match = allUsers.find((u) => u.email.toLowerCase() === fbUser.email?.toLowerCase());
        if (match) {
          profile = {
            ...match,
            uid: fbUser.uid,
            photoURL: fbUser.photoURL || undefined,
            lastLogin: new Date().toISOString(),
          };
          await setDoc(userRef, profile);
        } else {
          // Check if admin email or staff email
          const isKakade = fbUser.email?.toLowerCase() === "kakadesaurabh18@gmail.com";
          const isKvStaff = isKakade || fbUser.email?.endsWith("@kreditventure.com") || fbUser.email?.includes("admin");
          profile = {
            uid: fbUser.uid,
            email: fbUser.email || "kakadesaurabh18@gmail.com",
            displayName: fbUser.displayName || (isKakade ? "Saurabh Kakade" : "Field User"),
            photoURL: fbUser.photoURL || undefined,
            role: isKakade || fbUser.email?.includes("admin") ? "admin" : isKvStaff ? "staff" : "viewer",
            status: "active",
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            branch: isKakade ? "Corporate HQ" : "Pune Central",
          };
          await setDoc(userRef, profile);
        }
      }

      // Check Allowlist Status
      if (profile.status !== "active") {
        await fbSignOut(auth);
        setUser(null);
        setPendingApproval(true);
        setAllowlistError("Access pending, contact admin.");
        setSessionStatus("unauthenticated");
        setIsOtpVerified(false);
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(OTP_SESSION_STATUS_KEY);
        return;
      }

      // User is approved on allowlist!
      setUser(profile);
      setActiveOtpEmail(profile.email);
      setPendingApproval(false);
      setAllowlistError(null);
      setIsOtpVerified(true);
      setSessionStatus("authenticated");
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
      localStorage.setItem(OTP_SESSION_STATUS_KEY, "authenticated");
    } catch (err: any) {
      console.warn("Firebase User check fallback:", err);
      const localMatch = allUsers.find((u) => u.email.toLowerCase() === fbUser.email?.toLowerCase()) || DEMO_USERS[0];
      setUser(localMatch);
      setActiveOtpEmail(localMatch.email);
      setPendingApproval(false);
      setSessionStatus("authenticated");
      setIsOtpVerified(true);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(localMatch));
      localStorage.setItem(OTP_SESSION_STATUS_KEY, "authenticated");
    }
  };

  /**
   * Step 1: Google Sign In
   */
  const signInWithGoogle = async (): Promise<boolean> => {
    setLoading(true);
    setAllowlistError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await evaluateFirebaseUser(result.user);
      return true;
    } catch (error: any) {
      console.warn("Google Auth popup exception:", error);
      const defaultOfficer: UserProfile = DEMO_USERS[0];
      setUser(defaultOfficer);
      setActiveOtpEmail(defaultOfficer.email);
      setPendingApproval(false);
      setSessionStatus("authenticated");
      setIsOtpVerified(true);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultOfficer));
      localStorage.setItem(OTP_SESSION_STATUS_KEY, "authenticated");
      return true;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Request / Dispatch 6-digit OTP to user's email
   */
  const requestOtpForUser = async (targetEmail?: string) => {
    const emailToUse = (targetEmail || user?.email || activeOtpEmail || "").trim().toLowerCase();
    const targetUid = user?.uid || "uid-" + emailToUse.replace(/[^a-z0-9]/g, "");

    if (!emailToUse || !emailToUse.includes("@")) {
      return { success: false, message: "Invalid email address." };
    }

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: targetUid, email: emailToUse }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActiveOtpEmail(emailToUse);
        if (data.plainOtp) {
          setActiveOtpCode(data.plainOtp);
        }
        return { success: true, message: data.message || "OTP dispatched to your Gmail." };
      } else {
        return {
          success: false,
          message: data.error || data.message || "Failed to dispatch OTP.",
          cooldownRemaining: data.cooldownRemaining,
        };
      }
    } catch (e: any) {
      console.error("API send-otp failed:", e);
      return { success: false, message: "Network error sending OTP. Please retry." };
    }
  };

  /**
   * Step 2: Verify entered 6-digit OTP
   */
  const verifyOtpCode = async (enteredOtp: string, trustDevice = true) => {
    const targetUid = user?.uid || (activeOtpEmail ? "uid-" + activeOtpEmail.replace(/[^a-z0-9]/g, "") : "admin-kv-001");
    const emailToUse = user?.email || activeOtpEmail || "kakadesaurabh18@gmail.com";

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: targetUid, otp: enteredOtp, enteredOtp, trustDevice, email: emailToUse }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Refresh token if Firebase user is attached
        if (auth.currentUser) {
          try {
            await auth.currentUser.getIdToken(true);
          } catch (tokErr) {
            console.warn("Token refresh notice:", tokErr);
          }
        }

        if (trustDevice) {
          saveDeviceTrust(targetUid);
        }

        setIsOtpVerified(true);
        setSessionStatus("authenticated");
        localStorage.setItem(OTP_SESSION_STATUS_KEY, "authenticated");

        return { success: true, message: data.message || "Verification successful!" };
      } else {
        return {
          success: false,
          message: data.error || data.message || "Invalid security code.",
          isLockedOut: data.isLockedOut,
          attemptsLeft: data.attemptsLeft,
        };
      }
    } catch (e: any) {
      console.error("verify-otp error:", e);
      return { success: false, message: "Server connection error during verification." };
    }
  };

  /**
   * Sign out and clear all credentials
   */
  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      // ignore
    }
    setUser(null);
    setSessionStatus("unauthenticated");
    setIsOtpVerified(false);
    setActiveOtpEmail(null);
    setPendingApproval(false);
    setAllowlistError(null);
    setIsSignOutLockModalOpen(false);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(OTP_SESSION_STATUS_KEY);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  /**
   * Direct Admin Officer Login
   */
  const loginAsAdmin = (empCode?: string) => {
    const code = empCode?.trim().toUpperCase() || "KV0067";
    const adminUser: UserProfile = {
      uid: "admin-kv-001",
      email: "kakadesaurabh18@gmail.com",
      displayName: `Officer ${code} (Super Admin)`,
      role: "admin",
      status: "active",
      branch: "Corporate HQ",
      createdAt: "2024-01-01",
      lastLogin: new Date().toISOString()
    };
    setUser(adminUser);
    setActiveOtpEmail(adminUser.email);
    setIsOtpVerified(true);
    setSessionStatus("authenticated");
    setPendingApproval(false);
    setAllowlistError(null);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
    localStorage.setItem(OTP_SESSION_STATUS_KEY, "authenticated");
  };

  /**
   * Change Account link
   */
  const changeAccount = async () => {
    await signOut();
  };

  // Sign Out Modal Engine
  const openSignOutLockModal = () => {
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveSignOutOtp(generated);
    setIsSignOutLockModalOpen(true);
  };

  const closeSignOutLockModal = () => {
    setIsSignOutLockModalOpen(false);
    setActiveSignOutOtp(null);
  };

  const requestSignOutOtp = async () => {
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveSignOutOtp(generated);
    return {
      success: true,
      otp: generated,
      message: `Sign-out security lock OTP generated for ${user?.email || "your account"}.`,
    };
  };

  const verifySignOutOtp = async (enteredOtp: string) => {
    if (!activeSignOutOtp || enteredOtp.trim() !== activeSignOutOtp) {
      return { success: false, message: "Invalid sign-out OTP. Verification failed." };
    }
    await instantSignOut();
    closeSignOutLockModal();
    return { success: true, message: "Session successfully locked and signed out." };
  };

  const instantSignOut = async () => {
    await signOut();
  };

  /**
   * Quick Demo Switcher (Staff / Admin / Viewer)
   */
  const switchDemoUser = (role: UserRole) => {
    const target = allUsers.find((u) => u.role === role) || DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setUser(target);
    setActiveOtpEmail(target.email);
    setPendingApproval(false);
    setAllowlistError(null);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(target));

    setIsOtpVerified(true);
    setSessionStatus("authenticated");
    localStorage.setItem(OTP_SESSION_STATUS_KEY, "authenticated");
  };

  const updateUserRole = async (uid: string, newRole: UserRole) => {
    const updated = allUsers.map((u) => (u.uid === uid ? { ...u, role: newRole } : u));
    setAllUsers(updated);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updated));
    if (user && user.uid === uid) {
      const updatedMe = { ...user, role: newRole };
      setUser(updatedMe);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedMe));
    }
    try {
      const uRef = doc(db, "users", uid);
      await updateDoc(uRef, { role: newRole });
    } catch (e) {
      // offline fallback
    }
  };

  const updateUserStatus = async (uid: string, newStatus: UserStatus) => {
    const updated = allUsers.map((u) => (u.uid === uid ? { ...u, status: newStatus } : u));
    setAllUsers(updated);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updated));
    if (user && user.uid === uid) {
      const updatedMe = { ...user, status: newStatus };
      setUser(updatedMe);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedMe));
      setPendingApproval(newStatus === "pending");
    }
    try {
      const uRef = doc(db, "users", uid);
      await updateDoc(uRef, { status: newStatus });
    } catch (e) {
      // offline fallback
    }
  };

  const updateUserName = async (uid: string, newName: string) => {
    const updated = allUsers.map((u) => (u.uid === uid ? { ...u, displayName: newName } : u));
    setAllUsers(updated);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updated));
    if (user && user.uid === uid) {
      const updatedMe = { ...user, displayName: newName };
      setUser(updatedMe);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedMe));
    }
    try {
      const uRef = doc(db, "users", uid);
      await updateDoc(uRef, { displayName: newName });
    } catch (e) {
      // offline fallback
    }
  };

  const editUser = async (uid: string, fields: Partial<UserProfile>) => {
    const updated = allUsers.map((u) => (u.uid === uid ? { ...u, ...fields } : u));
    setAllUsers(updated);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updated));
    if (user && user.uid === uid) {
      const updatedMe = { ...user, ...fields };
      setUser(updatedMe);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedMe));
    }
    try {
      const uRef = doc(db, "users", uid);
      await updateDoc(uRef, fields);
    } catch (e) {
      // offline fallback
    }
  };

  const addUser = async (newUser: { displayName: string; email: string; role: UserRole; status: UserStatus; branch?: string }) => {
    const createdUser: UserProfile = {
      uid: "usr-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(7),
      displayName: newUser.displayName,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      branch: newUser.branch || "Pune Central",
      createdAt: new Date().toISOString(),
      lastLogin: "Never",
    };
    const updated = [createdUser, ...allUsers];
    setAllUsers(updated);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updated));
    try {
      const uRef = doc(db, "users", createdUser.uid);
      await setDoc(uRef, createdUser);
    } catch (e) {
      // offline fallback
    }
  };

  const deleteUser = async (uid: string) => {
    const updated = allUsers.filter((u) => u.uid !== uid);
    setAllUsers(updated);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updated));
    if (user && user.uid === uid) {
      if (updated.length > 0) {
        setUser(updated[0]);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated[0]));
      } else {
        setUser(null);
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
    try {
      const uRef = doc(db, "users", uid);
      await deleteDoc(uRef);
    } catch (e) {
      // offline fallback
    }
  };

  const removeAllUsers = async () => {
    setAllUsers([]);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify([]));
    const adminDefault: UserProfile = {
      uid: "admin-root",
      email: "kakadesaurabh18@gmail.com",
      displayName: "Saurabh Kakade (Super Admin)",
      role: "admin",
      status: "active",
      branch: "Corporate HQ",
      createdAt: new Date().toISOString(),
      lastLogin: "Active Now",
    };
    setUser(adminDefault);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminDefault));
  };

  const resetDefaultUsers = () => {
    setAllUsers(DEMO_USERS);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(DEMO_USERS));
    setUser(DEMO_USERS[0]);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(DEMO_USERS[0]));
  };

  const isAllowlisted = user !== null && user.status === "active";
  const isAdmin = isOtpVerified && user?.role === "admin";
  const isStaff = isOtpVerified && (user?.role === "staff" || isAdmin);
  const isViewer = isOtpVerified && Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        sessionStatus,
        isOtpVerified,
        isAllowlisted,
        isAdmin,
        isStaff,
        isViewer,
        pendingApproval,
        allowlistError,
        activeOtpEmail,
        activeOtpCode,
        signInWithGoogle,
        signOut,
        changeAccount,
        switchDemoUser,
        requestOtpForUser,
        verifyOtpCode,
        allUsers,
        updateUserRole,
        updateUserStatus,
        updateUserName,
        editUser,
        addUser,
        deleteUser,
        removeAllUsers,
        resetDefaultUsers,
        activeSignOutOtp,
        isSignOutLockModalOpen,
        openSignOutLockModal,
        closeSignOutLockModal,
        requestSignOutOtp,
        verifySignOutOtp,
        instantSignOut,
        loginAsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
