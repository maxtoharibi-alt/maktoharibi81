import React, { useState, useMemo } from 'react';
import { RplDocument, RplFormData } from '../types/rpl';
import { exportRplToWord, formatRplToPlainText } from '../utils/exportUtils';
import { exportRplToDocx } from '../utils/docxExport';
import { saveDraft } from '../utils/storageUtils';
import {
  FileDown,
  Copy,
  Check,
  Edit3,
  BookmarkCheck,
  RotateCw,
  Sparkles,
  ArrowLeft,
  Wand2,
  Send,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Layers
} from 'lucide-react';

interface DocumentPreviewProps {
  document: RplDocument;
  formData: RplFormData;
  onEditInput: () => void;
  onRegenerate: () => void;
  onUpdateDocument: (updated: RplDocument) => void;
  onSaveDraft?: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  formData,
  onEditInput,
  onRegenerate,
  onUpdateDocument,
  onSaveDraft,
}) => {
  const [copied, setCopied] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDocxGenerating, setIsDocxGenerating] = useState(false);

  // Section Refiner state
  const [refiningSection, setRefiningSection] = useState<string | null>(null);
  const [refinePrompt, setRefinePrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);
  const [showSectionPanel, setShowSectionPanel] = useState(false);

  // Parse total target minutes from string (e.g., "1 JP (2 x 40 Menit)" -> 80, "2 JP (2 x 40 Menit)" -> 80, "40 Menit" -> 40)
  const targetTotalMenit = useMemo(() => {
    const allocStr = document.identitas?.alokasiWaktu || formData.alokasiWaktu || '80 Menit';
    const multiMatch = allocStr.match(/(\d+)\s*x\s*(\d+)/i);
    if (multiMatch) {
      return parseInt(multiMatch[1], 10) * parseInt(multiMatch[2], 10);
    }
    const singleMatch = allocStr.match(/(\d+)\s*Menit/i);
    if (singleMatch) {
      return parseInt(singleMatch[1], 10);
    }
    const jpMatch = allocStr.match(/(\d+)\s*JP/i);
    if (jpMatch) {
      return parseInt(jpMatch[1], 10) * 40;
    }
    return 80;
  }, [document.identitas?.alokasiWaktu, formData.alokasiWaktu]);

  // Calculate actual step minutes
  const tahapAwalTotal = useMemo(() => {
    return (document.langkahPelaksanaan?.tahapAwal || []).reduce(
      (acc, s) => acc + (Number(s.alokasiWaktuMenit) || 0),
      0
    );
  }, [document.langkahPelaksanaan?.tahapAwal]);

  const tahapTransisiTotal = useMemo(() => {
    return (document.langkahPelaksanaan?.tahapTransisi || []).reduce(
      (acc, s) => acc + (Number(s.alokasiWaktuMenit) || 0),
      0
    );
  }, [document.langkahPelaksanaan?.tahapTransisi]);

  const tahapIntiTotal = useMemo(() => {
    return (document.langkahPelaksanaan?.tahapInti || []).reduce(
      (acc, s) => acc + (Number(s.alokasiWaktuMenit) || 0),
      0
    );
  }, [document.langkahPelaksanaan?.tahapInti]);

  const tahapPenutupTotal = useMemo(() => {
    return (document.langkahPelaksanaan?.tahapPenutup || []).reduce(
      (acc, s) => acc + (Number(s.alokasiWaktuMenit) || 0),
      0
    );
  }, [document.langkahPelaksanaan?.tahapPenutup]);

  const totalWaktuTerhitung = tahapAwalTotal + tahapTransisiTotal + tahapIntiTotal + tahapPenutupTotal;
  const isTimeMatched = totalWaktuTerhitung === targetTotalMenit;

  // Auto-balance minutes helper to guarantee 100% time accuracy
  const handleAutoBalanceMinutes = () => {
    const target = targetTotalMenit;
    const newDoc = JSON.parse(JSON.stringify(document));
    const lp = newDoc.langkahPelaksanaan;
    if (!lp || !lp.tahapInti || lp.tahapInti.length === 0) return;

    // Fixed Awal ~10m, Transisi ~10m, Penutup ~10m (if present), remainder to Inti
    const awal = tahapAwalTotal || 10;
    const transisi = tahapTransisiTotal || 10;
    const penutup = tahapPenutupTotal || 10;
    const remainingForInti = Math.max(10, target - (awal + transisi + penutup));

    const stepCount = lp.tahapInti.length;
    const perStep = Math.floor(remainingForInti / stepCount);
    const remainder = remainingForInti - perStep * stepCount;

    lp.tahapInti.forEach((s: any, idx: number) => {
      s.alokasiWaktuMenit = perStep + (idx === 0 ? remainder : 0);
    });

    lp.alokasiWaktuTotal = `${target} Menit`;
    onUpdateDocument(newDoc);
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      const text = formatRplToPlainText(document);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // Save to drafts
  const handleSaveDraft = () => {
    saveDraft(document, formData);
    setDraftSaved(true);
    if (onSaveDraft) onSaveDraft();
    setTimeout(() => setDraftSaved(false), 3000);
  };

  // Export to Native MS Word .docx
  const handleDocxExport = async () => {
    try {
      setIsDocxGenerating(true);
      await exportRplToDocx(document);
    } catch (err) {
      console.error('DOCX export failed:', err);
      // Fallback to HTML-based Word
      exportRplToWord(document);
    } finally {
      setIsDocxGenerating(false);
    }
  };

  // Export to Legacy MS Word .doc
  const handleWordExport = () => {
    exportRplToWord(document);
  };

  // AI Refine section
  const handleRefineSubmit = async (sectionKey: string, customInstruction?: string) => {
    const promptToUse = customInstruction || refinePrompt;
    if (!promptToUse.trim()) return;
    setIsRefining(true);
    setRefineError(null);

    try {
      let currentContent: any = '';
      if (sectionKey === 'tujuanLayanan') currentContent = document.tujuanLayanan;
      if (sectionKey === 'langkahPelaksanaan') currentContent = document.langkahPelaksanaan;
      if (sectionKey === 'materiLayanan') currentContent = document.materiLayanan;
      if (sectionKey === 'asesmen') currentContent = document.asesmen;
      if (sectionKey === 'lkpd') currentContent = document.lkpd;
      if (sectionKey === 'rubrikEvaluasi') currentContent = document.rubrikEvaluasi;

      const res = await fetch('/api/refine-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionName: sectionKey,
          currentContent,
          instruction: promptToUse,
          rplContext: {
            topik: document.identitas?.topikLayanan,
            kelas: document.identitas?.kelasFase,
            namaSekolah: document.identitas?.satuanPendidikan,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyempurnakan bagian.');
      }

      if (typeof data.refinedContent === 'object' && data.refinedContent !== null) {
        onUpdateDocument({
          ...document,
          [sectionKey]: data.refinedContent,
        });
      }
      setRefiningSection(null);
      setRefinePrompt('');
      setShowSectionPanel(false);
    } catch (err: any) {
      setRefineError(err.message || 'Gagal menyempurnakan bagian');
    } finally {
      setIsRefining(false);
    }
  };

  // Inline edit helper
  const updateNestedText = (path: string[], value: string) => {
    const newDoc = JSON.parse(JSON.stringify(document));
    let curr = newDoc;
    for (let i = 0; i < path.length - 1; i++) {
      curr = curr[path[i]];
    }
    curr[path[path.length - 1]] = value;
    onUpdateDocument(newDoc);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      {/* ========================================================= */}
      {/* TOP ACTION BAR (Non-print) */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm mb-6 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                Format Cetak A4 Resmi
              </span>
              <span className="text-xs text-slate-500">
                Total Alokasi: <strong>{document.identitas?.alokasiWaktu}</strong>
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {document.identitas?.topikLayanan || document.title}
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onEditInput}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              title="Kembali ke formulir untuk mengubah input"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>EDIT INPUT</span>
            </button>

            <button
              type="button"
              onClick={onRegenerate}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              title="Generate ulang seluruh isi RPL dengan AI"
            >
              <RotateCw className="w-3.5 h-3.5 text-blue-600" />
              <span>GENERATE ULANG</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSectionPanel(!showSectionPanel)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                showSectionPanel
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200'
              }`}
              title="Perbaiki atau generate ulang bagian tertentu (Tujuan, Inti, Asesmen, LKPD)"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-500" />
              <span>REGENERASI BAGIAN</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isEditMode
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Aktifkan mode edit teks langsung pada lembar dokumen"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'SELESAI EDIT' : 'EDIT LANGSUNG'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              title="Salin seluruh dokumen ke clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">TERSALIN!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>SALIN DOKUMEN</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              title="Simpan ke draf lokal"
            >
              {draftSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">TERSIMPAN!</span>
                </>
              ) : (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>SIMPAN DRAF</span>
                </>
              )}
            </button>

            {/* Native MS Word DOCX Export Button */}
            <button
              type="button"
              onClick={handleDocxExport}
              disabled={isDocxGenerating}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              title="Unduh dokumen asli Microsoft Word (.docx) dengan tabel dan kop surat rapi"
            >
              {isDocxGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  <span>MEMBUAT DOCX...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-amber-300" />
                  <span>UNDUH DOCX</span>
                </>
              )}
            </button>

            {/* Legacy MS Word (.doc) Export Button */}
            <button
              type="button"
              onClick={handleWordExport}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              title="Unduh dokumen format Word alternatif (.doc)"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-600" />
              <span>WORD (.DOC)</span>
            </button>
          </div>
        </div>

        {/* TIME VALIDATION & CONSISTENCY BAR */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                Validasi Alokasi Waktu:
              </span>
              <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2 py-1 rounded">
                <span>Awal: <strong>{tahapAwalTotal}m</strong></span> +
                <span>Transisi: <strong>{tahapTransisiTotal}m</strong></span> +
                <span>Inti: <strong>{tahapIntiTotal}m</strong></span> +
                <span>Penutup: <strong>{tahapPenutupTotal}m</strong></span> =
                <span className="font-bold text-slate-900"> {totalWaktuTerhitung} Menit</span>
              </div>

              {isTimeMatched ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Sesuai Alokasi ({targetTotalMenit} Menit)
                </span>
              ) : (
                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Selisih {Math.abs(targetTotalMenit - totalWaktuTerhitung)} Menit (Target: {targetTotalMenit}m)
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoBalanceMinutes}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-[11px] transition-colors cursor-pointer"
                  >
                    Auto-Sesuaikan Menit
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Prinsip Deep Learning: <strong>Berkesadaran, Bermakna, Menggembirakan</strong></span>
            </div>
          </div>
        </div>

        {/* SECTION REGENERATOR PANEL (Collapsible) */}
        {showSectionPanel && (
          <div className="mt-4 p-4 bg-blue-50/80 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-blue-950">
                  Penyempurnaan / Regenerasi Bagian Tertentu dengan AI
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSectionPanel(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Pilih bagian yang ingin diperbaiki atau dibuat lebih mendalam tanpa perlu mengulang seluruh formulir:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-3">
              {[
                { key: 'tujuanLayanan', label: 'Tujuan Layanan', desc: 'ABCD & SMART' },
                { key: 'langkahPelaksanaan', label: 'Kegiatan Inti', desc: 'Deep Learning' },
                { key: 'materiLayanan', label: 'Materi BK', desc: 'Kontekstual' },
                { key: 'asesmen', label: 'Asesmen BK', desc: 'Awal-Proses-Hasil' },
                { key: 'lkpd', label: 'LKPD Siswa', desc: 'Aktivitas Kreatif' },
                { key: 'rubrikEvaluasi', label: 'Rubrik Penilaian', desc: '4 Skala Capaian' },
              ].map((sec) => (
                <button
                  key={sec.key}
                  type="button"
                  onClick={() => {
                    setRefiningSection(sec.key);
                    setRefineError(null);
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    refiningSection === sec.key
                      ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs">{sec.label}</div>
                  <div className={`text-[10px] ${refiningSection === sec.key ? 'text-blue-100' : 'text-slate-500'}`}>
                    {sec.desc}
                  </div>
                </button>
              ))}
            </div>

            {refiningSection && (
              <div className="bg-white p-3.5 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-blue-900">
                    Instruksi untuk Bagian: <span className="uppercase text-amber-600">{refiningSection}</span>
                  </span>
                </div>

                {/* Quick instruction chips */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  <span className="text-[10px] font-semibold text-slate-400 self-center">Pilihan Cepat:</span>
                  {[
                    'Tingkatkan kedalaman aktivitas siswa (HOTS & Kolaborasi)',
                    'Perjelas indikator ketercapaian secara terukur',
                    'Buat pertanyaan pemantik lebih menggugah refleksi',
                    'Sesuaikan dengan dinamika siswa kelas VII/VIII SMP',
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRefinePrompt(chip)}
                      className="text-[10px] bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 px-2 py-0.5 rounded cursor-pointer transition-colors"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={refinePrompt}
                    onChange={(e) => setRefinePrompt(e.target.value)}
                    placeholder="Ketik instruksi khusus (misal: 'Tambahkan studi kasus perundungan digital di sekolah...')"
                    className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRefineSubmit(refiningSection);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRefineSubmit(refiningSection)}
                    disabled={isRefining || !refinePrompt.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {isRefining ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Sempurnakan</span>
                      </>
                    )}
                  </button>
                </div>

                {refineError && (
                  <p className="text-xs text-rose-600 mt-2 font-medium">{refineError}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Edit mode banner */}
        {isEditMode && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl mt-4 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
              <span>
                <strong>Mode Edit Langsung Aktif:</strong> Klik langsung pada teks di lembar dokumen di bawah untuk mengubahnya. Perubahan tersimpan secara instan.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsEditMode(false)}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              Kunci & Selesai Edit
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* DOCUMENT PREVIEW CONTAINER (Formal A4 Government Standard) */}
      {/* ========================================================= */}
      <div
        id="rpl-official-document"
        className="print-document-container bg-white rounded-none sm:rounded-xl shadow-2xl border border-slate-300 p-6 sm:p-14 text-slate-900 font-serif leading-relaxed max-w-[210mm] mx-auto"
      >
        {/* KOP SURAT RESMI PEMERINTAH */}
        <div className="pb-1 mb-6 text-center avoid-break">
          <h3 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-800">
            PEMERINTAH KOTA BEKASI &bull; DINAS PENDIDIKAN
          </h3>
          <h2
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => updateNestedText(['identitas', 'satuanPendidikan'], e.currentTarget.textContent || '')}
            className={`text-lg sm:text-2xl font-black tracking-wider uppercase text-slate-950 mt-0.5 ${
              isEditMode ? 'hover:bg-amber-50 focus:bg-amber-100 rounded px-1' : ''
            }`}
          >
            {document.identitas?.satuanPendidikan || 'SMP NEGERI 53 KOTA BEKASI'}
          </h2>
          <p className="text-[11px] font-sans text-slate-600 italic mt-0.5">
            Jl. R.H. Umar 4 RT.06/RW.18 No. 97, Kelurahan Jakasetia, Kecamatan Bekasi Selatan, Kota Bekasi, Jawa Barat 17147
          </p>
          <p className="text-[10px] font-sans text-slate-500 mt-0.5">
            Pos-el: smpn53kotabekasi@gmail.com &bull; Laman Resmi: smpn53kotabekasi.sch.id
          </p>
          {/* Double rule separator standard */}
          <div className="border-b-[2.5px] border-slate-950 mt-3 mb-[2px]"></div>
          <div className="border-b-[0.75px] border-slate-950 mb-6"></div>
        </div>

        {/* JUDUL RESMI NASKAH DINAS */}
        <div className="text-center mb-8 avoid-break">
          <h1 className="text-sm sm:text-base font-bold tracking-tight uppercase underline text-slate-950">
            RENCANA PELAKSANAAN LAYANAN (RPL) BIMBINGAN DAN KONSELING
          </h1>
          <p className="text-xs font-sans font-bold text-slate-800 tracking-wider uppercase mt-1">
            PENDEKATAN PEMBELAJARAN MENDALAM (DEEP LEARNING)
          </p>
          <p className="text-[11px] font-sans text-slate-500 mt-0.5">
            Tahun Pelajaran {document.identitas?.tahunPelajaran} &bull; Semester {document.identitas?.semester}
          </p>
        </div>

        {/* ======================================================== */}
        {/* BAGIAN I: IDENTITAS LAYANAN */}
        {/* ======================================================== */}
        <div className="mb-8 avoid-break">
          <div className="section-header-print bg-slate-100 border border-slate-300 px-3.5 py-1.5 mb-3 font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
            BAGIAN I — IDENTITAS LAYANAN
          </div>

          <table className="w-full text-xs font-sans border border-slate-300 border-collapse mb-4">
            <tbody>
              <tr>
                <td className="bg-slate-100 font-semibold text-slate-800 p-2 border border-slate-300 w-1/4">Satuan Pendidikan</td>
                <td className="p-2 border border-slate-300 w-1/4 font-bold text-slate-950">
                  <span
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => updateNestedText(['identitas', 'satuanPendidikan'], e.currentTarget.textContent || '')}
                    className={isEditMode ? 'hover:bg-amber-50 px-1 rounded' : ''}
                  >
                    {document.identitas?.satuanPendidikan}
                  </span>
                </td>
                <td className="bg-slate-100 font-semibold text-slate-800 p-2 border border-slate-300 w-1/4">Komponen Layanan</td>
                <td className="p-2 border border-slate-300 w-1/4 text-slate-900">
                  {document.identitas?.komponenLayanan}
                </td>
              </tr>
              <tr>
                <td className="bg-slate-100 font-semibold text-slate-800 p-2 border border-slate-300">Guru BK / Konselor</td>
                <td className="p-2 border border-slate-300 text-slate-900">
                  <div
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => updateNestedText(['identitas', 'namaGuruBK'], e.currentTarget.textContent || '')}
                    className={`font-semibold ${isEditMode ? 'hover:bg-amber-50 px-1 rounded' : ''}`}
                  >
                    {document.identitas?.namaGuruBK}
                  </div>
                  {document.identitas?.nipGuruBK && (
                    <div className="text-[11px] text-slate-600">NIP. {document.identitas?.nipGuruBK}</div>
                  )}
                </td>
                <td className="bg-slate-100 font-semibold text-slate-800 p-2 border border-slate-300">Bidang Layanan</td>
                <td className="p-2 border border-slate-300 text-slate-900 font-medium">
                  Bidang {document.identitas?.bidangLayanan}
                </td>
              </tr>
              <tr>
                <td className="bg-slate-100 font-semibold text-slate-800 p-2 border border-slate-300">Kelas / Fase</td>
                <td className="p-2 border border-slate-300 font-semibold text-slate-900">
                  Kelas {document.identitas?.kelasFase}
                </td>
                <td className="bg-slate-100 font-semibold text-slate-800 p-2 border border-slate-300">Jenis Layanan</td>
                <td className="p-2 border border-slate-300 text-slate-900">
                  {document.identitas?.jenisLayanan}
                </td>
              </tr>
              <tr>
                <td className="bg-slate-100 font-semibold text-slate-800 p-2 border border-slate-300">Tahun / Semester</td>
                <td className="p-2 border border-slate-300 text-slate-900">
                  {document.identitas?.tahunPelajaran} &bull; Semester {document.identitas?.semester}
                </td>
                <td className="bg-slate-100 font-semibold text-slate-800 p-2 border border-slate-300">Fungsi Layanan</td>
                <td className="p-2 border border-slate-300 text-slate-900">
                  {document.identitas?.fungsiLayanan}
                </td>
              </tr>
              <tr>
                <td className="bg-slate-100 font-semibold text-slate-800 p-2 border border-slate-300">Alokasi Waktu</td>
                <td className="p-2 border border-slate-300 text-slate-900 font-semibold">
                  {document.identitas?.alokasiWaktu} ({document.identitas?.jumlahPertemuan})
                </td>
                <td className="bg-slate-100 font-semibold text-slate-800 p-2 border border-slate-300">Sasaran & Tanggal</td>
                <td className="p-2 border border-slate-300 text-slate-900">
                  {document.identitas?.sasaranLayanan} &bull; {document.identitas?.tanggalPelaksanaan}
                </td>
              </tr>
              <tr>
                <td className="bg-slate-100 font-semibold text-slate-800 p-2 border border-slate-300">Topik / Tema Layanan</td>
                <td
                  colSpan={3}
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateNestedText(['identitas', 'topikLayanan'], e.currentTarget.textContent || '')}
                  className={`p-2.5 border border-slate-300 font-bold text-slate-950 bg-slate-50/50 text-sm ${
                    isEditMode ? 'hover:bg-amber-50' : ''
                  }`}
                >
                  {document.identitas?.topikLayanan}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ======================================================== */}
        {/* BAGIAN II: IDENTIFIKASI KEBUTUHAN PESERTA DIDIK */}
        {/* ======================================================== */}
        <div className="mb-8 avoid-break">
          <div className="section-header-print bg-slate-100 border border-slate-300 px-3.5 py-1.5 mb-3 font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
            BAGIAN II — IDENTIFIKASI KEBUTUHAN PESERTA DIDIK
          </div>

          <table className="w-full text-xs font-sans border border-slate-300 border-collapse mb-3">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-2 text-left w-1/3">Aspek Identifikasi</th>
                <th className="border border-slate-300 p-2 text-left">Deskripsi Kontekstual</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold">Dasar Kebutuhan Layanan</td>
                <td
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateNestedText(['identifikasiKebutuhan', 'dasarKebutuhan'], e.currentTarget.textContent || '')}
                  className={`border border-slate-300 p-2 ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                >
                  {document.identifikasiKebutuhan?.dasarKebutuhan}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold">Hasil Asesmen Kebutuhan</td>
                <td
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateNestedText(['identifikasiKebutuhan', 'hasilAsesmenKebutuhan'], e.currentTarget.textContent || '')}
                  className={`border border-slate-300 p-2 ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                >
                  {document.identifikasiKebutuhan?.hasilAsesmenKebutuhan}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold">Karakteristik Perkembangan</td>
                <td
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateNestedText(['identifikasiKebutuhan', 'karakteristikPerkembangan'], e.currentTarget.textContent || '')}
                  className={`border border-slate-300 p-2 ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                >
                  {document.identifikasiKebutuhan?.karakteristikPerkembangan}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold">Kesiapan & Pengalaman Awal</td>
                <td
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateNestedText(['identifikasiKebutuhan', 'kesiapanDanPengalamanAwal'], e.currentTarget.textContent || '')}
                  className={`border border-slate-300 p-2 ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                >
                  {document.identifikasiKebutuhan?.kesiapanDanPengalamanAwal}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold">Permasalahan Prioritas</td>
                <td
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateNestedText(['identifikasiKebutuhan', 'permasalahanPrioritas'], e.currentTarget.textContent || '')}
                  className={`border border-slate-300 p-2 text-rose-950 font-medium ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                >
                  {document.identifikasiKebutuhan?.permasalahanPrioritas}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold">Potensi & Kekuatan Peserta Didik</td>
                <td
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateNestedText(['identifikasiKebutuhan', 'potensiDanKekuatan'], e.currentTarget.textContent || '')}
                  className={`border border-slate-300 p-2 ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                >
                  {document.identifikasiKebutuhan?.potensiDanKekuatan}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold">Kebutuhan Dukungan / Akomodasi</td>
                <td
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateNestedText(['identifikasiKebutuhan', 'kebutuhanDukunganAkomodasi'], e.currentTarget.textContent || '')}
                  className={`border border-slate-300 p-2 ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                >
                  {document.identifikasiKebutuhan?.kebutuhanDukunganAkomodasi}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ======================================================== */}
        {/* BAGIAN III: TUJUAN LAYANAN */}
        {/* ======================================================== */}
        <div className="mb-8 avoid-break">
          <div className="section-header-print bg-slate-100 border border-slate-300 px-3.5 py-1.5 mb-3 font-sans font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center justify-between">
            <span>BAGIAN III — TUJUAN LAYANAN</span>
            <button
              type="button"
              onClick={() => setRefiningSection(refiningSection === 'tujuanLayanan' ? null : 'tujuanLayanan')}
              className="print:hidden text-[11px] font-semibold text-blue-800 hover:text-blue-950 flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded border border-slate-300 shadow-2xs"
            >
              <Wand2 className="w-3 h-3 text-amber-500" />
              <span>Sempurnakan dengan AI</span>
            </button>
          </div>

          {/* Inline AI Refiner Box */}
          {refiningSection === 'tujuanLayanan' && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl mb-3 print:hidden text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Instruksi Penyempurnaan Tujuan Layanan:
                </span>
                <button onClick={() => setRefiningSection(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  placeholder="Contoh: Perjelas KKO operasional pada tujuan 2 dan 3..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-800"
                />
                <button
                  onClick={() => handleRefineSubmit('tujuanLayanan')}
                  disabled={isRefining}
                  className="px-3 py-1.5 bg-blue-900 text-white rounded-lg font-bold text-xs hover:bg-blue-800 cursor-pointer flex items-center gap-1"
                >
                  {isRefining ? 'Memproses...' : 'Kirim'}
                  <Send className="w-3 h-3" />
                </button>
              </div>
              {refineError && <p className="text-rose-600 text-[11px] mt-1">{refineError}</p>}
            </div>
          )}

          <div className="space-y-3 text-xs font-sans">
            <div>
              <h4 className="font-bold text-slate-900">A. Tujuan Umum:</h4>
              <p
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => updateNestedText(['tujuanLayanan', 'tujuanUmum'], e.currentTarget.textContent || '')}
                className={`mt-0.5 text-slate-800 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200 ${
                  isEditMode ? 'hover:bg-amber-50' : ''
                }`}
              >
                {document.tujuanLayanan?.tujuanUmum}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900">B. Tujuan Khusus (Operasional Bloom / KKO):</h4>
              <ol className="list-decimal pl-5 mt-1 space-y-1 text-slate-800">
                {(document.tujuanLayanan?.tujuanKhusus || []).map((tujuan, idx) => (
                  <li
                    key={idx}
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newArr = [...(document.tujuanLayanan?.tujuanKhusus || [])];
                      newArr[idx] = e.currentTarget.textContent || '';
                      updateNestedText(['tujuanLayanan', 'tujuanKhusus'], newArr as any);
                    }}
                    className={isEditMode ? 'hover:bg-amber-50' : ''}
                  >
                    {tujuan}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h4 className="font-bold text-slate-900">C. Indikator Ketercapaian Layanan:</h4>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-800">
                {(document.tujuanLayanan?.indikatorKetercapaian || []).map((ind, idx) => (
                  <li
                    key={idx}
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newArr = [...(document.tujuanLayanan?.indikatorKetercapaian || [])];
                      newArr[idx] = e.currentTarget.textContent || '';
                      updateNestedText(['tujuanLayanan', 'indikatorKetercapaian'], newArr as any);
                    }}
                    className={isEditMode ? 'hover:bg-amber-50' : ''}
                  >
                    {ind}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900">D. Dimensi Kompetensi & Keterampilan yang Dikembangkan:</h4>
              <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-800">
                {(document.tujuanLayanan?.kompetensiKeterampilan || []).map((komp, idx) => (
                  <li key={idx} className="font-medium">
                    {komp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BAGIAN IV: DESAIN PEMBELAJARAN MENDALAM */}
        {/* ======================================================== */}
        <div className="mb-8 avoid-break">
          <div className="section-header-print bg-slate-100 border border-slate-300 px-3.5 py-1.5 mb-3 font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
            BAGIAN IV — DESAIN PEMBELAJARAN MENDALAM (DEEP LEARNING)
          </div>

          <table className="w-full text-xs font-sans border border-slate-300 border-collapse mb-3">
            <tbody>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold w-1/3 bg-slate-100/70 text-slate-900">
                  A. Praktik Pedagogis
                </td>
                <td className="border border-slate-300 p-2">
                  <div className="space-y-1">
                    <div>
                      <strong>Pendekatan:</strong> {document.desainPembelajaranMendalam?.praktikPedagogis?.pendekatan}
                    </div>
                    <div>
                      <strong>Strategi & Model:</strong> {document.desainPembelajaranMendalam?.praktikPedagogis?.strategiModel}
                    </div>
                    <div>
                      <strong>Metode:</strong> {document.desainPembelajaranMendalam?.praktikPedagogis?.metode}
                    </div>
                    <div>
                      <strong>Teknik Fasilitasi:</strong> {document.desainPembelajaranMendalam?.praktikPedagogis?.teknikFasilitasi}
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold bg-slate-100/70 text-slate-900">
                  B. Kemitraan Pembelajaran
                </td>
                <td className="border border-slate-300 p-2">
                  <div className="space-y-1">
                    <div>
                      <strong>Peran Guru BK:</strong> {document.desainPembelajaranMendalam?.kemitraanPembelajaran?.peranGuruBK}
                    </div>
                    <div>
                      <strong>Peran Peserta Didik:</strong> {document.desainPembelajaranMendalam?.kemitraanPembelajaran?.peranPesertaDidik}
                    </div>
                    <div>
                      <strong>Mitra Kolaborasi:</strong> {document.desainPembelajaranMendalam?.kemitraanPembelajaran?.peranMitraLain}
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold bg-slate-100/70 text-slate-900">
                  C. Lingkungan Pembelajaran
                </td>
                <td className="border border-slate-300 p-2">
                  <div className="space-y-1">
                    <div>
                      <strong>Keamanan Psikologis:</strong> {document.desainPembelajaranMendalam?.lingkunganPembelajaran?.keamananPsikologis}
                    </div>
                    <div>
                      <strong>Kenyamanan & Inklusivitas:</strong> {document.desainPembelajaranMendalam?.lingkunganPembelajaran?.kenyamananDanInklusivitas}
                    </div>
                    <div>
                      <strong>Kerahasiaan & Etika:</strong> {document.desainPembelajaranMendalam?.lingkunganPembelajaran?.kerahasiaanDanEtika}
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold bg-slate-100/70 text-slate-900">
                  D. Pemanfaatan Digital
                </td>
                <td className="border border-slate-300 p-2">
                  {document.desainPembelajaranMendalam?.pemanfaatanDigital}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold bg-slate-100/70 text-slate-900">
                  E. Dimensi Profil Lulusan
                </td>
                <td className="border border-slate-300 p-2">
                  <ul className="list-disc pl-5 space-y-0.5 text-xs text-slate-800">
                    {(document.desainPembelajaranMendalam?.dimensiProfilLulusan || []).map((dim, i) => (
                      <li key={i} className="font-medium">
                        {dim}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-semibold bg-slate-100/70 text-slate-900">
                  F. Penerapan 3 Prinsip Deep Learning
                </td>
                <td className="border border-slate-300 p-2">
                  <div className="space-y-2">
                    <div>
                      <span className="font-bold text-slate-900">1. Berkesadaran (Mindful):</span>{' '}
                      {document.desainPembelajaranMendalam?.prinsipDeepLearning?.berkesadaran}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">2. Bermakna (Meaningful):</span>{' '}
                      {document.desainPembelajaranMendalam?.prinsipDeepLearning?.bermakna}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">3. Menggembirakan (Joyful):</span>{' '}
                      {document.desainPembelajaranMendalam?.prinsipDeepLearning?.menggembirakan}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ======================================================== */}
        {/* BAGIAN V: PENGALAMAN BELAJAR */}
        {/* ======================================================== */}
        <div className="mb-8 avoid-break">
          <div className="section-header-print bg-slate-100 border border-slate-300 px-3.5 py-1.5 mb-3 font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
            BAGIAN V — PENGALAMAN BELAJAR (MEMAHAMI, MENGAPLIKASI, MEREFLEKSI)
          </div>

          <table className="w-full text-xs font-sans border border-slate-300 border-collapse mb-3">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-2 text-left w-1/4">Tahapan Pengalaman</th>
                <th className="border border-slate-300 p-2 text-left">Deskripsi Aktivitas Inti</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 p-2 font-bold text-slate-950">
                  1. MEMAHAMI
                  <div className="text-[10px] text-slate-500 font-normal">Membangun kesadaran konsep</div>
                </td>
                <td
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateNestedText(['pengalamanBelajar', 'memahami'], e.currentTarget.textContent || '')}
                  className={`border border-slate-300 p-2 ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                >
                  {document.pengalamanBelajar?.memahami}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-bold text-slate-950">
                  2. MENGAPLIKASI
                  <div className="text-[10px] text-slate-500 font-normal">Praktik keterampilan nyata</div>
                </td>
                <td
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateNestedText(['pengalamanBelajar', 'mengaplikasi'], e.currentTarget.textContent || '')}
                  className={`border border-slate-300 p-2 ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                >
                  {document.pengalamanBelajar?.mengaplikasi}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-bold text-slate-950">
                  3. MEREFLEKSI
                  <div className="text-[10px] text-slate-500 font-normal">Evaluasi diri & komitmen</div>
                </td>
                <td
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateNestedText(['pengalamanBelajar', 'merefleksi'], e.currentTarget.textContent || '')}
                  className={`border border-slate-300 p-2 ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                >
                  {document.pengalamanBelajar?.merefleksi}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ======================================================== */}
        {/* BAGIAN VI: LANGKAH-LANGKAH PELAKSANAAN */}
        {/* ======================================================== */}
        <div className="mb-8 avoid-break">
          <div className="section-header-print bg-slate-100 border border-slate-300 px-3.5 py-1.5 mb-3 font-sans font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center justify-between">
            <span>BAGIAN VI — LANGKAH-LANGKAH PELAKSANAAN LAYANAN</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-normal lowercase hidden sm:inline text-slate-600">
                total: <strong className="text-slate-900">{document.langkahPelaksanaan?.alokasiWaktuTotal}</strong>
              </span>
              <button
                type="button"
                onClick={() => setRefiningSection(refiningSection === 'langkahPelaksanaan' ? null : 'langkahPelaksanaan')}
                className="print:hidden text-[11px] font-medium text-slate-700 hover:text-slate-950 flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded border border-slate-300 shadow-2xs"
              >
                <Wand2 className="w-3 h-3 text-amber-500" />
                <span>Sempurnakan dengan AI</span>
              </button>
            </div>
          </div>

          {/* Inline AI Refiner Box */}
          {refiningSection === 'langkahPelaksanaan' && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl mb-3 print:hidden text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Instruksi Penyempurnaan Langkah Kegiatan:
                </span>
                <button onClick={() => setRefiningSection(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  placeholder="Contoh: Tambahkan ice breaking tepuk semangat di tahap transisi..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-800"
                />
                <button
                  onClick={() => handleRefineSubmit('langkahPelaksanaan')}
                  disabled={isRefining}
                  className="px-3 py-1.5 bg-blue-900 text-white rounded-lg font-bold text-xs hover:bg-blue-800 cursor-pointer flex items-center gap-1"
                >
                  {isRefining ? 'Memproses...' : 'Kirim'}
                  <Send className="w-3 h-3" />
                </button>
              </div>
              {refineError && <p className="text-rose-600 text-[11px] mt-1">{refineError}</p>}
            </div>
          )}

          {/* Tahap Awal */}
          <h4 className="text-xs font-sans font-bold text-slate-900 mt-3 mb-1">
            A. Tahap Awal (Pembukaan & Apersepsi)
          </h4>
          <table className="w-full text-[11px] font-sans border border-slate-300 border-collapse mb-3">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-1.5 text-left w-1/5">Kegiatan & Waktu</th>
                <th className="border border-slate-300 p-1.5 text-left w-2/5">Aktivitas Guru BK</th>
                <th className="border border-slate-300 p-1.5 text-left w-2/5">Aktivitas Peserta Didik</th>
                <th className="border border-slate-300 p-1.5 text-left">Prinsip Deep Learning</th>
              </tr>
            </thead>
            <tbody>
              {(document.langkahPelaksanaan?.tahapAwal || []).map((step, idx) => (
                <tr key={idx}>
                  <td className="border border-slate-300 p-1.5 font-semibold">
                    {step.namaKegiatan}
                    <div className="text-[10px] text-blue-800 font-bold">{step.alokasiWaktuMenit} Menit</div>
                  </td>
                  <td
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newArr = [...(document.langkahPelaksanaan?.tahapAwal || [])];
                      newArr[idx] = { ...newArr[idx], aktivitasGuruBK: e.currentTarget.textContent || '' };
                      updateNestedText(['langkahPelaksanaan', 'tahapAwal'], newArr as any);
                    }}
                    className={`border border-slate-300 p-1.5 ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                  >
                    {step.aktivitasGuruBK}
                  </td>
                  <td
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newArr = [...(document.langkahPelaksanaan?.tahapAwal || [])];
                      newArr[idx] = { ...newArr[idx], aktivitasPesertaDidik: e.currentTarget.textContent || '' };
                      updateNestedText(['langkahPelaksanaan', 'tahapAwal'], newArr as any);
                    }}
                    className={`border border-slate-300 p-1.5 ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                  >
                    {step.aktivitasPesertaDidik}
                  </td>
                  <td className="border border-slate-300 p-1.5 italic text-slate-600">
                    {step.prinsipPembelajaranMendalam}
                    {step.mediaInstrumen && (
                      <div className="not-italic text-[10px] text-slate-500 mt-0.5">
                        Media: {step.mediaInstrumen}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tahap Transisi */}
          <h4 className="text-xs font-sans font-bold text-slate-900 mt-3 mb-1">
            B. Tahap Transisi (Peralihan & Kesiapan)
          </h4>
          <table className="w-full text-[11px] font-sans border border-slate-300 border-collapse mb-3">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-1.5 text-left w-1/5">Kegiatan & Waktu</th>
                <th className="border border-slate-300 p-1.5 text-left w-2/5">Aktivitas Guru BK</th>
                <th className="border border-slate-300 p-1.5 text-left w-2/5">Aktivitas Peserta Didik</th>
                <th className="border border-slate-300 p-1.5 text-left">Prinsip Deep Learning</th>
              </tr>
            </thead>
            <tbody>
              {(document.langkahPelaksanaan?.tahapTransisi || []).map((step, idx) => (
                <tr key={idx}>
                  <td className="border border-slate-300 p-1.5 font-semibold">
                    {step.namaKegiatan}
                    <div className="text-[10px] text-blue-800 font-bold">{step.alokasiWaktuMenit} Menit</div>
                  </td>
                  <td
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newArr = [...(document.langkahPelaksanaan?.tahapTransisi || [])];
                      newArr[idx] = { ...newArr[idx], aktivitasGuruBK: e.currentTarget.textContent || '' };
                      updateNestedText(['langkahPelaksanaan', 'tahapTransisi'], newArr as any);
                    }}
                    className={`border border-slate-300 p-1.5 ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                  >
                    {step.aktivitasGuruBK}
                  </td>
                  <td
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newArr = [...(document.langkahPelaksanaan?.tahapTransisi || [])];
                      newArr[idx] = { ...newArr[idx], aktivitasPesertaDidik: e.currentTarget.textContent || '' };
                      updateNestedText(['langkahPelaksanaan', 'tahapTransisi'], newArr as any);
                    }}
                    className={`border border-slate-300 p-1.5 ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                  >
                    {step.aktivitasPesertaDidik}
                  </td>
                  <td className="border border-slate-300 p-1.5 italic text-slate-600">
                    {step.prinsipPembelajaranMendalam}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tahap Inti */}
          <h4 className="text-xs font-sans font-bold text-slate-900 mt-3 mb-1">
            C. Tahap Inti (Pengalaman: Memahami, Mengaplikasi, Merefleksi)
          </h4>
          <table className="w-full text-[11px] font-sans border border-slate-300 border-collapse mb-3">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-1.5 text-left w-1/5">Kegiatan & Waktu</th>
                <th className="border border-slate-300 p-1.5 text-left w-2/5">Aktivitas Guru BK</th>
                <th className="border border-slate-300 p-1.5 text-left w-2/5">Aktivitas Peserta Didik</th>
                <th className="border border-slate-300 p-1.5 text-left">Prinsip & Bukti</th>
              </tr>
            </thead>
            <tbody>
              {(document.langkahPelaksanaan?.tahapInti || []).map((step, idx) => (
                <tr key={idx}>
                  <td className="border border-slate-300 p-1.5 font-semibold">
                    {step.namaKegiatan}
                    <div className="text-[10px] text-blue-800 font-bold">{step.alokasiWaktuMenit} Menit</div>
                  </td>
                  <td
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newArr = [...(document.langkahPelaksanaan?.tahapInti || [])];
                      newArr[idx] = { ...newArr[idx], aktivitasGuruBK: e.currentTarget.textContent || '' };
                      updateNestedText(['langkahPelaksanaan', 'tahapInti'], newArr as any);
                    }}
                    className={`border border-slate-300 p-1.5 ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                  >
                    {step.aktivitasGuruBK}
                  </td>
                  <td
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newArr = [...(document.langkahPelaksanaan?.tahapInti || [])];
                      newArr[idx] = { ...newArr[idx], aktivitasPesertaDidik: e.currentTarget.textContent || '' };
                      updateNestedText(['langkahPelaksanaan', 'tahapInti'], newArr as any);
                    }}
                    className={`border border-slate-300 p-1.5 ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                  >
                    {step.aktivitasPesertaDidik}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-slate-600">
                    <span className="italic">{step.prinsipPembelajaranMendalam}</span>
                    {step.buktiKetercapaian && (
                      <div className="text-[10px] text-emerald-800 mt-0.5 font-medium">
                        Bukti: {step.buktiKetercapaian}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tahap Penutup */}
          <h4 className="text-xs font-sans font-bold text-slate-900 mt-3 mb-1">
            D. Tahap Penutup (Refleksi & Komitmen Tindakan)
          </h4>
          <table className="w-full text-[11px] font-sans border border-slate-300 border-collapse mb-3">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-1.5 text-left w-1/5">Kegiatan & Waktu</th>
                <th className="border border-slate-300 p-1.5 text-left w-2/5">Aktivitas Guru BK</th>
                <th className="border border-slate-300 p-1.5 text-left w-2/5">Aktivitas Peserta Didik</th>
                <th className="border border-slate-300 p-1.5 text-left">Prinsip & Media</th>
              </tr>
            </thead>
            <tbody>
              {(document.langkahPelaksanaan?.tahapPenutup || []).map((step, idx) => (
                <tr key={idx}>
                  <td className="border border-slate-300 p-1.5 font-semibold">
                    {step.namaKegiatan}
                    <div className="text-[10px] text-blue-800 font-bold">{step.alokasiWaktuMenit} Menit</div>
                  </td>
                  <td
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newArr = [...(document.langkahPelaksanaan?.tahapPenutup || [])];
                      newArr[idx] = { ...newArr[idx], aktivitasGuruBK: e.currentTarget.textContent || '' };
                      updateNestedText(['langkahPelaksanaan', 'tahapPenutup'], newArr as any);
                    }}
                    className={`border border-slate-300 p-1.5 ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                  >
                    {step.aktivitasGuruBK}
                  </td>
                  <td
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newArr = [...(document.langkahPelaksanaan?.tahapPenutup || [])];
                      newArr[idx] = { ...newArr[idx], aktivitasPesertaDidik: e.currentTarget.textContent || '' };
                      updateNestedText(['langkahPelaksanaan', 'tahapPenutup'], newArr as any);
                    }}
                    className={`border border-slate-300 p-1.5 ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                  >
                    {step.aktivitasPesertaDidik}
                  </td>
                  <td className="border border-slate-300 p-1.5 italic text-slate-600">
                    {step.prinsipPembelajaranMendalam}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ======================================================== */}
        {/* BAGIAN VII: MATERI LAYANAN */}
        {/* ======================================================== */}
        {document.materiLayanan && (
          <div className="mb-8 avoid-break">
            <div className="section-header-print bg-slate-100 border border-slate-300 px-3.5 py-1.5 mb-3 font-sans font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center justify-between">
              <span>BAGIAN VII — MATERI LAYANAN BIMBINGAN DAN KONSELING</span>
              <button
                type="button"
                onClick={() => setRefiningSection(refiningSection === 'materiLayanan' ? null : 'materiLayanan')}
                className="print:hidden text-[11px] font-medium text-slate-700 hover:text-slate-950 flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded border border-slate-300 shadow-2xs"
              >
                <Wand2 className="w-3 h-3 text-amber-500" />
                <span>Sempurnakan dengan AI</span>
              </button>
            </div>

            {/* Inline AI Refiner Box */}
            {refiningSection === 'materiLayanan' && (
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg mb-3 print:hidden text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Instruksi Penyempurnaan Materi Layanan:
                  </span>
                  <button onClick={() => setRefiningSection(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={refinePrompt}
                    onChange={(e) => setRefinePrompt(e.target.value)}
                    placeholder="Contoh: Tambahkan analogi yang lebih dekat dengan kehidupan murid SMP..."
                    className="flex-1 px-3 py-1.5 rounded border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
                  />
                  <button
                    onClick={() => handleRefineSubmit('materiLayanan')}
                    disabled={isRefining}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded font-bold text-xs hover:bg-slate-800 cursor-pointer flex items-center gap-1"
                  >
                    {isRefining ? 'Memproses...' : 'Kirim'}
                    <Send className="w-3 h-3" />
                  </button>
                </div>
                {refineError && <p className="text-rose-600 text-[11px] mt-1">{refineError}</p>}
              </div>
            )}

            <div className="border border-slate-300 divide-y divide-slate-200 text-xs font-sans">
              <div className="p-3 bg-slate-50/60">
                <h4 className="font-bold text-slate-950 uppercase tracking-wide text-[11px]">A. Pokok Bahasan</h4>
                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateNestedText(['materiLayanan', 'pokokBahasan'], e.currentTarget.textContent || '')}
                  className={`font-semibold text-slate-900 mt-1 ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                >
                  {document.materiLayanan.pokokBahasan}
                </p>
              </div>

              <div className="p-3">
                <h4 className="font-bold text-slate-950 uppercase tracking-wide text-[11px]">B. Uraian Materi Kontekstual</h4>
                <div
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateNestedText(['materiLayanan', 'uraianMateri'], e.currentTarget.textContent || '')}
                  className={`mt-1.5 text-slate-800 leading-relaxed whitespace-pre-line ${
                    isEditMode ? 'hover:bg-amber-50' : ''
                  }`}
                >
                  {document.materiLayanan.uraianMateri}
                </div>
              </div>

              <div className="p-3 bg-slate-50/30">
                <h4 className="font-bold text-slate-950 uppercase tracking-wide text-[11px]">C. Contoh Konkret / Realitas Peserta Didik SMP</h4>
                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateNestedText(['materiLayanan', 'contohKonkret'], e.currentTarget.textContent || '')}
                  className={`mt-1.5 text-slate-800 italic ${
                    isEditMode ? 'hover:bg-amber-50' : ''
                  }`}
                >
                  "{document.materiLayanan.contohKonkret}"
                </p>
              </div>

              {document.materiLayanan.studiKasusSkenario && (
                <div className="p-3">
                  <h4 className="font-bold text-slate-950 uppercase tracking-wide text-[11px]">D. Skenario Analisis Studi Kasus</h4>
                  <p
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => updateNestedText(['materiLayanan', 'studiKasusSkenario'], e.currentTarget.textContent || '')}
                    className={`mt-1.5 text-slate-800 ${
                      isEditMode ? 'hover:bg-amber-50' : ''
                    }`}
                  >
                    {document.materiLayanan.studiKasusSkenario}
                  </p>
                </div>
              )}

              <div className="p-3 bg-slate-50/60">
                <h4 className="font-bold text-slate-950 uppercase tracking-wide text-[11px]">E. Rangkuman & Makna Reflektif</h4>
                <p
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateNestedText(['materiLayanan', 'rangkuman'], e.currentTarget.textContent || '')}
                  className={`mt-1.5 text-slate-900 font-medium ${isEditMode ? 'hover:bg-amber-50' : ''}`}
                >
                  {document.materiLayanan.rangkuman}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BAGIAN VIII: ASESMEN */}
        {/* ======================================================== */}
        {document.asesmen && (
          <div className="mb-8 avoid-break">
            <div className="section-header-print bg-slate-100 border border-slate-300 px-3.5 py-1.5 mb-3 font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
              BAGIAN VIII — ASESMEN LAYANAN BK (AWAL, PROSES, DAN HASIL)
            </div>

            <div className="border border-slate-300 divide-y divide-slate-200 text-xs font-sans">
              {/* Asesmen Awal */}
              <div className="p-3.5 bg-white">
                <h4 className="font-bold text-slate-950 uppercase tracking-wide text-[11px] mb-2">
                  1. Asesmen Awal (Diagnostic & Pertanyaan Pemantik)
                </h4>
                <div className="space-y-1.5 text-slate-800">
                  <div>
                    <strong>Tujuan:</strong> {document.asesmen.asesmenAwal?.tujuan}
                  </div>
                  <div>
                    <strong>Petunjuk Pengisian:</strong> {document.asesmen.asesmenAwal?.petunjukPengisian}
                  </div>
                  <div>
                    <strong>Butir Pertanyaan:</strong>
                    <ol className="list-decimal pl-5 mt-1 space-y-0.5">
                      {(document.asesmen.asesmenAwal?.butirInstrumen || []).map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="text-slate-600 pt-1">
                    <strong>Kriteria Ketercapaian:</strong> {document.asesmen.asesmenAwal?.kriteriaKetercapaian}
                  </div>
                </div>
              </div>

              {/* Asesmen Proses */}
              <div className="p-3.5 bg-slate-50/40">
                <h4 className="font-bold text-slate-950 uppercase tracking-wide text-[11px] mb-2">
                  2. Asesmen Proses (Observasi Keterlibatan & Partisipasi)
                </h4>
                <div className="space-y-1.5 text-slate-800">
                  <div>
                    <strong>Tujuan:</strong> {document.asesmen.asesmenProses?.tujuan}
                  </div>
                  <div>
                    <strong>Petunjuk:</strong> {document.asesmen.asesmenProses?.petunjukPengisian}
                  </div>
                  <div>
                    <strong>Indikator Pengamatan:</strong>
                    <ol className="list-decimal pl-5 mt-1 space-y-0.5">
                      {(document.asesmen.asesmenProses?.butirInstrumen || []).map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="text-slate-600 pt-1">
                    <strong>Kriteria Ketercapaian:</strong> {document.asesmen.asesmenProses?.kriteriaKetercapaian}
                  </div>
                </div>
              </div>

              {/* Asesmen Hasil */}
              <div className="p-3.5 bg-white">
                <h4 className="font-bold text-slate-950 uppercase tracking-wide text-[11px] mb-2">
                  3. Asesmen Hasil (Evaluasi Pemahaman & Dampak Layanan)
                </h4>
                <div className="space-y-1.5 text-slate-800">
                  <div>
                    <strong>Tujuan:</strong> {document.asesmen.asesmenHasil?.tujuan}
                  </div>
                  <div>
                    <strong>Petunjuk:</strong> {document.asesmen.asesmenHasil?.petunjukPengisian}
                  </div>
                  <div>
                    <strong>Butir Evaluasi:</strong>
                    <ol className="list-decimal pl-5 mt-1 space-y-0.5">
                      {(document.asesmen.asesmenHasil?.butirInstrumen || []).map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="text-slate-600 pt-1">
                    <strong>Cara Membaca Hasil & Kriteria:</strong>{' '}
                    {document.asesmen.asesmenHasil?.caraMembacaHasil} ({document.asesmen.asesmenHasil?.kriteriaKetercapaian})
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BAGIAN IX: LKPD */}
        {/* ======================================================== */}
        {document.lkpd && (
          <div className="mb-8 avoid-break">
            <div className="section-header-print bg-slate-100 border border-slate-300 px-3.5 py-1.5 mb-3 font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
              BAGIAN IX — LEMBAR KERJA PESERTA DIDIK (LKPD)
            </div>

            <div className="border border-slate-400 p-5 text-xs font-sans space-y-3 bg-white">
              <div className="text-center pb-3 border-b-2 border-slate-300">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-0.5">SMP NEGERI 53 KOTA BEKASI</p>
                <h3 className="font-bold text-sm text-slate-950 uppercase">{document.lkpd.judulAktivitas}</h3>
                <div className="mt-2 grid grid-cols-2 text-left text-[11px] text-slate-700 max-w-md mx-auto pt-2 border-t border-slate-200">
                  <span>Nama Siswa / Kelompok : ...................................</span>
                  <span className="text-right">Kelas / Semester : ...............</span>
                </div>
              </div>

              <div>
                <strong>Tujuan Aktivitas:</strong> {document.lkpd.tujuanAktivitas}
              </div>

              <div>
                <strong>Petunjuk Pengerjaan:</strong> {document.lkpd.petunjukPengerjaan}
              </div>

              {document.lkpd.skenarioPermasalahan && (
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <strong className="text-slate-900">Skenario Masalah:</strong>
                  <p className="mt-1 text-slate-800 leading-relaxed">{document.lkpd.skenarioPermasalahan}</p>
                </div>
              )}

              <div>
                <strong>Langkah Pengerjaan:</strong>
                <ol className="list-decimal pl-5 mt-1 space-y-0.5">
                  {(document.lkpd.langkahKegiatan || []).map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ol>
              </div>

              <div>
                <strong>Pertanyaan Panduan & Diskusi Reflektif:</strong>
                <ol className="list-decimal pl-5 mt-1.5 space-y-3">
                  {(document.lkpd.pertanyaanPanduan || []).map((q, i) => (
                    <li key={i} className="font-medium text-slate-900">
                      {q}
                      <div className="h-12 mt-1.5 border border-slate-300 bg-slate-50/50 rounded p-1.5 text-[10px] text-slate-400 italic">
                        [Ruang Jawaban Peserta Didik]
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="pt-3 border-t border-slate-300">
                <strong>Komitmen & Tindakan Nyata Siswa:</strong>
                <p className="mt-1 text-slate-700 italic">{document.lkpd.kesimpulanDanKomitmen}</p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BAGIAN X: RUBRIK EVALUASI */}
        {/* ======================================================== */}
        {document.rubrikEvaluasi && (
          <div className="mb-8 avoid-break">
            <div className="section-header-print bg-slate-100 border border-slate-300 px-3.5 py-1.5 mb-2 font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
              BAGIAN X — RUBRIK EVALUASI PROSES DAN HASIL
            </div>
            <p className="text-[11px] font-sans text-slate-600 mb-2.5 italic">
              {document.rubrikEvaluasi.petunjukPenilaian}
            </p>

            <table className="w-full text-[11px] font-sans border border-slate-300 border-collapse mb-3">
              <thead>
                <tr className="bg-slate-100 text-slate-950 font-bold">
                  <th className="border border-slate-300 p-2 text-left w-1/5">Aspek yang Diamati</th>
                  <th className="border border-slate-300 p-2 text-left w-1/5">
                    Sangat Baik (4)
                  </th>
                  <th className="border border-slate-300 p-2 text-left w-1/5">
                    Berkembang Sesuai Harapan (3)
                  </th>
                  <th className="border border-slate-300 p-2 text-left w-1/5">
                    Mulai Berkembang (2)
                  </th>
                  <th className="border border-slate-300 p-2 text-left w-1/5">
                    Perlu Bimbingan (1)
                  </th>
                </tr>
              </thead>
              <tbody>
                {(document.rubrikEvaluasi.tabelRubrik || []).map((row, idx) => (
                  <tr key={idx}>
                    <td className="border border-slate-300 p-2 font-semibold bg-slate-50">{row.aspek}</td>
                    <td className="border border-slate-300 p-2">{row.skor4}</td>
                    <td className="border border-slate-300 p-2">{row.skor3}</td>
                    <td className="border border-slate-300 p-2">{row.skor2}</td>
                    <td className="border border-slate-300 p-2">{row.skor1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ======================================================== */}
        {/* BAGIAN XI: REFLEKSI PESERTA DIDIK */}
        {/* ======================================================== */}
        {document.refleksiPesertaDidik && (
          <div className="mb-8 avoid-break">
            <div className="section-header-print bg-slate-100 border border-slate-300 px-3.5 py-1.5 mb-3 font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
              BAGIAN XI — LEMBAR REFLEKSI PESERTA DIDIK
            </div>

            <div className="border border-slate-300 p-4 bg-white text-xs font-sans space-y-2.5">
              <p className="font-semibold text-slate-900 italic">{document.refleksiPesertaDidik.pengantar}</p>
              <ol className="list-decimal pl-5 space-y-2 text-slate-800">
                {(document.refleksiPesertaDidik.pertanyaanRefleksi || []).map((q, i) => (
                  <li key={i} className="leading-relaxed">
                    {q}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BAGIAN XII: REFLEKSI GURU BK */}
        {/* ======================================================== */}
        {document.refleksiGuruBK && (
          <div className="mb-8 avoid-break">
            <div className="section-header-print bg-slate-100 border border-slate-300 px-3.5 py-1.5 mb-3 font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
              BAGIAN XII — REFLEKSI GURU BIMBINGAN DAN KONSELING
            </div>

            <table className="w-full text-xs font-sans border border-slate-300 border-collapse mb-3">
              <thead>
                <tr className="bg-slate-100 text-slate-950 font-bold">
                  <th className="border border-slate-300 p-2 text-left w-1/3">Komponen Refleksi Diri</th>
                  <th className="border border-slate-300 p-2 text-left">Catatan Hasil Refleksi Guru BK</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50/70">Ketercapaian Tujuan Layanan</td>
                  <td className="border border-slate-300 p-2">{document.refleksiGuruBK.ketercapaianTujuan}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50/70">Tingkat Keterlibatan & Respons Siswa</td>
                  <td className="border border-slate-300 p-2">{document.refleksiGuruBK.keterlibatanPartisipasi}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50/70">Efektivitas Metode & Media</td>
                  <td className="border border-slate-300 p-2">{document.refleksiGuruBK.efektivitasMetodeMedia}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50/70">Ketepatan Pengelolaan Waktu (Durasi)</td>
                  <td className="border border-slate-300 p-2">{document.refleksiGuruBK.ketepatanAlokasiWaktu}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50/70">Kendala yang Dihadapi & Solusi</td>
                  <td className="border border-slate-300 p-2">{document.refleksiGuruBK.kendalaYangDihadapi}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50/70">Rencana Perbaikan Layanan Berikutnya</td>
                  <td className="border border-slate-300 p-2 text-slate-900 font-medium">
                    {document.refleksiGuruBK.rencanaTindakLanjutPerbaikan}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ======================================================== */}
        {/* BAGIAN XIII: TINDAK LANJUT */}
        {/* ======================================================== */}
        {document.tindakLanjut && (
          <div className="mb-8 avoid-break">
            <div className="section-header-print bg-slate-100 border border-slate-300 px-3.5 py-1.5 mb-3 font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
              BAGIAN XIII — RENCANA TINDAK LANJUT (FOLLOW-UP)
            </div>

            <table className="w-full text-xs font-sans border border-slate-300 border-collapse mb-3">
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold w-1/3 bg-slate-50/70">Penguatan Klasikal</td>
                  <td className="border border-slate-300 p-2">{document.tindakLanjut.penguatanKlasikal}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50/70">Bimbingan Kelompok Lanjutan</td>
                  <td className="border border-slate-300 p-2">{document.tindakLanjut.bimbinganKelompokLanjutan}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50/70">Konseling Individual / Terfokus</td>
                  <td className="border border-slate-300 p-2">{document.tindakLanjut.konselingIndividualKelompok}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50/70">Kolaborasi dengan Wali Kelas & Orang Tua</td>
                  <td className="border border-slate-300 p-2">{document.tindakLanjut.kolaborasiWaliKelasOrangTua}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50/70">Rujukan Tenaga Profesional</td>
                  <td className="border border-slate-300 p-2">{document.tindakLanjut.rujukanProfesional}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold bg-slate-50/70">Pemantauan Berkala</td>
                  <td className="border border-slate-300 p-2">{document.tindakLanjut.pemantauanPerkembangan}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ======================================================== */}
        {/* BAGIAN XIV: SUMBER DAN LAMPIRAN */}
        {/* ======================================================== */}
        <div className="mb-8 avoid-break">
          <div className="section-header-print bg-slate-100 border border-slate-300 px-3.5 py-1.5 mb-3 font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
            BAGIAN XIV — SUMBER DAN DAFTAR LAMPIRAN
          </div>

          <div className="border border-slate-300 divide-y divide-slate-200 text-xs font-sans">
            <div className="p-3 bg-white">
              <h4 className="font-bold text-slate-950 uppercase tracking-wide text-[11px] mb-1">A. Sumber Materi & Referensi Resmi</h4>
              <ul className="list-disc pl-5 space-y-0.5 text-slate-800">
                {(document.sumberDanLampiran?.sumberMateri || []).map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-50/40">
              <h4 className="font-bold text-slate-950 uppercase tracking-wide text-[11px] mb-1">B. Media & Alat Layanan</h4>
              <ul className="list-disc pl-5 space-y-0.5 text-slate-800">
                {(document.sumberDanLampiran?.mediaPembelajaran || []).map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-white">
              <h4 className="font-bold text-slate-950 uppercase tracking-wide text-[11px] mb-1">C. Daftar Lampiran Dokumen</h4>
              <ul className="list-disc pl-5 space-y-0.5 text-slate-800">
                {(document.sumberDanLampiran?.daftarLampiran || []).map((l, idx) => (
                  <li key={idx}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BAGIAN XV: PENGESAHAN DOKUMEN */}
        {/* ======================================================== */}
        <div className="mt-12 pt-6 border-t-2 border-slate-300 font-sans text-xs avoid-break">
          <div className="section-header-print bg-slate-100 border border-slate-300 px-3.5 py-1.5 mb-6 font-sans font-bold text-xs uppercase tracking-wider text-slate-900 text-center">
            LEMBAR PENGESAHAN DOKUMEN RENCANA PELAKSANAAN LAYANAN (RPL)
          </div>

          <div className="grid grid-cols-2 gap-8 text-center mt-6">
            <div>
              <p className="text-slate-700">Mengetahui,</p>
              <p className="font-bold text-slate-950 uppercase tracking-wide mt-0.5">{document.pengesahan?.jabatanKepalaSekolah}</p>
              <div className="h-20 flex items-center justify-center">
                <span className="text-[10px] text-slate-300 italic select-none">[Tanda Tangan & Cap Sekolah]</span>
              </div>
              <p
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => updateNestedText(['pengesahan', 'namaKepalaSekolah'], e.currentTarget.textContent || '')}
                className={`font-bold text-slate-950 underline text-sm tracking-wide ${isEditMode ? 'hover:bg-amber-50' : ''}`}
              >
                {document.pengesahan?.namaKepalaSekolah}
              </p>
              <p className="text-slate-700 mt-0.5 font-medium">NIP. {document.pengesahan?.nipKepalaSekolah || '-'}</p>
            </div>

            <div>
              <p className="text-slate-700">{document.pengesahan?.tempatDanTanggal}</p>
              <p className="font-bold text-slate-950 uppercase tracking-wide mt-0.5">{document.pengesahan?.jabatanGuruBK}</p>
              <div className="h-20 flex items-center justify-center">
                <span className="text-[10px] text-slate-300 italic select-none">[Tanda Tangan Guru BK]</span>
              </div>
              <p
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => updateNestedText(['pengesahan', 'namaGuruBK'], e.currentTarget.textContent || '')}
                className={`font-bold text-slate-950 underline text-sm tracking-wide ${isEditMode ? 'hover:bg-amber-50' : ''}`}
              >
                {document.pengesahan?.namaGuruBK}
              </p>
              <p className="text-slate-700 mt-0.5 font-medium">NIP. {document.pengesahan?.nipGuruBK || '-'}</p>
            </div>
          </div>
        </div>

        {/* FOOTER HALAMAN DOKUMEN RESMI A4 */}
        <div className="mt-12 pt-4 border-t border-slate-200 text-[10px] font-sans text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1 print:flex">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-700">SMPN 53 KOTA BEKASI</span>
            <span>&bull;</span>
            <span>RPL DEEP LEARNING (Fase D)</span>
            <span>&bull;</span>
            <span className="text-slate-600 font-medium">Pengembang : Hari Maktoharibi, S.Pd.</span>
          </div>
          <div className="text-right">
            <span>Dokumen Administrasi Bimbingan dan Konseling Resmi &bull; Format A4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
