import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/utils";
import { auth, db, handleFirestoreError, OperationType } from "../../lib/firebase";
import { collection, onSnapshot, query, doc, updateDoc, addDoc, getDoc } from "firebase/firestore";
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
  MoreVertical
} from "lucide-react";
import AppDownloadCenter from "../../components/dashboard/AppDownloadCenter";
import { CaregiverAssignment } from "../../components/CaregiverAssignment";
import { TemplateEditor } from "../../components/admin/TemplateEditor";
import { seedDatabase } from "../../lib/seed";

const ClinicalLoginRequired = ({ title, description, icon: Icon }: any) => (
  <div className="flex flex-col items-center justify-center p-20 text-center space-y-6">
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
        <Icon size={32} />
    </div>
    <div>
      <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">{title}</h3>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 max-w-xs mx-auto leading-relaxed">
        {description}
      </p>
    </div>
    <Link to="/vacs-control-gate/login">
       <Button className="rounded-full bg-[#0B1D45] text-white border-none px-8 font-black uppercase tracking-widest text-[10px] h-12">Link Clinical Identity</Button>
    </Link>
  </div>
);

export default function AdminDashboard({ user, onLogout }: any) {
  const menuItems = [
    { path: "/vacs-control-gate", label: "Overview", icon: LayoutDashboard },
    { path: "/vacs-control-gate/downloads", label: "App Gateway", icon: Download },
    { path: "/vacs-control-gate/staff", label: "Staff Management", icon: Users },
    { path: "/vacs-control-gate/clients", label: "Clients", icon: ShieldAlert },
    { path: "/vacs-control-gate/scheduling", label: "Scheduling", icon: Calendar },
    { path: "/vacs-control-gate/finances", label: "Financial Control", icon: CreditCard },
    { path: "/vacs-control-gate/lms", label: "Internal Academy", icon: GraduationCap },
    { path: "/vacs-control-gate/inventory", label: "Assets & Kits", icon: Package },
    { path: "/vacs-control-gate/cms", label: "Dynamic CMS", icon: Edit },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout} menuItems={menuItems}>
      {!auth.currentUser && (
        <div className="bg-amber-500 text-white p-3 text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 animate-in fade-in slide-in-from-top duration-500">
           <ShieldAlert size={14} />
           <span>Simulation Mode Active: Live Firestore node requires Clinical Identity Link</span>
           <Link to="/vacs-control-gate/login" className="bg-white text-amber-600 px-4 py-1 rounded-full hover:bg-white/90 transition-colors">Link Clinical ID</Link>
        </div>
      )}
      <Routes>
        <Route index element={<AdminOverview user={user} />} />
        <Route path="downloads" element={<AppDownloadCenter role="admin" />} />
        <Route path="cms" element={<CMSManager user={user} />} />
        <Route path="staff" element={<StaffManager user={user} />} />
        <Route path="clients" element={<ClientManager user={user} />} />
        <Route path="lms" element={<AcademyManager user={user} />} />
        <Route path="inventory" element={<InventoryManager user={user} />} />
        <Route path="scheduling" element={<div className="p-12 text-center text-gray-400">Shift Logistics Control</div>} />
        <Route path="finances" element={<FinancialManager />} />
        <Route path="*" element={<div className="p-12 text-center text-gray-400">Section Under Construction</div>} />
      </Routes>
    </DashboardLayout>
  );
}

