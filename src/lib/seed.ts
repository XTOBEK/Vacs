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

        console.log("Database seeded successfully");
        return true;
    } catch (error) {
        console.error("Seeding failed", error);
        return false;
    }
}
