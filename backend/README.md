# Simulasi backend

Backend sederhana untuk login Sakuku. Menyediakan satu endpoint utama:
`POST /api/auth/login`. Data user disimpan di **MySQL**, dijalankan lewat
**XAMPP**.

## Setup database (XAMPP)

1. Buka **XAMPP Control Panel**, klik **Start** pada modul **Apache** dan **MySQL**.
2. Buka `http://localhost/phpmyadmin` di browser.
3. Klik tab **Databases**, buat database baru bernama `sakuku_db`.
4. Klik database `sakuku_db` yang baru dibuat → tab **SQL** → paste isi file
   `schema.sql` (ada di folder ini) → klik **Go**.
5. Pastikan tabel `users` sudah muncul dengan 2 baris data demo.

## Setup backend

```bash
cp .env.example .env
npm install
npm run dev
```

Default `.env.example` sudah cocok dengan setting default XAMPP (`user: root`,
`password: kosong`, `port: 3306`). Kalau kamu pernah mengubah password root
MySQL di phpMyAdmin, sesuaikan `DB_PASSWORD` di `.env`.

Server jalan di `http://localhost:4000`. Cek koneksi ke database dengan:

```bash
curl http://localhost:4000/api/health
```

Kalau responsnya `{"status":"ok","database":"connected"}`, artinya Node.js
sudah berhasil konek ke MySQL yang dijalankan XAMPP.

### Kalau muncul error "Access denied for user 'root'@'localhost'"

Ini bisa terjadi kalau MySQL kamu (bukan dari XAMPP, tapi versi lain yang
ter-install di OS) mengharuskan autentikasi lewat socket, bukan password.
Karena XAMPP biasanya sudah dikonfigurasi untuk menerima koneksi TCP dengan
user `root` tanpa password, error ini jarang muncul kalau MySQL yang dipakai
memang dari XAMPP. Kalau tetap muncul, buka phpMyAdmin → **User accounts** →
edit `root@localhost` → pastikan authentication plugin-nya `mysql_native_password`
dan password kosong (atau isi sesuai `.env`).

## Endpoint

### `POST /api/auth/login`

Body:
```json
{ "phoneNumber": "081234567890", "pin": "123456" }
```

Sukses (200):
```json
{
  "token": "token.usr-001.xxxxx",
  "user": { "id": "usr-001", "name": "Bunga Citra", "phoneNumber": "081234567890", "accountType": "Sakuku Plus", "balance": 1250000 }
}
```

Gagal — body & status berbeda tergantung kasus:
| Status | code | Kapan terjadi |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Format nomor HP / PIN tidak valid |
| 401 | `INVALID_CREDENTIALS` | Nomor HP atau PIN salah |
| 423 | `ACCOUNT_LOCKED` | PIN salah 3x berturut-turut |

## Struktur

```
src/
├─ server.ts               # entry point, setup Express + CORS + load .env
├─ db/pool.ts              # connection pool ke MySQL (mysql2)
├─ routes/auth.routes.ts   # validasi request + routing
├─ services/authService.ts # logika bisnis + query ke tabel `users`
└─ types/auth.ts           # tipe data request/response
schema.sql                 # skema tabel + data demo, import lewat phpMyAdmin
```

## Akun demo

| Nomor HP | PIN |
|---|---|
| 081234567890 | 123456 |
| 081298765432 | 654321 |

## Catatan keamanan (untuk didiskusikan, bukan wajib diperbaiki untuk tugas)

PIN disimpan sebagai teks biasa di tabel `users` supaya sederhana untuk
belajar. Di aplikasi produksi sungguhan, PIN/password wajib di-hash (misalnya
pakai `bcrypt`) sebelum disimpan, supaya tidak ada yang bisa dibaca langsung
walau database bocor. Ini poin bagus untuk disebut di laporan/presentasi
sebagai "pengembangan lebih lanjut".
