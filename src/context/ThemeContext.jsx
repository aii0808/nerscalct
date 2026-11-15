import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ACCENT_PALETTES = {
  sage: {
    id: 'sage',
    name: 'Sage Emerald',
    subtitle: 'Warna Scrub Perawat Elit',
    primary: '#10B981',
    dark: '#059669',
    light: '#ECFDF5',
    textLight: 'text-emerald-700',
    textDark: 'text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300',
  },
  orange: {
    id: 'orange',
    name: 'Warm Orange',
    subtitle: 'Energi & Kehangatan Shift',
    primary: '#F97316',
    dark: '#EA580C',
    light: '#FFF7ED',
    textLight: 'text-orange-700',
    textDark: 'text-orange-400',
    badge: 'bg-orange-100 text-orange-900 dark:bg-orange-950/80 dark:text-orange-300',
  },
  burgundy: {
    id: 'burgundy',
    name: 'Burgundy Wine',
    subtitle: 'Elegan & Berwibawa',
    primary: '#BE123C',
    dark: '#9F1239',
    light: '#FFF1F2',
    textLight: 'text-rose-900',
    textDark: 'text-rose-400',
    badge: 'bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-300',
  },
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome Slate',
    subtitle: 'Minimalis & Netral',
    primary: '#475569',
    dark: '#334155',
    light: '#F1F5F9',
    textLight: 'text-slate-800',
    textDark: 'text-slate-200',
    badge: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
  },
  pink: {
    id: 'pink',
    name: 'Blossom Pink',
    subtitle: 'Manis & Ramah Pasien',
    primary: '#EC4899',
    dark: '#DB2777',
    light: '#FDF2F8',
    textLight: 'text-pink-800',
    textDark: 'text-pink-400',
    badge: 'bg-pink-100 text-pink-900 dark:bg-pink-950/80 dark:text-pink-300',
  },
  bluesky: {
    id: 'bluesky',
    name: 'Blue Sky',
    subtitle: 'Ketenangan & Medikal Presisi',
    primary: '#0284C7',
    dark: '#0369A1',
    light: '#F0F9FF',
    textLight: 'text-sky-800',
    textDark: 'text-sky-400',
    badge: 'bg-sky-100 text-sky-900 dark:bg-sky-950/80 dark:text-sky-300',
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('nerscalc_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  const [accent, setAccent] = useState(() => {
    try {
      return localStorage.getItem('nerscalc_accent') || 'sage';
    } catch {
      return 'sage';
    }
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('nerscalc_dark_mode', isDarkMode ? 'true' : 'false');
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('nerscalc_accent', accent);
    } catch (e) {
      console.error(e);
    }
  }, [accent]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const changeAccent = (newAccent) => {
    if (ACCENT_PALETTES[newAccent]) {
      setAccent(newAccent);
    }
  };

  const openThemeModal = () => setIsThemeModalOpen(true);
  const closeThemeModal = () => setIsThemeModalOpen(false);

  const currentPalette = ACCENT_PALETTES[accent] || ACCENT_PALETTES.sage;

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        accent,
        changeAccent,
        palette: currentPalette,
        palettes: ACCENT_PALETTES,
        isThemeModalOpen,
        openThemeModal,
        closeThemeModal,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
};
