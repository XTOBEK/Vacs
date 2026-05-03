import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Menu, X, ArrowRight, Instagram, Linkedin, Twitter, MapPin } from "lucide-react";
import { Button } from "../ui/Button";
import { db, handleFirestoreError, OperationType } from "../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

import Logo from "../ui/Logo";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [cmsBranding, setCmsBranding] = useState<any>(null);
  const [cmsContact, setCmsContact] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const unsubBranding = onSnapshot(doc(db, "cms", "branding"), (doc) => {
      if (doc.exists()) setCmsBranding(doc.data());
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "cms/branding");
    });
    const unsubContact = onSnapshot(doc(db, "cms", "contact"), (doc) => {
      if (doc.exists()) setCmsContact(doc.data());
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "cms/contact");
    });
    return () => {
      unsubBranding();
      unsubContact();
    };
  }, []);

  const navLinks = [
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Clinical FAQ", path: "/faq" },
    { name: "Care Plans", path: "/plans" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            {cmsBranding?.logoUrl ? (
              <img src={cmsBranding.logoUrl} className="h-10 w-auto object-contain" alt="VACS Logo" />
            ) : (
              <Logo size="sm" />
            )}
            <div className="flex flex-col leading-none">
               <span className="font-black text-xl tracking-tighter text-[#0B1D45]">{cmsBranding?.name?.split(' ')[0] || "VACS"}</span>
               <span className="text-[10px] font-bold text-[#C5A069] uppercase tracking-widest mt-0.5">{cmsBranding?.tagline?.split('.')[0] || "Clinical Care"}</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`transition-colors hover:text-blue-600 ${location.pathname === link.path ? 'text-blue-600' : 'text-slate-500'}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-4 w-px bg-slate-200"></div>
            <Link to="/superadmin" className="text-rose-500 hover:text-rose-400 transition-colors">Super Admin</Link>
            <Link to="/staff-login" className="hover:text-blue-600 transition-colors text-slate-900">Staff</Link>
            <Link to="/client-login" className="hover:text-blue-600 transition-colors text-slate-900">Client</Link>
            <Link to="/register/client">
              <Button size="sm" className="rounded-full shadow-xl shadow-blue-500/10 h-10 px-6">Enroll Now</Button>
            </Link>
          </nav>

          <button className="md:hidden p-2 text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <nav className="flex flex-col gap-6 p-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="h-px bg-slate-100 w-full"></div>
                <Link to="/superadmin" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-rose-500">Super Admin</Link>
                <Link to="/staff-login" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-900">Staff Login</Link>
                <Link to="/client-login" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-900">Client Login</Link>
                <Link to="/register/client" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-full h-12 shadow-md">Enroll Now</Button>
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-rose-500 opacity-50"></div>
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8 text-[#0B1D45]">
              {cmsBranding?.logoUrl ? (
                <img src={cmsBranding.logoUrl} className="h-10 brightness-0 invert opacity-80" alt="Logo" />
              ) : (
                <Logo size="sm" inverted />
              )}
              <span className="font-black text-2xl tracking-tighter text-white">{cmsBranding?.name?.split(' ')[0] || "VACS"}</span>
            </div>
            <p className="text-slate-400 font-medium max-w-sm mb-10 text-lg leading-relaxed">
              {cmsBranding?.tagline || "Pioneering safe, accountable home care with professional clinical oversight and digital transparency."}
            </p>
            <div className="flex gap-4">
               {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                 <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition-all cursor-pointer">
                    <Icon size={18} />
                 </a>
               ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 leading-none">Gateways</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-bold">
              <li><Link to="/register/client" className="hover:text-white transition-colors">Client Enrollment</Link></li>
              <li><Link to="/register/rn" className="hover:text-white transition-colors">RN Application</Link></li>
              <li><Link to="/register/caregiver" className="hover:text-white transition-colors">Field Staff Registry</Link></li>
              <li><Link to="/plans" className="hover:text-white transition-colors">Care Packages</Link></li>
              <li className="pt-2"><Link to="/superadmin" className="text-rose-500 hover:text-rose-400 transition-colors">Super Admin Portal</Link></li>
              <li><Link to="/staff-login" className="hover:text-white transition-colors">Staff Login</Link></li>
              <li><Link to="/client-login" className="hover:text-white transition-colors">Client Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 leading-none">Intelligence</h4>
            <div className="flex flex-col gap-4">
               <Link to="/login" className="text-xs font-black uppercase tracking-widest text-slate-100 bg-slate-800 px-6 py-3 rounded-full text-center hover:bg-slate-700 transition-colors">System Login</Link>
               <Link to="/contact" className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-700 hover:text-blue-500 text-center transition-colors">Support Center</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-slate-900 flex flex-col lg:flex-row justify-between items-center gap-8">
           <div className="flex flex-col gap-2 items-center lg:items-start order-2 lg:order-1">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 block mb-1">© 2026 {cmsBranding?.name || "Visiting Angels Caregivers Solutions"}</span>
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-slate-700">
                 <MapPin size={10} className="text-blue-500" />
                 <span>{cmsContact?.address || "HQ: Owerri, Imo State, Nigeria"} | +234 806 214 6613</span>
              </div>
              <p className="max-w-lg mt-4 text-[10px] font-medium text-slate-700 leading-tight">
                 <span className="font-black text-rose-500 uppercase tracking-widest block mb-1">Non-Medical Disclaimer:</span>
                 Visiting Angels Caregivers Solutions is headquartered in Owerri but operates a Virtual Care Network that allows us to provide supervised support across Anambra, Imo, and beyond. This platform handles administrative coordination; physical care is always supervised by our Owerri-certified RN team.
              </p>
           </div>
           
           <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 order-1 lg:order-2">
              <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy / GDPR</Link>
              <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms of Clinical Engagement</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}
