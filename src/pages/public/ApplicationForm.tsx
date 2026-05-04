import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from '../../components/ui/Button';
import { useSearchParams } from 'react-router-dom';
import { Upload, ShieldCheck, FileText, User } from 'lucide-react';

export default function ApplicationForm() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'HCA';
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: initialRole,
    phone: '',
    licenseNumber: '',
    certifications: '',
    experience: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'applications'), {
        ...formData,
        status: 'PENDING',
        createdAt: serverTimestamp()
      });
      alert('Clinical registry application submitted. Awaiting hub verification.');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Registry submission error. Please check your data or contact hub.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto pt-32 pb-24 px-6">
        <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="bg-[#0B1D45] p-10 text-white">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">VACS Recruitment Gate</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A069]">Step {step} of 2: {step === 1 ? 'Personal Identity' : 'Clinical Credentials'}</p>
          </div>

          <div className="p-10 md:p-16">
            {step === 1 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-500">
                <div className="grid md:grid-cols-2 gap-8">
                   <InputField label="Full Legal Name" icon={<User size={14} />} name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleInputChange} />
                   <InputField label="Operational Email" icon={<FileText size={14} />} name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} />
                   <InputField label="Contact Node" icon={<ShieldCheck size={14} />} name="phone" placeholder="+234..." value={formData.phone} onChange={handleInputChange} />
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Role</label>
                      <select name="role" value={formData.role} onChange={handleInputChange} className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                        <option value="HCA">HCA Caregiver</option>
                        <option value="SCA">SCA Caregiver</option>
                        <option value="RN">Registered Nurse</option>
                        <option value="SUPPORT">Support Staff</option>
                      </select>
                   </div>
                </div>
                <div className="pt-6 border-t border-slate-100 flex justify-end">
                   <Button onClick={() => setStep(2)} className="h-14 px-12 rounded-full font-black uppercase tracking-widest text-[10px] bg-blue-600">Enter Credentials Ledger</Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-500">
                <div className="grid md:grid-cols-2 gap-8">
                   <FileUpload label="Government Issued ID" description="NIN, PVC, or International Passport" />
                   <FileUpload label="Clinical Certification" description="Relevant practice license or school cert" />
                </div>
                
                <div className="space-y-8">
                   {(formData.role === 'RN' || formData.role === 'SCA') && (
                     <div className="grid md:grid-cols-2 gap-8">
                        <InputField label="Practicing License #" icon={<ShieldCheck size={14} />} name="licenseNumber" placeholder="RN-XXXX-XXXX" value={formData.licenseNumber} onChange={handleInputChange} />
                        <InputField label="Board Certification" icon={<ShieldCheck size={14} />} name="certifications" placeholder="ICN Specialty..." value={formData.certifications} onChange={handleInputChange} />
                     </div>
                   )}
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brief Care Biography</label>
                      <textarea name="experience" onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none h-40" placeholder="Years of experience, specialties, or previous station..."></textarea>
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-between gap-5">
                   <Button variant="ghost" onClick={() => setStep(1)} className="h-14 px-8 rounded-full font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-900 border-none">Modify Identity</Button>
                   <Button onClick={handleSubmit} disabled={loading} className="h-14 px-12 rounded-full font-black uppercase tracking-widest text-[10px] bg-blue-600">
                     {loading ? 'Cryptographic Signing...' : 'Synchronize Registry Application'}
                   </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function InputField({ label, icon, name, placeholder, value, onChange, type = "text" }: any) {
   return (
      <div className="space-y-2">
         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
         <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
               {icon}
            </div>
            <input 
               type={type} 
               name={name}
               value={value}
               onChange={onChange}
               placeholder={placeholder}
               className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
            />
         </div>
      </div>
   );
}

function FileUpload({ label, description }: any) {
   return (
      <div className="space-y-2">
         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
         <div className="border-2 border-dashed border-slate-100 bg-slate-50 p-8 rounded-3xl text-center group hover:border-blue-500 transition-all cursor-pointer">
            <Upload className="mx-auto mb-4 text-slate-300 group-hover:text-blue-500 transition-colors" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{description}</p>
            <p className="text-[9px] font-bold text-slate-300 uppercase italic">PNG, JPG or PDF supported</p>
         </div>
      </div>
   );
}
