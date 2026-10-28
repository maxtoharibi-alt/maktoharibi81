/**
 * AI Generator RPL (RPM) — SMPN 53 Kota Bekasi
 * Types definition for BK Deep Learning Lesson Plan
 */

export type KelasOption = 'VII' | 'VIII' | 'IX' | 'Seluruh Kelas';
export type SemesterOption = 'Ganjil' | 'Genap';
export type BidangLayananOption = 'Pribadi' | 'Sosial' | 'Belajar' | 'Karier';
export type KomponenLayananOption = 'Layanan Dasar' | 'Layanan Responsif' | 'Perencanaan Individual' | 'Dukungan Sistem';
export type JenisLayananOption = 
  | 'Bimbingan Klasikal' 
  | 'Bimbingan Kelompok' 
  | 'Konseling Individual' 
  | 'Konseling Kelompok' 
  | 'Konsultasi' 
  | 'Kolaborasi' 
  | 'Advokasi' 
  | 'Layanan Informasi' 
  | 'Layanan Orientasi';

export type KedalamanOption = 'Ringkas' | 'Lengkap' | 'Sangat Terperinci';

export interface RplFormData {
  // Identitas Layanan
  namaSekolah: string;
  namaGuruBK: string;
  nipGuruBK: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  kota: string;
  tahunPelajaran: string;
  semester: SemesterOption;
  kelas: KelasOption;
  fase: string;
  komponenLayanan: KomponenLayananOption;
  bidangLayanan: BidangLayananOption;
  jenisLayanan: JenisLayananOption;
  fungsiLayanan: string;
  topik: string;
  alokasiWaktu: string;
  durasiMenit: number;
  jumlahPertemuan: string;
  tanggalPelaksanaan: string;
  jumlahPesertaDidik: string;

  // Identifikasi Kebutuhan
  hasilAsesmenKebutuhan: string;
  permasalahanDitemukan: string;
  karakteristikPesertaDidik: string;
  kesiapanBelajar: string;
  pengalamanAwal: string;
  potensiKekuatan: string;
  kebutuhanKhusus: string;

  // Preferensi Pembelajaran
  metodeLayanan: string[];
  modelStrategi: string;
  mediaTersedia: string[];
  pemanfaatanDigital: string;
  dimensiProfilLulusan: string[];

  // Pengaturan Output
  kedalaman: KedalamanOption;
  sertakanLkpd: boolean;
  sertakanAsesmen: boolean;
  sertakanRubrik: boolean;
  sertakanRefleksi: boolean;
  sertakanMateri: boolean;
  sertakanTindakLanjut: boolean;
  instruksiKhusus: string;
}

export interface ActivityStep {
  namaKegiatan: string;
  alokasiWaktuMenit: number;
  aktivitasGuruBK: string;
  aktivitasPesertaDidik: string;
  prinsipPembelajaranMendalam: string; // e.g. "Berkesadaran (Mindful) & Menggembirakan"
  mediaInstrumen: string;
  buktiKetercapaian: string;
}

export interface AsesmenDetail {
  tujuan: string;
  petunjukPengisian: string;
  butirInstrumen: string[];
  caraMembacaHasil: string;
  kriteriaKetercapaian: string;
}

export interface RubrikRow {
  aspek: string;
  skor4: string; // Sangat Berkembang
  skor3: string; // Berkembang Sesuai Harapan
  skor2: string; // Mulai Berkembang
  skor1: string; // Memerlukan Bimbingan
}

export interface RplDocument {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  title: string;

  // Bagian 1 — Identitas RPL
  identitas: {
    satuanPendidikan: string;
    namaGuruBK: string;
    nipGuruBK: string;
    namaKepalaSekolah: string;
    nipKepalaSekolah: string;
    tahunPelajaran: string;
    kelasFase: string;
    semester: string;
    komponenLayanan: string;
    bidangLayanan: string;
    jenisLayanan: string;
    fungsiLayanan: string;
    topikLayanan: string;
    alokasiWaktu: string;
    jumlahPertemuan: string;
    tanggalPelaksanaan: string;
    sasaranLayanan: string;
  };

