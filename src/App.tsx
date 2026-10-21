import React, { useState } from 'react';
import { Navbar, AppTab, JavaneseFontStyle } from './components/Navbar';
import { StudyMode } from './components/StudyMode';
import { GameMode } from './components/GameMode';
import { DrawingPad } from './components/DrawingPad';
import { StoryTranslation } from './components/StoryTranslation';
import { Leaderboard } from './components/Leaderboard';
import { setSoundEnabled } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1' || params.get('tab') === 'game') {
        return 'game';
      }
      if (params.get('tab') === 'story') {
        return 'story';
      }
      if (params.get('tab') === 'drawing') {
        return 'drawing';
      }
      if (params.get('tab') === 'leaderboard') {
        return 'leaderboard';
      }
    }
    return 'study';
  });

  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [fontStyle, setFontStyle] = useState<JavaneseFontStyle>('hanacaraka');

  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
  };

  const handleToggleFontStyle = () => {
    setFontStyle(prev => (prev === 'hanacaraka' ? 'modern' : 'hanacaraka'));
  };

  const handleTabChange = (tab: AppTab) => {
    setCurrentTab(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0 });
    }
  };

  const fontStyleCssVar =
    fontStyle === 'hanacaraka'
      ? "'Hanacaraka', 'Tuladha Jejeg', 'Noto Sans Javanese', serif"
      : "'Noto Sans Javanese', 'Segoe UI Historic', sans-serif";

  return (
    <div
      style={{ '--font-jawa-custom': fontStyleCssVar } as React.CSSProperties}
      className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/70 via-orange-50/30 to-amber-100/40 font-sans selection:bg-amber-200 selection:text-amber-950"
    >
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={handleTabChange}
        soundOn={soundOn}
        onToggleSound={handleToggleSound}
        fontStyle={fontStyle}
        onToggleFontStyle={handleToggleFontStyle}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-5 sm:py-7">
        {currentTab === 'study' && <StudyMode />}
        {/* GameMode stays mounted so progress survives a trip to Kartu Belajar */}
        <div className={currentTab === 'game' ? '' : 'hidden'}>
          <GameMode onOpenStudy={() => handleTabChange('study')} />
        </div>
        {currentTab === 'story' && <StoryTranslation />}
        {currentTab === 'drawing' && <DrawingPad />}
        {currentTab === 'leaderboard' && (
          <Leaderboard onStartPlaying={() => handleTabChange('game')} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-amber-200/80 bg-white/80 py-5 text-center text-xs text-amber-900/80">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium">
            Media Pembelajaran Interaktif Aksara Jawa &middot; Kurikulum Merdeka Kelas 5 SD
          </p>
          <div className="flex items-center gap-3 text-amber-700">
            <span>20 Aksara Nglegena</span>
            <span>&middot;</span>
            <span>Sandhangan Swara</span>
            <span>&middot;</span>
            <span>Sandhangan Panyigeg</span>
            <span>&middot;</span>
            <span>Wacan 3 Paragraf</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
