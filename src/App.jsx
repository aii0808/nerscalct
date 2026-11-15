import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import ToastReminder from './components/ToastReminder';
import ThemeModal from './components/ThemeModal';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InfusCalc from './pages/InfusCalc';
import DosisCalc from './pages/DosisCalc';
import FluidBalanceCalc from './pages/FluidBalanceCalc';
import GcsEwsCalc from './pages/GcsEwsCalc';
import SbarNotes from './pages/SbarNotes';
import MateriEdukasi from './pages/MateriEdukasi';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#E6ECF2] dark:bg-[#0A0D12] text-slate-900 dark:text-white font-sans antialiased overflow-x-hidden transition-colors duration-150">
      {/* Toast Reminder Background Monitor */}
      <ToastReminder />

      {/* Global Theme & Accent Customizer Modal */}
      <ThemeModal />

      {/* Desktop/Tablet Modern Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-8">
        <Header />
        <main className="flex-1 w-full">{children}</main>
      </div>

      {/* Mobile Floating Bottom Nav */}
      <BottomNav />
    </div>
  );
};

const AppContent = () => {
  const { user, isLoading } = useAuth();
  
  // Show splash screen only ONCE per browser session before login
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !sessionStorage.getItem('nerscalc_splash_seen');
    } catch {
      return false;
    }
  });

  const handleSplashFinish = () => {
    try {
      sessionStorage.setItem('nerscalc_splash_seen', 'true');
    } catch (e) {
      console.error(e);
    }
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E6ECF2] dark:bg-[#0A0D12] flex items-center justify-center">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <ThemeModal />
        <Login />
      </>
    );
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/infus" element={<InfusCalc />} />
        <Route path="/dosis" element={<DosisCalc />} />
        <Route path="/balance" element={<FluidBalanceCalc />} />
        <Route path="/gcs-ews" element={<GcsEwsCalc />} />
        <Route path="/sbar" element={<SbarNotes />} />
        <Route path="/edukasi" element={<MateriEdukasi />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
