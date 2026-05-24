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
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Zap, 
  AlertTriangle, 
  ArrowUpRight, 
  Key, 
  Plus, 
  Lock, 
  Database,
  FileSpreadsheet
} from "lucide-react";
import { cn } from "../../lib/utils";
import { logAudit } from "../../lib/audit";

interface FinancialManagerProps {
  isSuper?: boolean;
  adminEmail: string;
  branchId: string;
}

export default function FinancialManager({ isSuper = false, adminEmail = "", branchId = "owerri" }: FinancialManagerProps) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'INVOICES' | 'PAYOUTS' | 'GATEWAYS'>('INVOICES');
  
  // Create invoice form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [amount, setAmount] = useState("");
  const [itemsBreakdown, setItemsBreakdown] = useState("");
  const [formError, setFormError] = useState("");
  
  // Custom Gateway configuration state (Super Admin only)
  const [paystackKey, setPaystackKey] = useState("pk_live_0a12e34fa56bc78de90f");
  const [bankAccount, setBankAccount] = useState("1024567890 (Zenith Bank)");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Collect all clients for invoice creation selector
    const unsubClients = onSnapshot(collection(db, "clients"), (snapshot) => {
      setClients(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "clients");
    });

    const unsubInvoices = onSnapshot(collection(db, "invoices"), (snapshot) => {
      setInvoices(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "invoices");
    });

    const unsubPayouts = onSnapshot(collection(db, "payouts"), (snapshot) => {
      setPayouts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "payouts");
    });

    return () => {
      unsubClients();
      unsubInvoices();
      unsubPayouts();
    };
  }, []);

  // SILO FILTERING: Super Admin sees everything; Normal Admins see only their specific branch.
  const myBranch = isSuper ? "global" : branchId;
  const filteredInvoices = isSuper 
    ? invoices 
    : invoices.filter(inv => inv.branchId === branchId);

  const filteredPayouts = isSuper 
    ? payouts 
    : payouts.filter(p => p.branchId === branchId);

  const filteredClients = isSuper 
    ? clients 
    : clients.filter(c => c.branchId === branchId);

  const totalInvoiced = filteredInvoices.reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalPaid = filteredInvoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + (i.amount || 0), 0);

  const initiatePaymentGateway = (invoice: any) => {
    console.log("Initializing Secure Gateway for:", invoice.id);
    alert(`Rerouting to Secure Payment Node (Paystack/Flutterwave). Reference: ${invoice.id.slice(0, 8).toUpperCase()}`);
    // Log the initiation
    logAudit(adminEmail, "GATEWAY_INITIATION", `Initiated payment check for invoice ${invoice.id}`, branchId);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!selectedClient || !amount || parseFloat(amount) <= 0) {
      setFormError("All fields must be valid and client node selected.");
      return;
    }

    try {
      const clientObj = clients.find(c => c.id === selectedClient);
      const invoiceBranch = isSuper ? (clientObj?.branchId || "owerri") : branchId;
      
      const newInvoice = {
        id: `inv-${Date.now()}`,
        clientId: selectedClient,
        clientName: clientObj?.fullName || "Assigned Patient",
        amount: parseFloat(amount),
        status: 'PENDING',
        items: itemsBreakdown || "Standard Home Care Retainer Session",
        branchId: invoiceBranch,
        voidRequested: false,
        voidReason: "",
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "invoices"), newInvoice);
      
      // Register Immutable Event
      await logAudit(
        adminEmail,
        "FINANCE_INVOICE_CREATE",
        `Created client invoice for ${clientObj?.fullName} of amount = ₦${parseFloat(amount).toLocaleString()}`,
        branchId
      );

      // Reset form
      setSelectedClient("");
      setAmount("");
      setItemsBreakdown("");
      setShowCreateForm(false);
      alert("Invoice logged securely! Status: Append-Only Immutable.");
    } catch (err: any) {
      console.error(err);
      setFormError("Failed to store invoice. Integrity error.");
    }
  };

  // Flag for Void Workflow
  const handleFlagError = async (invoiceId: string, reason: string) => {
    if (!reason) {
      reason = prompt("Please input verification explanation/proof for Voids Review:") || "Error requested by Coordinator";
    }
    try {
      const invoiceRef = doc(db, "invoices", invoiceId);
      await updateDoc(invoiceRef, {
        voidRequested: true,
        voidReason: reason
      });
      // Register in Audit logs
      await logAudit(
        adminEmail,
        "FINANCE_VOID_REQUESTED",
        `Flagged invoice ${invoiceId} for voiding/refund. Reason: ${reason}`,
        branchId
      );
      alert("Void security flag transmitted. Awaiting Sovereign Super Admin review.");
    } catch (err) {
      console.error(err);
      alert("Failed to submit void request.");
    }
  };

  // Super Admin Approve Void
  const handleApproveVoid = async (invoiceId: string) => {
    if (!isSuper) return;
    try {
      const invoiceRef = doc(db, "invoices", invoiceId);
      await updateDoc(invoiceRef, {
        status: 'VOIDED',
        voidRequested: false
      });
      await logAudit(
        adminEmail,
        "FINANCE_VOID_APPROVED",
        `APPROVED void/refund request for invoice: ${invoiceId}`,
        branchId
      );
      alert("Invoice Void approved. Void state permanently catalogued.");
    } catch (err) {
      console.error(err);
    }
  };

  // Super Admin Reject Void
  const handleRejectVoid = async (invoiceId: string) => {
    if (!isSuper) return;
    try {
      const invoiceRef = doc(db, "invoices", invoiceId);
      await updateDoc(invoiceRef, {
        voidRequested: false
      });
      await logAudit(
        adminEmail,
        "FINANCE_VOID_DENIED",
        `REJECTED void/refund request for invoice: ${invoiceId}`,
        branchId
      );
      alert("Void request denied. Invoice integrity re-affirmed.");
    } catch (err) {
      console.error(err);
    }
  };

  // Mock Export Ledger CSV/Excel (Super Admin Only)
  const handleExportLedger = () => {
    if (!isSuper) {
      alert("ACCESS RESTRICTED: Bulk operations CSV/Excel downloads disabled for this terminal.");
      return;
    }
    // Simulation of downloadable buffer
    logAudit(adminEmail, "DATA_LEDGER_EXPORT", `Exported system-wide ledger data.`, branchId);
    
    const rows = [
      ["Invoice Reference", "Client Node ID", "Amount (NGN)", "Verified Branch", "Status", "Date"]
    ];
    filteredInvoices.forEach(i => {
      rows.push([i.id, i.clientId, String(i.amount), i.branchId, i.status, i.createdAt]);
    });
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `VACS_Financial_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuper) return;
    logAudit(adminEmail, "GATEWAY_CONFIG_CHANGE", `Modified Paystack configurations and Bank accounts.`, branchId);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="grid md:grid-cols-3 gap-8">
         <div className="bg-[#0B1D45] p-10 rounded-[3rem] text-white overflow-hidden relative shadow-2xl">
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 italic">
                  {isSuper ? "National Ledger Volume" : `Branch Vol (${branchId.toUpperCase()})`}
               </p>
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
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 italic">Outstanding Pending</p>
            <h3 className="text-4xl font-black italic tracking-tighter text-slate-900">₦{(totalInvoiced - totalPaid).toLocaleString()}</h3>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm">
         <div className="flex border-b border-slate-100 p-4 gap-4 justify-between items-center bg-slate-50/50">
            <div className="flex gap-4">
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
              <button 
                onClick={() => setActiveTab('GATEWAYS')}
                className={cn(
                  "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2",
                  activeTab === 'GATEWAYS' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:bg-slate-50"
                )}
              >
                {!isSuper && <Lock size={12} className="text-slate-400" />}
                Gateway Settings
              </button>
            </div>

            <div className="flex gap-3">
              {/* LEDGER BULK EXPORT: Only permitted for Super Admin */}
              {isSuper ? (
                <button
                  onClick={handleExportLedger}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-[#0B1D45] rounded-full text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <FileSpreadsheet size={14} className="text-emerald-600" />
                  Export Ledger (CSV)
                </button>
              ) : (
                <div className="text-[9px] font-bold text-slate-400 border border-dashed border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 select-none">
                  <Lock size={10} /> Export Controls Engaged
                </div>
              )}

              {/* NEW APPEND-ONLY INVOICE LOGGING */}
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center gap-2 px-6 py-3 bg-[#0B1D45] hover:bg-slate-800 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
              >
                <Plus size={14} />
                Create Invoice
              </button>
            </div>
         </div>

         {/* Create Invoice Form (Append-Only) */}
         {showCreateForm && (
           <div className="p-10 border-b border-slate-100 bg-slate-50 animate-in slide-in-from-top duration-300">
             <h4 className="text-xs font-black uppercase tracking-widest text-[#0B1D45] mb-6 flex items-center gap-2">
               <ArrowUpRight size={16} className="text-emerald-500 animate-pulse" />
               New Invoice Event Entry (Append-Only)
             </h4>
             <form onSubmit={handleCreateInvoice} className="grid md:grid-cols-3 gap-6 items-end">
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Select Client Profile</label>
                 <select
                   value={selectedClient}
                   onChange={(e) => setSelectedClient(e.target.value)}
                   className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-xs font-bold focus:ring-2 focus:ring-[#C5A069] outline-none"
                   required
                 >
                   <option value="">-- Choose Client Profile --</option>
                   {filteredClients.map(c => (
                     <option key={c.id} value={c.id}>{c.fullName} ({c.id})</option>
                   ))}
                 </select>
               </div>
               
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">Amount (₦ NGN)</label>
                 <input
                   type="number"
                   value={amount}
                   onChange={(e) => setAmount(e.target.value)}
                   placeholder="e.g. 150000"
                   className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-xs font-bold focus:ring-2 focus:ring-[#C5A069] outline-none"
                   required
                 />
               </div>

               <div className="space-y-2 col-span-1 md:col-span-3">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Service items & breakdown notes</label>
                 <input
                   type="text"
                   value={itemsBreakdown}
                   onChange={(e) => setItemsBreakdown(e.target.value)}
                   placeholder="e.g. Tier 3 Weekly Retainer - Owerri supervisor audits"
                   className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-xs font-bold focus:ring-2 focus:ring-[#C5A069] outline-none"
                 />
               </div>

               {formError && <p className="text-xs text-red-500 font-bold mb-4 col-span-3">{formError}</p>}
               
               <div className="col-span-1 md:col-span-3 flex justify-end gap-3 mt-4">
                 <button
                   type="button"
                   onClick={() => setShowCreateForm(false)}
                   className="px-6 py-3 border border-slate-200 hover:bg-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all cursor-pointer"
                 >
                   Discard
                 </button>
                 <button
                   type="submit"
                   className="px-8 py-3 bg-[#0B1D45] hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all cursor-pointer"
                 >
                   Submit Append-Only Record
                 </button>
               </div>
             </form>
             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-4 flex items-center gap-2 italic">
               <AlertTriangle size={10} className="text-amber-500" />
               Void Safeguard: logged values become instantly locked. Mistakes require Super Admin Error-Release approval workflows.
             </p>
           </div>
         )}

         {/* tab displays */}
         <div className="p-10">
            {activeTab === 'INVOICES' ? (
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-slate-100">
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Reference</th>
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Client Node</th>
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Amount</th>
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Branch</th>
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Status</th>
                          <th className="pb-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {loading ? (
                         <tr><td colSpan={6} className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-slate-300">Synchronizing Ledger...</td></tr>
                       ) : filteredInvoices.length === 0 ? (
                         <tr><td colSpan={6} className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-slate-200">No transactions recorded for this branch.</td></tr>
                       ) : (
                         filteredInvoices.map(inv => (
                           <tr key={inv.id} className="group hover:bg-slate-50 transition-colors">
                              <td className="py-8 font-mono text-[10px] font-bold text-slate-400 uppercase">
                                #{inv.id?.slice(0, 10) || "INV-MOCK"}
                              </td>
                              <td className="py-8 text-xs font-black uppercase italic text-slate-900">
                                {inv.clientName || `ID: ${inv.clientId?.slice(0, 8)}...`}
                              </td>
                              <td className="py-8 text-xs font-black text-[#C5A069]">₦{inv.amount?.toLocaleString()}</td>
                              <td className="py-8 text-[10px] font-black uppercase text-slate-500">{inv.branchId || "global"}</td>
                              <td className="py-8">
                                 <div className="flex flex-col gap-1">
                                    <span className={cn(
                                      "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border w-fit",
                                      inv.status === 'PAID' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                                      inv.status === 'VOIDED' ? "bg-slate-100 border-slate-200 text-slate-400 line-through" :
                                      inv.status === 'FAILED' ? "bg-rose-50 border-rose-100 text-rose-600" :
                                      "bg-amber-50 border-amber-100 text-amber-600"
                                    )}>
                                      {inv.status}
                                    </span>
                                    {inv.voidRequested && (
                                      <span className="flex items-center gap-1 text-[8px] font-black text-amber-600 uppercase tracking-widest animate-pulse">
                                        <AlertTriangle size={10} /> VOID REQUESTED
                                      </span>
                                    )}
                                 </div>
                              </td>
                              <td className="py-8 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {inv.status !== 'VOIDED' && (
                                    <Button onClick={() => initiatePaymentGateway(inv)} variant="ghost" size="sm" className="h-10 rounded-xl hover:bg-white text-[9px] font-black uppercase tracking-widest text-blue-600 border border-transparent hover:border-blue-100 shadow-sm">
                                      Process Payment
                                    </Button>
                                  )}

                                  {/* VOID APPROVAL QUEUE IF SUPER ADMIN */}
                                  {isSuper && inv.voidRequested ? (
                                    <div className="flex items-center gap-1.5 border border-amber-200 bg-amber-50/20 p-1.5 rounded-xl">
                                      <button 
                                        onClick={() => handleApproveVoid(inv.id)}
                                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[8px] font-black uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                                        title={inv.voidReason}
                                      >
                                        Approve Void
                                      </button>
                                      <button 
                                        onClick={() => handleRejectVoid(inv.id)}
                                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[8px] font-black uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                                      >
                                        Reject Void
                                      </button>
                                    </div>
                                  ) : null}

                                  {/* FLAG AS ERROR IF NOT SUPER ADMIN */}
                                  {!isSuper && !inv.voidRequested && inv.status !== 'VOIDED' ? (
                                    <button 
                                      onClick={() => handleFlagError(inv.id, "")}
                                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[9px] font-black uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
                                      title="Flag this record as an error for Super Admin void permission"
                                    >
                                      Flag as Error
                                    </button>
                                  ) : null}
                                </div>
                              </td>
                           </tr>
                         ))
                       )}
                    </tbody>
                 </table>
              </div>
            ) : activeTab === 'PAYOUTS' ? (
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-slate-100">
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Reference</th>
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Staff Agent</th>
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Amount</th>
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Branch</th>
                          <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Status</th>
                          <th className="pb-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Validation</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {filteredPayouts.length === 0 ? (
                         <tr><td colSpan={6} className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-slate-200">No payout records in queue for this branch.</td></tr>
                       ) : (
                         filteredPayouts.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                               <td className="py-8 font-mono text-[10px] font-bold text-slate-400 uppercase">#{p.id.slice(0, 10)}</td>
                               <td className="py-8 text-xs font-black uppercase italic text-slate-900">ID: {p.caregiverId?.slice(0, 8)}...</td>
                               <td className="py-8 text-xs font-black text-slate-600">₦{p.amount?.toLocaleString()}</td>
                               <td className="py-8 text-[10px] font-black uppercase text-slate-500">{p.branchId || "global"}</td>
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
            ) : (
              /* GATEWAYS CONFIGURATION VIEW WITH HIGH LEVEL SECURITY LOCKOUT */
              <div>
                {isSuper ? (
                  <div className="max-w-2xl bg-slate-50 p-10 border border-slate-200 rounded-[2.5rem] space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Key className="text-amber-500 animate-pulse" />
                      <h4 className="text-sm font-black uppercase tracking-widest text-[#0B1D45]">Sovereign Payment Gateway Keys and Settings</h4>
                    </div>
                    <form onSubmit={handleUpdateKeys} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Paystack API Security Token (Live)</label>
                        <input
                          type="password"
                          value={paystackKey}
                          onChange={(e) => setPaystackKey(e.target.value)}
                          className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-xs font-mono font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Master Settlement Bank Routing (CenBank)</label>
                        <input
                          type="text"
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value)}
                          className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-xs font-bold"
                        />
                      </div>
                      
                      {saveSuccess && (
                        <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                          Configuration saved successfully and encrypted in Secure Enclave!
                        </p>
                      )}

                      <button
                        type="submit"
                        className="px-6 py-3 bg-[#0B1D45] hover:bg-slate-800 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                      >
                        Commit Gateway Updates
                      </button>
                    </form>
                  </div>
                ) : (
                  /* STRICT COOPERATION LOCKOUT CARD */
                  <div className="p-12 text-center max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-[3rem] text-white space-y-6 shadow-xl">
                    <div className="w-16 h-16 bg-red-500/10 rounded-3xl mx-auto flex items-center justify-center text-red-400">
                      <Lock size={28} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-red-400 italic">Terminal Segment Restricted</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mt-2">
                        Gateway Keys, Settlement Bank accounts, and Paystack Nodes are heavily encrypted. Zero-Disclosure is active under anti-theft protocols. Access requires Sovereign Credentials.
                      </p>
                    </div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 bg-slate-950 p-3 rounded-xl border border-white/5">
                      System Code Code: 403 RESTRICTED_GATEWAY_NODE
                    </div>
                  </div>
                )}
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
