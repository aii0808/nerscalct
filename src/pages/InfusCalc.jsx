import React, { useState } from 'react';
import {
  Droplets,
  RotateCcw,
  Copy,
  Check,
  Info,
} from 'lucide-react';
import MetronomeVisual from '../components/MetronomeVisual';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { playTingSound } from '../utils/soundEffects';

export const InfusCalc = () => {
  const { showToast } = useToast();
  const { palette } = useTheme();

  // Mode: 'calc-tpm' or 'calc-time'
  const [calcMode, setCalcMode] = useState('calc-tpm');

  // Input states for Mode 1 (Calc TPM)
  const [volume, setVolume] = useState('500'); // mL
  const [hours, setHours] = useState('8'); // jam
  const [minutes, setMinutes] = useState('0'); // menit
  const [dropFactor, setDropFactor] = useState(20); // 20 macro, 15 blood, 60 micro

  // Input states for Mode 2 (Calc End Time)
  const [remainingVolume, setRemainingVolume] = useState('500');
  const [runningTpm, setRunningTpm] = useState('20');
  const [timeDropFactor, setTimeDropFactor] = useState(20);

  const [copied, setCopied] = useState(false);

  // Mode 1: Hitung TPM
  const totalDurationMinutes = (Number(hours) || 0) * 60 + (Number(minutes) || 0);
  const numVolume = Number(volume) || 0;
  
  let calculatedTpm = 0;
  let calculatedMlPerHour = 0;
  let secondsPerDrop = 0;

  if (totalDurationMinutes > 0 && numVolume > 0) {
    calculatedTpm = (numVolume * dropFactor) / totalDurationMinutes;
    calculatedMlPerHour = numVolume / (totalDurationMinutes / 60);
    secondsPerDrop = calculatedTpm > 0 ? 60 / calculatedTpm : 0;
  }

  // Mode 2: Hitung Kapan Habis
  const numRemainingVol = Number(remainingVolume) || 0;
  const numRunningTpm = Number(runningTpm) || 0;

  let totalMinutesLeft = 0;
  let hoursLeft = 0;
  let minsLeft = 0;
  let estimatedFinishTimeStr = '-';

  if (numRunningTpm > 0 && numRemainingVol > 0) {
    totalMinutesLeft = Math.round((numRemainingVol * timeDropFactor) / numRunningTpm);
    hoursLeft = Math.floor(totalMinutesLeft / 60);
    minsLeft = totalMinutesLeft % 60;

    const finishDate = new Date(Date.now() + totalMinutesLeft * 60000);
    estimatedFinishTimeStr = finishDate.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }) + ' WIB';
  }

  const handleCopySummary = () => {
    let text = '';
    if (calcMode === 'calc-tpm') {
      text = `[NersCalc TPM Infus]\nVolume: ${numVolume} mL\nDurasi: ${hours} Jam ${minutes > 0 ? minutes + ' Menit' : ''}\nFaktor Tetes: ${dropFactor} gtt/mL\nHasil: ${Math.round(calculatedTpm)} TPM (${calculatedTpm.toFixed(1)} gtt/mnt)\nKecepatan: ${calculatedMlPerHour.toFixed(1)} mL/jam (1 tetes tiap ${secondsPerDrop.toFixed(2)} detik)\nAplikasi NersCalc • Developer: Ari Suandi Putra`;
    } else {
      text = `[NersCalc Estimasi Infus Habis]\nSisa Volume: ${numRemainingVol} mL\nTPM Terpasang: ${numRunningTpm} TPM\nEstimasi Selesai: ${hoursLeft} Jam ${minsLeft} Menit lagi (Sekitar ${estimatedFinishTimeStr})\nAplikasi NersCalc • Developer: Ari Suandi Putra`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    playTingSound();
    showToast({
      title: 'Tersalin ke Clipboard',
      message: 'Hasil perhitungan infus berhasil disalin untuk dokumentasi askep!',
      type: 'success',
      duration: 3000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (calcMode === 'calc-tpm') {
      setVolume('500');
      setHours('8');
      setMinutes('0');
      setDropFactor(20);
    } else {
      setRemainingVolume('500');
      setRunningTpm('20');
      setTimeDropFactor(20);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div
              className="p-2.5 rounded-2xl shadow-sm"
              style={{ backgroundColor: `${palette.primary}20`, color: palette.primary }}
            >
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Kalkulator TPM Infus
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
                Perhitungan Tetes Per Menit & Metronom Tetesan Realistis S.Kep
              </p>
            </div>
          </div>
        </div>

        {/* Tab Mode Toggle */}
        <div className="flex p-1.5 rounded-2xl neu-card-sm w-full sm:w-auto">
          <button
            onClick={() => setCalcMode('calc-tpm')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all ${
              calcMode === 'calc-tpm'
                ? 'neu-btn-active text-white'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            style={calcMode === 'calc-tpm' ? { backgroundColor: palette.primary } : {}}
          >
            Hitung TPM
          </button>
          <button
            onClick={() => setCalcMode('calc-time')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all ${
              calcMode === 'calc-time'
                ? 'neu-btn-active text-white'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            style={calcMode === 'calc-time' ? { backgroundColor: palette.primary } : {}}
          >
            Kapan Infus Habis?
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Inputs */}
        <div className="lg:col-span-7 neu-card rounded-3xl p-6 space-y-5">
          
          {calcMode === 'calc-tpm' ? (
            <>
              {/* Factor Selection */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
                  Faktor Tetes (Tipe Selang Infus)
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: 'Dewasa / Makro', factor: 20, desc: '20 gtt/mL' },
                    { label: 'Darah / Transfusi', factor: 15, desc: '15 gtt/mL' },
                    { label: 'Anak / Mikro', factor: 60, desc: '60 gtt/mL' },
                  ].map((f) => (
                    <button
                      key={f.factor}
                      type="button"
                      onClick={() => setDropFactor(f.factor)}
                      className={`p-3 rounded-2xl text-left transition-all ${
                        dropFactor === f.factor
                          ? 'neu-btn-active ring-2'
                          : 'neu-btn text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      style={
                        dropFactor === f.factor
                          ? { borderColor: palette.primary, color: palette.primary }
                          : {}
                      }
                    >
                      <p className="text-xs font-black leading-tight">{f.label}</p>
                      <span className="text-[11px] font-mono font-bold">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Cairan */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Total Volume Cairan (mL / kolf)
                  </label>
                  <span className="text-xs font-black" style={{ color: palette.primary }}>
                    Preskripsi Dokter
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="10"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="Contoh: 500"
                    className="w-full px-4 py-3 text-base font-black text-slate-900 dark:text-white rounded-2xl neu-input pr-14"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-black text-slate-500">
                    mL
                  </span>
                </div>

                {/* Quick Presets Volume */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-slate-500 font-bold">Preset cepat:</span>
                  {[100, 250, 500, 1000].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVolume(String(v))}
                      className="px-2.5 py-1 rounded-xl text-xs font-black neu-card-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    >
                      {v} mL
                    </button>
                  ))}
                </div>
              </div>

              {/* Durasi Habis */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
                  Target Durasi Habis
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      placeholder="8"
                      className="w-full px-4 py-3 text-base font-black text-slate-900 dark:text-white rounded-2xl neu-input pr-16"
                    />
                    <span className="absolute right-4 top-3.5 text-xs font-black text-slate-500">
                      Jam
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 text-base font-black text-slate-900 dark:text-white rounded-2xl neu-input pr-16"
                    />
                    <span className="absolute right-4 top-3.5 text-xs font-black text-slate-500">
                      Menit
                    </span>
                  </div>
                </div>

                {/* Quick Presets Durasi */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-slate-500 font-bold">Preset jam:</span>
                  {[4, 6, 8, 12, 24].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => {
                        setHours(String(h));
                        setMinutes('0');
                      }}
                      className="px-2.5 py-1 rounded-xl text-xs font-black neu-card-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    >
                      {h} Jam
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Mode 2: Estimasi Jam Selesai */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
                  Tipe Selang Infus
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: 'Makro 20', factor: 20 },
                    { label: 'Transfusi 15', factor: 15 },
                    { label: 'Mikro 60', factor: 60 },
                  ].map((f) => (
                    <button
                      key={f.factor}
                      type="button"
                      onClick={() => setTimeDropFactor(f.factor)}
                      className={`p-3 rounded-2xl text-center text-xs font-black transition-all ${
                        timeDropFactor === f.factor
                          ? 'neu-btn-active ring-2'
                          : 'neu-btn text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      style={
                        timeDropFactor === f.factor
                          ? { borderColor: palette.primary, color: palette.primary }
                          : {}
                      }
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
                  Sisa Volume Cairan di Botol (mL)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={remainingVolume}
                    onChange={(e) => setRemainingVolume(e.target.value)}
                    placeholder="Contoh: 350"
                    className="w-full px-4 py-3 text-base font-black text-slate-900 dark:text-white rounded-2xl neu-input pr-14"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-black text-slate-500">
                    mL
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
                  Kecepatan TPM yang Terpasang Saat Ini
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={runningTpm}
                    onChange={(e) => setRunningTpm(e.target.value)}
                    placeholder="Contoh: 20"
                    className="w-full px-4 py-3 text-base font-black text-slate-900 dark:text-white rounded-2xl neu-input pr-16"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-black text-slate-500">
                    TPM
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-300/60 dark:border-white/10">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl neu-btn text-xs font-black text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl neu-btn-accent text-xs font-black shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Hasil Tindakan'}</span>
            </button>
          </div>

        </div>

        {/* Right Output & Interactive Metronome */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Calculation Card */}
          <div className="neu-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                {calcMode === 'calc-tpm' ? 'Hasil Hitungan Kecepatan' : 'Perkiraan Waktu Selesai'}
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full font-black text-[10px]"
                style={{ backgroundColor: `${palette.primary}20`, color: palette.primary }}
              >
                S.Kep Akurat
              </span>
            </div>

            {calcMode === 'calc-tpm' ? (
              <div className="space-y-4">
                <div className="text-center py-3 rounded-2xl shadow-neu-pressed">
                  <div
                    className="text-4xl sm:text-5xl font-black font-mono tracking-tight"
                    style={{ color: palette.primary }}
                  >
                    {Math.round(calculatedTpm)}
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-500 mt-1">
                    Tetes Per Menit (TPM)
                  </div>
                  <div className="text-xs font-bold mt-0.5" style={{ color: palette.primary }}>
                    ({calculatedTpm.toFixed(1)} gtt / menit presisi)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-2xl neu-card-sm">
                    <p className="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase">Interval Tetes</p>
                    <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                      1 tetes / <span className="font-bold" style={{ color: palette.primary }}>{secondsPerDrop.toFixed(2)}s</span>
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl neu-card-sm">
                    <p className="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase">Infus Pump Rate</p>
                    <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                      {calculatedMlPerHour.toFixed(1)} <span className="text-xs font-bold text-slate-500">mL/jam</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-4 rounded-2xl shadow-neu-pressed">
                  <div
                    className="text-3xl sm:text-4xl font-black font-mono tracking-tight"
                    style={{ color: palette.primary }}
                  >
                    {hoursLeft} Jam {minsLeft} Mnt
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-500 mt-1">
                    Sisa Waktu Habis Infus
                  </div>
                  <div className="text-sm font-black mt-2" style={{ color: palette.primary }}>
                    Perkiraan Habis: {estimatedFinishTimeStr}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Embedded Metronome Component */}
          <MetronomeVisual
            tpm={calcMode === 'calc-tpm' ? Math.round(calculatedTpm) || 20 : numRunningTpm || 20}
            isMacro={calcMode === 'calc-tpm' ? dropFactor <= 20 : timeDropFactor <= 20}
          />

        </div>

      </div>

    </div>
  );
};

export default InfusCalc;
