import React, { useState } from 'react';
import {
  Activity,
  Eye,
  MessageSquare,
  HandMetal,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { playTingSound } from '../utils/soundEffects';

export const GcsEwsCalc = () => {
  const { showToast } = useToast();
  const { palette } = useTheme();
  const [copied, setCopied] = useState(false);

  // GCS components
  const [eyeScore, setEyeScore] = useState(4);
  const [verbalScore, setVerbalScore] = useState(5);
  const [motorScore, setMotorScore] = useState(6);

  // Pupil
  const [pupilLeft, setPupilLeft] = useState('3mm (+) isokor');
  const [pupilRight, setPupilRight] = useState('3mm (+) isokor');

  const totalGcs = eyeScore + verbalScore + motorScore;

  let gcsCategory = 'Compos Mentis (Sadar Penuh)';
  let gcsBadgeColor = 'text-emerald-800 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300';

  if (totalGcs === 15) {
    gcsCategory = 'Compos Mentis (Sadar Penuh)';
    gcsBadgeColor = 'text-emerald-800 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300';
  } else if (totalGcs >= 13) {
    gcsCategory = 'Apatis (Acuh Tak Acuh / Mengantuk Ringan)';
    gcsBadgeColor = 'text-sky-800 bg-sky-100 dark:bg-sky-950 dark:text-sky-300';
  } else if (totalGcs >= 10) {
    gcsCategory = 'Somnolen / Letargi (Mudah Tertidur)';
    gcsBadgeColor = 'text-amber-800 bg-amber-100 dark:bg-amber-950 dark:text-amber-300';
  } else if (totalGcs >= 7) {
    gcsCategory = 'Sopor (Hanya Berespon terhadap Nyeri Kuat)';
    gcsBadgeColor = 'text-orange-800 bg-orange-100 dark:bg-orange-950 dark:text-orange-300';
  } else if (totalGcs >= 4) {
    gcsCategory = 'Semi-Koma (Refleks Sangat Menurun)';
    gcsBadgeColor = 'text-rose-800 bg-rose-100 dark:bg-rose-950 dark:text-rose-300';
  } else {
    gcsCategory = 'Koma (Tidak Berespon Sama Sekali)';
    gcsBadgeColor = 'text-rose-900 bg-rose-200 dark:bg-rose-900 dark:text-rose-100';
  }

  const eyeOptions = [
    { score: 4, label: 'Spontan (Membuka mata spontan)' },
    { score: 3, label: 'Terhadap Suara (Membuka mata saat dipanggil)' },
    { score: 2, label: 'Terhadap Nyeri (Membuka mata dengan cubitan/tekanan)' },
    { score: 1, label: 'Tidak Ada Respon (Mata tetap tertutup)' },
  ];

  const verbalOptions = [
    { score: 5, label: 'Orientasi Baik (Mengetahui waktu, tempat, nama)' },
    { score: 4, label: 'Bingung / Disorientasi (Bicara lancar tapi bingung)' },
    { score: 3, label: 'Kata-kata Tidak Tepat (Mengucapkan kata acak/inapropiat)' },
    { score: 2, label: 'Mengerang / Incomprehensible (Hanya suara tanpa kata)' },
    { score: 1, label: 'Tidak Ada Respon (Diam seribu bahasa)' },
  ];

  const motorOptions = [
    { score: 6, label: 'Mengikuti Perintah (Mengangkat tangan, menjulurkan lidah)' },
    { score: 5, label: 'Melokalisir Nyeri (Tangan menepis rangsang nyeri)' },
    { score: 4, label: 'Menarik dari Nyeri / Fleksi Normal (Withdrawal)' },
    { score: 3, label: 'Fleksi Abnormal / Dekortikasi (Tangan kaku mengepal di dada)' },
    { score: 2, label: 'Ekstensi Abnormal / Deserebrasi (Tangan kaku ekstensi lurus)' },
    { score: 1, label: 'Tidak Ada Respon (Flaksid total)' },
  ];

  const handleCopy = () => {
    const text = `[NersCalc Skoring GCS & Kesadaran]
GCS Total: ${totalGcs} (E${eyeScore}V${verbalScore}M${motorScore})
Interpretasi: ${gcsCategory}
Pupil: Kiri ${pupilLeft} / Kanan ${pupilRight}
Aplikasi NersCalc • Developer: Ari Suandi Putra`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    playTingSound();
    showToast({
      title: 'Tersalin ke Clipboard',
      message: 'Hasil skoring GCS berhasil disalin untuk laporan tindakan / EMR!',
      type: 'success',
      duration: 3000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setEyeScore(4);
    setVerbalScore(5);
    setMotorScore(6);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div
            className="p-2.5 rounded-2xl shadow-neu-pressed-sm dark:shadow-neu-dark-pressed-sm"
            style={{ backgroundColor: `${palette.primary}20`, color: palette.primary }}
          >
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Kalkulator GCS & Tingkat Kesadaran
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
              Glasgow Coma Scale (E-V-M) & Refleks Pupil Pasien Khusus S.Kep
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl neu-btn text-xs font-black text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset (E4V5M6)</span>
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl neu-btn-accent text-xs font-black flex items-center gap-1.5 shadow-md"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Salin Skoring</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Input Selection */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Eye Response */}
          <div className="neu-card rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-300/60 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" style={{ color: palette.primary }} />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Respon Membuka Mata (Eye / E)
                </h3>
              </div>
              <span
                className="font-mono font-black text-sm px-2.5 py-0.5 rounded-lg"
                style={{ backgroundColor: `${palette.primary}20`, color: palette.primary }}
              >
                E{eyeScore}
              </span>
            </div>

            <div className="space-y-1.5">
              {eyeOptions.map((opt) => (
                <button
                  key={opt.score}
                  type="button"
                  onClick={() => setEyeScore(opt.score)}
                  className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                    eyeScore === opt.score
                      ? 'neu-btn-active ring-2 shadow-sm'
                      : 'neu-btn text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  style={
                    eyeScore === opt.score
                      ? { borderColor: palette.primary, color: palette.primary }
                      : {}
                  }
                >
                  <span>{opt.label}</span>
                  <span className="font-mono font-black ml-2">Score {opt.score}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Verbal Response */}
          <div className="neu-card rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-300/60 dark:border-white/10">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Respon Verbal (Verbal / V)
                </h3>
              </div>
              <span className="font-mono font-black text-sm text-sky-700 bg-sky-100 dark:bg-sky-950 dark:text-sky-300 px-2.5 py-0.5 rounded-lg">
                V{verbalScore}
              </span>
            </div>

            <div className="space-y-1.5">
              {verbalOptions.map((opt) => (
                <button
                  key={opt.score}
                  type="button"
                  onClick={() => setVerbalScore(opt.score)}
                  className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                    verbalScore === opt.score
                      ? 'neu-btn-active ring-2 border-sky-500 text-sky-600 shadow-sm'
                      : 'neu-btn text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className="font-mono font-black ml-2">Score {opt.score}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Motor Response */}
          <div className="neu-card rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-300/60 dark:border-white/10">
              <div className="flex items-center gap-2">
                <HandMetal className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Respon Motorik (Motor / M)
                </h3>
              </div>
              <span className="font-mono font-black text-sm text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 rounded-lg">
                M{motorScore}
              </span>
            </div>

            <div className="space-y-1.5">
              {motorOptions.map((opt) => (
                <button
                  key={opt.score}
                  type="button"
                  onClick={() => setMotorScore(opt.score)}
                  className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                    motorScore === opt.score
                      ? 'neu-btn-active ring-2 border-amber-500 text-amber-600 shadow-sm'
                      : 'neu-btn text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className="font-mono font-black ml-2">Score {opt.score}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Summary Score & Quick Pupil */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Total GCS Display */}
          <div className="neu-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Total Skor Kesadaran
              </span>
              <span className="font-mono font-black text-xs text-slate-500">
                Rentang: 3 - 15
              </span>
            </div>

            <div className="text-center py-4 rounded-2xl shadow-neu-pressed dark:shadow-neu-dark-pressed">
              <div className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {totalGcs}
              </div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-500 mt-1">
                E{eyeScore} V{verbalScore} M{motorScore}
              </div>
              <div className={`mt-3 inline-block px-3.5 py-1 rounded-full text-xs font-black ${gcsBadgeColor} shadow-sm border border-slate-300/40 dark:border-white/10`}>
                {gcsCategory}
              </div>
            </div>

            {/* Quick Action Protocol */}
            <div className="mt-4 p-3.5 rounded-2xl neu-card-sm text-xs space-y-1.5 font-bold">
              <p className="font-black text-slate-900 dark:text-white">Rekomendasi Klinis:</p>
              {totalGcs <= 8 ? (
                <p className="text-rose-600 font-bold leading-relaxed">
                  ⚠️ GCS &le; 8: Pasien berisiko gagal napas / kehilangan proteksi jalan napas. Segera lapor DPJP, amankan airway, dan siapkan transfer ICU.
                </p>
              ) : totalGcs <= 12 ? (
                <p className="text-amber-600 font-bold leading-relaxed">
                  ⚠️ GCS 9 - 12: Penurunan kesadaran sedang. Observasi ketat TTV tiap 1-2 jam, pertahankan SpO2 &gt; 95%, dan pantau tanda TTIK.
                </p>
              ) : (
                <p className="font-bold leading-relaxed" style={{ color: palette.primary }}>
                  ✅ GCS 13 - 15: Kesadaran relatif stabil. Lanjutkan observasi rutin sesuai protokol ruangan dan pantau tanda-tanda vital per shift.
                </p>
              )}
            </div>
          </div>

          {/* Pupil Reflex Checker */}
          <div className="neu-card rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white pb-2 border-b border-slate-300/60 dark:border-white/10">
              Pemeriksaan Pupil & Refleks Cahaya
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Pupil Kiri</label>
                <select
                  value={pupilLeft}
                  onChange={(e) => setPupilLeft(e.target.value)}
                  className="w-full p-2.5 rounded-xl neu-input font-black text-slate-900 dark:text-white text-xs"
                >
                  <option value="3mm (+) isokor">3mm (+) Isokor</option>
                  <option value="2mm (+) miosis">2mm (+) Miosis</option>
                  <option value="4mm (+) isokor">4mm (+) Isokor</option>
                  <option value="5mm (-) midriasis">5mm (-) Midriasis</option>
                  <option value="Anisokor Kiri > Kanan">Anisokor (L &gt; R)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Pupil Kanan</label>
                <select
                  value={pupilRight}
                  onChange={(e) => setPupilRight(e.target.value)}
                  className="w-full p-2.5 rounded-xl neu-input font-black text-slate-900 dark:text-white text-xs"
                >
                  <option value="3mm (+) isokor">3mm (+) Isokor</option>
                  <option value="2mm (+) miosis">2mm (+) Miosis</option>
                  <option value="4mm (+) isokor">4mm (+) Isokor</option>
                  <option value="5mm (-) midriasis">5mm (-) Midriasis</option>
                  <option value="Anisokor Kanan > Kiri">Anisokor (R &gt; L)</option>
                </select>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default GcsEwsCalc;
