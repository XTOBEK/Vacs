import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { 
  Heart, 
  FileText, 
  Wallet, 
  MessageSquare, 
  Calendar,
  History,
  ShieldCheck,
  Activity,
  Thermometer,
  Zap,
  Clock,
  Phone,
  Mail,
  Download,
  ShieldAlert,
  ChevronRight,
  User,
  BadgeCheck,
  Bell,
  X,
  Plus,
  ArrowDownLeft,
  CreditCard,
  PhoneCall,
  LogOut
} from "lucide-react";
import AppDownloadCenter from "../../components/dashboard/AppDownloadCenter";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/utils";
import { db, auth, handleFirestoreError, OperationType } from "../../lib/firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";

// --- Sub-components ---

function ClientSupport() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'VACS Command Center online. How can I assist with your clinical protocol?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    
    let responseText = "Acknowledged. Routing query to Supervising RN.";
    if (input.toLowerCase().includes('pay') && input.toLowerCase().includes('caregiver')) {
      responseText = "All payments must go through the VACS platform to ensure your insurance coverage and clinical RN oversight remain valid. Private hiring is a breach of the Service Agreement.";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    }, 1000);
    setInput('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
       <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden flex flex-col h-[600px] shadow-2xl">
          <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                   <ShieldCheck size={20} />
                </div>
                <div>
                   <h3 className="text-lg font-black italic uppercase tracking-tight">Clinical Assistant</h3>
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Protocol & Policy Guidance</p>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Secure Node</span>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50">
             {messages.map((msg, i) => (
                <div key={i} className={cn(
                  "max-w-[80%] p-5 rounded-3xl text-sm font-medium leading-relaxed",
                  msg.role === 'ai' ? "bg-white border border-slate-200 text-slate-700 self-start rounded-tl-none" : "bg-blue-600 text-white self-end rounded-tr-none ml-auto"
                )}>
                   {msg.text}
                </div>
             ))}
          </div>

          <div className="p-6 bg-white border-t border-slate-100 flex gap-4">
             <input 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder="Enter protocol query..."
               className="flex-1 bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all"
             />
             <Button onClick={handleSend} className="h-14 w-14 rounded-2xl flex items-center justify-center p-0">
                <Zap size={20} />
             </Button>
          </div>
       </div>
       <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl text-center">
          <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Global Policy Note</p>
          <p className="text-xs text-amber-600/80 font-medium mt-2 leading-relaxed italic">
            "VACS maintains a Zero-Tolerance policy regarding private financial arrangements with staff. Any such arrangement voids clinical oversight and triggers legal penalties."
          </p>
       </div>
    </div>
  );
}

function VitalMetric({ icon, label, value, unit }: any) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-[2rem] transition-all hover:bg-white hover:border-[#C5A069] hover:shadow-xl group text-center">
       <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</div>
       <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-slate-900 tracking-tighter tabular-nums">{value}</span>
          <span className="text-[8px] font-black text-slate-400 uppercase">{unit}</span>
       </div>
    </div>
  );
}

function ReminderItem({ time, text, status }: { time: string, text: string, status: 'PENDING' | 'UPCOMING' | 'COMPLETED' }) {
  return (
    <div className="flex items-center gap-4 group">
       <div className="text-[10px] font-black text-[#C5A069] tabular-nums">{time}</div>
       <div className="flex-1">
          <p className="text-[11px] font-black uppercase tracking-wide group-hover:text-[#C5A069] transition-colors">{text}</p>
       </div>
       <div className={cn(
          "w-1.5 h-1.5 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)]",
          status === 'PENDING' ? "bg-rose-500 animate-pulse shadow-rose-500/50" : status === 'UPCOMING' ? "bg-amber-500" : "bg-emerald-500 shadow-emerald-500/50"
       )}></div>
    </div>
  );
}

function CaregiverContactItem({ icon, label, value }: any) {
  return (
    <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] min-w-[220px] transition-all hover:bg-white hover:border-blue-200 hover:shadow-lg group">
       <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
             {icon}
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
       </div>
       <p className="text-sm font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors uppercase">{value}</p>
    </div>
  );
}

