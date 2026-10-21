import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { STORY_DATA, StoryParagraph } from '../data/storyData';
import {
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Languages
} from 'lucide-react';
import { playCorrectSound, playWrongSound, playClickSound } from '../utils/audio';

export const StoryTranslation: React.FC = () => {
  const [translations, setTranslations] = useState<Record<number, string>>({
    1: '',
    2: '',
    3: ''
  });

  const [feedback, setFeedback] = useState<
    Record<
      number,
      {
        checked: boolean;
        score: number;
        message: string;
        matchedCount: number;
        totalKeywords: number;
      }
    >
  >({});

  // Check student translation for a paragraph
  const handleCheckTranslation = (para: StoryParagraph) => {
    playClickSound();
    const input = (translations[para.id] || '').toLowerCase().trim();

    if (!input || input.length < 5) {
      playWrongSound();
      setFeedback(prev => ({
        ...prev,
        [para.id]: {
          checked: true,
          score: 0,
          message: 'Tuliskan terjemahan terlebih dahulu minimal satu kalimat ya!',
          matchedCount: 0,
          totalKeywords: para.keywords.length
        }
      }));
      return;
    }

    // Keyword detection
    let matched = 0;
    para.keywords.forEach(kw => {
      if (input.includes(kw.toLowerCase())) {
        matched++;
      }
    });

    const percent = Math.round((matched / para.keywords.length) * 100);

    let message = '';
    if (percent >= 60 || input.length > 35) {
      playCorrectSound();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // fallback
      }
      message = 'Luar Biasa! Terjemahanmu apik lan wis nggambarake isi paragraf kanthi bener.';
    } else {
      playWrongSound();
      message = 'Wis lumayan! Nanging ana sawetara tembung kunci sing durung klebu. Coba wacanen maneh kanthi teliti ya!';
    }

    setFeedback(prev => ({
      ...prev,
      [para.id]: {
        checked: true,
        score: Math.min(Math.max(percent, 40), 100),
        message,
        matchedCount: matched,
        totalKeywords: para.keywords.length
      }
    }));
  };

  const completedCount = Object.values(feedback).filter(f => f.checked && f.score >= 50).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white p-6 sm:p-8 shadow-lg">
        <div className="absolute right-2 top-2 opacity-15 select-none font-jawa text-8xl pointer-events-none">
          ꦱꦶꦩ꧀ꦧꦃ
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold mb-3">
            <Languages className="w-3.5 h-3.5" /> Modul Menerjemahkan Cerita Kelas 5 SD
          </div>
          <h1 className="font-child text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Gladhen Nerjemahake Cerita Aksara Jawa
          </h1>
          <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
            Wacanen cerita 3 paragraf ing ngisor iki sing ditulis nganggo Aksara Jawa. Terjemahake saben paragraf menyang Basa Indonesia.
          </p>
        </div>
      </div>

      {/* Story Title & Meta Card */}
      <div className="bg-white rounded-3xl border-2 border-amber-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Judul Wacan Cerita
          </span>
          <h2 className="font-jawa text-2xl sm:text-3xl font-bold text-amber-950 mt-1 leading-[2.5] pb-1">
            {STORY_DATA.titleJawa}
          </h2>
          <p className="font-child text-base sm:text-lg font-bold text-amber-900">
            {STORY_DATA.titleLatin} <span className="text-sm font-normal text-amber-700">({STORY_DATA.titleIndo})</span>
          </p>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-100/80 px-4 py-2 rounded-2xl border border-amber-300 text-center">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">Kemajuan</span>
            <span className="font-child font-bold text-amber-950 text-base">
              {completedCount} / 3 Paragraf
            </span>
          </div>
        </div>
      </div>

      {/* Paragraphs List */}
      <div className="space-y-6">
        {STORY_DATA.paragraphs.map((para) => {
          const paraFeedback = feedback[para.id];
          const jawaSentences = para.jawa
            .split(/(?<=꧉)\s*/)
            .map(sentence => sentence.trim())
            .filter(Boolean);

          return (
            <div
              key={para.id}
              className="bg-white rounded-3xl border-2 border-amber-200/90 p-5 sm:p-7 shadow-xs space-y-4"
            >
              {/* Paragraph Header */}
              <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {para.id}
                  </span>
                  <span className="font-child font-bold text-base text-amber-950">
                    Paragraf {para.id}
                  </span>
                </div>
              </div>

              {/* Javanese Script Display Box */}
              <div className="bg-amber-50/70 rounded-2xl p-4 sm:p-5 border border-amber-200/80">
                <div className="space-y-5 sm:space-y-6">
                  {jawaSentences.map((sentence, sentenceIndex) => (
                    <p
                      key={sentenceIndex}
                      className="font-jawa text-2xl sm:text-3xl font-medium text-amber-950 leading-[3.2] select-text"
                    >
                      {sentence}
                    </p>
                  ))}
                </div>
              </div>

              {/* Student Translation Workspace */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-amber-950">
                  Tuliskan Terjemahanmu (Bahasa Indonesia):
                </label>
                <textarea
                  value={translations[para.id] || ''}
                  onChange={(e) =>
                    setTranslations(prev => ({ ...prev, [para.id]: e.target.value }))
                  }
                  placeholder={`Ketik terjemahanmu untuk Paragraf ${para.id} di sini...`}
                  rows={3}
                  className="w-full p-3.5 text-sm rounded-2xl border-2 border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/30 text-slate-900 placeholder:text-amber-900/40 shadow-inner"
                />

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => handleCheckTranslation(para)}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all hover:scale-102"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Priksa Terjemahan Paragraf {para.id}</span>
                  </button>

                  <button
                    onClick={() => {
                      playClickSound();
                      setTranslations(prev => ({ ...prev, [para.id]: '' }));
                      setFeedback(prev => ({ ...prev, [para.id]: { checked: false, score: 0, message: '', matchedCount: 0, totalKeywords: 0 } }));
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-600 text-xs hover:bg-slate-50 transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Feedback box */}
              {paraFeedback && paraFeedback.checked && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in ${
                    paraFeedback.score >= 50
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <Sparkles className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold block">
                      {paraFeedback.score >= 50 ? 'Nilai: ' + paraFeedback.score + '/100' : 'Perlu Dilengkapi'}
                    </span>
                    <p className="mt-0.5">{paraFeedback.message}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {completedCount === 3 && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-7 rounded-3xl shadow-lg text-center space-y-3 animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-full bg-white/20 mx-auto flex items-center justify-center text-3xl">
            🎉
          </div>
          <h2 className="font-child text-2xl font-bold">
            Sugeng! Telung Paragraf Wis Dituntasake!
          </h2>
          <p className="text-emerald-100 text-sm max-w-lg mx-auto">
            Sampeyan wis kasil maca lan nerjemahake kabeh telung paragraf cerita Aksara Jawa kanthi apik. Kemampuan maca Aksara Jawa sampeyan sangsaya pinter!
          </p>
        </div>
      )}
    </div>
  );
};
