-- Jalankan file ini di phpMyAdmin (tab SQL) setelah membuat database sakuku_db.
-- Ini akan membuat tabel `users` dan mengisi 2 akun demo yang sama seperti
-- versi sebelumnya, supaya kamu tidak perlu ubah apa pun di frontend.

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(15) NOT NULL UNIQUE,
  pin CHAR(6) NOT NULL,
  account_type ENUM('Sakuku', 'Sakuku Plus') NOT NULL DEFAULT 'Sakuku',
  balance BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, name, phone_number, pin, account_type, balance) VALUES
  ('usr-001', 'Bunga Citra', '081234567890', '123456', 'Sakuku Plus', 1250000),
  ('usr-002', 'Raka Pradana', '081298765432', '654321', 'Sakuku', 350000)
ON DUPLICATE KEY UPDATE name = VALUES(name);
