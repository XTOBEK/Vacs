import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from '../ui/Button';

export const TemplateEditor = () => {
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      const docRef = doc(db, 'templates', 'caregiver_assignment');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTemplate(docSnap.data());
      }
      setLoading(false);
    };
    fetchTemplate();
  }, []);

  const handleSave = async () => {
    if (!template) return;
    try {
      await updateDoc(doc(db, 'templates', 'caregiver_assignment'), { ...template, lastUpdated: new Date().toISOString() });
      alert("Template saved!");
    } catch (error) {
      console.error(error);
      alert("Failed to save.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!template) return <div>Template not found.</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Email Template Editor</h3>
      <input
        className="w-full p-2 border"
        value={template.subject}
        onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
        placeholder="Subject"
      />
      <textarea
        className="w-full p-2 border"
        value={template.body}
        onChange={(e) => setTemplate({ ...template, body: e.target.value })}
        rows={5}
        placeholder="Body"
      />
      <Button onClick={handleSave}>Save Template</Button>
    </div>
  );
};
