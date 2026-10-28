import React from 'react';
import { SavedDraft } from '../utils/storageUtils';
import { RplDocument, RplFormData } from '../types/rpl';
import { FileText, Trash2, Eye, Calendar, User, Clock, ArrowRight } from 'lucide-react';

interface SavedDraftsListProps {
  drafts: SavedDraft[];
  onSelectDraft: (doc: RplDocument, formData?: RplFormData) => void;
  onDeleteDraft: (id: string) => void;
  onNewRpl: () => void;
}

export const SavedDraftsList: React.FC<SavedDraftsListProps> = ({
  drafts,
  onSelectDraft,
  onDeleteDraft,
  onNewRpl,
}) => {
  if (drafts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200">
          <FileText className="w-8 h-8 opacity-70" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Belum Ada Dokumen RPL Tersimpan</h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto mt-1 mb-6">
          Setiap kali Anda menekan tombol "Simpan Draf" pada halaman pratinjau, dokumen RPL akan disimpan secara aman di browser ini.
        </p>
        <button
          onClick={onNewRpl}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow transition-all cursor-pointer"
        >
          <span>Buat RPL Baru Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Arsip Draf RPL Bimbingan & Konseling</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar perangkat layanan yang pernah Anda buat dan simpan pada perangkat ini.
          </p>
        </div>
        <button
          onClick={onNewRpl}
          className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <span>+ Buat RPL Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drafts.map((draft) => {
          const dateStr = new Date(draft.savedAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={draft.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-blue-100 text-blue-800">
                      Kelas {draft.kelas || 'VIII'}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-amber-100 text-amber-800">
                      {draft.bidangLayanan || 'Layanan BK'}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteDraft(draft.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus draf ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 text-base mt-2.5 line-clamp-2">
                  {draft.topik || draft.title}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{draft.document?.identitas?.namaGuruBK || 'Guru BK'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{draft.document?.identitas?.alokasiWaktu || '2 JP'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Disimpan: {dateStr}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {draft.document?.identitas?.satuanPendidikan || 'SMPN 53 Kota Bekasi'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectDraft(draft.document, draft.formData)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-900 hover:bg-blue-900 hover:text-white font-semibold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Buka Dokumen</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
