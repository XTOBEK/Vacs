import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Button } from '../../components/ui/Button';

export const ApplicantManager = ({ user }: any) => {
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'applications'), (snap) => {
      setApps(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    await updateDoc(doc(db, 'applications', id), { status });
    if(status === 'APPROVED') {
       // Logic to promote application to User account logic would go here
       alert('Applicant approved and activated.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Pending Applications</h2>
      {apps.filter(a => a.status === 'PENDING').map(app => (
        <div key={app.id} className="border p-4 rounded-xl flex justify-between items-center">
            <div>{app.fullName} ({app.role})</div>
            <div className="space-x-2">
                <Button onClick={() => handleAction(app.id, 'APPROVED')}>Approve</Button>
                <Button onClick={() => handleAction(app.id, 'REJECTED')}>Reject</Button>
            </div>
        </div>
      ))}
    </div>
  );
};
