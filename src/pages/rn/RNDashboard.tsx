import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { 
  Users, 
  ShieldAlert, 
  Activity, 
  ClipboardCheck, 
  MapPin,
  Bell,
  Stethoscope,
  ChevronRight,
  Download
} from "lucide-react";
import AppDownloadCenter from "../../components/dashboard/AppDownloadCenter";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/utils";

export default function RNDashboard({ user, onLogout }: any) {
  const menuItems = [
    { path: "/rn", label: "Patient Oversight", icon: Stethoscope },
    { path: "/rn/downloads", label: "App Gateway", icon: Download },
    { path: "/rn/alerts", label: "Clinical Alerts", icon: Bell },
    { path: "/rn/audit", label: "Protocol Audit", icon: ClipboardCheck },
    { path: "/rn/staff", label: "Staff Performance", icon: Activity },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout} menuItems={menuItems}>
      <Routes>
        <Route index element={<RNOverview />} />
        <Route path="downloads" element={<AppDownloadCenter role="rn" />} />
        <Route path="alerts" element={<AlertTracker />} />
        <Route path="audit" element={<ClinicalAudit />} />
        <Route path="staff" element={<StaffPerformance />} />
        <Route path="*" element={<div className="p-12 text-center text-slate-400 font-black uppercase tracking-widest text-[10px]">Clinical Navigation</div>} />
      </Routes>
    </DashboardLayout>
  );
}

