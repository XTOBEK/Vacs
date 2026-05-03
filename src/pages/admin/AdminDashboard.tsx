import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ShieldAlert, 
  FileText, 
  CreditCard,
  Edit,
  Package,
  GraduationCap
} from "lucide-react";

export default function AdminDashboard({ user, onLogout }: any) {
  const menuItems = [
    { path: "/admin", label: "Overview", icon: LayoutDashboard },
    { path: "/admin/staff", label: "Staff Management", icon: Users },
    { path: "/admin/clients", label: "Clients", icon: ShieldAlert },
    { path: "/admin/scheduling", label: "Scheduling", icon: Calendar },
    { path: "/admin/finances", label: "Financial Control", icon: CreditCard },
    { path: "/admin/lms", label: "Internal Academy", icon: GraduationCap },
    { path: "/admin/inventory", label: "Assets & Kits", icon: Package },
    { path: "/admin/cms", label: "Dynamic CMS", icon: Edit },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout} menuItems={menuItems}>
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="cms" element={<CMSManager />} />
        <Route path="staff" element={<StaffManager />} />
        <Route path="clients" element={<div className="p-12 text-center text-gray-400">Client Management Console</div>} />
        <Route path="scheduling" element={<div className="p-12 text-center text-gray-400">Shift Logistics Control</div>} />
        <Route path="finances" element={<FinancialManager />} />
        <Route path="*" element={<div className="p-12 text-center text-gray-400">Coming Soon: Extended Admin Modules</div>} />
      </Routes>
    </DashboardLayout>
  );
}

