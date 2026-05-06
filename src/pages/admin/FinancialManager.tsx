import React, { useState, useEffect } from "react";
import { db, handleFirestoreError, OperationType } from "../../lib/firebase";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import { Button } from "../../components/ui/Button";
import { CreditCard, DollarSign, ArrowUpRight, ArrowDownLeft, FileText, CheckCircle2, XCircle, Timer, ShieldCheck, Zap } from "lucide-react";
import { cn } from "../../lib/utils";

export default function FinancialManager() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'INVOICES' | 'PAYOUTS'>('INVOICES');

  useEffect(() => {
    const unsubInvoices = onSnapshot(collection(db, "invoices"), (snapshot) => {
      setInvoices(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubPayouts = onSnapshot(collection(db, "payouts"), (snapshot) => {
      setPayouts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => {
      unsubInvoices();
      unsubPayouts();
    };
  }, []);

  const initiatePaymentGateway = (invoice: any) => {
    // Stub for Paystack/Flutterwave
    console.log("Initializing Secure Gateway for:", invoice.id);
    alert(`Rerouting to Secure Payment Node (Paystack/Flutterwave). Reference: ${invoice.id.slice(0, 8).toUpperCase()}`);
    // In a real app, you'd use the Paystack-inline or similar JS SDK here.
  };

  const totalInvoiced = invoices.reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalPaid = invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + (i.amount || 0), 0);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="grid md:grid-cols-3 gap-8">
         <div className="bg-[#0B1D45] p-10 rounded-[3rem] text-white overflow-hidden relative shadow-2xl">
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 italic">Total Payments Received</p>
               <h3 className="text-4xl font-black italic tracking-tighter">₦{totalInvoiced.toLocaleString()}</h3>
            </div>
            <Zap className="absolute -bottom-10 -right-10 text-white/5 w-40 h-40" />
         </div>
         <div className="bg-emerald-600 p-10 rounded-[3rem] text-white relative shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-2 italic">Successful Payments</p>
            <h3 className="text-4xl font-black italic tracking-tighter">₦{totalPaid.toLocaleString()}</h3>
            <CheckCircle2 className="absolute -bottom-6 -right-6 text-white/10 w-32 h-32" />
         </div>
         <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm relative">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 italic">Pending Payments</p>
            <h3 className="text-4xl font-black italic tracking-tighter text-slate-900">₦{(totalInvoiced - totalPaid).toLocaleString()}</h3>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm">
         <div className="flex border-b border-slate-50 p-4 gap-4">
            <button 
              onClick={() => setActiveTab('INVOICES')}
              className={cn(
                "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === 'INVOICES' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:bg-slate-50"
              )}
            >
              Client Invoicing
            </button>
            <button 
              onClick={() => setActiveTab('PAYOUTS')}
              className={cn(
                "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === 'PAYOUTS' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:bg-slate-50"
              )}
            >
              Staff Payouts
            </button>
         </div>

         <div className="p-10">
            {activeTab === 'INVOICES' ? (
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-slate-50">
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Reference</th>
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Client Node</th>
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Amount</th>
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Status</th>
                          <th className="pb-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {loading ? (
                         <tr><td colSpan={5} className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-slate-300">Synchronizing Ledger...</td></tr>
                       ) : invoices.length === 0 ? (
                         <tr><td colSpan={5} className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-slate-200">No transactions recorded.</td></tr>
                       ) : (
                         invoices.map(inv => (
                           <tr key={inv.id} className="group hover:bg-slate-50 transition-colors">
                              <td className="py-8 font-mono text-[10px] font-bold text-slate-400 uppercase">#{inv.id.slice(0, 8)}</td>
                              <td className="py-8 text-xs font-black uppercase italic text-slate-900">ID: {inv.clientId?.slice(0, 8)}...</td>
                              <td className="py-8 text-xs font-black text-[#C5A069]">₦{inv.amount?.toLocaleString()}</td>
                              <td className="py-8">
                                 <span className={cn(
                                   "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                   inv.status === 'PAID' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                                   inv.status === 'FAILED' ? "bg-rose-50 border-rose-100 text-rose-600" :
                                   "bg-amber-50 border-amber-100 text-amber-600"
                                 )}>
                                   {inv.status}
                                 </span>
                              </td>
                              <td className="py-8 text-right">
                                 <Button onClick={() => initiatePaymentGateway(inv)} variant="ghost" size="sm" className="h-10 rounded-xl hover:bg-white text-[9px] font-black uppercase tracking-widest text-blue-600 border border-transparent hover:border-blue-100 shadow-sm">
                                    Process Settlement
                                 </Button>
                              </td>
                           </tr>
                         ))
                       )}
                    </tbody>
                 </table>
              </div>
            ) : (
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-slate-50">
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Reference</th>
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Staff Agent</th>
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Amount</th>
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Status</th>
                          <th className="pb-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Validation</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {payouts.length === 0 ? (
                         <tr><td colSpan={5} className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-slate-200">No payout records in queue.</td></tr>
                       ) : (
                         payouts.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                               <td className="py-8 font-mono text-[10px] font-bold text-slate-400 uppercase">#{p.id.slice(0, 8)}</td>
                               <td className="py-8 text-xs font-black uppercase italic text-slate-900">ID: {p.caregiverId?.slice(0, 8)}...</td>
                               <td className="py-8 text-xs font-black text-slate-600">₦{p.amount?.toLocaleString()}</td>
                               <td className="py-8">
                                  <span className={cn(
                                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                    p.status === 'COMPLETED' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-blue-50 border-blue-100 text-blue-600"
                                  )}>
                                     {p.status}
                                  </span>
                               </td>
                               <td className="py-8 text-right">
                                  <ShieldCheck size={18} className={p.status === 'COMPLETED' ? "text-emerald-500 ml-auto" : "text-slate-300 ml-auto"} />
                               </td>
                            </tr>
                         ))
                       )}
                    </tbody>
                 </table>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
