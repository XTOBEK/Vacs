import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/utils";
import {
  auth,
  db,
  handleFirestoreError,
  OperationType,
} from "../../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  doc,
  updateDoc,
  setDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ShieldAlert,
  FileText,
  CreditCard,
  Edit,
  Package,
  GraduationCap,
  Download,
  Heart,
  Search,
  MoreVertical,
  Plus,
  Minus,
  Lock,
  ShieldCheck,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Radio,
  Sliders,
  Bell,
  Check,
  X,
  UserCheck,
} from "lucide-react";
import AppDownloadCenter from "../../components/dashboard/AppDownloadCenter";
import { logAudit } from "../../lib/audit";

export default function SuperAdminDashboard({ user, onLogout }: any) {
  const navigate = useNavigate();
  const location = useLocation();

  const isSuper = user?.email?.toLowerCase().trim() === "princewill.iwuoha@gmail.com" || user?.isSuper === true;

  // Silent Audit Trail for Super Admin Dashboard loaded
  useEffect(() => {
    if (user) {
      logAudit(
        user.email || "unknown_superadmin",
        "SESSION_INITIALIZED",
        "Sovereign Super Admin workstation dashboard session initialized.",
        "global"
      );
    }
  }, [user]);

  const menuItems = [
    { path: "/superadmin", label: "Overview", icon: LayoutDashboard },
    { path: "/superadmin/access", label: "Access Control", icon: Lock },
    { path: "/superadmin/cms", label: "Dynamic CMS", icon: Edit },
    { path: "/superadmin/audit", label: "Audit Logs", icon: FileText },
    { path: "/superadmin/downloads", label: "App Gateway", icon: Download },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout} menuItems={menuItems}>
      {!auth.currentUser && (
        <div className="bg-[#0B1D45] text-[#C5A069] p-4 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 border-b border-[#C5A069]/20">
          <ShieldAlert size={14} />
          <span>Working in Offline Mode: Please sign in to live sovereign credentials.</span>
          <Link
            to="/superadmin"
            className="bg-[#C5A069] text-[#0B1D45] px-4 py-1 rounded-full font-black text-[9px] hover:bg-[#B49158] transition-colors"
          >
            Sign In Now
          </Link>
        </div>
      )}

      <Routes>
        <Route index element={<SuperAdminOverview />} />
        <Route path="access" element={<AccessControlManager user={user} />} />
        <Route path="cms" element={<SuperAdminCMSManager user={user} />} />
        <Route path="audit" element={<SuperAdminAuditLogsViewer />} />
        <Route path="downloads" element={<AppDownloadCenter role="admin" />} />
        <Route
          path="*"
          element={
            <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              Sovereign Module Under Construction
            </div>
          }
        />
      </Routes>
    </DashboardLayout>
  );
}

/* ==========================================================================
   MODULE: SUPER ADMIN OVERVIEW (ANALYTICS)
   ========================================================================== */