function RNOverview() {
  return (
    <div className="space-y-8">
       {/* Hero Oversight Section */}
       <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div>
              <div className="flex items-center gap-2 mb-6">
                 <span className="px-3 py-1 bg-[#C5A069] text-[#0B1D45] text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/20">Protocol Node Alpha</span>
                 <div className="h-1 w-1 bg-slate-700 rounded-full"></div>
                 <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Network Live</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter italic uppercase underline decoration-[#C5A069]/30 decoration-8 underline-offset-12">Clinical Command Hub</h3>
              <p className="text-slate-400 text-base max-w-md font-medium leading-relaxed">System-wide monitoring for Registered Nurses. Oversight of critical physiological telemetry and staff compliance.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="p-8 bg-slate-800/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-700/50 min-w-[160px] text-center">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Open Audits</p>
                  <p className="text-4xl font-black text-white tracking-tighter">12</p>
               </div>
               <div className="p-8 bg-slate-800/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-700/50 min-w-[160px] text-center">
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Active Alerts</p>
                  <p className="text-4xl font-black text-white tracking-tighter">03</p>
               </div>
            </div>
          </div>
          <Activity className="absolute top-1/2 right-12 -translate-y-1/2 w-96 h-96 text-white/5 -z-0 pointer-events-none" />
       </div>

       <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
             {/* Critical Alerts Block */}
             <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center italic uppercase">
                    <ShieldAlert className="mr-3 text-rose-500" size={24} /> Urgent Interventions
                  </h3>
                  <Link to="/rn/alerts" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1 group">
                    View Full Ledger <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
                
                <div className="p-8 space-y-6">
                   <div className="p-8 bg-rose-50 border border-rose-100 rounded-[2rem] relative group hover:bg-rose-100/30 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                           <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                           <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Diagnostic Alert • High Severity</span>
                        </div>
                        <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">12m ago</span>
                      </div>
                      <div className="flex items-start gap-6">
                         <div className="w-16 h-16 bg-white rounded-3xl shadow-xl shadow-rose-200/20 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                            <ShieldAlert size={32} />
                         </div>
                         <div className="flex-1">
                            <p className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Hyperglycemia Protocol</p>
                            <p className="text-sm font-bold text-slate-600 mt-2 leading-relaxed">Client: R. Thompson (Ikeja) • Glucose: 245 mg/dL. Caregiver reporting dizziness. Immediate clinical review required.</p>
                            
                            <div className="mt-8 flex gap-3">
                               <Button className="rounded-full px-10 h-14 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 bg-rose-600 hover:bg-rose-700 border-none">Initiate Intervention</Button>
                               <Button variant="outline" className="rounded-full px-10 h-14 text-[10px] font-black uppercase tracking-widest bg-white border-rose-200 text-rose-600">Patient File</Button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Audit List Block */}
             <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                   <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center italic uppercase">
                      <ClipboardCheck className="mr-3 text-blue-500" size={24} /> Pending Protocol Audits
                   </h3>
                </div>
                <div className="p-0">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-black tracking-widest border-b border-slate-200">
                        <tr>
                           <th className="px-10 py-6">Incident Reference</th>
                           <th className="px-10 py-6">Assigned Staff</th>
                           <th className="px-10 py-6 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {[
                           { name: "Musa J.", id: "#VAC-PROTOCOL-912", task: "Shift Log Audit" },
                           { name: "Sarah Owens", id: "#VAC-MEDS-442", task: "Admin Verification" },
                           { name: "Ike V.", id: "#VAC-WOUND-102", task: "Dressing Review" }
                         ].map((log, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors group">
                               <td className="px-10 py-8">
                                  <p className="text-base font-black text-slate-900 tracking-tight italic uppercase">{log.id}</p>
                                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">{log.task}</p>
                               </td>
                               <td className="px-10 py-8">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-black">{log.name[0]}</div>
                                     <span className="text-base font-bold text-slate-800 tracking-tight">{log.name}</span>
                                  </div>
                               </td>
                               <td className="px-10 py-8 text-right">
                                  <Button variant="ghost" className="h-12 px-8 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900">Sign Off</Button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
                <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
                   <Link to="/rn/audit">
                      <Button variant="outline" className="rounded-full w-full max-w-[240px] text-[10px] font-black uppercase tracking-widest h-12 bg-white">Full Audit Queue</Button>
                   </Link>
                </div>
             </div>
          </div>

          <div className="space-y-10">
             {/* Staff Performance Metrics Block */}
             <div className="bg-slate-900 border border-slate-800 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                   <div className="flex items-center justify-between mb-10">
                      <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Network Performance</h4>
                      <Activity size={24} className="text-blue-500" />
                   </div>
                   
                   <div className="space-y-8">
                      <PerformanceStat label="Average Accuracy" value="96.2%" color="bg-blue-500" />
                      <PerformanceStat label="Protocol Adherence" value="99.4%" color="bg-emerald-500" />
                      <PerformanceStat label="Response Latency" value="14.2m" color="bg-amber-500" />
                   </div>

                   <Link to="/rn/staff" className="block mt-12">
                      <Button className="w-full rounded-2xl h-16 bg-blue-600 hover:bg-blue-700 text-[11px] font-black uppercase tracking-[0.15em] border-none shadow-xl shadow-blue-500/20 translate-y-0 active:translate-y-1 transition-all">Staff Performance Matrix</Button>
                   </Link>
                </div>
                <div className="absolute -bottom-24 -right-24 text-white/5 opacity-40 transform rotate-12 group-hover:scale-110 transition-transform duration-1000">
                   <Users size={320} />
                </div>
             </div>

             {/* Live Connectivity Tracker */}
             <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-2">
                   <MapPin size={14} className="text-blue-500" /> Current Fleet Deployment
                </h4>
                <div className="space-y-6 relative z-10">
                   {[
                      { name: "Sarah Owens", status: "Session Active", loc: "Lekki Corridor", color: "bg-emerald-500" },
                      { name: "Musa John", status: "Base Transition", loc: "Victoria Island", color: "bg-blue-500" },
                      { name: "Lila Chen", status: "Critical Support", loc: "Ikeja Hub", color: "bg-rose-500" }
                   ].map((s, i) => (
                      <div key={i} className="flex items-center gap-5">
                         <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center relative shadow-sm border border-slate-100">
                            <Users size={20} className="text-slate-400" />
                            <div className={cn("absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white", s.color)}></div>
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{s.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{s.status} • {s.loc}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}

function PerformanceStat({ label, value, color }: any) {
   return (
      <div>
         <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3">
            <span>{label}</span>
            <span className="text-white">{value}</span>
         </div>
         <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full", color)} style={{ width: value.includes('%') ? value : '85%' }}></div>
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
                                 <p className="font-black text-slate-900 text-xl tracking-tight italic uppercase">HCA Log — #VAC-992{i}</p>
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
                           <Button variant="ghost" className="h-14 px-8 rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-widest group-hover:bg-white">Telemetry</Button>
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
                  </div>
               );
            })}
         </div>
      </div>
   );
}

function StaffPerformance() {
   return (
      <div className="space-y-10">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
               <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-blue-500/30 decoration-8 underline-offset-12">Staff Performance Metrics</h3>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity size={14} className="text-blue-500" /> Clinical Accuracy & Response Protocol Analytics
               </p>
            </div>
         </div>

         <div className="grid md:grid-cols-3 gap-8">
            <MetricCard label="Clinical Accuracy" value="98.4%" trend="+1.2%" accent="blue" />
            <MetricCard label="Protocol Latency" value="0.9m" trend="-0.4m" accent="emerald" />
            <MetricCard label="Engagement Depth" value="92" trend="+8" accent="amber" />
         </div>

         <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-10 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 italic">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div> Active Staff Ledger
               </h4>
               <Button className="h-10 px-8 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/10">Full Performance Export</Button>
            </div>
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-black tracking-widest">
                  <tr>
                     <th className="px-10 py-6">Registered Field Staff</th>
                     <th className="px-10 py-6 text-center">Accreditation</th>
                     <th className="px-10 py-6">Protocol Score</th>
                     <th className="px-10 py-6 text-right">Audit Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {[
                     { name: "Emma Wilson", score: 99.1, status: "CLEARED" },
                     { name: "Marcus Gray", score: 88.4, status: "REVIEW REQ." },
                     { name: "Lila Chen", score: 99.8, status: "HONOR ROLL" },
                  ].map((s, i) => (
                     <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-10 py-8">
                           <p className="text-lg font-black text-slate-900 tracking-tight italic uppercase">{s.name}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">HCA Tier II Certified</p>
                        </td>
                        <td className="px-10 py-8 text-center">
                           <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest">Mastery</span>
                        </td>
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-4">
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[120px]">
                                 <div className={cn("h-full rounded-full", s.score > 90 ? "bg-emerald-500" : "bg-blue-500")} style={{ width: `${s.score}%` }}></div>
                              </div>
                              <span className="text-sm font-black text-slate-900 italic">{s.score}%</span>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <span className={cn(
                              "text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full",
                              s.status === "CLEARED" ? "bg-emerald-50 text-emerald-600" : s.status === "HONOR ROLL" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                           )}>{s.status}</span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
}

function MetricCard({ label, value, trend, accent }: any) {
   const colors: any = {
      blue: "text-blue-600 bg-blue-50 border-blue-100",
      emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
      amber: "text-amber-600 bg-amber-50 border-amber-100"
   };
   return (
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative group overflow-hidden transition-all hover:shadow-2xl hover:shadow-slate-200/50">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 group-hover:translate-x-2 transition-transform">{label}</p>
         <div className="flex items-end justify-between">
            <h4 className="text-5xl font-black text-slate-900 tracking-tighter italic">{value}</h4>
            <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest", colors[accent])}>
               {trend}
            </span>
         </div>
      </div>
   );
}

function AlertTracker() {
   return (
      <div className="space-y-10">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center shadow-xl shadow-rose-200/20">
                  <Bell size={32} />
               </div>
               <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-rose-500/20 decoration-8 underline-offset-8">Critical Incident Ledger</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Historical audit of all clinical protocol violations.</p>
               </div>
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm">
            <table className="w-full text-left">
               <thead className="bg-slate-50 border-b border-slate-100 uppercase text-[10px] font-black tracking-widest text-slate-400">
                  <tr>
                     <th className="px-8 py-6">Timestamp</th>
                     <th className="px-8 py-6">Patient</th>
                     <th className="px-8 py-6">Severity</th>
                     <th className="px-8 py-6">Category</th>
                     <th className="px-8 py-6 text-right">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  <AlertRow severity="CRITICAL" category="Clinical Sync" status="RESOLVED" time="Today, 9:20 AM" client="Robert H." />
                  <AlertRow severity="HIGH" category="Medication" status="PENDING" time="Yesterday, 11:45 PM" client="Alice C." />
                  <AlertRow severity="MEDIUM" category="Orthopedic" status="ARCHIVED" time="2 days ago" client="Sarah J." />
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
         <td className="px-8 py-6 text-[10px] text-slate-400 font-mono uppercase tracking-widest">{time}</td>
         <td className="px-8 py-6">
            <div className="flex items-center gap-4">
               <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600">{client[0]}</div>
               <span className="text-base font-black text-slate-900 italic uppercase tracking-tight">{client}</span>
            </div>
         </td>
         <td className="px-8 py-6">
            <span className={cn("px-3 py-1.5 text-[9px] font-black rounded-full uppercase tracking-widest border", severityColors[severity])}>{severity}</span>
         </td>
         <td className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">{category}</td>
         <td className="px-8 py-6 text-right">
            <span className={cn(
               "text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border",
               status === "RESOLVED" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-slate-400 bg-slate-50 border-slate-100"
            )}>{status}</span>
         </td>
      </tr>
   );
}
