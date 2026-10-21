<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/5db393cc-7edc-4699-a62c-922bfb4b7b35

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Leaderboard (Supabase)

Fitur **Peringkat** menyimpan skor siswa ke Supabase (PostgreSQL) dan menampilkan 50 skor terbaik. Tanpa konfigurasi, aplikasi otomatis memakai mode lokal (`localStorage`) supaya tetap bisa dipakai.

### 1. Siapkan project Supabase

1. Buat project gratis di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, tempel isi [`supabase/schema.sql`](supabase/schema.sql), lalu **Run**.
   Skrip ini membuat tabel `leaderboard_scores`, index peringkat, dan policy RLS
   (publik boleh membaca & menambah skor, tidak boleh mengubah/menghapus).
   Jika tabel sudah dibuat untuk versi lama (30 soal), jalankan
   [`supabase/migrate-40-questions.sql`](supabase/migrate-40-questions.sql)
   satu kali agar skor dengan lebih dari 30 jawaban benar bisa tersimpan.

### 2. Hubungkan aplikasi

1. Di Supabase buka **Project Settings → API**, salin **Project URL** dan **anon public key**
   (atau **publishable key** `sb_publishable_...` pada project dengan API key model baru).
2. Buat file `.env.local` di root project:

   ```env
   VITE_SUPABASE_URL="https://xxxxxxxx.supabase.co"
   VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."
   ```

3. Jalankan ulang `npm run dev` (Vite membaca env saat start).
4. Untuk deploy, set kedua variabel tersebut di platform hosting lalu build ulang
   (`npm run build`) karena Vite menanamkan nilainya saat build.

### Catatan keamanan

- `VITE_SUPABASE_ANON_KEY` memang aman dipublikasikan; keamanan bergantung pada policy RLS.
- Siapa pun yang memiliki anon key dapat mengirim skor (termasuk skor palsu) karena belum ada autentikasi.
  Untuk produksi yang ketat, tambahkan Supabase Auth atau kirim skor melalui Edge Function yang memvalidasi sesi.
- Skor yang dikirim klien dibatasi di database: `score` 0–1000, `stars` 1–3, `level_reached` 1–3, nama 1–30 karakter.

