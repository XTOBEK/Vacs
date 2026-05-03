import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "../../components/ui/Button";
import { auth, db, OperationType, handleFirestoreError } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { 
  Heart, 
  Stethoscope, 
  UserPlus, 
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Mail,
  User,
  Phone,
  FileText
} from "lucide-react";

export default function RegistrationPage() {
  const { role } = useParams();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    summary: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      setFormData(prev => ({
        ...prev,
        fullName: auth.currentUser?.displayName || "",
        email: auth.currentUser?.email || ""
      }));
    } else {
      // If not logged in, they should go to login first to get a UID
      navigate("/login");
    }
  }, [navigate]);

  const roles: any = {
    client: {
      title: "Client Admission",
      icon: Heart,
      color: "text-rose-500",
      bg: "bg-rose-50",
      role: "CLIENT",
      description: "Begin your journey towards safe, professional home care."
    },
    rn: {
      title: "RN Program Enrollment",
      icon: Stethoscope,
      color: "text-blue-500",
      bg: "bg-blue-50",
      role: "RN",
      description: "Join our network of clinical oversight professionals."
    },
    caregiver: {
      title: "Field Staff Application",
      icon: UserPlus,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      role: "CAREGIVER",
      description: "Enlist as an HCA/SCA and start your clinical certification."
    }
  };

  const currentRole = roles[role || "caregiver"] || roles.caregiver;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setLoading(true);
    const userId = auth.currentUser.uid;
    const path = `users/${userId}`;

    try {
      await setDoc(doc(db, "users", userId), {
        uid: userId,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: currentRole.role,
        summary: formData.summary,
        kitStatus: 'MISSING',
        guarantorStatus: 'PENDING',
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl shadow-slate-200 border border-slate-100"
        >
          <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-100">
             <CheckCircle2 size={48} strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 italic uppercase">Application Logged</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-10 leading-relaxed">
            Your credentials have been submitted to the VACS clinical audit board. You will receive a secure directive via email within 24 hours.
          </p>
          <Link to="/">
            <Button className="w-full h-14 rounded-full text-xs font-black uppercase tracking-[0.2em]">Return to Hub</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 mb-10 transition-colors">
            <ArrowLeft size={14} strokeWidth={3} /> Back to Gateway
          </Link>
          <div className="flex justify-center mb-6">
             <div className={`w-20 h-20 ${currentRole.bg} rounded-[2rem] flex items-center justify-center ${currentRole.color} shadow-2xl shadow-slate-200 border-4 border-white`}>
                <currentRole.icon size={36} />
             </div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">
            {currentRole.title}
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 px-12">
            {currentRole.description}
          </p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.08)] border border-slate-100 p-10 md:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/30 rounded-full blur-3xl -mr-24 -mt-24"></div>
          
          <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                 <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input 
                     type="text"
                     value={formData.fullName}
                     onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                     className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-bold text-slate-900"
                     required
                   />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Contact Protocol</label>
                 <div className="relative">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input 
                     type="tel"
                     value={formData.phone}
                     onChange={(e) => setFormData({...formData, phone: e.target.value})}
                     className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-bold text-slate-900"
                     required
                   />
                 </div>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Secure Email ID</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="email"
                  value={formData.email}
                  readOnly
                  className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none text-sm font-bold text-slate-400 cursor-not-allowed"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Case Brief / Professional Summary</label>
              <div className="relative">
                <FileText className="absolute left-4 top-6 text-slate-400" size={16} />
                <textarea 
                  value={formData.summary}
                  onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  className="w-full pl-12 pr-4 py-5 h-32 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-bold text-slate-900 resize-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-5 bg-slate-50 rounded-2xl border border-slate-100">
               <ShieldCheck className="text-blue-600 shrink-0" size={20} />
               <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                 By submitting, you agree to the VACS Clinical Confidentiality Agreement and verify the authenticity of all data provided.
               </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 rounded-full"
              disabled={loading}
            >
              {loading ? "Transmitting..." : "Submit to Board"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
