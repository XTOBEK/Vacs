import React, { useState, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { motion } from "motion/react";
import { Stethoscope, Heart, Zap, Shield, ChevronRight, Activity, Users, Clock } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { db } from "../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const IconMap: Record<string, React.ReactNode> = {
  Users: <Users className="text-blue-500" />,
  Zap: <Zap className="text-emerald-500" />,
  Activity: <Activity className="text-rose-500" />,
  Shield: <Shield className="text-amber-500" />,
  Stethoscope: <Stethoscope className="text-blue-500" />,
  Heart: <Heart className="text-red-500" />,
  Clock: <Clock className="text-indigo-500" />,
};

export default function ServicesPage() {
  const [cmsData, setCmsData] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "cms", "services"), (doc) => {
      if (doc.exists()) setCmsData(doc.data());
    });
    return unsub;
  }, []);

  const defaultServices = [
    {
      title: "Senior Companion Care",
      desc: "Clinical-grade non-medical support for elderly residents, focusing on social engagement and safe mobilization.",
      icon: "Users",
      features: ["Meal Preparation", "Medication Reminders", "Social Outings", "Light Housekeeping"]
    },
    {
      title: "Post-Op Recovery",
      desc: "Specialized protocol-driven support for clients transitioning from hospital to home after elective or emergency surgery.",
      icon: "Zap",
      features: ["Dressing Change Support", "Vital Monitoring", "Exercise Assistance", "Progress Auditing"]
    },
    {
      title: "Chronic Condition Sync",
      desc: "Active physiological tracking for long-term health management, verified daily by Registered Nurses.",
      icon: "Activity",
      features: ["Glucose Monitoring", "BP Tracking", "Symptom Logging", "RN Oversight"]
    },
    {
      title: "Dementia Support",
      desc: "Advanced Tier II caregiver deployment specialized in cognitive support and memory preservation protocols.",
      icon: "Shield",
      features: ["Safe Environment Audit", "Cognitive Drills", "Respite for Families", "Behavioral Tracking"]
    }
  ];

  // Map database entries to match display structure, filtering by status === true
  const services = cmsData?.list 
    ? cmsData.list.filter((s: any) => s.status !== false)
    : defaultServices;

  return (
    <MainLayout>
      <section className="pt-40 pb-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-24">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-4 block">Our Expertise</span>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9] uppercase italic">
                {cmsData?.headerTitle || "Clinical Oversight."} <br /><span className="text-blue-600 italic">{cmsData?.headerHighlight || "Personal"}</span> Care.
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                {cmsData?.headerSummary || "VACS redefines home care by applying clinical rigor to daily living. Our services are tiered by complexity, ensuring you always have the right level of expertise."}
              </p>
            </motion.div>
            <div className="flex gap-4">
               <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">04</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Core Tracks</p>
               </div>
               <div className="p-8 bg-blue-600 rounded-[2.5rem] shadow-xl shadow-blue-500/20 text-center text-white">
                  <p className="text-4xl font-black tracking-tighter">RN-1</p>
                  <p className="text-[9px] font-black text-blue-100 uppercase tracking-widest mt-2">Default Audit</p>
               </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((s, i) => (
              <ServiceCard key={i} {...s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
         <div className="max-w-7xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white text-center relative overflow-hidden">
            <div className="relative z-10">
               <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 italic uppercase">Ready for a Clinical Audit?</h2>
               <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium mb-12">Every enrollment begins with a mandatory RN assessment to determine the appropriate care tier.</p>
               <Link to="/register/client">
                  <Button size="lg" className="h-16 px-12 rounded-full text-xs font-black uppercase tracking-[0.2em] bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-500/20">Inititate Assessment</Button>
               </Link>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[100px] -z-0"></div>
            <Stethoscope className="absolute -bottom-24 -right-24 w-96 h-96 text-white/5 rotate-12" />
         </div>
      </section>
    </MainLayout>
  );
}

function ServiceCard({ title, desc, icon, features, index }: any) {
  const isUrl = typeof icon === "string" && (icon.startsWith("http") || icon.includes("/"));
  const iconElement = isUrl ? (
    <img src={icon} alt={title} className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
  ) : typeof icon === "string" ? (
    IconMap[icon] || IconMap["Users"]
  ) : icon ? (
    React.cloneElement(icon, { size: 32 })
  ) : (
    IconMap["Users"]
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all group flex flex-col h-full"
    >
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-10 border border-slate-100 group-hover:bg-blue-50 group-hover:scale-110 transition-all text-blue-600">
         {iconElement}
      </div>
      <div className="flex-1">
        <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight italic uppercase">{title}</h3>
        <p className="text-slate-500 font-medium leading-relaxed mb-8">{desc}</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
           {features.map((f: string, i: number) => (
             <li key={i} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                {f}
             </li>
           ))}
        </ul>
      </div>
      <div className="mt-12 flex justify-end">
         <Button variant="ghost" className="rounded-full text-[9px] font-black uppercase tracking-[0.3em] h-12 px-8 flex gap-2 items-center group-hover:bg-slate-900 group-hover:text-white transition-all">
            Audit Protocol <ChevronRight size={14} />
         </Button>
      </div>
    </motion.div>
  );
}
