import React from "react";
import { 
  Download, 
  Lock, 
  CheckCircle2, 
  Smartphone, 
  FileBadge, 
  ShieldAlert,
  Clock,
  ExternalLink
} from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

interface DownloadCenterProps {
  role: 'admin' | 'rn' | 'caregiver' | 'client';
  userData?: {
    tenure_days?: number;
    kit_status?: 'VERIFIED' | 'PENDING' | 'MISSING';
    payment_status?: 'PAID' | 'UNPAID';
    role?: string;
  };
}

export default function AppDownloadCenter({ role, userData }: DownloadCenterProps) {
  // Logic for the "Digital Lock"
  const hasMetTenure = (userData?.tenure_days || 0) >= 180;
  const isKitVerified = userData?.kit_status === 'VERIFIED';
  const isPaid = userData?.payment_status === 'PAID';

  return (
    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden group">
      <div className="p-8 md:p-12 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2 block">VACS Digital Gateway</span>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Apps & Documents</h3>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Clearance:</span>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{role} Access</span>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Core Mobile Application */}
        <DownloadCard 
          icon={<Smartphone size={32} />}
          title="VACS Field Mobile"
          version="v2.8.4"
          description="Required for check-in and check-out. Uses location to verify your visit."
          type="Core App"
          status="Authorized"
        />

        {role === 'caregiver' && (
          <>
            <CertificationCard 
              title="Tier 1 (HCA) Internal"
              isGlobal={false}
              isLocked={!isKitVerified}
              reason={!isKitVerified ? "Medical Kit Verification Required" : ""}
              details="Basic care certificate. For use within VACS only."
            />
            <CertificationCard 
              title="Tier 3 (SCA) Global"
              isGlobal={true}
              isLocked={!hasMetTenure || !isPaid || !isKitVerified}
              reason={!hasMetTenure ? "6-Month Service Tenure Required" : !isPaid ? "Buyout/Training Fee Unpaid" : "Kit Verification Required"}
              details="Senior care certificate. Valid everywhere and increases your pay."
            />
          </>
        )}

        {role === 'rn' && (
          <DownloadCard 
            icon={<FileBadge size={32} />}
            title="RN Audit Protocol"
            version="2026.Q2"
            description="Clinical oversight handbook for assessment and physiological tracking. Financial data strictly hidden."
            type="RN Exclusive"
            status="Secured"
          />
        )}

        {role === 'admin' && (
          <DownloadCard 
            icon={<ShieldAlert size={32} />}
            title="Logistics Controller"
            version="v1.2"
            description="Manage Surge pricing, Zone 3 Logistics reviews, and Website settings controller."
            type="System Admin"
            status="Root Access"
          />
        )}

        <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[300px]">
           <div className="relative z-10">
              <h4 className="text-xl font-black italic uppercase tracking-tight mb-4">Field Support</h4>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">System-authorized staff can contact the VACS Digital COO Hub for remote node assistance.</p>
           </div>
           <Button className="w-full h-14 rounded-xl bg-white text-slate-900 hover:bg-blue-50 text-[10px] font-black uppercase tracking-widest relative z-10">Contact Support</Button>
           <Clock className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 -z-0" />
        </div>
      </div>
    </div>
  );
}

function DownloadCard({ icon, title, version, description, type, status }: any) {
  return (
    <div className="p-8 rounded-[2.5rem] border border-slate-100 bg-white hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group flex flex-col h-full">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
           <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{type} • {version}</span>
           <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{status}</span>
        </div>
        <h4 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase mb-4">{title}</h4>
        <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">{description}</p>
      </div>
      <Button className="w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3">
         <Download size={16} /> Download
      </Button>
    </div>
  );
}

function CertificationCard({ title, isGlobal, isLocked, reason, details }: any) {
  return (
    <div className={cn(
      "p-8 rounded-[2.5rem] border relative flex flex-col h-full overflow-hidden",
      isLocked ? "bg-slate-50 border-slate-200" : "bg-white border-blue-200 shadow-xl shadow-blue-500/5"
    )}>
      <div className="flex items-center justify-between mb-8">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center relative",
          isLocked ? "bg-slate-200 text-slate-400" : "bg-blue-600 text-white shadow-xl shadow-blue-500/20"
        )}>
          {isLocked ? <Lock size={24} /> : <FileBadge size={24} />}
        </div>
        <div className="text-right">
           <span className={cn(
             "text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full",
             isGlobal ? "bg-emerald-100 text-emerald-700" : "bg-slate-900 text-white"
           )}>
             {isGlobal ? "Global Cert" : "VACS Only"}
           </span>
        </div>
      </div>

      <div className="flex-1">
        <h4 className={cn("text-xl font-black tracking-tight italic uppercase mb-4", isLocked ? "text-slate-400" : "text-slate-900")}>{title}</h4>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Certificate Details:</p>
        <p className="text-xs font-medium text-slate-500 leading-relaxed mb-8">{details}</p>
      </div>

      {isLocked ? (
        <div className="space-y-4">
           <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
              <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10px] font-black text-amber-700 uppercase leading-snug">{reason}</p>
           </div>
           <Button disabled className="w-full h-14 rounded-2xl bg-slate-200 text-slate-400 border-none opacity-50 cursor-not-allowed">
              Download Restricted
           </Button>
        </div>
      ) : (
        <Button className="w-full h-14 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">
           Download Certificate
        </Button>
      )}

      {isGlobal && !isLocked && (
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
           <ExternalLink size={100} />
        </div>
      )}
    </div>
  );
}
