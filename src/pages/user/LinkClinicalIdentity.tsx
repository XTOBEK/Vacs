import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

const LinkClinicalIdentity = () => {
    const [licenseNumber, setLicenseNumber] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No user logged in');
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                clinicalData: {
                    licenseNumber,
                    specialization,
                    linkedAt: new Date().toISOString()
                }
            });
            alert('Clinical identity linked successfully!');
            navigate('/dashboard'); // Assuming a dashboard route exists
        } catch (error) {
            console.error('Error linking clinical identity:', error);
            alert('Failed to link clinical identity.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Link Clinical Identity</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block">License Number</label>
                    <input 
                        type="text" 
                        value={licenseNumber} 
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block">Specialization</label>
                    <input 
                        type="text" 
                        value={specialization} 
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={loading}>
                    {loading ? 'Saving...' : 'Link Identity'}
                </button>
            </form>
        </div>
    );
};

export default LinkClinicalIdentity;
