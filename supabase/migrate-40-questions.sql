-- =============================================================================
-- Migrasi leaderboard: game 40 soal (20 aksara + 10 membaca + 10 menulis)
-- Jalankan sekali di Supabase Dashboard -> SQL Editor -> Run.
--
-- Skema lama membatasi correct_count maksimal 30. Tanpa migrasi ini, skor
-- dengan jawaban benar lebih dari 30 akan ditolak oleh database.
-- =============================================================================

-- Longgarkan batas jawaban benar dari 30 menjadi 40.
alter table public.leaderboard_scores
  drop constraint if exists leaderboard_scores_correct_count_check;

alter table public.leaderboard_scores
  add constraint leaderboard_scores_correct_count_check
  check (correct_count between 0 and 40);

-- Default total soal untuk baris baru adalah 40.
alter table public.leaderboard_scores
  alter column total_questions set default 40;

-- Policy insert juga harus mengizinkan correct_count sampai 40.
drop policy if exists "Leaderboard insert access" on public.leaderboard_scores;
create policy "Leaderboard insert access"
  on public.leaderboard_scores
  for insert
  to anon, authenticated
  with check (
    char_length(btrim(player_name)) between 1 and 30
    and score between 0 and 1000
    and stars between 1 and 3
    and correct_count between 0 and 40
    and total_questions between 1 and 100
    and level_reached between 1 and 3
  );
