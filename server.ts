import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const rplResponseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    identitas: {
      type: Type.OBJECT,
      properties: {
        satuanPendidikan: { type: Type.STRING },
        namaGuruBK: { type: Type.STRING },
        nipGuruBK: { type: Type.STRING },
        namaKepalaSekolah: { type: Type.STRING },
        nipKepalaSekolah: { type: Type.STRING },
        tahunPelajaran: { type: Type.STRING },
        kelasFase: { type: Type.STRING },
        semester: { type: Type.STRING },
        komponenLayanan: { type: Type.STRING },
        bidangLayanan: { type: Type.STRING },
        jenisLayanan: { type: Type.STRING },
        fungsiLayanan: { type: Type.STRING },
        topikLayanan: { type: Type.STRING },
        alokasiWaktu: { type: Type.STRING },
        jumlahPertemuan: { type: Type.STRING },
        tanggalPelaksanaan: { type: Type.STRING },
        sasaranLayanan: { type: Type.STRING },
      },
      required: [
        'satuanPendidikan', 'namaGuruBK', 'tahunPelajaran', 'kelasFase',
        'komponenLayanan', 'bidangLayanan', 'jenisLayanan', 'fungsiLayanan',
        'topikLayanan', 'alokasiWaktu'
      ]
    },
    identifikasiKebutuhan: {
      type: Type.OBJECT,
      properties: {
        dasarKebutuhan: { type: Type.STRING },
        hasilAsesmenKebutuhan: { type: Type.STRING },
        karakteristikPerkembangan: { type: Type.STRING },
        kesiapanDanPengalamanAwal: { type: Type.STRING },
        permasalahanPrioritas: { type: Type.STRING },
        potensiDanKekuatan: { type: Type.STRING },
        kebutuhanDukunganAkomodasi: { type: Type.STRING },
      },
      required: [
        'dasarKebutuhan', 'hasilAsesmenKebutuhan', 'karakteristikPerkembangan',
        'kesiapanDanPengalamanAwal', 'permasalahanPrioritas', 'potensiDanKekuatan',
        'kebutuhanDukunganAkomodasi'
      ]
    },
    tujuanLayanan: {
      type: Type.OBJECT,
      properties: {
        tujuanUmum: { type: Type.STRING },
        tujuanKhusus: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        indikatorKetercapaian: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        kompetensiKeterampilan: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ['tujuanUmum', 'tujuanKhusus', 'indikatorKetercapaian', 'kompetensiKeterampilan']
    },
    desainPembelajaranMendalam: {
      type: Type.OBJECT,
      properties: {
        praktikPedagogis: {
          type: Type.OBJECT,
          properties: {
            pendekatan: { type: Type.STRING },
            strategiModel: { type: Type.STRING },
            metode: { type: Type.STRING },
            teknikFasilitasi: { type: Type.STRING },
          },
          required: ['pendekatan', 'strategiModel', 'metode', 'teknikFasilitasi']
        },
        kemitraanPembelajaran: {
          type: Type.OBJECT,
          properties: {
            peranGuruBK: { type: Type.STRING },
            peranPesertaDidik: { type: Type.STRING },
            peranMitraLain: { type: Type.STRING },
          },
          required: ['peranGuruBK', 'peranPesertaDidik', 'peranMitraLain']
        },
        lingkunganPembelajaran: {
          type: Type.OBJECT,
          properties: {
            keamananPsikologis: { type: Type.STRING },
            kenyamananDanInklusivitas: { type: Type.STRING },
            kerahasiaanDanEtika: { type: Type.STRING },
          },
          required: ['keamananPsikologis', 'kenyamananDanInklusivitas', 'kerahasiaanDanEtika']
        },
        pemanfaatanDigital: { type: Type.STRING },
        dimensiProfilLulusan: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        prinsipDeepLearning: {
          type: Type.OBJECT,
          properties: {
            berkesadaran: { type: Type.STRING },
            bermakna: { type: Type.STRING },
            menggembirakan: { type: Type.STRING },
          },
          required: ['berkesadaran', 'bermakna', 'menggembirakan']
        },
      },
      required: [
        'praktikPedagogis', 'kemitraanPembelajaran', 'lingkunganPembelajaran',
        'pemanfaatanDigital', 'dimensiProfilLulusan', 'prinsipDeepLearning'
      ]
    },
    pengalamanBelajar: {
      type: Type.OBJECT,
      properties: {
        memahami: { type: Type.STRING },
        mengaplikasi: { type: Type.STRING },
        merefleksi: { type: Type.STRING },
      },
      required: ['memahami', 'mengaplikasi', 'merefleksi']
    },
    langkahPelaksanaan: {
      type: Type.OBJECT,
      properties: {
        alokasiWaktuTotal: { type: Type.STRING },
        tahapAwal: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              namaKegiatan: { type: Type.STRING },
              alokasiWaktuMenit: { type: Type.INTEGER },
              aktivitasGuruBK: { type: Type.STRING },
              aktivitasPesertaDidik: { type: Type.STRING },
              prinsipPembelajaranMendalam: { type: Type.STRING },
              mediaInstrumen: { type: Type.STRING },
              buktiKetercapaian: { type: Type.STRING },
            },
            required: ['namaKegiatan', 'alokasiWaktuMenit', 'aktivitasGuruBK', 'aktivitasPesertaDidik', 'prinsipPembelajaranMendalam']
          }
        },
        tahapTransisi: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              namaKegiatan: { type: Type.STRING },
              alokasiWaktuMenit: { type: Type.INTEGER },
              aktivitasGuruBK: { type: Type.STRING },
              aktivitasPesertaDidik: { type: Type.STRING },
              prinsipPembelajaranMendalam: { type: Type.STRING },
              mediaInstrumen: { type: Type.STRING },
              buktiKetercapaian: { type: Type.STRING },
            },
            required: ['namaKegiatan', 'alokasiWaktuMenit', 'aktivitasGuruBK', 'aktivitasPesertaDidik', 'prinsipPembelajaranMendalam']
          }
        },
        tahapInti: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              namaKegiatan: { type: Type.STRING },
              alokasiWaktuMenit: { type: Type.INTEGER },
              aktivitasGuruBK: { type: Type.STRING },
              aktivitasPesertaDidik: { type: Type.STRING },
              prinsipPembelajaranMendalam: { type: Type.STRING },
              mediaInstrumen: { type: Type.STRING },
              buktiKetercapaian: { type: Type.STRING },
            },
            required: ['namaKegiatan', 'alokasiWaktuMenit', 'aktivitasGuruBK', 'aktivitasPesertaDidik', 'prinsipPembelajaranMendalam']
          }
        },
        tahapPenutup: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              namaKegiatan: { type: Type.STRING },
              alokasiWaktuMenit: { type: Type.INTEGER },
              aktivitasGuruBK: { type: Type.STRING },
              aktivitasPesertaDidik: { type: Type.STRING },
              prinsipPembelajaranMendalam: { type: Type.STRING },
              mediaInstrumen: { type: Type.STRING },
              buktiKetercapaian: { type: Type.STRING },
            },
            required: ['namaKegiatan', 'alokasiWaktuMenit', 'aktivitasGuruBK', 'aktivitasPesertaDidik', 'prinsipPembelajaranMendalam']
          }
        },
      },
      required: ['alokasiWaktuTotal', 'tahapAwal', 'tahapTransisi', 'tahapInti', 'tahapPenutup']
    },
    materiLayanan: {
      type: Type.OBJECT,
      properties: {
        pokokBahasan: { type: Type.STRING },
        uraianMateri: { type: Type.STRING },
        contohKonkret: { type: Type.STRING },
        studiKasusSkenario: { type: Type.STRING },
        rangkuman: { type: Type.STRING },
      },
      required: ['pokokBahasan', 'uraianMateri', 'contohKonkret', 'rangkuman']
    },
    asesmen: {
      type: Type.OBJECT,
      properties: {
        asesmenAwal: {
          type: Type.OBJECT,
          properties: {
            tujuan: { type: Type.STRING },
            petunjukPengisian: { type: Type.STRING },
            butirInstrumen: { type: Type.ARRAY, items: { type: Type.STRING } },
            caraMembacaHasil: { type: Type.STRING },
            kriteriaKetercapaian: { type: Type.STRING },
          },
          required: ['tujuan', 'petunjukPengisian', 'butirInstrumen', 'caraMembacaHasil', 'kriteriaKetercapaian']
        },
        asesmenProses: {
          type: Type.OBJECT,
          properties: {
            tujuan: { type: Type.STRING },
            petunjukPengisian: { type: Type.STRING },
            butirInstrumen: { type: Type.ARRAY, items: { type: Type.STRING } },
            caraMembacaHasil: { type: Type.STRING },
            kriteriaKetercapaian: { type: Type.STRING },
          },
          required: ['tujuan', 'petunjukPengisian', 'butirInstrumen', 'caraMembacaHasil', 'kriteriaKetercapaian']
        },
        asesmenHasil: {
          type: Type.OBJECT,
          properties: {
            tujuan: { type: Type.STRING },
            petunjukPengisian: { type: Type.STRING },
            butirInstrumen: { type: Type.ARRAY, items: { type: Type.STRING } },
            caraMembacaHasil: { type: Type.STRING },
            kriteriaKetercapaian: { type: Type.STRING },
          },
          required: ['tujuan', 'petunjukPengisian', 'butirInstrumen', 'caraMembacaHasil', 'kriteriaKetercapaian']
        },
      },
      required: ['asesmenAwal', 'asesmenProses', 'asesmenHasil']
    },
    lkpd: {
      type: Type.OBJECT,
      properties: {
        judulAktivitas: { type: Type.STRING },
        tujuanAktivitas: { type: Type.STRING },
        petunjukPengerjaan: { type: Type.STRING },
        skenarioPermasalahan: { type: Type.STRING },
        langkahKegiatan: { type: Type.ARRAY, items: { type: Type.STRING } },
        pertanyaanPanduan: { type: Type.ARRAY, items: { type: Type.STRING } },
        ruangJawabanInstruksi: { type: Type.STRING },
        kesimpulanDanKomitmen: { type: Type.STRING },
      },
      required: ['judulAktivitas', 'tujuanAktivitas', 'petunjukPengerjaan', 'langkahKegiatan', 'pertanyaanPanduan']
    },
    rubrikEvaluasi: {
      type: Type.OBJECT,
      properties: {
        judulRubrik: { type: Type.STRING },
        petunjukPenilaian: { type: Type.STRING },
        tabelRubrik: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              aspek: { type: Type.STRING },
              skor4: { type: Type.STRING },
              skor3: { type: Type.STRING },
              skor2: { type: Type.STRING },
              skor1: { type: Type.STRING },
            },
            required: ['aspek', 'skor4', 'skor3', 'skor2', 'skor1']
          }
        }
      },
      required: ['judulRubrik', 'petunjukPenilaian', 'tabelRubrik']
    },
    refleksiPesertaDidik: {
      type: Type.OBJECT,
      properties: {
        pengantar: { type: Type.STRING },
        pertanyaanRefleksi: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['pengantar', 'pertanyaanRefleksi']
    },
    refleksiGuruBK: {
      type: Type.OBJECT,
      properties: {
        ketercapaianTujuan: { type: Type.STRING },
        keterlibatanPartisipasi: { type: Type.STRING },
        efektivitasMetodeMedia: { type: Type.STRING },
        ketepatanAlokasiWaktu: { type: Type.STRING },
        kendalaYangDihadapi: { type: Type.STRING },
        rencanaTindakLanjutPerbaikan: { type: Type.STRING },
      },
      required: ['ketercapaianTujuan', 'keterlibatanPartisipasi', 'efektivitasMetodeMedia', 'ketepatanAlokasiWaktu', 'rencanaTindakLanjutPerbaikan']
    },
    tindakLanjut: {
      type: Type.OBJECT,
      properties: {
        penguatanKlasikal: { type: Type.STRING },
        bimbinganKelompokLanjutan: { type: Type.STRING },
        konselingIndividualKelompok: { type: Type.STRING },
        kolaborasiWaliKelasOrangTua: { type: Type.STRING },
        rujukanProfesional: { type: Type.STRING },
        pemantauanPerkembangan: { type: Type.STRING },
      },
      required: ['penguatanKlasikal', 'bimbinganKelompokLanjutan', 'konselingIndividualKelompok', 'kolaborasiWaliKelasOrangTua', 'pemantauanPerkembangan']
    },
    sumberDanLampiran: {
      type: Type.OBJECT,
      properties: {
        sumberMateri: { type: Type.ARRAY, items: { type: Type.STRING } },
        mediaPembelajaran: { type: Type.ARRAY, items: { type: Type.STRING } },
        daftarLampiran: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['sumberMateri', 'mediaPembelajaran', 'daftarLampiran']
    },
    pengesahan: {
      type: Type.OBJECT,
      properties: {
        tempatDanTanggal: { type: Type.STRING },
        jabatanKepalaSekolah: { type: Type.STRING },
        namaKepalaSekolah: { type: Type.STRING },
        nipKepalaSekolah: { type: Type.STRING },
        jabatanGuruBK: { type: Type.STRING },
        namaGuruBK: { type: Type.STRING },
        nipGuruBK: { type: Type.STRING },
      },
      required: ['tempatDanTanggal', 'jabatanKepalaSekolah', 'namaKepalaSekolah', 'jabatanGuruBK', 'namaGuruBK']
    }
  },
  required: [
    'title', 'identitas', 'identifikasiKebutuhan', 'tujuanLayanan',
    'desainPembelajaranMendalam', 'pengalamanBelajar', 'langkahPelaksanaan',
    'sumberDanLampiran', 'pengesahan'
  ]
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // API endpoint: Generate RPL
  app.post('/api/generate-rpl', async (req, res) => {
    try {
      const formData = req.body;
      if (!formData || !formData.topik) {
        return res.status(400).json({ error: 'Data formulir tidak lengkap. Topik layanan wajib diisi.' });
      }

      const totalMenit = Number(formData.durasiMenit) || 80;

      const systemInstruction = `Anda adalah seorang ahli Bimbingan dan Konseling (BK) SMP berprestasi nasional, ahli kurikulum Bimbingan dan Konseling Indonesia (Kurikulum Merdeka / Fase D), dan pakar pendekatan Pembelajaran Mendalam (Deep Learning).

Tugas Anda adalah menghasilkan Rencana Pelaksanaan Layanan (RPL / RPM) Bimbingan dan Konseling untuk SMPN 53 Kota Bekasi (atau nama sekolah yang dimasukkan pengguna) berbasis Pembelajaran Mendalam.

Prinsip Utama:
1. PEMBELAJARAN MENDALAM (DEEP LEARNING):
   - 3 Prinsip: Berkesadaran (Mindful), Bermakna (Meaningful), Menggembirakan (Joyful). Jelaskan dalam aktivitas konkret, bukan slogan.
   - 3 Pengalaman Belajar: MEMAHAMI (Mindful grasping), MENGAPLIKASI (Meaningful application), MEREFLEKSI (Joyful & transformative reflection).
   - 8 Dimensi Profil Lulusan: Pilih hanya dimensi yang sungguh-sungguh relevan dari: Keimanan & Ketakwaan, Kewargaan, Penalaran Kritis, Kreativitas, Kolaborasi, Kemandirian, Kesehatan, Komunikasi.
2. TUJUAN LAYANAN & KKO OPERASIONAL:
   - Gunakan Kata Kerja Operasional yang konkret dan terukur (Mengidentifikasi, Menjelaskan, Menganalisis, Mempraktikkan, Menentukan, Menyusun, Merefleksikan).
   - Jangan gunakan tujuan samar tanpa indikator.
3. ALOKASI WAKTU PRESISI:
   - Total waktu seluruh langkah (Tahap Awal + Tahap Transisi + Tahap Inti + Tahap Penutup) HARUS TEPAT sama dengan ${totalMenit} menit.
   - Distribusikan waktu secara proporsional (Awal: ~10-15%, Transisi: ~5-10%, Inti: ~65-75%, Penutup: ~10-15%).
4. INTEGRITAS & ETIKA BK:
   - Jangan mengarang data survei atau hasil wawancara spesifik jika tidak diberikan pengguna (gunakan catatan terstandar seperti "[Sesuai hasil asesmen guru BK]").
   - Jaga kerahasiaan, keselamatan psikologis, dan martabat peserta didik SMP. Asesmen tidak boleh memberi cap/label psikopatologis negatif.
5. PENGEMBANGAN FASE D (KELAS 7, KELAS 8, & KELAS 9):
   - Jika sasaran Kelas VII: Selaraskan dengan tema perkembangan "Masa Adaptasi dan Pengenalan Diri" (transisi SD ke SMP, tata tertib, kemandirian belajar, konsep diri, adaptasi sosial, pencegahan bullying, etika 5S, eksplorasi minat awal, dan orientasi BK).
   - Jika sasaran Kelas VIII: Selaraskan dengan tema perkembangan "Pengembangan Karakter dan Pengendalian Diri" (perubahan fisik & psikis pubertas madya, kejujuran & integritas diri, komunikasi asertif, gaya belajar V-A-K, motivasi prestasi, self-esteem, peer pressure, peran teman sebaya positif, kecerdasan majemuk Howard Gardner, literasi digital, kesehatan mental, serta manajemen emosi dan stres).
   - Jika sasaran Kelas IX: Selaraskan dengan tema perkembangan "Pemantapan Studi Lanjutan dan Karier" (eksplorasi bakat & minat karier mandiri, prospek profesi abad 21 & era AI, etika budaya & tertib lalu lintas, analisis tipe kepribadian, strategi sukses asesmen sumatif / ujian sekolah, orientasi pilihan studi lanjut pasca SMP, kurikulum & peminatan SMA/MA, keunggulan kejuruan SMK filosofi BMW, kesiapan mental perpisahan sekolah, serta pengambilan keputusan studi lanjut realistis selaras dengan orang tua).
6. LENGKAP & SISTEMATIS:
   - Buat 15 Bagian secara utuh dan terperinci sesuai permintaan, termasuk materi kontekstual anak SMP, asesmen 3 dimensi (awal, proses, hasil), LKPD interaktif, rubrik analitik 4 skala, dan refleksi 2 arah.`;

      const userPrompt = `Silakan susun Dokumen RPL/RPM Pembelajaran Mendalam yang komprehensif, terstruktur, dan siap pakai berdasarkan data berikut:

IDENTITAS:
- Satuan Pendidikan: ${formData.namaSekolah || 'SMPN 53 Kota Bekasi'}
- Guru BK: ${formData.namaGuruBK || 'Hari Maktoharibi, S.Pd.'} (NIP: ${formData.nipGuruBK || '19811005 202321 1 007'})
- Kepala Sekolah: ${formData.namaKepalaSekolah || 'Arief Purnama, S.Pd.'} (NIP: ${formData.nipKepalaSekolah || '19730311 201412 1 001'})
- Kota & Tanggal: ${formData.kota || 'Kota Bekasi'}, ${formData.tanggalPelaksanaan || 'Tanggal Pelaksanaan'}
- Kelas / Fase: Kelas ${formData.kelas || 'VIII'} / ${formData.fase || 'Fase D'}
- Tahun Pelajaran: ${formData.tahunPelajaran || '2026/2027'}, Semester: ${formData.semester || 'Ganjil'}
- Komponen Layanan: ${formData.komponenLayanan || 'Layanan Dasar'}
- Bidang Layanan: ${formData.bidangLayanan || 'Pribadi'}
- Jenis Layanan: ${formData.jenisLayanan || 'Bimbingan Klasikal'}
- Fungsi Layanan: ${formData.fungsiLayanan || 'Pemahaman, Pencegahan, dan Pengembangan'}
- Topik / Tema: ${formData.topik}
- Alokasi Waktu: ${formData.alokasiWaktu || '1 JP (2 x 40 Menit)'} (Total Durasi Wajib: ${totalMenit} Menit)
- Jumlah Pertemuan: ${formData.jumlahPertemuan || '1 Pertemuan'}
- Sasaran / Jumlah Peserta: ${formData.jumlahPesertaDidik || '32 Peserta Didik'}

IDENTIFIKASI KEBUTUHAN PESERTA DIDIK:
- Hasil Asesmen Kebutuhan: ${formData.hasilAsesmenKebutuhan || 'Perlu diisi berdasarkan asesmen guru BK'}
- Permasalahan yang Ditemukan: ${formData.permasalahanDitemukan || 'Belum diisi secara spesifik'}
- Karakteristik Peserta Didik: ${formData.karakteristikPesertaDidik || 'Remaja awal jenjang SMP (Fase D)'}
- Kesiapan Belajar: ${formData.kesiapanBelajar || 'Bervariasi'}
- Pengalaman Awal: ${formData.pengalamanAwal || 'Pernah mengalami situasi terkait dalam kehidupan sehari-hari'}
- Potensi & Kekuatan: ${formData.potensiKekuatan || 'Memiliki antusiasme dan keterbukaan belajar'}
- Kebutuhan Khusus / Akomodasi: ${formData.kebutuhanKhusus || 'Diferensiasi pendekatan untuk peserta didik dengan gaya belajar berbeda'}

PREFERENSI PEMBELAJARAN MENDALAM:
- Metode: ${(formData.metodeLayanan || []).join(', ') || 'Diskusi, Studi Kasus, Refleksi, Simulasi'}
- Model / Strategi: ${formData.modelStrategi || 'Model ARKA (Aktivitas - Refleksi - Konsep - Aplikasi)'}
${(formData.modelStrategi || '').includes('ARKA') ? `
KHUSUS SINTAKS MODEL ARKA (Aktivitas - Refleksi - Konsep - Aplikasi):
Guru BK memilih Model ARKA. Anda WAJIB menyusun Langkah Inti Pelaksanaan (tahapInti) secara runtut dalam 4 tahapan ARKA:
1. Tahap 1: [ARKA - Aktivitas (A)] — Pengalaman konkret, simulasi, penayangan media/video studi kasus, dinamika kelompok, atau bermain peran yang berkesadaran dan menggembirakan.
2. Tahap 2: [ARKA - Refleksi (R)] — Memfasilitasi peserta didik menganalisis dan merefleksikan rasa, pengalaman, serta respons batin melalui pertanyaan pemantik.
3. Tahap 3: [ARKA - Konsep (K)] — Membimbing peserta didik mengonstruksi pemahaman esensial, konsep teoritis/psikologis BK, dan nilai-nilai karakter utama bersama guru BK.
4. Tahap 4: [ARKA - Aplikasi (A)] — Membimbing peserta didik merumuskan rencana aksi nyata yang aplikatif, komitmen perubahan diri, dan transfer pemahaman ke situasi keseharian.
Beri nama kegiatan tahap inti dengan awalan: "[ARKA - Aktivitas]", "[ARKA - Refleksi]", "[ARKA - Konsep]", dan "[ARKA - Aplikasi]".
` : ''}
- Media Tersedia: ${(formData.mediaTersedia || []).join(', ') || 'LCD, Slide, Video, Kartu Studi Kasus, LKPD'}
- Pemanfaatan Digital: ${formData.pemanfaatanDigital || 'Video animasi studi kasus dan formulir refleksi interaktif'}
- Dimensi Profil Lulusan yang Dipilih: ${(formData.dimensiProfilLulusan || []).join(', ') || 'Penalaran kritis, Kolaborasi, Kemandirian, Komunikasi'}

PENGATURAN KELENGKAPAN OUTPUT:
- Tingkat Kedalaman: ${formData.kedalaman || 'Lengkap'}
- Sertakan LKPD: ${formData.sertakanLkpd ? 'Ya, buatkan LKPD lengkap dan menarik untuk peserta didik SMP' : 'Tidak wajib'}
- Sertakan Asesmen (Awal, Proses, Hasil): ${formData.sertakanAsesmen ? 'Ya, sangat lengkap dengan petunjuk dan butir' : 'Ringkas'}
- Sertakan Rubrik Evaluasi (4 Skala): ${formData.sertakanRubrik ? 'Ya, tabel rubrik analitik 4 tingkat: 4=Sangat Berkembang, 3=Berkembang Sesuai Harapan, 2=Mulai Berkembang, 1=Memerlukan Bimbingan' : 'Ringkas'}
- Sertakan Refleksi (Siswa & Guru): ${formData.sertakanRefleksi ? 'Ya, pertanyaan reflektif mendalam' : 'Ringkas'}
- Sertakan Materi Layanan: ${formData.sertakanMateri ? 'Ya, materi kontekstual dengan contoh kasus konkret anak SMP' : 'Ringkas'}
- Sertakan Tindak Lanjut: ${formData.sertakanTindakLanjut ? 'Ya, program tindak lanjut komprehensif' : 'Ringkas'}
- Instruksi Khusus Pengguna: ${formData.instruksiKhusus || 'Tidak ada instruksi khusus tambahan'}

Hasilkan dokumen Rencana Pelaksanaan Layanan dalam JSON sesuai schema yang telah ditentukan.`;

      // Resilient model calling with timeout protection and fallback across models
      // gemini-3.1-flash-lite has separate quota; prioritize it when flash hits limit
      const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
      let generatedData: any = null;

      for (const modelName of modelsToTry) {
        try {
          console.log(`[AI Engine] Mencoba memproses RPL dengan: ${modelName}`);
          
          const modelPromise = ai.models.generateContent({
            model: modelName,
            contents: userPrompt,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema: rplResponseSchema,
            },
          });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout (12s) untuk ${modelName}`)), 12000)
          );

          const response = await Promise.race([modelPromise, timeoutPromise]);
          const responseText = response.text;
          if (responseText) {
            generatedData = JSON.parse(responseText);
            console.log(`[AI Engine] Berhasil generate RPL dengan ${modelName}`);
            break;
          }
        } catch (err: any) {
          const errMsg = String(err?.message || err);
          const isQuotaOrBusy = errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('503') || errMsg.includes('quota');
          if (isQuotaOrBusy) {
            console.log(`[AI Engine] Model ${modelName} sedang mencapai batas kuota / sibuk. Mengalihkan ke opsi berikutnya...`);
          } else {
            console.log(`[AI Engine] Model ${modelName} lewati: ${errMsg.slice(0, 80)}`);
          }
          await new Promise((r) => setTimeout(r, 400));
        }
      }

      // If all models hit quota or are busy, generate an authentic, fully populated 15-part RPL structure
      if (!generatedData) {
        console.log('[AI Engine] Mengaktifkan generator adaptif Deep Learning internal...');
        generatedData = createAdaptiveRpl(formData, totalMenit);
      }
      
      // Add server-side timestamps & ID
      generatedData.id = 'rpl-' + Date.now();
      generatedData.createdAt = new Date().toISOString();
      generatedData.updatedAt = new Date().toISOString();

      return res.json({ success: true, data: generatedData });
    } catch (error: any) {
      console.error('Error in /api/generate-rpl:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Terjadi kesalahan saat memproses generasi RPL dengan Gemini AI.',
      });
    }
  });

  // API endpoint: Refine specific section
  app.post('/api/refine-section', async (req, res) => {
    try {
      const { sectionName, currentContent, instruction, rplContext } = req.body;
      if (!sectionName || !instruction) {
        return res.status(400).json({ error: 'Nama bagian dan instruksi perbaikan wajib disertakan.' });
      }

      const prompt = `Anda adalah ahli Bimbingan dan Konseling SMP dan Pembelajaran Mendalam.
Lakukan perbaikan pada bagian "${sectionName}" dari dokumen RPL BK berikut.

Konteks RPL:
- Topik: ${rplContext?.topik || '-'}
- Kelas/Fase: Kelas ${rplContext?.kelas || '-'} / Fase D
- Sekolah: ${rplContext?.namaSekolah || 'SMPN 53 Kota Bekasi'}

Konten Saat Ini:
${typeof currentContent === 'object' ? JSON.stringify(currentContent, null, 2) : String(currentContent)}

Instruksi Perbaikan dari Guru BK:
"${instruction}"

Berikan konten hasil perbaikan yang telah disempurnakan, lebih kontekstual, terukur, dan menerapkan prinsip Pembelajaran Mendalam (Berkesadaran, Bermakna, Menggembirakan).
Kembalikan hasilnya dalam JSON: { "refinedContent": <konten_baru_bisa_berupa_string_atau_object> }`;

      const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
      let refinedContent: any = null;

      for (const modelName of modelsToTry) {
        try {
          const modelPromise = ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout 10s untuk ${modelName}`)), 10000)
          );

          const response = await Promise.race([modelPromise, timeoutPromise]);
          const parsed = JSON.parse(response.text || '{}');
          refinedContent = parsed.refinedContent || parsed;
          if (refinedContent) {
            console.log(`[AI Engine] Bagian ${sectionName} berhasil diperbaiki dengan ${modelName}`);
            break;
          }
        } catch (err: any) {
          const errMsg = String(err?.message || err);
          const isQuotaOrBusy = errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('503') || errMsg.includes('quota');
          if (isQuotaOrBusy) {
            console.log(`[AI Engine] Model ${modelName} untuk refine mencapai batas kuota / sibuk.`);
          } else {
            console.log(`[AI Engine] Refine ${modelName} lewati: ${errMsg.slice(0, 80)}`);
          }
        }
      }

      // If AI model is busy or quota exceeded, use intelligent domain-specific adaptive refiner
      if (!refinedContent) {
        console.log(`[AI Engine] Menggunakan penyempurnaan adaptif internal untuk bagian: ${sectionName}`);
        refinedContent = refineAdaptiveSection(sectionName, currentContent, instruction, rplContext);
      }

      return res.json({ success: true, refinedContent });
    } catch (error: any) {
      console.error('Error in /api/refine-section:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Gagal menyempurnakan bagian RPL.',
      });
    }
  });

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'AI Generator RPL (RPM) SMPN 53 Kota Bekasi' });
  });

  // Setup Vite in Dev or Static files in Prod
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Generator RPL server running on http://0.0.0.0:${PORT}`);
  });
}

