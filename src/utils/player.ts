export const DEFAULT_PLAYER_NAME = 'Siswa Hebat Kelas 5 SD';
export const MAX_PLAYER_NAME_LENGTH = 30;

const PLAYER_NAME_KEY = 'sinau-aksara:player-name';

export function normalizePlayerName(name: string, fallback = DEFAULT_PLAYER_NAME): string {
  const cleaned = (name || '').replace(/\s+/g, ' ').trim().slice(0, MAX_PLAYER_NAME_LENGTH);
  return cleaned || fallback;
}

export function getPlayerName(): string {
  try {
    const stored = localStorage.getItem(PLAYER_NAME_KEY);
    return stored ? normalizePlayerName(stored) : DEFAULT_PLAYER_NAME;
  } catch {
    return DEFAULT_PLAYER_NAME;
  }
}

// Returns an empty string when the student has not entered a name yet.
export function getSavedPlayerName(): string {
  try {
    const stored = localStorage.getItem(PLAYER_NAME_KEY);
    return stored ? normalizePlayerName(stored, '') : '';
  } catch {
    return '';
  }
}

export function savePlayerName(name: string): string {
  const normalized = normalizePlayerName(name);
  try {
    localStorage.setItem(PLAYER_NAME_KEY, normalized);
  } catch {
    // Storage can be unavailable; the name still lives in component state.
  }
  return normalized;
}