  // Bagian 2 — Identifikasi Kebutuhan Peserta Didik
  identifikasiKebutuhan: {
    dasarKebutuhan: string;
    hasilAsesmenKebutuhan: string;
    karakteristikPerkembangan: string;
    kesiapanDanPengalamanAwal: string;
    permasalahanPrioritas: string;
    potensiDanKekuatan: string;
    kebutuhanDukunganAkomodasi: string;
  };

  // Bagian 3 — Tujuan Layanan
  tujuanLayanan: {
    tujuanUmum: string;
    tujuanKhusus: string[];
    indikatorKetercapaian: string[];
    kompetensiKeterampilan: string[];
  };

  // Bagian 4 — Desain Pembelajaran Mendalam
  desainPembelajaranMendalam: {
    praktikPedagogis: {
      pendekatan: string;
      strategiModel: string;
      metode: string;
      teknikFasilitasi: string;
    };
    kemitraanPembelajaran: {
      peranGuruBK: string;
      peranPesertaDidik: string;
      peranMitraLain: string; // Wali kelas, guru mapel, orang tua
    };
    lingkunganPembelajaran: {
      keamananPsikologis: string;
      kenyamananDanInklusivitas: string;
      kerahasiaanDanEtika: string;
    };
    pemanfaatanDigital: string;
    dimensiProfilLulusan: string[];
    prinsipDeepLearning: {
      berkesadaran: string; // Mindful
      bermakna: string;     // Meaningful
      menggembirakan: string; // Joyful
    };
  };

  // Bagian 5 — Pengalaman Belajar
  pengalamanBelajar: {
    memahami: string;
    mengaplikasi: string;
    merefleksi: string;
  };

  // Bagian 6 — Langkah-Langkah Pelaksanaan
  langkahPelaksanaan: {
    alokasiWaktuTotal: string;
    tahapAwal: ActivityStep[];
    tahapTransisi: ActivityStep[];
    tahapInti: ActivityStep[];
    tahapPenutup: ActivityStep[];
  };

  // Bagian 7 — Materi Layanan
  materiLayanan?: {
    pokokBahasan: string;
    uraianMateri: string;
    contohKonkret: string;
    studiKasusSkenario: string;
    rangkuman: string;
  };

  // Bagian 8 — Asesmen
  asesmen?: {
    asesmenAwal: AsesmenDetail;
    asesmenProses: AsesmenDetail;
    asesmenHasil: AsesmenDetail;
  };

  // Bagian 9 — LKPD / Lembar Aktivitas
  lkpd?: {
    judulAktivitas: string;
    tujuanAktivitas: string;
    petunjukPengerjaan: string;
    skenarioPermasalahan: string;
    langkahKegiatan: string[];
    pertanyaanPanduan: string[];
    ruangJawabanInstruksi: string;
    kesimpulanDanKomitmen: string;
  };

  // Bagian 10 — Rubrik Evaluasi
  rubrikEvaluasi?: {
    judulRubrik: string;
    petunjukPenilaian: string;
    tabelRubrik: RubrikRow[];
  };

  // Bagian 11 — Refleksi Peserta Didik
  refleksiPesertaDidik?: {
    pengantar: string;
    pertanyaanRefleksi: string[];
  };

  // Bagian 12 — Refleksi Guru BK
  refleksiGuruBK?: {
    ketercapaianTujuan: string;
    keterlibatanPartisipasi: string;
    efektivitasMetodeMedia: string;
    ketepatanAlokasiWaktu: string;
    kendalaYangDihadapi: string;
    rencanaTindakLanjutPerbaikan: string;
  };

  // Bagian 13 — Tindak Lanjut
  tindakLanjut?: {
    penguatanKlasikal: string;
    bimbinganKelompokLanjutan: string;
    konselingIndividualKelompok: string;
    kolaborasiWaliKelasOrangTua: string;
    rujukanProfesional: string;
    pemantauanPerkembangan: string;
  };

  // Bagian 14 — Sumber dan Lampiran
  sumberDanLampiran: {
    sumberMateri: string[];
    mediaPembelajaran: string[];
    daftarLampiran: string[];
  };

  // Bagian 15 — Pengesahan
  pengesahan: {
    tempatDanTanggal: string;
    jabatanKepalaSekolah: string;
    namaKepalaSekolah: string;
    nipKepalaSekolah: string;
    jabatanGuruBK: string;
    namaGuruBK: string;
    nipGuruBK: string;
  };
}
