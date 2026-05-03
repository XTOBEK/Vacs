import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Heart, Lock, Mail, ArrowLeft, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginPage({ onLogin, adminOnly = false }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const user = await res.json();
        if (adminOnly && user.role !== 'ADMIN') {
          setError("This access point is restricted to Super Admins only.");
          setLoading(false);
          return;
        }
        onLogin(user);
        
        // Redirect based on role
        if (user.role === 'ADMIN') navigate("/admin");
        else if (user.role === 'RN') navigate("/rn");
        else if (user.role === 'CAREGIVER') navigate("/dashboard");
        else if (user.role === 'CLIENT') navigate("/client");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Connection error. Please check your server.");
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
          
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-[11px] font-black uppercase tracking-tight p-4 rounded-2xl flex items-center gap-3 animate-shake">
                <ShieldAlert size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">ID Directive (Email)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-bold text-slate-900"
                  placeholder="agent@vacs.io"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Secure Protocol (Pass)</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 rounded-full"
              disabled={loading}
            >
              {loading ? "Decrypting..." : adminOnly ? "Unlock Control" : "Enter System"}
            </Button>
          </form>

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
