import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../../components/ui/Button";
import { 
  Heart, 
  ShieldCheck, 
  UserPlus, 
  Stethoscope, 
  Users, 
  ChevronRight,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";

export default function LandingPage() {
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="pt-32 md:pt-48 pb-24 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-blue-50/50 opacity-50 -skew-x-12 translate-x-1/4 -z-0 hidden md:block"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-100 shadow-sm">
              <ShieldCheck size={14} className="animate-pulse" /> Registered Nurse Oversight
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.95] mb-8 tracking-tighter">
              Safe, Dignified <br />
              <span className="text-blue-600 bg-clip-text">Accountable</span> Care.
            </h1>
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-lg leading-relaxed font-medium">
              VACS provides clinical-grade non-medical home care, ensuring quality through rigorous RN auditing and tiered caregiver expertise.
            </p>
            <div className="flex flex-wrap gap-5">
              <Button size="lg" className="h-14 px-8 md:px-10 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20" onClick={() => setIsDiscoveryOpen(true)}>Start Application</Button>
              <Link to="/careers">
                <Button variant="ghost" size="lg" className="h-14 px-8 md:px-10 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200">Careers</Button>
              </Link>
            </div>
            
            <div className="mt-16 md:mt-20 flex items-center gap-6 md:gap-12 text-slate-400">
              <div className="flex flex-col font-black">
                 <span className="text-slate-900 text-xl md:text-2xl tracking-tighter">LGA</span>
                 <span className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-60">Verified Area</span>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="flex flex-col font-black">
                 <span className="text-slate-900 text-xl md:text-2xl tracking-tighter">RN-1</span>
                 <span className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-60">Audit Level</span>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="flex flex-col font-black">
                 <span className="text-slate-900 text-xl md:text-2xl tracking-tighter">100%</span>
                 <span className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-60">Transparency</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
             className="relative mt-12 lg:mt-0"
          >
             <div className="aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] relative z-10 border-[8px] md:border-[12px] border-white">
                <img 
                  src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2000" 
                  alt="Clinical Caregiving" 
                  className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 hover:scale-105" 
                />
             </div>
             <div className="absolute -bottom-10 -right-10 w-48 md:w-64 h-48 md:h-64 bg-emerald-500/10 rounded-full blur-3xl -z-0"></div>
             <div className="absolute -top-10 -left-10 w-48 md:w-64 h-48 md:h-64 bg-blue-500/10 rounded-full blur-3xl -z-0"></div>
          </motion.div>
        </div>
      </section>

      {/* Discovery Modal */}
      <AnimatePresence>
        {isDiscoveryOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDiscoveryOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden p-8 md:p-16 border border-white/20"
            >
              <button 
                onClick={() => setIsDiscoveryOpen(false)}
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-10 md:mb-12">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
                   <Users size={32} />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase italic underline decoration-blue-500/10 decoration-8 underline-offset-8">Select Gateway</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-xs">Direct entrance to the VACS ecosystem</p>
              </div>

              <div className="space-y-4">
                <DiscoveryOption 
                   icon={<Heart className="text-rose-500" />}
                   title="Client Admission"
                   description="Secure clinical-grade home care. Start with a RN-led assessment."
                   path="/register/client"
                   color="bg-rose-50/50 border-rose-100 hover:bg-rose-50"
                   accent="rose"
                />
                <DiscoveryOption 
                   icon={<Stethoscope className="text-blue-500" />}
                   title="Clinical RN Program"
                   description="Join our medical oversight board through competitive recruitment."
                   path="/register/rn"
                   color="bg-blue-50/50 border-blue-100 hover:bg-blue-50"
                   accent="blue"
                />
                <DiscoveryOption 
                   icon={<UserPlus className="text-emerald-500" />}
                   title="HCA/SCA Registry"
                   description="Enlist as a caregiver. Access the VACS certification academy."
                   path="/register/caregiver"
                   color="bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50"
                   accent="emerald"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}

function DiscoveryOption({ icon, title, description, path, color, accent }: any) {
  const accents: any = {
    rose: "group-hover:text-rose-500",
    blue: "group-hover:text-blue-500",
    emerald: "group-hover:text-emerald-500"
  };
  return (
    <Link 
      to={path} 
      className={`flex items-start gap-4 md:gap-5 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border transition-all group ${color} hover:shadow-2xl hover:shadow-${accent}-100 hover:-translate-y-1`}
    >
      <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center shrink-0 border border-slate-100 transition-transform group-hover:scale-110">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-black text-slate-900 text-base md:text-lg flex items-center justify-between tracking-tight italic uppercase">
          {title}
          <ChevronRight size={18} className={`text-slate-200 group-hover:translate-x-2 transition-all ${accents[accent]}`} />
        </h3>
        <p className="text-[11px] md:text-sm text-slate-500 mt-1 leading-snug font-medium">
          {description}
        </p>
      </div>
    </Link>
  );
}
