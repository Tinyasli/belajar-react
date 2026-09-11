import { useState, type FormEvent } from "react";
import { useLogin } from "../hooks/useLogin";
import "./LoginPage.css";

export default function LoginPage() {
  const {
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
  } = useLogin();

  const [showPin, setShowPin] = useState(false);
  const isLoading = status === "loading";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void submit();
  }

  if (status === "success" && user) {
    return (
      <div className="screen">
        <div className="card card--success">
          <div className="success-badge" aria-hidden="true">
            ✓
          </div>
          <h1>Selamat datang, {user.name.split(" ")[0]}</h1>
          <p className="muted">
            Kamu masuk sebagai <strong>{user.accountType}</strong>
          </p>
          <div className="balance-pill">
            <span>Saldo Sakuku</span>
            <strong>
              Rp{user.balance.toLocaleString("id-ID")}
            </strong>
          </div>
          <button type="button" className="btn btn--ghost" onClick={reset}>
            Keluar dan login ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="brand-panel">
        <div className="brand-mark">
          <span className="brand-mark__icon" aria-hidden="true">
            ⬡
          </span>
          Sakuku
        </div>
        <h2>Satu aplikasi, segala transaksi harian.</h2>
        <p>
          Bayar QRIS, isi pulsa, transfer, dan tarik tunai tanpa kartu — cukup
          dari satu nomor HP.
        </p>
        <ul className="brand-benefits">
          <li>Bebas biaya admin bulanan</li>
          <li>Aman dengan PIN 6 digit</li>
          <li>Bisa dipakai walau bukan nasabah BCA</li>
        </ul>
      </div>

      <div className="card">
        <h1>Masuk ke Sakuku</h1>
        <p className="muted">Gunakan nomor HP dan PIN akun Sakuku kamu.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label className="field" htmlFor="phoneNumber">
            <span className="field__label">Nomor Sakuku</span>
            <div className={`field__control ${fieldErrors.phoneNumber ? "field__control--invalid" : ""}`}>
              <span className="field__prefix">+62</span>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="81234567890"
                value={phoneNumber}
                disabled={isLoading}
                onChange={(e) => updatePhoneNumber(e.target.value)}
                aria-invalid={Boolean(fieldErrors.phoneNumber)}
                aria-describedby="phoneNumber-error"
              />
            </div>
            {fieldErrors.phoneNumber && (
              <span id="phoneNumber-error" className="field__error" role="alert">
                {fieldErrors.phoneNumber}
              </span>
            )}
          </label>

          <label className="field" htmlFor="pin">
            <span className="field__label">PIN Sakuku</span>
            <div className={`field__control ${fieldErrors.pin ? "field__control--invalid" : ""}`}>
              <input
                id="pin"
                name="pin"
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                autoComplete="current-password"
                placeholder="••••••"
                value={pin}
                disabled={isLoading}
                onChange={(e) => updatePin(e.target.value)}
                aria-invalid={Boolean(fieldErrors.pin)}
                aria-describedby="pin-error"
              />
              <button
                type="button"
                className="field__toggle"
                onClick={() => setShowPin((v) => !v)}
                tabIndex={-1}
              >
                {showPin ? "Sembunyikan" : "Lihat"}
              </button>
            </div>
            {fieldErrors.pin && (
              <span id="pin-error" className="field__error" role="alert">
                {fieldErrors.pin}
              </span>
            )}
          </label>

          {serverError && (
            <div className="server-error" role="alert">
              {serverError}
            </div>
          )}

          <button type="submit" className="btn btn--primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Memeriksa akun...
              </>
            ) : (
              "Masuk"
            )}
          </button>

          <button type="button" className="link-btn" disabled={isLoading}>
            Lupa PIN?
          </button>
        </form>

        <p className="hint">
          Coba akun demo: <code>081234567890</code> / PIN <code>123456</code>
        </p>
      </div>
    </div>
  );
}
