import React, { useState } from 'react';
import {
  AKSARA_NGLEGENA,
  SANDHANGAN_SWARA,
  SANDHANGAN_PANYIGEG,
  KATA_LATIHAN,
  AksaraItem
} from '../data/aksaraData';
import { Volume2, Search, Sparkles, BookOpen, X, Info } from 'lucide-react';
import { speakWord, playClickSound } from '../utils/audio';

type CategoryFilter = 'all' | 'nglegena' | 'swara' | 'panyigeg' | 'kata';

export const StudyMode: React.FC = () => {
  const [filter, setFilter] = useState<CategoryFilter>('nglegena');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<AksaraItem | null>(null);

  // Filter items
  const getAllItems = (): AksaraItem[] => {
    switch (filter) {
      case 'nglegena':
        return AKSARA_NGLEGENA;
      case 'swara':
        return SANDHANGAN_SWARA;
      case 'panyigeg':
        return SANDHANGAN_PANYIGEG;
      case 'all':
        return [...AKSARA_NGLEGENA, ...SANDHANGAN_SWARA, ...SANDHANGAN_PANYIGEG];
      default:
        return AKSARA_NGLEGENA;
    }
  };

  const filteredItems = getAllItems().filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.latin.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.sampleWord && item.sampleWord.latin.toLowerCase().includes(q))
    );
  });

  const filteredWords = KATA_LATIHAN.filter(w => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return w.latin.toLowerCase().includes(q) || w.arti.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Hero Banner for Study Mode */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white p-6 sm:p-8 shadow-lg shadow-amber-900/10">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-6 opacity-15 pointer-events-none select-none font-jawa text-9xl">
          ꦲꦤꦕꦫꦏ
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-medium mb-3">
            <BookOpen className="w-3.5 h-3.5" /> Modul 1: Kamus & Kartu Belajar
          </div>
          <h1 className="font-child text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Sinau Aksara Jawa Kelas 5 SD
          </h1>
          <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
            Kenali 20 Aksara Nglegena dasar, 5 Sandhangan Swara, dan 4 Sandhangan Panyigeg Wanda. Klik kartu untuk mendengar pelafalan dan melihat contoh kata!
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-amber-100/80 rounded-2xl border border-amber-200 overflow-x-auto scrollbar-none">
          <button
            onClick={() => { playClickSound(); setFilter('nglegena'); }}
            className={`shrink-0 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
              filter === 'nglegena'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-900 hover:bg-amber-200/50'
            }`}
          >
            Aksara Dasar (20)
          </button>
          <button
            onClick={() => { playClickSound(); setFilter('swara'); }}
            className={`shrink-0 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
              filter === 'swara'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-900 hover:bg-amber-200/50'
            }`}
          >
            Sandhangan Swara
          </button>
          <button
            onClick={() => { playClickSound(); setFilter('panyigeg'); }}
            className={`shrink-0 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
              filter === 'panyigeg'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-900 hover:bg-amber-200/50'
            }`}
          >
            Sandhangan Panyigeg
          </button>
          <button
            onClick={() => { playClickSound(); setFilter('kata'); }}
            className={`shrink-0 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
              filter === 'kata'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-900 hover:bg-amber-200/50'
            }`}
          >
            Kamus Kata
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-700" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari aksara atau kata..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white rounded-2xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 placeholder-amber-900/40 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Cards or Word List */}
      {filter !== 'kata' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                playClickSound();
                setSelectedItem(item);
              }}
              className="group relative bg-white rounded-2xl border-2 border-amber-200/90 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer p-4 flex flex-col items-center text-center overflow-hidden"
            >
              {/* Background accent motif */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />

              {/* Character display */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-center mb-3 group-hover:bg-amber-100/80 transition-colors">
                <span className="font-jawa text-4xl sm:text-5xl font-bold text-amber-950 group-hover:scale-110 transition-transform">
                  {item.char}
                </span>
              </div>

              {/* Latin Name & Pronunciation */}
              <h2
                className="font-child w-full truncate text-lg sm:text-xl font-bold text-amber-900 mb-0.5"
                title={item.latin}
              >
                {item.latin}
              </h2>
              <p
                className="w-full truncate text-xs text-amber-700/80 mb-2"
                title={item.name}
              >
                {item.name}
              </p>

              {/* Sample Word chip */}
              {item.sampleWord && (
                <div className="w-full mt-auto pt-2 border-t border-amber-100 flex items-center justify-between gap-1.5 text-[11px] text-amber-900/80">
                  <span className="shrink-0 font-jawa text-sm font-semibold whitespace-nowrap">{item.sampleWord.jawa}</span>
                  <span
                    className="truncate font-medium text-amber-700"
                    title={`${item.sampleWord.latin} = ${item.sampleWord.meaning}`}
                  >
                    ({item.sampleWord.latin})
                  </span>
                </div>
              )}

              {/* Quick Audio Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();
                  speakWord(item.latin.replace(/[()\-]/g, ''));
                }}
                title="Dengarkan cara baca"
                aria-label={`Dengarkan pelafalan ${item.name}`}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-600 hover:text-white transition-colors opacity-80 group-hover:opacity-100"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Word dictionary table/grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {filteredWords.map((word, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border-2 border-amber-200/90 p-4 hover:border-amber-500 hover:shadow-md transition-all flex items-center justify-between gap-3 min-w-0"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="h-16 min-w-16 shrink-0 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center px-3">
                  <span className="font-jawa whitespace-nowrap text-xl font-bold text-amber-950 leading-none">
                    {word.jawa}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2
                    className="font-child font-bold text-base text-amber-900 truncate"
                    title={word.latin}
                  >
                    {word.latin}
                  </h2>
                  <p
                    className="text-xs text-amber-800/80 font-medium truncate"
                    title={word.arti}
                  >
                    {word.arti}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  speakWord(word.latin);
                }}
                aria-label={`Dengarkan pelafalan ${word.latin}`}
                className="shrink-0 p-2 rounded-xl bg-amber-100 text-amber-800 hover:bg-amber-600 hover:text-white transition-colors"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && filter !== 'kata' && (
        <div className="text-center py-12 bg-white rounded-3xl border border-amber-200 p-8">
          <Info className="w-10 h-10 text-amber-500 mx-auto mb-2" />
          <h2 className="text-base font-bold text-amber-950">Tidak ada aksara yang cocok</h2>
          <p className="text-sm text-amber-800/70 mt-1">
            Coba ketik kata kunci lain pada kolom pencarian.
          </p>
        </div>
      )}

      {/* Modal Detail for Item */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl border-2 border-amber-300 shadow-2xl p-6 sm:p-7 space-y-4">
            <button
              onClick={() => setSelectedItem(null)}
              aria-label="Tutup jendela"
              className="absolute top-4 right-4 p-2 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Character Header */}
            <div className="text-center pt-2">
              <div className="inline-block w-28 h-28 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center mb-3 shadow-inner">
                <span className="font-jawa text-6xl font-bold text-amber-950">
                  {selectedItem.char}
                </span>
              </div>
              <h2 className="font-child text-2xl font-bold text-amber-950">
                {selectedItem.name}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-base font-semibold text-amber-700">
                  Tulisan Latin: <span className="font-bold underline">{selectedItem.latin}</span>
                </span>
                <button
                  onClick={() => speakWord(selectedItem.latin.replace(/[()\-]/g, ''))}
                  aria-label="Dengarkan pelafalan"
                  className="p-1 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-600 hover:text-white transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Description & Pronunciation details */}
            <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 space-y-2.5 text-sm">
              <div>
                <span className="font-bold text-amber-900 block text-xs uppercase tracking-wide">
                  Cara Pelafalan:
                </span>
                <p className="text-amber-950 font-medium">{selectedItem.pronunciation}</p>
              </div>

              <div>
                <span className="font-bold text-amber-900 block text-xs uppercase tracking-wide">
                  Penjelasan:
                </span>
                <p className="text-amber-950 font-normal">{selectedItem.description}</p>
              </div>

              {selectedItem.position && (
                <div>
                  <span className="font-bold text-amber-900 block text-xs uppercase tracking-wide">
                    Posisi Penulisan:
                  </span>
                  <p className="text-amber-950 font-normal">{selectedItem.position}</p>
                </div>
              )}

              {selectedItem.mnemonic && (
                <div className="bg-amber-100/80 p-2.5 rounded-xl border border-amber-300/60">
                  <span className="font-bold text-amber-950 text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Jembatan Ingatan (Mnemonic):
                  </span>
                  <p className="text-amber-900 text-xs mt-0.5 font-medium">{selectedItem.mnemonic}</p>
                </div>
              )}
            </div>

            {/* Example Word */}
            {selectedItem.sampleWord && (
              <div className="bg-white rounded-2xl border border-amber-200 p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-700 font-semibold block">Contoh Tembung:</span>
                  <span className="font-jawa text-2xl font-bold text-amber-950">
                    {selectedItem.sampleWord.jawa}
                  </span>
                  <p className="text-xs text-amber-900 font-medium">
                    {selectedItem.sampleWord.latin} = {selectedItem.sampleWord.meaning}
                  </p>
                </div>
                <button
                  onClick={() => speakWord(selectedItem.sampleWord!.latin)}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Bunyikan
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors"
            >
              Tutup & Lanjut Sinau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
