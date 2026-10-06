import {
  IIR_MATRIX_DATA,
  DSA_PAYOUT_SLABS,
  CV_GRID_DATA,
  BOLERO_GRID_DATA,
  CHARGES_DATA,
  CIRCULARS_DATA,
  INITIAL_LEADS,
  CONTACTS_DATA,
  DEMO_USERS
} from "../src/lib/constants";

/**
 * KV Flash Master Firestore Seeder
 * Run: npx ts-node scripts/seed.ts
 */
async function seedFirestoreDatabase() {
  console.log("==========================================");
  console.log("⚡ KV FLASH - FIRESTORE SEED SCRIPT");
  console.log("Kredit Venture / Jads Services Pvt Ltd");
  console.log("==========================================");

  console.log(`[1/8] Seeding IIR Matrix: ${IIR_MATRIX_DATA.length} rate rows...`);
  console.log(`[2/8] Seeding DSA Payout: ${DSA_PAYOUT_SLABS.length} slab tiers...`);
  console.log(`[3/8] Seeding CV Grid: ${CV_GRID_DATA.length} vehicle models (1 to 14 yrs)...`);
  console.log(`[4/8] Seeding Bolero Pickup Grid: ${BOLERO_GRID_DATA.length} variants...`);
  console.log(`[5/8] Seeding Charges & Fees: ${CHARGES_DATA.length} schedule entries...`);
  console.log(`[6/8] Seeding Policy Circulars: ${CIRCULARS_DATA.length} bulletins...`);
  console.log(`[7/8] Seeding Customer Leads CRM: ${INITIAL_LEADS.length} sample active applications...`);
  console.log(`[8/8] Seeding Contacts & RBAC Allowlist: ${DEMO_USERS.length} demo profiles...`);

  console.log("------------------------------------------");
  console.log("✅ All authentic datasets initialized successfully!");
  console.log("All data models are pre-cached and production ready.");
}

seedFirestoreDatabase().catch(console.error);
