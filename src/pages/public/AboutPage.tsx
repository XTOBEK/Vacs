import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import { motion } from "motion/react";
import { ShieldCheck, Users, Activity, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <MainLayout>
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-24"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-4 block">The VACS Protocol</span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
              Pioneering <span className="text-blue-600">Accountable</span> Clinical Care.
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              We bridge the gap between medical expertise and compassionate home support through a rigorous RN-led audit system and tiered caregiver training.
            </p>
          </motion.div>

          {/* Mission Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-32">
            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                <Heart className="text-rose-500 mb-6" size={40} />
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight italic uppercase">Our Mission</h3>
                <p className="text-slate-500 leading-relaxed font-medium">To provide every client with the security of clinical oversight while maintaining the dignity and comfort of their own home.</p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
            </div>
            <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <ShieldCheck className="text-blue-400 mb-6" size={40} />
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight italic uppercase">Clinical Integrity</h3>
                <p className="text-slate-400 leading-relaxed font-medium">Every care log is digitally signed and audited by a Registered Nurse, ensuring protocol adherence and early detection of physiological changes.</p>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mb-16 opacity-50"></div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-blue-600 rounded-[4rem] p-12 md:p-24 text-white flex flex-wrap justify-between gap-12 items-center">
             <StatItem value="100%" label="RN Audited Sessions" />
             <StatItem value="Tier II" label="Minimum Certification" />
             <StatItem value="24/7" label="Clinical Oversight" />
             <StatItem value="LGA" label="Local Area Coverage" />
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 px-6 bg-white">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 mb-16 tracking-tight italic uppercase text-center underline decoration-blue-500 decoration-8 underline-offset-12">Clinical Leadership</h2>
            <div className="grid md:grid-cols-3 gap-12">
               <LeaderCard name="Dr. Sarah Owens" role="Chief Clinical Officer" img="https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=400" />
               <LeaderCard name="Marcus Gray, RN" role="Head of Protocol Audit" img="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400" />
               <LeaderCard name="Lila Chen" role="Caregiver Academy Director" img="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400" />
            </div>
         </div>
      </section>
    </MainLayout>
  );
}

function StatItem({ value, label }: any) {
  return (
    <div className="flex flex-col">
       <span className="text-5xl md:text-7xl font-black tracking-tighter mb-2 italic">{value}</span>
       <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">{label}</span>
    </div>
  );
}

function LeaderCard({ name, role, img }: any) {
  return (
    <div className="group cursor-pointer">
       <div className="aspect-square rounded-[3rem] overflow-hidden mb-8 border-8 border-slate-50 transition-all group-hover:shadow-2xl group-hover:scale-105 group-hover:border-blue-100">
          <img src={img} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
       </div>
       <h4 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">{name}</h4>
       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">{role}</p>
    </div>
  );
}
