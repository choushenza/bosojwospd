import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, Save, WifiOff } from 'lucide-react';
import { isOnlineLeaderboardEnabled, setMyScoreId, submitScore } from '../lib/leaderboard';
import { MAX_PLAYER_NAME_LENGTH, normalizePlayerName } from '../utils/player';
import { playClickSound } from '../utils/audio';

interface ScoreSubmitPanelProps {
  score: number;
  stars: number;
  correctCount: number;
  totalQuestions: number;
  levelReached: number;
  completed: boolean;
  playerName: string;
  onPlayerNameChange: (name: string) => void;
}

type SubmitStatus = 'idle' | 'saving' | 'saved' | 'error';

export const ScoreSubmitPanel: React.FC<ScoreSubmitPanelProps> = ({
  score,
  stars,
  correctCount,
  totalQuestions,
  levelReached,
  completed,
  playerName,
  onPlayerNameChange
}) => {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === 'saving' || status === 'saved') return;

    playClickSound();
    setStatus('saving');
    setErrorMessage('');

    const normalizedName = normalizePlayerName(playerName);
    if (normalizedName !== playerName) {
      onPlayerNameChange(normalizedName);
    }

    try {
      const entry = await submitScore({
        playerName: normalizedName,
        score,
        stars,
        correctCount,
        totalQuestions,
        levelReached,
        completed
      });
      setMyScoreId(entry.id);
      setStatus('saved');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Skor gagal disimpan. Coba lagi beberapa saat lagi.'
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border-2 border-amber-300/80 bg-amber-50/70 p-4 text-left space-y-3"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
          <Save className="w-3.5 h-3.5" />
          Simpan Skor
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            isOnlineLeaderboardEnabled
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}
        >
          {isOnlineLeaderboardEnabled ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" /> Lokal
            </>
          )}
        </span>
      </div>

      <p className="text-xs text-amber-900/90">
        {completed
          ? 'Petualangan rampung! Kirim skor supaya katon ing papan peringkat.'
          : 'Kirim skor paling anyar supaya bisa dibandhingake karo siswa liyane.'}
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <label className="flex-1">
          <span className="sr-only">Nama siswa</span>
          <input
            type="text"
            value={playerName}
            onChange={(event) => onPlayerNameChange(event.target.value)}
            maxLength={MAX_PLAYER_NAME_LENGTH}
            placeholder="Tulis jenengmu..."
            disabled={status === 'saving' || status === 'saved'}
            className="w-full rounded-xl border-2 border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-amber-950 placeholder:font-normal placeholder:text-amber-400 focus:border-amber-500 focus:outline-none disabled:bg-amber-100/60 disabled:text-amber-700"
          />
        </label>

        <button
          type="submit"
          disabled={status === 'saving' || status === 'saved'}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-2 text-sm font-bold text-white shadow-md shadow-amber-600/20 transition-all hover:scale-102 hover:from-amber-700 hover:to-amber-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
        >
          {status === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
          {status === 'saved' && <CheckCircle2 className="w-4 h-4" />}
          {status === 'idle' && <Save className="w-4 h-4" />}
          {status === 'error' && <Save className="w-4 h-4" />}
          <span>
            {status === 'saving'
              ? 'Mengirim...'
              : status === 'saved'
                ? 'Tersimpan'
                : status === 'error'
                  ? 'Coba Lagi'
                  : 'Kirim Skor'}
          </span>
        </button>
      </div>

      {!isOnlineLeaderboardEnabled && status !== 'saved' && (
        <p className="text-[11px] leading-relaxed text-amber-800/80">
          Mode lokal aktif: skor disimpan di perangkat ini. Isi <code>VITE_SUPABASE_URL</code> dan{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> untuk mengaktifkan papan peringkat online.
        </p>
      )}

      {status === 'saved' && (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="w-4 h-4" />
          Skor wis kasimpen! Bukak tab “Peringkat” kanggo ndeleng rangking.
        </p>
      )}

      {status === 'error' && (
        <p className="flex items-start gap-1.5 text-xs font-medium text-rose-700">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {errorMessage}
        </p>
      )}
    </form>
  );
};
