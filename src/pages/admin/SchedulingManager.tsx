import React, { useState, useEffect } from "react";
import { db, handleFirestoreError, OperationType } from "../../lib/firebase";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from "firebase/firestore";
import { Button } from "../../components/ui/Button";
import { Calendar, Clock, User, ShieldAlert, CheckCircle2, ChevronRight, Plus } from "lucide-react";
import { cn } from "../../lib/utils";

export default function SchedulingManager() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [caregivers, setCaregivers] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  
  // Form State
  const [selectedCaregiver, setSelectedCaregiver] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [shiftDate, setShiftDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    const unsubShifts = onSnapshot(collection(db, "shifts"), (snapshot) => {
      setShifts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setCaregivers(data.filter((u: any) => u.role === "CAREGIVER" || u.role === "RN"));
      setClients(data.filter((u: any) => u.role === "CLIENT"));
    });

    return () => {
      unsubShifts();
      unsubUsers();
    };
  }, []);

  const handleCreateShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaregiver || !selectedClient || !shiftDate || !startTime || !endTime) {
      alert("Please fill all fields to schedule the visit correctly.");
      return;
    }

    setIsAssigning(true);
    try {
      const startDT = new Date(`${shiftDate}T${startTime}`);
      const endDT = new Date(`${shiftDate}T${endTime}`);

      if (endDT <= startDT) {
        throw new Error("Invalid Times: The end time must be after the start time.");
      }

      // 1. Conflict Check (Double-booking prevention)
      const caregiverShifts = shifts.filter(s => s.caregiverId === selectedCaregiver);
      const hasConflict = caregiverShifts.some(s => {
        const sStart = new Date(s.startTime);
        const sEnd = new Date(s.endTime);
        return (startDT >= sStart && startDT < sEnd) || (endDT > sStart && endDT <= sEnd);
      });

      if (hasConflict) {
        throw new Error("Double-Booking: This caregiver already has another visit scheduled for this time.");
      }

      // 2. Create Shift Entry
      const shiftData = {
        caregiverId: selectedCaregiver,
        clientId: selectedClient,
        startTime: startDT.toISOString(),
        endTime: endDT.toISOString(),
        status: "SCHEDULED",
        createdAt: new Date().toISOString(),
        assignedBy: "ADMIN_SYSTEM"
      };

      const docRef = await addDoc(collection(db, "shifts"), shiftData);

      // 3. Trigger Notification
      await addDoc(collection(db, "notifications"), {
        userId: selectedCaregiver,
        type: "SHIFT_ASSIGNED",
        message: `New Care Visit: Scheduled for ${shiftDate} at ${startTime}.`,
        createdAt: new Date().toISOString(),
        read: false
      });

      await addDoc(collection(db, "notifications"), {
        userId: selectedClient,
        type: "SHIFT_SCHEDULED",
        message: `A caregiver has been scheduled for your care visit on ${shiftDate}.`,
        createdAt: new Date().toISOString(),
        read: false
      });

      alert("Schedule successfully created and caregivers notified.");
      
      // Reset
      setSelectedCaregiver("");
      setSelectedClient("");
      setShiftDate("");
      setStartTime("");
      setEndTime("");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[#0B1D45] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5">
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#C5A069] rounded-2xl flex items-center justify-center text-[#0B1D45] shadow-lg shadow-[#C5A069]/20">
                    <Calendar size={24} />
                </div>
                <div>
                   <h3 className="text-2xl font-black tracking-tighter uppercase italic">Scheduling & Care Management</h3>
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Caregiver Schedule Registry</p>
                </div>
            </div>
            <p className="text-slate-400 text-sm max-w-xl font-medium leading-relaxed italic">
               Plan and manage caregiver schedules here. The system prevents double-booking and ensures care standards are met for every family.
            </p>
         </div>
         <Calendar size={200} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
         {/* Assignment Form */}
         <div className="lg:col-span-1 bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Schedule a New Visit</h4>
            <form onSubmit={handleCreateShift} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Caregiver</label>
                  <select 
                    value={selectedCaregiver} 
                    onChange={(e) => setSelectedCaregiver(e.target.value)}
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#C5A069] outline-none transition-all"
                  >
                     <option value="">Select Caregiver...</option>
                     {caregivers.map(c => (
                       <option key={c.id} value={c.id}>{c.fullName || c.full_name} ({c.role})</option>
                     ))}
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Client / Loved One</label>
                  <select 
                    value={selectedClient} 
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#C5A069] outline-none transition-all"
                  >
                     <option value="">Select Client...</option>
                     {clients.map(c => (
                       <option key={c.id} value={c.id}>{c.fullName || c.full_name}</option>
                     ))}
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Visit Date</label>
                  <input 
                    type="date" 
                    value={shiftDate}
                    onChange={(e) => setShiftDate(e.target.value)}
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#C5A069] outline-none transition-all"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Start Time</label>
                     <input 
                        type="time" 
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#C5A069] outline-none transition-all"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">End Time</label>
                     <input 
                        type="time" 
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#C5A069] outline-none transition-all"
                     />
                  </div>
               </div>

               <Button 
                type="submit" 
                disabled={isAssigning}
                className="w-full h-16 rounded-full bg-[#0B1D45] text-white border-none text-[10px] font-black uppercase tracking-widest gap-3 shadow-xl hover:bg-[#1a2e5a] transition-all"
               >
                  {isAssigning ? "Scheduling visit..." : "Confirm Schedule"}
               </Button>
            </form>
         </div>

         {/* Active Shift Ledger */}
         <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Current Schedule Feed</h4>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Live Feed</span>
               </div>
            </div>

            <div className="space-y-4">
               {loading ? (
                 <div className="py-20 text-center animate-pulse text-[10px] font-black uppercase tracking-widest text-slate-300">Updating schedule...</div>
               ) : shifts.length === 0 ? (
                 <div className="py-20 text-center border-2 border-dashed border-slate-50 rounded-[2rem]">
                    <Clock size={48} className="mx-auto text-slate-100 mb-4" />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No visits scheduled yet.</p>
                 </div>
               ) : (
                 shifts.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()).map(shift => (
                   <div key={shift.id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-white hover:border-[#C5A069]/30 transition-all">
                      <div className="flex items-center gap-6 w-full md:w-auto">
                         <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#0B1D45] shadow-sm border border-slate-100 group-hover:bg-[#0B1D45] group-hover:text-white transition-colors">
                            <Clock size={20} />
                         </div>
                         <div className="min-w-0">
                            <p className="text-sm font-black text-slate-900 tracking-tight uppercase italic truncate">
                               {caregivers.find(c => c.id === shift.caregiverId)?.fullName || "Unknown caregiver"} → {clients.find(c => c.id === shift.clientId)?.fullName || "Unknown client"}
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                               {new Date(shift.startTime).toLocaleDateString()} • {new Date(shift.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(shift.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                         </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                         <span className={cn(
                           "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                           shift.status === 'SCHEDULED' ? "bg-blue-50 border-blue-100 text-blue-600" :
                           shift.status === 'ONGOING' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                           "bg-slate-100 border-slate-200 text-slate-500"
                         )}>
                            {shift.status}
                         </span>
                         <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100">
                           <ShieldAlert size={14} className="text-slate-400" />
                         </Button>
                      </div>
                   </div>
                 ))
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
