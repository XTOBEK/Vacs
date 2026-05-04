import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from '../../components/ui/Button';

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'HCA', // Default
    licenseNumber: '',
    certifications: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      alert('Application submitted successfully.');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Application failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto pt-20 p-6">
        <h2 className="text-3xl font-black mb-8">Application Portal (Step {step} of 2)</h2>
        {step === 1 && (
          <div className="space-y-4">
            <input name="fullName" placeholder="Full Name" onChange={handleInputChange} className="w-full border p-4 rounded-xl" />
            <input name="email" type="email" placeholder="Email" onChange={handleInputChange} className="w-full border p-4 rounded-xl" />
            <select name="role" onChange={handleInputChange} className="w-full border p-4 rounded-xl">
              <option value="HCA">HCA</option>
              <option value="SCA">SCA</option>
              <option value="RN">RN</option>
              <option value="SUPPORT">Support Staff</option>
            </select>
            <Button onClick={() => setStep(2)}>Next</Button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            {(formData.role === 'RN' || formData.role === 'SCA') && (
              <>
                <input name="licenseNumber" placeholder="License Number" onChange={handleInputChange} className="w-full border p-4 rounded-xl" />
                <input name="certifications" placeholder="Certification IDs" onChange={handleInputChange} className="w-full border p-4 rounded-xl" />
              </>
            )}
            <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Submitting...' : 'Submit Application'}</Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
