import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  ShadingType
} from 'docx';
import { RplDocument, RubrikRow } from '../types/rpl';

const FONT_FAMILY = 'Times New Roman';
const PRIMARY_COLOR = '1E3A8A'; // Navy blue
const BORDER_COLOR = 'CBD5E1';

const thinBorder = {
  top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
  left: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
  right: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
};

const emptyBorder = {
  top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
};

function createCell(
  text: string | Paragraph[],
  options?: {
    isHeader?: boolean;
    bold?: boolean;
    widthPercent?: number;
    colSpan?: number;
    bgColor?: string;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    noBorder?: boolean;
  }
): TableCell {
  const isHeader = options?.isHeader ?? false;
  const bold = options?.bold ?? isHeader;
  const widthPercent = options?.widthPercent;
  const colSpan = options?.colSpan;
  const bgColor = options?.bgColor || (isHeader ? 'F1F5F9' : undefined);
  const align = options?.align || AlignmentType.LEFT;
  const noBorder = options?.noBorder ?? false;

  let children: Paragraph[];
  if (Array.isArray(text)) {
    children = text;
  } else {
    children = [
      new Paragraph({
        alignment: align,
        spacing: { before: 80, after: 80 },
        children: [
          new TextRun({
            text: text || '-',
            font: FONT_FAMILY,
            size: isHeader ? 21 : 20, // 10-10.5pt
            bold,
            color: isHeader ? '0F172A' : '1E293B',
          }),
        ],
      }),
    ];
  }

  return new TableCell({
    width: widthPercent ? { size: widthPercent * 100, type: WidthType.PERCENTAGE } : undefined,
    columnSpan: colSpan,
    borders: noBorder ? emptyBorder : thinBorder,
    shading: bgColor ? { fill: bgColor, type: ShadingType.CLEAR } : undefined,
    children,
  });
}

function createSectionHeader(title: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    border: {
      left: { style: BorderStyle.SINGLE, size: 24, color: PRIMARY_COLOR },
    },
    shading: {
      fill: 'F8FAFC',
      type: ShadingType.CLEAR,
    },
    children: [
      new TextRun({
        text: `  ${title.toUpperCase()}`,
        font: FONT_FAMILY,
        size: 22, // 11pt
        bold: true,
        color: PRIMARY_COLOR,
      }),
    ],
  });
}

function createSubHeader(title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 140, after: 80 },
    children: [
      new TextRun({
        text: title,
        font: FONT_FAMILY,
        size: 21,
        bold: true,
        color: '0F172A',
      }),
    ],
  });
}

function createParagraph(text: string, options?: { italic?: boolean; bold?: boolean }): Paragraph {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({
        text: text || '',
        font: FONT_FAMILY,
        size: 21,
        italics: options?.italic,
        bold: options?.bold,
        color: '1E293B',
      }),
    ],
  });
}

function createBullet(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 40 },
    children: [
      new TextRun({
        text: text || '',
        font: FONT_FAMILY,
        size: 21,
        color: '1E293B',
      }),
    ],
  });
}

