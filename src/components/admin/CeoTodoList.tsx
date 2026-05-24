import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, Key, Globe, UserCheck, Eye } from "lucide-react";

interface CeoTask {
  id: string;
  text: string;
  desc: string;
  status: "COMPLETED" | "PENDING";
  category: string;
}

export default function CeoTodoList() {
  const [ceoTasks, setCeoTasks] = useState<CeoTask[]>(() => {
    const saved = localStorage.getItem("vacs_ceo_tasks");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Could not load CEO tasks:", e);
      }
    }
    return [
      { 
        id: "domain", 
        text: "Production Domain Setup", 
        desc: "Route visitingangels.com.ng securely through Vercel CDN endpoints.", 
        status: "COMPLETED",
        category: "Network"
      },
      { 
        id: "env-local", 
        text: "Secure environment variables registry (.env)", 
        desc: "Inject absolute configuration values into production code bundles and .env.example files.", 
        status: "COMPLETED",
        category: "Security"
      },
      { 
        id: "env-vercel", 
        text: "Declare Environment Variables in Vercel", 
        desc: "Navigate to Vercel Project Settings and submit all variables with VITE_ prefix (VITE_FIREBASE_*) to recover online synchronization.", 
        status: "PENDING",
        category: "Deployment"
      },
      { 
        id: "gemini-api", 
        text: "Input production Gemini secrets", 
        desc: "Activate server-side GEMINI_API_KEY environment flags to power dynamic maps grounding and clinical guidelines AI.", 
        status: "PENDING",
        category: "AI Engine"
      },
      { 
        id: "rn-validation", 
        text: "RN Supervisor dashboard workflow check", 
        desc: "Log in with test RN credentials from VACS_TEST_CREDENTIALS.md to verify audits and compliance watchlist.", 
        status: "PENDING",
        category: "QA Operations"
      },
      { 
        id: "rules-audit", 
        text: "Execute Red Team validation on Firestore Rules", 
        desc: "Hard-test public endpoint nodes against credential-bypass rules.", 
        status: "PENDING",
        category: "Security"
      }
    ];
  });

  const toggleTask = (taskId: string) => {
    const updated = ceoTasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, status: t.status === "COMPLETED" ? "PENDING" : ("COMPLETED" as const) };
      }
      return t;
    });
    setCeoTasks(updated);
    localStorage.setItem("vacs_ceo_tasks", JSON.stringify(updated));
  };

  const completedCount = ceoTasks.filter((t) => t.status === "COMPLETED").length;
  const percent = Math.round((completedCount / ceoTasks.length) * 100);

  return (
    <div id="ceo-priority-checklist" className="bg-slate-900 border border-white/10 text-white rounded-[3rem] p-8 md:p-10 mt-10 shadow-2xl relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 font-sans">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-[#C5A069] text-[#0B1D45] text-[9px] font-black rounded-lg uppercase tracking-[0.2em] font-sans">
                CEO Operational Board
              </span>
              <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest font-mono">
                System-Wide Oversight
              </span>
            </div>
            <h3 className="text-3xl font-black tracking-tighter uppercase italic text-white font-sans">
              CEO Priority Checklist
            </h3>
            <p className="text-slate-400 text-xs font-medium mt-2 leading-relaxed max-w-xl font-sans">
              Active technical issues, domain integrations, and live QA priority status indicators for Princewill Iwuoha. Click any card to toggle verification.
            </p>
          </div>
          
          <div className="text-left shrink-0 bg-white/5 border border-white/10 px-8 py-5 rounded-3xl min-w-[180px]">
            <p className="text-[10px] font-black text-[#C5A069] uppercase tracking-widest mb-1 font-mono">
              Progress Metric
            </p>
            <p className="text-4xl font-black text-white tracking-tighter font-mono">
              {percent}% <span className="text-sm text-slate-400 uppercase font-bold tracking-widest font-sans">Done</span>
            </p>
            <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-[#C5A069] transition-all duration-500" 
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 font-sans">
          {ceoTasks.map((task) => {
            const isCompleted = task.status === "COMPLETED";
            return (
              <div 
                key={task.id} 
                onClick={() => toggleTask(task.id)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex gap-4 items-start select-none text-left group ${
                  isCompleted 
                    ? "bg-white/5 border-emerald-500/20 hover:border-emerald-500/30 shadow-lg shadow-emerald-500/5" 
                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                }`}
              >
                <div className="pt-1 shrink-0">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                    isCompleted 
                      ? "bg-emerald-500 border-emerald-500 text-slate-900" 
                      : "border-slate-500 group-hover:border-[#C5A069]"
                  }`}>
                    {isCompleted && (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="w-3.5 h-3.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className={`text-sm font-black tracking-tight ${
                      isCompleted ? "text-slate-400 line-through decoration-slate-600" : "text-white"
                    }`}>
                      {task.text}
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      isCompleted 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                    }`}>
                      {task.status}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider bg-white/5 px-1.5 py-0.5 rounded">
                      {task.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed opacity-90">
                    {task.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
