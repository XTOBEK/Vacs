# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-05-03

### Changed
- Added responsive design breakpoints to dashboard layouts.
- Implemented minimizable sidebar for improved screen real estate on smaller devices.
- Refined mobile navigation with hamburger menu accessibility.
- Integrated `react-markdown` for content rendering.
- Strengthened Firestore security rules.

### Added
- Created `CHANGELOG.md`.
- Updated `README.md` with environment configuration guidelines.

## [0.2.0] - 2026-05-04

### Changed
- **Unified Identity System:** Consolidated "Super Admin" and "Admin" roles into a single secure SSO flow.
- **Role Promotion:** Added auto-promotion for master account to ensure constant administrative access.
- **Security Hardening:** Implemented comprehensive `handleFirestoreError` tracking to diagnose permission issues in real-time.
- **Firestore Rules:** Updated rules to allow master email access to own user profile regardless of relational mapping and added missing permissions for the `notifications` collection.
- **Branding:** Updated Dashboard and Main layouts to dynamically reflect "Super Admin" status for the master user.
- **Dynamic Content:** Migrated Landing, About, and Services pages to live Firestore data via the CMS Manager.
- **Live Monitoring:** Connected the Active Incident Map and Live Feedback widgets to a real-time Firestore notification stream.

### Removed
- Legacy `/superadmin` route and local-storage based authentication to prevent "split-brain" session state.

### Current Status
- Master access is fully restored and integrated into the unified VACS Control Gate.
- Next phase focuses on connecting the Dynamic CMS to live public pages.
