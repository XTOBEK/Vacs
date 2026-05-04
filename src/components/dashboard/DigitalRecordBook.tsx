import React from 'react';
import { cn } from '../../lib/utils';
import { Thermometer, Zap, Activity, ClipboardCheck, ShieldAlert } from 'lucide-react';

interface DigitalRecordBookProps {
  user: any;
  clientName: string;
}

export const DigitalRecordBook: React.FC<DigitalRecordBookProps> = ({ user, clientName }) => {
  const isHCA = user.role === 'HCA';

  const supervisedFeatures = [
    { name: 'Supervision Tools', id: 'supervision' },
    { name: 'Certificate Downloads', id: 'certificates' },
  ];

  return (
    <div className="space-y-8 bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">
          Digital Record Book: {clientName}
        </h3>
        <span className={cn(
          "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
          isHCA ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
        )}>
          {user.role} Access Profile
        </span>
      </div>

    <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-4 text-orange-500">
            <Thermometer />
            <span className="font-bold text-slate-900 uppercase tracking-tight italic">Vital Signs</span>
          </div>
          <div className="space-y-3">
             <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Temperature (°C)</label>
                <input type="text" placeholder="36.5" className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold" />
             </div>
             <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pulse (BPM)</label>
                <input type="text" placeholder="72" className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold" />
             </div>
             <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Heart Rate</label>
                <input type="text" placeholder="Regular" className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold" />
             </div>
          </div>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-4 text-blue-500">
            <Zap />
            <span className="font-bold text-slate-900 uppercase tracking-tight italic">Medication</span>
          </div>
          <div className="space-y-3">
             <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Drug Administered</label>
                <input type="text" placeholder="Atorvastatin" className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold" />
             </div>
             <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dosage</label>
                <input type="text" placeholder="20mg" className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold" />
             </div>
          </div>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-4 text-emerald-500">
            <Activity />
            <span className="font-bold text-slate-900 uppercase tracking-tight italic">Hygiene & Care</span>
          </div>
          <div className="space-y-3">
             <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hygiene Check</label>
                <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold">
                    <option>Sponge Bath Completed</option>
                    <option>Full Shower Assisted</option>
                    <option>Oral Care Provided</option>
                    <option>Incontinence Change</option>
                </select>
             </div>
             <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Skin Integrity</label>
                <input type="text" placeholder="Clear / No Redness" className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold" />
             </div>
          </div>
        </div>
      </div>

      {isHCA && (
        <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
          <h4 className="flex items-center gap-2 text-amber-800 font-bold mb-4">
            <ShieldAlert size={18} />
            Restricted Tools (Requires SCA/RN Role)
          </h4>
          <div className="grid sm:grid-cols-2 gap-4">
            {supervisedFeatures.map(feat => (
              <div key={feat.id} className="p-4 bg-white/50 rounded-xl text-xs text-amber-700/60 font-bold uppercase tracking-widest text-center border border-dashed border-amber-200">
                {feat.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
