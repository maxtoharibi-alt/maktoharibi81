import React from 'react';
import { X, Sparkles, Heart, Compass, Smile, CheckCircle, ShieldAlert, Award } from 'lucide-react';

interface DeepLearningGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeepLearningGuideModal: React.FC<DeepLearningGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white px-6 py-4 flex items-center justify-between border-b border-amber-400/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-400/30 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Panduan Pembelajaran Mendalam (Deep Learning) BK</h2>
              <p className="text-xs text-blue-200">Integrasi Pedagogis Layanan Bimbingan & Konseling SMP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* 3 Prinsip */}
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-rose-600" />
              <span>3 Prinsip Utama Pembelajaran Mendalam (Deep Learning)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200">
                <div className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  1. Berkesadaran (Mindful)
                </div>
                <p className="text-xs text-slate-600">
                  Peserta didik hadir secara utuh, menyadari perasaan batin, pikiran, dan motif tindakan tanpa tergesa-gesa. Guru BK memfasilitasi suasana hening, grounding, dan self-awareness.
                </p>
              </div>

              <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200">
                <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  2. Bermakna (Meaningful)
                </div>
                <p className="text-xs text-slate-600">
                  Materi layanan terhubung erat dengan realitas hidup anak SMP (relasi teman sebaya, media sosial, tugas belajar, cita-cita), bukan sekadar teori hafalan atau nasihat pasif.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200">
                <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  3. Menggembirakan (Joyful)
                </div>
                <p className="text-xs text-slate-600">
                  Proses layanan memicu antusiasme, rasa aman psikologis, interaksi hangat, humor edukatif, permainan peran, dan kelegaan batin tanpa rasa takut dihakimi.
                </p>
              </div>
            </div>
          </div>

          {/* 3 Tahap Pengalaman Belajar */}
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Compass className="w-5 h-5 text-indigo-600" />
              <span>3 Tahap Pengalaman Belajar Mendalam</span>
            </h3>
            <div className="space-y-2.5">
              <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">MEMAHAMI (Mindful Understanding)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Mengenali konsep emosi, perilaku, atau pilihan hidup; menghubungkan dengan pengalaman pribadi masa lalu; mengidentifikasi fenomena dalam dinamika kelas/keluarga.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">MENGAPLIKASI (Meaningful Application)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Mempraktikkan keterampilan komunikasi asertif, simulasi menolak ajakan negatif, menyelesaikan studi kasus dilema moral, dan menyusun jadwal belajar realistis.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">MEREFLEKSI (Joyful Reflection & Commitment)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Mengevaluasi diri secara jujur: "Apa yang saya sadari?", "Apa yang ingin saya perbaiki?", dan menetapkan komitmen tindakan nyata di buku harian atau pohon komitmen.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Model ARKA */}
          <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200 rounded-xl">
            <h3 className="text-base font-bold text-blue-950 flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Model RPL ARKA (Aktivitas - Refleksi - Konsep - Aplikasi)</span>
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              Model ARKA adalah sintaks pembelajaran pengalaman (experiential learning) khas Bimbingan & Konseling yang sangat efektif untuk mewujudkan Pembelajaran Mendalam di SMP:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-2xs">
                <span className="font-bold text-blue-900 block mb-1">1. Aktivitas (A)</span>
                <p className="text-slate-600 text-[11px]">
                  Peserta didik diajak mengalami fenomena langsung melalui permainan edukatif, simulasi, penayangan video, studi kasus, atau dinamika kelompok.
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-2xs">
                <span className="font-bold text-amber-800 block mb-1">2. Refleksi (R)</span>
                <p className="text-slate-600 text-[11px]">
                  Guru BK memandu pengolahan rasa batin: mengeksplorasi apa yang dirasakan, dipikirkan, dan dipelajari dari pengalaman aktivitas.
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-2xs">
                <span className="font-bold text-emerald-800 block mb-1">3. Konsep (K)</span>
                <p className="text-slate-600 text-[11px]">
                  Membangun wawasan baru dan mengonstruksi pemahaman esensial tentang nilai-nilai karakter, teori praktis BK, dan etika kehidupan.
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-2xs">
                <span className="font-bold text-purple-800 block mb-1">4. Aplikasi (A)</span>
                <p className="text-slate-600 text-[11px]">
                  Peserta didik merumuskan rencana aksi konkret (Action Plan), lembar komitmen diri, dan transfer solusi dalam situasi nyata sehari-hari.
                </p>
              </div>
            </div>
          </div>

          {/* 8 Dimensi Profil Lulusan */}
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-amber-600" />
              <span>8 Dimensi Profil Lulusan</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                '1. Keimanan & Ketakwaan',
                '2. Kewargaan',
                '3. Penalaran Kritis',
                '4. Kreativitas',
                '5. Kolaborasi',
                '6. Kemandirian',
                '7. Kesehatan',
                '8. Komunikasi'
              ].map(dim => (
                <div key={dim} className="p-2.5 rounded-lg bg-slate-100 font-medium text-slate-800 border border-slate-200">
                  {dim}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 italic">
              *Catatan: Pilih 2 hingga 4 dimensi yang paling relevan dengan topik layanan BK Anda. Hindari memaksakan seluruh 8 dimensi pada setiap RPL.
            </p>
          </div>

          {/* Etika Asesmen BK */}
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Kode Etik & Keamanan Psikologis:</span> Instrumen asesmen BK berfungsi sebagai pemandu perkembangan dan fasilitasi refleksi, <strong>bukan</strong> untuk diagnosis patologis klinis atau memberi label negatif kepada siswa. Data yang belum tersedia akan ditandai dengan jelas agar tidak mengarang data asesmen.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg text-xs transition-colors cursor-pointer"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
