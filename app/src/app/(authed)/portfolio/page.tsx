"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Sparkline } from "@/components/crypto/sparkline";
import { DonutChart } from "@/components/crypto/donut-chart";
import { Delta } from "@/components/crypto/delta";
import { Coin } from "@/components/crypto/coin";
import { COIN_COLORS, genSeries } from "@/lib/data";
import { fmtPrice } from "@/lib/fmt";

export default function PortfolioPage() {
  const prices = useStore((s) => s.prices);
  const holdings = useStore((s) => s.holdings);
  const setHoldings = useStore((s) => s.setHoldings);

  const positions = holdings.map((h) => ({
    ...h,
    price: prices[h.sym] ?? 0,
    value: (prices[h.sym] ?? 0) * h.qty,
    cost: h.avg * h.qty,
    pnl: ((prices[h.sym] ?? 0) - h.avg) * h.qty,
    pnlPct: (((prices[h.sym] ?? 0) - h.avg) / h.avg) * 100,
  }));

  const total = positions.reduce((s, p) => s + p.value, 0);
  const totalCost = positions.reduce((s, p) => s + p.cost, 0);

  const donut = positions.map((p) => ({ key: p.sym, value: p.value, color: COIN_COLORS[p.sym] || "#666" }));
  const [hovered, setHovered] = useState<string | null>(null);

  const sparks = useMemo(() => {
    const out: Record<string, number[]> = {};
    holdings.forEach((h, i) => { out[h.sym] = genSeries(i * 7 + 3, 24, h.avg, 0.02, 0.001 * (i % 3 - 1)); });
    return out;
  }, []);

  return (
    <div className="animate-fadeIn" style={{ padding: "20px 24px 40px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="flex items-baseline gap-[12px] mb-[4px]">
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>Cüzdan</h1>
        <span style={{ color: "var(--text-mute)", fontSize: 13 }}>
          {positions.length} pozisyon · maliyet ${totalCost.toFixed(0)}
        </span>
      </div>

      {/* Hero + Donut */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <div
          style={{
            background: "radial-gradient(120% 140% at 100% 0%, #16a34a55 0%, transparent 55%), linear-gradient(135deg, var(--accent-grad-1) 0%, var(--accent-grad-2) 100%)",
            color: "#fff",
            border: "1px solid #ffffff15",
            boxShadow: "0 12px 32px #16a34a25",
            borderRadius: 14,
            padding: 18,
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.85 }}>Toplam Cüzdan Değeri</div>
          <div className="mono" style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05, margin: "6px 0 4px" }}>
            ${total.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 12, marginTop: 6 }}>
            {[
              { label: "Maliyet", val: "$" + totalCost.toFixed(0) },
              { label: "Açık P&L", val: "+" + "$" + (total - totalCost).toFixed(0) + " (" + (((total - totalCost) / totalCost) * 100).toFixed(1) + "%)" },
              { label: "Pozisyon", val: String(positions.length) },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ opacity: 0.8 }}>{s.label}</div>
                <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-soft)",
            borderRadius: 14,
            padding: 18,
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Dağılım</div>
            <span style={{ fontSize: 11, color: "var(--text-mute)" }}>USDT dahil</span>
          </div>
          <div className="flex gap-[14px] items-center">
            <div style={{ position: "relative" }}>
              <DonutChart data={donut} size={140} thick={20} hoveredKey={hovered} onHover={setHovered} />
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none", textAlign: "center" }}>
                <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>
                  {hovered ? ((donut.find((d) => d.key === hovered)!.value / total) * 100).toFixed(1) + "%" : positions.length + " coin"}
                </div>
              </div>
            </div>
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 11 }}>
              {donut.map((d) => (
                <div
                  key={d.key}
                  onMouseEnter={() => setHovered(d.key)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ display: "flex", alignItems: "center", gap: 6, opacity: hovered && hovered !== d.key ? 0.4 : 1, transition: "opacity .15s ease" }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                  <span style={{ fontWeight: 500 }}>{d.key}</span>
                  <span className="mono" style={{ marginLeft: "auto", color: "var(--text-dim)" }}>
                    {((d.value / total) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Asset cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {positions.map((p) => (
          <div
            key={p.sym}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-soft)",
              borderRadius: 14,
              padding: 16,
              boxShadow: "var(--shadow-card)",
              transition: "border-color .2s ease",
            }}
          >
            <div className="flex items-start justify-between" style={{ marginBottom: 12 }}>
              <Coin sym={p.sym} />
              <Delta value={p.pnlPct} />
            </div>
            <Sparkline data={sparks[p.sym] ?? []} color={p.pnl >= 0 ? "#22c55e" : "#f43f5e"} height={36} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: "var(--text-mute)" }}>Adet</div>
                <input
                  className="mono"
                  value={p.qty}
                  onChange={(e) =>
                    setHoldings((arr) =>
                      arr.map((h) => (h.sym === p.sym ? { ...h, qty: parseFloat(e.target.value) || 0 } : h))
                    )
                  }
                  style={{
                    width: "100%",
                    marginTop: 2,
                    fontSize: 13,
                    padding: "5px 8px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-soft)",
                    borderRadius: 8,
                    color: "var(--text)",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "var(--text-mute)" }}>Fiyat</div>
                <div className="mono" style={{ fontSize: 13, fontWeight: 600, marginTop: 6 }}>
                  ${fmtPrice(p.price)}
                </div>
              </div>
            </div>
            <div style={{ height: 1, background: "var(--border-soft)", margin: "10px 0" }} />
            <div className="flex justify-between items-center">
              <div>
                <div style={{ fontSize: 10, color: "var(--text-mute)" }}>Toplam Değer</div>
                <div className="mono" style={{ fontSize: 16, fontWeight: 600 }}>
                  ${p.value.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: "var(--text-mute)" }}>Açık P&L</div>
                <div
                  className="mono"
                  style={{ fontSize: 13, fontWeight: 600, color: p.pnl >= 0 ? "var(--gain)" : "var(--loss)" }}
                >
                  {p.pnl >= 0 ? "+" : "−"}${Math.abs(p.pnl).toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
