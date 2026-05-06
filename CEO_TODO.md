# VACS CEO Strategic Roadmap
## Executive Lead: Andrew

This directive outlines the critical path for the VACS Dashboard transition from development to live clinical operations.

### Dashboard QA Testing (Priority High)
Use the [VACS_TEST_CREDENTIALS.md](./VACS_TEST_CREDENTIALS.md) ledger to perform the following validations:

- [ ] **Caregiver Portal Audit:**
    - Log into the Caregiver Dashboard.
    - Verify schedule visibility and shift logging accuracy.
    - Confirm "Protocol Warning Ledger" appears correctly if a strike is manually added by Admin.

- [ ] **Patient & Family Experience Audit:**
    - Log into the Patient/Family Dashboard.
    - Verify care plan visibility and caregiver assignment nodes.
    - Confirm "VACS Service & Privacy Guarantee" is prominently displayed.

- [ ] **Clinical Oversight Audit (RN):**
    - Log into the RN Supervisor Dashboard.
    - Verify "Compliance Watchlist" accurately pulls caregivers with active strikes.
    - Test the "Protocol Review" button flow.

- [ ] **Standard Admin Dispatch Audit:**
    - Log into the Standard Admin Dashboard.
    - Verify patient overview and caregiver dispatching UI.
    - Test "System-Wide Compliance Oversight" table functionality (Add/Remove strikes).

- [ ] **Final Approval:** Approve the UI/UX flow and visibility logic for all non-Superadmin roles.

---
### Operational Directives
- [x] Implement actual scheduling logistics node (Internal Dispatch).
- [x] Populate "Internal Academy" (LMS) with Rule 1-3 training materials.
- [x] Connect Finance & Payments to live transaction gateway.
- [x] Full Mobile Responsiveness sign-off.
