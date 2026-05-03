import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Heart, Lock, Mail, ArrowLeft, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { auth, db } from "../../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function LoginPage({ adminOnly = false }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Fetch user profile from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const profile = userDoc.data();
        if (adminOnly && profile.role !== 'ADMIN') {
          setError("This access point is restricted to Super Admins only.");
          setLoading(false);
          return;
        }
        
        // Redirect based on role
        if (profile.role === 'ADMIN') navigate("/vacs-control-gate");
        else if (profile.role === 'RN') navigate("/rn");
        else if (profile.role === 'CAREGIVER') navigate("/dashboard");
        else if (profile.role === 'CLIENT') navigate("/client");
      } else {
        // New user, redirect to role selection if they don't have one
        // For now, let's assume they need to register
        navigate(`/register/CAREGIVER`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to authenticate via Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-blue-100 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 mb-10 transition-colors">
            <ArrowLeft size={14} strokeWidth={3} /> Return to Public Front
          </Link>
          <div className="flex justify-center mb-6">
             <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-slate-200 border-4 border-white">
                <Heart size={36} fill="white" />
             </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
            {adminOnly ? "Control Gate" : "System Access"}
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
            {adminOnly ? "Root Audit Credentials Required" : "Professional Caregiver Identity Verification"}
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] border border-slate-100 p-10 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="relative z-10 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-[11px] font-black uppercase tracking-tight p-4 rounded-2xl flex items-center gap-3 animate-shake">
                <ShieldAlert size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              onClick={handleGoogleLogin} 
              className="w-full h-14 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 rounded-full bg-white text-slate-900 border-2 border-slate-100 hover:bg-slate-50"
              disabled={loading}
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-3" alt="Google" />
              {loading ? "Decrypting..." : "Sign in with Google"}
            </Button>
            
            <div className="flex items-center gap-4 py-2">
               <div className="h-px bg-slate-100 flex-1"></div>
               <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Secure OAuth 2.0</span>
               <div className="h-px bg-slate-100 flex-1"></div>
            </div>

            <p className="text-[10px] text-center text-slate-400 font-medium leading-relaxed italic">
              VACS uses zero-trust identity verification. Only white-listed institutional emails gain root access to clinical records.
            </p>
          </div>

          {!adminOnly && (
            <div className="mt-10 pt-8 border-t border-slate-50 text-center relative z-10">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                Identity not found? <Link to="/" className="text-blue-600 hover:underline">Apply for Entry</Link>
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center text-[9px] text-slate-300 font-black uppercase tracking-[0.4em] leading-loose">
          Encrypted Healthcare Interface <br /> 
          &copy; 2026 Visiting Angels Caregivers Solutions
        </div>
      </div>
    </div>
  );
}
