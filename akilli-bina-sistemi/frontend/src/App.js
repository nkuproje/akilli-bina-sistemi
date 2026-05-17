import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AidatPage from './pages/AidatPage';
import BakimPage from './pages/BakimPage';
import DuyuruPage from './pages/DuyuruPage';
import EnerjiPage from './pages/EnerjiPage';
import GiderPage from './pages/GiderPage';
import OylamaPage from './pages/OylamaPage';
import ProfilPage from './pages/ProfilPage';

const KorunanRoute = ({ children }) => {
  const { kullanici } = useAuth();
  return kullanici ? children : <Navigate to="/login" replace />;
};

const HerkesAcik = ({ children }) => {
  const { kullanici } = useAuth();
  return kullanici ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/login" element={<HerkesAcik><LoginPage /></HerkesAcik>} />
          <Route path="/register" element={<HerkesAcik><RegisterPage /></HerkesAcik>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route element={<KorunanRoute><Layout /></KorunanRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/aidatlar" element={<AidatPage />} />
            <Route path="/bakim" element={<BakimPage />} />
            <Route path="/duyurular" element={<DuyuruPage />} />
            <Route path="/enerji" element={<EnerjiPage />} />
            <Route path="/giderler" element={<GiderPage />} />
            <Route path="/oylamalar" element={<OylamaPage />} />
            <Route path="/profil" element={<ProfilPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
