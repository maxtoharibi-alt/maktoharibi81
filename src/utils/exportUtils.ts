import { RplDocument } from '../types/rpl';

/**
 * Generate MS Word compatible HTML document
 */
export function exportRplToWord(rpl: RplDocument) {
  const filename = `${(rpl.identitas?.topikLayanan || 'RPL_BK').replace(/[^a-zA-Z0-9_-]/g, '_')}_SMPN53_Bekasi.doc`;

  // Render HTML document structured for Microsoft Word
  const htmlContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${rpl.identitas?.topikLayanan || 'RPL BK'}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 595.3pt 841.9pt; /* A4 */
      margin: 42.5pt 42.5pt 42.5pt 42.5pt; /* ~1.5cm */
      mso-header-margin: 35.4pt;
      mso-footer-margin: 35.4pt;
      mso-paper-source: 0;
    }
    div.Section1 { page: Section1; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.35;
      color: #000;
    }
    .kop-surat {
      text-align: center;
      border-bottom: 3px double #000;
      padding-bottom: 6px;
      margin-bottom: 16px;
    }
    .kop-instansi { font-size: 13pt; font-weight: bold; text-transform: uppercase; margin: 0; }
    .kop-sekolah { font-size: 15pt; font-weight: bold; text-transform: uppercase; margin: 2px 0; }
    .kop-alamat { font-size: 9pt; font-style: italic; margin: 0; }
    .doc-title {
      text-align: center;
      font-size: 13pt;
      font-weight: bold;
      text-decoration: underline;
      margin: 12px 0 2px 0;
    }
    .doc-subtitle {
      text-align: center;
      font-size: 10.5pt;
      font-weight: bold;
      margin-bottom: 16px;
    }
    h2.section-header {
      font-size: 11pt;
      font-weight: bold;
      background-color: #f0f4f8;
      border-left: 4px solid #1e3a8a;
      padding: 4px 8px;
      margin-top: 14px;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    h3.sub-header {
      font-size: 10.5pt;
      font-weight: bold;
      margin-top: 8px;
      margin-bottom: 4px;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 10pt;
    }
    table.data-table th, table.data-table td {
      border: 1px solid #333;
      padding: 5px 7px;
      vertical-align: top;
    }
    table.data-table th {
      background-color: #f2f2f2;
      font-weight: bold;
      text-align: center;
    }
    table.info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      font-size: 10.5pt;
    }
    table.info-table td {
      padding: 3px 4px;
      vertical-align: top;
    }
    .signature-table {
      width: 100%;
      margin-top: 24px;
      border-collapse: collapse;
      font-size: 10.5pt;
    }
    .signature-table td {
      vertical-align: top;
      text-align: center;
      padding: 4px;
    }
    ul, ol {
      margin-top: 4px;
      margin-bottom: 6px;
      padding-left: 20px;
    }
    li {
      margin-bottom: 3px;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      background: #e2e8f0;
      border-radius: 3px;
      font-size: 9pt;
      margin-right: 4px;
    }
  </style>