function ClientCareLogs() {
   return (
      <div className="space-y-10">
         <div className="flex flex-col gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Clinical Evidence Logs</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Verifiable historical care records for this case</p>
         </div>
         <div className="grid gap-6">
            {[1, 2, 3, 4, 5].map(i => (
               <div key={i} className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/5 transition-all cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all"></div>
                  <div className="flex items-center gap-6">
                     <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors border border-slate-100">
                        <History size={28} />
                     </div>
                     <div>
                        <p className="font-black text-slate-900 text-lg tracking-tight">Daily Clinical Log — March {12 - i}, 2026</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Certified By Field Staff: Emma Wilson • Verified by VACS Audit</p>
                     </div>
                  </div>
                  <Button variant="ghost" className="h-12 px-6 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all gap-2">
                    Download PDF <FileText size={16} />
                  </Button>
               </div>
            ))}
         </div>
      </div>
   );
}

function ClientBilling({ wallet }: { wallet: any }) {
   const [showTopUp, setShowTopUp] = useState(false);
   const [amount, setAmount] = useState("");
   const [loading, setLoading] = useState(false);

   const balance = wallet?.balance || 0;

   const handleTopUp = async () => {
      if (!amount || isNaN(Number(amount))) return;
      setLoading(true);
      try {
         const userId = auth.currentUser?.uid;
         if (!userId) return;

         // Simulate payment success and update wallet
         await updateDoc(doc(db, "users", userId, "wallet", "main"), {
            balance: balance + Number(amount),
            lastTopUp: new Date().toISOString(),
            currency: 'NGN'
         });

         setShowTopUp(false);
         setAmount("");
      } catch (error) {
         handleFirestoreError(error, OperationType.UPDATE, "wallet/main");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="space-y-10 relative">
         <AnimatePresence>
            {showTopUp && (
               <>
                  <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={() => setShowTopUp(false)}
                     className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110]"
                  />
                  <motion.div 
                     initial={{ scale: 0.9, opacity: 0, y: 20 }}
                     animate={{ scale: 1, opacity: 1, y: 0 }}
                     exit={{ scale: 0.9, opacity: 0, y: 20 }}
                     className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[3rem] p-10 z-[111] shadow-2xl border border-slate-100"
                  >
                     <div className="flex items-center justify-between mb-8">
                        <div>
                           <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Deposit Node</h3>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Registry Credit Acquisition</p>
                        </div>
                        <button onClick={() => setShowTopUp(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900">
                           <X size={18} />
                        </button>
                     </div>

                     <div className="space-y-8">
                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 focus-within:border-blue-500 focus-within:bg-white transition-all group">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 text-center group-focus-within:text-blue-500">Amount (NGN)</p>
                           <input 
                              type="number" 
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full bg-transparent font-black text-4xl text-center outline-none text-slate-900 placeholder:text-slate-200"
                           />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           {['50000', '100000', '250000', '500000'].map(val => (
                              <button 
                                 key={val}
                                 onClick={() => setAmount(val)}
                                 className="py-4 rounded-2xl border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-900 hover:bg-slate-50 hover:border-[#C5A069] transition-all"
                              >
                                 ₦{Number(val).toLocaleString()}
                              </button>
                           ))}
                        </div>

                        <div className="p-4 bg-blue-50/50 rounded-2xl border border-dashed border-blue-200 flex items-center gap-4">
                           <ShieldCheck size={20} className="text-blue-600 shrink-0" />
                           <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-loose">
                              Secure Node Protocol: Encrypted through Flutterwave/Paystack Gateway.
                           </p>
                        </div>

                        <Button 
                           disabled={loading || !amount}
                           onClick={handleTopUp}
                           className="w-full h-16 rounded-[1.5rem] bg-slate-900 border-none text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/10"
                        >
                           {loading ? "Initializing Transaction..." : "Proceed to Secure Engine"}
                        </Button>
                     </div>
                  </motion.div>
               </>
            )}
         </AnimatePresence>

         <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-slate-950 text-white p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden border border-slate-800 transition-transform hover:scale-[1.01] duration-500">
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Available Credit</p>
                     <p className="text-[10px] font-black text-[#C5A069] uppercase tracking-widest bg-[#C5A069]/10 px-3 py-1 rounded-full border border-[#C5A069]/20">Active Node</p>
                  </div>
                  <h4 className="text-6xl font-black tracking-tighter mb-10 tabular-nums">₦{balance.toLocaleString()}</h4>
                  <div className="flex flex-wrap gap-4">
                     <Button 
                        onClick={() => setShowTopUp(true)}
                        className="h-14 px-10 rounded-full text-[10px] font-black uppercase tracking-widest bg-white text-slate-900 hover:bg-[#C5A069] hover:text-[#0B1D45] shadow-2xl shadow-white/5 transition-all gap-2"
                     >
                        <Plus size={16} /> Deposit Funds
                     </Button>
                     <Button variant="ghost" className="h-14 px-8 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10 hover:bg-white/5 flex items-center gap-2">
                        Statement <ArrowDownLeft size={16} />
                     </Button>
                  </div>
               </div>
               <div className="absolute bottom-0 right-0 p-10 opacity-5 -mb-10 -mr-10">
                  <Wallet size={200} />
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A069] rounded-full blur-[100px] opacity-10"></div>
            </div>
            
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:bg-blue-50 transition-colors"></div>
               <h3 className="font-black text-slate-900 text-2xl tracking-tighter mb-4 flex items-center justify-between italic uppercase">
                  Care Guarantee
                  <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest not-italic border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">VACS PROTECT™</span>
               </h3>
               <p className="text-sm text-slate-500 leading-relaxed mb-8 font-medium">
                  If hospitalization occurs, our <span className="text-slate-900 font-bold underline decoration-[#C5A069] underline-offset-4 decoration-2">Clinical Retention Clause</span> reduces billing to a 25% standby rate, ensuring your dedicated caregiver is reserved for your return.
               </p>
               <div className="p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-between">
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Retention Mode Status</p>
                     <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Awaiting Trigger</p>
                  </div>
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">Inactive</span>
               </div>
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="p-10 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div>
                  <h3 className="font-black text-slate-900 text-2xl tracking-tight uppercase italic">Financial Ledger</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Managed Transaction Node • Historical Record</p>
               </div>
               <div className="flex items-center gap-6">
                  <div className="text-right">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Cycle Type</p>
                     <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Regional Weekly Audit</p>
                  </div>
                  <button className="h-10 px-6 bg-white border border-slate-200 rounded-xl text-[9px] font-black text-blue-600 uppercase tracking-widest hover:border-blue-500 hover:text-blue-700 transition-all shadow-sm">Statement Archive</button>
               </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                 <thead className="bg-slate-50 text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase">
                    <tr>
                       <th className="px-10 py-6">Invoice Node</th>
                       <th className="px-10 py-6">Engagement Period</th>
                       <th className="px-10 py-6 text-right">Credits</th>
                       <th className="px-10 py-6">Verified Status</th>
                       <th className="px-10 py-6 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    <InvoiceRow id="VACS-INV-0042" period="Mar 01 - Mar 07" amount="420,000" status="PAID" />
                    <InvoiceRow id="VACS-INV-0041" period="Feb 22 - Feb 28" amount="420,000" status="PAID" />
                    <InvoiceRow id="VACS-INV-0040" period="Feb 15 - Feb 21" amount="480,000" status="PAID" />
                 </tbody>
              </table>
            </div>
         </div>
      </div>
   );
}

function InvoiceRow({ id, period, amount, status }: any) {
   return (
      <tr className="hover:bg-slate-50 transition-colors group">
         <td className="px-10 py-8 text-sm font-black text-slate-900 italic tracking-tight">{id}</td>
         <td className="px-10 py-8 text-[11px] text-slate-500 font-mono italic tracking-tighter">{period}</td>
         <td className="px-10 py-8 text-sm font-black text-slate-900 text-right tracking-tighter">₦{amount}</td>
         <td className="px-10 py-8">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg border border-emerald-100 uppercase tracking-widest">{status}</span>
         </td>
         <td className="px-10 py-8 text-right">
            <Button variant="ghost" size="sm" className="text-blue-600 h-10 px-6 rounded-xl border border-slate-100 hover:bg-white hover:shadow-lg hover:border-blue-200 text-[9px] font-black uppercase tracking-widest underline underline-offset-4">Record View</Button>
         </td>
      </tr>
   );
}

function ClientOverview({ client, wallet }: any) {
  const [isHospitalized, setIsHospitalized] = useState(false);
  const [caregiver, setCaregiver] = useState<any>(null);
  const [supervisor, setSupervisor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCareTeam() {
      if (!client?.assignedStaffId) {
        setLoading(false);
        return;
      }

      try {
        const cgDoc = await getDoc(doc(db, "users", client.assignedStaffId));
        if (cgDoc.exists()) {
          const cgData = cgDoc.data();
          setCaregiver(cgData);

          if (cgData.supervisorId) {
            const svDoc = await getDoc(doc(db, "users", cgData.supervisorId));
            if (svDoc.exists()) {
              setSupervisor(svDoc.data());
            }
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "users/care-team");
      } finally {
        setLoading(false);
      }
    }

    fetchCareTeam();
  }, [client?.assignedStaffId]);

  const displayName = client.fullName || client.full_name || "Client";
  const balance = wallet?.balance || 0;

  return (
    <div className="space-y-10">
       {/* Poaching Warning Banner */}
       <div className="bg-red-50 border border-red-100 p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                <ShieldAlert size={18} />
             </div>
             <p className="text-[10px] font-black text-red-900 uppercase tracking-widest leading-relaxed">
                <span className="text-red-600">Protocol Alert:</span> Private hiring of VACS staff is a breach of the Service Agreement (Penalty: ₦500,000).
             </p>
          </div>
          <button className="text-[9px] font-black uppercase tracking-widest text-red-600 underline">Read Agreement</button>
       </div>

       <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="w-28 h-28 rounded-3xl overflow-hidden bg-slate-100 shrink-0 border-4 border-white shadow-xl relative z-10">
             <img src={client.profileImage || "https://images.unsplash.com/photo-1544120190-27583f2274a2?q=80&w=400"} alt="Patient" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{displayName}</h3>
                <span className={cn(
                  "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border",
                  isHospitalized ? "bg-amber-50 text-amber-600 border-amber-100 animate-pulse" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                )}>
                  {isHospitalized ? "HOSPITALIZED (RETENTION MODE)" : "Active Care"}
                </span>
             </div>
             <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-blue-500" /> Tier 2 Case Protocol</span>
                <span className="flex items-center gap-2"><Calendar size={14} className="text-slate-300" /> ID: {client.id?.slice(0, 8)}</span>
             </div>
          </div>
          <div className="flex flex-col gap-4">
             <div className="bg-slate-900 text-white p-8 rounded-[2rem] text-center min-w-[240px] shadow-2xl relative z-10 border border-slate-800">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 uppercase">Account Ledger</p>
                <h4 className="text-4xl font-black tracking-tighter mb-4 tabular-nums">₦{balance.toLocaleString()}</h4>
                <Link to="/client/billing" className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">Deposit Clinical Credits</Link>
             </div>
             <Button 
               onClick={() => setIsHospitalized(!isHospitalized)}
               variant={isHospitalized ? "primary" : "outline"}
               className={cn(
                 "h-12 rounded-2xl text-[9px] font-black uppercase tracking-widest border-2",
                 isHospitalized ? "bg-emerald-600 border-none" : "border-amber-200 text-amber-600 hover:bg-amber-50"
               )}
             >
               {isHospitalized ? "Resume Standard Protocol" : "Trigger Pulse Clause (Hospitalized)"}
             </Button>
          </div>
       </div>

       {/* VACS Service & Privacy Guarantee */}
       <div className="bg-gradient-to-br from-[#0B1D45] to-[#1a2e5a] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5 group mb-10">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
             <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-14 h-14 bg-[#C5A069] rounded-2xl flex items-center justify-center text-[#0B1D45] shadow-xl shadow-[#C5A069]/20">
                      <ShieldCheck size={32} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black tracking-tighter uppercase italic">VACS Service & Privacy Guarantee</h3>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Consumer Protection Shield</p>
                   </div>
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-2xl italic">
                  Your care integrity is our primary directive. Every VACS professional is monitored via our active clinical audit network to ensure 100% protocol adherence. We guarantee the privacy of your physiological data and the absolute reliability of our dispatch operations.
                </p>
             </div>
             <div className="shrink-0 flex flex-col gap-4 w-full md:w-auto">
                <Button className="h-14 px-10 rounded-full bg-[#C5A069] text-[#0B1D45] hover:bg-[#B49158] border-none text-xs font-black uppercase tracking-widest gap-3 shadow-xl shadow-[#C5A069]/20">
                   <FileText size={18} /> View Guarantee Certificate
                </Button>
                <Button 
                  variant="outline" 
                  className="h-14 px-10 rounded-full bg-transparent border-rose-500/50 text-rose-400 hover:bg-rose-500/10 text-xs font-black uppercase tracking-widest gap-3"
                  onClick={() => alert("ISSUE PROTOCOL ACTIVATED: A VACS RN Supervisor will contact you within 15 minutes.")}
                >
                   <ShieldAlert size={18} /> Report a Service Issue
                </Button>
             </div>
          </div>
          <ShieldCheck size={280} className="absolute -bottom-20 -left-20 text-white/5 opacity-50 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
       </div>

       {/* Diagnostic Vitals Protocol */}
       <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                   <h3 className="font-black text-slate-900 text-2xl tracking-tighter italic uppercase underline decoration-[#C5A069]/30 decoration-4 underline-offset-8">Clinical Vitals Node</h3>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Real-time physiological tracking</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                   <Clock size={16} className="text-[#C5A069]" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">SYNCED: 14:45</span>
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <VitalMetric icon={<Thermometer className="text-orange-500" size={18} />} label="Temp" value="98.6" unit="°F" />
                <VitalMetric icon={<Heart className="text-rose-500" size={18} />} label="HR" value="72" unit="BPM" />
                <VitalMetric icon={<Zap className="text-blue-500" size={18} />} label="BG" value="110" unit="mg/dL" />
                <VitalMetric icon={<Activity className="text-emerald-500" size={18} />} label="SYS" value="120" unit="mmHg" />
                <VitalMetric icon={<Activity className="text-emerald-500" size={18} />} label="DIA" value="80" unit="mmHg" />
                <VitalMetric icon={<Activity className="text-sky-500" size={18} />} label="SpO2" value="98" unit="%" />
             </div>
          </div>

          <div className="bg-[#0B1D45] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
                <h4 className="text-[10px] font-black text-[#C5A069] uppercase tracking-[0.3em] mb-8">Clinical Reminders</h4>
                <div className="space-y-6">
                   <ReminderItem time="16:00" text="Medication: Tier 2 Hypertension Protocol" status="PENDING" />
                   <ReminderItem time="18:30" text="Nutritional Audit: Evening Meal hydration" status="UPCOMING" />
                   <div className="pt-6 border-t border-white/10">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">Protocol Policy Guide</p>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs text-white/70 italic leading-relaxed">
                         "Reminders follow the VACS Zero-Latency policy. Late logs trigger immediate RN oversight calls."
                      </div>
                   </div>
                </div>
             </div>
             <Clock size={180} className="absolute -bottom-10 -right-10 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
          </div>
       </div>

       {/* Caregiver Identity Protocol */}
       {caregiver && caregiver.status === 'locked_pending_review' && (
          <div className="bg-rose-50 border-2 border-rose-200 rounded-[2.5rem] p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-600/20">
                   <Lock size={32} />
                </div>
                <div>
                   <h4 className="text-xl font-black text-rose-900 tracking-tighter uppercase italic">Oversight Dispatch Alert</h4>
                   <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest mt-1">Temporary Care Team Reassignment in Progress</p>
                </div>
             </div>
             <p className="text-rose-700 text-xs font-bold leading-relaxed max-w-md italic">
               Our protocol audit has identified a temporary deviation in your assigned staff's ledger. A priority replacement node is being established to maintain your care continuity.
             </p>
          </div>
       )}

       {/* Caregiver Identity Protocol */}
       {caregiver ? (
          <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 group-hover:scale-110 transition-transform duration-1000"></div>
             <div className="flex flex-col gap-10 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                   <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-slate-100 border-4 border-white shadow-2xl shrink-0 group-hover:rotate-3 transition-transform">
                         <img 
                           src={caregiver.profileImage || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400"} 
                           alt="Caregiver" 
                           className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                         />
                      </div>
                      <div className="text-center md:text-left">
                         <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">{caregiver.fullName || caregiver.full_name}</h3>
                            <span className={cn(
                              "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border shadow-sm",
                              caregiver.verificationStatus === 'VERIFIED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                            )}>
                              {caregiver.verificationStatus === 'VERIFIED' ? "CLEARED FOR FIELD DISPATCH" : "Dispatch Suspended"}
                            </span>
                         </div>
                         <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] leading-none mb-1">Authenticated Professional Profile</p>
                         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-60">
                            {caregiver.role === 'CAREGIVER' ? 'HEALTH CARE ASSISTANT' : caregiver.role} • LICENSED IN FIELD • ID: #{caregiver.id?.slice(0, 8)}
                         </p>
                      </div>
                   </div>
                   
                   <div className="grid sm:grid-cols-2 gap-4">
                      <CaregiverContactItem 
                        icon={<Phone size={16} className="text-[#C5A069]" />} 
                        label="Secure Voice Node" 
                        value={caregiver.phoneNumber || caregiver.phone || "Encrypted Line"} 
                      />
                      <CaregiverContactItem 
                        icon={<Mail size={16} className="text-[#C5A069]" />} 
                        label="Protocol Relay Email" 
                        value={caregiver.email || "Encrypted Registry"} 
                      />
                   </div>
                </div>

                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 italic flex items-center gap-2">
                       <ShieldCheck size={14} className="text-[#C5A069]" /> Professional Narrative & Domain Expertise
                   </p>
                   <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {caregiver.bio || "Field Professional with specialized training in Tier 2 Chronic Care Management and geriatric respiratory support. Certified under the VACS clinical audit protocol."}
                   </p>
                </div>
             </div>
          </div>
       ) : (
          <div className="p-20 bg-white border border-slate-200 border-dashed rounded-[3rem] text-center opacity-40">
             <p className="text-sm font-black uppercase tracking-widest text-slate-400 italic">No Field Staff Assigned to this Node</p>
          </div>
       )}
    </div>
  );
}

export default function ClientDashboard({ user: initialUser, onLogout }: any) {
  const [user, setUser] = useState(initialUser);
  const [wallet, setWallet] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;
    
    const unsubUser = onSnapshot(doc(db, "users", auth.currentUser.uid), (snapshot) => {
      if (snapshot.exists()) {
        setUser({ ...auth.currentUser, ...snapshot.data() });
      }
    });

    const unsubWallet = onSnapshot(doc(db, "users", auth.currentUser.uid, "wallet", "main"), (snapshot) => {
      if (snapshot.exists()) {
        setWallet(snapshot.data());
      } else {
        setWallet({ balance: 0, currency: 'NGN' });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${auth.currentUser?.uid}/wallet/main`);
    });

    return () => {
       unsubUser();
       unsubWallet();
    };
  }, []);

  const menuItems = [
    { path: "/client", label: "Care Plans", icon: Heart },
    { path: "/client/downloads", label: "App Gateway", icon: Download },
    { path: "/client/logs", label: "Clinical Logs", icon: History },
    { path: "/client/billing", label: "Financial Ledger", icon: Wallet },
    { path: "/client/schedule", label: "Service Calendar", icon: Calendar },
    { path: "/client/support", label: "Protocol Support", icon: MessageSquare },
  ];

  const notifications = [
     { id: 1, type: 'ALERT', text: 'Caregiver Emma Wilson checked in at 08:02 AM.', time: '2h ago' },
     { id: 2, type: 'INFO', text: 'Vital Protocol March 11 verified by RN.', time: '5h ago' },
     { id: 3, type: 'WARNING', text: 'Wallet balance below ₦50,000. Top up soon.', time: '1d ago' },
  ];

  return (
    <div className="relative">
      <DashboardLayout user={user} onLogout={onLogout} menuItems={menuItems}>
        <div className="absolute top-8 right-8 z-[60] flex gap-4">
           <button 
             onClick={() => setShowNotifications(true)}
             className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all relative group"
           >
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-[#C5A069] rounded-full animate-pulse border border-[#0B1D45]"></span>
           </button>
        </div>

        <Routes>
          <Route index element={<ClientOverview client={user} wallet={wallet} />} />
          <Route path="downloads" element={<AppDownloadCenter role="client" />} />
          <Route path="logs" element={<ClientCareLogs />} />
          <Route path="billing" element={<ClientBilling wallet={wallet} />} />
          <Route path="schedule" element={<div className="p-12 text-center text-slate-400">Service Calendar Under Construction</div>} />
          <Route path="support" element={<ClientSupport />} />
          <Route path="*" element={<div className="p-12 text-center text-slate-400 font-black uppercase tracking-[0.3em] italic mt-20 opacity-40">Connecting to clinical node...</div>} />
        </Routes>
      </DashboardLayout>

      {/* Notifications Overlay */}
      <AnimatePresence>
         {showNotifications && (
            <>
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowNotifications(false)}
                  className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
               />
               <motion.div 
                  initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="fixed top-0 right-0 h-screen w-full max-w-sm bg-white z-[101] shadow-2xl flex flex-col"
               >
                  <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                     <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">System Bell</h3>
                     <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-900"><X size={24} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                     {notifications.map(n => (
                        <div key={n.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex gap-4">
                           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shrink-0">
                              {n.type === 'ALERT' ? <Zap size={16} className="text-blue-500" /> : <ShieldAlert size={16} className="text-amber-500" />}
                           </div>
                           <div>
                              <p className="text-xs font-bold text-slate-900 leading-relaxed">{n.text}</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{n.time}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>
    </div>
  );
}
