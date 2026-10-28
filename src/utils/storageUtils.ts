import { RplDocument, RplFormData } from '../types/rpl';

const STORAGE_KEY_SAVED_RPLS = 'smpn53_saved_rpls_v1';
const STORAGE_KEY_LAST_FORM = 'smpn53_last_form_data_v1';

export interface SavedDraft {
  id: string;
  savedAt: string;
  title: string;
  topik: string;
  kelas: string;
  bidangLayanan: string;
  document: RplDocument;
  formData?: RplFormData;
}

export function getSavedDrafts(): SavedDraft[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_RPLS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved drafts:', e);
    return [];
  }
}

export function saveDraft(doc: RplDocument, formData?: RplFormData): SavedDraft {
  const drafts = getSavedDrafts();
  const id = doc.id || 'rpl-' + Date.now();
  const title = doc.identitas?.topikLayanan || doc.title || 'RPL Bimbingan Konseling';
  
  const newDraft: SavedDraft = {
    id,
    savedAt: new Date().toISOString(),
    title,
    topik: doc.identitas?.topikLayanan || '-',
    kelas: doc.identitas?.kelasFase || 'VIII',
    bidangLayanan: doc.identitas?.bidangLayanan || 'Dasar',
    document: { ...doc, id },
    formData
  };

  // Replace if exists, or prepend
  const existingIdx = drafts.findIndex(d => d.id === id);
  if (existingIdx >= 0) {
    drafts[existingIdx] = newDraft;
  } else {
    drafts.unshift(newDraft);
  }

  localStorage.setItem(STORAGE_KEY_SAVED_RPLS, JSON.stringify(drafts));
  return newDraft;
}

export function deleteDraft(id: string): void {
  const drafts = getSavedDrafts().filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY_SAVED_RPLS, JSON.stringify(drafts));
}

export function saveLastFormData(data: RplFormData): void {
  try {
    localStorage.setItem(STORAGE_KEY_LAST_FORM, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save last form data', e);
  }
}

export function getLastFormData(): RplFormData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LAST_FORM);
    if (!raw) return null;
    const data: RplFormData = JSON.parse(raw);
    
    // Auto-migrate old defaults to the new updated defaults requested by the user
    if (data.namaGuruBK?.includes('Nurjanah')) {
      data.namaGuruBK = 'Hari Maktoharibi, S.Pd.';
      data.nipGuruBK = '19811005 202321 1 007';
    }
    if (data.namaKepalaSekolah?.includes('Maman Suratman')) {
      data.namaKepalaSekolah = 'Arief Purnama, S.Pd.';
      data.nipKepalaSekolah = '19730311 201412 1 001';
    }
    if (data.tahunPelajaran === '2025/2026') {
      data.tahunPelajaran = '2026/2027';
    }
    if (data.alokasiWaktu === '2 JP (2 x 40 Menit)') {
      data.alokasiWaktu = '1 JP (2 x 40 Menit)';
      data.durasiMenit = 80;
    }

    return data;
  } catch {
    return null;
  }
}