</head>
<body>
<div class="Section1">
  <div class="kop-surat">
    <p class="kop-instansi">PEMERINTAH KOTA BEKASI &bull; DINAS PENDIDIKAN</p>
    <p class="kop-sekolah">${rpl.identitas?.satuanPendidikan || 'SMP NEGERI 53 KOTA BEKASI'}</p>
    <p class="kop-alamat">Jl. R.H. Umar 4 RT.06/RW.18 No. 97, Kelurahan Jakasetia, Kecamatan Bekasi Selatan, Kota Bekasi, Jawa Barat 17147</p>
  </div>

  <p class="doc-title">RENCANA PELAKSANAAN LAYANAN (RPL) BIMBINGAN DAN KONSELING</p>
  <p class="doc-subtitle">BERBASIS PENDEKATAN PEMBELAJARAN MENDALAM (DEEP LEARNING)</p>

  <!-- BAGIAN 1: IDENTITAS RPL -->
  <h2 class="section-header">BAGIAN 1 — IDENTITAS LAYANAN</h2>
  <table class="info-table">
    <tr>
      <td width="28%"><strong>Satuan Pendidikan</strong></td>
      <td width="2%">:</td>
      <td width="70%">${rpl.identitas?.satuanPendidikan || '-'}</td>
    </tr>
    <tr>
      <td><strong>Guru Bimbingan dan Konseling</strong></td>
      <td>:</td>
      <td>${rpl.identitas?.namaGuruBK || '-'} ${rpl.identitas?.nipGuruBK ? `(NIP. ${rpl.identitas.nipGuruBK})` : ''}</td>
    </tr>
    <tr>
      <td><strong>Tahun Pelajaran / Semester</strong></td>
      <td>:</td>
      <td>${rpl.identitas?.tahunPelajaran || '-'} / ${rpl.identitas?.semester || '-'}</td>
    </tr>
    <tr>
      <td><strong>Kelas / Fase</strong></td>
      <td>:</td>
      <td>Kelas ${rpl.identitas?.kelasFase || '-'}</td>
    </tr>
    <tr>
      <td><strong>Komponen Layanan</strong></td>
      <td>:</td>
      <td>${rpl.identitas?.komponenLayanan || '-'}</td>
    </tr>
    <tr>
      <td><strong>Bidang Layanan</strong></td>
      <td>:</td>
      <td>${rpl.identitas?.bidangLayanan || '-'}</td>
    </tr>
    <tr>
      <td><strong>Jenis & Fungsi Layanan</strong></td>
      <td>:</td>
      <td>${rpl.identitas?.jenisLayanan || '-'} (${rpl.identitas?.fungsiLayanan || '-'})</td>
    </tr>
    <tr>
      <td><strong>Topik / Tema Layanan</strong></td>
      <td>:</td>
      <td><strong>${rpl.identitas?.topikLayanan || '-'}</strong></td>
    </tr>
    <tr>
      <td><strong>Alokasi Waktu / Pertemuan</strong></td>
      <td>:</td>
      <td>${rpl.identitas?.alokasiWaktu || '-'} (${rpl.identitas?.jumlahPertemuan || '1 Pertemuan'})</td>
    </tr>
    <tr>
      <td><strong>Sasaran / Tanggal Pelaksanaan</strong></td>
      <td>:</td>
      <td>${rpl.identitas?.sasaranLayanan || '-'} / ${rpl.identitas?.tanggalPelaksanaan || '-'}</td>
    </tr>
  </table>

  <!-- BAGIAN 2: IDENTIFIKASI KEBUTUHAN -->
  <h2 class="section-header">BAGIAN 2 — IDENTIFIKASI KEBUTUHAN PESERTA DIDIK</h2>
  <table class="data-table">
    <tr>
      <th width="30%">Aspek Analisis Kebutuhan</th>
      <th width="70%">Deskripsi Kontekstual</th>
    </tr>
    <tr>
      <td><strong>Dasar Kebutuhan Layanan</strong></td>
      <td>${rpl.identifikasiKebutuhan?.dasarKebutuhan || '-'}</td>
    </tr>
    <tr>
      <td><strong>Hasil Asesmen Kebutuhan</strong></td>
      <td>${rpl.identifikasiKebutuhan?.hasilAsesmenKebutuhan || '-'}</td>
    </tr>
    <tr>
      <td><strong>Karakteristik Perkembangan</strong></td>
      <td>${rpl.identifikasiKebutuhan?.karakteristikPerkembangan || '-'}</td>
    </tr>
    <tr>
      <td><strong>Kesiapan & Pengalaman Awal</strong></td>
      <td>${rpl.identifikasiKebutuhan?.kesiapanDanPengalamanAwal || '-'}</td>
    </tr>
    <tr>
      <td><strong>Permasalahan / Kebutuhan Prioritas</strong></td>
      <td>${rpl.identifikasiKebutuhan?.permasalahanPrioritas || '-'}</td>
    </tr>
    <tr>
      <td><strong>Potensi & Kekuatan Siswa</strong></td>
      <td>${rpl.identifikasiKebutuhan?.potensiDanKekuatan || '-'}</td>
    </tr>
    <tr>
      <td><strong>Kebutuhan Dukungan / Akomodasi</strong></td>
      <td>${rpl.identifikasiKebutuhan?.kebutuhanDukunganAkomodasi || '-'}</td>
    </tr>
  </table>

  <!-- BAGIAN 3: TUJUAN LAYANAN -->
  <h2 class="section-header">BAGIAN 3 — TUJUAN LAYANAN</h2>
  <p><strong>A. Tujuan Umum:</strong><br>${rpl.tujuanLayanan?.tujuanUmum || '-'}</p>
  <p><strong>B. Tujuan Khusus (Kata Kerja Operasional / KKO):</strong></p>
  <ol>
    ${(rpl.tujuanLayanan?.tujuanKhusus || []).map(item => `<li>${item}</li>`).join('')}
  </ol>
  <p><strong>C. Indikator Ketercapaian:</strong></p>
  <ul>
    ${(rpl.tujuanLayanan?.indikatorKetercapaian || []).map(item => `<li>${item}</li>`).join('')}
  </ul>
  <p><strong>D. Kompetensi / Keterampilan yang Dikembangkan:</strong></p>
  <ul>
    ${(rpl.tujuanLayanan?.kompetensiKeterampilan || []).map(item => `<li>${item}</li>`).join('')}
  </ul>

  <!-- BAGIAN 4: DESAIN PEMBELAJARAN MENDALAM -->
  <h2 class="section-header">BAGIAN 4 — DESAIN PEMBELAJARAN MENDALAM (DEEP LEARNING)</h2>
  <table class="data-table">
    <tr>
      <th width="30%">Dimensi Desain</th>
      <th width="70%">Penerapan Nyata dalam Layanan BK</th>
    </tr>
    <tr>
      <td><strong>A. Praktik Pedagogis</strong></td>
      <td>
        <strong>Pendekatan:</strong> ${rpl.desainPembelajaranMendalam?.praktikPedagogis?.pendekatan || '-'}<br>
        <strong>Strategi / Model:</strong> ${rpl.desainPembelajaranMendalam?.praktikPedagogis?.strategiModel || '-'}<br>
        <strong>Metode:</strong> ${rpl.desainPembelajaranMendalam?.praktikPedagogis?.metode || '-'}<br>
        <strong>Teknik Fasilitasi:</strong> ${rpl.desainPembelajaranMendalam?.praktikPedagogis?.teknikFasilitasi || '-'}
      </td>
    </tr>
    <tr>
      <td><strong>B. Kemitraan Pembelajaran</strong></td>
      <td>
        <strong>Peran Guru BK:</strong> ${rpl.desainPembelajaranMendalam?.kemitraanPembelajaran?.peranGuruBK || '-'}<br>
        <strong>Peran Peserta Didik:</strong> ${rpl.desainPembelajaranMendalam?.kemitraanPembelajaran?.peranPesertaDidik || '-'}<br>
        <strong>Mitra Lain (Wali Kelas/Ortu):</strong> ${rpl.desainPembelajaranMendalam?.kemitraanPembelajaran?.peranMitraLain || '-'}
      </td>
    </tr>
    <tr>
      <td><strong>C. Lingkungan Pembelajaran</strong></td>
      <td>
        <strong>Keamanan Psikologis:</strong> ${rpl.desainPembelajaranMendalam?.lingkunganPembelajaran?.keamananPsikologis || '-'}<br>
        <strong>Kenyamanan & Inklusivitas:</strong> ${rpl.desainPembelajaranMendalam?.lingkunganPembelajaran?.kenyamananDanInklusivitas || '-'}<br>
        <strong>Kerahasiaan & Etika:</strong> ${rpl.desainPembelajaranMendalam?.lingkunganPembelajaran?.kerahasiaanDanEtika || '-'}
      </td>
    </tr>
    <tr>
      <td><strong>D. Pemanfaatan Digital</strong></td>
      <td>${rpl.desainPembelajaranMendalam?.pemanfaatanDigital || '-'}</td>
    </tr>
    <tr>
      <td><strong>E. Dimensi Profil Lulusan</strong></td>
      <td>
        ${(rpl.desainPembelajaranMendalam?.dimensiProfilLulusan || []).map(dim => `<span class="badge">&bull; ${dim}</span>`).join(' ')}
      </td>
    </tr>
    <tr>
      <td><strong>F. 3 Prinsip Deep Learning</strong></td>
      <td>
        <strong>1. Berkesadaran (Mindful):</strong> ${rpl.desainPembelajaranMendalam?.prinsipDeepLearning?.berkesadaran || '-'}<br><br>
        <strong>2. Bermakna (Meaningful):</strong> ${rpl.desainPembelajaranMendalam?.prinsipDeepLearning?.bermakna || '-'}<br><br>
        <strong>3. Menggembirakan (Joyful):</strong> ${rpl.desainPembelajaranMendalam?.prinsipDeepLearning?.menggembirakan || '-'}
      </td>
    </tr>
  </table>

  <!-- BAGIAN 5: PENGALAMAN BELAJAR -->
  <h2 class="section-header">BAGIAN 5 — PENGALAMAN BELAJAR (DEEP LEARNING EXPERIENCES)</h2>
  <table class="data-table">
    <tr>
      <th width="25%">Tahapan Pengalaman</th>
      <th width="75%">Aktivitas Inti Peserta Didik</th>
    </tr>
    <tr>
      <td><strong>1. MEMAHAMI</strong><br><em>(Membangun kesadaran konsep & fenomena)</em></td>
      <td>${rpl.pengalamanBelajar?.memahami || '-'}</td>
    </tr>
    <tr>
      <td><strong>2. MENGAPLIKASI</strong><br><em>(Praktik keterampilan nyata & simulasi)</em></td>
      <td>${rpl.pengalamanBelajar?.mengaplikasi || '-'}</td>
    </tr>
    <tr>
      <td><strong>3. MEREFLEKSI</strong><br><em>(Evaluasi diri & komitmen perubahan)</em></td>
      <td>${rpl.pengalamanBelajar?.merefleksi || '-'}</td>
    </tr>
  </table>

  <!-- BAGIAN 6: LANGKAH-LANGKAH PELAKSANAAN -->
  <h2 class="section-header">BAGIAN 6 — LANGKAH-LANGKAH PELAKSANAAN LAYANAN</h2>
  <p><strong>Total Alokasi Waktu:</strong> ${rpl.langkahPelaksanaan?.alokasiWaktuTotal || '-'}</p>

  <h3 class="sub-header">A. Tahap Awal (Pembukaan & Apersepsi)</h3>
  <table class="data-table">
    <tr>
      <th width="20%">Kegiatan & Waktu</th>
      <th width="30%">Aktivitas Guru BK</th>
      <th width="30%">Aktivitas Peserta Didik</th>
      <th width="20%">Prinsip & Media</th>
    </tr>
    ${(rpl.langkahPelaksanaan?.tahapAwal || []).map(step => `
      <tr>
        <td><strong>${step.namaKegiatan}</strong><br>(${step.alokasiWaktuMenit} Menit)</td>
        <td>${step.aktivitasGuruBK}</td>
        <td>${step.aktivitasPesertaDidik}</td>
        <td><em>${step.prinsipPembelajaranMendalam}</em><br><small>${step.mediaInstrumen || '-'}</small></td>
      </tr>
    `).join('')}
  </table>

  <h3 class="sub-header">B. Tahap Transisi (Peralihan & Kesiapan)</h3>
  <table class="data-table">
    <tr>
      <th width="20%">Kegiatan & Waktu</th>
      <th width="30%">Aktivitas Guru BK</th>
      <th width="30%">Aktivitas Peserta Didik</th>
      <th width="20%">Prinsip & Media</th>
    </tr>
    ${(rpl.langkahPelaksanaan?.tahapTransisi || []).map(step => `
      <tr>
        <td><strong>${step.namaKegiatan}</strong><br>(${step.alokasiWaktuMenit} Menit)</td>
        <td>${step.aktivitasGuruBK}</td>
        <td>${step.aktivitasPesertaDidik}</td>
        <td><em>${step.prinsipPembelajaranMendalam}</em><br><small>${step.mediaInstrumen || '-'}</small></td>
      </tr>
    `).join('')}
  </table>

  <h3 class="sub-header">C. Tahap Inti (Pengalaman Belajar: Memahami, Mengaplikasi, Merefleksi)</h3>
  <table class="data-table">
    <tr>
      <th width="20%">Kegiatan & Waktu</th>
      <th width="30%">Aktivitas Guru BK</th>
      <th width="30%">Aktivitas Peserta Didik</th>
      <th width="20%">Prinsip & Bukti</th>
    </tr>
    ${(rpl.langkahPelaksanaan?.tahapInti || []).map(step => `
      <tr>
        <td><strong>${step.namaKegiatan}</strong><br>(${step.alokasiWaktuMenit} Menit)</td>
        <td>${step.aktivitasGuruBK}</td>
        <td>${step.aktivitasPesertaDidik}</td>
        <td><em>${step.prinsipPembelajaranMendalam}</em><br><small>Bukti: ${step.buktiKetercapaian || '-'}</small></td>
      </tr>
    `).join('')}
  </table>

  <h3 class="sub-header">D. Tahap Penutup (Refleksi & Komitmen)</h3>
  <table class="data-table">
    <tr>
      <th width="20%">Kegiatan & Waktu</th>
      <th width="30%">Aktivitas Guru BK</th>
      <th width="30%">Aktivitas Peserta Didik</th>
      <th width="20%">Prinsip & Media</th>
    </tr>
    ${(rpl.langkahPelaksanaan?.tahapPenutup || []).map(step => `
      <tr>
        <td><strong>${step.namaKegiatan}</strong><br>(${step.alokasiWaktuMenit} Menit)</td>
        <td>${step.aktivitasGuruBK}</td>
        <td>${step.aktivitasPesertaDidik}</td>
        <td><em>${step.prinsipPembelajaranMendalam}</em><br><small>${step.mediaInstrumen || '-'}</small></td>
      </tr>
    `).join('')}
  </table>

  <!-- BAGIAN 7: MATERI LAYANAN -->
  ${rpl.materiLayanan ? `
  <h2 class="section-header">BAGIAN 7 — MATERI LAYANAN BIMBINGAN DAN KONSELING</h2>
  <p><strong>Pokok Bahasan:</strong> ${rpl.materiLayanan.pokokBahasan}</p>
  <p><strong>Uraian Materi:</strong><br>${rpl.materiLayanan.uraianMateri}</p>
  <p><strong>Contoh Konkret / Realita Siswa SMP:</strong><br>${rpl.materiLayanan.contohKonkret}</p>
  ${rpl.materiLayanan.studiKasusSkenario ? `<p><strong>Skenario Studi Kasus:</strong><br>${rpl.materiLayanan.studiKasusSkenario}</p>` : ''}
  <p><strong>Rangkuman / Mutiara Refleksi:</strong><br><em>${rpl.materiLayanan.rangkuman}</em></p>
  ` : ''}

  <!-- BAGIAN 8: ASESMEN -->
  ${rpl.asesmen ? `
  <h2 class="section-header">BAGIAN 8 — ASESMEN (AWAL, PROSES, DAN HASIL)</h2>
  
  <h3 class="sub-header">1. Asesmen Awal (Diagnostic / Pemantik)</h3>
  <p><strong>Tujuan:</strong> ${rpl.asesmen.asesmenAwal?.tujuan || '-'}</p>
  <p><strong>Petunjuk:</strong> ${rpl.asesmen.asesmenAwal?.petunjukPengisian || '-'}</p>
  <p><strong>Butir Pertanyaan:</strong></p>
  <ol>
    ${(rpl.asesmen.asesmenAwal?.butirInstrumen || []).map(item => `<li>${item}</li>`).join('')}
  </ol>
  <p><strong>Kriteria Ketercapaian:</strong> ${rpl.asesmen.asesmenAwal?.kriteriaKetercapaian || '-'}</p>

  <h3 class="sub-header">2. Asesmen Proses (Observasi Selama Layanan)</h3>
  <p><strong>Tujuan:</strong> ${rpl.asesmen.asesmenProses?.tujuan || '-'}</p>
  <p><strong>Petunjuk:</strong> ${rpl.asesmen.asesmenProses?.petunjukPengisian || '-'}</p>
  <p><strong>Indikator Pengamatan:</strong></p>
  <ol>
    ${(rpl.asesmen.asesmenProses?.butirInstrumen || []).map(item => `<li>${item}</li>`).join('')}
  </ol>
  <p><strong>Kriteria Ketercapaian:</strong> ${rpl.asesmen.asesmenProses?.kriteriaKetercapaian || '-'}</p>

  <h3 class="sub-header">3. Asesmen Hasil (Evaluasi Pemahaman & Dampak)</h3>
  <p><strong>Tujuan:</strong> ${rpl.asesmen.asesmenHasil?.tujuan || '-'}</p>
  <p><strong>Petunjuk:</strong> ${rpl.asesmen.asesmenHasil?.petunjukPengisian || '-'}</p>
  <p><strong>Butir Evaluasi:</strong></p>
  <ol>
    ${(rpl.asesmen.asesmenHasil?.butirInstrumen || []).map(item => `<li>${item}</li>`).join('')}
  </ol>
  <p><strong>Cara Membaca & Kriteria Hasil:</strong> ${rpl.asesmen.asesmenHasil?.caraMembacaHasil || '-'} (${rpl.asesmen.asesmenHasil?.kriteriaKetercapaian || '-'})</p>
  ` : ''}

  <!-- BAGIAN 9: LKPD -->
  ${rpl.lkpd ? `
  <h2 class="section-header">BAGIAN 9 — LEMBAR KERJA PESERTA DIDIK (LKPD)</h2>
  <p><strong>Judul Aktivitas:</strong> ${rpl.lkpd.judulAktivitas}</p>
  <p><strong>Tujuan:</strong> ${rpl.lkpd.tujuanAktivitas}</p>
  <p><strong>Petunjuk Pengerjaan:</strong> ${rpl.lkpd.petunjukPengerjaan}</p>
  ${rpl.lkpd.skenarioPermasalahan ? `<p><strong>Skenario Masalah:</strong> ${rpl.lkpd.skenarioPermasalahan}</p>` : ''}
  <p><strong>Langkah Pengerjaan:</strong></p>
  <ol>
    ${(rpl.lkpd.langkahKegiatan || []).map(l => `<li>${l}</li>`).join('')}
  </ol>
  <p><strong>Pertanyaan Panduan Diskusi / Refleksi:</strong></p>
  <ol>
    ${(rpl.lkpd.pertanyaanPanduan || []).map(p => `<li>${p}</li>`).join('')}
  </ol>
  <p><strong>Ruang Jawaban & Instruksi Pengumpulan:</strong><br>${rpl.lkpd.ruangJawabanInstruksi || '-'}</p>
  <p><strong>Komitmen & Aksi Nyata Peserta Didik:</strong><br>${rpl.lkpd.kesimpulanDanKomitmen || '-'}</p>
  ` : ''}

  <!-- BAGIAN 10: RUBRIK EVALUASI -->
  ${rpl.rubrikEvaluasi ? `
  <h2 class="section-header">BAGIAN 10 — RUBRIK EVALUASI ANALITIK (4 TINGKAT)</h2>
  <p><strong>${rpl.rubrikEvaluasi.judulRubrik}</strong></p>
  <p><em>Petunjuk: ${rpl.rubrikEvaluasi.petunjukPenilaian}</em></p>
  <table class="data-table">
    <tr>
      <th width="20%">Aspek yang Diamati</th>
      <th width="20%">Sangat Berkembang (4)</th>
      <th width="20%">Berkembang Sesuai Harapan (3)</th>
      <th width="20%">Mulai Berkembang (2)</th>
      <th width="20%">Memerlukan Bimbingan (1)</th>
    </tr>
    ${(rpl.rubrikEvaluasi.tabelRubrik || []).map(row => `
      <tr>
        <td><strong>${row.aspek}</strong></td>
        <td>${row.skor4}</td>
        <td>${row.skor3}</td>
        <td>${row.skor2}</td>
        <td>${row.skor1}</td>
      </tr>
    `).join('')}
  </table>
  ` : ''}

  <!-- BAGIAN 11: REFLEKSI PESERTA DIDIK -->
  ${rpl.refleksiPesertaDidik ? `
  <h2 class="section-header">BAGIAN 11 — REFLEKSI PESERTA DIDIK</h2>
  <p>${rpl.refleksiPesertaDidik.pengantar || 'Peserta didik diajak menjawab pertanyaan refleksi mendalam berikut:'}</p>
  <ol>
    ${(rpl.refleksiPesertaDidik.pertanyaanRefleksi || []).map(q => `<li>${q}</li>`).join('')}
  </ol>
  ` : ''}

  <!-- BAGIAN 12: REFLEKSI GURU BK -->
  ${rpl.refleksiGuruBK ? `
  <h2 class="section-header">BAGIAN 12 — REFLEKSI GURU BIMBINGAN DAN KONSELING</h2>
  <table class="data-table">
    <tr>
      <th width="35%">Komponen Evaluasi Diri Guru BK</th>
      <th width="65%">Hasil Refleksi & Catatan Lapangan</th>
    </tr>
    <tr>
      <td>Ketercapaian Tujuan Layanan</td>
      <td>${rpl.refleksiGuruBK.ketercapaianTujuan || '-'}</td>
    </tr>
    <tr>
      <td>Tingkat Keterlibatan & Respons Siswa</td>
      <td>${rpl.refleksiGuruBK.keterlibatanPartisipasi || '-'}</td>
    </tr>
    <tr>
      <td>Efektivitas Metode & Media Pembelajaran</td>
      <td>${rpl.refleksiGuruBK.efektivitasMetodeMedia || '-'}</td>
    </tr>
    <tr>
      <td>Ketepatan Pengelolaan Waktu (Durasi)</td>
      <td>${rpl.refleksiGuruBK.ketepatanAlokasiWaktu || '-'}</td>
    </tr>
    <tr>
      <td>Kendala yang Dihadapi & Solusi</td>
      <td>${rpl.refleksiGuruBK.kendalaYangDihadapi || '-'}</td>
    </tr>
    <tr>
      <td>Rencana Tindak Lanjut Perbaikan</td>
      <td>${rpl.refleksiGuruBK.rencanaTindakLanjutPerbaikan || '-'}</td>
    </tr>
  </table>
  ` : ''}

  <!-- BAGIAN 13: TINDAK LANJUT -->
  ${rpl.tindakLanjut ? `
  <h2 class="section-header">BAGIAN 13 — RENCANA TINDAK LANJUT (FOLLOW UP)</h2>
  <ul>
    <li><strong>Penguatan Klasikal:</strong> ${rpl.tindakLanjut.penguatanKlasikal || '-'}</li>
    <li><strong>Bimbingan Kelompok Lanjutan:</strong> ${rpl.tindakLanjut.bimbinganKelompokLanjutan || '-'}</li>
    <li><strong>Konseling Individual / Terfokus:</strong> ${rpl.tindakLanjut.konselingIndividualKelompok || '-'}</li>
    <li><strong>Kolaborasi Wali Kelas & Orang Tua:</strong> ${rpl.tindakLanjut.kolaborasiWaliKelasOrangTua || '-'}</li>
    <li><strong>Rujukan Tenaga Profesional (Jika Diperlukan):</strong> ${rpl.tindakLanjut.rujukanProfesional || '-'}</li>
    <li><strong>Pemantauan & Evaluasi Berkala:</strong> ${rpl.tindakLanjut.pemantauanPerkembangan || '-'}</li>
  </ul>
  ` : ''}

  <!-- BAGIAN 14: SUMBER DAN LAMPIRAN -->
  <h2 class="section-header">BAGIAN 14 — SUMBER DAN LAMPIRAN</h2>
  <p><strong>Sumber Materi & Referensi:</strong></p>
  <ul>
    ${(rpl.sumberDanLampiran?.sumberMateri || []).map(s => `<li>${s}</li>`).join('')}
  </ul>
  <p><strong>Media Pembelajaran:</strong></p>
  <ul>
    ${(rpl.sumberDanLampiran?.mediaPembelajaran || []).map(m => `<li>${m}</li>`).join('')}
  </ul>
  <p><strong>Lampiran Dokumen:</strong></p>
  <ul>
    ${(rpl.sumberDanLampiran?.daftarLampiran || []).map(l => `<li>${l}</li>`).join('')}
  </ul>

  <!-- BAGIAN 15: PENGESAHAN -->
  <h2 class="section-header">BAGIAN 15 — PENGESAHAN DOKUMEN</h2>
  <table class="signature-table">
    <tr>
      <td width="50%">
        Mengetahui,<br>
        ${rpl.pengesahan?.jabatanKepalaSekolah || 'Kepala Sekolah'}<br><br><br><br>
        <strong>${rpl.pengesahan?.namaKepalaSekolah || 'Nama Kepala Sekolah'}</strong><br>
        NIP. ${rpl.pengesahan?.nipKepalaSekolah || '-'}
      </td>
      <td width="50%">
        ${rpl.pengesahan?.tempatDanTanggal || 'Bekasi, ..................... 2026'}<br>
        ${rpl.pengesahan?.jabatanGuruBK || 'Guru BK / Konselor'}<br><br><br><br>
        <strong>${rpl.pengesahan?.namaGuruBK || 'Nama Guru BK'}</strong><br>
        NIP. ${rpl.pengesahan?.nipGuruBK || '-'}
      </td>
    </tr>
  </table>
