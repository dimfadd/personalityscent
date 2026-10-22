# Personality Scent — Konsep Produk

Dokumen acuan sebelum dan selama pembangunan. Semua keputusan desain di kode harus bisa ditelusuri ke sini.

## 1. Positioning

**Apa ini:** web profiling yang menerjemahkan kepribadian, kenangan aroma, dan citra diri seseorang menjadi *Scent DNA* (keluarga aroma, accord, piramida notes), lalu mencocokkannya dengan parfum yang benar-benar dijual.

**Apa ini bukan:** tes psikologi klinis atau klaim ilmiah bahwa kepribadian menentukan parfum. Copy di web memakai istilah *"interpretasi berbasis psikologi"*.

### Dasar ilmiah yang dipakai (dan batasnya)

| Klaim | Status | Dipakai sebagai |
|---|---|---|
| Aroma memicu memori emosional (Herz & Schooler 2002) | Kuat | Pertanyaan "kenangan aroma" |
| Korespondensi lintas indra: aroma ↔ warna/bentuk/kata (Spence) | Kuat | Pemetaan sifat → karakter accord |
| Preferensi bau terutama individual, sedikit budaya (Arshamian dkk. 2022) | Kuat | Riwayat bau jadi bobot terbesar |
| Persepsi bau berbeda secara genetik (OR7D4, anosmia musk) | Kuat | Disclaimer di hasil |
| Kepribadian → preferensi parfum (Mensing & Beck 1988) | Lemah | Bobot kecil, terutama untuk narasi |
| Aromakologi (lavender menenangkan, dst.) | Lemah / efek ekspektasi | Tidak dipakai sebagai klaim |

## 2. Alur pengguna

```
Landing → Profiling (± 4 menit) → Hasil gratis (Scent DNA) → [Bayar] → Rekomendasi parfum
                                        ↓
                                Kartu hasil untuk dibagikan
```

### Kenapa profiling tidak berbasis chat penuh

- Skor kepribadian harus dari instrumen yang sama untuk semua user, kalau tidak hasilnya tidak bisa dibandingkan.
- Chat bebas lambat di HP dan banyak user berhenti di tengah.
- Kartu pilihan visual lebih cepat dan lebih enak dianimasikan.

**Keputusan: hibrida.** Sebagian besar langkah memakai kartu pilihan yang diskor deterministik. Ada satu langkah cerita bebas ("ceritakan aroma yang membawa kenangan") yang dibaca AI, lalu diterjemahkan ke penyesuaian accord dengan format terstruktur.

### Langkah profiling

1. **Kepribadian:** Mini-IPIP, 20 item Likert 5 poin (domain publik, Donnellan dkk. 2006), ditampilkan 4 item per layar.
2. **Aroma yang disukai:** pilih 3–8 dari kartu aroma sehari-hari (kopi, hujan, melati, pandan, cucian bersih, dst.).
3. **Aroma yang dihindari:** pilih 0–5.
4. **Dunia kecilmu:** 3 pertanyaan skenario (tempat, waktu, suasana).
5. **Citra yang ingin dipancarkan:** pilih 2 kata.
6. **Konteks:** kapan dipakai, intensitas, ekspresi (feminin / maskulin / bebas), anggaran.
7. **Kenangan aroma (opsional, AI):** teks bebas.

## 3. Mesin pemetaan

Semua parfum dan semua user dinilai di **18 accord standar** (lihat `src/data/accords.ts`), skor 0–100.

```
vektor_user = 0.45 × aroma disukai
            + 0.15 × skenario
            + 0.15 × citra yang diinginkan
            + 0.15 × kepribadian (heuristik lintas indra)
            + 0.10 × kenangan (AI, bila ada)
            − penalti aroma yang dihindari
```

- **Piramida notes:** diambil dari database notes. Tiap note punya accord dan posisi (atas/tengah/dasar). Note yang dipilih adalah yang paling mendukung accord teratas user, tanpa note dari accord yang dihindari.
- **Pencocokan produk:** cosine similarity antara vektor user dan vektor accord parfum, dikurangi penalti untuk accord yang dihindari, lalu difilter berdasarkan ekspresi dan intensitas. Hasilnya dikelompokkan per tingkat harga.
- **AI tidak pernah mengarang data parfum.** AI hanya (a) membaca cerita bebas dan mengembalikan id accord dari daftar tetap, dan (b) menulis narasi hasil dari data yang sudah dihitung. Kalau AI tidak dikonfigurasi atau gagal, dipakai template narasi.

## 4. Monetisasi

- **Gratis:** Scent DNA lengkap (keluarga aroma, accord, piramida notes, profil kepribadian, kartu share).
- **Berbayar (Midtrans Snap):** daftar parfum yang cocok beserta persentase kecocokan, alasannya, dan pilihan per tingkat harga. Harga diatur lewat `UNLOCK_PRICE_IDR`.
- Status bayar hanya diubah oleh webhook Midtrans yang sudah diverifikasi signature-nya, bukan oleh redirect di browser.

## 5. Data parfum

- `src/data/perfumes.ts` adalah data awal hasil kurasi. **Semua entri berstatus `verified: false`** sampai dicek manual ke halaman resmi brand.
- Tidak melakukan scraping Fragrantica (melanggar ToS).
- Target: 200–400 parfum yang tersedia di Indonesia, merata di semua accord dan tingkat harga, termasuk brand lokal.

## 6. AI multi-provider

- Provider: Claude, OpenAI (GPT), xAI (Grok), Google (Gemini).
- API key hanya disimpan di env. Pilihan provider dan model bisa diganti di `/admin`, disimpan di database, dan menimpa default env.

## 7. Desain

- Nuansa premium: gelap hangat (hitam arang, cokelat tembakau) dengan aksen champagne/amber. Tipografi serif untuk judul, sans untuk teks.
- Responsif: HP lebih dulu, lalu tablet dan desktop.
- Animasi dipakai di tiga tempat utama: hero landing (simulasi profiling), transisi antar langkah, dan *reveal* hasil. Mematuhi `prefers-reduced-motion`.
- Dua bahasa: Indonesia dan Inggris, dengan switcher di header.

## 8. Validasi (setelah rilis)

- Setelah mencoba parfum rekomendasi, user memberi rating 1–5.
- Akurasi dibandingkan dengan dua pembanding: rekomendasi acak, dan rekomendasi dari aroma yang disukai saja.
- Uji Barnum: tampilkan hasil milik sendiri dan hasil milik orang lain, lalu ukur apakah user bisa membedakannya.
