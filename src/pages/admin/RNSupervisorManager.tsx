import React, { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  setDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { 
  createUserWithEmailAndPassword,
  getAuth
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { db } from "../../lib/firebase";
import firebaseConfig from "../../../firebase-applet-config.json";
import { 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Lock, 
  BadgeCheck, 
  Phone, 
  MapPin, 
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Ban,
  Loader2
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import DashboardLayout from "../../components/layout/DashboardLayout";

// Secondary Firebase app to create users without logging out the current admin
const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
const secondaryAuth = getAuth(secondaryApp);

export default function RNSupervisorManager() {
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    licenseNumber: "",
    phone: "",
    region: ""
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "rn_supervisor"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSupervisors(data);
      setFetchLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleCreateSupervisor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 1. Create Auth User using secondary auth instance to maintain admin session
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // 2. Create Firestore Document
      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        role: "rn_supervisor",
        licenseNumber: formData.licenseNumber,
        phone: formData.phone,
        region: formData.region,
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // RN Supervisors have automatic access to all patient records in this logic
        allAccessGranted: true 
      });

      // 3. Clear Form & Sign Out Secondary App immediately
      await secondaryAuth.signOut();
      setFormData({
        fullName: "",
        email: "",
        password: "",
        licenseNumber: "",
        phone: "",
        region: ""
      });
      
      setMessage({ type: 'success', text: "RN Supervisor account initialized and registered successfully." });
    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: error.message || "Failed to initialize supervisor node." });
    } finally {
      setLoading(false);
    }
  };

  const filteredSupervisors = supervisors.filter(s => 
    s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="ADMIN" title="Protocol Oversight">
      <div className="space-y-8 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">RN Supervisors</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mt-2">Clinical Personnel Management</p>
          </div>
        </div>

        {/* Creation Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <UserPlus size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Onboard Node</h3>
              </div>

              <form onSubmit={handleCreateSupervisor} className="space-y-5">
                {[
                  { id: 'fullName', label: 'Full Name', type: 'text', icon: ShieldCheck, placeholder: 'RN Victoria Ade' },
                  { id: 'email', label: 'Institutional Email', type: 'email', icon: Mail, placeholder: 'v.ade@vacscare.com' },
                  { id: 'password', label: 'Temporary Password', type: 'password', icon: Lock, placeholder: '••••••••' },
                  { id: 'licenseNumber', label: 'RN License #', type: 'text', icon: BadgeCheck, placeholder: 'RN-NG-120044' },
                  { id: 'phone', label: 'Contact Phone', type: 'tel', icon: Phone, placeholder: '+234 800 000 0000' },
                  { id: 'region', label: 'Assigned Branch', type: 'text', icon: MapPin, placeholder: 'Owerri Central' }
                ].map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">{field.label}</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <field.icon size={16} />
                      </div>
                      <input 
                        type={field.type}
                        required={field.id !== 'region'}
                        value={(formData as any)[field.id]}
                        onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300"
                        placeholder={field.placeholder}
                      />
                    </div>
                  </div>
                ))}

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 mt-4"
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deploying Node...</>
                  ) : "Register Supervisor"}
                </Button>

                {message && (
                  <div className={`mt-4 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border animate-in fade-in slide-in-from-top-2 ${
                    message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'
                  }`}>
                    {message.text}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Management Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Active Supervisors</h3>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search personnel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 bg-slate-50 border border-slate-100 rounded-full pl-12 pr-6 text-[10px] font-bold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Personnel</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Credentials</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignment</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {fetchLoading ? (
                      [1,2,3].map(i => (
                        <tr key={i} className="animate-pulse">
                          <td colSpan={5} className="px-8 py-6 h-20 bg-slate-50/30"></td>
                        </tr>
                      ))
                    ) : filteredSupervisors.length > 0 ? (
                      filteredSupervisors.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/30 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black italic">
                                {s.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{s.fullName}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{s.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                              <BadgeCheck size={10} /> {s.licenseNumber || "N/A"}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              <MapPin size={12} className="text-blue-400" />
                              {s.region || "Global Hub"}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-colors">
                                <Edit2 size={14} />
                              </button>
                              <button className="w-8 h-8 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors">
                                <Ban size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center">
                          <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">No supervisory nodes active</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
