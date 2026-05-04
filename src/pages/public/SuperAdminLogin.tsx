import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Lock, User, ArrowLeft } from "lucide-react";

import Logo from "../../components/ui/Logo";
import { auth } from "../../lib/firebase";

export default function SuperAdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState(""); // Not used in this basic gate but good to have for consistency
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "superadmin" && password === "Mastersafe@2026") {
      localStorage.setItem("isSuperAuthenticated", "true");
      // Navigate regardless, but the gate will handle session state
      navigate("/vacs-control-gate");
    } else {
      setError("Invalid super admin credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1D45] text-white flex items-center justify-center p-6 selection:bg-[#C5A069]/20">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
           <Logo size="lg" inverted />
        </div>
        <div className="w-full bg-white/5 p-10 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A069]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-1000"></div>
          
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white mb-8 transition-colors relative z-10">
            <ArrowLeft size={14} strokeWidth={3} /> Return to Home
          </Link>
          
          <h1 className="text-2xl font-black mb-8 italic uppercase tracking-tighter relative z-10 text-white flex items-center gap-3">
             <span className="w-1 h-8 bg-[#C5A069] rounded-full"></span>
             Secure Admin Login
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Admin Username</label>
            <input 
              className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-[#C5A069] font-black tracking-widest focus:ring-2 focus:ring-[#C5A069] outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
            <input 
              type="password"
              className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-[#C5A069] font-black tracking-widest focus:ring-2 focus:ring-[#C5A069] outline-none transition-all"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full h-14 bg-[#C5A069] text-[#0B1D45] rounded-full font-black uppercase tracking-[0.2em] shadow-xl shadow-[#C5A069]/20 hover:bg-[#B49158] transition-all">Sign In</Button>
        </form>
      </div>
    </div>
  </div>
);
}
