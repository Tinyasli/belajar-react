// Tipe data untuk domain autentikasi.
// Dipisah dari komponen supaya bisa dipakai ulang oleh service, hook, dan halaman lain.

export interface LoginPayload {
  phoneNumber: string;
  pin: string;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  phoneNumber: string;
  accountType: "Sakuku" | "Sakuku Plus";
  balance: number;
}

export interface LoginResponse {
  token: string;
  user: AuthenticatedUser;
}

// Kode error dibuat eksplisit (bukan cuma string bebas) supaya UI bisa
// menampilkan pesan yang berbeda-beda tanpa harus membaca isi teksnya.
export type LoginErrorCode =
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_LOCKED"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

export class LoginError extends Error {
  code: LoginErrorCode;

  constructor(code: LoginErrorCode, message: string) {
    super(message);
    this.name = "LoginError";
    this.code = code;
  }
}
