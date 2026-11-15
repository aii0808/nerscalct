import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import {
  FileSpreadsheet,
  Upload,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  BookOpen,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

// Built-in clinical reference documents ready to explore
const PRELOADED_DOCS = [
  {
    id: 'lab-normal',
    title: 'Tabel Nilai Rujukan Laboratorium Kritis',
    category: 'Laboratorium & Diagnostik',
    type: 'excel',
    size: '18 KB',
    description: 'Nilai batas normal & rentang kritis Hb, Leukosit, Trombosit, Elektrolit, GDS, dan Ureum/Kreatinin.',
    data: [
      { Parameter: 'Hemoglobin (Hb)', NilaiNormal: '12.0 - 16.0 g/dL (Wanita) / 13.5 - 17.5 g/dL (Pria)', BatasKritis: '< 7.0 g/dL (Indikasi PRC) atau > 20.0 g/dL', TindakanPerawat: 'Laporkan DPJP, siapkan crossmatch darah & transfusi' },
      { Parameter: 'Leukosit (WBC)', NilaiNormal: '4.500 - 11.000 /uL', BatasKritis: '< 2.000 (Leukopenia berat) atau > 30.000 (Sepsis/Leukemia)', TindakanPerawat: 'Isolasi protektif jika neutropenia, pantau suhu tiap 2 jam' },
      { Parameter: 'Trombosit (PLT)', NilaiNormal: '150.000 - 450.000 /uL', BatasKritis: '< 20.000 /uL (Risiko perdarahan spontan)', TindakanPerawat: 'Bedrest total, hindari injeksi IM, sikat gigi lembut' },
      { Parameter: 'Kalium (K+)', NilaiNormal: '3.5 - 5.0 mEq/L', BatasKritis: '< 2.8 mEq/L (Aritmia berat) atau > 6.0 mEq/L (Henti jantung)', TindakanPerawat: 'Pasang EKG monitor! Koreksi KCl via drip pelan atau Ca Glukonat' },
      { Parameter: 'Natrium (Na+)', NilaiNormal: '135 - 145 mEq/L', BatasKritis: '< 120 mEq/L (Kejang/Edema otak) atau > 160 mEq/L', TindakanPerawat: 'Koreksi NaCl 3% lambat, pantau ketat tingkat kesadaran GCS' },
      { Parameter: 'GDS (Glukosa Sewaktu)', NilaiNormal: '80 - 140 mg/dL', BatasKritis: '< 54 mg/dL (Koma hipo) atau > 500 mg/dL (KAD / HHS)', TindakanPerawat: 'Bolus D40% 2 ampul jika hipo; rehidrasi NaCl + insulin drip jika hiper' },
      { Parameter: 'Analisa Gas Darah (pH)', NilaiNormal: '7.35 - 7.45', BatasKritis: '< 7.20 (Asidosis berat) atau > 7.60 (Alkalosis berat)', TindakanPerawat: 'Beri ventilasi/O2, siapkan koreksi Meylon (Bicnat) sesuai order DPJP' },
    ]
  },
  {
    id: 'sop-kcl',
    title: 'SOP Pemberian Elektrolit Pekat (KCl 7.46% & NaCl 3%)',
    category: 'Prosedur Keperawatan',
    type: 'word',
    size: '24 KB',
    description: 'Panduan standar keselamatan pemberian kalium klorida pekat intravena agar terhindar dari henti jantung iatrogenik.',
    content: `
      <h2>STANDAR OPERASIONAL PROSEDUR: PEMBERIAN ELEKTROLIT PEKAT</h2>
      <p><strong>Status:</strong> Standar Akreditasi KARS / High Alert Medication (HAM)</p>
      <hr/>
      <h3>1. PRINSIP UTAMA KESELAMATAN (SAFETY RULES)</h3>
      <p>❌ <strong>DILARANG KERAS</strong> menyuntikkan KCl 7.46% secara bolus langsung atau push IV tanpa pengenceran! Injeksi bolus Kalium langsung menyebabkan asistol (henti jantung seketika).</p>
      <p>✅ KCl 7.46% WAJIB selalu dilarutkan ke dalam cairan infus pemeliharaan (NaCl 0.9% atau RL minimal 500 mL) atau diberikan menggunakan Syringe Pump dengan pengenceran terstandar.</p>

      <h3>2. KONSENTRASI DAN KECEPATAN MAKSIMAL</h3>
      <ul>
        <li><strong>Jalur Vena Perifer:</strong> Konsentrasi maksimal kalium adalah 40 mEq/L dalam botol infus (sekitar 1 ampul KCl 25 mEq dalam 500 mL NaCl 0.9%). Kecepatan infus perifer maksimal 10 mEq/jam.</li>
        <li><strong>Jalur Vena Sentral (CVC):</strong> Konsentrasi maksimal 80 mEq/L dengan kecepatan maksimal 20 mEq/jam, WAJIB dipantau menggunakan monitor irama EKG kontinu.</li>
      </ul>

      <h3>3. LANGKAH DOUBLE CHECK SEBELUM PEMBERIAN</h3>
      <ol>
        <li>Dua orang perawat (S.Kep) secara mandiri memverifikasi identitas pasien, instruksi tertulis DPJP, hasil kalium lab terkini, dan botol pengenceran.</li>
        <li>Beri label merah terang "HIGH ALERT - ELEKTROLIT PEKAT" pada botol infus yang telah dioplos.</li>
        <li>Pastikan insersi jarum infus paten, tidak bengkak, dan tidak ada tanda-tanda phlebitis sebelum kolf dibuka.</li>
      </ol>
    `
  }
];

export const DocReader = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'view'
  const [selectedDoc, setSelectedDoc] = useState(PRELOADED_DOCS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileContent, setFileContent] = useState(null);
  const [fileType, setFileType] = useState('excel');
  const [activeSheetName, setActiveSheetName] = useState('');
  const [sheetNames, setSheetNames] = useState([]);
  const [parsedSheets, setParsedSheets] = useState({});
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle uploaded file
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setFileName(file.name);

    const ext = file.name.split('.').pop().toLowerCase();

    try {
      if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const bstr = evt.target.result;
          const workbook = XLSX.read(bstr, { type: 'binary' });
          const sheets = {};
          workbook.SheetNames.forEach((sheet) => {
            const rowData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
            sheets[sheet] = rowData;
          });
          setSheetNames(workbook.SheetNames);
          setActiveSheetName(workbook.SheetNames[0] || '');
          setParsedSheets(sheets);
          setFileType('excel');
          setActiveTab('view');
          setIsProcessing(false);
          showToast({
            title: 'File Excel Dimuat',
            message: `${file.name} siap dibaca!`,
            type: 'success',
            duration: 3000,
          });
        };
        reader.readAsBinaryString(file);
      } else if (ext === 'docx') {
        const reader = new FileReader();
        reader.onload = async (evt) => {
          const arrayBuffer = evt.target.result;
          const result = await mammoth.convertToHtml({ arrayBuffer });
          setFileContent(result.value);
          setFileType('word');
          setActiveTab('view');
          setIsProcessing(false);
          showToast({
            title: 'Dokumen Word Dimuat',
            message: `${file.name} berhasil diekstrak!`,
            type: 'success',
            duration: 3000,
          });
        };
        reader.readAsArrayBuffer(file);
      } else if (ext === 'pdf') {
        const fileUrl = URL.createObjectURL(file);
        setFileContent(fileUrl);
        setFileType('pdf');
        setActiveTab('view');
        setIsProcessing(false);
        showToast({
          title: 'PDF Dimuat',
          message: `${file.name} siap dibaca!`,
          type: 'success',
          duration: 3000,
        });
      } else if (ext === 'txt' || ext === 'md') {
        const reader = new FileReader();
        reader.onload = (evt) => {
          setFileContent(evt.target.result);
          setFileType('text');
          setActiveTab('view');
          setIsProcessing(false);
          showToast({
            title: 'File Teks Dimuat',
            message: `${file.name} siap dibaca!`,
            type: 'success',
            duration: 3000,
          });
        };
        reader.readAsText(file);
      } else {
        setIsProcessing(false);
        showToast({
          title: 'Format Belum Didukung',
          message: 'Silakan unggah dokumen .xlsx, .xls, .docx, .pdf, atau .txt.',
          type: 'error',
          duration: 4000,
        });
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      showToast({
        title: 'Gagal Membaca Dokumen',
        message: 'Terjadi kesalahan saat memproses file ini.',
        type: 'error',
        duration: 3500,
      });
    }
  };

  const openPreloadedDoc = (doc) => {
    setSelectedDoc(doc);
    setFileName(doc.title);
    if (doc.type === 'excel') {
      setFileType('excel');
      setSheetNames(['Data Utama']);
      setActiveSheetName('Data Utama');
      setParsedSheets({ 'Data Utama': doc.data });
    } else if (doc.type === 'word') {
      setFileType('word');
      setFileContent(doc.content);
    }
    setActiveTab('view');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 shadow-neu-pressed-sm dark:shadow-neu-dark-pressed-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Pusat Pembelajaran & Reader Dokumen
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
                Buka & baca modul SOP, tabel dosis, materi seminar (PDF, Excel, Word, Text)
              </p>
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <label className="flex-1 sm:flex-initial cursor-pointer px-4 py-2.5 rounded-2xl neu-btn-accent text-xs font-black flex items-center justify-center gap-2 shadow-md">
            <Upload className="w-4 h-4" />
            <span>Unggah Dokumen (PDF/Excel/Word)</span>
            <input
              type="file"
              accept=".pdf,.xlsx,.xls,.csv,.docx,.doc,.txt,.md"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {activeTab === 'view' && (
            <button
              onClick={() => setActiveTab('browse')}
              className="px-3.5 py-2.5 rounded-2xl neu-btn text-xs font-black text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Daftar Modul</span>
            </button>
          )}
        </div>
      </div>

      {isProcessing && (
        <div className="p-8 rounded-3xl neu-card text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-900 dark:text-white">
            Sedang membaca dan membedah dokumen {fileName}...
          </p>
        </div>
      )}

      {/* VIEW 1: BROWSE PRELOADED DOCS */}
      {activeTab === 'browse' && !isProcessing && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-300/60 dark:border-white/10">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Modul Referensi Standar Ruangan (Tersedia Offline)
            </h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-black">Siap Baca Langsung</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRELOADED_DOCS.map((doc) => (
              <div
                key={doc.id}
                onClick={() => openPreloadedDoc(doc)}
                className="neu-card rounded-3xl p-5 cursor-pointer hover:shadow-lg transition-all duration-150 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shadow-sm border border-emerald-300/40">
                      {doc.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-bold uppercase">
                      {doc.type} &bull; {doc.size}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-medium">
                    {doc.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-300/60 dark:border-white/10 flex items-center justify-between text-xs font-black text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Buka & Pelajari</span>
                  </span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE DOCUMENT VIEWER */}
      {activeTab === 'view' && !isProcessing && (
        <div className="neu-card rounded-3xl p-5 sm:p-6 space-y-4">
          
          {/* Header of Active Doc */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-300/60 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white">
                  {fileType}
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {fileName || 'Dokumen Terbuka'}
                </h3>
              </div>
            </div>

            {/* If Excel: Sheet Switcher Tabs */}
            {fileType === 'excel' && sheetNames.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
                {sheetNames.map((sheet) => (
                  <button
                    key={sheet}
                    onClick={() => setActiveSheetName(sheet)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      activeSheetName === sheet
                        ? 'neu-btn-active bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'neu-btn text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {sheet}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 1. EXCEL TABLE VIEWER */}
          {fileType === 'excel' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500 dark:text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari data di tabel..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-bold rounded-xl neu-input text-slate-900 dark:text-white"
                />
              </div>

              <div className="overflow-x-auto rounded-2xl shadow-neu-pressed dark:shadow-neu-dark-pressed border border-slate-300/60 dark:border-white/10 max-h-[520px]">
                {(() => {
                  const currentData = parsedSheets[activeSheetName] || [];
                  if (currentData.length === 0) {
                    return (
                      <div className="p-8 text-center text-xs text-slate-500 font-bold">
                        Tidak ada data di sheet ini.
                      </div>
                    );
                  }

                  const headers = Object.keys(currentData[0] || {});
                  const filtered = currentData.filter((row) =>
                    headers.some((h) =>
                      String(row[h] || '')
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                  );

                  return (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#E2E8F0] dark:bg-[#171C22] text-slate-900 dark:text-white sticky top-0 shadow-sm border-b border-slate-300 dark:border-white/10 font-black uppercase tracking-wider text-[11px]">
                        <tr>
                          {headers.map((h) => (
                            <th key={h} className="p-3 border-r border-slate-300/50 dark:border-white/10 whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300/50 dark:divide-white/5 font-semibold text-slate-900 dark:text-slate-100">
                        {filtered.map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          >
                            {headers.map((h) => (
                              <td key={h} className="p-3 border-r border-slate-300/30 dark:border-white/5 whitespace-pre-wrap leading-relaxed">
                                {String(row[h] ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            </div>
          )}

          {/* 2. WORD (.DOCX) VIEWER */}
          {fileType === 'word' && (
            <div
              className="prose prose-sm dark:prose-invert max-w-none p-5 rounded-2xl bg-white/40 dark:bg-black/40 shadow-neu-pressed dark:shadow-neu-dark-pressed border border-slate-300/60 dark:border-white/10 overflow-y-auto max-h-[600px] leading-relaxed text-slate-900 dark:text-slate-100 font-medium"
              dangerouslySetInnerHTML={{ __html: fileContent }}
            />
          )}

          {/* 3. PDF VIEWER */}
          {fileType === 'pdf' && (
            <div className="rounded-2xl overflow-hidden shadow-neu-pressed dark:shadow-neu-dark-pressed border border-slate-300/60 dark:border-white/10 h-[650px] bg-slate-900">
              <iframe
                src={fileContent}
                title="Pratinjau PDF"
                className="w-full h-full border-0"
              />
            </div>
          )}

          {/* 4. TEXT VIEWER */}
          {fileType === 'text' && (
            <pre className="p-5 rounded-2xl bg-white/40 dark:bg-black/40 shadow-neu-pressed dark:shadow-neu-dark-pressed border border-slate-300/60 dark:border-white/10 font-mono text-xs whitespace-pre-wrap overflow-y-auto max-h-[550px] leading-relaxed text-slate-900 dark:text-slate-100">
              {fileContent}
            </pre>
          )}

        </div>
      )}

    </div>
  );
};

export default DocReader;
