import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Link } from 'react-router-dom';

export default function CareersPage() {
  return (
    <MainLayout>
      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl font-black tracking-tighter mb-8">Clinical Careers at VACS</h1>
        <div className="grid gap-6">
            <div className="border p-8 rounded-2xl">
                <h2 className="text-xl font-bold">Registered Nurse (RN)</h2>
                <p className="mt-2 text-slate-600">Provide clinical oversight for our field teams.</p>
                <Link to="/apply" className="text-blue-600 block mt-4 font-bold">Apply Now →</Link>
            </div>
            <div className="border p-8 rounded-2xl">
                <h2 className="text-xl font-bold">Specialized Care Assistant (SCA)</h2>
                <p className="mt-2 text-slate-600">Provide high-tier care for cognitive cases.</p>
                <Link to="/apply" className="text-blue-600 block mt-4 font-bold">Apply Now →</Link>
            </div>
        </div>
      </div>
    </MainLayout>
  );
}
