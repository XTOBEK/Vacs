import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { 
  Users, 
  ShieldAlert, 
  Activity, 
  ClipboardCheck, 
  MapPin,
  Bell,
  Stethoscope
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/utils";

export default function RNDashboard({ user, onLogout }: any) {
  const menuItems = [
    { path: "/rn", label: "Clinical Center", icon: Stethoscope },
    { path: "/rn/audit", label: "Protocol Audit", icon: ClipboardCheck },
    { path: "/rn/alerts", label: "Critical Alerts", icon: Bell },
    { path: "/rn/staff", label: "Staff Performance", icon: Activity },
    { path: "/rn/scheduling", label: "Shift Logistics", icon: MapPin },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout} menuItems={menuItems}>
      <Routes>
        <Route index element={<RNOverview />} />
        <Route path="audit" element={<ClinicalAudit />} />
        <Route path="alerts" element={<AlertTracker />} />
        <Route path="*" element={<div className="p-12 text-center text-gray-400 font-serif italic">Accessing clinical database...</div>} />
      </Routes>
    </DashboardLayout>
  );
}

function RNOverview() {
  return (
    <div className="space-y-8">
       <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <span className="px-2 py-1 bg-blue-600 text-[10px] font-bold rounded uppercase tracking-widest">Clinical Protocol v2.4</span>
                 <div className="h-1 w-1 bg-slate-700 rounded-full"></div>
                 <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Real-time Feed</span>
              </div>
              <h3 className="text-3xl font-bold mb-2 tracking-tight">Clinical Command Center</h3>
              <p className="text-slate-400 text-sm max-w-sm">Overseeing <span className="text-white font-bold underline decoration-blue-500">2 active critical flags</span> across Lagos Mainland and Lekki corridors.</p>
            </div>
            <div className="hidden md:block">
               <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">Response Readiness</p>
                  <p className="text-2xl font-black text-blue-400 font-mono tracking-tighter">98.2%</p>
               </div>
            </div>
          </div>
          <Activity className="absolute top-1/2 right-12 -translate-y-1/2 w-48 h-48 text-white/5 -z-0" />
       </div>

       <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center">
                    <span className="mr-2 text-rose-500">🚨</span> High Priority Clinical Alerts
                  </h3>
                  <span className="text-[10px] text-blue-600 font-black bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">Live Sync Alpha</span>
                </div>
                
                <div className="p-4 space-y-4">
                   <div className="p-4 bg-red-50 border border-red-100 rounded-xl relative group hover:bg-red-50/80 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter">CRITICAL ALERT • 12m ago</span>
                        <div className="flex gap-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 mb-4">
                         <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                            <ShieldAlert size={20} />
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-800">Hyperglycemia Event Detected</p>
                            <p className="text-xs text-slate-600">Client: Robert Thompson (Ikeja) • Glucose: 245 mg/dL</p>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tight">Reported by Emma W. • HCA Tier II</p>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <Button variant="outline" size="sm" className="flex-1 text-[10px] uppercase font-black tracking-widest border-red-200 text-red-600 hover:bg-red-100 h-9">Acknowledge</Button>
                         <Button variant="danger" size="sm" className="flex-1 text-[10px] uppercase font-black tracking-widest shadow-lg shadow-red-200 h-9">Deploy Response</Button>
                      </div>
                   </div>

                   <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-tighter">SYSTEM FLAG • 45m ago</span>
                      </div>
                      <div className="flex items-start gap-4">
                         <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                            <Bell size={20} />
                         </div>
                         <div className="flex-1">
                            <p className="text-sm font-black text-slate-800">Medication Adherence Gap</p>
                            <p className="text-xs text-slate-600">Client: Martha Gilbert • Evening dose declined by client.</p>
                            <Button variant="ghost" size="sm" className="mt-2 text-amber-700 font-bold text-[10px] uppercase tracking-widest hover:bg-amber-100 p-0 h-auto">Mark for Review</Button>
                         </div>
                      </div>
                   </div>
                </div>
                
                <div className="p-4 border-t border-slate-50 bg-slate-50/30 rounded-b-2xl">
                   <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      <span>Historical Depth: 48 Hours</span>
                      <span className="text-blue-600 cursor-pointer hover:underline">Full Archive Access</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                   <h3 className="font-bold text-slate-800 flex items-center text-sm">
                      <span className="mr-2 text-emerald-500">📋</span> Vital Activity Monitor
                   </h3>
                </div>
                <div className="flex-1 p-0">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[9px] text-slate-400 uppercase font-black tracking-[0.1em]">
                        <tr>
                           <th className="px-5 py-3 border-b border-slate-100">Caregiver</th>
                           <th className="px-5 py-3 border-b border-slate-100 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {[
                           { name: "Musa J.", task: "Morning BP Check", time: "10m ago" },
                           { name: "Sarah O.", task: "Meal Support", time: "25m ago" },
                           { name: "Ike V.", task: "Wound Dressing", time: "1h ago" }
                         ].map((log, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 group transition-colors">
                               <td className="px-5 py-3">
                                  <p className="text-xs font-bold text-slate-800">{log.name}</p>
                                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">{log.task}</p>
                               </td>
                               <td className="px-5 py-3 text-right">
                                  <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest bg-emerald-50 inline-block px-1.5 py-0.5 rounded">PASSED</p>
                                  <p className="text-[9px] text-slate-300 font-mono mt-0.5">{log.time}</p>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
                   <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Load Extended Telemetry</button>
                </div>
             </div>

             <div className="bg-blue-900 border border-slate-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                   <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">VACS Clinical Academy</h4>
                   <p className="text-sm font-bold leading-snug mb-4">Advance Wound Care<br/>Protocol Updates (2026)</p>
                   <div className="flex items-center gap-3">
                      <div className="text-2xl font-black font-mono">08</div>
                      <div className="text-[9px] text-blue-400 font-black uppercase leading-tight tracking-widest">Certified staff<br/>pending review</div>
                   </div>
                </div>
                <Activity size={80} className="absolute -bottom-4 -right-4 text-white/5" />
             </div>
          </div>
       </div>
    </div>
  );
}

function ClinicalAudit() {
   const [auditedIds, setAuditedIds] = React.useState<number[]>([]);

   const toggleAudit = (id: number) => {
      setAuditedIds(prev => 
         prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
   };

   return (
      <div className="space-y-10">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
               <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Clinical Protocol Audit</h3>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldAlert size={14} className="text-blue-500" /> Pending Verification for Billable Cycles
               </p>
            </div>
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
               <div className="text-right">
                  <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Awaiting Verification</p>
                  <p className="text-2xl font-black text-blue-600 tracking-tighter">12 Logs</p>
               </div>
               <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <ClipboardCheck size={20} />
               </div>
            </div>
         </div>

         <div className="grid gap-6">
            {[1, 2, 3, 4].map(i => {
               const isAudited = auditedIds.includes(i);
               return (
                  <div key={i} className={cn(
                     "p-8 bg-white rounded-[2.5rem] border transition-all relative overflow-hidden group",
                     isAudited ? "border-emerald-200 bg-emerald-50/20" : "border-slate-200 bg-white hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/5"
                  )}>
                     <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                        <div className="flex items-start gap-6">
                           <div className={cn(
                              "w-16 h-16 rounded-3xl flex items-center justify-center transition-colors",
                              isAudited ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white"
                           )}>
                              {isAudited ? <ClipboardCheck size={32} /> : <Activity size={32} />}
                           </div>
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                 <p className="font-black text-slate-900 text-xl tracking-tight">HCA Log — Case ID #VAC-992{i}</p>
                                 <span className="px-2 py-0.5 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded-full">TIER 2</span>
                              </div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted by Sarah Owens • 2h 14m ago</p>
                              
                              <div className="mt-4 flex flex-wrap gap-4">
                                 <div className="px-3 py-1 bg-white border border-slate-100 rounded-lg flex items-center gap-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase">Vitals</span>
                                    <span className="text-[10px] font-black text-slate-900">98.6°F / 72 BPM</span>
                                 </div>
                                 <div className="px-3 py-1 bg-white border border-slate-100 rounded-lg flex items-center gap-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase">Meds</span>
                                    <span className="text-[10px] font-black text-emerald-600">CONFIRMED</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                           <Button variant="ghost" className="h-14 px-8 rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-widest group-hover:bg-white">View Full Telemetry</Button>
                           <Button 
                              onClick={() => toggleAudit(i)}
                              variant={isAudited ? "success" : "primary"}
                              className={cn(
                                 "h-14 px-10 rounded-full text-[10px] font-black uppercase tracking-widest",
                                 isAudited && "bg-emerald-500 hover:bg-emerald-600 border-none"
                              )}
                           >
                              {isAudited ? "Protocol Verified" : "Seal & Verify"}
                           </Button>
                        </div>
                     </div>
                     {isAudited && (
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                           <ShieldAlert size={120} />
                        </div>
                     )}
                  </div>
               );
            })}
         </div>
      </div>
   );
}

function AlertTracker() {
   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h3 className="text-xl font-bold text-slate-800">Protocol Incident Ledger</h3>
               <p className="text-slate-500 text-sm font-medium">Audited record of all clinical violations and interventions.</p>
            </div>
            <div className="flex gap-3">
               <Button variant="outline" size="sm" className="text-xs font-bold uppercase tracking-widest border-slate-200">
                  Generate Clinical Audit
               </Button>
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
               <thead className="bg-slate-50 border-b border-slate-100 uppercase text-[10px] font-black tracking-widest text-slate-400">
                  <tr>
                     <th className="px-6 py-4">Clinical Timestamp</th>
                     <th className="px-6 py-4">Impacted Client</th>
                     <th className="px-6 py-4">Diagnostic Severity</th>
                     <th className="px-6 py-4">Protocol Category</th>
                     <th className="px-6 py-4 text-right">Current Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  <AlertRow severity="CRITICAL" category="Gastrointestinal" status="RESOLVED" time="Today, 9:20 AM" client="Robert H." />
                  <AlertRow severity="HIGH" category="Medication Error" status="PENDING" time="Yesterday, 11:45 PM" client="Alice C." />
                  <AlertRow severity="MEDIUM" category="Orthopedic/Skin" status="ARCHIVED" time="2 days ago" client="Sarah J." />
               </tbody>
            </table>
         </div>
      </div>
   );
}

function AlertRow({ severity, category, status, time, client }: any) {
   const severityColors: any = {
      CRITICAL: "text-red-600 bg-red-50 border-red-100",
      HIGH: "text-amber-600 bg-amber-50 border-amber-100",
      MEDIUM: "text-blue-600 bg-blue-50 border-blue-100",
   };
   return (
      <tr className="hover:bg-slate-50 transition-colors">
         <td className="px-6 py-4 text-[10px] text-slate-400 font-mono uppercase tracking-tighter">{time}</td>
         <td className="px-6 py-4">
            <div className="flex items-center gap-3">
               <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">{client[0]}</div>
               <span className="text-sm font-bold text-slate-800">{client}</span>
            </div>
         </td>
         <td className="px-6 py-4">
            <span className={cn("px-2.5 py-1 text-[9px] font-black rounded uppercase tracking-widest border", severityColors[severity])}>{severity}</span>
         </td>
         <td className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-tight">{category}</td>
         <td className="px-6 py-4 text-right">
            <span className={cn(
               "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
               status === "RESOLVED" ? "text-emerald-600 bg-emerald-50" : "text-slate-400 bg-slate-50"
            )}>{status}</span>
         </td>
      </tr>
   );
}

