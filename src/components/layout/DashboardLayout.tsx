import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/Button";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ShieldAlert, 
  FileText, 
  CreditCard,
  Settings,
  LogOut,
  GraduationCap,
  Package,
  Heart,
  Edit,
  Bell,
  X,
  ShieldCheck,
  Zap,
  Clock,
  Info
} from "lucide-react";
import { cn } from "../../lib/utils";
import { auth, db } from "../../lib/firebase";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";

import Logo from "../ui/Logo";

export default function DashboardLayout({ user, onLogout, children, menuItems }: any) {
  const location = useLocation();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Simulate or fetch notifications
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    // Using dummy data if collection doesn't exist yet to show the UI
    const dummyNotifs = [
      { id: "1", type: "PROTOCOL", title: "Vital Protocol Update", text: "New afternoon vitals required for Margaret Stewart.", time: "10m ago", icon: ShieldCheck, color: "text-blue-500" },
      { id: "2", type: "SYSTEM", title: "Account Verified", text: "Your professional ledger is now synchronized.", time: "2h ago", icon: Zap, color: "text-emerald-500" },
      { id: "3", type: "ALERT", title: "Schedule Shift", text: "New shift added for Wednesday, March 15.", time: "5h ago", icon: Clock, color: "text-amber-500" }
    ];
    setNotifications(dummyNotifs);

    // Real listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotifications(list);
      }
    }, (err) => console.log("Notifs listener error:", err));

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <Logo size="sm" inverted />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-black tracking-widest text-[#C5A069] uppercase">VACS</span>
              <span className="text-[8px] font-black tracking-[0.3em] text-slate-500 uppercase">Registry Node</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item: any) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.path 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "text-slate-400 hover:text-white"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-2 tracking-wider">Role: {user.role?.replace('_', ' ')}</div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3 text-xs font-bold font-serif italic">
                {user.full_name?.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate text-white">{user.full_name}</div>
                <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wide">Verified User</div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700/50 gap-2 mt-4 px-0 h-auto py-1 text-xs"
              onClick={onLogout}
            >
              <LogOut size={12} />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Container */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              {menuItems.find((m: any) => m.path === location.pathname)?.label || "Overview"}
            </h2>
            <div className="hidden lg:flex items-center gap-3 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
               <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest leading-none">Protocol Secure</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 text-slate-500 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-black animate-bounce">
                  {notifications.length}
                </span>
              )}
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <Button variant="danger" className="font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-100 h-9">
              🚨 EMERGENCY
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
           {children}
        </div>

        {/* Side Notification Panel */}
        <AnimatePresence>
          {isNotifOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsNotifOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
              />
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-[101] flex flex-col border-l border-white/20"
              >
                <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">Clinical Notifications</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Real-time Command Feed</p>
                  </div>
                  <button onClick={() => setIsNotifOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3 text-rose-500">
                      <ShieldAlert size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Protocol Reminder System</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Ensure you follow the <span className="text-slate-900 font-bold italic">"Clean Hand"</span> logic before any vital diagnostic engagement.
                    </p>
                  </div>

                  {notifications.map((n: any) => (
                    <div key={n.id} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all"></div>
                      <div className="flex gap-4">
                        <div className={cn("shrink-0 w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center transition-colors group-hover:bg-blue-50", n.color || "text-blue-500")}>
                          <Info size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">{n.type || "NOTIFICATION"}</span>
                            <span className="text-[9px] font-bold text-slate-300 uppercase">{n.time || "Now"}</span>
                          </div>
                          <h4 className="text-[13px] font-black text-slate-900 tracking-tight mb-1">{n.title}</h4>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed underline decoration-slate-100 underline-offset-4">{n.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {notifications.length === 0 && (
                    <div className="py-20 text-center opacity-30">
                       <Bell size={48} className="mx-auto mb-4 text-slate-300" />
                       <p className="text-xs font-black uppercase tracking-widest text-slate-400">Node quiet. No active alerts.</p>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-white border-t border-slate-100">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic text-center mb-4">Certified Clinical Sync Registry</p>
                   <Button className="w-full rounded-2xl h-14 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/10">Mark All as Synchronized</Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
