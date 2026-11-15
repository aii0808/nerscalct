import React from 'react';
import { NavLink } from 'react-router-dom';
import { HeartPulse, Droplets, Syringe, Scale, GraduationCap, ClipboardList } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const BottomNav = () => {
  const { palette } = useTheme();

  const navItems = [
    { to: '/', label: 'Dinas', icon: HeartPulse },
    { to: '/infus', label: 'Infus', icon: Droplets },
    { to: '/dosis', label: 'Dosis', icon: Syringe },
    { to: '/balance', label: 'Balance', icon: Scale },
    { to: '/edukasi', label: 'Edukasi', icon: GraduationCap },
    { to: '/sbar', label: 'SBAR', icon: ClipboardList },
  ];

  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-40">
      <nav className="bg-[#E6ECF2]/95 dark:bg-[#13171D]/95 backdrop-blur-md px-2 py-2 rounded-3xl shadow-lg border border-slate-300/80 dark:border-slate-800 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all duration-150 ${
                  isActive
                    ? 'font-black scale-105 shadow-sm bg-black/5 dark:bg-white/10'
                    : 'text-slate-600 dark:text-slate-300 font-bold hover:text-slate-900 dark:hover:text-white'
                }`
              }
              style={({ isActive }) =>
                isActive ? { color: palette.primary } : {}
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'stroke-[2.5px] scale-110' : 'stroke-[2px]'
                    }`}
                  />
                  <span className="text-[9px] mt-1 tracking-tight leading-none font-bold">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
