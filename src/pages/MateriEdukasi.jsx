import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckSquare,
  Search,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { EMERGENCY_SOPS } from '../data/emergencySOP';
import DocReader from '../components/DocReader';

export const MateriEdukasi = () => {
  const [activeMainTab, setActiveMainTab] = useState('sop'); // 'sop' | 'reader'
  const [selectedSop, setSelectedSop] = useState(EMERGENCY_SOPS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedItems, setCheckedItems] = useState({});

  const filteredSops = EMERGENCY_SOPS.filter((sop) =>
    sop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sop.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sop.tandaKunci.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCheck = (idx) => {
    setCheckedItems((prev) => ({
      ...prev,
      [`${selectedSop.id}-${idx}`]: !prev[`${selectedSop.id}-${idx}`],
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shadow-neu-pressed-sm dark:shadow-neu-dark-pressed-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Edukasi & Protokol Cepat Ruangan
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
              "Jangan Panik, Lakukan Ini!" &bull; Standar Penanganan Kritis Khusus S.Kep
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex p-1.5 rounded-2xl neu-card-sm w-full sm:w-auto">
          <button
            onClick={() => setActiveMainTab('sop')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeMainTab === 'sop'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            SOP Jangan Panik!
          </button>
          <button
            onClick={() => setActiveMainTab('reader')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeMainTab === 'reader'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Reader PDF / Excel / Word
          </button>
        </div>
      </div>

      {/* TAB 1: SOP JANGAN PANIK */}
      {activeMainTab === 'sop' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Case Selector */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kegawatdaruratan (syok, kejang, henti napas)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs font-bold rounded-2xl neu-input text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-3">
              {filteredSops.map((sop) => (
                <div
                  key={sop.id}
                  onClick={() => setSelectedSop(sop)}
                  className={`p-4 rounded-3xl transition-all cursor-pointer ${
                    selectedSop.id === sop.id
                      ? 'neu-card border-l-4 border-l-rose-600 shadow-md ring-1 ring-rose-500/30'
                      : 'neu-card hover:translate-y-[-1px]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-full border border-rose-300/40">
                      {sop.badge}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      {sop.steps.length} Tindakan
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {sop.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2 mt-1 leading-snug">
                    {sop.tandaKunci}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Detailed Step by Step Protocol */}
          <div className="lg:col-span-7 neu-card rounded-3xl p-6 space-y-5">
            
            {/* Protocol Header */}
            <div className="pb-4 border-b border-slate-300/60 dark:border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow-sm">
                  {selectedSop.urgency}
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Kategori: {selectedSop.category}
                </span>
              </div>
              
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {selectedSop.title}
              </h2>

              {/* Tanda Kunci Alert Box */}
              <div className="mt-3 p-3.5 rounded-2xl bg-amber-100/90 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[11px] uppercase tracking-wider font-black text-amber-900 dark:text-amber-300">
                    Tanda Kritis Pasien:
                  </strong>
                  <span className="leading-relaxed font-semibold">{selectedSop.tandaKunci}</span>
                </div>
              </div>
            </div>

            {/* Action Sequence */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Urutan Langkah Penanganan (Jangan Panik):
              </h4>

              {selectedSop.steps.map((step) => (
                <div
                  key={step.order}
                  className={`p-4 rounded-2xl transition-all ${
                    step.isCritical
                      ? 'bg-rose-50/80 dark:bg-rose-950/50 border-2 border-rose-500/80 shadow-sm'
                      : 'neu-card-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-sm ${
                        step.isCritical
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {step.order}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-black text-slate-900 dark:text-white">
                          {step.title}
                        </h5>
                        {step.isCritical && (
                          <span className="text-[10px] font-black text-rose-700 dark:text-rose-300 uppercase tracking-widest bg-rose-200/80 dark:bg-rose-900 px-1.5 py-0.5 rounded">
                            Prioritas 1
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-200 font-medium mt-1 leading-relaxed">
                        {step.action}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Preparation Checklist */}
            <div className="pt-4 border-t border-slate-300/60 dark:border-white/10">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-2.5 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>Ceklis Alat & Kesiapan Perawat S.Kep:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedSop.ceklis.map((item, idx) => {
                  const isChecked = !!checkedItems[`${selectedSop.id}-${idx}`];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleCheck(idx)}
                      className={`p-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2 transition-all ${
                        isChecked
                          ? 'neu-btn-active text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40'
                          : 'neu-btn text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          isChecked ? 'text-emerald-600 fill-emerald-100 dark:fill-emerald-950' : 'text-slate-400'
                        }`}
                      />
                      <span className={isChecked ? 'line-through opacity-80' : ''}>
                        {item}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: READER DOKUMEN (PDF, EXCEL, WORD) */}
      {activeMainTab === 'reader' && <DocReader />}

    </div>
  );
};

export default MateriEdukasi;
