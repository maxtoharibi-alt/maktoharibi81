import React from 'react';
import { BookOpen, Sparkles, FolderArchive, HelpCircle, GraduationCap } from 'lucide-react';

interface HeaderProps {
  activeTab: 'form' | 'preview' | 'drafts';
  setActiveTab: (tab: 'form' | 'preview' | 'drafts') => void;
  hasDocument: boolean;
  draftsCount: number;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasDocument,
  draftsCount,
  onOpenGuide,
}) => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-b border-amber-500/30 shadow-lg sticky top-0 z-30">
      {/* Top branding bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3.5">
          {/* Emblem / Badge */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-blue-950 rounded-[10px] flex items-center justify-center border border-amber-300/40">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>RPL DEEP LEARNING</span>
                <span className="text-amber-400 font-bold">-SMPN 53 KOTA BEKASI</span>
              </h1>
              <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700/60">
                Fase D • SMP
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-normal mt-0.5">
              Solusi cerdas penyusunan RPL Bimbingan dan Konseling berbasis Pembelajaran Mendalam untuk SMP.
            </p>
          </div>
        </div>

        {/* Action button to open Deep Learning guide */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
            title="Pelajari 3 Prinsip Deep Learning & 8 Dimensi Profil Lulusan"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Panduan Deep Learning</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center border-t border-slate-800 text-xs sm:text-sm">
        <button
          type="button"
          onClick={() => setActiveTab('form')}
          className={`flex items-center gap-2 py-2.5 px-4 font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'form'
              ? 'border-amber-400 text-amber-400 bg-blue-900/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Formulir Input Layanan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 py-2.5 px-4 font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'preview'
              ? 'border-amber-400 text-amber-400 bg-blue-900/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Pratinjau Dokumen RPL</span>
          {hasDocument && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('drafts')}
          className={`flex items-center gap-2 py-2.5 px-4 font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'drafts'
              ? 'border-amber-400 text-amber-400 bg-blue-900/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <FolderArchive className="w-4 h-4" />
          <span>Draf Tersimpan</span>
          {draftsCount > 0 && (
            <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {draftsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
