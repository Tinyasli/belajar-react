import type { AuthenticatedUser, LoginErrorBody } from "../types/auth";
import { pool } from "../db/pool";
import type { RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket {
  id: string;
  name: string;
  phone_number: string;
  pin: string;
  account_type: "Sakuku" | "Sakuku Plus";
  balance: number;
}

const failedAttemptsByPhone = new Map<string, number>();
const lockedPhones = new Set<string>();
const MAX_ATTEMPTS_BEFORE_LOCK = 3;

function generateFakeToken(userId: string): string {
  return `token.${userId}.${Math.random().toString(36).slice(2)}`;
}

export class ApiError extends Error {
  status: number;
  body: LoginErrorBody;

  constructor(status: number, body: LoginErrorBody) {
    super(body.message);
    this.status = status;
    this.body = body;
  }
}

export const authService = {
  async login(phoneNumber: string, pin: string) {
    if (lockedPhones.has(phoneNumber)) {
      throw new ApiError(423, {
        code: "ACCOUNT_LOCKED",
        message:
          "Akun ini terkunci karena PIN salah 3 kali berturut-turut. Hubungi Halo BCA di 1500888.",
      });
    }

    // Query ke MySQL (tabel `users`, lihat schema.sql).
    const [rows] = await pool.query<UserRow[]>(
      "SELECT id, name, phone_number, pin, account_type, balance FROM users WHERE phone_number = ? LIMIT 1",
      [phoneNumber]
    );
    const account = rows[0];

    if (!account || account.pin !== pin) {
      const attempts = (failedAttemptsByPhone.get(phoneNumber) ?? 0) + 1;
      failedAttemptsByPhone.set(phoneNumber, attempts);

      if (account && attempts >= MAX_ATTEMPTS_BEFORE_LOCK) {
        lockedPhones.add(phoneNumber);
        throw new ApiError(423, {
          code: "ACCOUNT_LOCKED",
          message: "PIN salah 3 kali. Akun dikunci sementara demi keamanan.",
        });
      }

      const sisa = account ? MAX_ATTEMPTS_BEFORE_LOCK - attempts : null;
      throw new ApiError(401, {
        code: "INVALID_CREDENTIALS",
        message: sisa
          ? `Nomor Sakuku atau PIN salah. Sisa percobaan: ${sisa}.`
          : "Nomor Sakuku atau PIN salah.",
      });
    }

    failedAttemptsByPhone.delete(phoneNumber);

    const user: AuthenticatedUser = {
      id: account.id,
      name: account.name,
      phoneNumber: account.phone_number,
      accountType: account.account_type,
      balance: Number(account.balance),
    };

    return {
      token: generateFakeToken(account.id),
      user,
    };
  },
};
