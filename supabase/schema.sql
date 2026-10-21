-- =============================================================================
-- Sinau Aksara Jawa — Leaderboard schema (Supabase / PostgreSQL)
-- Jalankan file ini di Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

create extension if not exists pgcrypto;

create table if not exists public.leaderboard_scores (
  id uuid primary key default gen_random_uuid(),
  player_name text not null
    check (char_length(btrim(player_name)) between 1 and 30),
  score integer not null
    check (score between 0 and 100),
  stars integer not null default 1
    check (stars between 1 and 3),
  correct_count integer not null default 0
    check (correct_count between 0 and 40),
  total_questions integer not null default 40
    check (total_questions between 1 and 100),
  level_reached integer not null default 1
    check (level_reached between 1 and 3),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists leaderboard_scores_rank_idx
  on public.leaderboard_scores (score desc, created_at asc);

-- ---------------------------------------------------------------------------
-- Row Level Security: publik boleh membaca & menambah skor, tetapi tidak
-- boleh mengubah atau menghapus skor yang sudah ada.
-- ---------------------------------------------------------------------------
alter table public.leaderboard_scores enable row level security;

drop policy if exists "Leaderboard read access" on public.leaderboard_scores;
create policy "Leaderboard read access"
  on public.leaderboard_scores
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Leaderboard insert access" on public.leaderboard_scores;
create policy "Leaderboard insert access"
  on public.leaderboard_scores
  for insert
  to anon, authenticated
  with check (
    char_length(btrim(player_name)) between 1 and 30
    and score between 0 and 100
    and stars between 1 and 3
    and correct_count between 0 and 40
    and total_questions between 1 and 100
    and level_reached between 1 and 3
  );

grant select, insert on public.leaderboard_scores to anon, authenticated;
revoke update, delete on public.leaderboard_scores from anon, authenticated;
