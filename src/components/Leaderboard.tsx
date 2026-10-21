import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  CalendarDays,
  Crown,
  Loader2,
  Medal,
  RefreshCw,
  Star,
  Trophy,
  Wifi,
  WifiOff
} from 'lucide-react';
import {
  fetchLeaderboard,
  getMyScoreId,
  isOnlineLeaderboardEnabled,
  leaderboardMode,
  LeaderboardPeriod,
  ScoreEntry
} from '../lib/leaderboard';
import { playClickSound } from '../utils/audio';

interface LeaderboardProps {
  onStartPlaying: () => void;
}

const PERIOD_OPTIONS: { value: LeaderboardPeriod; label: string }[] = [
  { value: 'all', label: 'Semua Waktu' },
  { value: 'month', label: 'Bulan Iki' },
  { value: 'week', label: 'Minggu Iki' }
];

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

const rankStyles: Record<number, string> = {
  1: 'bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 border-amber-500',
  2: 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800 border-slate-400',
  3: 'bg-gradient-to-br from-orange-300 to-orange-500 text-orange-950 border-orange-500'
};

const rowStyles: Record<number, string> = {
  1: 'border-amber-400/90 bg-gradient-to-r from-amber-50 via-white to-white shadow-sm',
  2: 'border-slate-300/80 bg-gradient-to-r from-slate-50 via-white to-white',
  3: 'border-orange-300/80 bg-gradient-to-r from-orange-50 via-white to-white'
};

