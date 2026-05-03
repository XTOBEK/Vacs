import React, { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, Stethoscope, ShieldCheck, Zap, Heart } from "lucide-react";
import { cn } from "../../lib/utils";

export default function FAQPage() {
  const faqs = [
    {
      question: "What is VACS and how is it different from standard agencies?",
      answer: "Visiting Angels Caregivers Solutions (VACS) is unique because every care plan is clinically overseen by a Registered Nurse. We bridge the gap between simple supportive care and medical oversight, ensuring clinical integrity in non-medical home settings.",
      icon: <Stethoscope size={20} className="text-blue-500" />
    },
    {
      question: "What are the 4 Tiers of service?",
      answer: "We categorize care into four distinct tiers: Tier 1 (Standard/Companionship - ₦1,600/hr), Tier 2 (Physical/ADL - ₦1,900/hr), Tier 3 (Cognitive/Neuro - ₦2,200/hr), and Tier 4 (Palliative/End-of-Life - ₦2,500/hr). Each tier requires specific caregiver certifications.",
      icon: <Zap size={20} className="text-emerald-500" />
    },
    {
      question: "Do you provide medical treatments like injections or IVs?",
      answer: "No. VACS is a non-medical agency. While our caregivers are certfied and RN-overseen, they strictly provide supportive care, medication reminders, and ADL assistance. For medical procedures, we coordinate with your primary healthcare provider.",
      icon: <ShieldCheck size={20} className="text-rose-500" />
    },
    {
      question: "How do you verify your caregivers?",
      answer: "Every caregiver (Field Professional) goes through a 3-stage verification: Background Check, Clinical Assessment, and Medical Kit Audit (BP monitor & gait belt). Higher tier caregivers must also complete modules in our Internal Academy.",
      icon: <Heart size={20} className="text-amber-500" />
    }
  ];

  return (
    <MainLayout>
      <section className="pt-40 pb-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-4 block underline decoration-4 underline-offset-4">Knowledge Node</span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic uppercase mb-8">Clinical FAQ</h1>
            <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">Everything you need to know about VACS protocols, pricing, and our clinical governance.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} {...faq} />
            ))}
          </div>

          <div className="mt-24 p-12 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-3xl font-black tracking-tighter mb-4 italic uppercase">Still Have Questions?</h2>
              <p className="text-slate-400 text-sm font-medium mb-8 max-w-md uppercase tracking-wider">Our Command Center is available 24/7 for families and clinical partners.</p>
              <button className="h-14 px-10 bg-white text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Open Contact Node</button>
            </div>
            <Stethoscope size={200} className="absolute -bottom-20 -right-20 text-white/5 rotate-12" />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

function FAQItem({ question, answer, icon }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={cn(
        "border rounded-[2.5rem] p-8 md:p-10 transition-all cursor-pointer group",
        isOpen ? "bg-slate-50 border-blue-200 shadow-xl shadow-blue-500/5 translate-x-2" : "bg-white border-slate-100 hover:border-slate-200"
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
            isOpen ? "bg-blue-600 text-white rotate-6" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
          )}>
            {icon}
          </div>
          <h3 className={cn(
            "text-lg md:text-xl font-black tracking-tight transition-colors",
            isOpen ? "text-blue-600 italic" : "text-slate-900"
          )}>{question}</h3>
        </div>
        <div className={cn(
          "shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all",
          isOpen ? "bg-blue-100 text-blue-600 rotate-180" : "bg-slate-100 text-slate-400"
        )}>
          {isOpen ? <Minus size={20} strokeWidth={3} /> : <Plus size={20} strokeWidth={3} />}
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-8 pl-18 md:pl-18 border-t border-slate-200 mt-8">
              <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
