"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { RefreshCw, Plus, Pencil, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { Sparkline } from "@/components/crypto/sparkline";
import { Coin } from "@/components/crypto/coin";
import { Delta } from "@/components/crypto/delta";
import { WATCHLIST, COIN_COLORS, genSeries } from "@/lib/data";
import { fmtPrice } from "@/lib/fmt";

const CHANGE_SEEDS = [4.2, -1.8, 5.84, 2.1, -2.11, 3.44, -0.9, 1.23, -3.1, 2.77, 1.55];
const VOL_SEEDS = [12.4, 8.2, 18.1, 6.5, 9.3, 3.8, 14.7, 5.2, 7.6, 11.0, 4.4];

export default function WatchlistPage() {
  const prices = useStore((s) => s.prices);
  const prevPrices = useStore((s) => s.prevPrices);
  const [interval_, setInterval_] = useState("5s");
  const [source, setSource] = useState("binance");
  const [flashMap, setFlashMap] = useState<Record<string, string>>({});
  const prevRef = useRef<Record<string, number>>({});

  // Flash detection
  useEffect(() => {
    const next: Record<string, string> = {};
    for (const sym of WATCHLIST) {
      const p = prices[sym];
      const prev = prevRef.current[sym] ?? p;
      if (p > prev) next[sym] = "flash-up";
      else if (p < prev) next[sym] = "flash-dn";
    }
    prevRef.current = { ...prices };
    if (Object.keys(next).length) {
      setFlashMap(next);
      const t = setTimeout(() => setFlashMap({}), 900);
      return () => clearTimeout(t);
    }
  }, [prices]);

  const sparks = useMemo(() => {
    const out: Record<string, number[]> = {};
    WATCHLIST.forEach((s, i) => {
      out[s] = genSeries(i + 1, 28, prices[s] ?? 100, 0.025, i % 2 ? 0.0015 : -0.0008);
    });
    return out;
  }, []);

  return (
    <div className="animate-fadeIn" style={{ padding: "20px 24px 40px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="flex items-baseline gap-[12px] mb-[4px]">
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>Varlık Listesi</h1>
        <span style={{ color: "var(--text-mute)", fontSize: 13 }}>Canlı fiyat takibi · {WATCHLIST.length} sembol</span>
      </div>

      {/* Toolbar */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-soft)",
          borderRadius: 14,
          padding: 14,
        }}
      >
        <div className="flex items-center gap-[8px] flex-wrap">
          <span
            className="inline-flex items-center gap-[4px]"
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: 999,
              background: "var(--chip-bg)",
              color: "var(--gain)",
            }}
          >
            <span className="live-dot" />
            Live
          </span>
          <span style={{ fontSize: 11, color: "var(--text-mute)" }}>Yenileme:</span>
          {["2s", "5s", "15s", "60s"].map((i) => (
            <button
              key={i}
              onClick={() => setInterval_(i)}
              style={{
                fontSize: 11,
                padding: "5px 10px",
                borderRadius: 999,
                border: "1px solid",
                borderColor: interval_ === i ? "transparent" : "var(--border-soft)",
                background: interval_ === i ? "var(--accent-soft)" : "var(--bg-card)",
                color: interval_ === i ? "var(--accent-color)" : "var(--text-dim)",
                cursor: "pointer",
              }}
            >
              {i}
            </button>
          ))}
          <span style={{ fontSize: 11, color: "var(--text-mute)", marginLeft: 12 }}>Kaynak:</span>
          {["binance", "coingecko"].map((s) => (
            <button
              key={s}
              onClick={() => setSource(s)}
              style={{
                fontSize: 11,
                padding: "5px 10px",
                borderRadius: 999,
                border: "1px solid",
                borderColor: source === s ? "transparent" : "var(--border-soft)",
                background: source === s ? "var(--accent-soft)" : "var(--bg-card)",
                color: source === s ? "var(--accent-color)" : "var(--text-dim)",
                cursor: "pointer",
              }}
            >
              {s === "binance" ? "Binance" : "CoinGecko"}
            </button>
          ))}
          <span style={{ flex: 1 }} />
          <Btn icon={<RefreshCw size={13} />}>Yenile</Btn>
          <Btn icon={<Plus size={13} />} primary>Sembol Ekle</Btn>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-soft)",
          borderRadius: 14,
          padding: 0,
          overflow: "hidden",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {["Sembol", "Fiyat (USDT)", "24s Değişim", "30g Trend", "Hacim 24s", "Kaynak", ""].map((h, i) => (
                <th
                  key={i}
                  style={{
                    textAlign: [1, 2, 4].includes(i) ? "right" : "left",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--text-mute)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    padding: "10px 12px",
                    borderBottom: "1px solid var(--border-soft)",
                    background: "var(--bg-card-2)",
                    width: i === 6 ? 80 : undefined,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WATCHLIST.map((sym, i) => {
              const p = prices[sym] ?? 0;
              const change = CHANGE_SEEDS[i] ?? 0;
              const vol = VOL_SEEDS[i] ?? 0;
              const flash = flashMap[sym] ?? "";
              return (
                <tr
                  key={sym}
                  className={flash}
                  style={{ borderBottom: "1px solid var(--border-soft)", transition: "background .15s ease" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "")}
                >
                  <td style={{ padding: "12px" }}><Coin sym={sym} /></td>
                  <td className="mono" style={{ textAlign: "right", padding: "12px", fontWeight: 600 }}>
                    ${fmtPrice(p)}
                  </td>
                  <td style={{ textAlign: "right", padding: "12px" }}><Delta value={change} /></td>
                  <td style={{ padding: "12px", width: 120 }}>
                    <Sparkline data={sparks[sym]} color={change >= 0 ? "#22c55e" : "#f43f5e"} height={32} />
                  </td>
                  <td className="mono" style={{ textAlign: "right", padding: "12px", color: "var(--text-dim)" }}>
                    ${vol.toFixed(1)}B
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: 999,
                        background: "color-mix(in srgb, var(--info) 14%, transparent)",
                        color: "var(--info)",
                      }}
                    >
                      {source === "binance" ? "Binance" : "CoinGecko"}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div className="flex gap-[4px] justify-end">
                      <IconActionBtn title="Düzenle"><Pencil size={13} /></IconActionBtn>
                      <IconActionBtn title="Kaldır" danger><Trash2 size={13} /></IconActionBtn>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Btn({ children, icon, primary }: { children: React.ReactNode; icon?: React.ReactNode; primary?: boolean }) {
  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 14px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        border: "1px solid",
        borderColor: primary ? "var(--accent-color)" : "var(--border-color)",
        background: primary ? "var(--accent-color)" : "var(--bg-card)",
        color: primary ? "#fff" : "var(--text)",
        cursor: "pointer",
        fontFamily: "inherit",
        boxShadow: primary ? "0 4px 14px #16a34a30" : undefined,
      }}
    >
      {icon}{children}
    </button>
  );
}

function IconActionBtn({ children, title, danger }: { children: React.ReactNode; title: string; danger?: boolean }) {
  return (
    <button
      title={title}
      aria-label={title}
      style={{
        display: "grid",
        placeItems: "center",
        width: 28,
        height: 28,
        borderRadius: 6,
        border: "none",
        background: "transparent",
        color: danger ? "var(--loss)" : "var(--text-dim)",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}