</div>
</body>
</html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Format document into plain text / markdown for easy copy-paste
 */
export function formatRplToPlainText(rpl: RplDocument): string {
  let text = `RENCANA PELAKSANAAN LAYANAN (RPL) BIMBINGAN DAN KONSELING\n`;
  text += `BERBASIS PEMBELAJARAN MENDALAM (DEEP LEARNING)\n`;
  text += `${rpl.identitas?.satuanPendidikan || 'SMPN 53 KOTA BEKASI'}\n`;
  text += `===========================================================\n\n`;

  text += `BAGIAN 1 — IDENTITAS LAYANAN\n`;
  text += `• Satuan Pendidikan: ${rpl.identitas?.satuanPendidikan}\n`;
  text += `• Guru BK: ${rpl.identitas?.namaGuruBK} (NIP: ${rpl.identitas?.nipGuruBK || '-'})\n`;
  text += `• Kepala Sekolah: ${rpl.identitas?.namaKepalaSekolah} (NIP: ${rpl.identitas?.nipKepalaSekolah || '-'})\n`;
  text += `• Kelas / Fase: Kelas ${rpl.identitas?.kelasFase}\n`;
  text += `• Tahun Pelajaran / Semester: ${rpl.identitas?.tahunPelajaran} / ${rpl.identitas?.semester}\n`;
  text += `• Komponen / Bidang: ${rpl.identitas?.komponenLayanan} / ${rpl.identitas?.bidangLayanan}\n`;
  text += `• Jenis & Fungsi: ${rpl.identitas?.jenisLayanan} (${rpl.identitas?.fungsiLayanan})\n`;
  text += `• Topik: ${rpl.identitas?.topikLayanan}\n`;
  text += `• Alokasi Waktu: ${rpl.identitas?.alokasiWaktu}\n\n`;

  text += `BAGIAN 2 — IDENTIFIKASI KEBUTUHAN\n`;
  text += `• Dasar Kebutuhan: ${rpl.identifikasiKebutuhan?.dasarKebutuhan}\n`;
  text += `• Hasil Asesmen Kebutuhan: ${rpl.identifikasiKebutuhan?.hasilAsesmenKebutuhan}\n`;
  text += `• Permasalahan Prioritas: ${rpl.identifikasiKebutuhan?.permasalahanPrioritas}\n`;
  text += `• Potensi Siswa: ${rpl.identifikasiKebutuhan?.potensiDanKekuatan}\n\n`;

  text += `BAGIAN 3 — TUJUAN LAYANAN\n`;
  text += `• Tujuan Umum: ${rpl.tujuanLayanan?.tujuanUmum}\n`;
  text += `• Tujuan Khusus:\n`;
  (rpl.tujuanLayanan?.tujuanKhusus || []).forEach((item, idx) => {
    text += `  ${idx + 1}. ${item}\n`;
  });
  text += `• Indikator Ketercapaian:\n`;
  (rpl.tujuanLayanan?.indikatorKetercapaian || []).forEach(item => {
    text += `  - ${item}\n`;
  });
  text += `\n`;

  text += `BAGIAN 4 — DESAIN PEMBELAJARAN MENDALAM\n`;
  text += `• Pendekatan & Model: ${rpl.desainPembelajaranMendalam?.praktikPedagogis?.pendekatan} / ${rpl.desainPembelajaranMendalam?.praktikPedagogis?.strategiModel}\n`;
  text += `• Dimensi Profil Lulusan: ${(rpl.desainPembelajaranMendalam?.dimensiProfilLulusan || []).join(', ')}\n`;
  text += `• Prinsip Berkesadaran: ${rpl.desainPembelajaranMendalam?.prinsipDeepLearning?.berkesadaran}\n`;
  text += `• Prinsip Bermakna: ${rpl.desainPembelajaranMendalam?.prinsipDeepLearning?.bermakna}\n`;
  text += `• Prinsip Menggembirakan: ${rpl.desainPembelajaranMendalam?.prinsipDeepLearning?.menggembirakan}\n\n`;

  text += `BAGIAN 5 — PENGALAMAN BELAJAR\n`;
  text += `1. MEMAHAMI: ${rpl.pengalamanBelajar?.memahami}\n`;
  text += `2. MENGAPLIKASI: ${rpl.pengalamanBelajar?.mengaplikasi}\n`;
  text += `3. MEREFLEKSI: ${rpl.pengalamanBelajar?.merefleksi}\n\n`;

  text += `BAGIAN 6 — LANGKAH-LANGKAH PELAKSANAAN (${rpl.langkahPelaksanaan?.alokasiWaktuTotal})\n`;
  text += `A. Tahap Awal:\n`;
  (rpl.langkahPelaksanaan?.tahapAwal || []).forEach(s => {
    text += `  - ${s.namaKegiatan} (${s.alokasiWaktuMenit} mnt): ${s.aktivitasGuruBK} -> Murid: ${s.aktivitasPesertaDidik}\n`;
  });
  text += `B. Tahap Transisi:\n`;
  (rpl.langkahPelaksanaan?.tahapTransisi || []).forEach(s => {
    text += `  - ${s.namaKegiatan} (${s.alokasiWaktuMenit} mnt): ${s.aktivitasGuruBK}\n`;
  });
  text += `C. Tahap Inti:\n`;
  (rpl.langkahPelaksanaan?.tahapInti || []).forEach(s => {
    text += `  - ${s.namaKegiatan} (${s.alokasiWaktuMenit} mnt): ${s.aktivitasGuruBK} -> Murid: ${s.aktivitasPesertaDidik}\n`;
  });
  text += `D. Tahap Penutup:\n`;
  (rpl.langkahPelaksanaan?.tahapPenutup || []).forEach(s => {
    text += `  - ${s.namaKegiatan} (${s.alokasiWaktuMenit} mnt): ${s.aktivitasGuruBK}\n`;
  });
  text += `\n`;

  if (rpl.materiLayanan) {
    text += `BAGIAN 7 — MATERI LAYANAN\n`;
    text += `Pokok Bahasan: ${rpl.materiLayanan.pokokBahasan}\n`;
    text += `Uraian: ${rpl.materiLayanan.uraianMateri}\n`;
    text += `Contoh: ${rpl.materiLayanan.contohKonkret}\n\n`;
  }

  if (rpl.lkpd) {
    text += `BAGIAN 9 — LKPD\n`;
    text += `Judul: ${rpl.lkpd.judulAktivitas}\n`;
    text += `Petunjuk: ${rpl.lkpd.petunjukPengerjaan}\n`;
    (rpl.lkpd.pertanyaanPanduan || []).forEach((q, i) => {
      text += `  ${i + 1}. ${q}\n`;
    });
    text += `\n`;
  }

  text += `PENGESAHAN\n`;
  text += `Mengetahui,\nKepala Sekolah: ${rpl.pengesahan?.namaKepalaSekolah} (NIP. ${rpl.pengesahan?.nipKepalaSekolah || '-'})\n`;
  text += `Guru BK: ${rpl.pengesahan?.namaGuruBK} (NIP. ${rpl.pengesahan?.nipGuruBK || '-'})\n\n`;
  text += `-----------------------------------------------------------\n`;
  text += `Pengembang : Hari Maktoharibi, S.Pd. | SMPN 53 KOTA BEKASI\n`;

  return text;
}
