const PHONE_REGEX = /^08[0-9]{8,11}$/; // contoh valid: 081234567890
const PIN_REGEX = /^[0-9]{6}$/;

export function validatePhoneNumber(value: string): string | null {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return "Nomor Sakuku wajib diisi.";
  }
  if (!/^[0-9]+$/.test(trimmed)) {
    return "Nomor Sakuku hanya boleh berisi angka.";
  }
  if (!PHONE_REGEX.test(trimmed)) {
    return "Masukkan nomor HP yang valid, contoh: 081234567890.";
  }
  return null;
}

export function validatePin(value: string): string | null {
  if (value.length === 0) {
    return "PIN wajib diisi.";
  }
  if (!PIN_REGEX.test(value)) {
    return "PIN harus terdiri dari 6 digit angka.";
  }
  return null;
}
