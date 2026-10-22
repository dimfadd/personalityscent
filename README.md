# Personality Scent

Web profiling yang menerjemahkan kepribadian, aroma favorit, dan kenangan aroma menjadi *Scent DNA* (keluarga aroma, accord, piramida notes), lalu mencocokkannya dengan parfum yang dijual. Konsep lengkap ada di [`docs/CONCEPT.md`](docs/CONCEPT.md).

## Fitur

- **Landing page**: simulasi profiling yang dianimasikan, rumus bobot terbuka, bagian sains (mana yang kuat dan mana yang lemah), contoh hasil, harga, dan FAQ.
- **Profiling 13 langkah**:
  - Mini-IPIP (20 item Big Five)
  - aroma yang disukai dan yang dihindari
  - 3 skenario
  - citra diri dan konteks
  - kenangan aroma (opsional, dibaca AI)
  - Draft tersimpan di browser, jadi user bisa melanjutkan nanti.
- **Hasil gratis**: keluarga aroma, narasi, piramida notes, 5 accord teratas, profil Big Five, link share, dan kartu IG Story (`/api/card/[id]`).
- **Rekomendasi berbayar**: Midtrans Snap. Status bayar hanya berubah lewat webhook yang signature-nya terverifikasi, atau lewat cek langsung ke API status Midtrans.
- **AI multi-provider**: Claude, GPT, Grok, Gemini. Provider dipilih di env atau di `/admin`. AI hanya membaca cerita user ke daftar accord tetap dan menulis narasi. AI tidak pernah mengarang data parfum. Kalau AI mati atau gagal, dipakai template.
- **Dua bahasa**: ID dan EN. Responsif untuk HP, tablet, dan desktop.
- **Admin `/admin`**: pilih provider dan model, uji koneksi, statistik, order terbaru.

## Menjalankan

```bash
cp .env.example .env.local   # isi key yang dibutuhkan
npm install
npm run dev                  # http://localhost:3000
```

- Tanpa `DATABASE_URL`, database memakai PGlite (Postgres embedded) di `./.data/`. Di production, isi `DATABASE_URL` dengan Postgres (misalnya Neon atau Supabase). Tabel dibuat otomatis.
- Tanpa key Midtrans, tombol bayar di mode development langsung membuka rekomendasi dan memberi label "mode demo". Di production, endpoint menolak dengan status 503.
- Set URL notifikasi Midtrans ke `https://<domain>/api/midtrans/notify`.

## Struktur

| Path | Isi |
|---|---|
| `src/data/accords.ts` | 18 accord standar |
| `src/data/notes.ts` | ±90 notes dengan accord dan posisinya |
| `src/data/questions.ts` | Mini-IPIP, kartu aroma, skenario, aspirasi, heuristik kepribadian ke accord |
| `src/data/perfumes.ts` | Database parfum awal |
| `src/lib/engine.ts` | Skoring, piramida, pencocokan (cosine similarity) |
| `src/lib/ai.ts` | Adapter 4 provider AI |
| `src/lib/midtrans.ts` | Snap, verifikasi signature, cek status |

## Yang perlu dikerjakan sebelum rilis

1. **Verifikasi database parfum.** 95 entri awal ditulis dari pengetahuan umum dan berstatus `verified: false`. Cek tiap entri ke halaman resmi brand, lalu tambahkan brand lokal dan parfum yang tersedia di Indonesia (target 200–400).
2. **Cek ID model AI default.** Untuk GPT, Grok, dan Gemini, nama model berubah cepat. Pastikan di env atau `/admin`, lalu tekan "Uji koneksi".
3. **Terjemahan Mini-IPIP** adalah terjemahan sendiri dan belum divalidasi psikometrik.
4. **Aset visual.** Belum ada logo final: wordmark saat ini teks ditambah motif piramida.
