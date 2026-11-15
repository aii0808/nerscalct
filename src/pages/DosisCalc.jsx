import React, { useState } from 'react';
import {
  Syringe,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { playTingSound } from '../utils/soundEffects';

export const DosisCalc = () => {
  const { showToast } = useToast();
  const { palette } = useTheme();
  const [activeTab, setActiveTab] = useState('syringe'); // 'syringe' | 'vial' | 'pediatric'
  const [copied, setCopied] = useState(false);

  // 1. Syringe Pump States (mcg/kgBB/menit)
  const [syringeDrug, setSyringeDrug] = useState('norepi');
  const [doseMcg, setDoseMcg] = useState('0.1'); // mcg/kgBB/menit
  const [patientWeight, setPatientWeight] = useState('60'); // kg
  const [totalDrugMg, setTotalDrugMg] = useState('4'); // mg in syringe
  const [syringeVolume, setSyringeVolume] = useState('50'); // mL (biasanya spuit 50cc)

  // 2. Sediaan Vial & Ampul States
  const [orderDose, setOrderDose] = useState('500'); // mg
  const [vialDose, setVialDose] = useState('1000'); // mg
  const [solventVolume, setSolventVolume] = useState('10'); // mL pelarut (WFI / NaCl)
  const [drugUnit, setDrugUnit] = useState('mg');

  // 3. Pediatrik mg/kgBB States
  const [pediaDosePerKg, setPediaDosePerKg] = useState('15'); // misal Paracetamol 10-15 mg/kgBB
  const [pediaWeight, setPediaWeight] = useState('12'); // kg anak
  const [pediaFreq, setPediaFreq] = useState('3'); // 3x sehari
  const [pediaSyrupConc, setPediaSyrupConc] = useState('120'); // mg per 5 mL
  const [pediaSyrupVol, setPediaSyrupVol] = useState('5'); // mL

  // Presets Syringe Pump
  const applySyringePreset = (drugKey) => {
    setSyringeDrug(drugKey);
    if (drugKey === 'norepi') {
      setTotalDrugMg('4');
      setSyringeVolume('50');
      setDoseMcg('0.1');
    } else if (drugKey === 'dopamin') {
      setTotalDrugMg('200');
      setSyringeVolume('50');
      setDoseMcg('5');
    } else if (drugKey === 'dobutamin') {
      setTotalDrugMg('250');
      setSyringeVolume('50');
      setDoseMcg('5');
    } else if (drugKey === 'nicardipine') {
      setTotalDrugMg('10');
      setSyringeVolume('50');
      setDoseMcg('1');
    }
  };

  const applyVialPreset = (preset) => {
    setOrderDose(String(preset.order));
    setVialDose(String(preset.vial));
    setSolventVolume(String(preset.solvent));
    setDrugUnit(preset.unit || 'mg');
  };

  // Calculations
  const numTotalDrugMg = Number(totalDrugMg) || 0;
  const numSyringeVol = Number(syringeVolume) || 1;
  const numDoseMcg = Number(doseMcg) || 0;
  const numBB = Number(patientWeight) || 0;

  const totalMcg = numTotalDrugMg * 1000;
  const concentrationMcgPerMl = numSyringeVol > 0 ? totalMcg / numSyringeVol : 0;
  const syringePumpRate =
    concentrationMcgPerMl > 0 ? (numDoseMcg * numBB * 60) / concentrationMcgPerMl : 0;

  const numOrderDose = Number(orderDose) || 0;
  const numVialDose = Number(vialDose) || 1;
  const numSolvent = Number(solventVolume) || 0;
  const volumeToDraw = numVialDose > 0 ? (numOrderDose / numVialDose) * numSolvent : 0;

  const numPediaDose = Number(pediaDosePerKg) || 0;
  const numPediaBB = Number(pediaWeight) || 0;
  const singleDoseMg = numPediaDose * numPediaBB;
  const dailyDoseMg = singleDoseMg * (Number(pediaFreq) || 1);
  const numSyrupConc = Number(pediaSyrupConc) || 1;
  const numSyrupVol = Number(pediaSyrupVol) || 5;
  const syrupMlPerDose = numSyrupConc > 0 ? (singleDoseMg / numSyrupConc) * numSyrupVol : 0;

  const copyResult = () => {
    let text = '';
    if (activeTab === 'syringe') {
      text = `[NersCalc Syringe Pump]\nTarget Dosis: ${numDoseMcg} mcg/kgBB/menit (BB: ${numBB} kg)\nSediaan: ${numTotalDrugMg} mg dalam ${numSyringeVol} mL (Konsentrasi: ${concentrationMcgPerMl} mcg/mL)\nKecepatan Syringe Pump: ${syringePumpRate.toFixed(2)} mL/jam (cc/jam)\nAplikasi NersCalc • Developer: Ari Suandi Putra`;
    } else if (activeTab === 'vial') {
      text = `[NersCalc Oplos Sediaan Vial/Ampul]\nDosis Order: ${numOrderDose} ${drugUnit}\nSediaan Vial: ${numVialDose} ${drugUnit} dalam ${numSolvent} mL pelarut\nVolume yang Disedot: ${volumeToDraw.toFixed(2)} mL\nAplikasi NersCalc • Developer: Ari Suandi Putra`;
    } else {
      text = `[NersCalc Dosis Pediatrik]\nBB Anak: ${numPediaBB} kg (Dosis: ${numPediaDose} mg/kgBB)\nDosis Per Kali: ${singleDoseMg.toFixed(1)} mg (${syrupMlPerDose.toFixed(1)} mL sirup)\nFrekuensi: ${pediaFreq}x sehari (Total: ${dailyDoseMg.toFixed(1)} mg/hari)\nAplikasi NersCalc • Developer: Ari Suandi Putra`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    playTingSound();
    showToast({
      title: 'Tersalin ke Clipboard',
      message: 'Perhitungan dosis obat berhasil disalin!',
      type: 'success',
      duration: 3000,
    });
    setTimeout(() => setCopied(false), 2000);
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
              <Syringe className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Kalkulator Dosis & Oplos Obat
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
                Syringe Pump Vasoaktif, Pelarutan Vial/Ampul & Dosis Pediatrik Akurat S.Kep
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex p-1.5 rounded-2xl neu-card-sm w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('syringe')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'syringe'
                ? 'neu-btn-active text-white'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            style={activeTab === 'syringe' ? { backgroundColor: palette.primary } : {}}
          >
            Syringe Pump
          </button>
          <button
            onClick={() => setActiveTab('vial')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'vial'
                ? 'neu-btn-active text-white'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            style={activeTab === 'vial' ? { backgroundColor: palette.primary } : {}}
          >
            Oplos Vial/Ampul
          </button>
          <button
            onClick={() => setActiveTab('pediatric')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'pediatric'
                ? 'neu-btn-active text-white'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            style={activeTab === 'pediatric' ? { backgroundColor: palette.primary } : {}}
          >
            Dosis Anak
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs */}
        <div className="lg:col-span-7 neu-card rounded-3xl p-6 space-y-5">
          
          {/* TAB 1: SYRINGE PUMP */}
          {activeTab === 'syringe' && (
            <>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
                  Preset Obat Vasoaktif Populer
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'norepi', label: 'Norepinefrin', sub: '4mg / 50mL' },
                    { key: 'dopamin', label: 'Dopamin', sub: '200mg / 50mL' },
                    { key: 'dobutamin', label: 'Dobutamin', sub: '250mg / 50mL' },
                    { key: 'nicardipine', label: 'Nicardipine', sub: '10mg / 50mL' },
                  ].map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => applySyringePreset(p.key)}
                      className={`p-2.5 rounded-2xl text-left transition-all ${
                        syringeDrug === p.key
                          ? 'neu-btn-active ring-2'
                          : 'neu-btn text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      style={
                        syringeDrug === p.key
                          ? { borderColor: palette.primary, color: palette.primary }
                          : {}
                      }
                    >
                      <p className="text-xs font-black truncate">{p.label}</p>
                      <p className="text-[10px] font-mono font-bold">{p.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
                    Dosis Order Dokter
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={doseMcg}
                      onChange={(e) => setDoseMcg(e.target.value)}
                      placeholder="0.1"
                      className="w-full px-4 py-3 text-base font-black text-slate-900 dark:text-white rounded-2xl neu-input pr-28"
                    />
                    <span className="absolute right-3.5 top-3.5 text-[11px] font-black text-slate-500">
                      mcg/kg/mnt
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
                    Berat Badan Pasien (BB)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      value={patientWeight}
                      onChange={(e) => setPatientWeight(e.target.value)}
                      placeholder="60"
                      className="w-full px-4 py-3 text-base font-black text-slate-900 dark:text-white rounded-2xl neu-input pr-14"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs font-black text-slate-500">
                      kg
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
                    Jumlah Obat dalam Spuit
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={totalDrugMg}
                      onChange={(e) => setTotalDrugMg(e.target.value)}
                      placeholder="4"
                      className="w-full px-4 py-3 text-base font-black text-slate-900 dark:text-white rounded-2xl neu-input pr-14"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs font-black text-slate-500">
                      mg
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
                    Volume Larutan (Ukuran Spuit)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={syringeVolume}
                      onChange={(e) => setSyringeVolume(e.target.value)}
                      placeholder="50"
                      className="w-full px-4 py-3 text-base font-black text-slate-900 dark:text-white rounded-2xl neu-input pr-14"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs font-black text-slate-500">
                      mL (cc)
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: VIAL & AMPUL */}
          {activeTab === 'vial' && (
            <>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
                  Preset Obat Injeksi Rumah Sakit
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Ceftriaxone 500mg', order: 500, vial: 1000, solvent: 10, unit: 'mg' },
                    { label: 'Omeprazole 40mg', order: 40, vial: 40, solvent: 10, unit: 'mg' },
                    { label: 'Furosemide 10mg', order: 10, vial: 20, solvent: 2, unit: 'mg' },
                    { label: 'Ondansetron 4mg', order: 4, vial: 4, solvent: 2, unit: 'mg' },
                    { label: 'Ketorolac 15mg', order: 15, vial: 30, solvent: 1, unit: 'mg' },
                    { label: 'Ranitidine 50mg', order: 50, vial: 50, solvent: 2, unit: 'mg' },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyVialPreset(p)}
                      className="p-2 rounded-xl neu-btn text-left text-xs font-black text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    >
                      <p className="truncate">{p.label}</p>
                      <span className="text-[10px] font-mono font-bold" style={{ color: palette.primary }}>
                        vial {p.vial}{p.unit}/{p.solvent}mL
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
                  Dosis yang Diorder Dokter
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={orderDose}
                    onChange={(e) => setOrderDose(e.target.value)}
                    placeholder="Contoh: 500"
                    className="w-full px-4 py-3 text-base font-black text-slate-900 dark:text-white rounded-2xl neu-input pr-14"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-black text-slate-500">
                    {drugUnit}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
                    Sediaan Kemasan Vial / Ampul
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={vialDose}
                      onChange={(e) => setVialDose(e.target.value)}
                      placeholder="1000"
                      className="w-full px-4 py-3 text-base font-black text-slate-900 dark:text-white rounded-2xl neu-input pr-14"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs font-black text-slate-500">
                      {drugUnit}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
                    Volume Pelarut (Aquabidest/NaCl)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={solventVolume}
                      onChange={(e) => setSolventVolume(e.target.value)}
                      placeholder="10"
                      className="w-full px-4 py-3 text-base font-black text-slate-900 dark:text-white rounded-2xl neu-input pr-14"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs font-black text-slate-500">
                      mL
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 3: PEDIATRIC DOSAGE */}
          {activeTab === 'pediatric' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
                    Dosis Rekomendasi (mg/kgBB)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      value={pediaDosePerKg}
                      onChange={(e) => setPediaDosePerKg(e.target.value)}
                      placeholder="10 - 15"
                      className="w-full px-4 py-3 text-base font-black text-slate-900 dark:text-white rounded-2xl neu-input pr-24"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs font-black text-slate-500">
                      mg/kgBB
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
                    Berat Badan Anak (kg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={pediaWeight}
                      onChange={(e) => setPediaWeight(e.target.value)}
                      placeholder="12"
                      className="w-full px-4 py-3 text-base font-black text-slate-900 dark:text-white rounded-2xl neu-input pr-14"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs font-black text-slate-500">
                      kg
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
                  Konsentrasi Sediaan Sirup
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      value={pediaSyrupConc}
                      onChange={(e) => setPediaSyrupConc(e.target.value)}
                      className="w-full px-4 py-3 text-base font-black text-slate-900 dark:text-white rounded-2xl neu-input pr-14"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs font-black text-slate-500">
                      mg
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={pediaSyrupVol}
                      onChange={(e) => setPediaSyrupVol(e.target.value)}
                      className="w-full px-4 py-3 text-base font-black text-slate-900 dark:text-white rounded-2xl neu-input pr-14"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs font-black text-slate-500">
                      tiap mL
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-300/60 dark:border-white/10">
            <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">
              *Verifikasi selalu dengan rekan sejawat (Double Check)
            </span>

            <button
              onClick={copyResult}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl neu-btn-accent text-xs font-black shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Perhitungan'}</span>
            </button>
          </div>

        </div>

        {/* Right Output Card */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="neu-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                {activeTab === 'syringe'
                  ? 'Kecepatan Syringe Pump'
                  : activeTab === 'vial'
                  ? 'Volume Spuit yang Diambil'
                  : 'Dosis Pediatrik Terhitung'}
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full font-black text-[10px]"
                style={{ backgroundColor: `${palette.primary}20`, color: palette.primary }}
              >
                S.Kep Akurat
              </span>
            </div>

            {/* TAB 1 RESULT */}
            {activeTab === 'syringe' && (
              <div className="space-y-4">
                <div className="text-center py-4 rounded-2xl shadow-neu-pressed">
                  <div
                    className="text-4xl sm:text-5xl font-black font-mono tracking-tight"
                    style={{ color: palette.primary }}
                  >
                    {syringePumpRate.toFixed(2)}
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-500 mt-1">
                    mL / Jam (cc / jam)
                  </div>
                  <div className="text-xs font-bold mt-1" style={{ color: palette.primary }}>
                    Set pada tombol syringe pump elektrik
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl neu-card-sm space-y-2 text-xs font-bold">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Konsentrasi Larutan:</span>
                    <span className="font-mono font-black text-slate-900 dark:text-white">{concentrationMcgPerMl.toFixed(1)} mcg/mL</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Kebutuhan Pasien / Menit:</span>
                    <span className="font-mono font-black text-slate-900 dark:text-white">{(numDoseMcg * numBB).toFixed(2)} mcg/mnt</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Total Kebutuhan / Jam:</span>
                    <span className="font-mono font-black text-slate-900 dark:text-white">{(numDoseMcg * numBB * 60).toFixed(1)} mcg/jam</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2 RESULT */}
            {activeTab === 'vial' && (
              <div className="space-y-4">
                <div className="text-center py-4 rounded-2xl shadow-neu-pressed">
                  <div
                    className="text-4xl sm:text-5xl font-black font-mono tracking-tight"
                    style={{ color: palette.primary }}
                  >
                    {volumeToDraw.toFixed(2)}
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-500 mt-1">
                    mL yang Harus Ditarik Spuit
                  </div>
                  <div className="text-xs font-bold mt-1" style={{ color: palette.primary }}>
                    Dari {numSolvent} mL total larutan vial
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl neu-card-sm space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-bold">
                  <p className="font-black text-slate-900 dark:text-white">Langkah Eksekusi:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px] leading-relaxed">
                    <li>Larutkan vial {numVialDose}{drugUnit} dengan {numSolvent} mL aquabidest/NaCl 0.9%.</li>
                    <li>Kocok hingga homogen dan jernih tanpa gumpalan serbuk.</li>
                    <li>Tarik tepat <strong className="text-emerald-600 dark:text-emerald-400">{volumeToDraw.toFixed(2)} mL</strong> ke dalam spuit steril.</li>
                    <li>Beri label identitas pasien, nama obat, dosis, dan tanggal/jam oplos.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* TAB 3 RESULT */}
            {activeTab === 'pediatric' && (
              <div className="space-y-4">
                <div className="text-center py-4 rounded-2xl shadow-neu-pressed">
                  <div
                    className="text-3xl sm:text-4xl font-black font-mono tracking-tight"
                    style={{ color: palette.primary }}
                  >
                    {singleDoseMg.toFixed(1)} mg
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-500 mt-1">
                    Dosis Per Kali Pemberian
                  </div>
                  <div className="text-sm font-bold mt-1" style={{ color: palette.primary }}>
                    Setara {syrupMlPerDose.toFixed(2)} mL Sirup
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl neu-card-sm space-y-2 text-xs font-bold">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Total Dosis Per Hari:</span>
                    <span className="font-mono font-black text-slate-900 dark:text-white">{dailyDoseMg.toFixed(1)} mg / 24 jam</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Aturan Pakai:</span>
                    <span className="font-black text-slate-900 dark:text-white">{pediaFreq}x sehari ({Math.round(24 / (Number(pediaFreq) || 1))} jam sekali)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Safety Alert Warning */}
          <div className="neu-card rounded-3xl p-5 border border-rose-300 dark:border-rose-900/60 bg-rose-100/60 dark:bg-rose-950/40">
            <div className="flex items-center gap-2 mb-2 text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                Protokol Obat High Alert (HAM)
              </h4>
            </div>
            <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed font-bold">
              Obat inotropik dan vasoaktif memiliki indeks terapi sempit. Pastikan patensi jalur infus intravena (IV line) lancar, tidak ekstravasasi, dan gunakan jalur terdedikasi bila memungkinkan.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default DosisCalc;
