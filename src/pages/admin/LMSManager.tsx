import React, { useState, useEffect } from "react";
import { db, handleFirestoreError, OperationType } from "../../lib/firebase";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { Button } from "../../components/ui/Button";
import { GraduationCap, Plus, Edit, Trash2, Eye, ShieldAlert, CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";

export default function LMSManager() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingExam, setEditingExam] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "exams"), (snapshot) => {
      setExams(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExam.id) {
        await updateDoc(doc(db, "exams", editingExam.id), editingExam);
      } else {
        await addDoc(collection(db, "exams"), {
          ...editingExam,
          createdAt: new Date().toISOString(),
          isPublished: false
        });
      }
      setIsEditing(false);
      setEditingExam(null);
      alert("Curriculum Registry Synchronized.");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, "exams");
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "exams", id), { isPublished: !current });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `exams/${id}`);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-[#C5A069] shadow-xl">
               <GraduationCap size={28} />
            </div>
            <div>
               <h3 className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">Academy Logistics Manager</h3>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Curriculum Deployment & Certification Node</p>
            </div>
         </div>
         <Button 
            onClick={() => {
              setEditingExam({ title: "", content: "", questions: [{ q: "", options: ["", "", "", ""], correctAnswer: "" }] });
              setIsEditing(true);
            }} 
            className="h-12 px-8 rounded-full bg-[#0B1D45] text-white border-none text-[10px] font-black uppercase tracking-widest gap-3 shadow-xl"
         >
            <Plus size={16} /> Forge New Module
         </Button>
      </div>

      {isEditing ? (
        <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-2xl space-y-10">
           <div className="flex items-center justify-between border-b border-slate-50 pb-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Module Architect</h4>
              <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-xs uppercase font-black tracking-widest text-slate-400">Abort Draft</Button>
           </div>
           
           <form onSubmit={handleSaveExam} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Curriculum Title</label>
                    <input 
                      type="text" 
                      value={editingExam.title}
                      onChange={e => setEditingExam({...editingExam, title: e.target.value})}
                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Registry Category</label>
                    <input 
                      type="text" 
                      value={editingExam.category}
                      onChange={e => setEditingExam({...editingExam, category: e.target.value})}
                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Instructional Content (Markdown/Text)</label>
                 <textarea 
                    value={editingExam.content}
                    onChange={e => setEditingExam({...editingExam, content: e.target.value})}
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                 />
              </div>

              <div className="space-y-8">
                 <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-blue-500 pl-4">Assessment Logic ({editingExam.questions.length})</h5>
                 {editingExam.questions.map((q: any, i: number) => (
                   <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-6">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Question #{i + 1}</label>
                         <input 
                           type="text" 
                           value={q.q}
                           onChange={e => {
                             const qs = [...editingExam.questions];
                             qs[i].q = e.target.value;
                             setEditingExam({...editingExam, questions: qs});
                           }}
                           className="w-full h-12 bg-white border border-slate-100 rounded-xl px-4 text-xs font-bold outline-none"
                         />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         {q.options.map((opt: string, optI: number) => (
                            <input 
                              key={optI}
                              type="text"
                              value={opt}
                              placeholder={`Option ${optI + 1}`}
                              onChange={e => {
                                const qs = [...editingExam.questions];
                                qs[i].options[optI] = e.target.value;
                                setEditingExam({...editingExam, questions: qs});
                              }}
                              className="w-full h-10 bg-white border border-slate-100 rounded-lg px-4 text-xs font-medium outline-none"
                            />
                         ))}
                      </div>
                      <div className="pt-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Correct Alignment (Must match exactly)</label>
                         <input 
                           type="text" 
                           value={q.correctAnswer}
                           onChange={e => {
                             const qs = [...editingExam.questions];
                             qs[i].correctAnswer = e.target.value;
                             setEditingExam({...editingExam, questions: qs});
                           }}
                           className="w-full h-10 bg-white border border-emerald-100 rounded-lg px-4 text-xs font-black text-emerald-600 outline-none mt-2"
                         />
                      </div>
                   </div>
                 ))}
                 <Button 
                   type="button" 
                   variant="outline"
                   onClick={() => {
                     const qs = [...editingExam.questions, { q: "", options: ["", "", "", ""], correctAnswer: "" }];
                     setEditingExam({...editingExam, questions: qs});
                   }}
                   className="w-full h-12 border-dashed border-slate-200 text-slate-400 text-[9px] font-black uppercase tracking-widest hover:bg-slate-50"
                 >
                   Inject Question Node
                 </Button>
              </div>

              <div className="flex gap-4 pt-10 border-t border-slate-50">
                 <Button type="submit" className="flex-1 h-16 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-widest shadow-2xl">
                    Authorize Curriculum Sync
                 </Button>
              </div>
           </form>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {loading ? (
             <div className="col-span-full py-20 text-center animate-pulse text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Reading Curriculum Nodes...</div>
           ) : exams.length === 0 ? (
             <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                <ShieldAlert size={48} className="mx-auto text-slate-100 mb-4" />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No active curriculum discovered in registry.</p>
             </div>
           ) : (
             exams.map(exam => (
               <div key={exam.id} className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                  <div className="relative z-10 flex flex-col h-full">
                     <div className="flex items-center justify-between mb-6">
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                          exam.isPublished ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-slate-50 border-slate-100 text-slate-400"
                        )}>
                          {exam.isPublished ? "Active Node" : "Draft Status"}
                        </span>
                        <div className="flex items-center gap-2">
                           <Button onClick={() => { setEditingExam(exam); setIsEditing(true); }} variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100"><Edit size={14} /></Button>
                        </div>
                     </div>
                     <h4 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic mb-2 group-hover:text-blue-600 transition-colors">{exam.title}</h4>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">{exam.questions?.length || 0} Professional Assessment Nodes</p>
                     
                     <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <Button 
                          onClick={() => handleTogglePublish(exam.id, exam.isPublished)}
                          variant="ghost" 
                          className="p-0 h-auto text-[9px] font-black uppercase tracking-widest text-blue-600 hover:bg-transparent"
                        >
                           {exam.isPublished ? "Archive Node" : "Publish to Academy"}
                        </Button>
                        <ShieldAlert size={16} className={cn("transition-colors", exam.isPublished ? "text-emerald-500" : "text-slate-200")} />
                     </div>
                  </div>
               </div>
             ))
           )}
        </div>
      )}
    </div>
  );
}