function SuperAdminOverview() {
  const [metrics, setMetrics] = useState({
    activeStaffCount: 0,
    activeClientCount: 0,
    auditCount: 0,
    cmsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const clientsSnap = await getDocs(collection(db, "clients"));
        const audSnap = await getDocs(collection(db, "audit_logs"));
        const cmsSnap = await getDocs(collection(db, "cms"));

        setMetrics({
          activeStaffCount: usersSnap.size,
          activeClientCount: clientsSnap.size,
          auditCount: audSnap.size,
          cmsCount: cmsSnap.size
        });
      } catch (err) {
        console.error("Failed to load global workspace snapshots:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="p-20 text-center animate-pulse text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
        Syncing Global Clinical Matrix...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-10 selection:bg-blue-100 font-sans">
      <div>
        <h1 className="text-3xl font-black text-[#0B1D45] tracking-tighter uppercase italic">
          Sovereign Oversight Deck
        </h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
          Visiting Angels Caregivers Solutions • Global Clinical Controller
        </p>
      </div>

      {/* Grid boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          title="Total Registered Nodes"
          value={metrics.activeStaffCount}
          description="Verified Caregivers, RNs, and Admin staff"
          color="border-[#C5A069]"
          icon={<Users className="text-[#C5A069]" size={20} />}
        />
        <OverviewCard
          title="Direct Clients"
          value={metrics.activeClientCount}
          description="Managed healthcare service recipients"
          color="border-blue-600"
          icon={<Heart className="text-blue-600" size={20} />}
        />
        <OverviewCard
          title="Core Audit Logs"
          value={metrics.auditCount}
          description="Immutable clinical access data trails"
          color="border-emerald-600"
          icon={<ShieldCheck className="text-emerald-600" size={20} />}
        />
        <OverviewCard
          title="Dynamic CMS Modules"
          value={metrics.cmsCount || 5}
          description="Live fully-editable client landing portals"
          color="border-purple-600"
          icon={<Edit className="text-purple-600" size={20} />}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Radio size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#0B1D45] uppercase tracking-tight">
              Sovereign Clinical Directives
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Secured Root Authority Clearance Active
            </p>
          </div>
        </div>
        <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-3xl">
          Welcome to the elevated VACS Sovereign Admin Dashboard. Here you hold complete command over User Privilege Escalations and website content management. This system utilizes military-grade clinical audits; all promotions, updates, and adjustments are permanently recorded to ensure complete structural compliance and medical transparency.
        </p>
      </div>
    </div>
  );
}

function OverviewCard({ title, value, description, color, icon }: any) {
  return (
    <div className={cn("bg-white border-2 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between transition-all hover:translate-y-[-2px]", color)}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</span>
        {icon}
      </div>
      <div>
        <h4 className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums leading-none mb-2">{value}</h4>
        <p className="text-[9px] text-slate-500 font-semibold leading-relaxed uppercase tracking-wider">{description}</p>
      </div>
    </div>
  );
}

/* ==========================================================================
   MODULE: ACCESS CONTROL / ROLE ASSIGNMENT
   ========================================================================== */
function AccessControlManager({ user: superAdminUser }: any) {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Edit Form Fields
  const [targetRole, setTargetRole] = useState("CAREGIVER");
  const [targetBranch, setTargetBranch] = useState("lagos");
  const [targetStatus, setTargetStatus] = useState("active");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const uList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(uList);
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, "users");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSelectUser = (u: any) => {
    setSelectedUser(u);
    setTargetRole(u.role || "CAREGIVER");
    setTargetBranch(u.branchId || "lagos");
    setTargetStatus(u.status || "active");
    setSuccessMessage("");
  };

  const handleUpdatePrivilege = async () => {
    if (!selectedUser) return;
    setIsSaving(true);
    setSuccessMessage("");
    try {
      const userRef = doc(db, "users", selectedUser.id);
      
      const isSuperSet = targetRole === "SUPER_ADMIN";
      const finalRole = isSuperSet ? "ADMIN" : targetRole;

      const upData: any = {
        role: finalRole,
        isSuper: isSuperSet,
        branchId: targetBranch,
        status: targetStatus,
        verificationStatus: "VERIFIED",
      };

      await setDoc(userRef, upData, { merge: true });

      // Live Audit Logging
      await logAudit(
        superAdminUser?.email || "princewill.iwuoha@gmail.com",
        "PRIVILEGE_ESCALATION",
        `User ${selectedUser.email || selectedUser.id} privilege rearranged to role: ${targetRole}, branch: ${targetBranch.toUpperCase()}, status: ${targetStatus}.`,
        targetBranch
      );

      setSuccessMessage("Account security profile rebuilt successfully.");
      
      // Update local state copy to highlight
      setSelectedUser({
        ...selectedUser,
        ...upData,
        role: finalRole,
        isSuper: isSuperSet,
      });

    } catch (err: any) {
      alert("Failed to update user privilege: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const text = `${u.fullName || u.full_name || ""} ${u.email || ""} ${u.role || ""}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-6 md:p-10 space-y-10">
      <div>
        <h2 className="text-3xl font-black text-[#0B1D45] tracking-tighter uppercase italic">
          Sovereign Security Desk
        </h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
          Direct Privilege & Role Authorization Module
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* User list pane */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#0B1D45]">Search Registry</p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search candidates by name, email, or current credentials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-widest outline-none focus:border-[#C5A069] transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0B1D45]">Institutional Registrants</p>
              <span className="text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                {filteredUsers.length} Nodes Loaded
              </span>
            </div>

            {loading ? (
              <div className="p-20 text-center animate-pulse text-[10px] font-black uppercase tracking-widest text-slate-400">
                Interrogating Local Ledger...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                No matching accounts in registry
              </div>
            ) : (
              <div className="divide-y divide-slate-150">
                {filteredUsers.map((u) => {
                  const isUserSuper = u.isSuper || u.email?.toLowerCase().trim() === "princewill.iwuoha@gmail.com";
                  const displayRole = isUserSuper ? "SUPER_ADMIN" : u.role;
                  const isUserSelected = selectedUser?.id === u.id;

                  return (
                    <div
                      key={u.id}
                      onClick={() => handleSelectUser(u)}
                      className={cn(
                        "p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors",
                        isUserSelected ? "bg-[#C5A069]/5 border-l-4 border-l-[#C5A069]" : ""
                      )}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#0B1D45] text-[#C5A069] flex items-center justify-center font-bold text-xs uppercase">
                          {u.fullName?.[0] || u.full_name?.[0] || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900 truncate uppercase mt-0.5 tracking-tight leading-tight">
                            {u.fullName || u.full_name || "Institutional Registrant"}
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold truncate leading-none mt-1">
                            {u.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className={cn(
                          "px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full border",
                          u.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                        )}>
                          {u.status || "active"}
                        </span>
                        
                        <span className={cn(
                          "px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full border",
                          displayRole === "SUPER_ADMIN" ? "bg-rose-50 text-rose-600 border-rose-100" :
                          displayRole === "ADMIN" ? "bg-blue-50 text-blue-600 border-blue-100" :
                          displayRole === "RN" ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-slate-50 text-slate-600 border-slate-100"
                        )}>
                          {displayRole || "CAREGIVER"}
                        </span>

                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          Branch: {(u.branchId || "Lagos").toUpperCase()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Selected settings card */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm space-y-8 relative">
          {selectedUser ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-[#0B1D45] tracking-tight uppercase italic">
                  Credential Settings
                </h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                  Modify auth parameters for selected user
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-1.5 border border-slate-150">
                <p className="text-[10px] font-black text-[#0B1D45] uppercase tracking-wider truncate">
                  {selectedUser.fullName || selectedUser.full_name || "Profile Loaded"}
                </p>
                <p className="text-[9px] text-slate-400 font-semibold truncate select-all">
                  UID: {selectedUser.id}
                </p>
                <p className="text-[9px] text-slate-400 font-semibold truncate">
                  EMAIL: {selectedUser.email}
                </p>
              </div>

              {successMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle size={14} className="shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Form inputs */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#0B1D45] uppercase tracking-widest">Assign System Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest outline-none focus:border-[#C5A069]"
                  >
                    <option value="SUPER_ADMIN">SUPER ADMIN (SOVEREIGN GATE)</option>
                    <option value="ADMIN">BRANCH ADMIN (COORDINATOR)</option>
                    <option value="RN">RN (REGISTERED NURSE SUPERVISOR)</option>
                    <option value="CAREGIVER">HCA (HOME CARE AIDE / CAREGIVER)</option>
                    <option value="CLIENT">CLIENT (HEALTH SERVICE SPONSOR)</option>
                    <option value="PATIENT">PATIENT (RECIPIENT PORTAL)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#0B1D45] uppercase tracking-widest">System Branch Assignment</label>
                  <select
                    value={targetBranch}
                    onChange={(e) => setTargetBranch(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest outline-none focus:border-[#C5A069]"
                  >
                    <option value="lagos">LAGOS HEADQUARTERS</option>
                    <option value="owerri">OWERRI CLINIC REGION</option>
                    <option value="abuja">ABUJA EXECUTIVE BRANCH</option>
                    <option value="portharcourt">PORT HARCOURT ZONE</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#0B1D45] uppercase tracking-widest">Account Clearance State</label>
                  <select
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest outline-none focus:border-[#C5A069]"
                  >
                    <option value="active">ACTIVE / CLEARANCE VERIFIED</option>
                    <option value="locked_pending_review">LOCKED PENDING CLINICAL REVIEW</option>
                    <option value="permanently_terminated">PERMANENT DEACTIVATED SYSTEM NODE</option>
                  </select>
                </div>

                <Button
                  onClick={handleUpdatePrivilege}
                  disabled={isSaving}
                  className="w-full h-14 text-xs font-black uppercase tracking-[0.2em] rounded-full bg-[#0B1D45] text-white hover:bg-slate-850 mt-4 border-none"
                >
                  {isSaving ? "Locking Privilege Changes..." : "Rebuild Auth Profile"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto">
                <Sliders size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 italic leading-relaxed">
                Select a registrant node from the left card list to audit and alter keys
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   MODULE: DYNAMIC CMS WORKSTATION (THE 5 MODULES)
   ========================================================================== */
function SuperAdminCMSManager({ user }: any) {
  const [activeTab, setActiveTab] = useState("about");
  const [cmsData, setCmsData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Forms / state objects
  const [aboutForm, setAboutForm] = useState({
    hero_title: "",
    hero_subtitle: "",
    mission_statement: "",
    tagline: "",
    description: "",
    integrityText: ""
  });

  const [contactForm, setContactForm] = useState({
    phone: "",
    email: "",
    address: "",
    emergency: "",
    mapsUrl: ""
  });

  // Dynamic Lists Sub-states (CRUD lists)
  const [currentList, setCurrentList] = useState<any[]>([]);
  const [isEditingList, setIsEditingList] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form schemas for list items
  const [serviceItem, setServiceItem] = useState({ title: "", desc: "", icon: "Users", features: "" });
  const [faqItem, setFaqItem] = useState({ question: "", answer: "", category: "General", sort_order: 1 });
  const [planItem, setPlanItem] = useState({ name: "", price: "", period: "", desc: "", features: "", popular: false });

  // Load from collection "cms" in Firestore
  useEffect(() => {
    const q = query(collection(db, "cms"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: any = {};
      snapshot.docs.forEach((d) => {
        data[d.id] = d.data();
      });
      setCmsData(data);
      
      // Seed default forms based on activeTab
      if (data.about) {
        setAboutForm({
          hero_title: data.about.hero_title || data.about.title || "Pioneering Accountable Clinical Care.",
          hero_subtitle: data.about.hero_subtitle || data.about.tagline || "The VACS Protocol",
          mission_statement: data.about.mission_statement || data.about.description || "We bridge the gap between medical expertise and compassionate home support.",
          tagline: data.about.tagline || "",
          description: data.about.description || "",
          integrityText: data.about.integrityText || ""
        });
      }
      if (data.contact) {
        setContactForm({
          phone: data.contact.phone || "+234 (0) 803 123 4567",
          email: data.contact.email || "admissions@vacs-registry.io",
          address: data.contact.address || "Lekki Phase 1, Lagos, Nigeria",
          emergency: data.contact.emergency || "+234 (0) 900 VACS EMERGENCY",
          mapsUrl: data.contact.mapsUrl || ""
        });
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync list state with active Tab
  useEffect(() => {
    if (activeTab === "services") {
      setCurrentList(cmsData.services?.list || [
        { title: "Senior Companion Care", desc: "Clinical-grade companion care", icon: "Users", features: "Meal Preparation" }
      ]);
    } else if (activeTab === "faq") {
      setCurrentList(cmsData.faq?.list || [
        { question: "What is VACS?", answer: "Visiting Angels clinical non-medical agency.", category: "General", sort_order: 1 }
      ]);
    } else if (activeTab === "plans") {
      setCurrentList(cmsData.plans?.list || [
        { name: "Tier I: Essential", price: "₦1,600/hr", period: "hourly", desc: "Essential Companionship Plan", features: "ADL Care", popular: false }
      ]);
    }
    setIsEditingList(false);
    setEditingIndex(null);
  }, [activeTab, cmsData]);

  // General Settings save
  const handleSaveAboutOrContact = async (destDoc: string, payload: any) => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "cms", destDoc), payload, { merge: true });
      await logAudit(
        user?.email || "princewill.iwuoha@gmail.com",
        "CMS_UPDATE",
        `Rearranged website dynamic partition: ${destDoc.toUpperCase()}`,
        "global"
      );
      alert("Website system settings update transmitted securely.");
    } catch (err: any) {
      alert("Save failed: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // List updates
  const handleSaveListToFirestore = async (updatedList: any[]) => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "cms", activeTab), { list: updatedList }, { merge: true });
      await logAudit(
        user?.email || "princewill.iwuoha@gmail.com",
        "CMS_UPDATE",
        `Altered website lists for dynamic partition: ${activeTab.toUpperCase()}`,
        "global"
      );
    } catch (err: any) {
      alert("Failed to commit list array snapshot: " + err.message);
    } finally {
      setIsSaving(false);
      setIsEditingList(false);
      setEditingIndex(null);
    }
  };

  const handleTriggerAddListItem = () => {
    setEditingIndex(null);
    setServiceItem({ title: "", desc: "", icon: "Users", features: "" });
    setFaqItem({ question: "", answer: "", category: "General", sort_order: 1 });
    setPlanItem({ name: "", price: "", period: "", desc: "", features: "", popular: false });
    setIsEditingList(true);
  };

  const handleTriggerEditListItem = (index: number) => {
    const item = currentList[index];
    setEditingIndex(index);
    if (activeTab === "services") setServiceItem({ ...item });
    if (activeTab === "faq") setFaqItem({ ...item });
    if (activeTab === "plans") setPlanItem({ ...item });
    setIsEditingList(true);
  };

  const handleCommitFormToList = () => {
    let targetPayload: any;
    if (activeTab === "services") targetPayload = { ...serviceItem };
    if (activeTab === "faq") targetPayload = { ...faqItem };
    if (activeTab === "plans") targetPayload = { ...planItem };

    const newList = [...currentList];
    if (editingIndex !== null) {
      newList[editingIndex] = targetPayload;
    } else {
      newList.push(targetPayload);
    }
    setCurrentList(newList);
    handleSaveListToFirestore(newList);
  };

  const handleDeleteListItem = (index: number) => {
    if (window.confirm("Confirm deletion of this clinical module list node?")) {
      const newList = currentList.filter((_, idx) => idx !== index);
      setCurrentList(newList);
      handleSaveListToFirestore(newList);
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center animate-pulse text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
        Syncing Dynamic Website Partition...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-10 selection:bg-blue-100 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#0B1D45] tracking-tighter uppercase italic">
            Dynamic CMS Station
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
            Rebuild Web Copy and Care Profiles Without Technical Access
          </p>
        </div>

        {/* Dynamic CMS Tabs */}
        <div className="flex flex-wrap gap-2">
          {["about", "services", "faq", "plans", "contact"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
                activeTab === t
                  ? "bg-[#C5A069] border-[#C5A069] text-[#0B1D45] shadow-lg shadow-[#C5A069]/10"
                  : "bg-white text-slate-400 hover:text-[#0B1D45] border-slate-200"
              )}
            >
              {t.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
        {activeTab === "about" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-black text-[#0B1D45] uppercase tracking-tight">Modify About Information</h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Client Portal Overview Copy</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#0B1D45] uppercase tracking-widest">Hero display heading</label>
                <input
                  type="text"
                  value={aboutForm.hero_title}
                  onChange={(e) => setAboutForm({ ...aboutForm, hero_title: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#0B1D45] uppercase tracking-widest">Tagline Sub-header</label>
                <input
                  type="text"
                  value={aboutForm.hero_subtitle}
                  onChange={(e) => setAboutForm({ ...aboutForm, hero_subtitle: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#0B1D45] uppercase tracking-widest">Mission & Protocol Statement</label>
                <textarea
                  rows={4}
                  value={aboutForm.mission_statement}
                  onChange={(e) => setAboutForm({ ...aboutForm, mission_statement: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 leading-relaxed outline-none"
                />
              </div>

              <Button
                disabled={isSaving}
                onClick={() => handleSaveAboutOrContact("about", aboutForm)}
                className="rounded-full bg-[#0B1D45] text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 border-none mt-4"
              >
                {isSaving ? "Publishing dynamic node..." : "Transmit Dynamic Update"}
              </Button>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-black text-[#0B1D45] uppercase tracking-tight">Modify Contact Parameters</h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Hotlines and addresses synchronization</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#0B1D45] uppercase tracking-widest">Admissions Phone Line</label>
                <input
                  type="text"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#0B1D45] uppercase tracking-widest">Official Support Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#0B1D45] uppercase tracking-widest">Office Physical Address</label>
                <input
                  type="text"
                  value={contactForm.address}
                  onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#0B1D45] uppercase tracking-widest">Critical Emergency Hotline</label>
                <input
                  type="text"
                  value={contactForm.emergency}
                  onChange={(e) => setContactForm({ ...contactForm, emergency: e.target.value })}
                  className="w-full p-4 bg-slate-55 border border-red-200 text-red-700 font-black rounded-2xl text-xs tracking-widest"
                />
              </div>

              <Button
                disabled={isSaving}
                onClick={() => handleSaveAboutOrContact("contact", contactForm)}
                className="rounded-full bg-[#0B1D45] text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 border-none mt-4"
              >
                {isSaving ? "Locking changes..." : "Save Contact Info"}
              </Button>
            </div>
          </div>
        )}

        {(activeTab === "services" || activeTab === "faq" || activeTab === "plans") && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl">
              <div>
                <h3 className="text-base font-black text-[#0B1D45] uppercase tracking-tight">Active dynamic array list</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Manage clinical list elements in sequence</p>
              </div>
              {!isEditingList && (
                <Button
                  onClick={handleTriggerAddListItem}
                  className="rounded-full bg-[#0B1D45] text-white font-black uppercase tracking-widest text-[9px] h-11 px-6 border-none flex items-center gap-2"
                >
                  <Plus size={14} /> Add New Node Item
                </Button>
              )}
            </div>

            {isEditingList ? (
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-150 space-y-6 max-w-xl animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black text-[#0B1D45] uppercase tracking-widest">
                    {editingIndex !== null ? "Edit List Item" : "Create List Item"}
                  </span>
                  <button onClick={() => setIsEditingList(false)} className="text-slate-400 hover:text-slate-900">
                    <X size={18} />
                  </button>
                </div>

                {activeTab === "services" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                      <input
                        type="text"
                        value={serviceItem.title}
                        onChange={(e) => setServiceItem({ ...serviceItem, title: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                      <textarea
                        rows={3}
                        value={serviceItem.desc}
                        onChange={(e) => setServiceItem({ ...serviceItem, desc: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Features (comma separated)</label>
                      <input
                        type="text"
                        placeholder="Admissions assist, BP tracking, Medication reminding"
                        value={serviceItem.features}
                        onChange={(e) => setServiceItem({ ...serviceItem, features: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "faq" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Question</label>
                      <input
                        type="text"
                        value={faqItem.question}
                        onChange={(e) => setFaqItem({ ...faqItem, question: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Answer Text</label>
                      <textarea
                        rows={3}
                        value={faqItem.answer}
                        onChange={(e) => setFaqItem({ ...faqItem, answer: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                        <input
                          type="text"
                          value={faqItem.category}
                          onChange={(e) => setFaqItem({ ...faqItem, category: e.target.value })}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sorting Order</label>
                        <input
                          type="number"
                          value={faqItem.sort_order}
                          onChange={(e) => setFaqItem({ ...faqItem, sort_order: Number(e.target.value) })}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "plans" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Plan Name</label>
                      <input
                        type="text"
                        value={planItem.name}
                        onChange={(e) => setPlanItem({ ...planItem, name: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Price display</label>
                        <input
                          type="text"
                          value={planItem.price}
                          onChange={(e) => setPlanItem({ ...planItem, price: e.target.value })}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Session cycle (period)</label>
                        <input
                          type="text"
                          value={planItem.period}
                          onChange={(e) => setPlanItem({ ...planItem, period: e.target.value })}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                      <textarea
                        rows={2}
                        value={planItem.desc}
                        onChange={(e) => setPlanItem({ ...planItem, desc: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={handleCommitFormToList}
                    disabled={isSaving}
                    className="flex-1 rounded-xl bg-[#0B1D45] text-white font-black uppercase tracking-widest text-[9px] h-12"
                  >
                    Confirm & Publish Node
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditingList(false)}
                    className="rounded-xl border border-slate-250 text-slate-500 font-bold uppercase tracking-widest text-[9px] h-12 px-6"
                  >
                    Discard
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {currentList.map((item, index) => (
                  <div key={index} className="border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-500 transition-colors bg-white">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <span className="text-sm font-black text-[#0B1D45] uppercase tracking-tight italic">
                          {item.title || item.question || item.name}
                        </span>
                        
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => handleTriggerEditListItem(index)}
                            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#C5A069]"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteListItem(index)}
                            className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs font-medium text-slate-500 leading-relaxed mb-4">
                        {item.desc || item.answer}
                      </p>
                    </div>

                    {(item.price || item.category) && (
                      <div className="border-t border-slate-100 pt-4 mt-2 flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        <span>{item.category || "Plan Cost"}</span>
                        <span className="text-[#C5A069]">{item.price ? `${item.price} (${item.period})` : `Pos: ${item.sort_order}`}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   MODULE: AUDIT LOGS TRACE VIEWER
   ========================================================================== */
function SuperAdminAuditLogsViewer() {
  const [logs, setLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "audit_logs"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => {
          const raw = d.data();
          return {
            id: d.id,
            ...raw,
            // Format timestamp nicely
            timestampFormatted: raw.timestamp?.seconds
              ? new Date(raw.timestamp.seconds * 1000).toLocaleString()
              : "Live",
          };
        });
        
        // Sort descending by clock timestamp manually
        list.sort((a: any, b: any) => {
          const aS = a.timestamp?.seconds || 0;
          const bS = b.timestamp?.seconds || 0;
          return bS - aS;
        });

        setLogs(list);
        setLoading(false);
      },
      (err) => {
        console.error("Audit tracer log failed to hook stream:", err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredLogs = logs.filter((l) => {
    const text = `${l.admin || ""} ${l.action || ""} ${l.details || ""}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-6 md:p-10 space-y-10 selection:bg-blue-100 font-sans">
      <div>
        <h2 className="text-3xl font-black text-[#0B1D45] tracking-tighter uppercase italic">
          Clinical Ledger System
        </h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
          Immutable Multi-Branch Auditing of Core Database Transactions
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 border-b border-slate-150 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0B1D45]">Secure Auditing Stream</p>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search database trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold uppercase tracking-widest outline-none focus:border-[#C5A069]"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center animate-pulse text-[10px] font-black uppercase tracking-widest text-slate-400">
            Accessing trace log database...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-[#C5A069] italic bg-slate-50/5">
            Tracer logs empty
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[#0B1D45] text-[9px] font-black uppercase tracking-widest bg-slate-50">
                  <th className="p-5">Authorized Node</th>
                  <th className="p-5">Database Transaction</th>
                  <th className="p-5">Operation Specs</th>
                  <th className="p-5">System Region</th>
                  <th className="p-5">Clinical Clock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
                  const isPromotion = log.action === "PRIVILEGE_ESCALATION";
                  return (
                    <tr key={log.id} className="text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors">
                      <td className="p-5 font-bold uppercase tracking-tight text-slate-900">{log.admin}</td>
                      <td className="p-5">
                        <span className={cn(
                          "px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full border",
                          isPromotion ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-5 text-slate-600 leading-relaxed font-semibold pr-8">{log.details}</td>
                      <td className="p-5 font-bold uppercase tracking-wide text-slate-400 text-[10px]">{(log.branchId || "Global").toUpperCase()}</td>
                      <td className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-wider">{log.timestampFormatted}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
