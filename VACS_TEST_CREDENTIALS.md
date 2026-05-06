# VACS Test Credentials Ledger
## Role-Based Access Control (RBAC) Validation

This ledger provides standardized credentials for testing the VACS clinical oversight dashboards. 
**Password for all accounts:** `Vacstest2026!`

### Test Accounts Cluster (v0.3.0)

| Role | Test Email | Assigned Dashboard Route | Oversight Level |
| :--- | :--- | :--- | :--- |
| **Caregiver** | `caregiver@vacs.test` | `/dashboard` | Field Staff Protocol |
| **Specialized RN** | `rn@vacs.test` | `/rn` | Clinical Supervisor |
| **Patient / Client** | `client@vacs.test` | `/client` | Consumer Guarantee |
| **Family Member** | `family@vacs.test` | `/client` | Linked Care Tracking |
| **Admin Coordinator**| `coordinator@vacs.test` | `/vacs-control-gate` | Standard Admin |

---
### QA Testing Instructions (v0.3.0)

1.  **Scheduling Node**: Log in as **Coordinator**, navigate to `Scheduling`, and create a shift. Ensure double-booking triggers the protocol error.
2.  **Internal Academy**: Log in as **Caregiver**, navigate to `Academy`. Watch a module and complete the assessment to check verification logic.
3.  **Financials**: Log in as **Coordinator**, navigate to `Finances`. Test the settlement rerouting for invoices.
4.  **Mobile Navigation**: Use a mobile viewport (simulating Nubia Neo 2 5G) to verify the new bottom navigation bar accessibility.
5.  **Security Audit**: Verify that a Caregiver cannot access the `Finances` node or other patients' logs via direct URL manipulation.

> [!CAUTION]
> These accounts are for internal QA validation only. Real production data must never be stored in test nodes.
