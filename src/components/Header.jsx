import React, { useState, useEffect } from 'react';
import { Clock, Volume2, VolumeX, LogOut, Sun, Moon, Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getTimeGreeting } from '../utils/nurseSchedule';
import { isSoundMuted, setSoundMuted } from '../utils/soundEffects';

export const Header = () => {
  const { logout } = useAuth();
  const { isDarkMode, toggleDarkMode, palette, openThemeModal } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [muted, setMuted] = useState(isSoundMuted());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const greetingData = getTimeGreeting(currentTime);

  const toggleSound = () => {
    const next = !muted;
    setSoundMuted(next);
    setMuted(next);
  };

  const formattedTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const formattedDate = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  return (
    <header className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3 px-4 sm:px-8 border-b border-slate-300/70 dark:border-slate-800/80 bg-[#E6ECF2] dark:bg-[#10141A] sticky top-0 z-20 transition-colors">
      
      {/* Left: Shift Greeting & S.Kep Badge */}
      <div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black shadow-sm ${palette.badge}`}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: palette.primary }}
            />
            {greetingData.shiftName} &bull; S.Kep
          </span>
          <span className="text-xs text-slate-700 dark:text-slate-300 font-bold hidden sm:inline">
            &bull; {formattedDate}
          </span>
        </div>
        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1 tracking-tight">
          {greetingData.greeting}
        </h2>
      </div>

      {/* Right: Quick Controls & Theme Customizer (Mobile & Desktop) */}
      <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
        
        {/* Digital Clock */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl neu-card-sm text-xs font-black text-slate-900 dark:text-white tracking-wide">
          <Clock className="w-3.5 h-3.5" style={{ color: palette.primary }} />
          <span className="font-mono">{formattedTime} WIB</span>
        </div>

        {/* Theme Accent Color Switcher (Responsive Mobile & Desktop) */}
        <button
          onClick={openThemeModal}
          className="p-2.5 rounded-2xl neu-btn text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5"
          title="Ubah Warna Aksen Scrub Ruangan"
          aria-label="Ubah Tema dan Warna Scrub"
        >
          <Palette className="w-4 h-4" style={{ color: palette.primary }} />
          <span className="hidden sm:inline text-xs font-black capitalize">
            {palette.name.split(' ')[0]}
          </span>
        </button>

        {/* Quick Dark / Light Mode Switch */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-2xl neu-btn text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all"
          title={isDarkMode ? 'Ganti ke Mode Terang (Siang Lembut)' : 'Ganti ke Mode Gelap (Malam Redup)'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="p-2.5 rounded-2xl neu-btn text-slate-700 dark:text-slate-200 transition-all"
          title={muted ? 'Aktifkan Suara' : 'Bisukan Suara'}
        >
          {muted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" style={{ color: palette.primary }} />}
        </button>

        {/* Mobile Logout */}
        <button
          onClick={logout}
          className="md:hidden p-2.5 rounded-2xl neu-btn text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          title="Akhiri Shift"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
