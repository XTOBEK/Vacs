import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Home, Stethoscope, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/Button";
import MainLayout from "../../components/layout/MainLayout";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-6 py-24">
        <div className="max-w-2xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Professional Decorative Element */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 mb-10 shadow-sm border border-blue-100">
              <Stethoscope size={40} className="opacity-80" />
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6 leading-none italic uppercase">
              404 <br />
              <span className="text-blue-600">Not Found</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-12 max-w-lg mx-auto">
              We're sorry, but the page you are looking for cannot be found. 
              The link might be broken, or the page may have been removed. 
              Whether you are seeking caregiver services or need immediate assistance, 
              we are here to help you find your way.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button asChild size="lg" className="h-14 px-10 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/10">
                <Link to="/">
                  <Home size={16} className="mr-2" />
                  Return to Homepage
                </Link>
              </Button>

              <div className="flex items-center gap-8">
                <Link 
                  to="/services" 
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <Stethoscope size={14} />
                  Our Services
                </Link>
                <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                <Link 
                  to="/contact" 
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <MessageSquare size={14} />
                  Contact Support
                </Link>
              </div>
            </div>

            <div className="mt-20 pt-12 border-t border-slate-100 italic">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">
                 Visiting Angels Caregivers Solutions
               </span>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
