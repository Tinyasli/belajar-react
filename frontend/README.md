# SimulApp — Login Page (React + TypeScript)

Proyek frontend untuk halaman login Sakuku, dengan validasi form dan
pemanggilan **backend sungguhan** (lihat folder `sakuku-backend/` yang
terpisah) lewat `fetch()`.

## Cara menjalankan

Backend harus jalan duluan (lihat README di `sakuku-backend/`), baru
frontend:

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. Kalau muncul pesan "Tidak bisa terhubung ke
server", berarti backend-nya belum jalan di `http://localhost:4000` —
jalankan `npm run dev` di folder `sakuku-backend` dulu.

Alamat backend diatur lewat file `.env` (lihat `.env.example`):
```
VITE_API_URL=http://localhost:4000
```

Login dengan akun demo (data ini sekarang tersimpan di backend, bukan di
frontend lagi):

| Nomor HP       | PIN     |
|----------------|---------|
| 081234567890   | 123456  |
| 081298765432   | 654321  |

Masukkan kombinasi lain untuk melihat pesan error. Salah PIN 3 kali berturut-turut
pada satu nomor akan mensimulasikan akun terkunci.

## Struktur folder

```
src/
├─ types/auth.ts            # Tipe data (payload login, user, error) — kontrak API
├─ services/authService.ts  # Manggil backend via fetch() ke VITE_API_URL
├─ utils/validation.ts      # Fungsi validasi murni (nomor HP & PIN)
├─ hooks/useLogin.ts        # State management form + pemanggilan authService
├─ pages/LoginPage.tsx      # Tampilan halaman login
└─ pages/LoginPage.css
```

Struktur ini sengaja memisahkan "tampilan" (LoginPage) dari "logika" (useLogin)
dan "data/API" (authService), supaya:

- Gampang dijelaskan ke dosen: tiap file punya satu tanggung jawab.
- Kalau nanti backend asli sudah siap, cukup ubah isi `authService.ts` —
  komponen dan hook tidak perlu disentuh sama sekali.

## Validasi yang diterapkan

- **Nomor HP**: wajib diisi, hanya angka, harus diawali `08`, panjang 10–13 digit.
- **PIN**: wajib diisi, harus tepat 6 digit angka.
- Validasi jalan di sisi client sebelum request "dikirim" ke service, dan pesan
  error field ditampilkan per-input (bukan alert generik).

## Alur request ke backend (authService.ts)

- `authService.login()` memanggil `POST {VITE_API_URL}/api/auth/login` pakai
  `fetch()` native (tidak perlu library HTTP client tambahan).
- Kalau server tidak bisa dihubungi sama sekali (backend mati, salah port,
  masalah CORS) → dilempar `LoginError` dengan kode `NETWORK_ERROR`.
- Kalau server merespons tapi login gagal (kredensial salah, akun terkunci,
  dst) → kode error dan pesannya diambil langsung dari body JSON yang
  dikirim backend, bukan ditebak di sisi frontend.
- Error selalu dilempar sebagai instance class `LoginError` dengan `code`
  yang jelas, supaya UI bisa mengambil keputusan berdasarkan kode, bukan
  menebak dari teks pesan.

## Catatan

Desain, teks, dan alur di proyek ini dibuat ulang secara orisinal terinspirasi
dari konsep produk e-wallet Sakuku (nomor HP sebagai akun, PIN 6 digit), bukan
salinan piksel-demi-piksel dari situs bca.co.id.