const AdminOverview = ({ user }: any) => {
  const [staff, setStaff] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (!user) {
    return <ClinicalLoginRequired title="Overview Node Locked" description="An active clinical session is mandatory to access institutional metrics." icon={ShieldAlert} />;
  }

  useEffect(() => {
    // If not authenticated, we'll just use empty lists or mock data from seed if needed
    if (!user) {
      setLoading(false);
      return;
    }
    
    console.log("Current user details:", user);
    getDoc(doc(db, "users", user.uid)).then(doc => console.log("Firestore user data:", doc.data()));

    let unsubStaff = () => {};
    let unsubClients = () => {};

    unsubStaff = onSnapshot(collection(db, "users"), (snapshot) => {
      setStaff(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      console.warn("Firestore access restricted:", error.message);
    });
    unsubClients = onSnapshot(collection(db, "clients"), (snapshot) => {
      setClients(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (error) => {
      console.warn("Firestore access restricted:", error.message);
      setLoading(false);
    });
    return () => {
      unsubStaff();
      unsubClients();
    };
  }, [user]);

  const totalRevenue = clients.length > 0 ? clients.length * 150000 : 250000000; 
   const pendingKitVerifications = staff.length > 0 ? staff.filter(s => s.kitStatus !== 'VERIFIED').length : 12;
 

   return (
     <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <StatCard title="Node Liquidity" value={`₦${(totalRevenue/1000000).toFixed(1)}M`} trend="+12.4%" />
           <StatCard title="Field Agents" value={staff.length > 0 ? staff.length : "480"} trend="Active" />
           <StatCard title="Client Nodes" value={clients.length > 0 ? clients.length : "1,240"} trend="+5" />
           <StatCard title="Critical Audits" value={pendingKitVerifications} trend="Priority" isCritical />
        </div>

        <div className="grid md:grid-cols-2 gap-10">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Clinical Traffic Telemetry</h4>
              <div className="h-64 flex items-end gap-3 px-4">
                 {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-600 rounded-t-lg transition-all hover:bg-[#C5A069]" style={{ height: `${h}%` }}></div>
                 ))}
              </div>
              <div className="flex justify-between mt-6 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                 <span>Jan</span>
                 <span>Dec</span>
              </div>
           </div>
           <div className="bg-[#0B1D45] p-10 rounded-[3rem] text-white">
              <div className="flex items-center justify-between mb-8">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Incident Map</h4>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-red-400">Live Feedback</span>
                 </div>
              </div>
              <div className="space-y-6">
                 {[
                   { user: "RN Adeoye", msg: "DVP entry mismatch at Node #492", time: "2m ago" },
                   { user: "Agency Hub", msg: "Billing cycle 04 initialized", time: "15m ago" },
                   { user: "System", msg: "LMS certificates issued (12)", time: "45m ago" }
                 ].map((log, i) => (
                    <div key={i} className="flex gap-4 items-start p-4 hover:bg-white/5 rounded-2xl transition-colors">
                       <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black uppercase tracking-tighter italic shrink-0">{log.user[0]}</div>
                       <div>
                          <p className="text-xs font-medium text-slate-300">{log.msg}</p>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{log.time}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
     </div>
   );
}

function CMSManager({ user }: any) {
  if (!user) {
    return <ClinicalLoginRequired title="CMS Node Locked" description="Direct registry modification requires an active clinical session for cryptographic signing." icon={Edit} />;
  }
  
  const [activeSegment, setActiveSegment] = React.useState('branding');
  const [cmsData, setCmsData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "cms"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: any = {};
      snapshot.docs.forEach(doc => {
        data[doc.id] = doc.data();
      });
      setCmsData(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "cms");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleSave = async (segment: string, data: any) => {
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "cms", segment), data);
      alert("CMS Registry Synchronized successfully.");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `cms/${segment}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Accessing VACS Core Engine...</div>;

   return (
    <div className="space-y-10">
      <div className="bg-[#0B1D45] border border-white/10 text-white p-10 rounded-[3rem] relative overflow-hidden shadow-2xl">
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <span className="px-3 py-1 bg-[#C5A069] text-[#0B1D45] text-[10px] font-black rounded-lg uppercase tracking-[0.2em] shadow-lg shadow-[#C5A069]/20 text-[#0B1D45]">VACS Core Engine</span>
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
               <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Protocol Live Sync</span>
            </div>
            <h3 className="text-5xl font-black mb-4 tracking-tighter italic uppercase underline decoration-[#C5A069]/50 decoration-8 underline-offset-8">Dynamic CMS Guide</h3>
            <p className="text-slate-400 text-lg max-w-lg font-medium leading-relaxed">
               Manage real-time clinical copy, field staff imagery, and protocol documentation across all public nodes.
            </p>
         </div>
         <LayoutDashboard className="absolute top-1/2 right-12 -translate-y-1/2 w-48 h-48 text-white/5 -z-0 rotate-12" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
         {/* CMS Navigation */}
         <div className="w-full lg:w-72 shrink-0 space-y-4">
            <CMSNavItem active={activeSegment === 'branding'} onClick={() => setActiveSegment('branding')} label="Brand Identity" />
            <CMSNavItem active={activeSegment === 'landing'} onClick={() => setActiveSegment('landing')} label="Landing Hero" />
            <CMSNavItem active={activeSegment === 'about'} onClick={() => setActiveSegment('about')} label="About VACS" />
            <CMSNavItem active={activeSegment === 'services'} onClick={() => setActiveSegment('services')} label="Service Tiers" />
            <CMSNavItem active={activeSegment === 'faq'} onClick={() => setActiveSegment('faq')} label="Clinical FAQ" />
            <CMSNavItem active={activeSegment === 'contact'} onClick={() => setActiveSegment('contact')} label="Contact Node" />
            <CMSNavItem active={activeSegment === 'templates'} onClick={() => setActiveSegment('templates')} label="Email Templates" />
            <CMSNavItem active={activeSegment === 'images'} onClick={() => setActiveSegment('images')} label="Asset Registry" />
         </div>

         {/* Editor Panes */}
         <div className="flex-1 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm min-h-[600px] relative">
            {activeSegment === 'branding' && (
              <div className="space-y-12 h-full flex flex-col">
                 <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Identity Configuration</h4>
                       <CMSField label="Legal Entity Name" defaultValue={cmsData.branding?.name || "Visiting Angels Caregivers Solutions"} onChange={(val: string) => cmsData.branding = { ...cmsData.branding, name: val }} />
                       <CMSField label="Market Tagline" defaultValue={cmsData.branding?.tagline || "Safe. Dignified. Accountable."} onChange={(val: string) => cmsData.branding = { ...cmsData.branding, tagline: val }} />
                       <div className="grid grid-cols-2 gap-4">
                          <CMSField label="Primary Brand HEX" defaultValue={cmsData.branding?.primaryColor || "#2563eb"} onChange={(val: string) => cmsData.branding = { ...cmsData.branding, primaryColor: val }} />
                          <CMSField label="Secondary Brand HEX" defaultValue={cmsData.branding?.secondaryColor || "#0f172a"} onChange={(val: string) => cmsData.branding = { ...cmsData.branding, secondaryColor: val }} />
                       </div>
                    </div>
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Logo Architecture</h4>
                       <div className="p-8 border-2 border-dashed border-slate-100 bg-slate-50 rounded-[2rem] text-center group cursor-pointer hover:border-blue-500 transition-all">
                          <div className="flex items-center justify-center gap-2 mb-6">
                             {cmsData.branding?.logoUrl ? (
                               <img src={cmsData.branding.logoUrl} className="h-10 object-contain" alt="Logo" />
                             ) : (
                               <>
                                 <Heart className="text-blue-600" size={40} fill="currentColor" />
                                 <span className="text-2xl font-black tracking-tighter text-slate-900 italic uppercase">VACS</span>
                               </>
                             )}
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Active Site Logo (URL/SVG)</p>
                          <CMSField label="Logo URL" defaultValue={cmsData.branding?.logoUrl || ""} onChange={(val: string) => cmsData.branding = { ...cmsData.branding, logoUrl: val }} />
                       </div>
                       <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                          <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2">Clinical Note</p>
                          <p className="text-xs text-blue-800/80 font-medium leading-relaxed">
                             Updating the logo affects the Main Navigation, Footer, and all clinical PDFs generated for clients.
                          </p>
                       </div>
                    </div>
                 </div>
                 <div className="mt-auto pt-10 border-t border-slate-100 flex justify-end gap-5">
                    <Button 
                      disabled={isSaving}
                      onClick={() => handleSave('branding', cmsData.branding)}
                      className="h-14 px-12 rounded-full text-[11px] font-black uppercase tracking-widest bg-blue-600 border-none shadow-2xl shadow-blue-500/20"
                    >
                      {isSaving ? "Syncing..." : "Sync Brand System"}
                    </Button>
                 </div>
              </div>
            )}

            {activeSegment === 'contact' && (
              <div className="space-y-12">
                 <div className="grid md:grid-cols-2 gap-10">
                    <CMSField label="Command Center Phone" defaultValue={cmsData.contact?.phone || "+234 800 VACS CARE"} onChange={(val: string) => cmsData.contact = { ...cmsData.contact, phone: val }} />
                    <CMSField label="Clinical Email" defaultValue={cmsData.contact?.email || "ops@vacscare.com"} onChange={(val: string) => cmsData.contact = { ...cmsData.contact, email: val }} />
                    <CMSField label="HQ Address" defaultValue={cmsData.contact?.address || "Lagos Mainland East, Lagos State"} onChange={(val: string) => cmsData.contact = { ...cmsData.contact, address: val }} />
                    <CMSField label="Emergency Protocol Line" defaultValue={cmsData.contact?.emergency || "+234 900 EMERGENCY"} onChange={(val: string) => cmsData.contact = { ...cmsData.contact, emergency: val }} />
                 </div>
                 <div className="flex justify-end pt-10 border-t border-slate-100">
                    <Button 
                      disabled={isSaving}
                      onClick={() => handleSave('contact', cmsData.contact)}
                      className="h-14 px-12 rounded-full text-[11px] font-black uppercase tracking-widest bg-blue-600 border-none"
                    >
                      {isSaving ? "Updating..." : "Update Contact Registry"}
                    </Button>
                 </div>
              </div>
            )}
            
            {activeSegment === 'templates' && (
              <TemplateEditor />
            )}
            
            {/* Other segments can follow similar pattern */}
            {activeSegment !== 'branding' && activeSegment !== 'contact' && (
              <div className="flex flex-col gap-8 h-full items-center justify-center">
                 <Edit size={48} className="text-slate-100" />
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] italic">Protocol Module Under Integration</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}

function CMSNavItem({ active, onClick, label }: any) {
   return (
      <button 
         onClick={onClick}
         className={cn(
            "w-full text-left p-6 rounded-2xl border transition-all flex items-center justify-between group",
            active 
               ? "bg-white border-blue-200 shadow-xl shadow-blue-500/5 text-blue-600 scale-105 z-10" 
               : "bg-transparent border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
         )}
      >
         <span className="text-[11px] font-black uppercase tracking-widest italic">{label}</span>
         {active ? <ChevronRight size={18} /> : <div className="w-1 h-1 bg-slate-200 rounded-full group-hover:bg-slate-400"></div>}
      </button>
   );
}

function ChevronRight({ size = 20, className = "" }: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

function StaffManager({ user }: any) {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (!user) {
    return <ClinicalLoginRequired title="Staff Registry Locked" description="Privacy regulations require an authenticated clinical session to view field staff identities." icon={Users} />;
  }

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const staffList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStaff(staffList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "users");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddStaff = async () => {
      const email = prompt("Enter agent email:");
      if (!email) return;
      try {
          await addDoc(collection(db, "users"), {
              email: email,
              fullName: "New Field Agent",
              role: "Field Agent",
              verificationStatus: "PENDING",
              kitStatus: "MISSING",
              createdAt: new Date()
          });
          alert("Field Agent record initialized.");
      } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, "users");
      }
  };

  const handleDeactivateStaff = async (staffId: string) => {
      if (!confirm("Are you sure you want to deactivate this agent?")) return;
      try {
          await updateDoc(doc(db, "users", staffId), { verificationStatus: "BLOCKED" });
          alert("Field Agent deactivated.");
      } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `users/${staffId}`);
      }
  };

  const handleAssignSupervisor = async (staffId: string, supervisorId: string) => {
      try {
          await updateDoc(doc(db, "users", staffId), { supervisorId });
          alert("Supervisor assigned successfully.");
      } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `users/${staffId}`);
      }
  };

  const handleUpdateVerificationStatus = async (staffId: string, verificationStatus: string) => {
      try {
          await updateDoc(doc(db, "users", staffId), { verificationStatus });
          alert("Verification status updated.");
      } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `users/${staffId}`);
      }
  };

  const rns = staff.filter(s => s.role === 'RN');

  return (
    <div className="space-y-6">
       {!auth.currentUser && (
         <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
            <ShieldAlert size={14} />
            Note: Staff data hidden for privacy security. Link Clinical ID to unlock repository.
         </div>
       )}
       <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 italic uppercase italic tracking-tighter">Field Staff Protocol Registry</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Verification of Clinical Integrity & Reprimand Ledger</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Scan Protocol ID..."
                  className="pl-10 pr-4 h-10 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest w-64 focus:ring-2 focus:ring-[#C5A069] outline-none transition-all"
                />
             </div>
             <Button onClick={handleAddStaff} className="h-10 text-xs font-black uppercase tracking-widest rounded-full shadow-lg shadow-[#C5A069]/10 bg-[#C5A069] text-[#0B1D45] hover:bg-[#B49158] border-none">Register Field Agent</Button>
          </div>
       </div>

       <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
             <thead className="bg-slate-50 border-b border-slate-100 uppercase text-[10px] font-black tracking-widest text-slate-400">
                <tr>
                   <th className="px-2 py-4 md:px-6 md:py-5">Field Agent</th>
                   <th className="px-2 py-4 md:px-6 md:py-5 hidden sm:table-cell">Role</th>
                   <th className="px-2 py-4 md:px-6 md:py-5 hidden md:table-cell">Verification</th>
                   <th className="px-2 py-4 md:px-6 md:py-5 hidden md:table-cell">Kit</th>
                   <th className="px-2 py-4 md:px-6 md:py-5 hidden md:table-cell">Supervisor</th>
                   <th className="px-2 py-4 md:px-6 md:py-5 text-right">Operations</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                       <td colSpan={5} className="px-6 py-8 h-10 bg-slate-100/50"></td>
                    </tr>
                  ))
                ) : staff.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-50 italic">No Field Agents Registered in Node</td>
                  </tr>
                ) : (
                  staff.map((agent) => (
                    <StaffRow 
                      key={agent.id}
                      agent={agent}
                      rns={rns}
                      onAssignSupervisor={handleAssignSupervisor}
                      onUpdateStatus={handleUpdateVerificationStatus}
                      onDeactivate={handleDeactivateStaff}
                    />
                  ))
                )}
             </tbody>
          </table>
       </div>

       <div className="mt-8 p-10 bg-[#0B1D45] rounded-[3rem] border border-white/10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A069]/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
          <div className="relative z-10">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-[#C5A069] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#C5A069]/20 text-[#0B1D45]">
                   <ShieldAlert size={28} />
                </div>
                <div>
                   <h4 className="text-2xl font-black tracking-tighter uppercase italic">VACS Clinical Three-Rule Protocol</h4>
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none mt-1">Security Oversight Directive #2026-X</p>
                </div>
             </div>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.15em] mb-12 max-w-2xl leading-relaxed">
                To maintain non-negotiable clinical integrity, all field staff are bound by the Three-Rule System. Protocol deviations trigger an automatic strike. 3 strikes result in permanent system lock.
             </p>
             <div className="grid md:grid-cols-3 gap-8">
                <RuleInfo rule="Rule 1: Temporal Integrity" desc="DVP telemetry must be verified on-site. Delayed entries trigger an immediate audit flag." />
                <RuleInfo rule="Rule 2: Identity Guard" desc="Terminal access is biologically strictly tied to the verified field professional ID." />
                <RuleInfo rule="Rule 3: Clinical Shield" desc="Client private diagnostic data must never exceed the bounds of the encrypted registry." />
             </div>
          </div>
       </div>
    </div>
  );
}

function StaffRow({ agent, rns, onAssignSupervisor, onUpdateStatus, onDeactivate }: any) {
  const fullName = agent.fullName || agent.full_name || "Unknown Agent";
  const initials = fullName.split(' ').map((n: string) => n[0]).join('');

  return (
    <tr className="hover:bg-slate-50 transition-colors group">
       <td className="px-2 py-4 md:px-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-700 font-bold text-[11px] font-serif italic transition-colors">
                {initials}
             </div>
             <div className="min-w-0">
                <p className="text-sm font-black text-slate-800 tracking-tight uppercase italic">{fullName}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">{agent.email}</p>
             </div>
          </div>
       </td>
       <td className="px-2 py-4 md:px-6 hidden sm:table-cell">
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[9px] font-black rounded-lg border border-slate-200 uppercase tracking-widest">
            {agent.role}
          </span>
       </td>
       <td className="px-2 py-4 md:px-6 hidden md:table-cell">
          <select 
              className={cn(
                "p-2 text-[9px] font-black uppercase tracking-widest rounded-lg border",
                agent.verificationStatus === 'VERIFIED' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : 
                agent.verificationStatus === 'BLOCKED' ? "bg-red-50 border-red-100 text-red-600" :
                "bg-slate-50 border-slate-200 text-slate-400"
              )}
              defaultValue={agent.verificationStatus || "PENDING"}
              onChange={(e) => onUpdateStatus(agent.id, e.target.value)}
          >
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="BLOCKED">Blocked</option>
          </select>
       </td>
       <td className="px-2 py-4 md:px-6 hidden md:table-cell">
          <div className={cn(
            "inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest",
            agent.kitStatus === 'VERIFIED' ? "text-emerald-600" : "text-amber-500"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full", agent.kitStatus === 'VERIFIED' ? "bg-emerald-600" : "bg-amber-500")}></div>
            {agent.kitStatus || 'MISSING'}
          </div>
       </td>
       <td className="px-2 py-4 md:px-6 hidden md:table-cell">
           {agent.role !== 'RN' && agent.role !== 'ADMIN' ? (
               <select 
                   className="p-2 text-[9px] bg-slate-50 rounded-lg border border-slate-200"
                   defaultValue={agent.supervisorId || ""}
                   onChange={(e) => onAssignSupervisor(agent.id, e.target.value)}
               >
                   <option value="">Select RN Supervisor</option>
                   {rns.map((rn: any) => (
                       <option key={rn.id} value={rn.id}>{rn.fullName || rn.full_name}</option>
                   ))}
               </select>
           ) : (
               <span className="text-[9px] font-bold text-slate-400 uppercase">N/A</span>
           )}
       </td>
       <td className="px-2 py-4 md:px-6 text-right">
          <div className="flex items-center justify-end gap-2">
             <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-white hover:text-blue-600">
                <Edit size={14} />
             </Button>
             <Button onClick={() => onDeactivate(agent.id)} variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-white hover:text-red-600" title="Deactivate Agent">
                <ShieldAlert size={14} />
             </Button>
          </div>
       </td>
    </tr>
  );
}
function RuleInfo({ rule, desc }: any) {
  return (
     <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-colors group">
        <p className="text-[10px] font-black text-[#C5A069] uppercase tracking-[0.2em] mb-4 group-hover:text-[#C5A069]/80 transition-colors">{rule}</p>
        <p className="text-[11px] text-slate-300 font-bold leading-relaxed uppercase tracking-wide opacity-80">{desc}</p>
     </div>
  );
}

function AssetCard({ title, items, assignedTo, managedBy, visibility, status, isRN = false }: any) {
  return (
    <div className={cn("p-8 rounded-[2.5rem] border shadow-sm relative overflow-hidden", isRN ? "bg-slate-900 text-white" : "bg-white border-slate-200")}>
       <div className="relative z-10">
         <h4 className="font-black text-lg uppercase tracking-tight italic mb-6">{title}</h4>
         <ul className="space-y-3 mb-8">
           {items.map((item: string, i: number) => (
             <li key={i} className="flex items-center gap-3 text-xs font-medium opacity-80">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
               {item}
             </li>
           ))}
         </ul>
         <div className="space-y-2 text-[10px] font-black uppercase tracking-widest opacity-60">
           <p>Assigned: {assignedTo}</p>
           <p>Managed: {managedBy}</p>
           <p>Visibility: {visibility}</p>
           <p className="pt-4 font-mono">{status}</p>
         </div>
       </div>
    </div>
  );
}

function FinancialManager() {
  const [activeTab, setActiveTab] = React.useState("billing");

  return (
    <div className="space-y-8">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-slate-950 text-white rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
                <p className="text-[10px] uppercase font-black tracking-[0.4em] text-slate-500 mb-4">Operational Liquidity</p>
                <h4 className="text-4xl font-black font-mono tracking-tighter mb-6">₦124,560,800</h4>
                <div className="flex gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Vault Secure</span>
                </div>
             </div>
             <CreditCard size={120} className="absolute -bottom-8 -right-8 text-white/5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm relative overflow-hidden group">
             <p className="text-[10px] uppercase font-black tracking-[0.4em] text-slate-400 mb-4">Staff Wallet Liability</p>
             <h4 className="text-4xl font-black text-slate-900 font-mono tracking-tighter mb-6">₦12,400,000</h4>
             <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-50 px-2 py-1 rounded">Pending Disbursement</span>
          </div>
          <div className="p-8 bg-blue-600 text-white rounded-[2rem] shadow-2xl shadow-blue-500/20 relative overflow-hidden">
             <p className="text-[10px] uppercase font-black tracking-[0.4em] text-blue-200 mb-4">Clinical Margin (Q2)</p>
             <h4 className="text-4xl font-black font-mono tracking-tighter mb-6">24.5%</h4>
             <div className="h-1 w-full bg-blue-400/30 rounded-full overflow-hidden">
                <div className="h-full bg-white w-3/4"></div>
             </div>
          </div>
       </div>

       <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-100 bg-slate-50/50">
             <button 
               onClick={() => setActiveTab("billing")}
               className={cn(
                  "px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                  activeTab === "billing" ? "text-blue-600 bg-white" : "text-slate-400 hover:text-slate-600"
               )}
             >
                Billing Center
                {activeTab === "billing" && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>}
             </button>
             <button 
               onClick={() => setActiveTab("rates")}
               className={cn(
                  "px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                  activeTab === "rates" ? "text-blue-600 bg-white" : "text-slate-400 hover:text-slate-600"
               )}
             >
                Rate Matrix
                {activeTab === "rates" && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>}
             </button>
          </div>

          <div className="p-10">
             {activeTab === "billing" ? (
                <div className="space-y-10">
                   <div className="flex items-center justify-between">
                      <div>
                         <h4 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Revenue Generation Module</h4>
                         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Convert verified clinical logs into billable invoices</p>
                      </div>
                      <Button className="rounded-full px-8">Batch Generate All</Button>
                   </div>

                   <div className="grid gap-4">
                      {[1, 2, 3].map(i => (
                         <div key={i} className="group p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white hover:border-blue-500 hover:shadow-xl transition-all">
                            <div className="flex items-center gap-6">
                               <div className="w-14 h-14 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                  <FileText size={28} />
                               </div>
                               <div>
                                  <p className="text-lg font-black text-slate-900 tracking-tight italic">Client #VAC-923{i} • Weekly Engagement</p>
                                  <div className="flex items-center gap-3 mt-1">
                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none border-r border-slate-300 pr-3">Verified: Mar 10</span>
                                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none italic">RN Approved: Log #882</span>
                                  </div>
                               </div>
                            </div>
                            <div className="flex items-center gap-6">
                               <div className="text-right">
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Billable Value</p>
                                  <p className="text-xl font-black text-slate-900 tracking-tighter">₦84,000</p>
                               </div>
                               <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 text-[10px] uppercase font-black tracking-widest group-hover:border-blue-500 group-hover:text-blue-600">Draft Invoice</Button>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             ) : (
                <div className="space-y-8">
                   <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <RateCard tier="Tier 1 (Standard)" rate="1,600/hr" description="Companionship & light housekeeping" />
                      <RateCard tier="Tier 2 (Physical)" rate="1,900/hr" description="Mobility assistance & hygiene" />
                      <RateCard tier="Tier 3 (Cognitive)" rate="2,200/hr" description="Amnesia/Dementia support (SCAs ONLY)" />
                      <RateCard tier="Tier 4 (Palliative)" rate="2,500/hr" description="RN-led end-of-life care" />
                   </div>
                   <div className="p-8 bg-amber-50 border border-amber-100 rounded-[2rem]">
                      <div className="flex gap-4">
                         <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0"><ShieldAlert size={20} /></div>
                         <div>
                            <h5 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-2">Rate Lock Disclaimer</h5>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">Changes to core clinical rates affect all active contracts instantly. Use caution when modifying protocol pricing. Audit required for all adjustments.</p>
                         </div>
                      </div>
                   </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}

function StatCard({ title, value, trend, color, isCritical }: any) {
  return (
    <div className={cn(
      "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:border-slate-300",
      isCritical && "border-l-4 border-l-red-500"
    )}>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <h4 className={cn(
          "text-3xl font-black tracking-tight",
          isCritical ? "text-red-600" : "text-slate-900"
        )}>
          {value}
        </h4>
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter",
          trend.includes('+') ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
        )}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function CMSField({ label, defaultValue, type = "text", onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      {type === "textarea" ? (
        <textarea 
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none min-h-[120px] text-sm font-medium text-slate-700 transition-all" 
          defaultValue={defaultValue} 
          onChange={(e) => onChange?.(e.target.value)}
        />
      ) : (
        <input 
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none text-sm font-medium text-slate-700 transition-all" 
          defaultValue={defaultValue} 
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
    </div>
  );
}

function RateCard({ tier, rate, description }: any) {
  return (
    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-center group hover:bg-white hover:shadow-md transition-all">
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{tier}</p>
       <p className="text-2xl font-black text-slate-900 tracking-tighter">₦{rate}</p>
       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1 opacity-60">{description}</p>
    </div>
  );
}

function ClientManager({ user }: any) {
  const [activeTab, setActiveTab] = React.useState("registry");
  const [clients, setClients] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (!user) {
    return <ClinicalLoginRequired title="Client Registry Shielded" description="Institutional privacy protocols: An active clinical session is mandatory to access client diagnostic logs." icon={ShieldAlert} />;
  }

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let unsubClients: () => void = () => {};
    let unsubStaff: () => void = () => {};

    // --- Clients ---
    if (auth.currentUser?.email === "princewill.iwuoha@gmail.com") {
      const qClients = query(collection(db, "clients"));
      unsubClients = onSnapshot(qClients, (snapshot) => {
        setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, "clients");
      });
    }
    
    // --- Staff ---
    const qStaff = query(collection(db, "users"));
    unsubStaff = onSnapshot(qStaff, (snapshot) => {
      setStaff(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "users");
      setLoading(false);
    });

    return () => {
      unsubClients();
      unsubStaff();
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Client Engagement Console</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Managed Service Agreements & Clinical Retainer Controls</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => setActiveTab("registry")}
             className={cn("px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'registry' ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200")}
           >
             Client Registry
           </button>
           <button 
             onClick={() => setActiveTab("legal")}
             className={cn("px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'legal' ? "bg-red-600 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200")}
           >
             Legal & Penalties
           </button>
        </div>
      </div>

      {activeTab === 'registry' ? (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="p-20 text-center animate-pulse text-slate-400 text-[10px] font-black uppercase tracking-widest">Scanning Registry...</div>
            ) : clients.length === 0 ? (
              <div className="p-20 bg-white border border-slate-200 rounded-[3rem] text-center text-slate-400 text-[10px] font-black uppercase tracking-widest italic">Node Registry Empty</div>
            ) : (
              clients.map((client, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm group hover:border-blue-500 transition-all">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-6">
                      <div className={cn(
                        "w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-white",
                        client.status === 'HOSPITALIZED' ? "bg-amber-500 animate-pulse" : "bg-blue-600"
                      )}>
                        <ShieldAlert size={24} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">{client.fullName || client.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{client.id} • {client.tier}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pulse Status</p>
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                        client.status === 'HOSPITALIZED' ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      )}>
                        {client.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 items-end">
                     <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                           <span className="text-slate-400">Care Engagement Stability</span>
                           <span className={(client.health || 0) < 20 ? "text-red-500" : "text-emerald-500"}>{client.health || 100}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                           <div className={cn("h-full rounded-full transition-all", (client.health || 0) < 20 ? "bg-red-500" : "bg-emerald-500")} style={{ width: `${client.health || 100}%` }}></div>
                        </div>
                     </div>
                     <div className="flex gap-3 justify-end">
                        <CaregiverAssignment client={{uid: client.id, ...client}} staffList={staff} />
                        <Button variant="outline" className="h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest border-slate-200">View Logs</Button>
                        {client.status === 'HOSPITALIZED' && (
                          <Button className="h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest bg-amber-600 border-none hover:bg-amber-700 shadow-lg shadow-amber-500/10">Manage Pulse Clause</Button>
                        )}
                     </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-8">
             <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <h3 className="text-xl font-black italic uppercase tracking-tight mb-4 relative z-10">Pulse Clause Trigger</h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8 relative z-10">
                   When a client is hospitalized, the system pauses billing and triggers a 25% Retention Fee payment to the caregiver to prevent attrition.
                </p>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 relative z-10">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Automated Billing Logic</span>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                   </div>
                   <div className="space-y-4">
                      <div className="flex justify-between text-xs">
                         <span className="text-slate-300">Staff Retention Fee</span>
                         <span className="font-bold">25% (Paid)</span>
                      </div>
                      <div className="flex justify-between text-xs">
                         <span className="text-slate-300">Client Credit Refund</span>
                         <span className="font-bold">75% (Saved)</span>
                      </div>
                   </div>
                </div>
                <ShieldAlert size={140} className="absolute -bottom-10 -left-10 text-white/5 -z-0" />
             </div>

             <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm">
                <h3 className="text-sm font-black italic uppercase tracking-tight mb-6">Zone 3 Logistics Panel</h3>
                <div className="space-y-4">
                   {[1].map(i => (
                     <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">Manual Review Required</p>
                        <p className="font-bold text-slate-800 text-sm mb-4">Inter-state Transport Request (Ogun Node)</p>
                        <div className="grid grid-cols-2 gap-4">
                           <Button className="h-9 px-0 rounded-xl text-[9px] font-black uppercase bg-slate-900 border-none">Approve Fee</Button>
                           <Button variant="outline" className="h-9 px-0 rounded-xl text-[9px] font-black uppercase border-slate-200 text-slate-500">Reject</Button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
           <div className="bg-red-50 border border-red-100 rounded-[3rem] p-12 text-center relative overflow-hidden">
              <div className="relative z-10">
                 <ShieldAlert size={64} className="text-red-500 mx-auto mb-8" />
                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mb-4">Poaching Protection Gate</h2>
                 <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xl mx-auto mb-10">
                    The VACS Service Agreement strictly prohibits private engagement of field staff. Breach of contract triggers the Succession Fee protocol.
                 </p>
                 <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <div className="bg-white px-8 py-4 rounded-2xl border border-red-200 shadow-xl shadow-red-500/5">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Legal Succession Fee</p>
                       <p className="text-3xl font-black text-red-600 tracking-tighter">₦500,000.00</p>
                    </div>
                    <div className="bg-white px-8 py-4 rounded-2xl border border-red-200 shadow-xl shadow-red-500/5">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Penalty Trigger</p>
                       <p className="text-3xl font-black text-slate-900 tracking-tighter italic">LEDGER_FREEZE</p>
                    </div>
                 </div>
              </div>
              <CreditCard size={300} className="absolute -bottom-20 -right-20 text-red-500/5 -z-0" />
           </div>

           <div className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8 underline decoration-blue-500 decoration-4 underline-offset-8">Active Legal Disputes</h3>
              <div className="space-y-6">
                 {[1].map(i => (
                    <div key={i} className="flex items-center justify-between p-8 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-red-500 transition-all">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-600/20">
                             <ShieldAlert size={24} />
                          </div>
                          <div>
                             <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase italic">Dispute #2026-L44</h4>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Client: Mr. Benson • Private Hire Flag</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="text-right">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                             <p className="text-xs font-black text-red-600 uppercase tracking-tighter">Wallet Locked</p>
                          </div>
                          <Button className="h-12 px-8 rounded-xl bg-slate-900 border-none text-[10px] uppercase font-black tracking-widest shadow-xl">Legal Dispatch</Button>
                       </div>
                    </div>
                 ))}
                 <div className="p-12 text-center text-slate-300 font-black uppercase tracking-[0.4em] text-[10px] mt-10">No further protocol breaches detected.</div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function AcademyManager({ user }: any) {
  if (!user) {
    return <ClinicalLoginRequired title="Academy Node Offline" description="Certification tracking and clinical training modules require a verified professional node." icon={GraduationCap} />;
  }
  return (
    <div className="space-y-12">
      <div className="bg-blue-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="relative z-10 max-w-xl">
           <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-white/20 text-[10px] font-black rounded-lg uppercase tracking-widest">LMS Control Center</span>
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
           </div>
           <h2 className="text-6xl font-black tracking-tighter italic uppercase mb-4">VACS Academy Node</h2>
           <p className="text-blue-100 text-lg font-medium leading-relaxed opacity-80">
              Manage certification locking, medical kit audits, and the 6-month loyalty threshold for Global SCA status.
           </p>
        </div>
        <GraduationCap size={240} className="text-white/10 absolute -bottom-10 -right-10 -z-0" />
        <div className="bg-white text-slate-900 p-8 rounded-[2.5rem] min-w-[280px] shadow-2xl relative z-10">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Active Trainees</p>
           <h4 className="text-5xl font-black tracking-tighter italic mb-6">142</h4>
           <Button className="w-full h-12 rounded-xl bg-blue-600 border-none text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700">Deploy New Module</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight underline decoration-blue-500 decoration-4 underline-offset-8">Track Certification Locking</h3>
            {[
               { track: "Track 1: HCA Foundational", lockType: "Medical Kit Verification", status: "82% Compliant", isGlobal: false },
               { track: "Track 2: Clinical Practice", lockType: "RN Manual Sign-Off", status: "44% Pending Audit", isGlobal: false },
               { track: "Track 3: Global SCA (Senior Care Assistant)", lockType: "6-Month Tenure + Kit", status: "Restricted Access", isGlobal: true },
            ].map((track, i) => (
               <div key={i} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-blue-500 transition-all">
                  <div className="flex items-center gap-6">
                     <div className={cn(
                       "w-14 h-14 rounded-2xl flex items-center justify-center text-white",
                       track.isGlobal ? "bg-slate-900" : "bg-blue-500"
                     )}>
                        <ShieldAlert size={28} />
                     </div>
                     <div>
                        <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase italic">{track.track}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Digital Lock: {track.lockType}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ecosystem Status</p>
                        <p className="text-xs font-black text-blue-600 uppercase tracking-tighter">{track.status}</p>
                     </div>
                     <ChevronRight size={24} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
                  </div>
               </div>
            ))}
         </div>

         <div className="space-y-8">
            <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-10 shadow-inner">
               <h3 className="text-sm font-black italic uppercase tracking-tight mb-8">Asset & Buyout Logic</h3>
               <div className="space-y-8">
                  <div className="space-y-4">
                     <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tenure Protection</h4>
                     <p className="text-xs font-medium text-slate-600 leading-relaxed">
                        Certificates are hidden until Staff reach **180 days** of service or pay the **Buyout/Release Fee**.
                     </p>
                     <Button variant="outline" className="w-full h-10 rounded-xl text-[9px] font-black border-slate-200 uppercase tracking-widest">Configure Fees</Button>
                  </div>
                  <div className="h-px bg-slate-200"></div>
                  <div className="space-y-4">
                     <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gate Verification</h4>
                     <p className="text-xs font-medium text-slate-600 leading-relaxed">
                        RN-Manual Sign-Off required for **Clinical Practice Track** elevation.
                     </p>
                     <Button className="w-full h-12 rounded-xl bg-slate-950 text-white border-none text-[9px] font-black uppercase tracking-widest shadow-xl">RN Audit Queue</Button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function InventoryManager({ user }: any) {
  if (!user) {
    return <ClinicalLoginRequired title="Inventory Node Masked" description="Medical equipment ledger and field kit audits require a synchronized clinical session." icon={Package} />;
  }
  return (
    <div className="space-y-12">
       <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <div>
             <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter italic uppercase">Asset & Kit Registry</h2>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Clinical Tools & Professional Equipment Ledger</p>
          </div>
          <div className="flex gap-4">
             <div className="p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm flex items-center gap-6">
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Kit Verification Rate</p>
                   <p className="text-2xl font-black text-slate-900 tracking-tighter">72%</p>
                </div>
                <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-600 w-[72%]"></div>
                </div>
             </div>
             <Button className="h-16 px-10 rounded-[2rem] bg-blue-600 text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-blue-500/20 border-none">Provision Assets</Button>
          </div>
       </div>

       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AssetCard 
            title="HCA Caregiver Kit" 
            items={["BP Monitor", "Gait Belt", "Stethoscope"]}
            assignedTo="Individual Staff"
            managedBy="Supervising RN"
            visibility="HIDDEN (Staff Profile Only)"
            status="78 Units Deployed"
          />
          <AssetCard 
            title="Clinical Assessment Bag" 
            items={["Advanced Sphygmomanometer", "MMSE Kits", "RN Scrubs"]}
            assignedTo="Supervising RN"
            managedBy="Super-Admin"
            visibility="RN EXCLUSIVE"
            status="12 Units Deployed"
            isRN
          />
          <div className="p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl">
             <div className="relative z-10">
               <h4 className="text-xl font-black italic uppercase tracking-tight mb-4">Kit Audit Loop</h4>
               <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">Staff must upload photos of clinical assets before accepting higher-tier cases.</p>
               <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="text-slate-500">Waitlist for Verification</span>
                     <span className="text-amber-500">9 Staff</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 w-1/4 animate-pulse"></div>
                  </div>
               </div>
               <Button className="w-full h-12 rounded-xl bg-white text-slate-900 border-none text-[10px] font-black uppercase tracking-widest shadow-xl">Open Audit Queue</Button>
             </div>
             <Package size={160} className="absolute -bottom-10 -right-10 text-white/5 -z-0 group-hover:scale-110 transition-transform" />
          </div>
       </div>
    </div>
  );
}