export async function exportRplToDocx(rpl: RplDocument) {
  const identitas = rpl.identitas || ({} as any);
  const identifikasi = rpl.identifikasiKebutuhan || ({} as any);
  const tujuan = rpl.tujuanLayanan || ({} as any);
  const desain = rpl.desainPembelajaranMendalam || ({} as any);
  const pengalaman = rpl.pengalamanBelajar || ({} as any);
  const langkah = rpl.langkahPelaksanaan || ({} as any);
  const materi = rpl.materiLayanan || ({} as any);
  const asesmen = rpl.asesmen || ({} as any);
  const lkpd = rpl.lkpd;
  const rubrik = rpl.rubrikEvaluasi;
  const refleksiSiswa = rpl.refleksiPesertaDidik;
  const refleksiGuru = rpl.refleksiGuruBK;
  const tindakLanjut = rpl.tindakLanjut;
  const sumberLampiran = rpl.sumberDanLampiran || ({} as any);
  const pengesahan = rpl.pengesahan || ({} as any);

  // KOP SURAT
  const kopParagraphs = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({
          text: 'PEMERINTAH KOTA BEKASI',
          font: FONT_FAMILY,
          size: 24, // 12pt
          bold: true,
          color: '000000',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({
          text: 'DINAS PENDIDIKAN',
          font: FONT_FAMILY,
          size: 24,
          bold: true,
          color: '000000',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: (identitas.satuanPendidikan || 'SMP NEGERI 53 KOTA BEKASI').toUpperCase(),
          font: FONT_FAMILY,
          size: 28, // 14pt
          bold: true,
          color: '000000',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 120 },
      border: {
        bottom: { style: BorderStyle.DOUBLE, size: 24, color: '000000' },
      },
      children: [
        new TextRun({
          text: 'Jl. R.H. Umar 4 RT.06/RW.18 No. 97, Kelurahan Jakasetia, Kecamatan Bekasi Selatan, Kota Bekasi, Jawa Barat 17147',
          font: FONT_FAMILY,
          size: 18,
          italics: true,
          color: '333333',
        }),
      ],
    }),
  ];

  // JUDUL RPL
  const titleParagraphs = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 180, after: 40 },
      children: [
        new TextRun({
          text: 'RENCANA PELAKSANAAN LAYANAN (RPL) BIMBINGAN DAN KONSELING',
          font: FONT_FAMILY,
          size: 24,
          bold: true,
          underline: {},
          color: '000000',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 200 },
      children: [
        new TextRun({
          text: 'PENDEKATAN PEMBELAJARAN MENDALAM (DEEP LEARNING)',
          font: FONT_FAMILY,
          size: 20,
          bold: true,
          color: PRIMARY_COLOR,
        }),
      ],
    }),
  ];

  // TABEL IDENTITAS LAYANAN
  const identitasRows = [
    new TableRow({
      children: [
        createCell('BAGIAN 1 — IDENTITAS LAYANAN', { isHeader: true, colSpan: 4, bgColor: 'E2E8F0' }),
      ],
    }),
    new TableRow({
      children: [
        createCell('Satuan Pendidikan', { bold: true, widthPercent: 22 }),
        createCell(identitas.satuanPendidikan || 'SMPN 53 Kota Bekasi', { widthPercent: 28 }),
        createCell('Komponen Layanan', { bold: true, widthPercent: 22 }),
        createCell(identitas.komponenLayanan || 'Layanan Dasar', { widthPercent: 28 }),
      ],
    }),
    new TableRow({
      children: [
        createCell('Guru Bimbingan Konseling', { bold: true, widthPercent: 22 }),
        createCell(identitas.namaGuruBK || 'Hari Maktoharibi, S.Pd.', { widthPercent: 28 }),
        createCell('Bidang Layanan', { bold: true, widthPercent: 22 }),
        createCell(identitas.bidangLayanan || 'Sosial', { widthPercent: 28 }),
      ],
    }),
    new TableRow({
      children: [
        createCell('Tahun Pelajaran / Semester', { bold: true, widthPercent: 22 }),
        createCell(`${identitas.tahunPelajaran || '2026/2027'} / ${identitas.semester || 'Ganjil'}`, { widthPercent: 28 }),
        createCell('Jenis Layanan', { bold: true, widthPercent: 22 }),
        createCell(identitas.jenisLayanan || 'Bimbingan Klasikal', { widthPercent: 28 }),
      ],
    }),
    new TableRow({
      children: [
        createCell('Kelas / Fase', { bold: true, widthPercent: 22 }),
        createCell(`${identitas.kelasFase || 'Kelas VIII / Fase D'}`, { widthPercent: 28 }),
        createCell('Fungsi Layanan', { bold: true, widthPercent: 22 }),
        createCell(identitas.fungsiLayanan || 'Pemahaman & Pengembangan', { widthPercent: 28 }),
      ],
    }),
    new TableRow({
      children: [
        createCell('Alokasi Waktu', { bold: true, widthPercent: 22 }),
        createCell(identitas.alokasiWaktu || '1 JP (2 x 40 Menit)', { widthPercent: 28 }),
        createCell('Topik / Tema Layanan', { bold: true, widthPercent: 22 }),
        createCell(identitas.topikLayanan || 'Pengembangan Diri', { widthPercent: 28 }),
      ],
    }),
    new TableRow({
      children: [
        createCell('Jumlah Pertemuan / Sasaran', { bold: true, widthPercent: 22 }),
        createCell(`${identitas.jumlahPertemuan || '1 Pertemuan'} (${identitas.sasaranLayanan || 'Peserta Didik'})`, { widthPercent: 28 }),
        createCell('Tanggal Pelaksanaan', { bold: true, widthPercent: 22 }),
        createCell(identitas.tanggalPelaksanaan || 'Sesuai Jadwal', { widthPercent: 28 }),
      ],
    }),
  ];

  const identitasTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: identitasRows,
  });

  // BODY ELEMENTS
  const docElements: any[] = [
    ...kopParagraphs,
    ...titleParagraphs,
    identitasTable,

    // BAGIAN 2: IDENTIFIKASI KEBUTUHAN
    createSectionHeader('Bagian 2 — Identifikasi Kebutuhan & Kondisi Peserta Didik'),
    createParagraph(`• Karakteristik Perkembangan: ${identifikasi.karakteristikPerkembangan || '-'}`),
    createParagraph(`• Hasil Asesmen Kebutuhan: ${identifikasi.hasilAsesmenKebutuhan || '-'}`),
    createParagraph(`• Permasalahan Prioritas: ${identifikasi.permasalahanPrioritas || '-'}`),
    createParagraph(`• Kesiapan & Pengalaman Awal: ${identifikasi.kesiapanDanPengalamanAwal || '-'}`),
    createParagraph(`• Potensi & Kekuatan Peserta Didik: ${identifikasi.potensiDanKekuatan || '-'}`),
    createParagraph(`• Kebutuhan Dukungan / Akomodasi: ${identifikasi.kebutuhanDukunganAkomodasi || '-'}`),

    // BAGIAN 3: TUJUAN LAYANAN
    createSectionHeader('Bagian 3 — Tujuan Layanan (Terukur & Berkesinambungan)'),
    createSubHeader('A. Tujuan Umum:'),
    createParagraph(tujuan.tujuanUmum || '-'),
    createSubHeader('B. Tujuan Khusus:'),
    ...(tujuan.tujuanKhusus || []).map((t: string) => createBullet(t)),
    createSubHeader('C. Indikator Ketercapaian:'),
    ...(tujuan.indikatorKetercapaian || []).map((ind: string) => createBullet(ind)),
    createSubHeader('D. Kompetensi & Keterampilan:'),
    ...(tujuan.kompetensiKeterampilan || []).map((k: string) => createBullet(k)),

    // BAGIAN 4: DESAIN PEMBELAJARAN MENDALAM
    createSectionHeader('Bagian 4 — Desain Pembelajaran Mendalam (Deep Learning)'),
    createParagraph(`1. Dimensi Profil Lulusan: ${(desain.dimensiProfilLulusan || []).join(', ') || '-'}`),
    createParagraph(`2. Pendekatan & Model: ${desain.praktikPedagogis?.pendekatan || 'Deep Learning'} — Strategi: ${desain.praktikPedagogis?.strategiModel || '-'}`),
    createParagraph(`3. Metode: ${desain.praktikPedagogis?.metode || '-'} — Teknik Fasilitasi: ${desain.praktikPedagogis?.teknikFasilitasi || '-'}`),
    createSubHeader('4. Penerapan 3 Pilar Deep Learning:'),
    createParagraph(`• Berkesadaran (Mindful): ${desain.prinsipDeepLearning?.berkesadaran || '-'}`),
    createParagraph(`• Bermakna (Meaningful): ${desain.prinsipDeepLearning?.bermakna || '-'}`),
    createParagraph(`• Menggembirakan (Joyful): ${desain.prinsipDeepLearning?.menggembirakan || '-'}`),
    createParagraph(`5. Lingkungan Pembelajaran: Keamanan psikologis: ${desain.lingkunganPembelajaran?.keamananPsikologis || '-'}`),
    createParagraph(`6. Pemanfaatan Media Digital: ${desain.pemanfaatanDigital || '-'}`),

    // BAGIAN 5: PENGALAMAN BELAJAR
    createSectionHeader('Bagian 5 — Pengalaman Belajar (Memahami, Mengaplikasi, Merefleksi)'),
    createParagraph(`1. MEMAHAMI (Konseptual & Kognitif): ${pengalaman.memahami || '-'}`),
    createParagraph(`2. MENGAPLIKASI (Kontekstual & Praktik Nyata): ${pengalaman.mengaplikasi || '-'}`),
    createParagraph(`3. MEREFLEKSI (Internalisasi & Metakognisi Diri): ${pengalaman.merefleksi || '-'}`),

    // BAGIAN 6: LANGKAH-LANGKAH PELAKSANAAN
    createSectionHeader(`Bagian 6 — Langkah-Langkah Pelaksanaan Layanan (${langkah.alokasiWaktuTotal || identitas.alokasiWaktu || '80 Menit'})`),
  ];

  // TABEL LANGKAH PELAKSANAAN
  const stepRows: TableRow[] = [
    new TableRow({
      children: [
        createCell('Tahapan', { isHeader: true, widthPercent: 18, align: AlignmentType.CENTER }),
        createCell('Kegiatan / Alokasi Waktu', { isHeader: true, widthPercent: 22 }),
        createCell('Aktivitas Guru BK', { isHeader: true, widthPercent: 30 }),
        createCell('Aktivitas Peserta Didik', { isHeader: true, widthPercent: 30 }),
      ],
    }),
  ];

  const addPhaseToTable = (phaseName: string, steps: any[], bgColor?: string) => {
    if (!steps || steps.length === 0) return;
    steps.forEach((step, idx) => {
      stepRows.push(
        new TableRow({
          children: [
            createCell(idx === 0 ? phaseName : '', { bold: true, widthPercent: 18, bgColor }),
            createCell(`${step.namaKegiatan || 'Aktivitas'} (${step.alokasiWaktuMenit || 10} Menit)`, {
              bold: true,
              widthPercent: 22,
            }),
            createCell(step.aktivitasGuruBK || '-', { widthPercent: 30 }),
            createCell(step.aktivitasPesertaDidik || '-', { widthPercent: 30 }),
          ],
        })
      );
    });
  };

  addPhaseToTable('1. TAHAP AWAL (Pendahuluan)', langkah.tahapAwal || [], 'F1F5F9');
  addPhaseToTable('2. TAHAP TRANSISI (Peralihan)', langkah.tahapTransisi || [], 'F8FAFC');
  addPhaseToTable('3. TAHAP INTI (Pelaksanaan)', langkah.tahapInti || [], 'EFF6FF');
  addPhaseToTable('4. TAHAP PENUTUP (Evaluasi & Refleksi)', langkah.tahapPenutup || [], 'F1F5F9');

  const stepsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: stepRows,
  });

  docElements.push(stepsTable);

  // BAGIAN 7: MATERI LAYANAN
  if (materi && (materi.pokokBahasan || materi.uraianMateri)) {
    docElements.push(
      createSectionHeader('Bagian 7 — Materi Layanan BK'),
      createParagraph(`Pokok Bahasan: ${materi.pokokBahasan || '-'}`),
      createParagraph(materi.uraianMateri || '-'),
      createParagraph(`Contoh Konkret / Relevansi: ${materi.contohKonkret || '-'}`),
      createParagraph(`Studi Kasus / Skenario: ${materi.studiKasusSkenario || '-'}`)
    );
  }

  // BAGIAN 8: ASESMEN
  if (asesmen && (asesmen.asesmenAwal || asesmen.asesmenProses || asesmen.asesmenHasil)) {
    docElements.push(
      createSectionHeader('Bagian 8 — Asesmen Layanan BK (Awal, Proses, Hasil)'),
      createSubHeader('A. Asesmen Awal:'),
      createParagraph(`Tujuan: ${asesmen.asesmenAwal?.tujuan || 'Mengukur pemahaman awal'}`),
      createParagraph(`Petunjuk: ${asesmen.asesmenAwal?.petunjukPengisian || '-'}`),
      ...(asesmen.asesmenAwal?.butirInstrumen || []).map((b: string) => createBullet(b)),
      createSubHeader('B. Asesmen Proses:'),
      createParagraph(`Tujuan: ${asesmen.asesmenProses?.tujuan || 'Observasi keaktifan proses'}`),
      createParagraph(`Kriteria: ${asesmen.asesmenProses?.kriteriaKetercapaian || '-'}`),
      ...(asesmen.asesmenProses?.butirInstrumen || []).map((b: string) => createBullet(b)),
      createSubHeader('C. Asesmen Hasil:'),
      createParagraph(`Tujuan: ${asesmen.asesmenHasil?.tujuan || 'Evaluasi pemahaman, kenyamanan, & komitmen'}`),
      createParagraph(`Cara Membaca Hasil: ${asesmen.asesmenHasil?.caraMembacaHasil || '-'}`),
      ...(asesmen.asesmenHasil?.butirInstrumen || []).map((b: string) => createBullet(b))
    );
  }

  // BAGIAN 9: LKPD
  if (lkpd) {
    docElements.push(
      createSectionHeader('Bagian 9 — Lembar Kerja Peserta Didik (LKPD)'),
      createParagraph(`Judul: ${lkpd.judulAktivitas || '-'}`),
      createParagraph(`Tujuan Aktivitas: ${lkpd.tujuanAktivitas || '-'}`),
      createParagraph(`Petunjuk: ${lkpd.petunjukPengerjaan || '-'}`),
      createParagraph(`Skenario Masalah: ${lkpd.skenarioPermasalahan || '-'}`),
      createSubHeader('Pertanyaan Panduan & Lembar Tugas:'),
      ...(lkpd.pertanyaanPanduan || []).map((q: string, i: number) =>
        createParagraph(`${i + 1}. ${q}`)
      ),
      createParagraph(`Kesimpulan & Komitmen Diri: ${lkpd.kesimpulanDanKomitmen || '-'}`)
    );
  }

  // BAGIAN 10: RUBRIK EVALUASI
  if (rubrik) {
    docElements.push(
      createSectionHeader('Bagian 10 — Rubrik Evaluasi'),
      createParagraph(`Judul: ${rubrik.judulRubrik || 'Rubrik Penilaian Proses dan Hasil'}`),
      createParagraph(`Petunjuk: ${rubrik.petunjukPenilaian || '-'}`)
    );
    if (rubrik.tabelRubrik && rubrik.tabelRubrik.length > 0) {
      const rubrikRows: TableRow[] = [
        new TableRow({
          children: [
            createCell('Aspek yang Dinilai', { isHeader: true, widthPercent: 28 }),
            createCell('Sangat Baik (4)', { isHeader: true, widthPercent: 18 }),
            createCell('Baik (3)', { isHeader: true, widthPercent: 18 }),
            createCell('Cukup (2)', { isHeader: true, widthPercent: 18 }),
            createCell('Perlu Bimbingan (1)', { isHeader: true, widthPercent: 18 }),
          ],
        }),
      ];
      rubrik.tabelRubrik.forEach((item: RubrikRow) => {
        rubrikRows.push(
          new TableRow({
            children: [
              createCell(item.aspek || '-', { bold: true }),
              createCell(item.skor4 || '-'),
              createCell(item.skor3 || '-'),
              createCell(item.skor2 || '-'),
              createCell(item.skor1 || '-'),
            ],
          })
        );
      });
      docElements.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: rubrikRows,
        })
      );
    }
  }

  // BAGIAN 11: REFLEKSI PESERTA DIDIK
  if (refleksiSiswa) {
    docElements.push(
      createSectionHeader('Bagian 11 — Lembar Refleksi Peserta Didik'),
      createParagraph(refleksiSiswa.pengantar || '-'),
      ...(refleksiSiswa.pertanyaanRefleksi || []).map((q: string, i: number) =>
        createParagraph(`${i + 1}. ${q}`)
      )
    );
  }

  // BAGIAN 12: REFLEKSI GURU BK
  if (refleksiGuru) {
    docElements.push(
      createSectionHeader('Bagian 12 — Refleksi Guru Bimbingan dan Konseling'),
      createParagraph(`• Ketercapaian Tujuan: ${refleksiGuru.ketercapaianTujuan || '-'}`),
      createParagraph(`• Keterlibatan Siswa: ${refleksiGuru.keterlibatanPartisipasi || '-'}`),
      createParagraph(`• Efektivitas Metode & Media: ${refleksiGuru.efektivitasMetodeMedia || '-'}`),
      createParagraph(`• Ketepatan Waktu: ${refleksiGuru.ketepatanAlokasiWaktu || '-'}`),
      createParagraph(`• Kendala yang Dihadapi: ${refleksiGuru.kendalaYangDihadapi || '-'}`),
      createParagraph(`• Rencana Perbaikan: ${refleksiGuru.rencanaTindakLanjutPerbaikan || '-'}`)
    );
  }

  // BAGIAN 13: TINDAK LANJUT
  if (tindakLanjut) {
    docElements.push(
      createSectionHeader('Bagian 13 — Rencana Tindak Lanjut'),
      createParagraph(`• Penguatan Klasikal: ${tindakLanjut.penguatanKlasikal || '-'}`),
      createParagraph(`• Bimbingan Kelompok Lanjutan: ${tindakLanjut.bimbinganKelompokLanjutan || '-'}`),
      createParagraph(`• Konseling Individual / Kelompok: ${tindakLanjut.konselingIndividualKelompok || '-'}`),
      createParagraph(`• Kolaborasi Wali Kelas / Orang Tua: ${tindakLanjut.kolaborasiWaliKelasOrangTua || '-'}`),
      createParagraph(`• Rujukan Profesional (Bila Perlu): ${tindakLanjut.rujukanProfesional || '-'}`),
      createParagraph(`• Pemantauan Perkembangan: ${tindakLanjut.pemantauanPerkembangan || '-'}`)
    );
  }

  // BAGIAN 14: SUMBER & LAMPIRAN
  if (sumberLampiran) {
    docElements.push(
      createSectionHeader('Bagian 14 — Sumber dan Lampiran Dokumen'),
      createParagraph(`• Sumber Materi: ${(sumberLampiran.sumberMateri || []).join('; ') || '-'}`),
      createParagraph(`• Media Pembelajaran: ${(sumberLampiran.mediaPembelajaran || []).join('; ') || '-'}`),
      createParagraph(`• Daftar Lampiran: ${(sumberLampiran.daftarLampiran || []).join(', ') || '-'}`)
    );
  }

  // BAGIAN 15: PENGESAHAN (Tanda Tangan)
  const kotaTanggal = pengesahan.tempatDanTanggal || `Kota Bekasi, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  
  const signTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          createCell('', { widthPercent: 50, noBorder: true }),
          createCell(kotaTanggal, { widthPercent: 50, noBorder: true, align: AlignmentType.CENTER }),
        ],
      }),
      new TableRow({
        children: [
          createCell(`Mengetahui,\n${pengesahan.jabatanKepalaSekolah || 'Kepala Sekolah'},`, {
            widthPercent: 50,
            align: AlignmentType.CENTER,
            noBorder: true,
          }),
          createCell(`${pengesahan.jabatanGuruBK || 'Guru Bimbingan dan Konseling'},`, {
            widthPercent: 50,
            align: AlignmentType.CENTER,
            noBorder: true,
          }),
        ],
      }),
      new TableRow({
        children: [
          createCell('\n\n\n\n', { widthPercent: 50, noBorder: true }),
          createCell('\n\n\n\n', { widthPercent: 50, noBorder: true }),
        ],
      }),
      new TableRow({
        children: [
          createCell(
            [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: pengesahan.namaKepalaSekolah || 'Arief Purnama, S.Pd.',
                    font: FONT_FAMILY,
                    size: 22,
                    bold: true,
                    underline: {},
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `NIP. ${pengesahan.nipKepalaSekolah || '19730311 201412 1 001'}`,
                    font: FONT_FAMILY,
                    size: 20,
                  }),
                ],
              }),
            ],
            { widthPercent: 50, noBorder: true }
          ),
          createCell(
            [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: pengesahan.namaGuruBK || 'Hari Maktoharibi, S.Pd.',
                    font: FONT_FAMILY,
                    size: 22,
                    bold: true,
                    underline: {},
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `NIP. ${pengesahan.nipGuruBK || '19811005 202321 1 007'}`,
                    font: FONT_FAMILY,
                    size: 20,
                  }),
                ],
              }),
            ],
            { widthPercent: 50, noBorder: true }
          ),
        ],
      }),
    ],
  });

  docElements.push(
    new Paragraph({ spacing: { before: 200 } }),
    signTable
  );

  // CREATE DOCUMENT
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1000,
              right: 1000,
            },
          },
        },
        children: docElements,
      },
    ],
  });

  // PACK TO BLOB & DOWNLOAD
  const blob = await Packer.toBlob(doc);
  const cleanTitle = (identitas.topikLayanan || 'RPL_BK').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `RPL_${cleanTitle}_SMPN53_Bekasi.docx`;

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
