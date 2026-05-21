"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { RefreshCw, Plus, Pencil, Trash2, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { Sparkline } from "@/components/crypto/sparkline";
import { Coin } from "@/components/crypto/coin";
import { Delta } from "@/components/crypto/delta";
import { COIN_COLORS, genSeries } from "@/lib/data";
import { fmtPrice } from "@/lib/fmt";

const CHANGE_SEEDS = [4.2, -1.8, 5.84, 2.1, -2.11, 3.44, -0.9, 1.23, -3.1, 2.77, 1.55];
const VOL_SEEDS = [12.4, 8.2, 18.1, 6.5, 9.3, 3.8, 14.7, 5.2, 7.6, 11.0, 4.4];

export default function WatchlistPage() {
  const prices = useStore((s) => s.prices);
  const prevPrices = useStore((s) => s.prevPrices);
  const watchlistItems = useStore((s) => s.watchlistItems);
  const watchlistLoading = useStore((s) => s.watchlistLoading);
  const addWatchlistItem = useStore((s) => s.addWatchlistItem);
  const removeWatchlistItem = useStore((s) => s.removeWatchlistItem);
  const fetchPricesForSymbols = useStore((s) => s.fetchPricesForSymbols);

  const symbols = watchlistItems.map((i) => i.symbol);
  const [interval_, setInterval_] = useState("15s");
  const [showAdd, setShowAdd] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [flashMap, setFlashMap] = useState<Record<string, string>>({});
  const prevRef = useRef<Record<string, number>>({});

  // Flash detection
  useEffect(() => {
    const next: Record<string, string> = {};
    for (const sym of symbols) {
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

  // Interval değişince yenileme hızını güncelle
  useEffect(() => {
    if (symbols.length === 0) return;
    const ms = parseInt(interval_) * 1000;
    const id = setInterval(() => fetchPricesForSymbols(symbols), ms);
    return () => clearInterval(id);
  }, [interval_, symbols.join(",")]);

  const sparks = useMemo(() => {
    const out: Record<string, number[]> = {};
    symbols.forEach((s, i) => {
      out[s] = genSeries(i + 1, 28, prices[s] ?? 100, 0.025, i % 2 ? 0.0015 : -0.0008);
    });
    return out;
  }, [symbols.join(",")]);

  const handleAddSymbol = async () => {
    if (!newSymbol.trim()) return;
    setAddLoading(true);
    try {
      await addWatchlistItem(newSymbol.trim().toUpperCase());
      setNewSymbol("");
      setShowAdd(false);
    } catch {
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn" style={{ padding: "20px 24px 40px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="flex items-baseline gap-[12px] mb-[4px]">
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>Varlık Listesi</h1>
        <span style={{ color: "var(--text-mute)", fontSize: 13 }}>
          {watchlistLoading ? "Yükleniyor…" : `Canlı fiyat takibi · ${symbols.length} sembol`}
        </span>
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
          <span style={{ fontSize: 11, color: "var(--text-mute)", marginLeft: 12 }}>Kaynak: Binance</span>
          <span style={{ flex: 1 }} />
          <Btn icon={<RefreshCw size={13} />} onClick={() => fetchPricesForSymbols(symbols)}>Yenile</Btn>
          <Btn icon={<Plus size={13} />} primary onClick={() => setShowAdd(true)}>Sembol Ekle</Btn>
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
            {watchlistItems.length === 0 && !watchlistLoading && (
              <tr>
                <td colSpan={7} style={{ padding: 32, textAlign: "center", color: "var(--text-mute)", fontSize: 13 }}>
                  Henüz sembol eklenmedi. "Sembol Ekle" butonuna tıklayın.
                </td>
              </tr>
            )}
            {watchlistItems.map((item, i) => {
              const sym = item.symbol;
              const p = prices[sym] ?? 0;
              const change = CHANGE_SEEDS[i % CHANGE_SEEDS.length] ?? 0;
              const vol = VOL_SEEDS[i % VOL_SEEDS.length] ?? 0;
              const flash = flashMap[sym] ?? "";
              return (
                <tr
                  key={item.id}
                  className={flash}
                  style={{ borderBottom: "1px solid var(--border-soft)", transition: "background .15s ease" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "")}
                >
                  <td style={{ padding: "12px" }}><Coin sym={sym} /></td>
                  <td className="mono" style={{ textAlign: "right", padding: "12px", fontWeight: 600 }}>
                    {p > 0 ? `$${fmtPrice(p)}` : "—"}
                  </td>
                  <td style={{ textAlign: "right", padding: "12px" }}><Delta value={change} /></td>
                  <td style={{ padding: "12px", width: 120 }}>
                    <Sparkline data={sparks[sym] ?? [p]} color={change >= 0 ? "#22c55e" : "#f43f5e"} height={32} />
                  </td>
                  <td className="mono" style={{ textAlign: "right", padding: "12px", color: "var(--text-dim)" }}>
                    ${vol.toFixed(1)}B
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: "color-mix(in srgb, var(--info) 14%, transparent)", color: "var(--info)" }}>
                      Binance
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div className="flex gap-[4px] justify-end">
                      <IconActionBtn title="Kaldır" danger onClick={() => removeWatchlistItem(item.id)}>
                        <Trash2 size={13} />
                      </IconActionBtn>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sembol Ekle Modal */}
      {showAdd && (
        <div
          style={{ position: "fixed", inset: 0, background: "#00000088", backdropFilter: "blur(4px)", zIndex: 100, display: "grid", placeItems: "center" }}
          onClick={() => setShowAdd(false)}
        >
          <div
            style={{ width: 360, background: "var(--bg-elev)", border: "1px solid var(--border-color)", borderRadius: 14, padding: 22, boxShadow: "0 20px 60px #00000077" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Sembol Ekle</h2>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer" }}><X size={16} /></button>
            </div>
            <input
              type="text"
              placeholder="BTC, ETH, SOL…"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleAddSymbol()}
              style={{ width: "100%", padding: "9px 12px", background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: 8, color: "var(--text)", fontSize: 13, outline: "none", fontFamily: "inherit", marginBottom: 12 }}
              autoFocus
            />
            <div className="flex gap-[8px]">
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>İptal</button>
              <button
                onClick={handleAddSymbol}
                disabled={!newSymbol || addLoading}
                style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid var(--accent-color)", background: "var(--accent-color)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: addLoading ? 0.7 : 1 }}
              >
                {addLoading ? "Ekleniyor…" : "Ekle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Btn({ children, icon, primary, onClick }: { children: React.ReactNode; icon?: React.ReactNode; primary?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "1px solid",
        borderColor: primary ? "var(--accent-color)" : "var(--border-color)",
        background: primary ? "var(--accent-color)" : "var(--bg-card)",
        color: primary ? "#fff" : "var(--text)", cursor: "pointer", fontFamily: "inherit",
        boxShadow: primary ? "0 4px 14px #16a34a30" : undefined,
      }}
    >
      {icon}{children}
    </button>
  );
}

function IconActionBtn({ children, title, danger, onClick }: { children: React.ReactNode; title: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button
      title={title}
      aria-label={title}
      onClick={onClick}
      style={{ display: "grid", placeItems: "center", width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", color: danger ? "var(--loss)" : "var(--text-dim)", cursor: "pointer", fontFamily: "inherit" }}
    >
      {children}
    </button>
  );
}
