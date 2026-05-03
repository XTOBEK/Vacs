import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB
  const db = new Database("vacs.db");
  db.pragma("journal_mode = WAL");

  // Create Tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT, -- 'ADMIN', 'RN', 'CAREGIVER', 'CLIENT'
      full_name TEXT,
      phone TEXT,
      address TEXT,
      tier TEXT, -- 'HCA_I', 'HCA_II', 'SCA'
      status TEXT, -- 'PENDING', 'ACTIVE', 'INACTIVE'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      onboarding_status TEXT, -- 'DISCOVERY', 'ASSESSMENT', 'INSPECTION', 'ACTIVE'
      billing_tier INTEGER, -- 1, 2, 3, 4
      wallet_balance REAL DEFAULT 0,
      is_hospitalized BOOLEAN DEFAULT 0,
      lga TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS assessments (
      id TEXT PRIMARY KEY,
      client_id TEXT,
      data TEXT, -- JSON assessment details
      inspection_date DATETIME,
      status TEXT, -- 'PENDING', 'COMPLETED'
      FOREIGN KEY(client_id) REFERENCES clients(id)
    );

    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      title TEXT,
      tier INTEGER,
      is_global BOOLEAN DEFAULT 0,
      is_downloadable BOOLEAN DEFAULT 0,
      unlocked_at DATETIME,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS shifts (
      id TEXT PRIMARY KEY,
      client_id TEXT,
      caregiver_id TEXT,
      start_time DATETIME,
      end_time DATETIME,
      status TEXT, -- 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
      tier_requirement INTEGER,
      lga TEXT,
      check_in_time DATETIME,
      check_out_time DATETIME,
      check_in_gps TEXT,
      check_out_gps TEXT,
      FOREIGN KEY(client_id) REFERENCES clients(id),
      FOREIGN KEY(caregiver_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS daily_care_logs (
      id TEXT PRIMARY KEY,
      shift_id TEXT,
      caregiver_id TEXT,
      client_id TEXT,
      vitals TEXT, -- JSON { bp, hr, temp, o2, blood_sugar, pain }
      activities TEXT, -- JSON Array of activity IDs
      notes TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(shift_id) REFERENCES shifts(id)
    );

    CREATE TABLE IF NOT EXISTS clinical_alerts (
      id TEXT PRIMARY KEY,
      client_id TEXT,
      log_id TEXT,
      severity TEXT, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
      message TEXT,
      status TEXT, -- 'UNREAD', 'ACKNOWLEDGED', 'RESOLVED'
      acknowledged_by TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(client_id) REFERENCES clients(id)
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      client_id TEXT,
      amount REAL,
      status TEXT, -- 'PENDING', 'PAID'
      period_start DATETIME,
      period_end DATETIME,
      items TEXT, -- JSON breakdown
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cms_content (
      key TEXT PRIMARY KEY,
      value TEXT -- JSON content
    );

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      name TEXT,
      total_count INTEGER,
      assigned_to TEXT, -- user_id if specific
      condition TEXT,
      status TEXT -- 'AVAILABLE', 'ASSIGNED', 'DAMAGED'
    );
     
    CREATE TABLE IF NOT EXISTS referrals (
       id TEXT PRIMARY KEY,
       referrer_id TEXT,
       code TEXT UNIQUE,
       leads_count INTEGER DEFAULT 0,
       commissions_total REAL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS training_modules (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      tier_required INTEGER,
      content TEXT, -- JSON lessons/quizzes
      prerequisite_id TEXT
    );

    CREATE TABLE IF NOT EXISTS user_training_progress (
      user_id TEXT,
      module_id TEXT,
      status TEXT, -- 'STARTED', 'COMPLETED'
      score INTEGER,
      PRIMARY KEY(user_id, module_id)
    );
  `);

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Auth (Mock)
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (user) {
      // In real app, check password hash. For now, mock it.
      res.json(user);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // CMS Endpoints
  app.get("/api/cms/:key", (req, res) => {
    const row = db.prepare("SELECT value FROM cms_content WHERE key = ?").get(req.params.key) as { value: string } | undefined;
    res.json(row ? JSON.parse(row.value) : null);
  });

  app.post("/api/cms/:key", (req, res) => {
    const { value } = req.body;
    db.prepare("INSERT OR REPLACE INTO cms_content (key, value) VALUES (?, ?)")
      .run(req.params.key, JSON.stringify(value));
    res.json({ success: true });
  });

  // Shifts Tier Blocking
  app.get("/api/training/eligibility/:userId/:tier", (req, res) => {
    const { userId, tier } = req.params;
    const tierLevel = parseInt(tier);
    
    // Check if user has required training
    const progress = db.prepare("SELECT * FROM user_training_progress WHERE user_id = ? AND status = 'COMPLETED'").all(userId);
    // Mock logic: to accept tier 3 shifts, need at least 2 completed modules
    if (tierLevel >= 3 && progress.length < 2) {
      return res.json({ eligible: false, reason: "Incomplete Specialized Training" });
    }
    res.json({ eligible: true });
  });

  // Client Onboarding Process (Route A)
  app.post("/api/clients/register", (req, res) => {
    const { email, password, full_name, lga } = req.body;
    const id = `cli-${Date.now()}`;
    const userId = `uid-${Date.now()}`;
    
    db.transaction(() => {
      db.prepare("INSERT INTO users (id, email, password, role, full_name, status) VALUES (?, ?, ?, 'CLIENT', ?, 'PENDING')")
        .run(userId, email, password, full_name);
      db.prepare("INSERT INTO clients (id, user_id, onboarding_status, lga) VALUES (?, ?, 'DISCOVERY', ?)")
        .run(id, userId, lga);
    })();
    
    res.json({ success: true, userId });
  });

  // Caregiver KYC
  app.post("/api/caregivers/kyc", (req, res) => {
    // Implement logic for Route C
    res.json({ success: true });
  });

  // Shifts
  app.get("/api/shifts", (req, res) => {
    const shifts = db.prepare("SELECT * FROM shifts").all();
    res.json(shifts);
  });

  // Clinical alerts
  app.get("/api/alerts", (req, res) => {
    const alerts = db.prepare("SELECT * FROM clinical_alerts ORDER BY timestamp DESC").all();
    res.json(alerts);
  });

  // Seed Data if empty
  const userCountRow = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  const userCount = userCountRow.count;
  if (userCount === 0) {
    db.prepare(`INSERT INTO users (id, email, password, role, full_name, status) VALUES 
      ('admin-1', 'admin@visitingangels.ca', 'password', 'ADMIN', 'Super Admin', 'ACTIVE'),
      ('rn-1', 'rn.sarah@visitingangels.ca', 'password', 'RN', 'Sarah RN', 'ACTIVE'),
      ('caregiver-1', 'emma.wilson@visitingangels.ca', 'password', 'CAREGIVER', 'Emma Wilson', 'ACTIVE'),
      ('client-1', 'jennifer.miller@email.com', 'password', 'CLIENT', 'Jennifer Miller', 'ACTIVE')
    `).run();
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
