import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export interface AuditLog {
  admin: string;
  action: string;
  details: string;
  branchId: string;
  timestamp: any;
}

export async function logAudit(adminEmail: string, action: string, details: string, branchId: string) {
  try {
    await addDoc(collection(db, "audit_logs"), {
      admin: adminEmail,
      action: action,
      details: details,
      branchId: branchId || "global",
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("Fatal: Non-modifiable audit log failed to commit:", err);
  }
}
