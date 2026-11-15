import React, { createContext, useContext, useState, useEffect } from 'react';
import { playTingSound, playErrorSound } from '../utils/soundEffects';

const AuthContext = createContext(null);

const STORAGE_KEY = 'nerscalc_auth_session';

// Configuration loaded via environment variables (.env) or standard credentials
const NURSE_USER = (import.meta.env.VITE_NURSE_USERNAME || 'lala').toLowerCase();
const NURSE_PASS = import.meta.env.VITE_NURSE_PASSWORD || '12345678';
const ADMIN_USER = (import.meta.env.VITE_ADMIN_USERNAME || 'admin').toLowerCase();
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse auth from localStorage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (usernameInput, passwordInput) => {
    const username = (usernameInput || '').trim().toLowerCase();
    const password = (passwordInput || '').trim();

    let matchedUser = null;

    if (username === NURSE_USER && password === NURSE_PASS) {
      matchedUser = {
        name: 'Perawat Lala',
        title: 'S.Kep',
        role: 'Perawat Andalan Ruangan',
        username: NURSE_USER,
        avatarInitial: 'L',
        shiftDefault: 'Pagi / Sore',
        unit: 'Instalasi Rawat Inap & ICU'
      };
    } else if (
      (username === ADMIN_USER || username === 'perawathebat') &&
      (password === ADMIN_PASS || password === NURSE_PASS)
    ) {
      matchedUser = {
        name: 'Ns. Perawat Hebat',
        title: 'S.Kep',
        role: 'Perawat Penanggung Jawab Shift',
        username: username,
        avatarInitial: 'P',
        shiftDefault: 'Pagi',
        unit: 'Ruang Rawat Utama'
      };
    }

    if (matchedUser) {
      const sessionData = {
        ...matchedUser,
        loginAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
      setUser(sessionData);
      playTingSound();
      return { success: true, user: sessionData };
    } else {
      playErrorSound();
      return {
        success: false,
        error: 'Maaf, hanya S.Kep andalan yang bisa masuk!'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
