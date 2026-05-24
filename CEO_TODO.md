# VACS CEO Strategic Roadmap & Operational Priorities
## Executive Lead: Princewill Iwuoha (CEO)

This directive outlines the critical path for the VACS deployment transition to live clinical operations at the custom domain `visitingangels.com.ng`.

### 1. Active Priority Issues Check (Domain & Credentials)
- [x] **Vercel Custom Domain Mapping:** 
    - Connected Vercel hosting via GitHub pipeline to serve the production portal on `https://visitingangels.com.ng`.
- [x] **Secure Environment Secrets (.env):** 
    - Consolidated all private Firebase credentials, Gemini AI keys, and development variables into `/src/lib/firebase.ts` and `.env.example`.
- [ ] **Declare Environment Variables in Vercel:**
    - *Action Required:* Access the Vercel Dashboard -> Project Settings -> Environment Variables. Add the Firebase config values with the `VITE_` prefix (`VITE_FIREBASE_API_KEY`, etc.) so the live site operates online successfully.
- [ ] **Gemini Core Secrets Configuration:**
    - Ensure your live Vercel deploy has `GEMINI_API_KEY` registered safely to power maps grounding and clinical SOP automation.

### 2. Clinical Operations & QA Testing (VACS Ledger validation)
- [ ] **Caregiver Portal Audit:**
    - Log into the Caregiver Dashboard. Verify schedule visibility and shift logging accuracy.
    - Confirm "Protocol Warning Ledger" appears correctly if a strike is manually added by Admin.
- [ ] **Patient & Family Experience Audit:**
    - Log into the Patient/Family Dashboard. Verify care plan visibility and caregiver assignment nodes.
    - Confirm "VACS Service & Privacy Guarantee" is prominently displayed.
- [ ] **Clinical Oversight Audit (RN):**
    - Log into the RN Supervisor Dashboard. Verify "Compliance Watchlist" accurately pulls caregivers with active strikes.
    - Test the "Protocol Review" button flow.
- [ ] **Standard Admin Dispatch Audit:**
    - Log into the Standard Admin Dashboard. Verify patient overview and caregiver dispatching UI.
    - Test "System-Wide Compliance Oversight" table functionality (Add/Remove strikes).

### 3. Long-Term Roadmaps
- [x] Implement actual scheduling logistics node (Internal Dispatch).
- [x] Populate "Internal Academy" (LMS) with Rule 1-3 training materials.
- [ ] **Red Team Security Rules Audit:** Run a penetrative check on the current `firestore.rules` setup.
- [x] **Full Mobile Responsiveness Validation.**
