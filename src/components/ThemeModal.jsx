import React from 'react';
import { Palette, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeSelector from './ThemeSelector';

export const ThemeModal = () => {
  const { isThemeModalOpen, closeThemeModal, palette } = useTheme();

  if (!isThemeModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
      <div className="w-full max-w-md neu-card rounded-3xl p-6 relative">
        <button
          onClick={closeThemeModal}
          className="absolute top-4 right-4 p-2 rounded-xl neu-btn text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white"
          aria-label="Tutup pengaturan tema"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          <Palette className="w-5 h-5" style={{ color: palette.primary }} />
          <span>Personalisasi Tema &amp; Warna Scrub</span>
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-5 font-bold">
          Pilih mode gelap/terang dan warna aksen scrub ruangan favoritmu
        </p>

        <ThemeSelector />

        <div className="mt-6 pt-4 border-t border-slate-300/60 dark:border-white/10 flex justify-between items-center text-[11px] font-bold text-slate-600 dark:text-slate-300">
          <span>&copy; Ari Suandi Putra (Developer)</span>
          <button
            onClick={closeThemeModal}
            className="px-4 py-2 rounded-xl text-xs font-black shadow-md text-white transition-transform active:scale-95"
            style={{ backgroundColor: palette.primary }}
          >
            Simpan Tampilan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeModal;
