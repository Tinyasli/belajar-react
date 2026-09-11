import { useState } from "react";
import { authService } from "../services/authService";
import { LoginError, type AuthenticatedUser } from "../types/auth";
import { validatePhoneNumber, validatePin } from "../utils/validation";

type Status = "idle" | "loading" | "success" | "error";

interface FieldErrors {
  phoneNumber?: string;
  pin?: string;
}

export function useLogin() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  function updatePhoneNumber(value: string) {
    // Hanya izinkan digit, maksimal 13 karakter, biar input rapi dari awal.
    const digitsOnly = value.replace(/\D/g, "").slice(0, 13);
    setPhoneNumber(digitsOnly);
    if (fieldErrors.phoneNumber) {
      setFieldErrors((prev) => ({ ...prev, phoneNumber: undefined }));
    }
  }

  function updatePin(value: string) {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
    setPin(digitsOnly);
    if (fieldErrors.pin) {
      setFieldErrors((prev) => ({ ...prev, pin: undefined }));
    }
  }

  function runValidation(): boolean {
    const errors: FieldErrors = {
      phoneNumber: validatePhoneNumber(phoneNumber) ?? undefined,
      pin: validatePin(pin) ?? undefined,
    };
    setFieldErrors(errors);
    return !errors.phoneNumber && !errors.pin;
  }

  async function submit() {
    setServerError(null);

    const isValid = runValidation();
    if (!isValid) {
      return;
    }

    setStatus("loading");
    try {
      const response = await authService.login({ phoneNumber, pin });
      setUser(response.user);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      if (err instanceof LoginError) {
        setServerError(err.message);
      } else {
        setServerError("Terjadi kesalahan tak terduga. Coba lagi beberapa saat lagi.");
      }
    }
  }

  function reset() {
    setPhoneNumber("");
    setPin("");
    setFieldErrors({});
    setStatus("idle");
    setServerError(null);
    setUser(null);
  }

  return {
    phoneNumber,
    pin,
    fieldErrors,
    status,
    serverError,
    user,
    updatePhoneNumber,
    updatePin,
    submit,
    reset,
  };
}
