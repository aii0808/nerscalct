import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Droplets,
  Syringe,
  Activity,
  ClipboardList,
  Sparkles,
  Clock,
  Bell,
  Heart,
  ChevronRight,
  ShieldCheck,
  Scale,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { getTimeGreeting, getDailyQuote, SCHEDULED_REMINDERS } from '../utils/nurseSchedule';
import { getDailyNurseSweetWord } from '../utils/nurseGombalan';

export const Dashboard = () => {
  const { user } = useAuth();
  const { palette } = useTheme();
  const navigate = useNavigate();

  const [now] = useState(new Date());
  const greetingData = getTimeGreeting(now);
  const dailyQuote = getDailyQuote(now);
  const dailySweet = getDailyNurseSweetWord();

  const quickNav = (path) => {
    navigate(path);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      
      {/* Top Banner: Shift Greeting & Dedicated Sweet Words for Ners Lala */}
      <div className="neu-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-sm ${palette.badge}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{dailyQuote.day} &bull; S.Kep Andalan Ruangan</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-pink-100 text-pink-900 dark:bg-pink-950/80 dark:text-pink-300 shadow-sm">
                <Heart className="w-3.5 h-3.5 fill-current text-pink-500" />
                <span>{dailySweet.tag}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {greetingData.greeting}
            </h1>

            {/* Daily Non-Alay Sweet Words for Perawat Cantik S.Kep */}
            <p className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200 max-w-2xl leading-relaxed italic border-l-4 border-emerald-500 pl-3.5">
              "{dailySweet.quote}"
            </p>
          </div>

          {/* Nurse Identity Badge */}
          <div className="neu-card-sm rounded-2xl p-4 flex items-center gap-3.5 shrink-0">
            <div
              className="w-12 h-12 rounded-2xl text-white font-black text-xl flex items-center justify-center shadow-md"
              style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.dark})` }}
            >
              {user?.avatarInitial || 'L'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-slate-900 dark:text-white">{user?.name || 'Perawat Lala'}</span>
                <ShieldCheck className="w-4 h-4" style={{ color: palette.primary }} />
              </div>
              <p className="text-xs font-black" style={{ color: palette.primary }}>S.Kep</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-bold mt-0.5">{user?.unit || ''}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Clinical Tools Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Menu Klinis & Alat Bantu Praktik S.Kep
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
              Hitung cepat, monitoring tetesan, keseimbangan cairan, dan edukasi ruangan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          
          {/* Tile 1: Infus TPM */}
          <div
            onClick={() => quickNav('/infus')}
            className="neu-card rounded-3xl p-5 cursor-pointer hover:shadow-lg transition-all duration-150 group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-neu-pressed-sm dark:shadow-neu-dark-pressed-sm mb-3.5 group-hover:scale-105 transition-transform">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Kalkulator TPM Infus & Metronom
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                Hitung tetes per menit (Makro 20, Mikro 60, Darah 15), sisa waktu & metronom tetesan realistis.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-300/60 dark:border-white/10 flex items-center justify-between text-xs font-black text-emerald-600 dark:text-emerald-400">
              <span>Buka InfusCalc</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Tile 2: Dosis & Oplos Obat */}
          <div
            onClick={() => quickNav('/dosis')}
            className="neu-card rounded-3xl p-5 cursor-pointer hover:shadow-lg transition-all duration-150 group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-neu-pressed-sm dark:shadow-neu-dark-pressed-sm mb-3.5 group-hover:scale-105 transition-transform">
                <Syringe className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                Dosis Obat & Syringe Pump
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                Vasoaktif inotropik (mcg/kg/mnt ke mL/jam), oplos vial/ampul, dan dosis pediatrik mg/kgBB.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-300/60 dark:border-white/10 flex items-center justify-between text-xs font-black text-sky-600 dark:text-sky-400">
              <span>Buka DosisCalc</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Tile 3: Balance Cairan & IWL */}
          <div
            onClick={() => quickNav('/balance')}
            className="neu-card rounded-3xl p-5 cursor-pointer hover:shadow-lg transition-all duration-150 group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-neu-pressed-sm dark:shadow-neu-dark-pressed-sm mb-3.5 group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                Balance Cairan & IWL
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                Keseimbangan input-output cairan 24 jam / per shift, air metabolisme, dan koreksi demam.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-300/60 dark:border-white/10 flex items-center justify-between text-xs font-black text-amber-600 dark:text-amber-400">
              <span>Buka Fluid Balance</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Tile 4: Edukasi & SOP "Jangan Panik!" */}
          <div
            onClick={() => quickNav('/edukasi')}
            className="neu-card rounded-3xl p-5 cursor-pointer hover:shadow-lg transition-all duration-150 group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-neu-pressed-sm dark:shadow-neu-dark-pressed-sm mb-3.5 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                Edukasi SOP & Reader Dokumen
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                Panduan darurat "Jangan Panik Lakukan Ini" (syok, code blue, kejang) & pembaca file PDF/Excel/Word.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-300/60 dark:border-white/10 flex items-center justify-between text-xs font-black text-rose-600 dark:text-rose-400">
              <span>Buka Pusat Edukasi</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Tile 5: Skoring GCS & Pupil */}
          <div
            onClick={() => quickNav('/gcs-ews')}
            className="neu-card rounded-3xl p-5 cursor-pointer hover:shadow-lg transition-all duration-150 group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-neu-pressed-sm dark:shadow-neu-dark-pressed-sm mb-3.5 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                Skoring GCS & Kesadaran
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                Penilaian tingkat kesadaran Eye-Verbal-Motorik (E-V-M) rentang 3–15 dan refleks pupil isokor.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-300/60 dark:border-white/10 flex items-center justify-between text-xs font-black text-indigo-600 dark:text-indigo-400">
              <span>Buka Skoring GCS</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Tile 6: SBAR Handover */}
          <div
            onClick={() => quickNav('/sbar')}
            className="neu-card rounded-3xl p-5 cursor-pointer hover:shadow-lg transition-all duration-150 group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-neu-pressed-sm dark:shadow-neu-dark-pressed-sm mb-3.5 group-hover:scale-105 transition-transform">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                Operan Shift SBAR
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                Timbang terima pasien antar-perawat (Situation, Background, Assessment, Recommendation) siap salin.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-300/60 dark:border-white/10 flex items-center justify-between text-xs font-black text-teal-600 dark:text-teal-400">
              <span>Buka Catatan SBAR</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* Reminders List Section */}
      <div className="neu-card rounded-3xl p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-300/60 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 shadow-neu-pressed-sm dark:shadow-neu-dark-pressed-sm">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Jadwal Pengingat Sholat & Nutrisi (WIB)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Pop-up santun otomatis saat memasuki waktu ibadah & makan siang
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1 rounded-full shadow-sm hidden sm:inline">
            Realtime Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SCHEDULED_REMINDERS.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl neu-card-sm flex items-start justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-lg bg-white/80 dark:bg-black/40 font-mono font-black text-[11px] text-slate-900 dark:text-white border border-slate-200/50 dark:border-white/5">
                    {item.badge}
                  </span>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {item.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="pt-2 pb-4 text-center text-xs text-slate-600 dark:text-slate-300 border-t border-slate-300/60 dark:border-white/10 font-bold">
        <p className="text-slate-900 dark:text-white">
          &copy; Ari Suandi Putra &bull; NersCalc
        </p>
        <p className="text-[11px] font-medium opacity-80 mt-0.5">
          
        </p>
      </div>

    </div>
  );
};

export default Dashboard;
