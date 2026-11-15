import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HeartPulse,
  Droplets,
  Syringe,
  Activity,
  ClipboardList,
  Scale,
  GraduationCap,
  LogOut,
  Volume2,
  VolumeX,
  Palette,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import BurgerButton from './BurgerButton';
import NersLogo from './NersLogo';
import { isSoundMuted, setSoundMuted } from '../utils/soundEffects';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [muted, setMutedState] = useState(isSoundMuted());
  const { user, logout } = useAuth();
  const { palette, openThemeModal } = useTheme();

  const toggleSound = () => {
    const next = !muted;
    setSoundMuted(next);
    setMutedState(next);
  };

  const navItems = [
    { to: '/', label: 'Beranda Dinas', icon: HeartPulse },
    { to: '/infus', label: 'Kalkulator TPM Infus', icon: Droplets },
    { to: '/dosis', label: 'Dosis & Oplos Obat', icon: Syringe },
    { to: '/balance', label: 'Balance Cairan & IWL', icon: Scale },
    { to: '/gcs-ews', label: 'Skoring GCS & Pupil', icon: Activity },
    { to: '/sbar', label: 'Operan Shift (SBAR)', icon: ClipboardList },
    { to: '/edukasi', label: 'Edukasi & Reader SOP', icon: GraduationCap },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col justify-between h-screen sticky top-0 bg-[#E6ECF2] dark:bg-[#10141A] border-r border-slate-300/70 dark:border-slate-800/80 p-3.5 transition-all duration-200 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Burger Toggle */}
      <div>
        <div className="flex items-center justify-between mb-6 px-1">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md p-1.5"
                style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.dark})` }}
              >
                <NersLogo className="w-6 h-6" primaryColor="rgba(255, 255, 255, 0.95)" pulseColor={palette.primary} />
              </div>
              <div>
                <h1 className="font-black text-base text-slate-900 dark:text-white tracking-tight leading-none">
                  Ners<span style={{ color: palette.primary }}>Calc</span>
                </h1>
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-600 dark:text-slate-300">
                  S.Kep Edition
                </span>
              </div>
            </div>
          )}

          {collapsed && (
            <div
              className="mx-auto w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md p-1.5"
              style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.dark})` }}
            >
              <NersLogo className="w-6 h-6" primaryColor="rgba(255, 255, 255, 0.95)" pulseColor={palette.primary} />
            </div>
          )}

          {/* Modern Animated Burger Button */}
          <BurgerButton
            isOpen={!collapsed}
            onClick={() => setCollapsed(!collapsed)}
            className={collapsed ? 'mx-auto mt-2' : ''}
          />
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-2xl font-black text-xs transition-all duration-150 ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  } ${collapsed ? 'justify-center px-0' : ''}`
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                        background: `linear-gradient(135deg, ${palette.primary}, ${palette.dark})`,
                      }
                    : {}
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Profile, Theme, Audio & Copyright */}
      <div className="space-y-2 pt-3 border-t border-slate-300/60 dark:border-white/10">
        
        {/* Theme Settings Button */}
        <button
          onClick={openThemeModal}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold neu-btn text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title="Ubah Tema & Warna Aksen"
        >
          <Palette className="w-4 h-4 shrink-0" style={{ color: palette.primary }} />
          {!collapsed && <span>Tema &amp; Warna</span>}
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold neu-btn text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title={muted ? 'Aktifkan Suara' : 'Bisukan Suara'}
        >
          {muted ? <VolumeX className="w-4 h-4 text-rose-500 shrink-0" /> : <Volume2 className="w-4 h-4 shrink-0" style={{ color: palette.primary }} />}
          {!collapsed && <span>{muted ? 'Suara Senyap' : 'Efek Suara'}</span>}
        </button>

        {/* User Badge */}
        <div
          className={`p-2.5 rounded-2xl neu-card-sm flex items-center gap-2.5 ${
            collapsed ? 'justify-center p-2' : ''
          }`}
        >
          <div
            className="w-8 h-8 rounded-xl text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm"
            style={{ backgroundColor: palette.primary }}
          >
            {user?.avatarInitial || 'L'}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-slate-900 dark:text-white truncate leading-tight">
                {user?.name || 'Perawat Lala'}
              </p>
              <div className="flex items-center gap-1 text-[10px] font-black" style={{ color: palette.primary }}>
                <HeartPulse className="w-3 h-3" />
                <span>S.Kep Ruangan</span>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title="Akhiri Shift"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && <span>Akhiri Shift</span>}
        </button>

        {/* Copyright Notice */}
        {!collapsed && (
          <div className="pt-2 text-[10px] text-center text-slate-600 dark:text-slate-300 leading-tight">
            <p className="font-black text-slate-900 dark:text-white">&copy; Ari Suandi Putra</p>
            <p className="text-[9px] opacity-80">NersCalc Professional S.Kep</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
