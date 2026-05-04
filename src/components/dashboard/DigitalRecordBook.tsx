import React from 'react';
import { cn } from '../../lib/utils';
import { Thermometer, Zap, Activity, ClipboardCheck, ShieldAlert } from 'lucide-react';

interface DigitalRecordBookProps {
  user: any;
  clientName: string;
}

export const DigitalRecordBook: React.FC<DigitalRecordBookProps> = ({ user, clientName }) => {
  const isSCA = user.role === 'SCA';

  const lockedFeatures = [
    { name: 'Referral Access', id: 'referral' },
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
          isSCA ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
        )}>
          {user.role} Access Profile
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
          <Thermometer className="text-orange-500" />
          <span className="font-bold">Vital Signs</span>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
          <Zap className="text-blue-500" />
          <span className="font-bold">Medication</span>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
          <Activity className="text-emerald-500" />
          <span className="font-bold">Hygiene</span>
        </div>
      </div>

      {!isSCA && (
        <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
          <h4 className="flex items-center gap-2 text-amber-800 font-bold mb-4">
            <ShieldAlert size={18} />
            Restricted Tools (Requires SCA Role)
          </h4>
          <div className="grid sm:grid-cols-3 gap-4">
            {lockedFeatures.map(feat => (
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
