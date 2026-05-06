import { db } from './firebase';
import { doc, setDoc, collection } from 'firebase/firestore';

export async function seedDatabase() {
    try {
        // Seed CMS
        await setDoc(doc(db, "cms", "branding"), {
            name: "VACS Clinical Home Care",
            tagline: "Safe. Dignified. Accountable.",
            primaryColor: "#2563eb",
            secondaryColor: "#0f172a"
        });

        await setDoc(doc(db, "cms", "contact"), {
            phone: "+234 800 VACS CARE",
            email: "ops@vacscare.com",
            address: "Lagos Mainland East, Lagos State",
            emergency: "+234 900 EMERGENCY"
        });

        // Seed Clients
        const clients = [
            { id: "VAC-CL-101", fullName: "Chief Olumide", tier: "Tier 4 (Palliative)", status: "HOSPITALIZED", health: 15 },
            { id: "VAC-CL-112", fullName: "Mrs. Adebayo", tier: "Tier 3 (Cognitive)", status: "ACTIVE", health: 85 },
            { id: "VAC-CL-205", fullName: "Dr. Ibrahim", tier: "Tier 2 (Physical)", status: "ACTIVE", health: 92 }
        ];

        for (const c of clients) {
            await setDoc(doc(db, "clients", c.id), c);
        }

        // Seed Test Users (RBAC Validation)
        const testUsers = [
            {
                uid: "test-caregiver-001",
                email: "caregiver@vacs.test",
                fullName: "Standard Caregiver (Test)",
                role: "CAREGIVER",
                status: "active",
                shiftStatus: "IDLE",
                verificationStatus: "VERIFIED",
                compliance_strikes: 0
            },
            {
                uid: "test-rn-001",
                email: "rn@vacs.test",
                fullName: "Specialized RN (Test)",
                role: "RN",
                status: "active",
                licenseNumber: "RN-TEST-2026",
                verificationStatus: "VERIFIED"
            },
            {
                uid: "test-client-001",
                email: "client@vacs.test",
                fullName: "Patient Olumide (Test)",
                role: "CLIENT",
                status: "active",
                verificationStatus: "VERIFIED"
            },
            {
                uid: "test-family-001",
                email: "family@vacs.test",
                fullName: "Family Member (Test)",
                role: "CLIENT", // Shared dashboard pattern or specialized
                status: "active",
                patientId: "VAC-CL-101"
            },
            {
                uid: "test-coordinator-001",
                email: "coordinator@vacs.test",
                fullName: "Admin Coordinator (Test)",
                role: "ADMIN",
                status: "active",
                verificationStatus: "VERIFIED"
            }
        ];

        for (const user of testUsers) {
            await setDoc(doc(db, "users", user.uid), user);
        }

        console.log("Database seeded successfully with RBAC test nodes");
        return true;
    } catch (error) {
        console.error("Seeding failed", error);
        return false;
    }
}
