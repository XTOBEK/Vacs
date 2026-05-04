import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export default function CareersPage() {
  const roles = [
    { title: "Registered Nurse (RN)", role: "RN", desc: "Lead clinical audits and supervise field staff. Competitive session-based pay and institutional benefits.", icon: Stethoscope },
    { title: "SCA Caregiver", role: "SCA", desc: "Specialized care for high-acuity and cognitive cases. Requires VACS level-2 certification.", icon: Heart },
    { title: "HCA Caregiver", role: "HCA", desc: "Home care assistants for mobility and hygiene support. Ideal entry point for fresh clinical graduates.", icon: UserPlus },
    { title: "Support Staff", role: "SUPPORT", desc: "Operational and administrative support for the VACS LGA hubs.", icon: Users },
  ];

  return (
    <MainLayout>
      <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 italic uppercase underline decoration-blue-500/10 decoration-8 underline-offset-12">Join the Clinical Force</h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">VACS Recruitment & Enlistment Gateway</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            {roles.map((r, i) => (
                <div key={i} className="bg-white border border-slate-200 p-10 rounded-[3rem] hover:border-blue-500 hover:shadow-2xl transition-all group">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <r.icon size={24} />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight italic uppercase mb-4 text-slate-900">{r.title}</h2>
                    <p className="text-slate-500 font-medium leading-relaxed mb-8">{r.desc}</p>
                    <Link to={`/apply?role=${r.role}`}>
                        <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/10">Apply for Position</Button>
                    </Link>
                </div>
            ))}
        </div>

        <div className="mt-20 p-12 bg-[#0B1D45] rounded-[4rem] text-white overflow-hidden relative">
            <div className="relative z-10">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-6">Institutional Integrity</h3>
                <p className="text-slate-400 max-w-2xl leading-relaxed mb-8 font-medium">
                    Every VACS field agent undergoes a rigorous 4-stage verification process including biological ID checks, certification audits, and field simulation tests.
                </p>
                <div className="flex flex-wrap gap-10">
                    <div className="flex flex-col">
                        <span className="text-2xl font-black italic text-[#C5A069]">48h</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Response Node</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black italic text-[#C5A069]">100%</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Background Clear</span>
                    </div>
                </div>
            </div>
            <Stethoscope className="absolute top-1/2 right-12 -translate-y-1/2 w-64 h-64 text-white/5 -z-0 rotate-12" />
        </div>
      </div>
    </MainLayout>
  );
}

import { Stethoscope, Heart, UserPlus, Users } from 'lucide-react';
