import type { LoginErrorCode, LoginPayload, LoginResponse } from "../types/auth";
import { LoginError } from "../types/auth";

/**
 * ==========================================================================
 * AUTH SERVICE — sekarang beneran hit backend Express di sakuku-backend/
 * ==========================================================================
 * Base URL diambil dari environment variable VITE_API_URL (lihat file .env),
 * supaya gampang diganti kalau backend nanti dideploy ke alamat lain.
 * Bentuk fungsi `login` sengaja tidak berubah dari versi mock sebelumnya
 * (tetap menerima LoginPayload, tetap mengembalikan LoginResponse, tetap
 * melempar LoginError) — jadi LoginPage dan useLogin tidak perlu diubah.
 * ==========================================================================
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export const authService = {
  async login({ phoneNumber, pin }: LoginPayload): Promise<LoginResponse> {
    let res: Response;

    try {
      res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, pin }),
      });
    } catch {
      // fetch melempar error kalau server tidak bisa dihubungi sama sekali
      // (server mati, salah port, masalah CORS, dsb) — bukan error dari
      // logika login, jadi kita bedakan pesannya.
      throw new LoginError(
        "NETWORK_ERROR",
        "Tidak bisa terhubung ke server. Pastikan backend sudah jalan di " + API_BASE_URL
      );
    }

    const body = await res.json();

    if (!res.ok) {
      const code: LoginErrorCode = body.code ?? "UNKNOWN_ERROR";
      throw new LoginError(code, body.message ?? "Terjadi kesalahan saat login.");
    }

    return body as LoginResponse;
  },
};
