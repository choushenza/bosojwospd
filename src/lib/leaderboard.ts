// Leaderboard data layer.
// - Uses Supabase (PostgREST) when VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set.
// - Falls back to a local (per-device) leaderboard so the app keeps working before setup.

import { normalizePlayerName } from '../utils/player';

export type LeaderboardPeriod = 'all' | 'month' | 'week';

export interface ScoreEntry {
  id: string;
  playerName: string;
  score: number;
  stars: number;
  correctCount: number;
  totalQuestions: number;
  levelReached: number;
  completed: boolean;
  createdAt: string;
  source: 'online' | 'local';
}

export interface SubmitScoreInput {
  playerName: string;
  score: number;
  stars: number;
  correctCount: number;
  totalQuestions: number;
  levelReached: number;
  completed: boolean;
}

interface SupabaseScoreRow {
  id: string;
  player_name: string;
  score: number;
  stars: number;
  correct_count: number;
  total_questions: number;
  level_reached: number;
  completed: boolean;
  created_at: string;
}

export const LEADERBOARD_LIMIT = 50;

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/+$/, '');
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

const LOCAL_STORAGE_KEY = 'sinau-aksara:leaderboard:v1';
const MY_SCORE_ID_KEY = 'sinau-aksara:my-score-id';

export const isOnlineLeaderboardEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const leaderboardMode: 'online' | 'local' = isOnlineLeaderboardEnabled ? 'online' : 'local';

const TABLE = 'leaderboard_scores';
const SELECT_COLUMNS =
  'id,player_name,score,stars,correct_count,total_questions,level_reached,completed,created_at';

function mapRow(row: SupabaseScoreRow): ScoreEntry {
  return {
    id: row.id,
    playerName: row.player_name,
    score: row.score,
    stars: row.stars,
    correctCount: row.correct_count,
    totalQuestions: row.total_questions,
    levelReached: row.level_reached,
    completed: row.completed,
    createdAt: row.created_at,
    source: 'online'
  };
}

function periodStartIso(period: LeaderboardPeriod): string | null {
  if (period === 'all') return null;

  const now = new Date();
  if (period === 'month') {
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  }

  // Week starts on Monday.
  const start = new Date(now);
  const dayFromMonday = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - dayFromMonday);
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
}

function sortEntries(entries: ScoreEntry[]): ScoreEntry[] {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

function readLocalEntries(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((entry): entry is ScoreEntry => {
      if (!entry || typeof entry !== 'object') return false;
      const candidate = entry as Partial<ScoreEntry>;
      return (
        typeof candidate.id === 'string' &&
        typeof candidate.playerName === 'string' &&
        typeof candidate.score === 'number' &&
        typeof candidate.createdAt === 'string'
      );
    });
  } catch {
    return [];
  }
}

function writeLocalEntries(entries: ScoreEntry[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries.slice(0, 200)));
  } catch {
    // Storage can be unavailable (private mode / quota). The UI still receives the entry.
  }
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { message?: string; details?: string; hint?: string };
    const parts = [payload.message, payload.details, payload.hint].filter(Boolean);
    if (parts.length > 0) return parts.join(' — ');
  } catch {
    // Response body is not JSON.
  }

  try {
    const text = await response.text();
    if (text) return text;
  } catch {
    // Ignore.
  }

  return `Permintaan gagal (HTTP ${response.status}).`;
}

function supabaseHeaders(): Record<string, string> {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  };
}

function friendlyError(error: string): string {
  if (/relation .* does not exist|42P01/i.test(error)) {
    return 'Tabel "leaderboard_scores" belum ada di Supabase. Jalankan skrip supabase/schema.sql terlebih dahulu.';
  }
  if (/row-level security|42501/i.test(error)) {
    return 'Akses ditolak oleh aturan keamanan Supabase (RLS). Pastikan policy insert & select sudah dibuat dari supabase/schema.sql.';
  }
  if (/failed to fetch|networkerror|load failed/i.test(error)) {
    return 'Tidak bisa menghubungi Supabase. Periksa koneksi internet dan nilai VITE_SUPABASE_URL.';
  }
  return error;
}

export async function fetchLeaderboard(
  period: LeaderboardPeriod = 'all',
  signal?: AbortSignal
): Promise<ScoreEntry[]> {
  if (!isOnlineLeaderboardEnabled) {
    const start = periodStartIso(period);
    const entries = readLocalEntries().filter(
      entry => !start || new Date(entry.createdAt).getTime() >= new Date(start).getTime()
    );
    return sortEntries(entries).slice(0, LEADERBOARD_LIMIT);
  }

  const params = new URLSearchParams({
    select: SELECT_COLUMNS,
    order: 'score.desc,created_at.asc',
    limit: String(LEADERBOARD_LIMIT)
  });

  const start = periodStartIso(period);
  if (start) params.set('created_at', `gte.${start}`);

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?${params.toString()}`, {
    method: 'GET',
    headers: supabaseHeaders(),
    signal,
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(friendlyError(await readErrorMessage(response)));
  }

  const rows = (await response.json()) as SupabaseScoreRow[];
  return rows.map(mapRow);
}

export async function submitScore(input: SubmitScoreInput): Promise<ScoreEntry> {
  const playerName = normalizePlayerName(input.playerName);
  const score = Math.min(100, Math.max(0, Math.round(input.score)));
  const stars = Math.min(3, Math.max(1, Math.round(input.stars)));
  const correctCount = Math.max(0, Math.round(input.correctCount));
  const totalQuestions = Math.max(1, Math.round(input.totalQuestions));
  const levelReached = Math.min(3, Math.max(1, Math.round(input.levelReached)));

  if (!isOnlineLeaderboardEnabled) {
    const entry: ScoreEntry = {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      playerName,
      score,
      stars,
      correctCount,
      totalQuestions,
      levelReached,
      completed: input.completed,
      createdAt: new Date().toISOString(),
      source: 'local'
    };

    writeLocalEntries(sortEntries([entry, ...readLocalEntries()]));
    return entry;
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
    method: 'POST',
    headers: {
      ...supabaseHeaders(),
      Prefer: 'return=representation'
    },
    body: JSON.stringify([
      {
        player_name: playerName,
        score,
        stars,
        correct_count: correctCount,
        total_questions: totalQuestions,
        level_reached: levelReached,
        completed: input.completed
      }
    ])
  });

  if (!response.ok) {
    throw new Error(friendlyError(await readErrorMessage(response)));
  }

  const rows = (await response.json()) as SupabaseScoreRow[];
  const row = rows[0];
  if (!row) {
    throw new Error('Skor terkirim, tetapi server tidak mengembalikan data. Coba muat ulang papan peringkat.');
  }

  return mapRow(row);
}

export function setMyScoreId(id: string): void {
  try {
    localStorage.setItem(MY_SCORE_ID_KEY, id);
  } catch {
    // Ignore storage errors.
  }
}

export function getMyScoreId(): string | null {
  try {
    return localStorage.getItem(MY_SCORE_ID_KEY);
  } catch {
    return null;
  }
}