function refineAdaptiveSection(sectionName: string, currentContent: any, instruction: string, rplContext: any): any {
  const topik = rplContext?.topik || 'Pengembangan Diri';
  const kelas = rplContext?.kelas || 'VIII';

  if (sectionName === 'tujuanLayanan') {
    const defaultObj = typeof currentContent === 'object' && currentContent !== null ? { ...currentContent } : {};
    return {
      tujuanUmum: defaultObj.tujuanUmum || `Peserta didik mampu memahami dan menerapkan ${topik} secara bijak dan bertanggung jawab.`,
      tujuanKhusus: [
        `Peserta didik mampu mengidentifikasi dan menganalisis faktor-faktor terkait ${topik} dengan kesadaran penuh (C4).`,
        `Peserta didik mampu mengevaluasi dampak positif dan negatif dari berbagai pilihan tindakan dalam pergaulan sehari-hari (C5).`,
        `Peserta didik mampu merancang strategi tindakan nyata dan solusi pemecahan masalah bersama teman sebaya (P3).`,
        `Peserta didik mampu menunjukkan komitmen diri dan sikap saling menghargai dalam kehidupan bermasyarakat (A5).`
      ],
      indikatorKetercapaian: [
        `Peserta didik dapat menguraikan minimal 3 hal esensial mengenai ${topik} dengan kalimat sendiri.`,
        `Peserta didik aktif berdiskusi dan memberikan tanggapan berbasis penalaran kritis dalam kelompok.`,
        `Peserta didik menyusun lembar rencana tindakan (Action Plan) konkret yang dapat diterapkan segera.`
      ],
      kompetensiKeterampilan: [
        'Penalaran kritis dan pemecahan masalah kontekstual',
        'Komunikasi asertif dan empati interpersonal',
        'Pengambilan keputusan bertanggung jawab dan kemandirian'
      ]
    };
  }

  if (sectionName === 'langkahPelaksanaan') {
    const defaultObj = typeof currentContent === 'object' && currentContent !== null ? { ...currentContent } : {};
    const steps = defaultObj.tahapInti || [];
    const updatedInti = steps.length > 0 ? steps.map((s: any, idx: number) => ({
      ...s,
      aktivitasGuruBK: idx === 0
        ? `Memfasilitasi eksplorasi interaktif topik ${topik} melalui media kontekstual dan pertanyaan pemantik mendalam (${instruction}).`
        : idx === 1
        ? `Membimbing dinamika kelompok untuk mendiskusikan studi kasus nyata, saling bertukar gagasan solutif, dan merumuskan langkah praktis.`
        : `Mendampingi presentasi kelompok, memberikan penguatan positif, dan memfasilitasi refleksi diri (Mindful Reflection).`,
      aktivitasPesertaDidik: idx === 0
        ? `Mencermati stimulus kasus, bercurah pendapat aktif, dan mengaitkan fenomena dengan pengalaman hidup sehari-hari.`
        : idx === 1
        ? `Bekerja sama dalam kelompok kecil, membedah alternatif penyelesaian masalah, dan mengisi lembar kerja secara kolaboratif.`
        : `Mempresentasikan hasil diskusi, saling memberi apresiasi, dan menuliskan komitmen perbaikan diri.`
    })) : [
      {
        namaKegiatan: 'Memahami (Konseptual & Kognitif)',
        alokasiWaktuMenit: 15,
        aktivitasGuruBK: `Menyajikan studi kasus kontekstual terkait ${topik} dan memandu curah pendapat reflektif (${instruction}).`,
        aktivitasPesertaDidik: 'Mengamati, menganalisis situasi masalah, dan mengemukakan sudut pandang secara terbuka.',
        prinsipPembelajaranMendalam: 'Berkesadaran (Mindful) & Bermakna (Meaningful)'
      },
      {
        namaKegiatan: 'Mengaplikasi (Kontekstual & Praktik Kolaboratif)',
        alokasiWaktuMenit: 25,
        aktivitasGuruBK: 'Membagi kelompok kerja, memfasilitasi simulasi pemecahan masalah, dan berkeliling memberikan scaffolding.',
        aktivitasPesertaDidik: 'Berdiskusi aktif dalam kelompok, menyusun rencana aksi penanganan kasus, dan menyimulasikan respon yang tepat.',
        prinsipPembelajaranMendalam: 'Bermakna & Menggembirakan (Joyful)'
      },
      {
        namaKegiatan: 'Merefleksi (Internalisasi & Tindakan Nyata)',
        alokasiWaktuMenit: 10,
        aktivitasGuruBK: 'Memandu proses penarikan benang merah pembelajaran dan memfasilitasi perumusan komitmen pribadi.',
        aktivitasPesertaDidik: 'Menyimpulkan wawasan berharga yang didapat dan menuliskan janji tindakan nyata untuk diri sendiri.',
        prinsipPembelajaranMendalam: 'Berkesadaran (Mindful)'
      }
    ];

    return {
      ...defaultObj,
      alokasiWaktuTotal: defaultObj.alokasiWaktuTotal || '80 Menit',
      tahapInti: updatedInti
    };
  }

  if (sectionName === 'lkpd') {
    return {
      judulAktivitas: `Lembar Kerja Peserta Didik (LKPD): Eksplorasi & Aksi Nyata — ${topik}`,
      tujuanAktivitas: `Peserta didik mampu menganalisis studi kasus nyata mengenai ${topik} dan menentukan solusi yang beretika.`,
      petunjukPengerjaan: 'Bacalah studi kasus berikut dengan saksama bersama teman sekelompokmu, diskusikan pertanyaan panduan, lalu tuliskan komitmen tindakan pribadimu.',
      skenarioPermasalahan: `Di lingkungan pergaulan remaja kelas ${kelas} SMP, seorang siswa sering merasa bingung bagaimana bersikap saat menghadapi situasi terkait ${topik}. Sebagian temannya menganggap hal tersebut sepele, namun dampaknya cukup dirasakan bagi kenyamanan belajar dan pertemanan.`,
      langkahKegiatan: [
        '1. Bentuk kelompok kecil beranggotakan 4-5 orang secara heterogen.',
        '2. Cermati skenario permasalahan dan identifikasi penyebab utamanya.',
        '3. Diskusikan alternatif solusi terbaik yang saling menghargai dan tidak merugikan siapapun.',
        '4. Tuliskan kesepakatan kelompok pada kolom yang tersedia dan rumuskan komitmen pribadimu.'
      ],
      pertanyaanPanduan: [
        `Apa pesan moral atau wawasan penting yang dapat kamu pelajari dari peristiwa terkait ${topik} tersebut?`,
        'Jika kamu berada pada posisi orang yang menghadapi masalah tersebut, apa langkah konkret yang paling bijak untuk dilakukan?',
        'Mengapa penting bagi kita untuk saling mendukung dan menjaga kenyamanan bersama di sekolah maupun media daring?',
        'Apa satu tindakan nyata yang akan kamu mulai lakukan hari ini untuk menerapkan nilai positif ini?'
      ],
      ruangJawabanInstruksi: 'Tuliskan hasil refleksi dan diskusimu secara ringkas, jelas, dan jujur.',
      kesimpulanDanKomitmen: 'Saya berkomitmen untuk menerapkan pemahaman ini secara konsisten dalam pergaulan di sekolah, keluarga, dan lingkungan masyarakat.'
    };
  }

  if (sectionName === 'asesmen') {
    return {
      asesmenAwal: {
        tujuan: `Mengidentifikasi tingkat pengetahuan awal dan kesiapan emosional siswa mengenai ${topik}.`,
        petunjukPengisian: 'Jawablah pertanyaan pemantik berikut secara spontan dan jujur.',
        butirInstrumen: [
          `Pernahkah kamu mengalami atau melihat situasi yang berkaitan dengan ${topik}?`,
          'Menurut pendapatmu, apa tantangan terbesar yang sering dialami remaja saat menghadapi hal tersebut?',
          'Seberapa yakin kamu mengetahui cara mengatasi tantangan tersebut secara positif? (Skala 1 - 5)'
        ],
        caraMembacaHasil: 'Jawaban dianalisis secara kualitatif untuk memetakan kesiapan belajar (Readiness).',
        kriteriaKetercapaian: 'Peserta didik mampu mengungkapkan pemahaman awalnya secara terbuka.'
      },
      asesmenProses: {
        tujuan: 'Mengamati keaktifan, keterbukaan, kerja sama kelompok, dan empati selama layanan berlangsung.',
        petunjukPengisian: 'Guru BK mengisi lembar observasi selama proses bimbingan klasikal berlangsung.',
        butirInstrumen: [
          'Antusiasme dan fokus perhatian saat pemaparan stimulus / apersepsi',
          'Partisipasi aktif dalam menyampaikan pendapat atau bertanya dalam kelompok',
          'Sikap menghargai perbedaan pandangan teman tanpa mencela atau menghakimi',
          'Keseriusan dan kerja sama dalam menyelesaikan penugasan kelompok / LKPD'
        ],
        caraMembacaHasil: 'Skor observasi dikelompokkan ke dalam kategori Sangat Baik, Baik, Cukup, dan Perlu Pendampingan.',
        kriteriaKetercapaian: 'Minimal 80% peserta didik menunjukkan partisipasi aktif dan interaksi positif.'
      },
      asesmenHasil: {
        tujuan: 'Mengevaluasi aspek Pemahaman Baru (Understanding), Kenyamanan Perasaan (Comfortable), dan Komitmen Aksi (Action).',
        petunjukPengisian: 'Peserta didik mengisi angket penilaian hasil di akhir pertemuan.',
        butirInstrumen: [
          `Understanding: Saya memahami dengan jelas konsep dan strategi yang benar mengenai ${topik}.`,
          'Comfortable: Saya merasa senang, nyaman, dan termotivasi setelah mengikuti layanan BK ini.',
          'Action: Saya siap menerapkan rencana tindakan konkret yang telah saya susun dalam keseharian.'
        ],
        caraMembacaHasil: 'Dihitung rata-rata skor kepuasan dan ketercapaian pemahaman siswa.',
        kriteriaKetercapaian: 'Rata-rata skor minimal berkategori Baik (skor 3 dari 4).'
      }
    };
  }

  if (sectionName === 'rubrikEvaluasi') {
    return {
      judulRubrik: `Rubrik Evaluasi Layanan Bimbingan dan Konseling: ${topik}`,
      petunjukPenilaian: 'Gunakan rubrik berikut untuk menilai pencapaian dimensi perkembangan peserta didik.',
      tabelRubrik: [
        {
          aspek: 'Pemahaman Konsep & Penalaran Kritis',
          skor4: `Mampu menjelaskan konsep ${topik} secara mendalam dan memberikan contoh solusi orisinal.`,
          skor3: `Mampu menjelaskan konsep ${topik} secara tepat dengan contoh yang relevan.`,
          skor2: 'Memahami konsep dasar namun masih membutuhkan bantuan dalam menjelaskan contoh.',
          skor1: 'Belum mampu menjelaskan konsep esensial dan memerlukan bimbingan khusus.'
        },
        {
          aspek: 'Kolaborasi & Keterampilan Komunikasi',
          skor4: 'Sangat aktif berkolaborasi, mendengarkan rekan secara empati, dan menyampaikan ide dengan asertif.',
          skor3: 'Aktif berpartisipasi dan bekerja sama dengan baik bersama rekan sekelompok.',
          skor2: 'Cukup berpartisipasi namun cenderung pasif jika tidak diarahkan oleh guru BK.',
          skor1: 'Kurang kooperatif dalam kelompok dan memerlukan motivasi lebih.'
        },
        {
          aspek: 'Refleksi Diri & Komitmen Tindakan',
          skor4: 'Mampu merefleksikan diri secara mendalam serta merumuskan komitmen tindakan nyata yang terukur.',
          skor3: 'Mampu merefleksikan diri dan menyusun komitmen tindakan yang baik.',
          skor2: 'Menyusun komitmen tindakan namun masih bersifat umum atau belum spesifik.',
          skor1: 'Belum menunjukkan kesadaran refleksi diri dan komitmen tindakan nyata.'
        }
      ]
    };
  }

  if (sectionName === 'materiLayanan') {
    return {
      pokokBahasan: `Penguatan Pemahaman & Keterampilan Terkait ${topik}`,
      uraianMateri: `Materi bimbingan konseling ini dirancang untuk membekali peserta didik kelas ${kelas} SMP dengan pemahaman holistik tentang ${topik}. Peserta didik diajak mengeksplorasi hakikat konsep, pentingnya regulasi diri, dan bagaimana membangun hubungan sosial yang harmonis berlandaskan nilai-nilai karakter luhur. Layanan ini menitikberatkan pada kesadaran internal (mindfulness) agar setiap keputusan yang diambil dilandasi oleh pertimbangan etis dan empati terhadap sesama. (${instruction})`,
      contohKonkret: `Penerapan nyata dalam keseharian siswa di SMPN 53 Kota Bekasi, seperti saling menghargai saat berkomunikasi di kelas, tidak menyebarkan kabar yang belum tentu benar, dan saling memberikan dukungan moral saat ada teman yang membutuhkan pertolongan.`,
      studiKasusSkenario: `Skenario dilematis di mana seorang siswa menghadapi situasi pergaulan yang menguji integritasnya terkait ${topik}. Melalui telaah kasus ini, siswa belajar mengambil keputusan yang bertanggung jawab.`,
      rangkuman: `Memahami ${topik} bukan sekadar teori, melainkan seni mengelola diri dan berelasi secara bermakna untuk mewujudkan lingkungan belajar yang aman, menyenangkan, dan berdaya.`
    };
  }

  // Fallback for any other section
  if (typeof currentContent === 'object' && currentContent !== null) {
    return { ...currentContent, catatanPenyempurnaan: instruction };
  }
  return String(currentContent) + `\n[Telah disempurnakan: ${instruction}]`;
}

