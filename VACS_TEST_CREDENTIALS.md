# VACS Test Credentials Ledger
## Role-Based Access Control (RBAC) Validation

This ledger provides standardized credentials for testing the VACS clinical oversight dashboards. 
**Password for all accounts:** `Vacstest2026!`

### Test Accounts Cluster

| Role | Test Email | Assigned Dashboard Route | Oversight Level |
| :--- | :--- | :--- | :--- |
| **Caregiver** | `caregiver@vacs.test` | `/dashboard` | Field Staff Protocol |
| **Specialized RN** | `rn@vacs.test` | `/rn` | Clinical Supervisor |
| **Patient / Client** | `client@vacs.test` | `/client` | Consumer Guarantee |
| **Family Member** | `family@vacs.test` | `/client` | Linked Care Tracking |
| **Admin Coordinator**| `coordinator@vacs.test` | `/vacs-control-gate` | Standard Admin |

---
### QA Testing Instructions

1. **Caregiver Login:** Verify active Protocol Warning Ledger appears if `compliance_strikes` > 0.
2. **RN Login:** Verify the "Compliance Watchlist" widget identifies regional staff with strikes.
3. **Admin Login:** Access the "System-Wide Compliance Oversight" to manage protocol deviations.
4. **Client Login:** Confirm the "VACS Service & Privacy Guarantee" replaces technical protocol warnings.

> [!CAUTION]
> These accounts are for internal QA validation only. Real production data must never be stored in test nodes.
