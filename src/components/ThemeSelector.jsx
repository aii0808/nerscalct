import React from 'react';
import { Sun, Moon, Palette, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSelector = () => {
  const { isDarkMode, toggleDarkMode, accent, changeAccent, palettes } = useTheme();

  return (
    <div className="space-y-4">
      {/* Dark / Light Toggle */}
      <div className="flex items-center justify-between p-3 rounded-2xl neu-card-sm">
        <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
          {isDarkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          <span>{isDarkMode ? 'Mode Gelap (Malam Redup)' : 'Mode Terang (Siang Lembut)'}</span>
        </span>

        <button
          onClick={toggleDarkMode}
          className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
            isDarkMode ? 'bg-emerald-600' : 'bg-slate-300'
          }`}
          aria-label="Ubah mode gelap/terang"
        >
          <div
            className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
              isDarkMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Accent Colors Palette Grid */}
      <div>
        <p className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2.5 px-1 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5" />
          <span>Pilih Warna Aksen Scrub Ruangan</span>
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {Object.values(palettes).map((p) => {
            const isSelected = accent === p.id;
            return (
              <button
                key={p.id}
                onClick={() => changeAccent(p.id)}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all ${
                  isSelected
                    ? 'neu-btn-active ring-2 ring-emerald-500 shadow-sm'
                    : 'neu-btn hover:scale-105'
                }`}
                title={`${p.name} - ${p.subtitle}`}
              >
                <div
                  className="w-6 h-6 rounded-xl flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: p.primary }}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                </div>
                <span className="text-[10px] font-black text-slate-900 dark:text-white truncate max-w-full">
                  {p.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
