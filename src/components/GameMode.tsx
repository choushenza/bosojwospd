import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { BookOpen, Trophy, ArrowRight, ZoomIn, Gamepad2, X } from 'lucide-react';
import {
  GameLevel,
  QuizQuestion,
  generateAllQuestions,
  calculateScore,
  calculateStars,
  getQuestionOffset,
  TOTAL_QUESTIONS
} from '../game/quizEngine';
import {
  playCorrectSound,
  playWrongSound,
  playFanfareSound,
  playClickSound
} from '../utils/audio';
import { CertificateModal } from './CertificateModal';
import {
  getSavedPlayerName,
  normalizePlayerName,
  savePlayerName,
  MAX_PLAYER_NAME_LENGTH
} from '../utils/player';
import { setMyScoreId, submitScore } from '../lib/leaderboard';

interface GameModeProps {
  onOpenStudy: () => void;
}

type LeaderboardStatus = 'idle' | 'saving' | 'saved' | 'error';

export const GameMode: React.FC<GameModeProps> = ({ onOpenStudy }) => {
  const [questionsByLevel, setQuestionsByLevel] = useState<Record<GameLevel, QuizQuestion[]>>(() =>
    generateAllQuestions()
  );
  const [currentLevel, setCurrentLevel] = useState<GameLevel>(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswersTotal, setCorrectAnswersTotal] = useState(0);
  const [playerName, setPlayerName] = useState<string>(() => getSavedPlayerName());

  // Name gate before the quiz starts
  const [hasStarted, setHasStarted] = useState(false);
  const [draftName, setDraftName] = useState<string>(() => getSavedPlayerName());
  const [nameError, setNameError] = useState('');

  // Question interaction state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isShake, setIsShake] = useState(false);
  const [showAksaraZoom, setShowAksaraZoom] = useState(false);

  // Level transition, completion & leaderboard state
  const [showLevelClearedModal, setShowLevelClearedModal] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [leaderboardStatus, setLeaderboardStatus] = useState<LeaderboardStatus>('idle');
  const [leaderboardError, setLeaderboardError] = useState('');
  const autoSubmitRef = useRef(false);

  const currentQuestions = questionsByLevel[currentLevel] || [];
  const currentQuestion = currentQuestions[questionIndex];
  const questionNumber =
    getQuestionOffset(currentLevel) + questionIndex + 1;
  const stars = calculateStars(correctAnswersTotal, TOTAL_QUESTIONS);

  const aksaraLength = currentQuestion ? Array.from(currentQuestion.displayAksara).length : 0;
  const aksaraSizeClass =
    aksaraLength <= 3
      ? 'text-6xl sm:text-7xl'
      : aksaraLength <= 8
        ? 'text-4xl sm:text-5xl'
        : aksaraLength <= 16
          ? 'text-2xl sm:text-3xl'
          : 'text-xl sm:text-2xl';
  const aksaraLeadingClass = aksaraLength > 3 ? 'leading-[3.2]' : 'leading-normal';
  const isWritingQuestion = currentQuestion?.level === 3;
  const displayTextClass = isWritingQuestion
    ? 'font-child text-2xl sm:text-3xl leading-normal'
    : `font-jawa ${aksaraSizeClass} ${aksaraLeadingClass}`;

  // Trigger confetti burst
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6']
      });
    } catch {
      // fallback
    }
  };

  const grandConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }
  };

  // Restart entire game (keep the student's name)
  const handleRestart = () => {
    playClickSound();
    setQuestionsByLevel(generateAllQuestions());
    setCurrentLevel(1);
    setQuestionIndex(0);
    setScore(0);
    setCorrectAnswersTotal(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowLevelClearedModal(false);
    setShowCertificate(false);
    setLeaderboardStatus('idle');
    setLeaderboardError('');
    autoSubmitRef.current = false;
  };

  const handleStartGame = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedName = normalizePlayerName(draftName, '');
    if (!normalizedName) {
      setNameError('Tulis nama kamu dulu ya, supaya skor bisa masuk Peringkat.');
      return;
    }

    playClickSound();
    const savedName = savePlayerName(normalizedName);
    setPlayerName(savedName);
    setDraftName(savedName);
    setNameError('');
    setHasStarted(true);
  };

  const submitFinalScore = async () => {
    if (leaderboardStatus === 'saving') return;

    setLeaderboardStatus('saving');
    setLeaderboardError('');

    try {
      const entry = await submitScore({
        playerName,
        score,
        stars,
        correctCount: correctAnswersTotal,
        totalQuestions: TOTAL_QUESTIONS,
        levelReached: 3,
        completed: true
      });
      setMyScoreId(entry.id);
      setLeaderboardStatus('saved');
    } catch (error) {
      setLeaderboardStatus('error');
      setLeaderboardError(
        error instanceof Error
          ? error.message
          : 'Skor gagal dikirim. Periksa koneksi lalu coba lagi.'
      );
    }
  };

  // Automatically send the final score once the quiz is completed.
  useEffect(() => {
    if (!showCertificate || autoSubmitRef.current) return;
    autoSubmitRef.current = true;
    void submitFinalScore();
    // submitFinalScore intentionally reads the final score from this render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCertificate]);

  // Handle Option Click
  const handleSelectOption = (option: string) => {
    if (isAnswerSubmitted || !currentQuestion) return;

    playClickSound();
    setSelectedOption(option);
    setIsAnswerSubmitted(true);

    const isCorrect = option === currentQuestion.correctAnswer;

    if (isCorrect) {
      playCorrectSound();
      triggerConfetti();
      const nextCorrectTotal = correctAnswersTotal + 1;
      setScore(calculateScore(nextCorrectTotal, TOTAL_QUESTIONS));
      setCorrectAnswersTotal(nextCorrectTotal);
    } else {
      playWrongSound();
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
    }
  };

  // Advance to next question or level
  const handleNextQuestion = () => {
    playClickSound();
    setSelectedOption(null);
    setIsAnswerSubmitted(false);

    if (questionIndex + 1 < currentQuestions.length) {
      setQuestionIndex(prev => prev + 1);
    } else {
      // Level Cleared!
      if (currentLevel < 3) {
        playFanfareSound();
        grandConfetti();
        setShowLevelClearedModal(true);
      } else {
        // Entire Game Completed!
        playFanfareSound();
        grandConfetti();
        setShowCertificate(true);
      }
    }
  };

  // Proceed to next level after level cleared modal
  const handleProceedToNextLevel = () => {
    playClickSound();
    setShowLevelClearedModal(false);
    setCurrentLevel(prev => (prev + 1) as GameLevel);
    setQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
  };

  const getLevelName = (lvl: GameLevel) => {
    switch (lvl) {
      case 1:
        return 'Level 1: Tebak Aksara Dasar';
      case 2:
        return 'Level 2: Waca Tembung Aksara Jawa';
      case 3:
        return 'Level 3: Tulis Tembung Aksara Jawa';
    }
  };

  if (!hasStarted) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-3xl border-2 border-amber-200/90 p-6 sm:p-8 shadow-md text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white mx-auto flex items-center justify-center shadow-md shadow-amber-600/20">
            <Gamepad2 className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Sadurunge Mlebu Game
            </span>
            <h1 className="font-child text-2xl sm:text-3xl font-bold text-amber-950">
              Tulis Jenengmu Dhisik
            </h1>
            <p className="text-sm text-amber-900/80 font-medium max-w-sm mx-auto">
              Isi nama dulu ya. Setelah 40 soal selesai, skor akan otomatis masuk ke Peringkat.
            </p>
          </div>

          <form onSubmit={handleStartGame} className="space-y-3 text-left">
            <label className="block space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Nama Siswa
              </span>
              <input
                type="text"
                value={draftName}
                onChange={(event) => {
                  setDraftName(event.target.value);
                  if (nameError) setNameError('');
                }}
                maxLength={MAX_PLAYER_NAME_LENGTH}
                placeholder="Contoh: Alya Putri"
                autoFocus
                className="w-full rounded-xl border-2 border-amber-300 bg-amber-50/50 px-4 py-3 text-base font-bold text-amber-950 placeholder:font-normal placeholder:text-amber-400 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </label>

            {nameError && (
              <p className="text-xs font-semibold text-rose-700">{nameError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-md shadow-amber-600/30 flex items-center justify-center gap-2 transition-all hover:scale-102"
            >
              <span>Mulai Petualangan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <button
            onClick={() => {
              playClickSound();
              onOpenStudy();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Buka Kartu Belajar dulu</span>
          </button>

          <p className="text-[10px] text-amber-700/70 font-medium">
            Nama ini dipakai untuk papan peringkat dan bisa diubah sebelum mulai.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* HUD / Status Bar */}
      <div className="bg-white rounded-3xl border-2 border-amber-200/90 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Level badge + study shortcut */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            Petualangan Aksara
          </span>
          <h2 className="font-child text-lg sm:text-xl font-bold text-amber-950">
            {getLevelName(currentLevel)}
          </h2>
          <button
            onClick={() => {
              playClickSound();
              onOpenStudy();
            }}
            title="Buka kartu belajar. Progres game tetap tersimpan."
            className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-[11px] font-bold text-amber-900 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Buka Kartu Belajar</span>
          </button>
        </div>

        {/* Question progress & Score */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Soal 1-40 indicator (replaces nyawa/lives) */}
          <div
            className="flex items-center gap-2 bg-sky-50 px-3 py-1.5 rounded-2xl border border-sky-200"
            title={`Soal ${questionNumber} saka ${TOTAL_QUESTIONS}`}
            aria-label={`Soal ${questionNumber} saka ${TOTAL_QUESTIONS}`}
          >
            <div className="hidden sm:flex items-center gap-[2px]" aria-hidden="true">
              {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => {
                const n = i + 1;
                const isDone = n < questionNumber;
                const isCurrent = n === questionNumber;
                return (
                  <span
                    key={n}
                    className={`w-1 rounded-full transition-all duration-200 ${
                      isCurrent
                        ? 'h-4 bg-amber-600'
                        : isDone
                          ? 'h-2.5 bg-emerald-400'
                          : 'h-2 bg-sky-200'
                    }`}
                  />
                );
              })}
            </div>
            <div className="text-right leading-none">
              <span className="block text-[10px] uppercase font-bold text-sky-800">Soal</span>
              <span className="font-child font-bold text-amber-950 text-base sm:text-lg">
                {questionNumber}
                <span className="text-xs text-sky-700">/{TOTAL_QUESTIONS}</span>
              </span>
            </div>
          </div>

          {/* Score (maksimal 100) */}
          <div className="bg-amber-100/90 px-3.5 py-1.5 rounded-2xl border border-amber-300 text-right">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">Skor</span>
            <span className="font-child font-bold text-amber-950 text-base sm:text-lg">
              {score}
              <span className="text-[10px] text-amber-700">/100</span>
            </span>
          </div>
        </div>
      </div>

      {/* Overall progress: Soal 1-40 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-amber-900 px-1">
          <span>Soal {questionNumber} saka {TOTAL_QUESTIONS}</span>
          <span>Level {currentLevel}/3</span>
        </div>
        <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden p-0.5 border border-amber-200">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / TOTAL_QUESTIONS) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      {currentQuestion && (
        <div
          className={`bg-white rounded-3xl border-2 border-amber-200/90 p-6 sm:p-8 shadow-md transition-all ${
            isShake ? 'animate-shake border-rose-400 bg-rose-50/20' : ''
          }`}
        >
          {/* Question Prompt */}
          <div className="text-center space-y-2 mb-6">
            <h2 className="font-child text-lg sm:text-xl font-bold text-amber-950">
              {currentQuestion.promptText}
            </h2>
          </div>

          {/* Display Aksara Container */}
          <div className="my-6 flex flex-col items-center gap-2.5">
            <div className="relative w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-50 to-amber-100/80 border-2 border-amber-300/80 shadow-inner flex items-center justify-center min-h-[140px]">
              <span
                className={`${displayTextClass} font-bold text-amber-950 select-none tracking-wide text-center break-words max-w-full px-2`}
              >
                {currentQuestion.displayAksara}
              </span>
            </div>

            {/* Zoom button (no audio: audio could reveal the answer) */}
            <button
              onClick={() => {
                playClickSound();
                setShowAksaraZoom(true);
              }}
              title="Perbesar tulisan aksara"
              aria-label="Perbesar tulisan aksara"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-amber-300 text-amber-800 hover:bg-amber-600 hover:text-white text-xs font-bold transition-colors shadow-xs"
            >
              <ZoomIn className="w-4 h-4" />
              <span>Zoom Tulisan</span>
            </button>
          </div>

          {/* Multiple Choice Options Grid (4 Options) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-6">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrectAnswer = opt === currentQuestion.correctAnswer;
              const isAksaraOption = /[\uA980-\uA9DF]/.test(opt);

              let btnStyle = 'bg-amber-50/60 hover:bg-amber-100/80 border-amber-200 text-amber-950';

              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400 font-bold';
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = 'bg-rose-100 border-rose-500 text-rose-950 ring-2 ring-rose-400';
                } else {
                  btnStyle = 'opacity-50 bg-slate-50 border-slate-200 text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswerSubmitted}
                  className={`p-4 rounded-2xl border-2 text-base font-semibold transition-all flex items-center justify-between gap-3 text-left shadow-xs ${btnStyle}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-white/80 border border-amber-300 flex items-center justify-center text-xs font-bold text-amber-900">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span
                      className={
                        isAksaraOption
                          ? 'font-jawa text-2xl sm:text-3xl leading-[1.7] font-semibold'
                          : 'text-sm sm:text-base font-medium'
                      }
                    >
                      {opt}
                    </span>
                  </span>
                  {isAnswerSubmitted && isCorrectAnswer && (
                    <span className="text-xs font-bold text-emerald-700 bg-white/90 px-2 py-0.5 rounded-md">
                      Bener!
                    </span>
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                    <span className="text-xs font-bold text-rose-700 bg-white/90 px-2 py-0.5 rounded-md">
                      Kurang Trep
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation Box */}
          {isAnswerSubmitted && (
            <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-2 animate-in fade-in">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Katrangan / Penjelasan:
                  </h3>
                  <p className="text-sm font-medium text-amber-950 mt-1">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>

              {/* Next Question Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-amber-600/20 transition-all hover:scale-102"
                >
                  <span>Lanjut Soal Sabanjure</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Zoomed Aksara Modal */}
      {showAksaraZoom && currentQuestion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Tulisan aksara diperbesar"
          onClick={() => setShowAksaraZoom(false)}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-3xl border-2 border-amber-300 p-4 sm:p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-child text-base sm:text-lg font-bold text-amber-950">
                Tulisan Diperbesar
              </h3>
              <button
                onClick={() => setShowAksaraZoom(false)}
                aria-label="Tutup zoom tulisan"
                className="p-2 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 max-h-[65vh] overflow-auto rounded-2xl bg-amber-50 border-2 border-amber-200 p-5 sm:p-8 flex items-center justify-center">
              <p
                className={
                  isWritingQuestion
                    ? 'font-child text-3xl sm:text-5xl font-bold text-amber-950 text-center leading-normal break-words'
                    : 'font-jawa text-4xl sm:text-6xl font-bold text-amber-950 text-center leading-[3.2] break-words'
                }
              >
                {currentQuestion.displayAksara}
              </p>
            </div>

            <p className="mt-3 text-[11px] text-amber-800/80 text-center font-medium">
              Gunakan tombol ini jika aksara terlihat terlalu kecil. Tutup untuk kembali ke soal.
            </p>
          </div>
        </div>
      )}

      {/* Level Cleared Modal */}
      {showLevelClearedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl border-2 border-amber-300 p-6 sm:p-7 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-300">
              <Trophy className="w-9 h-9" />
            </div>

            <h2 className="font-child text-2xl font-bold text-amber-950">
              Hebat Banget!
            </h2>
            <p className="text-sm text-amber-900 font-medium">
              Sampeyan wis ngrampungake <strong>{getLevelName(currentLevel)}</strong> kanthi becik!
            </p>

            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-sm">
              <span className="text-amber-700 block text-xs">Skor Saiki:</span>
              <span className="font-bold text-amber-950 text-xl">
                {score}
                <span className="text-xs text-amber-700"> / 100</span> Poin
              </span>
            </div>

            <button
              onClick={handleProceedToNextLevel}
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-102"
            >
              <span>Lanjut menyang Level {currentLevel + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Certificate Modal on Game Completion */}
      {showCertificate && (
        <CertificateModal
          score={score}
          stars={stars}
          correctCount={correctAnswersTotal}
          totalQuestions={TOTAL_QUESTIONS}
          playerName={playerName}
          leaderboardStatus={leaderboardStatus}
          leaderboardError={leaderboardError}
          onRetrySubmit={() => {
            void submitFinalScore();
          }}
          onRestart={handleRestart}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};
