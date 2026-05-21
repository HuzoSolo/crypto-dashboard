"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("emre@example.com");
  const [password, setPassword] = useState("••••••••");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
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
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #16a34a, #0a6e34)",
              boxShadow: "0 0 0 1px #ffffff14 inset",
              fontSize: 15,
            }}
          >
            ₿
          </div>
          <span style={{ fontSize: 16 }}>Cryptolio</span>
        </div>

        <div>
          <h1
            style={{
              fontSize: 38,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              maxWidth: 420,
              margin: 0,
            }}
          >
            Tüm portföyün,{" "}
            <span style={{ color: "#4ade80" }}>tek bir sade panelde.</span>
          </h1>
          <p
            style={{ color: "#ffffffaa", maxWidth: 380, marginTop: 14, fontSize: 15, lineHeight: 1.6 }}
          >
            Kripto varlıklarını, işlemlerini, hedeflerini ve vergilerini tek ekrandan yönet.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-[14px]">
              <div
                className="mono font-semibold"
                style={{ fontSize: 20, color: "#4ade80", minWidth: 100 }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: "#ffffff88" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side */}
      <div
        style={{
          display: "grid",
          placeItems: "center",
          padding: 40,
          background: "var(--bg)",
        }}
      >
        <div style={{ width: 360, maxWidth: "100%" }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              margin: "0 0 6px",
              color: "var(--text)",
            }}
          >
            Giriş yap
          </h1>
          <p style={{ color: "var(--text-mute)", marginBottom: 24, fontSize: 13 }}>
            Hesabına giriş yaparak portföyüne eriş.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: "var(--text-mute)", fontWeight: 500 }}>
                E-posta
              </label>
              <input
                type="text"
                placeholder="emre@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: "9px 12px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: 8,
                  color: "var(--text)",
                  fontSize: 13,
                  outline: "none",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-color)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-soft)")}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: "var(--text-mute)", fontWeight: 500 }}>
                Şifre
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: "9px 12px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: 8,
                  color: "var(--text)",
                  fontSize: 13,
                  outline: "none",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-color)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-soft)")}
              />
            </div>

            <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
              <label className="flex items-center gap-[8px]" style={{ fontSize: 13, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{ accentColor: "var(--accent-color)" }}
                />
                Beni hatırla
              </label>
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent-color)",
                  fontSize: 13,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Şifremi unuttum
              </button>
            </div>

            <button
              type="submit"
              style={{
                marginTop: 8,
                padding: "10px 14px",
                background: "var(--accent-color)",
                border: "1px solid var(--accent-color)",
                borderRadius: 8,
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 14px #16a34a30",
                fontFamily: "inherit",
                transition: "filter .15s ease",
              }}
              onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.filter = "brightness(1.1)")}
              onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.filter = "")}
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
