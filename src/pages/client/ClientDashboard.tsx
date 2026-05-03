import { Routes, Route, Link } from "react-router-dom";
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
  Clock
} from "lucide-react";
import { Button } from "../../components/ui/Button";

export default function ClientDashboard({ user, onLogout }: any) {
  const menuItems = [
    { path: "/client", label: "Care Protocol", icon: Heart },
    { path: "/client/logs", label: "Clinical Logs", icon: History },
    { path: "/client/billing", label: "Financial Ledger", icon: Wallet },
    { path: "/client/schedule", label: "Service Calendar", icon: Calendar },
    { path: "/client/support", label: "Protocol Support", icon: MessageSquare },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout} menuItems={menuItems}>
      <Routes>
        <Route index element={<ClientOverview />} />
        <Route path="logs" element={<ClientCareLogs />} />
        <Route path="billing" element={<ClientBilling />} />
        <Route path="*" element={<div className="p-12 text-center text-slate-400 font-black uppercase tracking-[0.3em] italic mt-20 opacity-40">Connecting to clinical node...</div>} />
      </Routes>
    </DashboardLayout>
  );
}

function ClientOverview() {
  return (
    <div className="space-y-10">
       <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="w-28 h-28 rounded-3xl overflow-hidden bg-slate-100 shrink-0 border-4 border-white shadow-xl relative z-10">
             <img src="https://images.unsplash.com/photo-1544120190-27583f2274a2?q=80&w=400" alt="Patient" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Margaret Stewart</h3>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Active Care</span>
             </div>
             <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-blue-500" /> Tier 2 Case Protocol</span>
                <span className="flex items-center gap-2"><Calendar size={14} className="text-slate-300" /> Inspection Passed: 01.03.2026</span>
             </div>
          </div>
          <div className="bg-slate-900 text-white p-8 rounded-[2rem] text-center min-w-[240px] shadow-2xl relative z-10 border border-slate-800">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 uppercase">Account Ledger</p>
             <h4 className="text-4xl font-black tracking-tighter mb-4">$480.00</h4>
             <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">Deposit Clinical Credits</button>
          </div>
       </div>

       {/* Diagnostic Vitals Protocol */}
       <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
             <div>
                <h3 className="font-black text-slate-900 text-2xl tracking-tighter italic uppercase underline decoration-blue-500/30 decoration-4 underline-offset-8">Clinical Vitals Node</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Real-time physiological telemetry from caregiver registry</p>
             </div>
             <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <Clock size={16} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Synced:</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">May 3, 2026 • 14:45</span>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
             <VitalMetric icon={<Thermometer className="text-orange-500" size={18} />} label="Body Temp" value="98.6" unit="°F" />
             <VitalMetric icon={<Heart className="text-rose-500" size={18} />} label="Heart Rate" value="72" unit="BPM" />
             <VitalMetric icon={<Zap className="text-blue-500" size={18} />} label="Glucose" value="110" unit="mg/dL" />
             <VitalMetric icon={<Activity className="text-emerald-500" size={18} />} label="Systolic" value="120" unit="mmHg" />
             <VitalMetric icon={<Activity className="text-emerald-500" size={18} />} label="Diastolic" value="80" unit="mmHg" />
             <VitalMetric icon={<Activity className="text-sky-500" size={18} />} label="Oxygen" value="98" unit="%" />
          </div>
       </div>

       <div className="grid lg:grid-cols-2 gap-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-slate-900 text-xl tracking-tight uppercase italic underline decoration-blue-500/30 decoration-4 underline-offset-8">Live Care Stream</h3>
                <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-500">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Synchronized
                </span>
             </div>
             <div className="space-y-10">
                <div className="relative pl-8 border-l-2 border-slate-100 space-y-3">
                   <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-xl shadow-blue-500/20"></div>
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Today, 14:45 • Vitals Record</p>
                   <p className="text-lg font-black text-slate-900 tracking-tight">Afternoon Vitals Stable & Verified</p>
                   <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      Margaret was alert and took her medications on time. We enjoyed a short walk in the garden today. 
                      She finished her entire lunch (Chicken Soup).
                   </p>
                </div>
                <div className="relative pl-8 border-l-2 border-slate-100 space-y-3 opacity-40 grayscale">
                   <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-300 rounded-full border-4 border-white shadow-sm"></div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Today, 09:00 • Deployment</p>
                   <p className="text-lg font-black text-slate-900 tracking-tight">Morning Shift Engagement Started</p>
                </div>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 text-xl tracking-tight uppercase italic underline decoration-amber-500/30 decoration-4 underline-offset-8">Service Calendar</h3>
                <Link to="/client/schedule" className="text-[10px] font-black uppercase tracking-widest text-blue-600">Full Schedule</Link>
             </div>
             <div className="space-y-4">
                {[
                  { day: "Tue 14", time: "08:00 - 16:00", staff: "Emma Wilson", role: "SCA" },
                  { day: "Wed 15", time: "08:00 - 16:00", staff: "Emma Wilson", role: "SCA" },
                  { day: "Thu 16", time: "08:00 - 16:00", staff: "John Doe", role: "HCA" },
                ].map((shift, i) => (
                   <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:border-slate-200 group">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-14 bg-white border border-slate-100 rounded-xl flex flex-col items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{shift.day.split(' ')[0]}</span>
                            <span className="text-xl font-black text-slate-900 leading-none tracking-tighter">{shift.day.split(' ')[1]}</span>
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-900 tracking-tight">{shift.time}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Field Staff: {shift.staff}</p>
                               <span className="px-1.5 py-0.5 bg-slate-200 text-[8px] font-black uppercase rounded text-slate-600">{shift.role}</span>
                            </div>
                         </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
}

function VitalMetric({ icon, label, value, unit }: any) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-[2rem] transition-all hover:bg-white hover:border-blue-500 hover:shadow-xl group">
       <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</div>
       <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-slate-900 tracking-tighter">{value}</span>
          <span className="text-[8px] font-black text-slate-400 uppercase">{unit}</span>
       </div>
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

function ClientBilling() {
   return (
      <div className="space-y-10">
         <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-slate-950 text-white p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden border border-slate-800">
               <div className="relative z-10">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Total Expenditure (MTD)</p>
                  <h4 className="text-6xl font-black tracking-tighter mb-10">$1,840.00</h4>
                  <div className="flex flex-wrap gap-4">
                     <Button className="h-12 px-8 rounded-full text-[10px] font-black uppercase tracking-widest bg-white text-slate-900 hover:bg-blue-50 shadow-xl shadow-white/5">Deposit Funds</Button>
                     <Button variant="ghost" className="h-12 px-8 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10 hover:bg-white/5">Account Controls</Button>
                  </div>
               </div>
               <div className="absolute bottom-0 right-0 p-10 opacity-5 -mb-10 -mr-10">
                  <Wallet size={200} />
               </div>
            </div>
            
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
               <h3 className="font-black text-slate-900 text-2xl tracking-tighter mb-4 flex items-center justify-between italic uppercase">
                  Care Guarantee
                  <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest not-italic border border-blue-100">VACS PROTECT™</span>
               </h3>
               <p className="text-sm text-slate-500 leading-relaxed mb-8 font-medium">
                  If hospitalization occurs, our <span className="text-slate-900 font-bold">Clinical Retention Clause</span> reduces billing to a 25% standby rate, ensuring your dedicated caregiver is reserved for your return.
               </p>
               <div className="p-5 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Retention Mode Status</span>
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full">Inactive</span>
               </div>
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
               <h3 className="font-black text-slate-900 text-xl tracking-tight uppercase italic">Financial Ledger</h3>
               <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cycle: Regional Weekly Audit</span>
                  <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest underline underline-offset-4">Statement Archive</button>
               </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                 <thead className="bg-slate-50 uppercase text-[9px] font-black tracking-[0.2em] text-slate-500">
                    <tr>
                       <th className="px-8 py-5">Invoice Node</th>
                       <th className="px-8 py-5">Engagement Period</th>
                       <th className="px-8 py-5 text-right">Credits</th>
                       <th className="px-8 py-5">Verified Status</th>
                       <th className="px-8 py-5">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    <InvoiceRow id="VACS-INV-0042" period="Mar 01 - Mar 07" amount="420.00" status="PAID" />
                    <InvoiceRow id="VACS-INV-0041" period="Feb 22 - Feb 28" amount="420.00" status="PAID" />
                    <InvoiceRow id="VACS-INV-0040" period="Feb 15 - Feb 21" amount="480.00" status="PAID" />
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
         <td className="px-8 py-6 text-sm font-black text-slate-900 italic tracking-tight">{id}</td>
         <td className="px-8 py-6 text-[11px] text-slate-500 font-mono italic tracking-tighter">{period}</td>
         <td className="px-8 py-6 text-sm font-black text-slate-900 text-right tracking-tighter">${amount}</td>
         <td className="px-8 py-6">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg border border-emerald-100 uppercase tracking-widest">{status}</span>
         </td>
         <td className="px-8 py-6">
            <Button variant="ghost" size="sm" className="text-blue-600 h-10 px-6 rounded-full border border-slate-100 hover:bg-white hover:shadow-lg hover:border-blue-200 text-[10px] font-black uppercase tracking-widest underline">Record View</Button>
         </td>
      </tr>
   );
}

function ChevronRight({ size, className }: any) {
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

