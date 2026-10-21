import React from 'react';
import { BookOpen, Gamepad2, PenTool, Volume2, VolumeX, Sparkles, BookText, Trophy } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playClickSound } from '../utils/audio';

export type AppTab = 'study' | 'game' | 'story' | 'drawing' | 'leaderboard';
export type JavaneseFontStyle = 'hanacaraka' | 'modern';

interface NavbarProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  soundOn: boolean;
  onToggleSound: () => void;
  fontStyle: JavaneseFontStyle;
  onToggleFontStyle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  soundOn,
  onToggleSound,
  fontStyle,
  onToggleFontStyle
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-1 sm:gap-2">
        {/* Logo and Brand Title */}
        <div 
          onClick={() => { playClickSound(); onTabChange('study'); }}
          className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none group shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-600/20 group-hover:scale-105 transition-transform">
            <span className="font-jawa text-lg sm:text-2xl font-bold">ꦲ</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-child font-bold text-sm sm:text-lg text-amber-950 tracking-tight whitespace-nowrap">
                Sinau Aksara
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 hidden lg:inline-block">
                Kelas 5 SD
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.14em] text-amber-700/90 leading-tight whitespace-nowrap">
              Saung Pintar Dukuhwaru
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-0.5 sm:gap-1 p-1 bg-amber-100/70 rounded-2xl border border-amber-200 overflow-x-auto scrollbar-none">
          <button
            onClick={() => { playClickSound(); onTabChange('study'); }}
            aria-label="Kartu Belajar"
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              currentTab === 'study'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                : 'text-amber-900 hover:bg-amber-200/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xl:inline">Kartu Belajar</span>
            <span className="hidden sm:inline xl:hidden text-[11px]">Kartu</span>
          </button>

          <button
            onClick={() => { playClickSound(); onTabChange('game'); }}
            aria-label="Petualangan Game"
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              currentTab === 'game'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                : 'text-amber-900 hover:bg-amber-200/60'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xl:inline">Petualangan Game</span>
            <span className="hidden sm:inline xl:hidden text-[11px]">Game</span>
          </button>

          <button
            onClick={() => { playClickSound(); onTabChange('story'); }}
            aria-label="Terjemah Cerita"
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              currentTab === 'story'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                : 'text-amber-900 hover:bg-amber-200/60'
            }`}
          >
            <BookText className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xl:inline">Terjemah Cerita</span>
            <span className="hidden sm:inline xl:hidden text-[11px]">Cerita</span>
          </button>

          <button
            onClick={() => { playClickSound(); onTabChange('drawing'); }}
            aria-label="Tulis Aksara"
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              currentTab === 'drawing'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                : 'text-amber-900 hover:bg-amber-200/60'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xl:inline">Tulis Aksara</span>
            <span className="hidden sm:inline xl:hidden text-[11px]">Tulis</span>
          </button>

          <button
            onClick={() => { playClickSound(); onTabChange('leaderboard'); }}
            aria-label="Peringkat"
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              currentTab === 'leaderboard'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                : 'text-amber-900 hover:bg-amber-200/60'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xl:inline">Peringkat</span>
            <span className="hidden sm:inline xl:hidden text-[11px]">Ranking</span>
          </button>
        </nav>

        {/* Right Controls: Font Style Toggle & Sound Toggle */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={() => {
              playClickSound();
              onToggleFontStyle();
            }}
            aria-label="Ganti Gaya Huruf Aksara Jawa"
            className="px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
            title={`Gaya Aksara: ${fontStyle === 'hanacaraka' ? 'Font Hanacaraka (Klasik Buku Pelajaran SD)' : 'Font Noto Modern'}. Klik untuk ganti.`}
          >
            <span className="font-jawa text-sm font-bold text-amber-700">ꦲ</span>
            <span className="hidden xl:inline">
              {fontStyle === 'hanacaraka' ? 'Hanacaraka (Klasik)' : 'Modern'}
            </span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onToggleSound();
            }}
            aria-label={soundOn ? 'Matikan Suara' : 'Nyalakan Suara'}
            className="p-1.5 sm:p-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 text-amber-800 transition-colors shadow-xs"
            title={soundOn ? 'Suara Aktif' : 'Suara Mati'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
