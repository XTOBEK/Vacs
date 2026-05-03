import { Link, useLocation } from "react-router-dom";
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
  Edit
} from "lucide-react";
import { cn } from "../../lib/utils";

export default function DashboardLayout({ user, onLogout, children, menuItems }: any) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white uppercase">
              Va
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-white">VACS Portal</h1>
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
            <div className="relative">
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">3</span>
              <button className="p-2 text-slate-500 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                <ShieldAlert size={16} />
              </button>
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <Button variant="danger" className="font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-100 h-9">
              🚨 EMERGENCY INCIDENT
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
           {children}
        </div>
      </main>
    </div>
  );
}
