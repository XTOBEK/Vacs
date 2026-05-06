/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db, handleFirestoreError, OperationType } from "./lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/public/LoginPage";
import RegistrationPage from "./pages/public/RegistrationPage";
import AboutPage from "./pages/public/AboutPage";
import ServicesPage from "./pages/public/ServicesPage";
import PricingPage from "./pages/public/PricingPage";
import ContactPage from "./pages/public/ContactPage";
import FAQPage from "./pages/public/FAQPage";
import CareersPage from "./pages/public/Careers";
import ApplicationForm from "./pages/public/ApplicationForm";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLoginPage from "./pages/public/AdminLoginPage";
import NotFound from "./pages/public/NotFound";
import RNDashboard from "./pages/rn/RNDashboard";
import CaregiverDashboard from "./pages/caregiver/CaregiverDashboard";
import ClientDashboard from "./pages/client/ClientDashboard";
import AiNavWidget from "./components/AiNavWidget";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile from Firestore
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            // Permanent fix: auto-promote to ADMIN if the email matches
            if (firebaseUser.email === 'princewill.iwuoha@gmail.com' && data.role !== 'ADMIN') {
              const { updateDoc } = await import("firebase/firestore");
              await updateDoc(userRef, { role: 'ADMIN' });
              setUser({ ...firebaseUser, ...data, role: 'ADMIN' });
            } else {
              setUser({ ...firebaseUser, ...data });
            }
          } else if (firebaseUser.email === 'princewill.iwuoha@gmail.com') {
            // First time login for admin - create basic profile or mock it
            setUser({ ...firebaseUser, role: 'ADMIN' });
          } else {
            // User exists in Auth but not in Firestore - might be registering
            setUser({ ...firebaseUser, needsProfile: true });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, "users/" + firebaseUser.uid);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Connecting to VACS Node...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/plans" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/staff-login" element={<LoginPage allowedRole="RN" />} />
        <Route path="/client-login" element={<LoginPage allowedRole="CLIENT" />} />
        <Route path="/register/:role" element={<RegistrationPage />} />
        
        <Route 
          path="/vacs-control-gate/*" 
          element={user?.role === 'ADMIN' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/vacs-control-gate/login" />} 
        />
        <Route 
          path="/rn/*" 
          element={user?.role === 'RN' ? <RNDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/dashboard/*" 
          element={user?.role === 'CAREGIVER' ? <CaregiverDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/client/*" 
          element={user?.role === 'CLIENT' ? <ClientDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        
        {/* Admin Secret Gate */}
        <Route path="/vacs-control-gate/login" element={<AdminLoginPage />} />
        
        {/* Fallback for profile creation */}
        {user?.needsProfile ? (
           <Route path="*" element={<Navigate to={`/register/${user.role || 'CAREGIVER'}`} />} />
        ) : (
           /* 404 - Page Not Found */
           <Route path="*" element={<NotFound />} />
        )}
      </Routes>
      <AiNavWidget />
    </BrowserRouter>
  );
}

