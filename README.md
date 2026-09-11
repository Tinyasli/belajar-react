# SimulAppFullstack (Belajar React + TS + Node.js)

Dua project terpisah yang jalan bareng:

```text
simulapp-fullstack/
├─ frontend/   → React + TypeScript + Vite (halaman login)
└─ backend/    → Node.js + Express + TypeScript (API login)
```

## Cara menjalankan (butuh: XAMPP + 2 terminal)

**0. Siapkan database via XAMPP:**

1. Buka XAMPP Control Panel → **Start** Apache dan MySQL.
2. Buka `http://localhost/phpmyadmin` → buat database `simulapp_db`.
3. Tab **SQL** → paste isi `backend/schema.sql` → **Go**.

**Terminal 1 — backend:**

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Tunggu sampai muncul:

```text
SimulApp backend jalan di http://localhost:4000
```

Cek koneksi database: buka `http://localhost:4000/api/health` di browser.

Harus muncul:

```json
{"status":"ok","database":"connected"}
```

**Terminal 2 — frontend:**

```bash
cd frontend
npm install
npm run dev
```

Buka:

```text
http://localhost:5173
```

Backend (dan MySQL-nya) harus dinyalakan duluan.

## Akun demo

| Nomor HP     | PIN    |
| ------------ | ------ |
| 081234567890 | 123456 |
| 081298765432 | 654321 |

## Kalau mau lihat request-nya beneran kekirim

Buka DevTools browser (**F12**) → tab **Network** → filter **Fetch/XHR** → coba login → klik request `login` yang muncul.

Di situ kelihatan request body-nya (nomor HP + PIN yang dikirim) dan response dari backend (token + data user, atau pesan error).

Ini bukti paling gampang untuk ditunjukkan ke dosen bahwa frontend beneran memanggil backend lewat HTTP, bukan cuma tampilan statis.

## Baca lebih detail

* `frontend/README.md` — struktur kode React, validasi, dan cara kerja `authService.ts`.
* `backend/README.md` — daftar endpoint, kode error, dan struktur kode Express.
