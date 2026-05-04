# Visiting Angels Caregivers Solutions (VACS)

## Architecture & Services
- **Auth/Database**: Firebase (Google Authentication, Cloud Firestore)
- **Frontend**: React 18, Vite, Tailwind CSS
- **Styling**: Tailwind CSS
- **Media/Assets**: Managed via cloud storage and secure frontend delivery.

## Access Links
- Development URL: [https://ais-dev-agnsikcsp4hwr76hirmhn4-832386282005.europe-west2.run.app](https://ais-dev-agnsikcsp4hwr76hirmhn4-832386282005.europe-west2.run.app)
- Shared App URL: [https://ais-pre-agnsikcsp4hwr76hirmhn4-832386282005.europe-west2.run.app](https://ais-pre-agnsikcsp4hwr76hirmhn4-832386282005.europe-west2.run.app)

## Credentials & Access
### Super Admin
- URL: `/superadmin`
- Username: `superadmin`
- Password: `Mastersafe@2026`

## Environment Setup
Ensure the following variables are set in your `.env` or provided upon deployment:
- `VITE_FIREBASE_API_KEY`: Required for Firebase initialization.
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase auth domain.
- `VITE_FIREBASE_PROJECT_ID`: Firebase project identifier.
- `VITE_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket.
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID.
- `VITE_FIREBASE_APP_ID`: Firebase app identifier.
- `VITE_FIREBASE_DATABASE_ID`: Firestore database identifier.
