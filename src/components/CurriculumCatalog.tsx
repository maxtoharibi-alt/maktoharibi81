import React, { useState, useEffect } from 'react';
import { 
  MATERI_KELAS_7_GANJIL, 
  MATERI_KELAS_7_GENAP, 
  ALL_KELAS_7_TOPICS,
  MATERI_KELAS_8_GANJIL,
  MATERI_KELAS_8_GENAP,
  ALL_KELAS_8_TOPICS,
  MATERI_KELAS_9_GANJIL,
  MATERI_KELAS_9_GENAP,
  ALL_KELAS_9_TOPICS,
  KelasTopicItem 
} from '../data/presets';
import { RplFormData } from '../types/rpl';
import { 
  BookOpen, 
  Sparkles, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  GraduationCap, 
  Sun, 
  Moon,
  Search,
  ShieldCheck,
  Compass,
  Award
} from 'lucide-react';

interface CurriculumCatalogProps {
  currentTopik: string;
  selectedKelas?: string;
  onSelectTopic: (topicData: Partial<RplFormData>, label?: string) => void;
}

export const CurriculumCatalog: React.FC<CurriculumCatalogProps> = ({
  currentTopik,
  selectedKelas = 'VII',
  onSelectTopic,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [activeGrade, setActiveGrade] = useState<'VII' | 'VIII' | 'IX'>(() => {
    if (selectedKelas === 'IX') return 'IX';
    if (selectedKelas === 'VIII') return 'VIII';
    return 'VII';
  });
  const [activeTab, setActiveTab] = useState<'all' | 'ganjil' | 'genap'>('all');
  const [selectedBidang, setSelectedBidang] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Automatically adapt to selectedKelas when changed from the form
  useEffect(() => {
    if (selectedKelas === 'IX') {
      setActiveGrade('IX');
    } else if (selectedKelas === 'VIII') {
      setActiveGrade('VIII');
    } else if (selectedKelas === 'VII') {
      setActiveGrade('VII');
    }
  }, [selectedKelas]);

  let currentGradeTopics: KelasTopicItem[] = ALL_KELAS_7_TOPICS;
  let ganjilTopics: KelasTopicItem[] = MATERI_KELAS_7_GANJIL;
  let genapTopics: KelasTopicItem[] = MATERI_KELAS_7_GENAP;

  if (activeGrade === 'VIII') {
    currentGradeTopics = ALL_KELAS_8_TOPICS;
    ganjilTopics = MATERI_KELAS_8_GANJIL;
    genapTopics = MATERI_KELAS_8_GENAP;
  } else if (activeGrade === 'IX') {
    currentGradeTopics = ALL_KELAS_9_TOPICS;
    ganjilTopics = MATERI_KELAS_9_GANJIL;
    genapTopics = MATERI_KELAS_9_GENAP;
  }

  // Filter topics
  const filteredTopics = currentGradeTopics.filter((t) => {
    const matchTab = activeTab === 'all' || 
      (activeTab === 'ganjil' && t.semester === 'Ganjil') || 
      (activeTab === 'genap' && t.semester === 'Genap');
    const matchBidang = selectedBidang === 'Semua' || t.bidang === selectedBidang;
    const matchSearch = searchQuery.trim() === '' || 
      t.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ringkasan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bidang.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchBidang && matchSearch;
  });

  const handleApply = (topic: KelasTopicItem) => {
    setSelectedId(topic.id);
    onSelectTopic(topic.data, topic.judul);
  };

  const getBidangColor = (bidang: string) => {
    switch (bidang) {
      case 'Pribadi':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Sosial':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Belajar':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Karier':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const gradeInfo = activeGrade === 'VII' ? {
    badge: 'Kelas 7 • Fase D',
    theme: 'Masa Adaptasi dan Pengenalan Diri',
    desc: 'Kurikulum transisi SD ke SMP, orientasi tata tertib, kemandirian belajar, konsep diri awal, adaptasi kawan sebaya, dan pengenalan BK.',
    accentColor: 'from-blue-900 via-indigo-950 to-slate-900',
    totalCount: ALL_KELAS_7_TOPICS.length,
    icon: GraduationCap
  } : activeGrade === 'VIII' ? {
    badge: 'Kelas 8 • Fase D',
    theme: 'Pengembangan Karakter dan Pengendalian Diri',
    desc: 'Kurikulum pemahaman pubertas madya, integritas kejujuran, komunikasi asertif, gaya belajar V-A-K, peer pressure, kecerdasan majemuk, dan manajemen emosi & stres.',
    accentColor: 'from-indigo-950 via-purple-950 to-slate-900',
    totalCount: ALL_KELAS_8_TOPICS.length,
    icon: ShieldCheck
  } : {
    badge: 'Kelas 9 • Fase D',
    theme: 'Pemantapan Studi Lanjutan dan Karier',
    desc: 'Kurikulum pemetaan bakat mandiri, prospek profesi masa depan, tipe kepribadian, strategi asesmen kelulusan, orientasi SMA vs SMK, kesiapan mental perpisahan, dan keputusan studi lanjut realistis.',
    accentColor: 'from-amber-950 via-slate-900 to-blue-950',
    totalCount: ALL_KELAS_9_TOPICS.length,
    icon: Compass
  };

  const CurrentIcon = gradeInfo.icon;

  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-200/80 shadow-sm overflow-hidden mb-8 transition-all">
      {/* Header Banner */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-gradient-to-r ${gradeInfo.accentColor} p-4 sm:p-5 text-white flex items-center justify-between cursor-pointer select-none border-b border-indigo-800/60`}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
            <CurrentIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 tracking-wider">
                {gradeInfo.badge}
              </span>
              <span className="text-xs text-blue-200 font-medium">
                {gradeInfo.totalCount} Materi Layanan Lengkap (Ganjil & Genap)
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5 flex items-center gap-2">
              <span>{gradeInfo.theme}</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-xs font-medium text-amber-300">
            {isOpen ? 'Sembunyikan Bank Materi' : 'Buka Bank Materi'}
          </span>
          <button
            type="button"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Body */}
      {isOpen && (
        <div className="p-4 sm:p-6 bg-slate-50/60">
          {/* Grade Segmented Switcher & Search */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
            {/* 3 Grade Switcher Tabs */}
            <div className="flex items-center p-1 bg-slate-200/80 rounded-xl gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => { setActiveGrade('VII'); setActiveTab('all'); setSelectedBidang('Semua'); }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeGrade === 'VII'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/50'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Kelas 7: Adaptasi & Diri</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-bold">12</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveGrade('VIII'); setActiveTab('all'); setSelectedBidang('Semua'); }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeGrade === 'VIII'
                    ? 'bg-purple-900 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Kelas 8: Karakter & Emosi</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-bold">12</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveGrade('IX'); setActiveTab('all'); setSelectedBidang('Semua'); }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeGrade === 'IX'
                    ? 'bg-amber-900 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/50'
                }`}
              >
                <Compass className="w-4 h-4 text-amber-300" />
                <span>Kelas 9: Studi Lanjut & Karier</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-bold">10</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Cari materi Kelas ${activeGrade}...`}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>
          </div>

          {/* Subtext info */}
          <div className="mb-4 text-xs text-slate-600 flex items-center justify-between gap-2">
            <p>
              Klik <strong className="text-blue-900">"Terapkan ke Formulir RPL"</strong> pada topik di bawah untuk otomatis mengisi formulir dengan parameter kurikulum dan prinsip Deep Learning.
            </p>
          </div>

          {/* Filter Bar: Semester Tabs & Bidang Chips */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-5">
            {/* Semester Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-blue-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({currentGradeTopics.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ganjil')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'ganjil'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Semester Ganjil ({ganjilTopics.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('genap')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'genap'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-emerald-300" />
                <span>Semester Genap ({genapTopics.length})</span>
              </button>
            </div>

            {/* Bidang Filters */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">Bidang:</span>
              {['Semua', 'Pribadi', 'Sosial', 'Belajar', 'Karier'].map((bidang) => (
                <button
                  key={bidang}
                  type="button"
                  onClick={() => setSelectedBidang(bidang)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                    selectedBidang === bidang
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {bidang}
                </button>
              ))}
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredTopics.map((topic) => {
              const isActive = (selectedId === topic.id) || currentTopik.toLowerCase().includes(topic.judul.toLowerCase().replace('.', ''));
              return (
                <div
                  key={topic.id}
                  className={`bg-white rounded-xl p-4 border transition-all flex flex-col justify-between ${
                    isActive
                      ? 'border-blue-700 ring-2 ring-blue-500/30 shadow-md bg-blue-50/20'
                      : 'border-slate-200 hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  <div>
                    {/* Top Row: Number & Badges */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">
                          {topic.nomor}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBidangColor(topic.bidang)}`}>
                          Bidang {topic.bidang}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          Kls {topic.kelas || activeGrade}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          topic.semester === 'Ganjil' 
                            ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}>
                          Sem. {topic.semester}
                        </span>
                      </div>
                    </div>

                    {/* Judul Materi */}
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2 min-h-[2.5rem]">
                      {topic.judul}
                    </h4>

                    {/* Ringkasan */}
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {topic.ringkasan}
                    </p>

                    {/* Fokus Deep Learning preview */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <div className="flex items-start gap-1.5 text-[11px] text-slate-500 leading-tight">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 italic">
                          {topic.fokusDeepLearning}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Button apply */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleApply(topic)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-900 text-white hover:bg-blue-950 shadow-xs'
                          : 'bg-slate-100 hover:bg-blue-900 hover:text-white text-slate-800'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-amber-300" />
                          <span>Materi Aktif Dipilih</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Terapkan ke Formulir RPL</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTopics.length === 0 && (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
              <p className="text-sm text-slate-500">Tidak ada materi yang sesuai dengan pencarian atau filter Anda.</p>
              <button
                type="button"
                onClick={() => { setSelectedBidang('Semua'); setSearchQuery(''); setActiveTab('all'); }}
                className="mt-2 text-xs text-blue-900 font-bold hover:underline"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
