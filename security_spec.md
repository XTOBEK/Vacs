# Security Specification - VACS

## 1. Data Invariants
1. **User Identity:** Users are either ADMIN, RN, CAREGIVER, or CLIENT. UIDs must match Firebase Auth UIDs.
2. **Clinical Records:** DailyCareLog entries can only be created by the CAREGIVER assigned to the shift or the CLIENT, and must link to a valid SHIFT document owned by them.
3. **Financial Isolation:** Wallet information in `/users/{userId}/wallet/main` is restricted to the owner and Admins.
4. **Exam Security:** ExamDefinitions can only be created/updated by ADMINs. Assessments must be created by the student and can only be updated by the system/admin (grading).
5. **Role Restrictions:** RNs have restricted write access to training/assessment entities, no access to financial entities (`/users/{userId}/wallet/main`).

## 2. The "Dirty Dozen" Payloads (Examples of violations)
1. User attempts to create a Wallet document for another UID.
2. Caregiver attempts to update the `kitVerified` status on their own profile.
3. Client attempts to write a DailyCareLog entry for a shift they aren't part of.
4. Anonymous user attempts an unauthenticated read of `/settings/global`.
5. User attempts to update `role` to 'ADMIN' on their own profile.
6. User attempts to inject a 2KB string as `fullName`.
7. Caregiver attempts to update `status` on their profile.
8. Caregiver attempts to write a DailyCareLog with a `timestamp` in the future.
9. ExamAssessment created with `score` set by the client.
10. Assessment created with a non-existent `examId`.
11. RN attempts to access `/users/{userId}/wallet/main`.
12. User attempts to delete a Shift document.

## 3. Test Runner (Conceptual `firestore.rules.test.ts`)
```typescript
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';

// ... (Test setup omitted for brevity in design doc) ...

describe('VACS Ruleset', () => {
  // Test case for each of the Dirty Dozen
  it('should deny unauthorized wallet write', async () => {});
  it('should allow owner to read their wallet', async () => {});
  // ...
});
```
