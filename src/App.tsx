/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/public/LoginPage";
import RegistrationPage from "./pages/public/RegistrationPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RNDashboard from "./pages/rn/RNDashboard";
import CaregiverDashboard from "./pages/caregiver/CaregiverDashboard";
import ClientDashboard from "./pages/client/ClientDashboard";

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("vacs_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem("vacs_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("vacs_user");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register/:role" element={<RegistrationPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/admin/*" 
          element={user?.role === 'ADMIN' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
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
        <Route path="/vacs-control-gate" element={<LoginPage onLogin={handleLogin} adminOnly />} />
      </Routes>
    </BrowserRouter>
  );
}

