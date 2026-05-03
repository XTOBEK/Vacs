import { seedDatabase } from "../src/lib/seed";
seedDatabase().then(() => process.exit(0));