export const Leaderboard: React.FC<LeaderboardProps> = ({ onStartPlaying }) => {
  const [period, setPeriod] = useState<LeaderboardPeriod>('all');
  const [entries, setEntries] = useState<ScoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [myScoreId, setMyScoreId] = useState<string | null>(() => getMyScoreId());

  const loadLeaderboard = useCallback(
    async (signal: AbortSignal) => {
      setIsLoading(true);
      setError('');

      try {
        const result = await fetchLeaderboard(period, signal);
        setEntries(result);
        setIsLoading(false);
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === 'AbortError') return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Papan peringkat gagal dimuat. Coba maneh.'
        );
        setEntries([]);
        setIsLoading(false);
      }
    },
    [period]
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadLeaderboard(controller.signal);
    return () => controller.abort();
  }, [loadLeaderboard, reloadToken]);

  useEffect(() => {
    setMyScoreId(getMyScoreId());
  }, [entries]);

  const handleRefresh = () => {
    playClickSound();
    setReloadToken(value => value + 1);
  };

  const handlePeriodChange = (nextPeriod: LeaderboardPeriod) => {
    if (nextPeriod === period) return;
    playClickSound();
    setPeriod(nextPeriod);
  };

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 text-white p-6 sm:p-8 shadow-lg shadow-amber-900/10">
        <div className="absolute right-0 top-0 translate-x-6 -translate-y-8 opacity-15 pointer-events-none select-none">
          <Trophy className="w-56 h-56" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-medium mb-3">
            <Crown className="w-3.5 h-3.5" /> Papan Peringkat Siswa
          </div>
          <h1 className="font-child text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Sapa Sing Paling Pinter?
          </h1>
          <p className="text-amber-50 text-sm sm:text-base leading-relaxed">
            Bandhingna skor paling dhuwur saka kanca-kanca sakelas. Mung 50 skor paling apik sing
            ditampilake.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 p-1.5 bg-amber-100/80 rounded-2xl border border-amber-200 overflow-x-auto scrollbar-none">
          {PERIOD_OPTIONS.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handlePeriodChange(option.value)}
              className={`shrink-0 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
                period === option.value
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-900 hover:bg-amber-200/50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold ${
              isOnlineLeaderboardEnabled
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border-amber-300 bg-amber-50 text-amber-800'
            }`}
          >
            {isOnlineLeaderboardEnabled ? (
              <>
                <Wifi className="w-3.5 h-3.5" /> Online
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" /> Mode Lokal
              </>
            )}
          </span>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-xs transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Anyarake
          </button>
        </div>
      </div>

      {!isOnlineLeaderboardEnabled && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-4 text-xs leading-relaxed text-amber-900">
          <p className="font-bold mb-1">Papan peringkat online belum diaktifkan</p>
          <p>
            Saiki skor mung disimpen ing piranti iki (localStorage). Kanggo nampilake skor kabeh
            siswa, setel <code className="rounded bg-white/80 px-1">VITE_SUPABASE_URL</code> lan{' '}
            <code className="rounded bg-white/80 px-1">VITE_SUPABASE_ANON_KEY</code>, banjur jalanake
            skrip <code className="rounded bg-white/80 px-1">supabase/schema.sql</code>.
          </p>
        </div>
      )}

      {/* Content */}
      <div className="rounded-3xl border-2 border-amber-200/90 bg-white p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="font-child text-lg font-bold text-amber-950 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            Top 50
          </h2>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
            {leaderboardMode === 'online' ? 'Supabase' : 'Piranti Iki'}
          </span>
        </div>

        {isLoading && (
          <div className="space-y-2" aria-live="polite" aria-busy="true">
            {[0, 1, 2, 3, 4].map(index => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-2xl border border-amber-100 bg-amber-50/60"
              />
            ))}
            <p className="flex items-center justify-center gap-2 pt-2 text-xs font-semibold text-amber-700">
              <Loader2 className="w-4 h-4 animate-spin" /> Ngemot papan peringkat...
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-center">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-rose-500" />
            <p className="text-sm font-bold text-rose-900">Papan peringkat gagal dimuat</p>
            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-rose-800">{error}</p>
            <button
              type="button"
              onClick={handleRefresh}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-rose-700"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Coba Maneh
            </button>
          </div>
        )}

        {!isLoading && !error && entries.length === 0 && (
          <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/50 px-4 py-10 text-center">
            <Medal className="mx-auto mb-3 h-10 w-10 text-amber-400" />
            <p className="text-sm font-bold text-amber-950">Durung ana skor ing periode iki</p>
            <p className="mx-auto mt-1 max-w-sm text-xs text-amber-800/80">
              Dadi sing pertama! Rampungna petualangan aksara banjur simpen skormu ing kene.
            </p>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onStartPlaying();
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-600/20 transition-transform hover:scale-102"
            >
              <Trophy className="w-4 h-4" /> Miwiti Petualangan
            </button>
          </div>
        )}

        {!isLoading && !error && entries.length > 0 && (
          <ol className="space-y-2">
            {entries.map((entry, index) => {
              const rank = index + 1;
              const isMine = myScoreId !== null && entry.id === myScoreId;

              return (
                <li
                  key={entry.id}
                  className={`flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5 sm:px-4 sm:py-3 transition-colors ${
                    rowStyles[rank] || 'border-amber-100 bg-white hover:bg-amber-50/40'
                  } ${isMine ? 'ring-2 ring-amber-500/70' : ''}`}
                >
                  <span
                    className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border-2 font-child text-sm font-bold ${
                      rankStyles[rank] || 'border-amber-200 bg-amber-50 text-amber-800'
                    }`}
                    aria-label={`Rangking ${rank}`}
                  >
                    {rank <= 3 ? <Medal className="h-5 w-5" /> : rank}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="truncate text-sm font-bold text-amber-950">
                        {entry.playerName}
                      </span>
                      {isMine && (
                        <span className="rounded-full bg-amber-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                          Kamu
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] sm:text-[11px] text-amber-700/80">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(entry.createdAt)}
                      </span>
                      <span aria-hidden="true">&middot;</span>
                      <span>
                        {entry.completed
                          ? 'Rampung 3 level'
                          : `Level ${entry.levelReached} saka 3`}
                      </span>
                      <span aria-hidden="true">&middot;</span>
                      <span>
                        {entry.correctCount}/{entry.totalQuestions} bener
                      </span>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-0.5" aria-label={`${entry.stars} bintang`}>
                    {[1, 2, 3].map(star => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= entry.stars
                            ? 'fill-amber-400 text-amber-500'
                            : 'fill-amber-100 text-amber-200'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="block font-child text-base sm:text-lg font-bold leading-tight text-amber-950">
                      {entry.score}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                      Poin
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <p className="text-center text-[11px] leading-relaxed text-amber-800/70">
        Skor diitung saka 40 jawaban bener (maksimal 100). Papan peringkat dianyari saben skor anyar
        dikirim.
      </p>
    </div>
  );
};
