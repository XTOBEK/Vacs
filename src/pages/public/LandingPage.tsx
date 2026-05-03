import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../../components/ui/Button";
import { 
  Heart, 
  ShieldCheck, 
  UserPlus, 
  Stethoscope, 
  Users, 
  ChevronRight,
  Menu,
  X,
  CheckCircle2,
  Clock,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Heart size={22} fill="currentColor" />
            </div>
            <div className="flex flex-col leading-none">
               <span className="font-black text-xl tracking-tighter text-slate-900">VACS</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Clinical Care</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-10 text-xs font-black uppercase tracking-widest text-slate-500">
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#mission" className="hover:text-blue-600 transition-colors">Mission</a>
            <div className="h-4 w-px bg-slate-200"></div>
            <Link to="/login" className="hover:text-blue-600 transition-colors text-slate-900 font-black">Portal Access</Link>
            <Button onClick={() => setIsDiscoveryOpen(true)} className="h-10 px-6 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 transition-transform active:scale-95">Enroll Now</Button>
          </nav>

          <button className="md:hidden p-2 text-slate-900 flex items-center gap-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <div className="flex items-center gap-1 opacity-60">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">Protocol Live</span>
            </div>
            {mobileMenuOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-200 p-8 shadow-2xl z-40"
            >
              <nav className="flex flex-col gap-6">
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600">About</a>
                <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600">Services</a>
                <a href="#mission" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600">Mission</a>
                <div className="h-px bg-slate-100 w-full"></div>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-900">Portal Access</Link>
                <Button onClick={() => { setIsDiscoveryOpen(true); setMobileMenuOpen(false); }} className="h-12 w-full rounded-full text-[10px] font-black tracking-widest">Enroll Now</Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50 opacity-50 -skew-x-12 translate-x-1/4 -z-0"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-100 shadow-sm">
              <ShieldCheck size={14} className="animate-pulse" /> Registered Nurse Oversight
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] mb-8 tracking-tighter">
              Safe, Dignified <br />
              <span className="text-blue-600 bg-clip-text">Accountable</span> Care.
            </h1>
            <p className="text-xl text-slate-500 mb-10 max-w-lg leading-relaxed font-medium">
              VACS provides clinical-grade non-medical home care, ensuring quality through rigorous RN auditing and tiered caregiver expertise.
            </p>
            <div className="flex flex-wrap gap-5">
              <Button size="lg" className="h-14 px-10 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20" onClick={() => setIsDiscoveryOpen(true)}>Start Application</Button>
              <Button variant="ghost" size="lg" className="h-14 px-10 rounded-full text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900">Our Protocol</Button>
            </div>
            
            <div className="mt-20 flex items-center gap-12 text-slate-400">
              <div className="flex flex-col font-black">
                 <span className="text-slate-900 text-2xl tracking-tighter">LGA</span>
                 <span className="text-[10px] uppercase tracking-widest opacity-60">Verified Area</span>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="flex flex-col font-black">
                 <span className="text-slate-900 text-2xl tracking-tighter">RN-1</span>
                 <span className="text-[10px] uppercase tracking-widest opacity-60">Audit Level</span>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="flex flex-col font-black">
                 <span className="text-slate-900 text-2xl tracking-tighter">100%</span>
                 <span className="text-[10px] uppercase tracking-widest opacity-60">Transparency</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
             className="relative"
          >
             <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] relative z-10 border-[12px] border-white">
                <img 
                  src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2000" 
                  alt="Clinical Caregiving" 
                  className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 hover:scale-105" 
                />
             </div>
             <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-0"></div>
             <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-0"></div>
          </motion.div>
        </div>
      </section>

      {/* Discovery Modal */}
      <AnimatePresence>
        {isDiscoveryOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDiscoveryOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden p-12 md:p-16 border border-white/20"
            >
              <button 
                onClick={() => setIsDiscoveryOpen(false)}
                className="absolute top-10 right-10 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
                   <Users size={32} />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Select Gateway</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Direct entrance to the VACS ecosystem</p>
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

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-rose-500 opacity-50"></div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 relative z-10">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 shadow-xl">
                <Heart size={20} fill="currentColor" />
              </div>
              <span className="font-black text-2xl tracking-tighter">VACS</span>
            </div>
            <p className="text-slate-400 font-medium max-w-sm mb-10 text-lg leading-relaxed">
              Pioneering safe, accountble home care with professional clinical oversight and digital transparency.
            </p>
            <div className="flex gap-4">
               <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">
                  <ArrowRight size={18} />
               </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 leading-none">Gateways</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-bold">
              <li><Link to="/register/client" className="hover:text-white transition-colors">Client Enrollment</Link></li>
              <li><Link to="/register/rn" className="hover:text-white transition-colors">RN Application</Link></li>
              <li><Link to="/register/caregiver" className="hover:text-white transition-colors">Field Staff Registry</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 leading-none">Intelligence</h4>
            <div className="flex flex-col gap-4">
               <Link to="/login" className="text-xs font-black uppercase tracking-widest text-slate-100 bg-slate-800 px-6 py-3 rounded-full text-center hover:bg-slate-700 transition-colors">System Login</Link>
               <Link to="/vacs-control-gate" className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-700 hover:text-blue-500 text-center transition-colors">Managerial Override</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-slate-900 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 flex flex-col md:flex-row justify-between items-center gap-4">
           <span>© 2026 Visiting Angels Caregivers Solutions</span>
           <div className="flex gap-8">
              <span>Privacy / GDPR</span>
              <span>Terms of Clinical Engagement</span>
           </div>
        </div>
      </footer>
    </div>
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
      className={`flex items-start gap-5 p-6 rounded-[2rem] border transition-all group ${color} hover:shadow-2xl hover:shadow-${accent}-100 hover:-translate-y-1`}
    >
      <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center shrink-0 border border-slate-100 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-black text-slate-900 text-lg flex items-center justify-between tracking-tight">
          {title}
          <ChevronRight size={20} className={`text-slate-200 group-hover:translate-x-2 transition-all ${accents[accent]}`} />
        </h3>
        <p className="text-sm text-slate-500 mt-1 leading-snug font-medium">
          {description}
        </p>
      </div>
    </Link>
  );
}

