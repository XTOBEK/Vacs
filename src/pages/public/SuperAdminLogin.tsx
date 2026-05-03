import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Lock, User, ArrowLeft } from "lucide-react";

export default function SuperAdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "superadmin" && password === "Mastersafe@2026") {
      // In a real app, you would set a session item or update a context
      // For this prototype, we'll navigate directly
      localStorage.setItem("isSuperAuthenticated", "true");
      navigate("/vacs-control-gate");
    } else {
      setError("Invalid super admin credentials");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={14} strokeWidth={3} /> Return to Home
        </Link>
        <h1 className="text-2xl font-black mb-8 italic uppercase tracking-tighter">Super Admin Gate</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase">Username</label>
            <input 
              className="w-full p-4 bg-slate-800 rounded-xl"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase">Password</label>
            <input 
              type="password"
              className="w-full p-4 bg-slate-800 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full h-12 bg-blue-600 rounded-full font-black uppercase tracking-widest">Authenticate</Button>
        </form>
      </div>
    </div>
  );
}
