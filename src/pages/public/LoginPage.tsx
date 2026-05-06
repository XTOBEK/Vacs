import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Heart, Lock, Mail, ArrowLeft, ShieldAlert } from "lucide-react";
import { auth, db } from "../../lib/firebase";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import Logo from "../../components/ui/Logo";

export default function LoginPage({ adminOnly = false, allowedRole = null }: any) {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  const handleAuthResult = async (user: any, isNewUser = false) => {
      // Fetch user profile from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const profile = userDoc.data();
        
        if (profile.status === 'locked_pending_review' || profile.status === 'permanently_terminated' || profile.verificationStatus === 'BLOCKED') {
           throw new Error("ACCESS REVOKED: This account has been locked due to clinical protocol violations or deactivation.");
        }

        if (adminOnly && profile.role !== 'ADMIN') {
          throw new Error("This access point is restricted to Super Admins only.");
        }
        if (allowedRole && profile.role !== allowedRole) {
           throw new Error(`This access point is restricted to ${allowedRole}s only.`);
        }
        
        // Redirect based on role
        if (profile.role === 'ADMIN') navigate("/vacs-control-gate");
        else if (profile.role === 'RN') navigate("/rn");
        else if (profile.role === 'CAREGIVER') navigate("/dashboard");
        else if (profile.role === 'CLIENT') navigate("/client");
      } else if (user.email === 'princewill.iwuoha@gmail.com') {
        // Owner is auto-admin
        navigate("/vacs-control-gate");
      } else {
        if (isNewUser) {
           // For new users, we'll send them to completing their profile
           navigate(`/register/${allowedRole || 'CAREGIVER'}`);
        } else {
           navigate(`/register/CAREGIVER`);
        }
      }
  }

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      await handleAuthResult(result.user);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to authenticate via Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
          if (isSignUp) {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (fullName) {
              await updateProfile(userCredential.user, { displayName: fullName });
            }
            await handleAuthResult(userCredential.user, true);
          } else {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await handleAuthResult(userCredential.user);
          }
      } catch (err: any) {
          console.error(err);
          setError(err.message || "Authentication failed. Check your credentials.");
      } finally {
          setLoading(false);
      }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-blue-100 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 mb-10 transition-colors">
            <ArrowLeft size={14} strokeWidth={3} /> Return to Public Front
          </Link>
          <div className="flex justify-center mb-6">
             <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-black text-[#0B1D45] tracking-tighter uppercase italic">
            {adminOnly ? "Control Gate" : (isSignUp ? "Identity Creation" : "System Access")}
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
            {adminOnly ? "Root Audit Credentials Required" : (isSignUp ? "Register Professional ID" : "Identity Verification Node")}
          </p>
        </div>

        <div className="bg-[#0B1D45] rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] border border-white/10 p-10 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="relative z-10 space-y-6">
            {error && (
              <div className="bg-red-50/10 border border-red-500/20 text-red-400 text-[11px] font-black uppercase tracking-tight p-4 rounded-2xl flex items-center gap-3 animate-shake">
                <ShieldAlert size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
                {isSignUp && (
                  <input 
                      type="text"
                      placeholder="Full Legal Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-4 bg-white/10 rounded-2xl border border-white/20 focus:ring-2 focus:ring-[#C5A069] text-white text-sm font-bold placeholder:text-slate-500"
                      required
                  />
                )}
                <input 
                    type="email"
                    placeholder="Email (Hotmail, Yahoo, etc.)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 bg-white/10 rounded-2xl border border-white/20 focus:ring-2 focus:ring-[#C5A069] text-white text-sm font-bold placeholder:text-slate-500"
                    required
                />
                <input 
                    type="password"
                    placeholder="Security Key (Password)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-white/10 rounded-2xl border border-white/20 focus:ring-2 focus:ring-[#C5A069] text-white text-sm font-bold placeholder:text-slate-500"
                    required
                />
                <Button type="submit" className="w-full h-14 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-[#C5A069]/10 rounded-full bg-[#C5A069] text-[#0B1D45] hover:bg-[#B49158]" disabled={loading}>
                    {loading ? "Decrypting..." : (isSignUp ? "Generate Professional ID" : "Verify & Sign In")}
                </Button>
            </form>

            {!isSignUp && (
              <>
                <div className="flex items-center gap-4 py-4">
                   <div className="h-px bg-slate-100 flex-1"></div>
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">OR</span>
                   <div className="h-px bg-slate-100 flex-1"></div>
                </div>

                <Button 
                  onClick={handleGoogleLogin} 
                  className="w-full h-14 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 rounded-full bg-white text-slate-900 border-2 border-slate-100 hover:bg-slate-50"
                  disabled={loading}
                >
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-3" alt="Google" />
                  {loading ? "Decrypting..." : "Sign in with Google"}
                </Button>
              </>
            )}
            
            <p className="text-[10px] text-center text-slate-400 font-medium leading-relaxed italic">
              VACS treats all institutional and personal emails with high-grade clinical encryption.
            </p>
          </div>

          {!adminOnly && (
            <div className="mt-10 pt-8 border-t border-slate-50 text-center relative z-10">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                {isSignUp ? "Already have a node ID?" : "No ID found?"}{" "}
                <button 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-600 hover:underline font-black"
                >
                  {isSignUp ? "Return to Sign In" : "Register Now"}
                </button>
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
