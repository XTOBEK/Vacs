import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Lock, ShieldAlert, ArrowLeft, Heart, Server, Activity } from "lucide-react";
import { auth, db } from "../../lib/firebase";
import { 
  signInWithEmailAndPassword
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Logo from "../../components/ui/Logo";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          // Check if user is Admin in Firestore
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists() && userDoc.data().role === 'ADMIN') {
              navigate("/vacs-control-gate");
          } else if (user.email === 'princewill.iwuoha@gmail.com') {
              // Master owner override
              navigate("/vacs-control-gate");
          } else {
              await auth.signOut();
              throw new Error("Access Denied: This terminal is restricted to authorized VACS Admin personnel only.");
          }
      } catch (err: any) {
          console.error(err);
          setError(err.message || "Cryptographic verification failed.");
      } finally {
          setLoading(false);
      }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-rose-500 opacity-20"></div>
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-12 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white mb-10 transition-colors">
                <ArrowLeft size={14} /> System Egress
            </Link>
            <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl relative">
                    <Logo size="lg" inverted />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-950 animate-pulse"></div>
                </div>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Control Gate</h1>
            <p className="text-[#C5A069] text-[9px] font-black uppercase tracking-[0.5em] mt-3">Institutional Resource Partition</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-10 md:p-12 shadow-2xl shadow-black/50">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl flex items-center gap-3 mb-8 animate-shake">
                <ShieldAlert size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Credential Node (Email)</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-sm font-bold focus:ring-2 focus:ring-[#C5A069] outline-none transition-all placeholder:text-slate-700"
                        placeholder="admin@vacscare.com"
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Security Key (Password)</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-sm font-bold focus:ring-2 focus:ring-[#C5A069] outline-none transition-all placeholder:text-slate-700"
                        placeholder="••••••••••••"
                        required
                    />
                </div>
                <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-14 bg-[#C5A069] hover:bg-[#B49158] text-[#0B1D45] border-none rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#C5A069]/20 transition-all mt-4"
                >
                    {loading ? "Verifying..." : "Initialize Session"}
                </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
                <div className="flex items-center gap-3 text-slate-500">
                    <Activity size={14} className="text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Network Status: Optimized</span>
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
