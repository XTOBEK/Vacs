import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
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
  Check
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/utils";

export default function CaregiverDashboard({ user, onLogout }: any) {
  const location = useLocation();

  const navItems = [
    { icon: Home, path: "/dashboard", label: "Overview" },
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
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold font-serif italic text-[10px]">{user.full_name[0]}</div>
                  <div className="min-w-0">
                     <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
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
          <Route path="care-log" element={<DailyCareLog />} />
          <Route path="academy" element={<AcademyModules />} />
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
  return (
    <div className="p-6 md:p-14 space-y-10">
       <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-[1.5rem] bg-blue-100 flex items-center justify-center text-blue-700 border border-blue-200 shadow-xl shadow-blue-500/5 font-bold font-serif italic text-2xl">
             {user.full_name[0]}
          </div>
          <div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Welcome, {user.full_name.split(' ')[0]}</h2>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
                <MapPin size={12} className="text-blue-500" /> Lagos Mainland East • Active Service Zone
             </p>
          </div>
       </div>

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
                   <Button className="h-14 px-8 rounded-full text-xs font-black uppercase tracking-widest gap-3 shadow-xl shadow-blue-600/10">
                      <Clock size={18} /> Protocol Check-In
                   </Button>
                   <Link to="/dashboard/care-log">
                      <Button variant="outline" className="h-14 px-8 rounded-full text-xs font-black uppercase tracking-widest gap-3 border-slate-200 hover:border-slate-300 hover:bg-slate-50">
                         <ClipboardCheck size={18} className="text-blue-600" /> Digital Vital Log
                      </Button>
                   </Link>
                </div>
             </div>
          </div>
       </div>

       <div className="grid md:grid-cols-2 gap-8 pt-4">
          <ActionCard 
            icon={<Award className="text-amber-500" />}
            title="Professional Academy"
            description="Complete the 40h Dementia protocol to unlock your Tier 3 Certificate status."
            color="bg-white"
            link="/dashboard/academy"
            accent="amber"
          />
          <ActionCard 
            icon={<CreditCard className="text-emerald-500" />}
            title="Field Remuneration"
            description="Track your verifiable base earnings, clinical premiums, and referrals."
            color="bg-white"
            link="/dashboard/payroll"
            accent="emerald"
          />
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
                      <span className="font-mono font-black text-xl tracking-[0.2em] text-blue-400">VACS-{user.full_name.split(' ')[0].toUpperCase()}-2026</span>
                   </div>
                   <CopyButton text={`VACS-${user.full_name.split(' ')[0].toUpperCase()}-2026`} />
                </div>
             </div>

             <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 flex flex-col items-center gap-4 group hover:scale-105 transition-transform duration-500 border-4 border-slate-800">
                <div className="p-4 bg-white rounded-2xl">
                   <QRCodeSVG 
                      value={`https://vacs.care/apply?ref=VACS-${user.full_name.split(' ')[0].toUpperCase()}-2026`}
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
  const navigate = useNavigate();

  const handleSealLog = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1500);
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
                    Log Entry #5422 successfully encrypted and synchronized with VACS registry.
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
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Submission for ID #5422 • Clinical Evidence Record</p>
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
                <VitalInput icon={<Thermometer size={18}/>} label="Body Temp" placeholder="98.6" />
                <VitalInput icon={<Heart size={18}/>} label="Heart Rate" placeholder="72" />
                <VitalInput icon={<Zap size={18}/>} label="Glucose" placeholder="110" />
                <VitalInput icon={<Clock size={18}/>} label="Systolic" placeholder="120" />
                <VitalInput icon={<Clock size={18}/>} label="Diastolic" placeholder="80" />
                <VitalInput icon={<Activity size={18}/>} label="Oxygen" placeholder="98" />
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
                <ActivityToggle icon="🚿" label="Bathing" />
                <ActivityToggle icon="🍽️" label="Meals" />
                <ActivityToggle icon="💊" label="Reds" />
                <ActivityToggle icon="🛏️" label="Moving" />
                <ActivityToggle icon="🧺" label="Laundry" />
                <ActivityToggle icon="🚶" label="Walk" />
                <ActivityToggle icon="🧹" label="Clean" />
                <ActivityToggle icon="🧠" label="Mind" />
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

function VitalInput({ icon, label, placeholder }: any) {
  return (
    <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] transition-all focus-within:bg-white focus-within:border-blue-600 focus-within:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.15)] flex flex-col items-center">
       <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 mb-4 shadow-sm border border-slate-100 group-focus-within:text-blue-600 transition-colors">
          {icon}
       </div>
       <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</div>
       <input 
         type="text" 
         className="bg-transparent w-full font-black text-4xl text-center outline-none text-slate-900 placeholder:text-slate-100 tracking-tighter" 
         placeholder={placeholder} 
       />
    </div>
  );
}

function ActivityToggle({ icon, label }: any) {
  const [active, setActive] = useState(false);
  return (
    <button 
      onClick={() => setActive(!active)}
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

function AcademyModules() {
   return (
      <div className="p-6 md:p-14 space-y-10">
         <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">VACS Academy</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Global Standards in Domiciliary Care Excellence</p>
         </div>
         <div className="space-y-4">
            <TrainingModule 
               title="Dementia Care Fundamentals" 
               status="COMPLETED" 
               tier="Tier 3 Required" 
               progress={100}
            />
            <TrainingModule 
               title="Emergency First Aid & Trauma" 
               status="IN_PROGRESS" 
               tier="Base Requirement" 
               progress={45} 
            />
            <TrainingModule 
               title="Clinical Gait Belt Safety" 
               status="NOT_STARTED" 
               tier="Practical Audit" 
               progress={0} 
            />
         </div>
      </div>
   );
}

function TrainingModule({ title, status, tier, progress }: any) {
   return (
      <div className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all hover:border-slate-300">
         <div className="flex-1 md:mr-8">
            <div className="flex items-center gap-3 mb-3">
               <h4 className="font-black text-slate-800 text-lg tracking-tight uppercase italic">{title}</h4>
               <span className="px-2 py-0.5 bg-slate-900 text-[8px] font-black uppercase rounded-lg text-white tracking-widest">{tier}</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }}></div>
               </div>
               <span className="text-[10px] font-black text-slate-500 font-mono italic">{progress}%</span>
            </div>
         </div>
         <Button variant={status === 'COMPLETED' ? 'outline' : 'primary'} className="h-10 px-8 rounded-full text-[10px] font-black uppercase tracking-widest border-slate-200">
            {status === 'COMPLETED' ? "Protocol Review" : "Continue Module"}
         </Button>
      </div>
   );
}

