import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Plus,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { playTingSound } from '../utils/soundEffects';

const STORAGE_KEY = 'nerscalc_sbar_notes';

const DEFAULT_NOTE = {
  id: '1',
  bed: 'Bed 04 - Ruang Melati',
  patientName: 'pak budi (48 th)',
  diagnosis: 'Post Laparatomi Akut Abdomen H+1',
  situation: 'Nyeri luka operasi VAS 4/10, urin via kateter 80cc/jam kuning jernih.',
  background: 'Riwayat appendisitis perforasi, operasi cito kemarin malam. Alergi: Tidak ada. Infus RL 20 TPM lancar di tangan kiri.',
  assessment: 'TD 125/82 mmHg, Nadi 84x/m, RR 18x/m, Suhu 36.8C, SpO2 98% room air. GCS 15 E4V5M6. Abdomen soepel, bising usus (+).',
  recommendation: 'Injeksi Ketorolac 30mg jam 14:00, ganti balutan luka besok pagi, mobilisasi miring kiri-kanan.',
  updatedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
};

export const SbarNotes = () => {
  const { showToast } = useToast();
  const { palette } = useTheme();
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState('1');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotes(parsed);
        if (parsed.length > 0) setActiveNoteId(parsed[0].id);
      } else {
        setNotes([DEFAULT_NOTE]);
        setActiveNoteId(DEFAULT_NOTE.id);
      }
    } catch {
      setNotes([DEFAULT_NOTE]);
    }
  }, []);

  const saveToStorage = (updatedNotes) => {
    setNotes(updatedNotes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  };

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0] || DEFAULT_NOTE;

  const updateActiveField = (field, value) => {
    const updated = notes.map((n) => {
      if (n.id === activeNote.id) {
        return {
          ...n,
          [field]: value,
          updatedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return n;
    });
    saveToStorage(updated);
  };

  const handleAddNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      bed: `Bed ${notes.length + 1}`,
      patientName: 'Pasien Baru',
      diagnosis: 'Diagnosa Medis',
      situation: '',
      background: '',
      assessment: '',
      recommendation: '',
      updatedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = [...notes, newNote];
    saveToStorage(updated);
    setActiveNoteId(newNote.id);
    showToast({
      title: 'Pasien Ditambahkan',
      message: 'Lembar SBAR baru berhasil dibuat untuk timbang terima.',
      type: 'success',
      duration: 2500,
    });
  };

  const handleDeleteNote = (id) => {
    if (notes.length <= 1) {
      showToast({
        title: 'Perhatian',
        message: 'Minimal sisakan 1 formulir pasien.',
        type: 'error',
        duration: 2500,
      });
      return;
    }
    const filtered = notes.filter((n) => n.id !== id);
    saveToStorage(filtered);
    setActiveNoteId(filtered[0].id);
    showToast({
      title: 'Dihapus',
      message: 'Lembar operan pasien telah dihapus.',
      type: 'info',
      duration: 2000,
    });
  };

  const handleCopySbar = () => {
    const text = `📋 [OPERAN TIMBANG TERIMA SHIFT - SBAR]
📍 Lokasi / Bed: ${activeNote.bed}
👤 Pasien: ${activeNote.patientName}
🏥 Diagnosa: ${activeNote.diagnosis}

🔹 SITUATION (S):
${activeNote.situation || '-'}

🔹 BACKGROUND (B):
${activeNote.background || '-'}

🔹 ASSESSMENT (A):
${activeNote.assessment || '-'}

🔹 RECOMMENDATION (R):
${activeNote.recommendation || '-'}

⏰ Dicatat: Jam ${activeNote.updatedAt} WIB via NersCalc (Developer: Ari Suandi Putra)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    playTingSound();
    showToast({
      title: 'Format SBAR Tersalin',
      message: 'Format operan shift siap dikirim ke grup tim jaga perawat!',
      type: 'success',
      duration: 3500,
    });
    setTimeout(() => setCopied(false), 2000);
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
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Operan Shift & Catatan SBAR
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
              Standar Komunikasi Efektif Antar-Perawat S.Kep Saat Timbang Terima
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleAddNewNote}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl neu-btn text-xs font-black text-slate-900 dark:text-white flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" style={{ color: palette.primary }} />
            <span>Tambah Pasien</span>
          </button>

          <button
            onClick={handleCopySbar}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl neu-btn-accent text-xs font-black flex items-center justify-center gap-1.5 shadow-md"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Salin Format SBAR</span>
          </button>
        </div>
      </div>

      {/* Patient Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {notes.map((n) => (
          <button
            key={n.id}
            onClick={() => setActiveNoteId(n.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-black shrink-0 transition-all ${
              activeNoteId === n.id
                ? 'neu-btn-active ring-2 shadow-sm'
                : 'neu-btn text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            style={
              activeNoteId === n.id
                ? { borderColor: palette.primary, color: palette.primary }
                : {}
            }
          >
            {n.bed || 'Bed Pasien'} &bull; <span className="font-semibold">{n.patientName.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* SBAR Editor Box */}
      <div className="neu-card rounded-3xl p-6 space-y-5">
        
        {/* Bed & Patient Identity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-300/60 dark:border-white/10">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Nomor Bed / Ruangan
            </label>
            <input
              type="text"
              value={activeNote.bed || ''}
              onChange={(e) => updateActiveField('bed', e.target.value)}
              placeholder="Bed 01 Ruang Aster"
              className="w-full px-3.5 py-2.5 text-xs font-black text-slate-900 dark:text-white rounded-xl neu-input"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Nama Pasien & Usia
            </label>
            <input
              type="text"
              value={activeNote.patientName || ''}
              onChange={(e) => updateActiveField('patientName', e.target.value)}
              placeholder="Tn. Ahmad (52 th)"
              className="w-full px-3.5 py-2.5 text-xs font-black text-slate-900 dark:text-white rounded-xl neu-input"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Diagnosa Medis
            </label>
            <input
              type="text"
              value={activeNote.diagnosis || ''}
              onChange={(e) => updateActiveField('diagnosis', e.target.value)}
              placeholder="Contoh: DHF Grade II / Dyspnea"
              className="w-full px-3.5 py-2.5 text-xs font-black text-slate-900 dark:text-white rounded-xl neu-input"
            />
          </div>
        </div>

        {/* S-B-A-R Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* S - Situation */}
          <div className="p-4 rounded-2xl neu-card-sm space-y-2">
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-lg text-white font-black text-xs flex items-center justify-center shadow-sm"
                style={{ backgroundColor: palette.primary }}
              >
                S
              </span>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Situation (Kondisi Terkini)
              </h3>
            </div>
            <textarea
              rows="3"
              value={activeNote.situation || ''}
              onChange={(e) => updateActiveField('situation', e.target.value)}
              placeholder="Keluhan utama saat ini, alasan dirawat, atau masalah prioritas terkini..."
              className="w-full p-3 text-xs font-bold text-slate-900 dark:text-white rounded-xl neu-input resize-none"
            />
          </div>

          {/* B - Background */}
          <div className="p-4 rounded-2xl neu-card-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                B
              </span>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Background (Riwayat / Latar Belakang)
              </h3>
            </div>
            <textarea
              rows="3"
              value={activeNote.background || ''}
              onChange={(e) => updateActiveField('background', e.target.value)}
              placeholder="Riwayat penyakit penyerta, tindakan operasi, alergi obat, infus yang sedang terpasang..."
              className="w-full p-3 text-xs font-bold text-slate-900 dark:text-white rounded-xl neu-input resize-none"
            />
          </div>

          {/* A - Assessment */}
          <div className="p-4 rounded-2xl neu-card-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                A
              </span>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Assessment (TTV & Hasil Lab Terkini)
              </h3>
            </div>
            <textarea
              rows="3"
              value={activeNote.assessment || ''}
              onChange={(e) => updateActiveField('assessment', e.target.value)}
              placeholder="Hasil TTV terkini (TD, Nadi, RR, Suhu, SpO2, GCS), hasil lab kritis, drain, urine output..."
              className="w-full p-3 text-xs font-bold text-slate-900 dark:text-white rounded-xl neu-input resize-none"
            />
          </div>

          {/* R - Recommendation */}
          <div className="p-4 rounded-2xl neu-card-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                R
              </span>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Recommendation (Rencana Shift Selanjutnya)
              </h3>
            </div>
            <textarea
              rows="3"
              value={activeNote.recommendation || ''}
              onChange={(e) => updateActiveField('recommendation', e.target.value)}
              placeholder="Tindakan yang perlu dilanjutkan shift berikutnya, jadwal obat, rencana konsul DPJP, persiapan puasa/rontgen..."
              className="w-full p-3 text-xs font-bold text-slate-900 dark:text-white rounded-xl neu-input resize-none"
            />
          </div>

        </div>

        {/* Footer info & delete button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-300/60 dark:border-white/10 text-xs">
          <span className="text-slate-600 dark:text-slate-300 text-[11px] font-bold">
            Otomatis tersimpan &bull; Terakhir diubah {activeNote.updatedAt} WIB &bull; &copy; Ari Suandi Putra (Developer)
          </span>

          <button
            onClick={() => handleDeleteNote(activeNote.id)}
            className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-black px-2.5 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Pasien Ini</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default SbarNotes;
