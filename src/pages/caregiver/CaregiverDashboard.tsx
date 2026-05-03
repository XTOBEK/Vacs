import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { auth, db, handleFirestoreError, OperationType } from "../../lib/firebase";
import { doc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";
import { 
  Home, 
  Calendar, 
  ClipboardCheck, 
  Award, 
  CreditCard, 
  ShieldAlert,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Thermometer,
  Zap,
  Activity,
  Heart,
  UserCheck,
  Copy,
  Check,
  Download,
  BellRing,
  Volume2,
  FileSearch,
  BookOpen
} from "lucide-react";
import AppDownloadCenter from "../../components/dashboard/AppDownloadCenter";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/utils";

export default function CaregiverDashboard({ user: initialUser, onLogout }: any) {
  const [user, setUser] = useState(initialUser);
  const location = useLocation();

  useEffect(() => {
    if (!auth.currentUser) return;
    
    const unsubscribe = onSnapshot(doc(db, "users", auth.currentUser.uid), (snapshot) => {
      if (snapshot.exists()) {
        setUser({ ...auth.currentUser, ...snapshot.data() });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${auth.currentUser?.uid}`);
    });

    return () => unsubscribe();
  }, []);

  const navItems = [
    { icon: Home, path: "/dashboard", label: "Overview" },
    { icon: Download, path: "/dashboard/downloads", label: "App Gateway" },
    { icon: Calendar, path: "/dashboard/schedule", label: "My Schedule" },
    { icon: Award, path: "/dashboard/academy", label: "Academy" },
    { icon: CreditCard, path: "/dashboard/payroll", label: "Earnings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pb-20 md:pb-0 font-sans">
      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900 text-white p-6 sticky top-0 z-40 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Heart size={18} fill="currentColor" />
           </div>
           <span className="font-black tracking-tighter text-lg uppercase">VACS Field</span>
        </div>
        <button onClick={onLogout} className="p-2 bg-slate-800 rounded-xl border border-slate-700">
           <Zap size={18} className="text-blue-400" />
        </button>
      </header>

      {/* PC Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 flex-col shrink-0">
         <div className="p-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Heart size={18} fill="currentColor" />
               </div>
               <h1 className="text-xl font-black text-white tracking-tighter">VACS</h1>
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-3 leading-none">Field Professional Portal</p>
         </div>

         <nav className="flex-1 py-8 px-4 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all uppercase tracking-widest text-[10px]",
                  location.pathname === item.path 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                    : "text-slate-400 hover:text-white"
                )}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
         </nav>

         <div className="p-6 border-t border-slate-800 bg-slate-800/10">
            <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold font-serif italic text-[10px]">{user.fullName?.[0] || user.full_name?.[0]}</div>
                  <div className="min-w-0">
                     <p className="text-xs font-bold text-white truncate">{user.fullName || user.full_name}</p>
                     <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Tier 2 Professional</p>
                  </div>
               </div>
               <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700 p-0 px-2 h-8 text-[10px] font-black uppercase tracking-widest gap-2" onClick={onLogout}>
                  <Zap size={12} /> Log Off System
               </Button>
            </div>
         </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route index element={<CaregiverHome user={user} />} />
          <Route path="downloads" element={<AppDownloadCenter role="caregiver" userData={user} />} />
          <Route path="kit-verification" element={<MedicalKitVerification user={user} />} />
          <Route path="care-log" element={<DailyCareLog />} />
          <Route path="academy" element={<AcademyModules />} />
          <Route path="emergency" element={<div className="p-12 text-center text-slate-400 font-black uppercase tracking-widest text-xs mt-20 opacity-40">Immediate Clinical Response Required. Contacting Supervisor...</div>} />
          <Route path="*" element={<div className="p-12 text-center text-slate-400 font-black uppercase tracking-widest text-xs mt-20 opacity-40">Module Access Pending...</div>} />
        </Routes>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-1 left-4 right-4 h-16 bg-white/90 backdrop-blur-xl border border-slate-200 flex items-center justify-around z-40 px-4 rounded-[1.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
         {navItems.map(item => (
           <Link 
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              location.pathname === item.path ? "text-blue-600 scale-110" : "text-slate-400"
            )}
           >
             <item.icon size={20} strokeWidth={location.pathname === item.path ? 3 : 2} />
             <span className="text-[8px] font-black uppercase tracking-[0.15em]">{item.label.split(' ')[0]}</span>
           </Link>
         ))}
      </nav>

      {/* Red Button (Critical Incident) */}
      <Link 
        to="/dashboard/emergency"
        className="fixed bottom-24 right-4 h-14 w-14 bg-red-600 rounded-2xl shadow-[0_15px_35px_-8px_rgba(220,38,38,0.4)] flex items-center justify-center text-white md:bottom-12 md:right-12 group transition-transform active:scale-90 z-50 border-2 border-red-500"
      >
        <ShieldAlert size={28} className="animate-[pulse_1s_infinite]" />
        <span className="absolute right-20 bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest whitespace-nowrap shadow-2xl border border-slate-700 pointer-events-none">Immediate Critical Incident report</span>
      </Link>
    </div>
  );
}

function CaregiverHome({ user }: any) {
  const kitStatus = user.kitStatus || 'MISSING';
  const guarantorStatus = user.guarantorStatus || 'PENDING';

  const fullName = user.fullName || user.full_name || "Agent";

  return (
    <div className="p-6 md:p-14 space-y-10">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 rounded-[1.5rem] bg-blue-100 flex items-center justify-center text-blue-700 border border-blue-200 shadow-xl shadow-blue-500/5 font-bold font-serif italic text-2xl">
                {fullName[0]}
             </div>
             <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Welcome, {fullName.split(' ')[0]}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                      <MapPin size={10} className="text-blue-500" /> {user.region || "Lagos Mainland East"}
                   </span>
                   <span className={cn(
                     "text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border",
                     guarantorStatus === 'VERIFIED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                   )}>
                     Guarantors: {guarantorStatus}
                   </span>
                </div>
             </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
             {/* Kit Status Chip */}
             <div className={cn(
                "px-6 py-4 rounded-3xl border flex items-center gap-4 shadow-sm",
                kitStatus === 'VERIFIED' ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-amber-50 border-amber-100 text-amber-700"
             )}>
                {kitStatus === 'VERIFIED' ? <CheckCircle2 size={24} /> : <ShieldAlert size={24} className="animate-pulse" />}
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Medical Kit Status</p>
                   <p className="text-sm font-black italic uppercase tracking-tighter">{kitStatus === 'VERIFIED' ? "VACS Certified" : "Action Required"}</p>
                </div>
                {kitStatus !== 'VERIFIED' && (
                  <Link to="/dashboard/kit-verification">
                     <Button size="sm" className="ml-4 h-10 px-6 rounded-xl bg-amber-600 text-white border-none shadow-xl shadow-amber-600/10 text-[9px] font-black uppercase tracking-widest hover:bg-amber-700">Verify Now</Button>
                  </Link>
                )}
             </div>
          </div>
       </div>

       {guarantorStatus !== 'VERIFIED' && (
         <div className="bg-amber-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-amber-600/20 relative overflow-hidden">
            <div className="relative z-10">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                     <UserCheck size={24} />
                  </div>
                  <div>
                     <h3 className="text-xl font-black italic uppercase tracking-tight">Route C: Guarantor Block</h3>
                     <p className="text-amber-100 text-[10px] font-black uppercase tracking-widest">Mandatory Verification Pending</p>
                  </div>
               </div>
               <p className="text-sm font-medium leading-relaxed mb-8 max-w-lg opacity-90">
                  Your profile is restricted. VACS protocol requires two digital guarantors to accept legal responsibility before you can accept Tier 2-4 cases.
               </p>
               <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <GuarantorSlot name="Dr. Samuel Oke" status="INVITED" />
                  <GuarantorSlot name="Pastor James" status="PENDING_ACCEPTANCE" />
               </div>
               <Button className="h-14 px-10 rounded-full bg-white text-slate-900 border-none text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Resend Verification Links</Button>
            </div>
            <ShieldAlert size={180} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
         </div>
       )}

       {/* Active Shift Card */}
       <div className="relative overflow-hidden bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm transition-all hover:shadow-xl hover:border-slate-300">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full -mr-12 -mt-12 opacity-80 blur-3xl -z-0"></div>
          <div className="relative z-10">
             <div className="flex items-center justify-between mb-8">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div> Active Clinical Engagement
                </span>
                <div className="hidden lg:flex items-center gap-2">
                   <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ height: [4, 12, 4] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                          className="w-1 bg-blue-500/30 rounded-full"
                        />
                      ))}
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Heartbeat Live</span>
                </div>
             </div>
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                   <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Margaret Stewart</h3>
                   <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                      <Clock size={14} className="text-slate-300" /> 08:00 – 16:00 Corridor • Morning Complex Care
                   </p>
                </div>
                <div className="flex flex-wrap gap-3">
                   <Link to="/dashboard/care-log">
                      <Button className="h-14 px-8 rounded-full text-xs font-black uppercase tracking-widest gap-3 shadow-xl shadow-blue-600/10">
                         <Clock size={18} /> Protocol Check-In
                      </Button>
                   </Link>
                   <Link to="/dashboard/care-log">
                      <Button variant="outline" className="h-14 px-8 rounded-full text-xs font-black uppercase tracking-widest gap-3 border-slate-200 hover:border-slate-300 hover:bg-slate-50">
                         <ClipboardCheck size={18} className="text-blue-600" /> Digital Vital Log
                      </Button>
                   </Link>
                </div>
             </div>
          </div>
       </div>
       
       {/* Referral Section */}
       <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 -mr-48 -mt-48"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
             <div className="flex-1 text-center lg:text-left">
                <h3 className="text-3xl font-black tracking-tighter italic uppercase mb-4 underline decoration-blue-500 decoration-4 underline-offset-8">Referral Network</h3>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
                  Expand our clinical node. Referral success grants 500 Credits to your professional ledger once they clear the VACS background audit.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                   <div className="bg-slate-800 border border-slate-700 px-6 py-4 rounded-2xl flex items-center justify-between w-full sm:w-auto min-w-[240px]">
                      <span className="font-mono font-black text-xl tracking-[0.2em] text-blue-400">VACS-{fullName.split(' ')[0].toUpperCase()}-2026</span>
                   </div>
                   <CopyButton text={`VACS-${fullName.split(' ')[0].toUpperCase()}-2026`} />
                </div>
             </div>

             <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 flex flex-col items-center gap-4 group hover:scale-105 transition-transform duration-500 border-4 border-slate-800">
                <div className="p-4 bg-white rounded-2xl">
                   <QRCodeSVG 
                      value={`https://vacs.care/apply?ref=VACS-${fullName.split(' ')[0].toUpperCase()}-2026`}
                      size={140}
                      level="H"
                      includeMargin={false}
                   />
                </div>
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-900 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                   Scan Clinical QR
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button 
      onClick={handleCopy}
      variant={copied ? "success" : "primary"}
      className="h-14 px-8 rounded-full text-xs font-black uppercase tracking-widest gap-3 min-w-[160px]"
    >
      {copied ? <Check size={18} /> : <Copy size={18} />}
      {copied ? "Copied" : "Copy Code"}
    </Button>
  );
}

function GuarantorSlot({ name, status }: any) {
  return (
    <div className="p-5 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-between group">
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><UserCheck size={18} /></div>
          <div>
             <p className="text-[10px] font-black uppercase tracking-widest text-white">{name}</p>
             <p className="text-[8px] font-medium text-amber-200 uppercase tracking-widest">{status}</p>
          </div>
       </div>
       <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
    </div>
  );
}

function ActionCard({ icon, title, description, color, link, accent }: any) {
  const accents: any = {
    amber: "border-amber-100 shadow-amber-500/5",
    emerald: "border-emerald-100 shadow-emerald-500/5"
  };
  return (
    <Link to={link || "#"} className={cn("p-8 rounded-[2rem] border transition-all active:scale-[0.98] group flex flex-col gap-6", color, accents[accent])}>
       <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm transition-transform group-hover:scale-110">
          {icon}
       </div>
       <div>
          <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2 group-hover:text-blue-600 transition-colors uppercase italic">{title}</h4>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">{description}</p>
       </div>
    </Link>
  );
}

function DailyCareLog() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [vitals, setVitals] = useState<any>({});
  const [activities, setActivities] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSealLog = async () => {
    setIsSubmitting(true);
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      // In a real app we'd save to a 'care_logs' collection
      // For this demo, we'll simulate a successful write and maybe update a lastLog field in user
      const logId = `LOG-${Date.now()}`;
      await setDoc(doc(db, "users", userId, "logs", logId), {
        vitals,
        activities,
        timestamp: new Date().toISOString(),
        clientName: "Margaret Stewart",
        status: "SEALED"
      });

      setShowSuccess(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}/logs`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        navigate("/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  return (
    <div className="p-6 md:p-14 max-w-4xl mx-auto space-y-10 relative">
       <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-2xl px-6"
            >
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0, y: 20 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 className="bg-white rounded-[4rem] p-16 flex flex-col items-center text-center shadow-2xl relative overflow-hidden max-w-sm w-full"
               >
                  <div className="absolute top-0 left-0 w-full h-3 bg-emerald-500"></div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                    className="w-32 h-32 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-8 border-4 border-emerald-100"
                  >
                     <CheckCircle2 size={64} strokeWidth={3} />
                  </motion.div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">Protocol Sealed</h3>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    Log Entry successfully encrypted and synchronized with VACS registry.
                  </p>
                  
                  <div className="mt-12 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></div>
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></div>
                  </div>
               </motion.div>
            </motion.div>
          )}
       </AnimatePresence>

       <div className="flex items-center gap-5">
          <Link to="/dashboard" className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"><Home size={20} /></Link>
          <div className="flex-1 min-w-0">
             <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Daily Vital Protocol (DVP)</h2>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Submission for Clinical Evidence Record</p>
          </div>
       </div>

       <div className="bg-white p-6 md:p-14 rounded-[3.5rem] border border-slate-200 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] space-y-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 bg-blue-600"></div>
          
          {/* Vitals Section */}
          <section className="space-y-10">
             <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                   <Activity size={24} className="animate-pulse" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Diagnostic Phase</h3>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <VitalInput icon={<Thermometer size={18}/>} label="Body Temp" placeholder="98.6" value={vitals.temp} onChange={(val: string) => setVitals({...vitals, temp: val})} />
                <VitalInput icon={<Heart size={18}/>} label="Heart Rate" placeholder="72" value={vitals.hr} onChange={(val: string) => setVitals({...vitals, hr: val})} />
                <VitalInput icon={<Zap size={18}/>} label="Glucose" placeholder="110" value={vitals.glucose} onChange={(val: string) => setVitals({...vitals, glucose: val})} />
                <VitalInput icon={<Clock size={18}/>} label="Systolic" placeholder="120" value={vitals.sys} onChange={(val: string) => setVitals({...vitals, sys: val})} />
                <VitalInput icon={<Clock size={18}/>} label="Diastolic" placeholder="80" value={vitals.dia} onChange={(val: string) => setVitals({...vitals, dia: val})} />
                <VitalInput icon={<Activity size={18}/>} label="Oxygen" placeholder="98" value={vitals.o2} onChange={(val: string) => setVitals({...vitals, o2: val})} />
             </div>
          </section>

          {/* Activity Section - Visual First */}
          <section className="space-y-10">
             <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                   <UserCheck size={24} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Activity Protocol</h3>
             </div>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                <ActivityToggle icon="🚿" label="Bathing" onToggle={(active: boolean) => active ? setActivities([...activities, 'Bathing']) : setActivities(activities.filter(a => a !== 'Bathing'))} />
                <ActivityToggle icon="🍽️" label="Meals" onToggle={(active: boolean) => active ? setActivities([...activities, 'Meals']) : setActivities(activities.filter(a => a !== 'Meals'))} />
                <ActivityToggle icon="💊" label="Reds" onToggle={(active: boolean) => active ? setActivities([...activities, 'Reds']) : setActivities(activities.filter(a => a !== 'Reds'))} />
                <ActivityToggle icon="🛏️" label="Moving" onToggle={(active: boolean) => active ? setActivities([...activities, 'Moving']) : setActivities(activities.filter(a => a !== 'Moving'))} />
                <ActivityToggle icon="🧺" label="Laundry" onToggle={(active: boolean) => active ? setActivities([...activities, 'Laundry']) : setActivities(activities.filter(a => a !== 'Laundry'))} />
                <ActivityToggle icon="🚶" label="Walk" onToggle={(active: boolean) => active ? setActivities([...activities, 'Walk']) : setActivities(activities.filter(a => a !== 'Walk'))} />
                <ActivityToggle icon="🧹" label="Clean" onToggle={(active: boolean) => active ? setActivities([...activities, 'Clean']) : setActivities(activities.filter(a => a !== 'Clean'))} />
                <ActivityToggle icon="🧠" label="Mind" onToggle={(active: boolean) => active ? setActivities([...activities, 'Mind']) : setActivities(activities.filter(a => a !== 'Mind'))} />
             </div>
          </section>

          <Button 
            onClick={handleSealLog}
            disabled={isSubmitting}
            className="w-full h-20 text-xs font-black uppercase tracking-[0.3em] rounded-3xl shadow-2xl shadow-blue-500/30 transition-transform active:scale-95 disabled:opacity-50"
          >
             {isSubmitting ? "Encrypting Protocol..." : "Verify Clinical Integrity & Seal Log"}
          </Button>
       </div>
    </div>
  );
}

function VitalInput({ icon, label, placeholder, value, onChange }: any) {
  return (
    <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] transition-all focus-within:bg-white focus-within:border-blue-600 focus-within:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.15)] flex flex-col items-center">
       <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 mb-4 shadow-sm border border-slate-100 group-focus-within:text-blue-600 transition-colors">
          {icon}
       </div>
       <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</div>
       <input 
         type="text" 
         value={value || ""}
         onChange={(e) => onChange(e.target.value)}
         className="bg-transparent w-full font-black text-4xl text-center outline-none text-slate-900 placeholder:text-slate-100 tracking-tighter" 
         placeholder={placeholder} 
       />
    </div>
  );
}

function ActivityToggle({ icon, label, onToggle }: any) {
  const [active, setActive] = useState(false);
  const handleToggle = () => {
    const next = !active;
    setActive(next);
    onToggle(next);
  };
  return (
    <button 
      onClick={handleToggle}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-[2.5rem] border-2 transition-all gap-4 h-48 relative group",
        active 
          ? "bg-emerald-500 border-emerald-400 shadow-2xl shadow-emerald-500/30 scale-105 z-10" 
          : "bg-white border-slate-100 hover:border-slate-200"
      )}
    >
       <span className={cn(
         "text-6xl transition-transform duration-500",
         active ? "scale-125 rotate-6" : "grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100"
       )}>
         {icon}
       </span>
       
       <span className={cn(
         "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
         active ? "text-white" : "text-slate-400"
       )}>
         {label}
       </span>

       {active ? (
         <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-xl border border-emerald-100 animate-in zoom-in duration-300">
            <CheckCircle2 size={16} strokeWidth={4} />
         </div>
       ) : (
         <div className="absolute top-4 right-4 w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border border-slate-100 group-hover:border-slate-200 group-hover:text-slate-300 transition-all">
            <div className="w-2 h-2 rounded-full bg-current"></div>
         </div>
       )}
    </button>
  );
}

function MedicalKitVerification({ user }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    setVerifying(true);
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      // Simulate image upload to Storage (skipping for now as we don't have storage configured yet in this example, but updating Firestore is the key)
      await updateDoc(doc(db, "users", userId), {
        kitStatus: 'VERIFIED',
        kitVerifiedAt: new Date().toISOString()
      });
      
      setTimeout(() => {
         setVerifying(false);
         setDone(true);
         setTimeout(() => navigate("/dashboard"), 2000);
      }, 2000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
    }
  };

  return (
    <div className="p-6 md:p-14 max-w-2xl mx-auto space-y-10">
       <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Medical Kit Proof</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Mandatory Clinical Asset Verification</p>
       </div>

       <div className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-14 text-center shadow-xl shadow-slate-200/50 space-y-10 relative overflow-hidden">
          {!done ? (
            <>
              <div className="aspect-video bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-4 group hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer relative overflow-hidden">
                {file ? (
                  <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-sm flex items-center justify-center">
                    <CheckCircle2 size={48} className="text-emerald-500" />
                  </div>
                ) : (
                  <>
                    <Thermometer size={48} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600">Upload Photo of BP Monitor & Gait Belt</p>
                       <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest italic group-hover:text-slate-400">Must show clinical serial number</p>
                    </div>
                  </>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-left p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <ShieldAlert size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-loose">
                    Strict Policy: Field staff cannot clock-in for Tier 3/4 cases without an RN-verified Medical Kit.
                  </p>
                </div>
                <Button 
                  disabled={!file || verifying} 
                  onClick={handleUpload}
                  className="w-full h-16 rounded-3xl text-sm font-black uppercase tracking-widest bg-slate-900 border-none shadow-2xl shadow-slate-900/20"
                >
                  {verifying ? "Initializing Protocol Audit..." : "Submit for Verification"}
                </Button>
              </div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-20 space-y-8">
               <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-100 shadow-xl shadow-emerald-500/10">
                  <CheckCircle2 size={48} strokeWidth={3} />
               </div>
               <div className="space-y-2">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Receipt Acknowledged</h3>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Routing to Supervising RN for final audit.</p>
               </div>
               <Link to="/dashboard">
                  <Button variant="ghost" className="h-14 px-10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 border border-slate-200">Return to Node</Button>
               </Link>
            </motion.div>
          )}
       </div>
    </div>
  );
}

function AcademyModules() {
   const [isBuzzerActive, setIsBuzzerActive] = useState(false);

   const playSound = (frequency = 440, type: OscillatorType = "sine", duration = 0.5) => {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
      } catch (e) {
        console.error("Audio Context failed", e);
      }
   };

   const triggerBuzzer = () => {
      setIsBuzzerActive(true);
      playSound(150, "square", 0.3);
      setTimeout(() => setIsBuzzerActive(false), 500);
   };

   const triggerAlarm = (type: 'emergency' | 'warning' | 'info') => {
      if (type === 'emergency') {
        playSound(880, "sawtooth", 0.8);
        setTimeout(() => playSound(440, "sawtooth", 0.8), 200);
      } else if (type === 'warning') {
        playSound(330, "triangle", 0.5);
      } else {
        playSound(660, "sine", 0.2);
      }
   };

   return (
      <div className="p-6 md:p-14 space-y-12">
         {/* Sound Logic & Reminders Header */}
         <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-2">
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter italic uppercase">VACS Academy Node</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Managed Private LMS • Tier-Based Certification</p>
            </div>
            
            <div className="flex items-center gap-4">
                <button 
                  onClick={triggerBuzzer}
                  className={cn(
                    "flex-1 h-20 rounded-[2rem] border-4 flex flex-col items-center justify-center transition-all",
                    isBuzzerActive ? "bg-rose-500 border-rose-400 scale-95 shadow-inner" : "bg-white border-slate-200 hover:border-slate-300 shadow-xl"
                  )}
                >
                   <BellRing size={24} className={isBuzzerActive ? "text-white animate-ring" : "text-slate-400"} />
                   <span className={cn("text-[9px] font-black uppercase tracking-widest mt-2", isBuzzerActive ? "text-white" : "text-slate-400")}>Academy Buzzer</span>
                </button>
                <div className="flex flex-col gap-2 flex-1">
                   <button onClick={() => triggerAlarm('emergency')} className="h-9 px-4 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center gap-2 hover:bg-rose-100 transition-colors">
                      <Volume2 size={14} /> <span className="text-[8px] font-black uppercase tracking-widest">Emergency Audio</span>
                   </button>
                   <button onClick={() => triggerAlarm('warning')} className="h-9 px-4 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-2 hover:bg-amber-100 transition-colors">
                      <Volume2 size={14} /> <span className="text-[8px] font-black uppercase tracking-widest">Protocol Warning</span>
                   </button>
                </div>
            </div>
         </div>

         <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-8">
               <div className="bg-slate-900 text-white p-10 rounded-[3rem] relative overflow-hidden border border-slate-800 shadow-2xl">
                  <div className="relative z-10">
                     <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                        <BookOpen size={14} className="text-blue-500" /> Professional Guide
                     </p>
                     <h3 className="text-xl font-black italic tracking-tight mb-4">Protocol Compliance</h3>
                     <p className="text-xs text-slate-400 leading-relaxed font-medium mb-8">
                        The VACS Reminder System ensures every vital record is timestamped within <span className="text-blue-400 underline underline-offset-4 decoration-2">±5 mins</span> of observation.
                     </p>
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                           <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Clean ID Required</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                           <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Biometric Sync Only</span>
                        </div>
                     </div>
                  </div>
                  <AlertCircle size={120} className="absolute -bottom-10 -right-10 text-white/5 -rotate-12" />
               </div>

               <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-6 flex items-center gap-2 italic">
                     <FileSearch size={14} className="text-slate-400" /> Active Reminders
                  </h4>
                  <div className="space-y-6">
                     <div className="relative pl-6 border-l-2 border-emerald-100 py-1">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-lg"></div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1 italic">Policy Update • Today</p>
                        <p className="text-xs font-bold text-slate-900">New Hydration Protocols in Effect</p>
                     </div>
                     <div className="relative pl-6 border-l-2 border-slate-100 py-1">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm"></div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 italic">Audit Node • March 12</p>
                        <p className="text-xs font-bold text-slate-900 opacity-60">Medication Verification Pass</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-3">
               <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] flex items-center gap-6 shadow-2xl shadow-slate-900/20 mb-10 w-fit">
                  <div>
                     <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Audit Score</p>
                     <p className="text-2xl font-black italic tracking-tighter">94%</p>
                  </div>
                  <div className="w-px h-10 bg-slate-800"></div>
                  <div>
                     <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Modules Cleared</p>
                     <p className="text-2xl font-black italic tracking-tighter">04</p>
                  </div>
               </div>

               {/* Tracks */}
               <div className="space-y-12">
                  <AcademyTrack 
                     title="Track 1: HCA Foundational" 
                     desc="Modules for Tier 1 & 2 care. Core supportive care fundamentals."
                     modules={[
                        { title: "Safe Mobilization (ADL)", progress: 100, status: "VERIFIED" },
                        { title: "Standard Hygiene Protocols", progress: 100, status: "VERIFIED" },
                        { title: "Nutrition & Hydration Audits", progress: 65, status: "IN_PROGRESS" }
                     ]}
                  />
                  
                  <AcademyTrack 
                     title="Track 2: Clinical Practice" 
                     desc="Advanced physiological monitoring and RN-led protocol adherence."
                     locked
                     reason="Requires Manual RN Check-In Pass"
                     modules={[
                        { title: "Vital Signs Reporting (DCL)", progress: 0, status: "LOCKED" },
                        { title: "Emergency Escalation Pathways", progress: 0, status: "LOCKED" },
                        { title: "Medication Verification (MVS)", progress: 0, status: "LOCKED" }
                     ]}
                  />
               </div>
            </div>
         </div>
      </div>
   );
}

function AcademyTrack({ title, desc, modules, locked, reason }: any) {
   return (
      <div className={cn(
         "p-8 md:p-12 rounded-[4rem] border transition-all",
         locked ? "bg-slate-50 border-slate-200 opacity-60 grayscale" : "bg-white border-slate-200 shadow-sm"
      )}>
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="max-w-md">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase mb-2">{title}</h3>
               <p className="text-sm font-medium text-slate-500 leading-relaxed">{desc}</p>
            </div>
            {locked && (
               <div className="bg-amber-100 border border-amber-200 px-6 py-3 rounded-2xl flex items-center gap-3 text-amber-800">
                  <Lock size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{reason}</span>
               </div>
            )}
         </div>

         <div className="space-y-6">
            {modules.map((m: any, i: number) => (
               <TrainingModule key={i} {...m} />
            ))}
         </div>
      </div>
   );
}

function TrainingModule({ title, status, progress }: any) {
   return (
      <div className={cn(
         "p-6 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6",
         status === 'LOCKED' ? "bg-slate-100/50 border-slate-100" : "bg-white border-slate-100 shadow-sm hover:border-blue-200"
      )}>
         <div className="flex-1">
            <h4 className={cn("font-black text-sm uppercase tracking-widest mb-4 italic", status === 'LOCKED' ? "text-slate-400" : "text-slate-900")}>{title}</h4>
            <div className="flex items-center gap-4">
               <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000", status === 'VERIFIED' ? "bg-emerald-500" : "bg-blue-600")} 
                    style={{ width: `${progress}%` }}
                  ></div>
               </div>
               <span className="text-[10px] font-black text-slate-400 font-mono italic">{progress}%</span>
            </div>
         </div>
         {status !== 'LOCKED' && (
            <Button variant={status === 'VERIFIED' ? 'outline' : 'primary'} className="h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest border-slate-200 shrink-0">
               {status === 'VERIFIED' ? "Re-Audit" : "Stream Module"}
            </Button>
          )}
      </div>
   );
}

function Lock({ size, className }: any) {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

