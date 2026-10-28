/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RplFormData, RplDocument } from './types/rpl';
import { TOPIC_PRESETS } from './data/presets';
import { getSavedDrafts, deleteDraft, getLastFormData, saveLastFormData } from './utils/storageUtils';
import { Header } from './components/Header';
import { RplForm } from './components/RplForm';
import { DocumentPreview } from './components/DocumentPreview';
import { SavedDraftsList } from './components/SavedDraftsList';
import { DeepLearningGuideModal } from './components/DeepLearningGuideModal';
import { AlertCircle, Sparkles, Heart, Compass, Smile, RefreshCw } from 'lucide-react';

const INITIAL_FORM_DATA: RplFormData = {
  namaSekolah: 'SMPN 53 Kota Bekasi',
  namaGuruBK: 'Hari Maktoharibi, S.Pd.',
  nipGuruBK: '19811005 202321 1 007',
  namaKepalaSekolah: 'Arief Purnama, S.Pd.',
  nipKepalaSekolah: '19730311 201412 1 001',
  kota: 'Kota Bekasi',
  tahunPelajaran: '2026/2027',
  semester: 'Ganjil',
  kelas: 'VIII',
  fase: 'Fase D',
  komponenLayanan: 'Layanan Dasar',
  bidangLayanan: 'Sosial',
  jenisLayanan: 'Bimbingan Klasikal',
  fungsiLayanan: 'Pencegahan, Pemahaman, dan Pengembangan',
  topik: 'Cerdas Bermedia Sosial: Membangun Empati Digital dan Melawan Cyberbullying',
  alokasiWaktu: '1 JP (2 x 40 Menit)',
  durasiMenit: 80,
  jumlahPertemuan: '1 Pertemuan',
  tanggalPelaksanaan: '12 September 2026',
  jumlahPesertaDidik: '32 Peserta Didik',

  hasilAsesmenKebutuhan:
    'Hasil AKPD menunjukkan 68% peserta didik aktif di media sosial dan 35% pernah melihat komentar saling mencemooh dalam grup percakapan daring.',
  permasalahanDitemukan:
    'Kecenderungan meremehkan dampak perkataan di media sosial karena menganggap hanya sekadar lelucon, serta keengganan melapor saat melihat teman dirundung.',
  karakteristikPesertaDidik:
    'Remaja awal usia 13-14 tahun Fase D dengan rasa ingin tahu tinggi, sangat dipengaruhi kelompok sebaya, dan emosi fluktuatif.',
  kesiapanBelajar:
    'Mayoritas telah memiliki akun media sosial namun pemahaman etika digital dan empati masih perlu dikembangkan.',
  pengalamanAwal: 'Pernah melihat perdebatan atau saling sindir di status WhatsApp antar teman sekelas.',
  potensiKekuatan: 'Antusiasme tinggi terhadap studi kasus berbasis konten digital/video pendek.',
  kebutuhanKhusus: 'Pendampingan khusus bagi peserta didik yang memiliki kecenderungan menarik diri.',

  metodeLayanan: ['Diskusi Kelompok', 'Studi Kasus', 'Refleksi Individu', 'Bermain Peran (Role Playing)'],
  modelStrategi: 'Problem Based Learning (PBL) dipadukan dengan Experiential Learning',
  mediaTersedia: ['LCD Proyektor & Layar', 'Video Animasi / Studi Kasus', 'Kartu Kasus / Dilema Moral', 'LKPD Cetak'],
  pemanfaatanDigital: 'Penayangan video kasus nyata cyberbullying dan media refleksi interaktif.',
  dimensiProfilLulusan: ['Penalaran kritis', 'Kolaborasi', 'Komunikasi', 'Kewargaan'],

  kedalaman: 'Lengkap',
  sertakanLkpd: true,
  sertakanAsesmen: true,
  sertakanRubrik: true,
  sertakanRefleksi: true,
  sertakanMateri: true,
  sertakanTindakLanjut: true,
  instruksiKhusus:
    'Terapkan 3 prinsip Deep Learning: Berkesadaran (refleksi jejak digital), Bermakna (empati terhadap korban), dan Menggembirakan (simulasi saling mendukung).',
};

const LOADING_STEPS = [
  { text: 'Menganalisis kebutuhan peserta didik & karakteristik Fase D SMP...', icon: Compass },
  { text: 'Merumuskan tujuan operasional (KKO Bloom) & indikator ketercapaian...', icon: Sparkles },
  { text: 'Mengintegrasikan 3 Prinsip Deep Learning: Berkesadaran, Bermakna, Menggembirakan...', icon: Heart },
  { text: 'Menghitung alokasi waktu presisi per tahap (Awal, Transisi, Inti, Penutup)...', icon: Smile },
  { text: 'Menyusun materi kontekstual, instrumen asesmen, LKPD interaktif, & rubrik...', icon: Sparkles },
];