function AdminOverview() {
  return (
    <div className="space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$42,500" trend="+12%" color="blue" />
        <StatCard title="Active Clients" value="28" trend="+3" color="emerald" />
        <StatCard title="Staff on Field" value="14" trend="Normal" color="purple" />
        <StatCard title="Pending KYC" value="9" trend="Attention" color="rose" isCritical />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center">
              <span className="mr-2 text-blue-500">📊</span> Recent Financial Activity
            </h3>
            <button className="text-blue-600 text-[10px] font-bold uppercase tracking-widest hover:underline">View All Ledger</button>
          </div>
          <div className="flex-1 space-y-4">
             {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                         <CreditCard size={18} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-800">Client Deposit</p>
                         <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Mar 12, 2026 • 10:45 AM</p>
                      </div>
                   </div>
                   <p className="text-sm font-bold text-emerald-600">+$2,400.00</p>
                </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100 flex items-center">
            <span className="mr-2 text-emerald-500">🏆</span> Staff Punctuality
          </h3>
          <div className="space-y-6">
             {[
               { name: "Emma Wilson", score: 98, level: "SCA" },
               { name: "John Doe", score: 95, level: "HCA II" },
               { name: "Jane Smith", score: 92, level: "HCA I" }
             ].map((staff, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-700">{staff.name} <span className="text-[10px] text-slate-400 ml-2 font-mono">{staff.level}</span></span>
                      <span className="font-bold text-blue-600">{staff.score}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${staff.score}%` }}></div>
                   </div>
                </div>
             ))}
          </div>
          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 italic">VACS KPI Target</p>
             <p className="text-xs text-slate-600 leading-relaxed font-medium">Field staff must maintain 90%+ punctuality for Tier 3 promotion.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CMSManager() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-slate-900 border border-slate-800 text-white p-8 rounded-3xl relative overflow-hidden shadow-2xl">
         <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
               <span className="px-2 py-1 bg-blue-600 text-[10px] font-bold rounded uppercase tracking-widest">CMS Engine V1</span>
               <div className="h-1 w-1 bg-slate-700 rounded-full"></div>
               <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Dynamic Controller</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Landing CMS Controller</h3>
            <p className="text-slate-400 text-sm max-w-sm">Modify landing page content in real-time. Changes are applied instantly following a security audit.</p>
         </div>
         <Edit className="absolute top-1/2 right-8 -translate-y-1/2 w-32 h-32 text-slate-800/50 -z-0" />
      </div>

      <div className="space-y-6">
        <CMSField label="Hero Title" defaultValue="Safe, Dignified Accountable Care" />
        <CMSField label="Mission Statement" defaultValue="To provide safe, dignified, and accountable non-medical home care, clinically overseen by a Registered Nurse." />
        <CMSField label="About Us Content" type="textarea" defaultValue="VACS was founded on the principle that home care should be more than just assistance..." />
        <Button className="w-full h-12 text-sm font-bold tracking-widest uppercase shadow-xl shadow-blue-900/10">Commit Changes to Production</Button>
      </div>
    </div>
  );
}

function StaffManager() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 italic uppercase italic tracking-tighter">Field Staff Protocol Registry</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Verification of Clinical Integrity & Reprimand Ledger</p>
          </div>
          <Button className="h-10 text-xs font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-500/10">Register New Agent</Button>
       </div>

       <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
          <table className="w-full text-left">
             <thead className="bg-slate-50 border-b border-slate-100 uppercase text-[10px] font-black tracking-widest text-slate-400">
                <tr>
                   <th className="px-6 py-5">Field Agent</th>
                   <th className="px-6 py-5">Clinical Tier</th>
                   <th className="px-6 py-5">Protocol Compliance</th>
                   <th className="px-6 py-5">Reprimand Level</th>
                   <th className="px-6 py-5 text-right">Gate Operations</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                <StaffRow 
                  name="Emma Wilson" 
                  role="SCA" 
                  kyc="VERIFIED" 
                  strikes={0}
                />
                <StaffRow 
                  name="Marcus Gray" 
                  role="HCA II" 
                  kyc="PENDING" 
                  strikes={1}
                />
                <StaffRow 
                  name="Lila Chen" 
                  role="HCA I" 
                  kyc="VERIFIED" 
                  strikes={3}
                />
             </tbody>
          </table>
       </div>

       <div className="mt-8 p-10 bg-slate-900 rounded-[3rem] border border-slate-800 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
          <div className="relative z-10">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-red-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-600/20">
                   <ShieldAlert size={28} className="text-white" />
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

function RuleInfo({ rule, desc }: any) {
  return (
     <div className="p-8 bg-slate-800/40 border border-slate-800 rounded-[2rem] hover:bg-slate-800/60 transition-colors group">
        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4 group-hover:text-blue-300 transition-colors">{rule}</p>
        <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-wide opacity-80">{desc}</p>
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
                <h4 className="text-4xl font-black font-mono tracking-tighter mb-6">$124,560.80</h4>
                <div className="flex gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Vault Secure</span>
                </div>
             </div>
             <CreditCard size={120} className="absolute -bottom-8 -right-8 text-white/5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm relative overflow-hidden group">
             <p className="text-[10px] uppercase font-black tracking-[0.4em] text-slate-400 mb-4">Pending Realization</p>
             <h4 className="text-4xl font-black text-slate-900 font-mono tracking-tighter mb-6">$12,400.00</h4>
             <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-50 px-2 py-1 rounded">In Audit Cycle</span>
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
                                  <p className="text-xl font-black text-slate-900 tracking-tighter">$840.00</p>
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
                      <RateCard tier="Tier 1" rate="25.00" description="Basic Home Support & Companion" />
                      <RateCard tier="Tier 2" rate="32.00" description="Enhanced ADL & Medical Oversight" />
                      <RateCard tier="Tier 3" rate="45.00" description="Complex Bio-Medical Management" />
                      <RateCard tier="Nurse" rate="75.00" description="RN Clinical Assessment & Audit" />
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

function CMSField({ label, defaultValue, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      {type === "textarea" ? (
        <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none min-h-[120px] text-sm font-medium text-slate-700 transition-all" defaultValue={defaultValue} />
      ) : (
        <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none text-sm font-medium text-slate-700 transition-all" defaultValue={defaultValue} />
      )}
    </div>
  );
}

function StaffRow({ name, role, kyc, strikes }: any) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
       <td className="px-6 py-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[10px] font-serif italic">{name.split(' ').map((n: string) => n[0]).join('')}</div>
             <span className="text-sm font-bold text-slate-800">{name}</span>
          </div>
       </td>
       <td className="px-6 py-4">
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-tighter">{role}</span>
       </td>
       <td className="px-6 py-4">
          <span className={cn(
            "px-2 py-1 text-[10px] font-black rounded uppercase tracking-tighter", 
            kyc === "VERIFIED" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
          )}>
            {kyc}
          </span>
       </td>
       <td className="px-6 py-4">
          <div className="flex items-center gap-1.5">
             {[1, 2, 3].map(i => (
                <div key={i} className={cn(
                   "w-4 h-1.5 rounded-full",
                   i <= strikes ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-slate-200"
                )}></div>
             ))}
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{strikes}/3</span>
          </div>
       </td>
       <td className="px-6 py-4 text-right">
          <Button variant="ghost" size="sm" className="text-blue-600 font-bold text-[10px] uppercase tracking-widest hover:bg-blue-50">Review Profile</Button>
       </td>
    </tr>
  );
}

function RateCard({ tier, rate, description }: any) {
  return (
    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-center group hover:bg-white hover:shadow-md transition-all">
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{tier}</p>
       <p className="text-2xl font-black text-slate-900 tracking-tighter">${rate}</p>
       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1 opacity-60">{description}</p>
    </div>
  );
}

