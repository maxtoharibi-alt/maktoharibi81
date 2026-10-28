import React, { useState } from 'react';
import { RplFormData, KelasOption, SemesterOption, BidangLayananOption, KomponenLayananOption, JenisLayananOption, KedalamanOption } from '../types/rpl';
import { 
  TOPIC_PRESETS, 
  TopicPreset, 
  ALL_KELAS_7_TOPICS, 
  MATERI_KELAS_7_GANJIL, 
  MATERI_KELAS_7_GENAP,
  ALL_KELAS_8_TOPICS,
  MATERI_KELAS_8_GANJIL,
  MATERI_KELAS_8_GENAP,
  ALL_KELAS_9_TOPICS,
  MATERI_KELAS_9_GANJIL,
  MATERI_KELAS_9_GENAP,
  ALL_CURRICULUM_TOPICS
} from '../data/presets';
import { CurriculumCatalog } from './CurriculumCatalog';
import { 
  Sparkles, 
  RotateCcw, 
  School, 
  UserCheck, 
  BookMarked, 
  Sliders, 
  Brain, 
  Layers, 
  Lightbulb, 
  AlertCircle,
  Clock,
  Calendar,
  Users,
  CheckSquare,
  GraduationCap,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface RplFormProps {
  formData: RplFormData;
  setFormData: React.Dispatch<React.SetStateAction<RplFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  isLoading: boolean;
}

const KELAS_OPTIONS: KelasOption[] = ['VII', 'VIII', 'IX', 'Seluruh Kelas'];
const BIDANG_OPTIONS: BidangLayananOption[] = ['Pribadi', 'Sosial', 'Belajar', 'Karier'];
const KOMPONEN_OPTIONS: KomponenLayananOption[] = ['Layanan Dasar', 'Layanan Responsif', 'Perencanaan Individual', 'Dukungan Sistem'];
const JENIS_OPTIONS: JenisLayananOption[] = [
  'Bimbingan Klasikal',
  'Bimbingan Kelompok',
  'Konseling Individual',
  'Konseling Kelompok',
  'Konsultasi',
  'Kolaborasi',
  'Advokasi',
  'Layanan Informasi',
  'Layanan Orientasi',
];

const DIMENSI_OPTIONS = [
  'Keimanan dan ketakwaan terhadap Tuhan Yang Maha Esa',
  'Kewargaan',
  'Penalaran kritis',
  'Kreativitas',
  'Kolaborasi',
  'Kemandirian',
  'Kesehatan',
  'Komunikasi',
];

const METODE_AVAILABLE = [
  'Diskusi Kelompok',
  'Studi Kasus',
  'Simulasi',
  'Bermain Peran (Role Playing)',
  'Permainan Edukatif (Ice Breaking / Game)',
  'Refleksi Individu',
  'Curah Pendapat (Brainstorming)',
  'Aktivitas Tanpa Media Digital (Luring Murni)',
];

const MEDIA_AVAILABLE = [
  'LCD Proyektor & Layar',
  'Video Animasi / Studi Kasus',
  'Slide Interaktif (Canva / PPT)',
  'Kartu Kasus / Dilema Moral',
  'LKPD Cetak',
  'Sticky Notes / Kertas Metaplan',
  'Padlet / Formulir Daring',
  'Audio Relaksasi / Musik Instrumental',
];

export const RplForm: React.FC<RplFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onReset,
  isLoading,
}) => {
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const applyPreset = (preset: TopicPreset) => {
    setActivePreset(preset.id);
    setFormData((prev) => ({
      ...prev,
      ...preset.data,
    }));
    setFeedbackNotice(`Materi "${preset.label}" berhasil diterapkan ke formulir.`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const applyCurriculumTopic = (topicData: Partial<RplFormData>, label?: string) => {
    setActivePreset(null);
    setFormData((prev) => ({
      ...prev,
      ...topicData,
    }));
    const displayLabel = label || topicData.topik || 'Materi Kurikulum';
    setFeedbackNotice(`Materi "${displayLabel}" berhasil diterapkan ke formulir.`);
    setTimeout(() => setFeedbackNotice(null), 4500);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleDimensi = (dim: string) => {
    setFormData((prev) => {
      const exists = prev.dimensiProfilLulusan.includes(dim);
      return {
        ...prev,
        dimensiProfilLulusan: exists
          ? prev.dimensiProfilLulusan.filter((d) => d !== dim)
          : [...prev.dimensiProfilLulusan, dim],
      };
    });
  };

  const toggleMetode = (metode: string) => {
    setFormData((prev) => {
      const exists = prev.metodeLayanan.includes(metode);
      return {
        ...prev,
        metodeLayanan: exists
          ? prev.metodeLayanan.filter((m) => m !== metode)
          : [...prev.metodeLayanan, metode],
      };
    });
  };

  const toggleMedia = (media: string) => {
    setFormData((prev) => {
      const exists = prev.mediaTersedia.includes(media);
      return {
        ...prev,
        mediaTersedia: exists
          ? prev.mediaTersedia.filter((m) => m !== media)
          : [...prev.mediaTersedia, media],
      };
    });
  };

  const handleCheckboxChange = (name: keyof RplFormData) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const isNonKlasikal = formData.jenisLayanan !== 'Bimbingan Klasikal' && formData.jenisLayanan !== 'Layanan Informasi' && formData.jenisLayanan !== 'Layanan Orientasi';

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Toast Notice upon applying topic */}
      {feedbackNotice && (
        <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 flex items-center justify-between gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">{feedbackNotice}</p>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackNotice(null)}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Bank Materi Kurikulum BK SMP (Fase D) — Kelas 7 & Kelas 8 */}
      <CurriculumCatalog
        currentTopik={formData.topik}
        selectedKelas={formData.kelas}
        onSelectTopic={(data, label) => applyCurriculumTopic(data, label)}
      />

      {/* Preset Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-5 text-white mb-8 border border-amber-500/30 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-sm sm:text-base text-white">
              Pilihan Cepat: Topik Layanan BK SMP Populer
            </h2>
          </div>
          <span className="text-[11px] text-amber-300 font-medium">Klik untuk mengisi otomatis</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {TOPIC_PRESETS.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-[1.02]'
                    : 'bg-white/10 text-white hover:bg-white/15 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-slate-900 text-amber-300' : 'bg-blue-950/70 text-blue-200'
                    }`}
                  >
                    {preset.badge}
                  </span>
                </div>
                <h4 className="font-bold text-xs mt-1.5 leading-snug">{preset.label}</h4>
                <p
                  className={`text-[11px] mt-1 line-clamp-2 ${
                    isSelected ? 'text-slate-800 font-medium' : 'text-slate-300'
                  }`}
                >
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* ======================================================== */}
        {/* SEKSI 1: IDENTITAS LAYANAN & SEKOLAH */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <div className="p-2 bg-blue-100 text-blue-900 rounded-lg">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">1. Identitas Layanan & Satuan Pendidikan</h3>
              <p className="text-xs text-slate-500">
                Informasi administratif sekolah, konselor/guru BK, dan target kelas (dapat diedit penuh).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Satuan Pendidikan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="namaSekolah"
                value={formData.namaSekolah}
                onChange={handleTextChange}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Contoh: SMPN 53 Kota Bekasi"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kota / Kabupaten</label>
              <input
                type="text"
                name="kota"
                value={formData.kota}
                onChange={handleTextChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Kota Bekasi"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Guru BK / Konselor <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="namaGuruBK"
                value={formData.namaGuruBK}
                onChange={handleTextChange}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Nama lengkap & gelar"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Guru BK</label>
              <input
                type="text"
                name="nipGuruBK"
                value={formData.nipGuruBK}
                onChange={handleTextChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Contoh: 19800101 200501 1 001 atau -"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
              <input
                type="text"
                name="namaKepalaSekolah"
                value={formData.namaKepalaSekolah}
                onChange={handleTextChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Nama Kepala Sekolah & gelar"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                name="nipKepalaSekolah"
                value={formData.nipKepalaSekolah}
                onChange={handleTextChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="NIP Kepala Sekolah atau -"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Pelajaran</label>
              <input
                type="text"
                name="tahunPelajaran"
                value={formData.tahunPelajaran}
                onChange={handleTextChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="2026/2027"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleTextChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800 bg-white"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sasaran Kelas & Fase <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  name="kelas"
                  value={formData.kelas}
                  onChange={handleTextChange}
                  className="px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800 bg-white"
                >
                  {KELAS_OPTIONS.map((k) => (
                    <option key={k} value={k}>
                      Kelas {k}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="fase"
                  value={formData.fase}
                  onChange={handleTextChange}
                  className="px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                  placeholder="Fase D"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Pelaksanaan</label>
              <input
                type="text"
                name="tanggalPelaksanaan"
                value={formData.tanggalPelaksanaan}
                onChange={handleTextChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Contoh: 15 Agustus 2026"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Peserta Didik</label>
              <input
                type="text"
                name="jumlahPesertaDidik"
                value={formData.jumlahPesertaDidik}
                onChange={handleTextChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Contoh: 32 Peserta Didik"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SEKSI 2: PARAMETER LAYANAN BK & TOPIK */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <div className="p-2 bg-indigo-100 text-indigo-900 rounded-lg">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">2. Parameter Layanan BK & Topik</h3>
              <p className="text-xs text-slate-500">
                Tentukan komponen, bidang, jenis layanan, serta topik utama bimbingan.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Bidang Layanan Chips */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Bidang Layanan BK <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {BIDANG_OPTIONS.map((b) => {
                  const isSel = formData.bidangLayanan === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, bidangLayanan: b }))}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        isSel
                          ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      Bidang {b}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Komponen & Jenis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Komponen Layanan <span className="text-rose-500">*</span>
                </label>
                <select
                  name="komponenLayanan"
                  value={formData.komponenLayanan}
                  onChange={handleTextChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800 bg-white"
                >
                  {KOMPONEN_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenis Layanan <span className="text-rose-500">*</span>
                </label>
                <select
                  name="jenisLayanan"
                  value={formData.jenisLayanan}
                  onChange={handleTextChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800 bg-white"
                >
                  {JENIS_OPTIONS.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fungsi Layanan</label>
                <input
                  type="text"
                  name="fungsiLayanan"
                  value={formData.fungsiLayanan}
                  onChange={handleTextChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                  placeholder="Pemahaman, Pencegahan, Pengembangan"
                />
              </div>
            </div>

            {/* Non-classical alert if selected */}
            {isNonKlasikal && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Penyesuaian Format:</span> Anda memilih <strong>{formData.jenisLayanan}</strong>. AI akan menyesuaikan langkah kegiatan menjadi setting bimbingan terfokus/kelompok/individual, bukan dipaksakan menjadi pembelajaran klasikal penuh.
                </div>
              </div>
            )}

            {/* Topik Layanan with Quick Selector */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Topik / Tema Layanan <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-semibold text-blue-900 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">Pilih Cepat:</span>
                  </span>
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      const found = ALL_CURRICULUM_TOPICS.find((t) => t.id === val);
                      if (found) {
                        applyCurriculumTopic(found.data, found.judul);
                      }
                    }}
                    defaultValue=""
                    className="px-2 py-1 text-xs font-medium rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-950 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-blue-800 cursor-pointer max-w-[280px] sm:max-w-xs truncate"
                  >
                    <option value="" disabled>-- Pilih dari 34 Materi Resmi (K7, K8, K9) --</option>
                    <optgroup label="🚀 Kelas 9 — Sem. Ganjil (Karier Mandiri & Ujian Kelulusan)">
                      {MATERI_KELAS_9_GANJIL.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nomor}. {m.judul} ({m.bidang})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🚀 Kelas 9 — Sem. Genap (SMA vs SMK & Keputusan Realistis)">
                      {MATERI_KELAS_9_GENAP.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nomor}. {m.judul} ({m.bidang})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🌟 Kelas 8 — Sem. Ganjil (Karakter & Pengendalian Diri)">
                      {MATERI_KELAS_8_GANJIL.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nomor}. {m.judul} ({m.bidang})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🌟 Kelas 8 — Sem. Genap (Peer Pressure, Karier & Emosi)">
                      {MATERI_KELAS_8_GENAP.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nomor}. {m.judul} ({m.bidang})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🎓 Kelas 7 — Sem. Ganjil (Adaptasi & Pengenalan Diri)">
                      {MATERI_KELAS_7_GANJIL.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nomor}. {m.judul} ({m.bidang})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🎓 Kelas 7 — Sem. Genap (Relasi & Karakter Sehat)">
                      {MATERI_KELAS_7_GENAP.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nomor}. {m.judul} ({m.bidang})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>
              <input
                type="text"
                name="topik"
                value={formData.topik}
                onChange={handleTextChange}
                required
                className="w-full px-3.5 py-2.5 text-sm font-semibold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800 text-blue-950"
                placeholder="Contoh: Pengenalan lingkungan sekolah baru dan tata tertib sekolah."
              />
            </div>

            {/* Alokasi Waktu */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Format Alokasi Waktu <span className="text-rose-500">*</span>
                </label>
                <select
                  name="alokasiWaktu"
                  value={formData.alokasiWaktu}
                  onChange={(e) => {
                    const val = e.target.value;
                    let menit = 80;
                    if (val.includes('2 x 40 Menit')) menit = 80;
                    else if (val.includes('1 x 40 Menit')) menit = 40;
                    else if (val.includes('3 x 40 Menit')) menit = 120;
                    else if (val.includes('45 Menit')) menit = 45;
                    else if (val.includes('1 JP')) menit = 40;
                    else if (val.includes('2 JP')) menit = 80;
                    setFormData((prev) => ({
                      ...prev,
                      alokasiWaktu: val,
                      durasiMenit: menit,
                    }));
                  }}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800 bg-white"
                >
                  <option value="1 JP (2 x 40 Menit)">1 JP (2 x 40 Menit) = 80 Menit</option>
                  <option value="2 JP (2 x 40 Menit)">2 JP (2 x 40 Menit) = 80 Menit</option>
                  <option value="1 JP (1 x 40 Menit)">1 JP (1 x 40 Menit) = 40 Menit</option>
                  <option value="1 x 45 Menit">1 x 45 Menit</option>
                  <option value="3 JP (3 x 40 Menit)">3 JP (3 x 40 Menit) = 120 Menit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Durasi Hitungan AI (Menit)
                </label>
                <input
                  type="number"
                  name="durasiMenit"
                  value={formData.durasiMenit}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, durasiMenit: parseInt(e.target.value, 10) || 80 }))
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                />
                <span className="text-[10px] text-slate-400">Total durasi seluruh langkah kegiatan</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Pertemuan</label>
                <input
                  type="text"
                  name="jumlahPertemuan"
                  value={formData.jumlahPertemuan}
                  onChange={handleTextChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                  placeholder="1 Pertemuan"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SEKSI 3: IDENTIFIKASI KEBUTUHAN PESERTA DIDIK */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <div className="p-2 bg-emerald-100 text-emerald-900 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">3. Identifikasi Kebutuhan Peserta Didik</h3>
              <p className="text-xs text-slate-500">
                Pondasi RPL berbasis asesmen nyata. Jika belum ada data spesifik, sistem akan menandai dengan jelas tanpa mengarang data.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hasil Asesmen Kebutuhan (AKPD / Aum / Sosiometri / Observasi)
              </label>
              <textarea
                name="hasilAsesmenKebutuhan"
                value={formData.hasilAsesmenKebutuhan}
                onChange={handleTextChange}
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Contoh: Berdasarkan data AKPD 60% peserta didik mengalami kesulitan membagi waktu antara bermain game dengan mengerjakan tugas sekolah..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Permasalahan yang Ditemukan (Prioritas)
                </label>
                <textarea
                  name="permasalahanDitemukan"
                  value={formData.permasalahanDitemukan}
                  onChange={handleTextChange}
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                  placeholder="Contoh: Sering menunda tugas hingga malam hari, merasa cemas saat deadline mendekat..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Karakteristik Perkembangan Peserta Didik
                </label>
                <textarea
                  name="karakteristikPesertaDidik"
                  value={formData.karakteristikPesertaDidik}
                  onChange={handleTextChange}
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                  placeholder="Contoh: Remaja awal Fase D, mudah terpengaruh kelompok sebaya, membutuhkan contoh konkret visual..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kesiapan Belajar</label>
                <input
                  type="text"
                  name="kesiapanBelajar"
                  value={formData.kesiapanBelajar}
                  onChange={handleTextChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                  placeholder="Sadar butuh perbaikan namun bingung cara mulai"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pengalaman Awal Siswa</label>
                <input
                  type="text"
                  name="pengalamanAwal"
                  value={formData.pengalamanAwal}
                  onChange={handleTextChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                  placeholder="Pernah ditegur guru karena terlambat kumpul tugas"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Potensi & Kekuatan Siswa</label>
                <input
                  type="text"
                  name="potensiKekuatan"
                  value={formData.potensiKekuatan}
                  onChange={handleTextChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                  placeholder="Kreatif, antusias dengan simulasi dan media digital"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kebutuhan Khusus / Akomodasi Pembelajaran yang Relevan (Tanpa data sensitif)
              </label>
              <input
                type="text"
                name="kebutuhanKhusus"
                value={formData.kebutuhanKhusus}
                onChange={handleTextChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Contoh: Akomodasi visual dan penjelasan langkah bertahap bagi siswa yang cepat lelah berkonsentrasi"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SEKSI 4: PREFERENSI PEMBELAJARAN MENDALAM (DEEP LEARNING) */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-lg">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                4. Desain Pendekatan Pembelajaran Mendalam (Deep Learning)
              </h3>
              <p className="text-xs text-slate-500">
                Pilih metode, model pedagogis, media interaktif, serta dimensi profil lulusan yang relevan.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Model / Strategi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Model / Strategi Pembelajaran Mendalam
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        modelStrategi: 'Model ARKA (Aktivitas - Refleksi - Konsep - Aplikasi)',
                      }))
                    }
                    className="text-[11px] font-bold text-blue-900 bg-blue-100/80 hover:bg-blue-200/90 px-2 py-0.5 rounded-full border border-blue-300 transition-colors cursor-pointer flex items-center gap-1"
                    title="Pilih Model ARKA langsung"
                  >
                    <span>⭐ Pilih Model ARKA</span>
                  </button>
                </div>
                <select
                  name="modelStrategi"
                  value={formData.modelStrategi}
                  onChange={handleTextChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800 bg-white font-medium"
                >
                  <option value="Model ARKA (Aktivitas - Refleksi - Konsep - Aplikasi)">
                    ⭐ Model ARKA (Aktivitas - Refleksi - Konsep - Aplikasi)
                  </option>
                  <option value="Experiential Learning (Kolb: Pengalaman Konkret, Refleksi, Konseptualisasi, Aplikasi)">
                    Experiential Learning (Kolb)
                  </option>
                  <option value="Problem Based Learning (PBL) dipadukan dengan Studi Kasus">
                    Problem Based Learning (PBL)
                  </option>
                  <option value="Inkuiri Terbimbing & Clarification of Values (VCT)">
                    Inkuiri Terbimbing & Nilai (VCT)
                  </option>
                  <option value="Social Emotional Learning (SEL) & Pembelajaran Reflektif">
                    Social Emotional Learning (SEL)
                  </option>
                  <option value="Bermain Peran (Role Playing) & Simulasi Perilaku">
                    Role Playing & Simulasi
                  </option>
                  <option value="AI menentukan model yang paling sesuai dengan topik">
                    (Rekomendasi) AI Menentukan yang Paling Sesuai
                  </option>
                </select>

                {/* Model ARKA Informational Explanation Card */}
                {formData.modelStrategi.includes('ARKA') && (
                  <div className="mt-2.5 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl text-xs text-blue-950">
                    <div className="font-bold flex items-center gap-1.5 text-blue-900 mb-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Sintaks 4 Tahap Model ARKA dalam Layanan BK:</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="bg-white/90 p-2 rounded-lg border border-blue-100 shadow-2xs">
                        <span className="font-black text-blue-800 block">1. Aktivitas (A)</span>
                        <p className="text-slate-600 mt-0.5">Pengalaman konkret, games, simulasi, atau studi kasus.</p>
                      </div>
                      <div className="bg-white/90 p-2 rounded-lg border border-blue-100 shadow-2xs">
                        <span className="font-black text-amber-800 block">2. Refleksi (R)</span>
                        <p className="text-slate-600 mt-0.5">Eksplorasi rasa, analisis pengalaman, & insight batin.</p>
                      </div>
                      <div className="bg-white/90 p-2 rounded-lg border border-blue-100 shadow-2xs">
                        <span className="font-black text-emerald-800 block">3. Konsep (K)</span>
                        <p className="text-slate-600 mt-0.5">Konstruksi wawasan esensial BK & nilai karakter.</p>
                      </div>
                      <div className="bg-white/90 p-2 rounded-lg border border-blue-100 shadow-2xs">
                        <span className="font-black text-purple-800 block">4. Aplikasi (A)</span>
                        <p className="text-slate-600 mt-0.5">Rencana aksi nyata & komitmen hidup sehari-hari.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pemanfaatan Teknologi Digital (Aman & Edukatif)
                </label>
                <input
                  type="text"
                  name="pemanfaatanDigital"
                  value={formData.pemanfaatanDigital}
                  onChange={handleTextChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                  placeholder="Contoh: Video kasus nyata, kuis interaktif, Padlet refleksi anonim"
                />
              </div>
            </div>

            {/* Metode Layanan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Metode Layanan yang Digunakan (Pilih beberapa):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {METODE_AVAILABLE.map((m) => {
                  const checked = formData.metodeLayanan.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMetode(m)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer flex items-center justify-between ${
                        checked
                          ? 'bg-blue-50 border-blue-600 text-blue-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{m}</span>
                      {checked && <CheckSquare className="w-3.5 h-3.5 text-blue-800 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Media Tersedia */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Media & Sarana Tersedia di Sekolah:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MEDIA_AVAILABLE.map((media) => {
                  const checked = formData.mediaTersedia.includes(media);
                  return (
                    <button
                      key={media}
                      type="button"
                      onClick={() => toggleMedia(media)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer flex items-center justify-between ${
                        checked
                          ? 'bg-amber-50 border-amber-600 text-amber-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{media}</span>
                      {checked && <CheckSquare className="w-3.5 h-3.5 text-amber-700 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 8 Dimensi Profil Lulusan */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Dimensi Profil Lulusan (Pilih 2-4 dimensi yang benar-benar relevan):
                </label>
                <span className="text-[11px] text-slate-400">
                  Terpilih: {formData.dimensiProfilLulusan.length} dimensi
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DIMENSI_OPTIONS.map((dim) => {
                  const checked = formData.dimensiProfilLulusan.includes(dim);
                  return (
                    <button
                      key={dim}
                      type="button"
                      onClick={() => toggleDimensi(dim)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer flex items-center justify-between ${
                        checked
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate" title={dim}>
                        {dim}
                      </span>
                      {checked && <CheckSquare className="w-3.5 h-3.5 text-indigo-800 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SEKSI 5: PENGATURAN KELENGKAPAN OUTPUT & INSTRUKSI */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <div className="p-2 bg-purple-100 text-purple-900 rounded-lg">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">5. Pengaturan Dokumen & Kelengkapan Output</h3>
              <p className="text-xs text-slate-500">
                Pilih komponen lampiran yang ingin disertakan ke dalam dokumen cetak resmi.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Tingkat Kedalaman */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Tingkat Kedalaman Dokumen:</label>
              <div className="grid grid-cols-3 gap-3">
                {(['Ringkas', 'Lengkap', 'Sangat Terperinci'] as KedalamanOption[]).map((level) => {
                  const isSel = formData.kedalaman === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, kedalaman: level }))}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        isSel
                          ? 'bg-purple-900 text-white border-purple-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      RPL {level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Checkbox Options */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Sertakan Lampiran & Bagian Tambahan:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={formData.sertakanLkpd}
                    onChange={() => handleCheckboxChange('sertakanLkpd')}
                    className="w-4 h-4 text-blue-900 rounded"
                  />
                  <span>Tambahkan LKPD Interaktif</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={formData.sertakanAsesmen}
                    onChange={() => handleCheckboxChange('sertakanAsesmen')}
                    className="w-4 h-4 text-blue-900 rounded"
                  />
                  <span>Instrumen Asesmen (Awal, Proses, Hasil)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={formData.sertakanRubrik}
                    onChange={() => handleCheckboxChange('sertakanRubrik')}
                    className="w-4 h-4 text-blue-900 rounded"
                  />
                  <span>Rubrik Evaluasi (4 Skala Capaian)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={formData.sertakanRefleksi}
                    onChange={() => handleCheckboxChange('sertakanRefleksi')}
                    className="w-4 h-4 text-blue-900 rounded"
                  />
                  <span>Lembar Refleksi Siswa & Guru BK</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={formData.sertakanMateri}
                    onChange={() => handleCheckboxChange('sertakanMateri')}
                    className="w-4 h-4 text-blue-900 rounded"
                  />
                  <span>Materi Layanan & Studi Kasus</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={formData.sertakanTindakLanjut}
                    onChange={() => handleCheckboxChange('sertakanTindakLanjut')}
                    className="w-4 h-4 text-blue-900 rounded"
                  />
                  <span>Program Tindak Lanjut Layanan</span>
                </label>
              </div>
            </div>

            {/* Instruksi Khusus */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instruksi Khusus untuk AI (Opsional)
              </label>
              <textarea
                name="instruksiKhusus"
                value={formData.instruksiKhusus}
                onChange={handleTextChange}
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800"
                placeholder="Contoh: Sertakan analogi menarik yang mudah diingat anak SMP; Tekankan ice breaking yang melibatkan gerak fisik..."
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ACTION BAR */}
        {/* ======================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onReset}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>RESET FORMULIR</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all cursor-pointer ${
              isLoading
                ? 'bg-blue-800 opacity-80 cursor-wait'
                : 'bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 hover:from-blue-800 hover:to-indigo-900 shadow-blue-900/20 active:scale-98'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>MEMPROSES RPL PEMBELAJARAN MENDALAM...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>GENERATE RPL (RPM)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
