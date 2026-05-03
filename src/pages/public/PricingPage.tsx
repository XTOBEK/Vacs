import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import { motion } from "motion/react";
import { CheckCircle2, ShieldCheck, Zap, Activity, Users, Star } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Link } from "react-router-dom";

export default function PricingPage() {
  const plans = [
    {
      name: "Tier I: Essential",
      price: "$250",
      period: "per 4hr session",
      desc: "Compassionate companionship and daily support for healthy seniors.",
      features: [
        "LGA Verified Caregiver",
        "Weekly RN Log Review",
        "Basic ADL Support",
        "Digital Check-In/Out",
        "Social Enrichment"
      ],
      accent: "blue",
      btnText: "Select Essential"
    },
    {
      name: "Tier II: clinical",
      price: "$480",
      period: "per 8hr session",
      desc: "High-intensity support for chronic condition management and post-op care.",
      features: [
        "Advanced Academy Graduate",
        "Daily RN Audit Protocol",
        "Vital Sign Monitoring",
        "Wound Support Assist",
        "Medication Verification",
        "Emergency Escalation Path"
      ],
      accent: "blue",
      popular: true,
      btnText: "Select Clinical"
    },
    {
      name: "Tier III: Specialty",
      price: "$950",
      period: "full 24hr cycle",
      desc: "Round-the-clock specialized care for complex neurological or mobility needs.",
      features: [
        "Double-Staff Deployment",
        "Real-time Telemetry Sync",
        "C-Level RN Liaison",
        "Cognitive Drill Support",
        "Custom Nutritional Prep",
        "Family Portal Analytics"
      ],
      accent: "slate",
      btnText: "Select Specialty"
    }
  ];

  return (
    <MainLayout>
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-24">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-4 block">Care Architecture</span>
             <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
               Tiered <span className="text-blue-600">Protocol</span> Packages.
             </h1>
             <p className="text-lg text-slate-500 font-medium leading-relaxed">
               Transparent pricing based on caregiver skill level and clinical oversight intensity. No hidden fees, just accountable care.
             </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <PlanCard key={i} {...plan} index={i} />
            ))}
          </div>

          {/* Pricing FAQ/Notes */}
          <div className="mt-32 max-w-4xl mx-auto grid md:grid-cols-2 gap-12 border-t border-slate-200 pt-24">
             <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 italic">RN Assessment Fee</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">All new enrollees require a one-time $150 clinical assessment fee. This covers a home visit by a Registered Nurse to establish your care protocol and tier baseline.</p>
             </div>
             <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 italic">Medication Protocol</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">For Tiers II and III, caregivers use our proprietary Medication Verification System (MVS) which syncs directly with our RN audit board for error-free administration.</p>
             </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

function PlanCard({ name, price, period, desc, features, accent, popular, index, btnText }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-10 rounded-[4rem] border relative flex flex-col h-full bg-white transition-all hover:shadow-2xl hover:border-blue-200 group ${popular ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200'}`}
    >
      {popular && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.4em] px-8 py-2 rounded-full shadow-xl">
           Most Recommended
        </div>
      )}
      
      <div className="mb-10 text-center">
         <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">{name}</h3>
         <div className="flex items-end justify-center gap-1">
            <span className="text-5xl font-black text-slate-900 tracking-tighter italic">{price}</span>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest pb-2">{period}</span>
         </div>
         <p className="mt-6 text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
      </div>

      <div className="flex-1 space-y-4 mb-12">
        {features.map((f: string, i: number) => (
          <div key={i} className="flex items-start gap-3">
             <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5" />
             <span className="text-xs font-bold text-slate-700 tracking-tight leading-tight">{f}</span>
          </div>
        ))}
      </div>

      <Link to="/register/client" className="mt-auto">
         <Button 
           variant={popular ? "primary" : "outline"} 
           className={`w-full h-16 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl ${popular ? 'shadow-blue-500/20 bg-blue-600 border-none' : 'shadow-slate-100'}`}
         >
           {btnText}
         </Button>
      </Link>
    </motion.div>
  );
}
