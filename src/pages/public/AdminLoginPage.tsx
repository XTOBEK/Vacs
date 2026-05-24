import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Lock, ShieldAlert, ArrowLeft, Heart, Server, Activity, Key } from "lucide-react";
import { auth, db } from "../../lib/firebase";
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Logo from "../../components/ui/Logo";

interface AdminLoginPageProps {
  isSuper?: boolean;
}

export default function AdminLoginPage({ isSuper = false }: AdminLoginPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please key in your Credential Node (Email) first to receive a security reset signal.");
      return;
    }
    setResetLoading(true);
    setResetSent(false);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email.toLowerCase().trim());
      setResetSent(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to transmit password reset signal.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cleanEmail = email.toLowerCase().trim();

    try {
        let user;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
            user = userCredential.user;
        } catch (signInErr: any) {
            // Auto-register for testers using *.test emails or the CEO email
            const isSpecialUser = cleanEmail.endsWith('.test') || cleanEmail === 'princewill.iwuoha@gmail.com';
            if (signInErr.code === 'auth/invalid-credential' && isSpecialUser) {
                try {
                    const autoReg = await createUserWithEmailAndPassword(auth, cleanEmail, password);
                    user = autoReg.user;
                } catch (regErr: any) {
                    if (regErr.code === 'auth/email-already-in-use') {
                        throw signInErr; // original wrong-password/invalid-credential error
                    }
                    throw regErr;
                }
            } else {
                throw signInErr;
            }
        }
        
        // Fetch Admin profile in Firestore
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.exists() ? userDoc.data() : null;
        const userEmail = user.email?.toLowerCase().trim();
        
        if (isSuper) {
          const checkSuper = userEmail === 'princewill.iwuoha@gmail.com' || userData?.isSuper === true;
          if (checkSuper) {
              // Direct login for Sovereign admin
              navigate("/superadmin");
          } else {
              await auth.signOut();
              throw new Error("Access Denied: Sovereign credentials required for Super Gate.");
          }
        } else {
          // Normal Admin (Coordinator) and test coordinators
          const isSuperCheck = userEmail === 'princewill.iwuoha@gmail.com' || userData?.isSuper === true;
          if (isSuperCheck) {
              await auth.signOut();
              throw new Error("Super Admin cannot sign in here. Please use the hidden Super Gate.");
          } else if (userData?.role === 'ADMIN' || userEmail === 'coordinator@vacs.test') {
              // Approved Normal Admin
              navigate("/admin");
          } else {
              await auth.signOut();
              throw new Error("Access Denied: This terminal is restricted to authorized branch coordinators only.");
          }
        }
    } catch (err: any) {
        console.error(err);
        let message = "Access denied. Please check your admin credentials.";
        
        if (err.code === 'auth/invalid-credential') {
          message = "Incorrect email or password. Verify the portal selection match.";
        } else if (err.code === 'auth/user-not-found') {
          message = "No administrator account found with this email.";
        } else if (err.code === 'auth/too-many-requests') {
          message = "Security lock active due to too many failed attempts. Please try again in a few minutes.";
        } else if (err.message) {
          message = err.message;
        }
        
        setError(message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isSuper ? "from-rose-500 via-[#C5A069] to-red-600" : "from-blue-600 via-emerald-500 to-[#C5A069]"} opacity-30`}></div>
      <div className={`absolute top-1/4 -left-20 w-96 h-96 ${isSuper ? "bg-rose-600/10" : "bg-blue-600/10"} blur-[120px] rounded-full`}></div>
      <div className={`absolute bottom-1/4 -right-20 w-96 h-96 ${isSuper ? "bg-red-600/10" : "bg-emerald-600/10"} blur-[120px] rounded-full`}></div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-12 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white mb-10 transition-colors">
                <ArrowLeft size={14} /> System Egress
            </Link>
            <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl relative">
                    <Logo size="lg" inverted />
                    <div className={`absolute -top-1 -right-1 w-4 h-4 ${isSuper ? "bg-rose-500" : "bg-emerald-500"} rounded-full border-4 border-slate-950 animate-pulse`}></div>
                </div>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
              {isSuper ? "VACS Sovereign Gate" : "Branch Leader Gate"}
            </h1>
            <p className="text-[#C5A069] text-[9px] font-black uppercase tracking-[0.5em] mt-3">
              {isSuper ? "Sovereign Root Administrator partition" : "Regional Coordinator Access Node"}
            </p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-10 md:p-12 shadow-2xl shadow-black/50">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl flex items-center gap-3 mb-8 animate-shake">
                <ShieldAlert size={16} className="shrink-0" />
                <span className="flex-1 text-[10px]">{error}</span>
              </div>
            )}

            {resetSent && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest p-4 rounded-xl mb-8 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                <span>Security key reset signal transmitted! Check your email inbox.</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Credential Node (Email)</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-sm font-bold focus:ring-2 focus:ring-[#C5A069] outline-none transition-all placeholder:text-slate-700 font-mono"
                        placeholder={isSuper ? "sovereign@visitingangels.com" : "coordinator@vacs.test"}
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Security Key (Password)</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-sm font-bold focus:ring-2 focus:ring-[#C5A069] outline-none transition-all placeholder:text-slate-700 font-mono"
                        placeholder="••••••••••••"
                        required
                    />
                </div>

                <div className="flex justify-end px-2">
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="text-[9px] font-black uppercase tracking-widest text-[#C5A069]/60 hover:text-[#C5A069] transition-colors cursor-pointer"
                    disabled={resetLoading}
                  >
                    {resetLoading ? "Transmitting Reset Request..." : "Reset Security Key / Forgot Key?"}
                  </button>
                </div>

                <Button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full h-14 ${isSuper ? "bg-rose-600 hover:bg-rose-700 text-white" : "bg-[#C5A069] hover:bg-[#B49158] text-[#0B1D45]"} border-none rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-2xl transition-all mt-4`}
                >
                    {loading ? "Verifying Keys..." : "Initialize Session"}
                </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
                <div className="flex items-center gap-3 text-slate-500">
                    <Activity size={14} className={isSuper ? "text-rose-500" : "text-emerald-500"} />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      SYSTEM INTEGRITY: SECURE
                    </span>
                </div>
                <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
                    Unauthorized access attempts are logged <br /> and reported to VACS Compliance.
                </p>
            </div>
        </div>

        <div className="mt-12 text-center">
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">Owerri • Lagos • Virtual Network</span>
        </div>
      </div>
    </div>
  );
}