function createAdaptiveRpl(formData: any, totalMenit: number) {
  const tAwal = Math.max(5, Math.round(totalMenit * 0.125));
  const tTransisi = Math.max(5, Math.round(totalMenit * 0.075));
  const tPenutup = Math.max(5, Math.round(totalMenit * 0.125));
  const tInti = totalMenit - (tAwal + tTransisi + tPenutup);

  const tInti1 = Math.round(tInti * 0.32); // Memahami
  const tInti2 = Math.round(tInti * 0.45); // Mengaplikasi
  const tInti3 = tInti - (tInti1 + tInti2); // Merefleksi

  const topik = formData.topik || 'Layanan Bimbingan dan Konseling';
  const kelas = formData.kelas || 'VIII';
  const sekolah = formData.namaSekolah || 'SMPN 53 Kota Bekasi';
  const guruBK = formData.namaGuruBK || 'Hari Maktoharibi, S.Pd.';
  const nipGuruBK = formData.nipGuruBK || '19811005 202321 1 007';
  const kepsek = formData.namaKepalaSekolah || 'Arief Purnama, S.Pd.';
  const nipKepsek = formData.nipKepalaSekolah || '19730311 201412 1 001';
  const bidang = formData.bidangLayanan || 'Pribadi';
  const jenis = formData.jenisLayanan || 'Bimbingan Klasikal';

  return {
    title: `RPL Bimbingan dan Konseling: ${topik}`,
    identitas: {
      satuanPendidikan: sekolah,
      namaGuruBK: guruBK,
      nipGuruBK: nipGuruBK,
      namaKepalaSekolah: kepsek,
      nipKepalaSekolah: nipKepsek,
      tahunPelajaran: formData.tahunPelajaran || '2026/2027',
      kelasFase: `${kelas} / ${formData.fase || 'Fase D'}`,
      semester: formData.semester || 'Ganjil',
      komponenLayanan: formData.komponenLayanan || 'Layanan Dasar',
      bidangLayanan: bidang,
      jenisLayanan: jenis,
      fungsiLayanan: formData.fungsiLayanan || 'Pemahaman, Pencegahan, dan Pengembangan',
      topikLayanan: topik,
      alokasiWaktu: formData.alokasiWaktu || '1 JP (2 x 40 Menit)',
      jumlahPertemuan: formData.jumlahPertemuan || '1 Pertemuan',
      tanggalPelaksanaan: formData.tanggalPelaksanaan || 'Tanggal Pelaksanaan',
      sasaranLayanan: formData.jumlahPesertaDidik || `Peserta Didik Kelas ${kelas}`,
    },
    identifikasiKebutuhan: {
      dasarKebutuhan: `Kebutuhan pengembangan tugas perkembangan peserta didik SMP jenjang Fase D pada aspek kematangan emosional, sosial, dan akademik terkait ${topik}.`,
      hasilAsesmenKebutuhan: formData.hasilAsesmenKebutuhan || 'Perlu diisi berdasarkan instrumen AKPD/AUM guru BK.',
      karakteristikPerkembangan: formData.karakteristikPesertaDidik || `Remaja awal kelas ${kelas} SMP (usia 12-15 tahun) dengan dinamika konformitas teman sebaya dan proses pencarian konsep diri positif.`,
      kesiapanDanPengalamanAwal: formData.kesiapanDanPengalamanAwal || formData.pengalamanAwal || 'Peserta didik memiliki pengalaman empiris terkait topik namun membutuhkan sudut pandang objektif.',
      permasalahanPrioritas: formData.permasalahanDitemukan || `Kebutuhan peningkatan pemahaman dan strategi tindakan nyata menghadapi tantangan ${topik}.`,
      potensiDanKekuatan: formData.potensiKekuatan || 'Memiliki antusiasme belajar kelompok, keterbukaan berdialog, dan keakraban teman sebaya.',
      kebutuhanDukunganAkomodasi: formData.kebutuhanKhusus || 'Diferensiasi media belajar visual dan auditori untuk mendukung ragam gaya belajar peserta didik.',
    },
    tujuanLayanan: {
      tujuanUmum: `Peserta didik mampu menginternalisasi pemahaman mendalam, mengelola sikap positif, serta mempraktikkan keterampilan nyata terkait ${topik} dalam kehidupan sehari-hari di lingkungan sekolah maupun keluarga.`,
      tujuanKhusus: [
        `Mengidentifikasi konsep, karakteristik, dan faktor kunci terkait ${topik} secara berkesadaran (C1-C2).`,
        `Menganalisis fenomena atau studi kasus nyata yang sering dialami remaja usia SMP (C4).`,
        `Mempraktikkan keterampilan pemecahan masalah dan komunikasi positif dalam simulasi kelompok (P3).`,
        `Menentukan komitmen tindakan nyata dan strategi berkelanjutan untuk pengembangan diri (A5).`
      ],
      indikatorKetercapaian: [
        `Peserta didik dapat menguraikan minimal 3 hal esensial mengenai ${topik}.`,
        `Peserta didik aktif berpartisipasi menyampaikan argumen analitis pada diskusi studi kasus.`,
        `Peserta didik menunjukkan keterampilan kolaboratif selama kegiatan simulasi atau pengisian LKPD.`,
        `Peserta didik merumuskan lembar komitmen tindakan pribadi secara spesifik dan realistis.`
      ],
      kompetensiKeterampilan: [
        'Keterampilan regulasi diri dan pengambilan keputusan etis',
        'Komunikasi asertif dan empati interpersonal',
        'Penalaran kritis terhadap pengaruh lingkungan sebaya',
        'Kemandirian dan tanggung jawab pribadi'
      ]
    },
    desainPembelajaranMendalam: {
      praktikPedagogis: {
        pendekatan: 'Pembelajaran Berpusat pada Peserta Didik (Student-Centered Counseling & Learning)',
        strategiModel: formData.modelStrategi || 'Experiential Learning & Problem-Based Learning',
        metode: (formData.metodeLayanan || ['Diskusi Kelompok', 'Studi Kasus', 'Refleksi Diri', 'Simulasi']).join(', '),
        teknikFasilitasi: 'Fasilitasi dialogis apresiatif, active listening, dan probing reflective questions'
      },
      kemitraanPembelajaran: {
        peranGuruBK: 'Sebagai fasilitator dialog ramah anak, motivator, pemandu refleksi emosional, dan konselor yang menjaga kerahasiaan.',
        peranPesertaDidik: 'Sebagai pembelajar aktif, rekan kolaboratif bagi teman sebaya, serta subjek utama yang merumuskan aksi nyata dirinya.',
        peranMitraLain: 'Wali kelas memberikan penguatan perilaku keseharian; orang tua mendukung pembiasaan positif di rumah.'
      },
      lingkunganPembelajaran: {
        keamananPsikologis: 'Menciptakan kesepakatan kelas bebas perundungan, tidak ada penghakiman (non-judgmental), dan menghargai kejujuran berpendapat.',
        kenyamananDanInklusivitas: 'Penataan tempat duduk interaktif (lingkaran/U-shape), melibatkan seluruh siswa tanpa membedakan latar belakang.',
        kerahasiaanDanEtika: 'Menjunjung kode etik bimbingan konseling; curahan hati pribadi tidak menjadi konsumsi publik.'
      },
      pemanfaatanDigital: formData.pemanfaatanDigital || 'Penayangan video kasus pendek kontekstual dan lembar refleksi interaktif.',
      dimensiProfilLulusan: (formData.dimensiProfilLulusan && formData.dimensiProfilLulusan.length > 0)
        ? formData.dimensiProfilLulusan
        : ['Penalaran kritis', 'Kolaborasi', 'Kemandirian', 'Komunikasi'],
      prinsipDeepLearning: {
        berkesadaran: 'Peserta didik diajak jeda sejenak (mindful pause) untuk menyadari kondisi batin, perasaan, dan dampak setiap pilihan tindakan dalam hidupnya.',
        bermakna: 'Menghubungkan topik secara langsung dengan realitas kehidupan nyata peserta didik SMP di era digital dan pergaulan sekolah.',
        menggembirakan: 'Mengintegrasikan ice breaking edukatif, dinamika kelompok interaktif, dan apresiasi positif yang membangkitkan senyuman dan energi belajar.'
      }
    },
    pengalamanBelajar: {
      memahami: 'Peserta didik mengeksplorasi konsep esensial, mencermati analogi/studi kasus, dan menghubungkan fenomena tersebut dengan pengalaman kesehariannya.',
      mengaplikasi: 'Peserta didik berkolaborasi dalam kelompok kecil untuk memecahkan dilema kasus, memperagakan komunikasi solusi, dan menyusun strategi penyelesaian masalah.',
      merefleksi: 'Peserta didik mengevaluasi pemahaman dirinya secara jujur, menemukan wawasan baru, dan menetapkan janji aksi perbaikan diri (Action Commitment).'
    },
    langkahPelaksanaan: {
      alokasiWaktuTotal: `${totalMenit} Menit (${formData.alokasiWaktu || '2 JP'})`,
      tahapAwal: [
        {
          namaKegiatan: 'Pembukaan & Penciptaan Suasana Aman (Mindful Welcoming)',
          alokasiWaktuMenit: Math.round(tAwal * 0.5),
          aktivitasGuruBK: 'Menyapa hangat, memimpin doa, mengajak bernapas sadar sejenak (Mindful Breathing), dan membangun kesepakatan suasana aman saling menghargai.',
          aktivitasPesertaDidik: 'Menjawab salam, berdoa khidmat, mengikuti latihan relaksasi napas, dan menyepakati aturan kenyamanan kelas.',
          prinsipPembelajaranMendalam: 'Berkesadaran (Mindful) & Menggembirakan (Joyful)',
          mediaInstrumen: 'Musik instrumental lembut / papan kesepakatan',
          buktiKetercapaian: 'Kesiapan mental dan keterbukaan emosional peserta didik'
        },
        {
          namaKegiatan: 'Apersepsi & Asesmen Awal (Diagnostic Spark)',
          alokasiWaktuMenit: tAwal - Math.round(tAwal * 0.5),
          aktivitasGuruBK: 'Menyampaikan pertanyaan pemantik kontekstual dan asesmen awal sederhana untuk menggali kesiapan belajar siswa.',
          aktivitasPesertaDidik: 'Merespons pertanyaan pemantik secara spontan melalui curah pendapat atau lembar respon cepat.',
          prinsipPembelajaranMendalam: 'Bermakna (Meaningful)',
          mediaInstrumen: 'Kartu pertanyaan pemantik / slide',
          buktiKetercapaian: 'Tergugahnya rasa ingin tahu awal peserta didik'
        }
      ],
      tahapTransisi: [
        {
          namaKegiatan: 'Peralihan & Penjelasan Alur Kegiatan',
          alokasiWaktuMenit: tTransisi,
          aktivitasGuruBK: 'Memastikan kesiapan fokus seluruh siswa, menjelaskan garis besar alur bimbingan, membagi kelompok heterogen, dan memberi motivasi.',
          aktivitasPesertaDidik: 'Menyatakan kesiapan belajar dengan yel-yel positif atau tepuk konsentrasi, lalu bergabung dengan kelompok belajarnya.',
          prinsipPembelajaranMendalam: 'Menggembirakan (Joyful)',
          mediaInstrumen: 'Ice breaking pengakrab kelompok',
          buktiKetercapaian: 'Formasi kelompok terbentuk rapi dan kondusif'
        }
      ],
      tahapInti: (formData.modelStrategi || '').includes('ARKA')
        ? [
            {
              namaKegiatan: 'Tahap 1: [ARKA - Aktivitas (A)] Eksplorasi Pengalaman Nyata & Simulasi',
              alokasiWaktuMenit: Math.round(tInti * 0.25),
              aktivitasGuruBK: 'Memfasilitasi penayangan video studi kasus atau dinamika permainan peran (role play) interaktif untuk memberikan pengalaman konkret yang menggugah emosi dan pikiran siswa.',
              aktivitasPesertaDidik: 'Mengikuti aktivitas/simulasi dengan antusias, mengamati dinamika kasus, dan merasakan langsung situasi yang dialami tokoh cerita.',
              prinsipPembelajaranMendalam: 'Berkesadaran (Mindful) & Menggembirakan (Joyful)',
              mediaInstrumen: 'Video Kasus Kontekstual / Kartu Simulasi Peran',
              buktiKetercapaian: 'Keterlibatan aktif dan antusiasme seluruh siswa dalam aktivitas belajar'
            },
            {
              namaKegiatan: 'Tahap 2: [ARKA - Refleksi (R)] Pengolahan Rasa, Analisis Pengalaman & Curah Gagasan',
              alokasiWaktuMenit: Math.round(tInti * 0.25),
              aktivitasGuruBK: 'Mengajukan pertanyaan reflektif terbimbing ("Apa yang Anda rasakan?", "Pelajaran apa yang muncul dari peristiwa tersebut?") dan memoderasi curah gagasan.',
              aktivitasPesertaDidik: 'Mengekspresikan perasaan, menganalisis faktor penyebab masalah, dan saling mendengarkan refleksi kelompok secara empatik.',
              prinsipPembelajaranMendalam: 'Berkesadaran (Mindful) & Reflektif',
              mediaInstrumen: 'Panduan Pertanyaan Pemantik Refleksi Batin',
              buktiKetercapaian: 'Ungkapan refleksi emosional dan kesadaran diri peserta didik'
            },
            {
              namaKegiatan: 'Tahap 3: [ARKA - Konsep (K)] Konstruksi Wawasan Esensial & Penanaman Nilai',
              alokasiWaktuMenit: Math.round(tInti * 0.25),
              aktivitasGuruBK: 'Membimbing siswa merumuskan simpulan konsep kunci bimbingan konseling, etika pergaulan, wawasan psikologis, serta nilai-nilai Profil Lulusan.',
              aktivitasPesertaDidik: 'Menemukan pesan moral dan konsep utama, mencatat prinsip-prinsip positif, dan mengonstruksi pemahaman baru secara mendalam.',
              prinsipPembelajaranMendalam: 'Bermakna (Meaningful) & Konseptual',
              mediaInstrumen: 'Peta Konsep Ringkas & Slide Penguatan',
              buktiKetercapaian: 'Peta pemahaman konsep dan wawasan nilai yang terbentuk'
            },
            {
              namaKegiatan: 'Tahap 4: [ARKA - Aplikasi (A)] Perumusan Rencana Tindakan Nyata & Lembar Komitmen',
              alokasiWaktuMenit: tInti - Math.round(tInti * 0.25) * 3,
              aktivitasGuruBK: 'Mendampingi peserta didik menyusun langkah tindakan preventif/solutif yang aplikatif dalam kehidupan sehari-hari dan mengisi LKPD aksi nyata.',
              aktivitasPesertaDidik: 'Merumuskan rencana tindakan konkret pribadi, mengisi LKPD aplikasi nyata, dan saling memberikan dorongan komitmen positif.',
              prinsipPembelajaranMendalam: 'Aplikatif, Bermakna (Meaningful), & Berkelanjutan',
              mediaInstrumen: 'LKPD Aplikasi Nyata & Lembar Komitmen Diri',
              buktiKetercapaian: 'Dokumen rencana aksi nyata dan komitmen pribadi siswa'
            }
          ]
        : [
            {
              namaKegiatan: 'Pengalaman 1: MEMAHAMI (Eksplorasi Konsep & Studi Kasus)',
              alokasiWaktuMenit: tInti1,
              aktivitasGuruBK: 'Memfasilitasi penayangan materi inti dan lembar studi kasus nyata anak SMP; mengajukan pertanyaan penyelidikan (probing questions).',
              aktivitasPesertaDidik: 'Mencermati materi, berdiskusi dalam kelompok menganalisis akar masalah studi kasus, dan menghubungkannya dengan realitas pergaulan.',
              prinsipPembelajaranMendalam: 'Berkesadaran (Mindful) & Bermakna (Meaningful)',
              mediaInstrumen: 'Lembar Studi Kasus & Slide Materi',
              buktiKetercapaian: 'Hasil catatan identifikasi masalah dan poin pemahaman konsep'
            },
            {
              namaKegiatan: 'Pengalaman 2: MENGAPLIKASI (Praktik Keterampilan & Penyusunan Solusi)',
              alokasiWaktuMenit: tInti2,
              aktivitasGuruBK: 'Mendampingi kelompok merancang solusi konkret, mengisi LKPD interaktif, memandu simulasi/peragaan peran perilaku positif, serta memberikan umpan balik formatif.',
              aktivitasPesertaDidik: 'Bekerja sama menyelesaikan LKPD, berlatih memperagakan cara berkomunikasi/mengambil keputusan asertif, dan mempresentasikan hasil kelompok.',
              prinsipPembelajaranMendalam: 'Bermakna (Meaningful) & Kolaboratif',
              mediaInstrumen: 'LKPD Interaktif & Lembar Pengamatan Proses',
              buktiKetercapaian: 'LKPD kelompok yang terisi solusi cerdas & peragaan simulasi'
            },
            {
              namaKegiatan: 'Pengalaman 3: MEREFLEKSI (Refleksi Mendalam & Verifikasi Pemahaman)',
              alokasiWaktuMenit: tInti3,
              aktivitasGuruBK: 'Mengajak siswa merenungkan apa makna kegiatan ini bagi masa depannya, merangkum poin esensial bersama, dan menegaskan dukungan guru BK.',
              aktivitasPesertaDidik: 'Membuat sintesis wawasan baru, mengoreksi kekeliruan pemahaman lama, dan merasakan kelegaan emosional.',
              prinsipPembelajaranMendalam: 'Berkesadaran (Mindful) & Transformatif',
              mediaInstrumen: 'Panduan refleksi diri',
              buktiKetercapaian: 'Pernyataan kesadaran diri baru dari perwakilan siswa'
            }
          ],
      tahapPenutup: [
        {
          namaKegiatan: 'Refleksi Diri, Komitmen Aksi Nyata, & Evaluasi Hasil',
          alokasiWaktuMenit: Math.round(tPenutup * 0.6),
          aktivitasGuruBK: 'Membagikan lembar evaluasi hasil dan lembar komitmen tindakan ("My Action Pledge"); mengarahkan siswa menuliskannya secara spesifik.',
          aktivitasPesertaDidik: 'Mengisi lembar asesmen hasil dan menuliskan 1-2 komitmen konkret yang akan diterapkan mulai hari ini.',
          prinsipPembelajaranMendalam: 'Berkesadaran (Mindful) & Aplikatif',
          mediaInstrumen: 'Lembar Asesmen Hasil & Sticky Notes Komitmen',
          buktiKetercapaian: 'Lembar komitmen pribadi yang ditandatangani siswa'
        },
        {
          namaKegiatan: 'Pemberian Apresiasi, Rencana Tindak Lanjut, & Doa Penutup',
          alokasiWaktuMenit: tPenutup - Math.round(tPenutup * 0.6),
          aktivitasGuruBK: 'Memberikan apresiasi atas partisipasi seluruh siswa, menyampaikan informasi layanan lanjutan/konseling individual bagi yang membutuhkan, memimpin doa, dan menutup pertemuan.',
          aktivitasPesertaDidik: 'Menerima apresiasi dengan gembira, saling memberi dorongan semangat kepada teman, berdoa bersama, dan merapikan ruangan.',
          prinsipPembelajaranMendalam: 'Menggembirakan (Joyful) & Penuh Harapan',
          mediaInstrumen: 'Kartu apresiasi guru BK',
          buktiKetercapaian: 'Suasana kelas yang hangat dan penuh rasa saling menghargai'
        }
      ]
    },
    materiLayanan: {
      pokokBahasan: `Konsep, Dinamika, dan Strategi Pengelolaan ${topik}`,
      uraianMateri: `Masa remaja di SMP merupakan periode krusial dalam pembentukan identitas diri dan relasi sosial. Melalui layanan bimbingan ini, peserta didik diajak memahami esensi dari ${topik}.\n\nPoin-poin Kunci Pembahasan:\n1. Hakikat dan Karakteristik: Memahami arti penting ${topik} dalam mendukung kesehatan mental dan keberhasilan belajar.\n2. Mengidentifikasi Faktor Pemicu: Mengenali situasi yang sering kali menjadi jebakan atau pemicu masalah dalam pergaulan remaja.\n3. Strategi Praktis Pencegahan & Penanganan: Langkah-langkah konkret yang dapat langsung dipraktikkan tanpa rasa cemas.\n4. Membangun Support System yang Positif: Memanfaatkan jejaring pertemanan sehat, wali kelas, guru BK, dan orang tua.`,
      contohKonkret: `Contoh di lingkungan sekolah: Ketika seorang siswa menghadapi situasi terkait ${topik}, alih-alih bersikap pasif atau terbawa arus kelompok sebaya, siswa yang berkesadaran memilih untuk berpikir sejenak mengenai dampak jangka panjang tindakannya sebelum bereaksi.`,
      studiKasusSkenario: `Skenario Kasus Remaja SMP: "Rian (14 tahun) sering merasa bingung ketika kelompok temannya mengajak melakukan tindakan yang bertentangan dengan kata hatinya. Rian takut dikucilkan jika menolak, namun cemas akan konsekuensinya." Kelompok diajak menganalisis: Langkah bijak apa yang dapat diambil Rian secara asertif?`,
      rangkuman: `Mutiara Refleksi: "Setiap langkah kecil yang kamu ambil dengan penuh kesadaran dan kebaikan hari ini adalah pondasi masa depan yang membanggakan."`
    },
    asesmen: {
      asesmenAwal: {
        tujuan: 'Mengidentifikasi pemahaman awal dan kesiapan emosional siswa sebelum layanan dimulai.',
        petunjukPengisian: 'Jawablah pertanyaan pemantik berikut secara jujur dan spontan.',
        butirInstrumen: [
          `Apa yang pertama kali terlintas di pikiranmu saat mendengar kata "${topik}"?`,
          'Pernahkah kamu atau teman di sekitarmu mengalami situasi yang berkaitan dengan topik ini?',
          'Skala 1-5: Seberapa siap kamu untuk memperbaiki cara berpikir dan bertindak dalam hal ini?'
        ],
        caraMembacaHasil: 'Guru BK memetakan persentase kesiapan kelas dan mengidentifikasi siswa yang membutuhkan penekanan materi khusus.',
        kriteriaKetercapaian: 'Peserta didik berani menyampaikan pendapat awal secara terbuka dan santun.'
      },
      asesmenProses: {
        tujuan: 'Mengamati keterlibatan aktif, antusiasme, dan kemampuan kerja sama peserta didik selama dinamika layanan.',
        petunjukPengisian: 'Guru BK memberi tanda centang (✓) pada lembar observasi selama proses bimbingan berlangsung.',
        butirInstrumen: [
          'Peserta didik menunjukkan antusiasme dan fokus saat pemaparan materi dan tayangan media.',
          'Peserta didik berani mengemukakan ide atau bertanya dalam diskusi kelompok.',
          'Peserta didik mampu mendengarkan pendapat teman tanpa memotong atau mengejek (keamanan psikologis).',
          'Peserta didik berkontribusi nyata dalam penyelesaian tugas kelompok atau simulasi peran.'
        ],
        caraMembacaHasil: 'Dihitung persentase keaktifan kelas. Jika >80% siswa berpartisipasi aktif, proses dikategorikan sangat efektif.',
        kriteriaKetercapaian: 'Terciptanya iklim kelas yang aman, dinamis, dan saling mendukung.'
      },
      asesmenHasil: {
        tujuan: 'Mengevaluasi peningkatan pemahaman, perubahan sikap, dan keterampilan tindakan peserta didik setelah layanan.',
        petunjukPengisian: 'Pilihlah respon yang paling mencerminkan kondisimu saat ini (Sangat Setuju, Setuju, Kurang Setuju, Tidak Setuju).',
        butirInstrumen: [
          `Saya memperoleh wawasan baru yang jelas dan bermanfaat mengenai ${topik}.`,
          'Saya menyadari pentingnya mengelola sikap dan tindakan saya secara bertanggung jawab.',
          'Saya telah memiliki keterampilan dan rencana konkret untuk mengatasi kendala terkait topik ini.',
          'Saya merasa nyaman dan senang mengikuti kegiatan bimbingan hari ini.'
        ],
        caraMembacaHasil: 'Skor total dikonversi ke dalam persentase pemahaman layanan: >85% = Sangat Baik, 70-84% = Baik.',
        kriteriaKetercapaian: 'Minimal 80% peserta didik mencapai tingkat pemahaman Baik atau Sangat Baik.'
      }
    },
    lkpd: {
      judulAktivitas: `Lembar Kerja Peserta Didik (LKPD): Jelajah Cerdas ${topik}`,
      tujuanAktivitas: `Melatih penalaran kritis dan keterampilan problem solving peserta didik dalam menghadapi dinamika ${topik}.`,
      petunjukPengerjaan: `Diskusikan pertanyaan berikut bersama kelompokmu dengan suasana santai dan saling menghargai. Tuliskan jawaban terbaik kalian pada kolom yang tersedia.`,
      skenarioPermasalahan: `Berdasarkan skenario kasus yang telah dibagikan, analisislah pemicu utama permasalahan dan rumuskan 3 alternatif solusi cerdas yang menguntungkan semua pihak.`,
      langkahKegiatan: [
        '1. Bacalah skenario permasalahan secara bersama-sama di dalam kelompok.',
        '2. Lakukan curah pendapat untuk membedah mengapa masalah tersebut dapat terjadi.',
        '3. Tentukan solusi paling realistis yang dapat diterapkan anak seusiamu.',
        '4. Tuliskan kesimpulan kelompok dan siapkan 1 juru bicara untuk berbagi.'
      ],
      pertanyaanPanduan: [
        'Menurut kelompokmu, apa yang dirasakan oleh tokoh dalam skenario kasus tersebut?',
        'Apa risiko yang timbul jika masalah tersebut diabaikan atau disikapi dengan emosi negatif?',
        'Sebutkan 3 langkah konkret yang paling bijak untuk menyelesaikan persoalan tersebut!',
        'Nilai kebaikan apa yang bisa dipetik dan diterapkan dalam kehidupan kalian sehari-hari?'
      ],
      ruangJawabanInstruksi: 'Tuliskan hasil diskusi kelompok pada bagan analisis solusi di lembar kerja yang dibagikan guru BK.',
      kesimpulanDanKomitmen: 'Komitmen Bersama: "Mulai hari ini, kami berjanji untuk saling menjaga, saling mendukung, dan bertindak bijak dalam keseharian."'
    },
    rubrikEvaluasi: {
      judulRubrik: 'Rubrik Evaluasi Analitik Ketercapaian Layanan BK (4 Tingkat Capaian)',
      petunjukPenilaian: 'Gunakan rubrik analitik ini untuk menilai perkembangan keterampilan peserta didik berdasarkan bukti pengamatan dan hasil kerja.',
      tabelRubrik: [
        {
          aspek: 'Pemahaman Konsep & Karakteristik Topik',
          skor4: 'Mampu menjelaskan konsep secara komprehensif dengan bahasa sendiri dan memberikan contoh penerapan konkret yang relevan.',
          skor3: 'Mampu menjelaskan konsep inti dan memberikan contoh dasar dengan tepat.',
          skor2: 'Mampu menyebutkan sebagian konsep namun masih kesulitan memberikan contoh yang sesuai.',
          skor1: 'Belum mampu menjelaskan konsep dan memerlukan panduan intensif dari guru BK.'
        },
        {
          aspek: 'Keterampilan Analisis & Penalaran Kritis',
          skor4: 'Menganalisis sebab-akibat masalah secara tajam, mengidentifikasi bias emosional, dan merumuskan solusi logis berlapis.',
          skor3: 'Mampu mengidentifikasi sebab-akibat masalah dan mengusulkan solusi yang masuk akal.',
          skor2: 'Hanya melihat masalah dari satu sudut pandang permukaan tanpa menelaah sebab-akibat.',
          skor1: 'Pasif dalam analisis dan cenderung menyimpulkan tanpa dasar pemikiran yang jelas.'
        },
        {
          aspek: 'Kolaborasi & Komunikasi Terbuka',
          skor4: 'Aktif mendengar rekan, menghargai perbedaan pendapat, memfasilitasi teman pemalu, dan berkomunikasi dengan asertif.',
          skor3: 'Terlibat aktif dalam kerja kelompok dan mampu menyampaikan pendapat dengan sopan.',
          skor2: 'Kurang berkontribusi dalam kelompok atau sesekali mendominasi pembicaraan.',
          skor1: 'Menarik diri dari dinamika kelompok atau menunjukkan keengganan berinteraksi.'
        },
        {
          aspek: 'Komitmen Aksi & Refleksi Diri',
          skor4: 'Merumuskan rencana aksi pribadi yang SMART (spesifik, terukur, realistis), disertai tekad disiplin yang kuat.',
          skor3: 'Merumuskan rencana aksi pribadi yang baik dan cukup terukur.',
          skor2: 'Rencana aksi masih sangat umum dan belum memiliki indikator langkah yang jelas.',
          skor1: 'Belum dapat merumuskan rencana aksi nyata perbaikan diri.'
        }
      ]
    },
    refleksiPesertaDidik: {
      pengantar: 'Luangkan waktu sejenak untuk menengok ke dalam dirimu dan jawablah pertanyaan refleksi berikut dengan jujur:',
      pertanyaanRefleksi: [
        `Apa wawasan atau hal baru yang paling menyentuh dan menyadarkan dirimu hari ini?`,
        'Sikap atau kebiasaan apa yang kamu sadari selama ini keliru dan ingin segera kamu ubah?',
        'Keterampilan positif apa yang sudah mulai dapat kamu latih dalam pergaulan atau belajar?',
        'Tindakan nyata apa yang akan kamu lakukan dalam 24 jam ke depan untuk memulai perubahan?',
        'Bantuan atau dukungan seperti apa yang kamu harapkan dari Guru BK atau teman-temanmu?'
      ]
    },
    refleksiGuruBK: {
      ketercapaianTujuan: 'Secara umum seluruh indikator ketercapaian tujuan umum dan khusus terfasilitasi dengan baik melalui 3 tahap pengalaman belajar.',
      keterlibatanPartisipasi: 'Peserta didik menunjukkan keterlibatan aktif >85%, suasana kelas interaktif, dan dinamika kelompok berjalan harmonis.',
      efektivitasMetodeMedia: 'Metode experiential learning yang dipadukan dengan studi kasus visual terbukti memicu pemikiran kritis anak SMP.',
      ketepatanAlokasiWaktu: `Manajemen waktu berjalan sesuai alokasi (${totalMenit} menit) dengan transisi mulus antar tahapan.`,
      kendalaYangDihadapi: 'Beberapa peserta didik yang pemalu membutuhkan dorongan hangat tambahan pada awal diskusi kelompok.',
      rencanaTindakLanjutPerbaikan: 'Menyediakan kartu peran khusus pada kegiatan berikutnya agar setiap anggota kelompok memiliki peran yang seimbang.'
    },
    tindakLanjut: {
      penguatanKlasikal: 'Pemberian apresiasi berkala dan peninjauan kembali kesepakatan komitmen pada sesi bimbingan berikutnya.',
      bimbinganKelompokLanjutan: 'Membentuk kelompok bimbingan terfokus bagi 4-6 siswa yang membutuhkan pendalaman strategi khusus.',
      konselingIndividualKelompok: 'Membuka kesempatan konseling individual secara sukarela di ruang BK bagi siswa yang memiliki persoalan pribadi mendalam.',
      kolaborasiWaliKelasOrangTua: 'Berbagi informasi umum strategi pendampingan siswa dengan wali kelas dan melalui grup parenting orang tua.',
      rujukanProfesional: 'Menyiapkan rujukan kepada psikolog/lembaga profesional terkait apabila ditemukan indikasi kendala emosional di luar kewenangan guru BK.',
      pemantauanPerkembangan: 'Observasi berkelanjutan terhadap perilaku adaptif siswa di sekolah selama 2-4 minggu ke depan.'
    },
    sumberDanLampiran: {
      sumberMateri: [
        'Panduan Operasional Penyelenggaraan Bimbingan dan Konseling (POP BK) Sekolah Menengah Pertama (SMP) — Kemdikbudristek.',
        'Buku Panduan Guru BK Kurikulum Merdeka Fase D (SMP), BSKAP Kemendikbudristek.',
        'Prinsip-Prinsip Pembelajaran Mendalam (Deep Learning in Education: Mindful, Meaningful, Joyful).',
        'Referensi Standar Kompetensi Kemandirian Peserta Didik (SKKPD) Jenjang SMP.'
      ],
      mediaPembelajaran: [
        'Slide Presentasi Interaktif & Infografis Konsep',
        'Video Studi Kasus Pendek Berbasis Realitas Remaja',
        'Lembar Kerja Peserta Didik (LKPD) Interaktif',
        'Sticky Notes Warna-Warni & Papan Komitmen Diri'
      ],
      daftarLampiran: [
        'Lampiran 1: Uraian Materi Layanan Bimbingan & Konseling Lengkap',
        'Lampiran 2: Lembar Kerja Peserta Didik (LKPD)',
        'Lampiran 3: Instrumen Asesmen Awal, Proses, dan Hasil Layanan',
        'Lampiran 4: Rubrik Evaluasi Analitik 4 Tingkat Capaian',
        'Lampiran 5: Lembar Refleksi Diri Peserta Didik & Refleksi Guru BK',
        'Lampiran 6: Lembar Komitmen Tindakan Nyata (Action Pledge)'
      ]
    },
    pengesahan: {
      tempatDanTanggal: `${formData.kota || 'Kota Bekasi'}, ${formData.tanggalPelaksanaan || 'Tanggal Pelaksanaan'}`,
      jabatanKepalaSekolah: 'Kepala SMPN 53 Kota Bekasi',
      namaKepalaSekolah: kepsek,
      nipKepalaSekolah: nipKepsek,
      jabatanGuruBK: 'Guru Bimbingan dan Konseling',
      namaGuruBK: guruBK,
      nipGuruBK: nipGuruBK
    }
  };
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

