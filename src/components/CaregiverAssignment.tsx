import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "./ui/Button";

interface CaregiverAssignmentProps {
  client: any;
  staffList: any[];
}

export const CaregiverAssignment: React.FC<CaregiverAssignmentProps> = ({ client, staffList }) => {
  const [selectedCaregiver, setSelectedCaregiver] = useState(client.assignedCaregiverId || "");

  const handleUpdate = async () => {
    try {
      const clientRef = doc(db, "users", client.uid);
      await updateDoc(clientRef, {
        assignedCaregiverId: selectedCaregiver
      });
      alert("Caregiver successfully assigned!");
    } catch (error) {
      console.error("Error updating assignment:", error);
      alert("Failed to assign caregiver.");
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-lg">
      <label className="text-xs font-bold uppercase text-slate-500">Assign Caregiver</label>
      <select 
        value={selectedCaregiver} 
        onChange={(e) => setSelectedCaregiver(e.target.value)}
        className="p-2 border border-slate-200 rounded-lg text-sm"
      >
        <option value="">Select Caregiver</option>
        {staffList.filter(s => s.role === 'CAREGIVER').map(staff => (
          <option key={staff.uid} value={staff.uid}>
            {staff.fullName}
          </option>
        ))}
      </select>
      <Button onClick={handleUpdate} size="sm">
        Update Assignment
      </Button>
    </div>
  );
};
