export interface LoginRequestBody {
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

export interface LoginResponseBody {
  token: string;
  user: AuthenticatedUser;
}

export type LoginErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_LOCKED"
  | "UNKNOWN_ERROR";

export interface LoginErrorBody {
  code: LoginErrorCode;
  message: string;
}
