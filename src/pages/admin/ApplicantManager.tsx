import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { Button } from '../../components/ui/Button';
import { Trash2, UserCheck, UserX } from 'lucide-react';

export const ApplicantManager = ({ user }: any) => {
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'applications'), (snap) => {
      setApps(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await updateDoc(doc(db, 'applications', id), { status });
      if(status === 'APPROVED') {
         alert('Applicant approved and activated.');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `applications/${id}`);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Permanently delete this application?")) return;
    try {
      await deleteDoc(doc(db, 'applications', id));
      alert("Application record removed.");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `applications/${id}`);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Applicant Registry</h2>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">VACS Field Professional Onboarding Queue</p>
      </div>

      <div className="grid gap-4">
        {apps.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
             <p className="text-xs font-black text-slate-300 uppercase tracking-widest italic">No pending applications in queue</p>
          </div>
        ) : apps.map(app => (
          <div key={app.id} className="bg-white border border-slate-100 p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-blue-100 transition-all shadow-sm">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-black italic uppercase">
                  {app.fullName?.[0] || "A"}
               </div>
               <div>
                  <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tight">{app.fullName}</h4>
                  <div className="flex items-center gap-3 mt-1">
                     <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{app.role}</span>
                     <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                       app.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 
                       app.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 
                       'bg-red-50 text-red-600'
                     }`}>
                       {app.status}
                     </span>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-2">
                {app.status === 'PENDING' && (
                  <>
                    <Button 
                      onClick={() => handleAction(app.id, 'APPROVED')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-xl h-10 px-6 text-[10px] font-black uppercase tracking-widest gap-2"
                    >
                       <UserCheck size={14} /> Approve
                    </Button>
                    <Button 
                      onClick={() => handleAction(app.id, 'REJECTED')}
                      variant="outline"
                      className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-10 px-6 text-[10px] font-black uppercase tracking-widest gap-2"
                    >
                       <UserX size={14} /> Reject
                    </Button>
                  </>
                )}
                <Button 
                  onClick={() => handleDelete(app.id)}
                  variant="ghost"
                  className="h-10 w-10 p-0 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                   <Trash2 size={18} />
                </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
