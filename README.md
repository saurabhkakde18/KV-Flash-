# ⚡ KV Flash — Vehicle Finance Reference & Fast Calculator PWA

> **Internal Reference & Field Underwriting Intelligence Suite for Kredit Venture / Jads Services Pvt Ltd**  
> *"You're one step closer to what you want"*

KV Flash is a mobile-first Progressive Web App (PWA) designed for vehicle-finance field loan officers, channel partners (DSA), and credit underwriters across India.

---

## 🔐 Two-Step Authentication & Security Architecture

KV Flash implements a mandatory **Two-Step Authentication Flow**: Google (Gmail) Sign-In followed by cryptographic 6-digit OTP email verification. A user is granted access only after **BOTH** steps pass.

```
[User] ──▶ 1. Google (Gmail) Sign-In
             │
             ├──▶ Check Firestore Allowlist (`users/{uid}`)
             │      ├── Not Approved ──▶ Sign out & show "Access pending, contact admin"
             │      └── Approved ──────▶ Set session to `otp_pending` (NO data access)
             │
             └──▶ 2. Backend Generates Cryptographic 6-Digit OTP (`crypto.randomInt`)
                    │
                    ├── SHA-256 Salted Hash stored in `otp_requests/{uid}` (5-min expiry)
                    ├── Dispatched via Resend / SMTP to registered Gmail
                    └── User enters OTP on `/verify-otp` (6 PIN boxes, auto-focus, paste)
                          │
                          ├── Constant-time comparison & 5-attempt lockout (15 min)
                          └── On Success ──▶ Set custom claim `otpVerified: true` & open Dashboard
```

### Key Security Guardrails:
1. **Zero-Trust Firestore & Storage Rules**: All collection reads and writes strictly require `request.auth.token.otpVerified == true`. Google login alone grants zero access.
2. **Device Trust**: Optional "Trust this device for 30 days" generates a client/server hashed token. Untrusted devices or sessions older than 30 days require re-verification.
3. **Admin Actions Re-Auth**: Sensitive actions (data upload, user status modification) require fresh verification (< 24 hours).
4. **Immutable Audit Logging**: Every `otp_sent`, `otp_verified`, `otp_failed`, and `locked_out` event is recorded to `audit_logs` with timestamps, IP addresses, and user agents.

---

## 🚀 Setup & Deployment Guide

### 1. Enable Google Sign-In Provider in Firebase
1. Go to the [Firebase Console](https://console.firebase.google.com/) > **Authentication** > **Sign-in method**.
2. Click **Add new provider** > Select **Google**.
3. Enable the provider, select your project support email, and click **Save**.
4. In **Settings** > **Authorized domains**, ensure your production domain and `localhost` are listed.

### 2. Upgrade to Firebase Blaze Plan
- Firebase Cloud Functions require the **Blaze (Pay as you go)** plan to make outbound HTTP requests to external APIs (Resend, SendGrid, or SMTP).
- Firebase provides generous free tier allowances on the Blaze plan (2M invocations/month).

### 3. Verify Sending Domain on Resend
1. Sign up on [Resend.com](https://resend.com) and navigate to **Domains**.
2. Add your domain (e.g. `kreditventure.com`) and add the DNS records (DKIM, SPF) to your DNS registrar.
3. Create an API Key in Resend and copy it into `RESEND_API_KEY`.

### 4. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in the required values:
```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kv-flash-vehicle-finance.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kv-flash-vehicle-finance
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kv-flash-vehicle-finance.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# 2FA OTP & Email Configuration
RESEND_API_KEY=re_your_api_key
OTP_FROM_EMAIL=security@kreditventure.com
OTP_EXPIRY_MINUTES=5
OTP_MAX_ATTEMPTS=5
OTP_DEV_MODE=false
```

### 5. Deploy Firebase Cloud Functions & Security Rules
```bash
# Deploy Firestore & Storage Security Rules
firebase deploy --only firestore:rules,storage

# Deploy Cloud Functions
cd functions
npm install
npm run build
firebase deploy --only functions
```

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌟 Application Modules

1. **IIR Rate Matrix**: Complete interest rate schedule (Gross IRR vs WIRR) by vehicle segment, manufacturing year (2021–2025, 2016–2020, 2011–2015), tenure, and score band.
2. **DSA Payout Calculator & Tracker**: Channel commission slabs (< ₹20L & ≥ ₹20L), 5% TDS calculation (u/s 194H), monthly target progress, and compliance rules.
3. **Commercial Vehicle (CV) Policy**: Category A–F exposure caps (up to ₹100 Lakhs), Fast Track Tatkal rules, Sahaj low-CIBIL program, and branch approval authorities.
4. **Private Car Amended Credit Policy (Feb 2026)**: Salaried IP (FOIR 60%, min ₹20k salary, 90% LTV), Self-Employed NIP (₹8L cap), Repayment Surrogate, and Banking Surrogate.
5. **CV Grid (1 to 14 Years Old)**: Real valuation matrix for Ashok Leyland, Tata Motors, Eicher, Force Motors, and SML buses & trucks.
6. **Bolero Pickup Grid & Quick Check**: Dedicated valuation and LTV (up to 95%) matrix for Bolero Maxi Truck Plus, Pikup ExtraLong, ExtraStrong, and Camper.
7. **Schedule of Charges & Net Disbursement Estimator**: Processing fee, documentation, technical valuation, stamp duty (0.60%), CIBIL check, and upfront net in-hand loan estimator.
8. **EMI & Eligibility Calculator Suite**: Reducing balance EMI, interactive amortization chart, FOIR borrowing capacity, Flat-to-Reducing rate converter, and 1-tap WhatsApp quotes.
9. **Documents Checklist**: Interactive KYC, income, and vehicle checklist with WhatsApp sharing.
10. **Rate Updates / Circulars**: Timeline of official bulletins and rate revisions.
11. **Customer Leads (Field Mini-CRM)**: Field application pipeline tracker with stage updates, follow-up dates, and Excel export.
12. **Contacts Directory**: Escalation directory for Branch Managers, Credit Approvers (ACM/RCM/NCM), and Valuators.
13. **Universal Search (⌘K)**: Fuzzy search across all 12 modules, vehicle models, slabs, and policies.
14. **5 FinTech Themes**: Ivory Light, Midnight Dark, Emerald Premium, Graphite Mono, and Obsidian Gold.
15. **Admin Data Manager**: Inline table editing, spreadsheet import/export, and audit log viewer.
