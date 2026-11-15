import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Sun, Moon, HeartPulse } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { playTingSound } from '../utils/soundEffects';
import NersLogo from '../components/NersLogo';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const { isDarkMode, toggleDarkMode, palette } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = login(username, password);
      setIsSubmitting(false);

      if (res.success) {
        playTingSound();
        showToast({
          title: 'Akses Divalidasi',
          message: `Selamat bertugas, ${res.user.name}! NersCalc siap mendampingi dinasmu.`,
          type: 'success',
          duration: 3500,
        });
      } else {
        setErrorMessage(res.error);
        showToast({
          title: 'Akses Ditolak',
          message: res.error,
          type: 'error',
          duration: 5000,
        });
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#E6ECF2] dark:bg-[#0A0D12] text-slate-900 dark:text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors duration-150">
      
      {/* Top Floating Dark Mode Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-2xl neu-btn text-slate-700 dark:text-slate-200 transition-all"
          title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>
      </div>

      {/* Main Login Box */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Header Icon & Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-3xl neu-card mb-3">
            <div
              className="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-md p-2"
              style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.dark})` }}
            >
              <NersLogo className="w-7 h-7" primaryColor="rgba(255, 255, 255, 0.95)" pulseColor={palette.primary} />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Ners<span style={{ color: palette.primary }}>Calc</span>
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 mt-0.5">
            Asisten perhitungan perawat
          </p>
        </div>

        {/* Card Body with True Neumorphism */}
        <div className="neu-card rounded-3xl p-6 sm:p-8">
          
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-300/60 dark:border-white/10">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: palette.primary }}>
                Verifikasi Hak Akses
              </span>
              <h2 className="text-sm font-black text-slate-900 dark:text-white">
                Masuk ke Sistem Dinas
              </h2>
            </div>
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black shadow-sm ${palette.badge}`}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: palette.primary }} />
              Validated
            </div>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-100 text-rose-950 dark:bg-rose-950/70 dark:text-rose-200 border border-rose-300 dark:border-rose-800 text-xs flex items-start gap-2.5 shadow-sm">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-black">Akses Ditolak:</strong>
                <span className="font-bold">{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                Username / Identitas
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan Username"
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-black text-slate-900 dark:text-white rounded-2xl neu-input placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Kata Sandi"
                  className="w-full pl-10 pr-11 py-2.5 text-xs font-black text-slate-900 dark:text-white rounded-2xl neu-input placeholder:text-slate-400 placeholder:font-normal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-2xl text-white font-black text-xs tracking-wide flex items-center justify-center gap-2 shadow-md transition-all"
                style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.dark})` }}
              >
                {isSubmitting ? (
                  <span>Memvalidasi S.Kep...</span>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Copyright Ari Suandi Putra */}
          <div className="mt-5 pt-3.5 border-t border-slate-300/60 dark:border-white/10 text-center space-y-1">
            <p className="text-[11px] font-black text-slate-900 dark:text-white">
              &copy; Ari Suandi Putra &bull; Developer
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
              NersCalc Clinical System
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;
