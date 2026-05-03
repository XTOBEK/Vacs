import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, ShieldCheck, Send } from "lucide-react";
import { Button } from "../../components/ui/Button";

export default function ContactPage() {
  return (
    <MainLayout>
      <section className="pt-40 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-start">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
             >
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6 block">Support Protocol</span>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
                  Reach the <span className="text-blue-600 italic">Command</span> Hub.
                </h1>
                <p className="text-lg text-slate-500 font-medium leading-relaxed mb-12 max-w-md">
                  Whether you are a family seeking care or a Registered Nurse looking to join our audit board, our team is standing by.
                </p>

                <div className="space-y-10">
                   <ContactItem icon={<Phone />} label="Global Inquiry Line" value="+234 (0) 803 123 4567" />
                   <ContactItem icon={<Mail />} label="Clinical Correspondence" value="admissions@vacs-registry.io" />
                   <ContactItem icon={<MapPin />} label="Logistics Headquarters" value="Lekki Phase 1, Lagos, Nigeria" />
                   <div className="pt-8 border-t border-slate-200">
                      <div className="flex items-center gap-4 text-emerald-600">
                         <Clock size={20} className="animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-[0.3em]">System Response Time: &lt; 14m</span>
                      </div>
                   </div>
                </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-white p-10 md:p-16 rounded-[4rem] border border-slate-200 shadow-2xl relative"
             >
                <div className="absolute top-0 right-0 p-10 opacity-5">
                   <Send size={120} className="rotate-12" />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight italic uppercase">Submit Inquiry</h3>
                <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                   <div className="grid md:grid-cols-2 gap-6">
                      <InputGroup label="Legal Name" placeholder="John Doe" />
                      <InputGroup label="Email Address" placeholder="john@example.com" type="email" />
                   </div>
                   <div className="grid md:grid-cols-2 gap-6">
                      <InputGroup label="Subject Track" placeholder="Client Admissions" />
                      <InputGroup label="LGA Location" placeholder="Lekki, Lagos" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Brief Intent</label>
                      <textarea 
                        rows={4} 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                        placeholder="Tell us about your care needs..."
                      />
                   </div>
                   <Button className="w-full h-16 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 bg-blue-600 border-none group">
                      Dispatch Communication <Send size={18} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </Button>
                </form>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Map or Trust Banner */}
      <section className="py-24 px-6 bg-slate-900 border-t border-slate-800 text-white text-center">
         <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20">
               <ShieldCheck size={40} />
            </div>
            <h4 className="text-3xl font-black tracking-tight italic uppercase mb-4">Certified Clinical Data Flow</h4>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.3em]">Encrypted • Audited • Accountable</p>
         </div>
      </section>
    </MainLayout>
  );
}

function ContactItem({ icon, label, value }: any) {
   return (
      <div className="flex items-start gap-6 group cursor-pointer">
         <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
            {React.cloneElement(icon, { size: 24 })}
         </div>
         <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
            <p className="text-xl font-black text-slate-900 tracking-tight italic uppercase group-hover:text-blue-600 transition-colors">{value}</p>
         </div>
      </div>
   );
}

function InputGroup({ label, placeholder, type = "text" }: any) {
   return (
      <div className="space-y-2">
         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
         <input 
            type={type}
            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder={placeholder}
         />
      </div>
   );
}
