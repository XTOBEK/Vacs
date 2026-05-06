import React, { useState, useEffect } from "react";
import { db, handleFirestoreError, OperationType, auth } from "../../lib/firebase";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  doc,
  updateDoc,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { Button } from "../../components/ui/Button";
import { GraduationCap, Play, CheckCircle2, ChevronRight, BookOpen, Clock, Award, ShieldAlert, Zap } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function AcademyPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quizMode, setQuizMode] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const unsubCourses = onSnapshot(collection(db, "exams"), (snapshot) => {
      setCourses(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any)).filter(c => c.isPublished));
      setLoading(false);
    });

    if (auth.currentUser) {
      const q = query(collection(db, "exams"), where("isPublished", "==", true));
      // We'll fetch results for this user separately or use onSnapshot for their assessments
      const unsubAssessments = onSnapshot(collection(db, "assessments"), (snapshot) => {
          const userAssessments = snapshot.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter((a: any) => a.studentId === auth.currentUser?.uid);
          setProgress(userAssessments);
      });
      return () => {
          unsubCourses();
          unsubAssessments();
      };
    }

    return () => unsubCourses();
  }, []);

  const handleStartQuiz = () => {
    setAnswers(new Array(selectedCourse.questions.length).fill(""));
    setQuizMode(true);
    setResult(null);
  };

  const handleSubmitQuiz = async () => {
    if (answers.some(a => a === "")) {
      alert("All clinical assessment questions must be answered.");
      return;
    }

    setSubmitting(true);
    try {
      let score = 0;
      selectedCourse.questions.forEach((q: any, i: number) => {
        if (q.correctAnswer === answers[i]) score++;
      });
      const finalScore = (score / selectedCourse.questions.length) * 100;
      const passed = finalScore >= (selectedCourse.passingScore || 80);

      const assessmentData = {
        examId: selectedCourse.id,
        studentId: auth.currentUser?.uid,
        answers,
        score: finalScore,
        status: passed ? "PASSED" : "FAILED",
        submittedAt: new Date().toISOString()
      };

      await addDoc(collection(db, "assessments"), assessmentData);
      
      setResult({ score: finalScore, passed });
      setQuizMode(false);
      
      // Update global user progress if needed (e.g. kit status or verification)
      if (passed && finalScore === 100) {
          // logic could go here
      }

    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "assessments");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Loading VACS Academy...</div>;

  return (
    <div className="p-6 md:p-14 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
               <GraduationCap size={28} />
            </div>
            <div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">VACS Academy</h2>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Essential Training for Our Caregivers</p>
            </div>
         </div>
         <div className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <Award size={20} className="text-[#C5A069]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Certificates Earned: {progress.filter(p => p.status === 'PASSED').length}</span>
         </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
         {/* Course List */}
         <div className="lg:col-span-4 space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Current Courses</h4>
            {courses.map(course => {
              const assessment = progress.find(p => p.examId === course.id);
              const isPassed = assessment?.status === 'PASSED';
              return (
                <button 
                  key={course.id}
                  onClick={() => {
                    setSelectedCourse(course);
                    setQuizMode(false);
                    setResult(null);
                  }}
                  className={cn(
                    "w-full text-left p-6 rounded-[2rem] border transition-all flex items-center justify-between group",
                    selectedCourse?.id === course.id 
                      ? "bg-white border-blue-200 shadow-xl shadow-blue-500/5 text-blue-600 translate-x-2" 
                      : "bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600 shadow-sm"
                  )}
                >
                   <div className="flex items-center gap-4">
                      {isPassed ? <CheckCircle2 size={24} className="text-emerald-500" /> : <BookOpen size={24} />}
                      <div className="min-w-0">
                         <p className="text-xs font-black uppercase tracking-[0.1em] truncate italic">{course.title}</p>
                         <p className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-60">{course.category || "Standard Care"}</p>
                      </div>
                   </div>
                   <ChevronRight size={18} className={cn("transition-transform", selectedCourse?.id === course.id ? "rotate-90" : "")} />
                </button>
              );
            })}
         </div>

         {/* Course Content / Video / Quiz */}
         <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm min-h-[600px] flex flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait">
              {!selectedCourse ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 border-2 border-dashed border-slate-100">
                      <Play size={32} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">Select a course to start your training.</p>
                </motion.div>
              ) : quizMode ? (
                <motion.div 
                  key="quiz"
                  initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                  className="w-full text-left space-y-10"
                >
                   <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 border-l-4 border-blue-600 pl-4">Care Knowledge Check</h3>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {answers.findIndex(a => a === "") + 1} of {selectedCourse.questions.length}</span>
                   </div>
                   
                   <div className="space-y-12 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                      {selectedCourse.questions.map((q: any, idx: number) => (
                        <div key={idx} className="space-y-6">
                           <p className="text-sm font-bold text-slate-700 leading-relaxed uppercase tracking-wide">
                             <span className="text-blue-600 mr-3 font-black">#{idx + 1}</span> {q.q}
                           </p>
                           <div className="grid md:grid-cols-2 gap-4">
                              {q.options.map((opt: string) => (
                                <button 
                                  key={opt}
                                  onClick={() => {
                                    const newAnswers = [...answers];
                                    newAnswers[idx] = opt;
                                    setAnswers(newAnswers);
                                  }}
                                  className={cn(
                                    "p-5 rounded-2xl border text-[10px] font-black uppercase tracking-widest text-left transition-all",
                                    answers[idx] === opt 
                                      ? "bg-blue-600 border-none text-white shadow-lg shadow-blue-500/30" 
                                      : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-white"
                                  )}
                                >
                                  {opt}
                                </button>
                              ))}
                           </div>
                        </div>
                      ))}
                   </div>

                   <div className="pt-10 flex gap-4">
                      <Button onClick={() => setQuizMode(false)} variant="outline" className="h-14 px-10 rounded-full text-xs font-black uppercase tracking-widest border-slate-200 text-slate-400">Cancel</Button>
                      <Button onClick={handleSubmitQuiz} disabled={submitting} className="flex-1 h-14 rounded-full text-xs font-black uppercase tracking-widest bg-slate-950 text-white shadow-2xl">
                        {submitting ? "Processing Submission..." : "Submit for Grading"}
                      </Button>
                   </div>
                </motion.div>
              ) : result ? (
                <motion.div 
                  key="result"
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="space-y-8"
                >
                   <div className={cn(
                     "w-24 h-24 rounded-full flex items-center justify-center mx-auto border-4 shadow-2xl",
                     result.passed ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
                   )}>
                      {result.passed ? <Award size={48} strokeWidth={3} /> : <ShieldAlert size={48} strokeWidth={3} />}
                   </div>
                   <div>
                      <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 mb-2">
                        {result.passed ? "Well Done! You Passed." : "Almost There. Try Again."}
                      </h3>
                      <p className="text-4xl font-black text-[#C5A069] font-mono">{Math.round(result.score)}%</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 max-w-sm mx-auto leading-relaxed">
                        {result.passed 
                          ? "You've successfully completed this course and are ready for care visits." 
                          : "Don't worry! Review the course material and try again to improve your score."}
                      </p>
                   </div>
                   <Button onClick={() => setResult(null)} className="h-14 px-12 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#0B1D45] text-white border-none">Start Next Course</Button>
                </motion.div>
              ) : (
                <motion.div 
                   key="content"
                   initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                   className="w-full text-left space-y-10"
                >
                   {/* Video Player Stub */}
                   <div className="aspect-video bg-slate-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl group border-[6px] border-white shadow-xl">
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                         <div className="w-20 h-20 bg-[#C5A069] rounded-full flex items-center justify-center text-[#0B1D45] shadow-2xl animate-pulse">
                            <Play size={32} fill="currentColor" />
                         </div>
                      </div>
                      <img src={selectedCourse.thumbnail || `https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=800`} className="w-full h-full object-cover opacity-60" alt="Thumbnail" />
                      <div className="absolute bottom-6 left-6 flex items-center gap-2">
                         <span className="px-3 py-1 bg-rose-600 text-white text-[9px] font-black uppercase rounded-lg">Training Video</span>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">{selectedCourse.title}</h3>
                         <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <Clock size={14} /> 12 MINS
                         </div>
                      </div>
                      <div className="prose prose-slate max-w-none text-slate-500 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6">
                         {selectedCourse.content || "Professional Care Standards: This module covers our core caregiver guidelines, daily reporting, and privacy rules."}
                      </div>
                   </div>

                   <div className="flex gap-4 pt-10">
                      <Button className="flex-1 h-16 rounded-full text-xs font-black uppercase tracking-widest bg-blue-600 text-white shadow-xl shadow-blue-500/20 gap-3">
                         <Play size={18} fill="currentColor" /> Watch Video
                      </Button>
                      <Button onClick={handleStartQuiz} className="flex-1 h-16 rounded-full text-xs font-black uppercase tracking-widest bg-[#C5A069] text-[#0B1D45] border-none shadow-xl shadow-[#C5A069]/20 gap-3">
                         <ClipboardCheck size={18} /> Start Quiz
                      </Button>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}

function ClipboardCheck({ size = 20, className = "" }: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <path d="m9 14 2 2 4-4"/>
    </svg>
  );
}
