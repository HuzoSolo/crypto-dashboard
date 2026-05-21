"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authLogin, authRegister } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await authLogin(username, password);
      } else {
        await authRegister(username, password);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { value: "$142K+", label: "Ortalama portföy büyüklüğü" },
    { value: "8 sayfa", label: "Finans takibi için eksiksiz araç" },
    { value: "Gerçek zamanlı", label: "Binance & CoinGecko entegrasyonu" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "var(--bg)",
      }}
    >
      {/* Left side */}
      <div
        style={{
          background:
            "radial-gradient(60% 60% at 30% 30%, #16a34a44 0%, transparent 70%), radial-gradient(50% 50% at 80% 80%, #14b8a633 0%, transparent 70%), linear-gradient(180deg, #0a0d10 0%, #0c1410 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 40,
          color: "#fff",
          overflow: "hidden",
        }}
      >
        <div className="flex items-center gap-[10px] font-semibold">
          <div
            className="grid place-items-center rounded-[8px] text-white font-bold"
            style={{ width: 32, height: 32, background: "linear-gradient(135deg, #16a34a, #0a6e34)", boxShadow: "0 0 0 1px #ffffff14 inset", fontSize: 15 }}
          >
            ₿
          </div>
          <span style={{ fontSize: 16 }}>Cryptolio</span>
        </div>

        <div>
          <h1 style={{ fontSize: 38, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: 420, margin: 0 }}>
            Tüm portföyün,{" "}
            <span style={{ color: "#4ade80" }}>tek bir sade panelde.</span>
          </h1>
          <p style={{ color: "#ffffffaa", maxWidth: 380, marginTop: 14, fontSize: 15, lineHeight: 1.6 }}>
            Kripto varlıklarını, işlemlerini, hedeflerini ve vergilerini tek ekrandan yönet.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-[14px]">
              <div className="mono font-semibold" style={{ fontSize: 20, color: "#4ade80", minWidth: 100 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: "#ffffff88" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: "grid", placeItems: "center", padding: 40, background: "var(--bg)" }}>
        <div style={{ width: 360, maxWidth: "100%" }}>
          <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 6px", color: "var(--text)" }}>
            {mode === "login" ? "Giriş yap" : "Hesap oluştur"}
          </h1>
          <p style={{ color: "var(--text-mute)", marginBottom: 24, fontSize: 13 }}>
            {mode === "login" ? "Hesabına giriş yaparak portföyüne eriş." : "Yeni hesap oluşturarak başla."}
          </p>

          {error && (
            <div
              style={{
                marginBottom: 16,
                padding: "10px 14px",
                background: "color-mix(in srgb, var(--loss) 12%, transparent)",
                border: "1px solid color-mix(in srgb, var(--loss) 30%, transparent)",
                borderRadius: 8,
                color: "var(--loss)",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Kullanıcı adı" hint={mode === "register" ? "En az 3 karakter" : undefined}>
              <input
                type="text"
                placeholder="kullanici_adi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={32}
                autoComplete="username"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-color)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-soft)")}
              />
            </Field>

            <Field label="Şifre" hint={mode === "register" ? "En az 8 karakter" : undefined}>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === "register" ? 8 : 1}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-color)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-soft)")}
              />
            </Field>

            <button
              type="submit"
              disabled={loading || !username || !password || (mode === "register" && (username.length < 3 || password.length < 8))}
              style={{
                marginTop: 8,
                padding: "10px 14px",
                background: "var(--accent-color)",
                border: "1px solid var(--accent-color)",
                borderRadius: 8,
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: (loading || (mode === "register" && (username.length < 3 || password.length < 8))) ? 0.5 : 1,
                boxShadow: "0 4px 14px #16a34a30",
                fontFamily: "inherit",
              }}
            >
              {loading ? "Yükleniyor…" : mode === "login" ? "Giriş Yap" : "Hesap Oluştur"}
            </button>
          </form>

          <div style={{ marginTop: 16, textAlign: "center", fontSize: 13, color: "var(--text-mute)" }}>
            {mode === "login" ? "Hesabın yok mu?" : "Zaten hesabın var mı?"}{" "}
            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
              style={{ background: "none", border: "none", color: "var(--accent-color)", cursor: "pointer", fontSize: 13, padding: 0 }}
            >
              {mode === "login" ? "Kayıt ol" : "Giriş yap"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  background: "var(--bg-card)",
  border: "1px solid var(--border-soft)",
  borderRadius: 8,
  color: "var(--text)",
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div className="flex justify-between items-center">
        <label style={{ fontSize: 11, color: "var(--text-mute)", fontWeight: 500 }}>{label}</label>
        {hint && <span style={{ fontSize: 11, color: "var(--text-mute)" }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}