export default function App() {
  const [formData, setFormData] = useState<RplFormData>(() => {
    return getLastFormData() || INITIAL_FORM_DATA;
  });

  const [activeTab, setActiveTab] = useState<'form' | 'preview' | 'drafts'>('form');
  const [generatedDoc, setGeneratedDoc] = useState<RplDocument | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [savedDrafts, setSavedDrafts] = useState(() => getSavedDrafts());

  // Save last form data in local storage
  useEffect(() => {
    saveLastFormData(formData);
  }, [formData]);

  // Loading animation step rotator
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStepIdx(0);
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.topik.trim()) {
      setErrorMessage('Topik atau tema layanan wajib diisi.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-rpl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal menghasilkan dokumen RPL.');
      }

      setGeneratedDoc(result.data);
      setActiveTab('preview');
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Generation Error:', err);
      setErrorMessage(err.message || 'Terjadi kesalahan teknis saat menghubungi server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh isian formulir ke nilai awal?')) {
      setFormData(INITIAL_FORM_DATA);
      setErrorMessage(null);
    }
  };

  const handleSelectDraft = (doc: RplDocument, draftForm?: RplFormData) => {
    setGeneratedDoc(doc);
    if (draftForm) {
      setFormData(draftForm);
    }
    setActiveTab('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteDraft = (id: string) => {
    if (window.confirm('Hapus draf ini dari arsip perangkat?')) {
      deleteDraft(id);
      setSavedDrafts(getSavedDrafts());
    }
  };

  const CurrentLoadingIcon = LOADING_STEPS[loadingStepIdx].icon;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasDocument={!!generatedDoc}
        draftsCount={savedDrafts.length}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {/* Error Alert */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto mt-6 px-4">
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 flex items-start justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Gagal Menghasilkan RPL</h4>
                  <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
                </div>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="px-2.5 py-1 text-xs font-semibold text-rose-800 bg-rose-200/60 hover:bg-rose-200 rounded-lg cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="max-w-2xl mx-auto my-12 px-4 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-900 animate-spin flex items-center justify-center"></div>
                <div className="absolute inset-0 flex items-center justify-center text-amber-500">
                  <CurrentLoadingIcon className="w-8 h-8 animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                AI Sedang Menyusun Dokumen RPL Pembelajaran Mendalam
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                SMPN 53 Kota Bekasi • Kurikulum Merdeka Fase D
              </p>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-950 max-w-lg transition-all duration-300">
                {LOADING_STEPS[loadingStepIdx].text}
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Form Input */}
        {!isLoading && activeTab === 'form' && (
          <RplForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleGenerate}
            onReset={handleResetForm}
            isLoading={isLoading}
          />
        )}

        {/* Tab 2: Document Preview */}
        {!isLoading && activeTab === 'preview' && (
          <>
            {generatedDoc ? (
              <DocumentPreview
                document={generatedDoc}
                formData={formData}
                onEditInput={() => setActiveTab('form')}
                onRegenerate={handleGenerate}
                onUpdateDocument={(newDoc) => setGeneratedDoc(newDoc)}
                onSaveDraft={() => setSavedDrafts(getSavedDrafts())}
              />
            ) : (
              <div className="max-w-2xl mx-auto py-16 px-4 text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200">
                  <Sparkles className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Belum Ada Dokumen yang Dibuat</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mt-1 mb-6">
                  Silakan isi formulir atau pilih topik preset pada tab Formulir, kemudian klik "GENERATE RPL".
                </p>
                <button
                  onClick={() => setActiveTab('form')}
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow cursor-pointer"
                >
                  Buka Formulir Input
                </button>
              </div>
            )}
          </>
        )}

        {/* Tab 3: Saved Drafts */}
        {!isLoading && activeTab === 'drafts' && (
          <SavedDraftsList
            drafts={savedDrafts}
            onSelectDraft={handleSelectDraft}
            onDeleteDraft={handleDeleteDraft}
            onNewRpl={() => setActiveTab('form')}
          />
        )}
      </main>

      {/* Guide Modal */}
      <DeepLearningGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-200">
              Pengembang : Hari Maktoharibi, S.Pd.
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Berbasis Pendekatan Pembelajaran Mendalam (Deep Learning: Berkesadaran, Bermakna, Menggembirakan)
            </p>
          </div>
          <div className="text-[11px] text-slate-500">
            Format Resmi Cetak A4 • Siap Ekspor Word (.doc) & PDF
          </div>
        </div>
      </footer>
    </div>
  );
}
