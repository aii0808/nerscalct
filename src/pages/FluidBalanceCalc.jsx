import React, { useState } from 'react';
import {
  RotateCcw,
  Copy,
  Check,
  Scale,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { playTingSound } from '../utils/soundEffects';

export const FluidBalanceCalc = () => {
  const { showToast } = useToast();
  const { palette } = useTheme();
  const [copied, setCopied] = useState(false);

  // Pasien info
  const [weight, setWeight] = useState('60'); // kg
  const [temp, setTemp] = useState('36.8'); // Celcius
  const [hoursPeriod, setHoursPeriod] = useState('24'); // 24 jam / 8 jam / 12 jam

  // Intake (Pemasukan)
  const [infusVol, setInfusVol] = useState('1500'); // mL
  const [oralDrink, setOralDrink] = useState('800'); // mL
  const [oralFoodNgt, setOralFoodNgt] = useState('300'); // mL
  const [medsDrip, setMedsDrip] = useState('200'); // mL
  const [transfusion, setTransfusion] = useState('0'); // mL

  // Output (Pengeluaran)
  const [urineVol, setUrineVol] = useState('1600'); // mL
  const [drainGastric, setDrainGastric] = useState('0'); // mL
  const [stoolVol, setStoolVol] = useState('150'); // mL
  const [bloodLoss, setBloodLoss] = useState('0'); // mL

  // Calculations
  const numBB = Number(weight) || 0;
  const numTemp = Number(temp) || 36.8;
  const numHours = Number(hoursPeriod) || 24;

  // Air Metabolisme: 5 mL/kgBB/24 jam
  const metabolicWater = numBB > 0 ? (5 * numBB * (numHours / 24)) : 0;

  const totalIntake =
    (Number(infusVol) || 0) +
    (Number(oralDrink) || 0) +
    (Number(oralFoodNgt) || 0) +
    (Number(medsDrip) || 0) +
    (Number(transfusion) || 0) +
    metabolicWater;

  // IWL Standar: 15 mL/kgBB/24 jam
  let standardIwl = numBB > 0 ? (15 * numBB * (numHours / 24)) : 0;

  // Koreksi Suhu Demam (T > 37.5)
  let feverIwlExtra = 0;
  if (numTemp > 37.5) {
    const deltaT = numTemp - 37.5;
    feverIwlExtra = standardIwl * 0.1 * deltaT;
  }
  const totalIwl = standardIwl + feverIwlExtra;

  const totalOutput =
    (Number(urineVol) || 0) +
    (Number(drainGastric) || 0) +
    (Number(stoolVol) || 0) +
    (Number(bloodLoss) || 0) +
    totalIwl;

  const netBalance = totalIntake - totalOutput;
  const urineRate = numBB > 0 && numHours > 0 ? (Number(urineVol) || 0) / (numBB * numHours) : 0;

  const handleCopy = () => {
    const text = `[NersCalc Balance Cairan & IWL]
Periode: ${numHours} Jam | BB: ${numBB} kg | Suhu: ${numTemp}°C
📥 Total Intake: ${Math.round(totalIntake)} mL (Infus: ${infusVol}mL, Minum/Sonde: ${oralDrink}mL, Obat: ${medsDrip}mL, Air Metabolisme: ${Math.round(metabolicWater)}mL)
📤 Total Output: ${Math.round(totalOutput)} mL (Urine: ${urineVol}mL, IWL: ${Math.round(totalIwl)}mL, Drain: ${drainGastric}mL)
⚖️ Balance Cairan Netto: ${netBalance >= 0 ? '+' : ''}${Math.round(netBalance)} mL
Urine Output: ${urineRate.toFixed(2)} mL/kgBB/jam (${urineRate >= 0.5 ? 'Normal/Adekuat' : 'Oliguria - Perlu Evaluasi!'})
Aplikasi NersCalc • Developer: Ari Suandi Putra`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    playTingSound();
    showToast({
      title: 'Tersalin ke Clipboard',
      message: 'Laporan balance cairan siap ditempel di lembar observasi!',
      type: 'success',
      duration: 3000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInfusVol('1500');
    setOralDrink('800');
    setOralFoodNgt('300');
    setMedsDrip('200');
    setTransfusion('0');
    setUrineVol('1600');
    setDrainGastric('0');
    setStoolVol('150');
    setBloodLoss('0');
    setTemp('36.8');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div
            className="p-2.5 rounded-2xl shadow-neu-pressed-sm dark:shadow-neu-dark-pressed-sm"
            style={{ backgroundColor: `${palette.primary}20`, color: palette.primary }}
          >
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Kalkulator Balance Cairan & IWL
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
              Keseimbangan Input-Output Cairan 24 Jam & Koreksi Suhu Demam Khusus S.Kep
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl neu-btn text-xs font-black text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl neu-btn-accent text-xs font-black flex items-center gap-1.5 shadow-md"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Salin Lembar Observasi</span>
          </button>
        </div>
      </div>

      {/* Patient Base Parameter Card */}
      <div className="neu-card rounded-3xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Berat Badan Pasien (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm font-black text-slate-900 dark:text-white rounded-xl neu-input"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Suhu Tubuh (°C)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-black text-slate-900 dark:text-white rounded-xl neu-input pr-12"
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-black text-slate-500">
              °C
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Periode Observasi
          </label>
          <select
            value={hoursPeriod}
            onChange={(e) => setHoursPeriod(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs font-black text-slate-900 dark:text-white rounded-xl neu-input"
          >
            <option value="24">24 Jam (Shift Lengkap)</option>
            <option value="8">8 Jam (Satu Shift Dinas)</option>
            <option value="12">12 Jam (Dinas Siang/Malam)</option>
          </select>
        </div>
      </div>

      {/* Inputs Grid: Intake vs Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* INTAKE COLUMN */}
        <div className="lg:col-span-4 neu-card rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-300/60 dark:border-white/10">
            <h3 className="text-xs font-black uppercase tracking-wider text-sky-600 dark:text-sky-400">
              📥 Total Cairan Masuk (Intake)
            </h3>
            <span className="text-sm font-mono font-black text-slate-900 dark:text-white">
              {Math.round(totalIntake)} mL
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Infus Intravena (mL)</label>
              <input
                type="number"
                value={infusVol}
                onChange={(e) => setInfusVol(e.target.value)}
                className="w-full p-2.5 rounded-xl neu-input font-black"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Minum / Oral (mL)</label>
              <input
                type="number"
                value={oralDrink}
                onChange={(e) => setOralDrink(e.target.value)}
                className="w-full p-2.5 rounded-xl neu-input font-black"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Makanan / Sonde NGT (mL)</label>
              <input
                type="number"
                value={oralFoodNgt}
                onChange={(e) => setOralFoodNgt(e.target.value)}
                className="w-full p-2.5 rounded-xl neu-input font-black"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Injeksi / Oplosan Obat (mL)</label>
              <input
                type="number"
                value={medsDrip}
                onChange={(e) => setMedsDrip(e.target.value)}
                className="w-full p-2.5 rounded-xl neu-input font-black"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Transfusi Darah (mL)</label>
              <input
                type="number"
                value={transfusion}
                onChange={(e) => setTransfusion(e.target.value)}
                className="w-full p-2.5 rounded-xl neu-input font-black"
              />
            </div>

            <div className="p-3 rounded-2xl neu-card-sm text-[11px] text-slate-700 dark:text-slate-200 flex justify-between font-bold">
              <span>Air Metabolisme (Otomatis):</span>
              <strong className="text-slate-900 dark:text-white font-black">{Math.round(metabolicWater)} mL</strong>
            </div>
          </div>
        </div>

        {/* OUTPUT COLUMN */}
        <div className="lg:col-span-4 neu-card rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-300/60 dark:border-white/10">
            <h3 className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
              📤 Total Cairan Keluar (Output)
            </h3>
            <span className="text-sm font-mono font-black text-slate-900 dark:text-white">
              {Math.round(totalOutput)} mL
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Urine / Kateter (mL)</label>
              <input
                type="number"
                value={urineVol}
                onChange={(e) => setUrineVol(e.target.value)}
                className="w-full p-2.5 rounded-xl neu-input font-black"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Drain Lambung / NGT / WSD (mL)</label>
              <input
                type="number"
                value={drainGastric}
                onChange={(e) => setDrainGastric(e.target.value)}
                className="w-full p-2.5 rounded-xl neu-input font-black"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Feses (mL)</label>
              <input
                type="number"
                value={stoolVol}
                onChange={(e) => setStoolVol(e.target.value)}
                className="w-full p-2.5 rounded-xl neu-input font-black"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Perdarahan Kasa / Operasi (mL)</label>
              <input
                type="number"
                value={bloodLoss}
                onChange={(e) => setBloodLoss(e.target.value)}
                className="w-full p-2.5 rounded-xl neu-input font-black"
              />
            </div>

            <div className="p-3 rounded-2xl neu-card-sm text-[11px] text-slate-700 dark:text-slate-200 space-y-1 font-bold">
              <div className="flex justify-between">
                <span>IWL Standar:</span>
                <strong className="text-slate-900 dark:text-white font-black">{Math.round(standardIwl)} mL</strong>
              </div>
              {feverIwlExtra > 0 && (
                <div className="flex justify-between text-rose-600 dark:text-rose-400 font-black">
                  <span>Ekstra Demam (+10%/°C):</span>
                  <span>+{Math.round(feverIwlExtra)} mL</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SUMMARY BALANCE & CLINICAL STATUS */}
        <div className="lg:col-span-4 space-y-5">
          <div className="neu-card rounded-3xl p-6">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Hasil Netto Balance Cairan
            </span>

            <div className="text-center py-4 my-3 rounded-2xl shadow-neu-pressed dark:shadow-neu-dark-pressed">
              <div
                className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
                  netBalance > 0
                    ? 'text-sky-600 dark:text-sky-400'
                    : netBalance < 0
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {netBalance >= 0 ? `+${Math.round(netBalance)}` : Math.round(netBalance)}
              </div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 mt-1">
                mL / {numHours} Jam
              </div>
            </div>

            <div className="p-3.5 rounded-2xl neu-card-sm text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-700 dark:text-slate-200 font-bold">
                <span>Urine Output Rate:</span>
                <span className={`font-mono font-black ${urineRate >= 0.5 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                  {urineRate.toFixed(2)} mL/kg/jam
                </span>
              </div>
              <div className="text-[11px] leading-relaxed font-bold">
                {urineRate >= 0.5 ? (
                  <span className="text-emerald-700 dark:text-emerald-400">
                    ✅ Perfusi ginjal adekuat (&ge; 0.5 mL/kg/jam).
                  </span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400">
                    ⚠️ Waspada Oliguria (&lt; 0.5 mL/kg/jam)! Periksa patensi kateter atau tanda dehidrasi.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-3xl neu-card-sm text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-bold">
            <span className="font-black text-slate-900 dark:text-white">Kaidah Klinis: </span>
            Pada pasien gagal ginjal kronik atau CHF, target balance cairan seringkali dibuat negatif ringan sesuai instruksi DPJP untuk mencegah edema paru akut.
          </div>
        </div>

      </div>

    </div>
  );
};

export default FluidBalanceCalc;
