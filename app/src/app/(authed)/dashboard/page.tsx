"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import { useStore } from "@/lib/store";
import { getFinance } from "@/lib/api";
import { Sparkline } from "@/components/crypto/sparkline";
import { DonutChart } from "@/components/crypto/donut-chart";
import { Delta } from "@/components/crypto/delta";
import { Ticker } from "@/components/crypto/ticker";
import { BarSet } from "@/components/crypto/bar-set";
import { Coin } from "@/components/crypto/coin";
import { COIN_COLORS, genSeries } from "@/lib/data";
import { fmtUSD, fmtCompact, fmtPct } from "@/lib/fmt";

export default function DashboardPage() {
  const prices = useStore((s) => s.prices);
  const holdings = useStore((s) => s.holdings);
  const trades = useStore((s) => s.trades);
  const goals = useStore((s) => s.goals);
  const portfolioMeta = useStore((s) => s.portfolioMeta);
  const currentUser = useStore((s) => s.currentUser);
  const [finance, setFinance] = useState({ totalIncome: 0, totalExpense: 0, net: 0 });

  useEffect(() => {
    getFinance().then((d) => setFinance({ totalIncome: d.totalIncome, totalExpense: d.totalExpense, net: d.net })).catch(() => {});
  }, []);

  const positions = holdings.map((h) => ({
    ...h,
    price: prices[h.sym] ?? 0,
    value: (prices[h.sym] ?? 0) * h.qty,
    cost: h.avg * h.qty,
  }));

  const totalValue = positions.reduce((s, p) => s + p.value, 0);
  const totalCost = positions.reduce((s, p) => s + p.cost, 0);
  const change24Pct = portfolioMeta.change24hPct;
  const change24Usd = portfolioMeta.change24hUSD;
  const allTimePnl = totalValue - totalCost;
  const allTimePnlPct = totalCost > 0 ? (allTimePnl / totalCost) * 100 : 0;
  const monthlyIncome = finance.totalIncome;
  const monthlyExpense = finance.totalExpense;
  const net = finance.net;

  const donutData = [
    ...positions
      .filter((p) => p.sym !== "USDT")
      .map((p) => ({ key: p.sym, value: p.value, color: COIN_COLORS[p.sym] || "#666", label: p.sym }))
      .sort((a, b) => b.value - a.value),
    {
      key: "USDT",
      value: positions.find((p) => p.sym === "USDT")?.value ?? 0,
      color: COIN_COLORS.USDT,
      label: "USDT",
    },
  ];

  const [hovered, setHovered] = useState<string | null>(null);
  const heroSpark = useMemo(() => genSeries(7, 60, totalValue * 0.94, 0.012, 0.0008), []);

  return (
    <div className="animate-fadeIn" style={{ padding: "20px 24px 40px", display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Page title */}
      <div className="flex items-baseline gap-[12px] mb-[4px]">
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>Ana Sayfa</h1>
        <span style={{ color: "var(--text-mute)", fontSize: 13 }}>
          Hoş geldin {currentUser?.username ?? "…"} — bugün portföyün{" "}
          <Delta value={change24Pct} /> hareketinde.
        </span>
      </div>

      {/* Row 1: Hero + Donut */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1.1fr", gap: 16, alignItems: "start" }}>
        {/* Hero card */}
        <div
          style={{
            background:
              "radial-gradient(120% 140% at 100% 0%, #16a34a55 0%, transparent 55%), linear-gradient(135deg, var(--accent-grad-1) 0%, var(--accent-grad-2) 100%)",
            color: "#fff",
            border: "1px solid #ffffff15",
            boxShadow: "0 12px 32px #16a34a25",
            borderRadius: 14,
            padding: 18,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>Toplam Portföy Değeri · USD</div>
              <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05, margin: "6px 0 4px" }}>
                <Ticker
                  value={totalValue}
                  format={(v) => "$" + v.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                />
              </div>
              <div className="flex items-center gap-[8px]" style={{ fontSize: 13 }}>
                <span className="mono" style={{ background: "#ffffff20", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>
                  +${change24Usd.toFixed(0)}
                </span>
                <span className="mono">{fmtPct(change24Pct)} <span style={{ opacity: 0.7 }}>· 24s</span></span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span
                className="inline-flex items-center gap-[5px]"
                style={{
                  background: "#ffffff22",
                  backdropFilter: "blur(8px)",
                  border: "1px solid #ffffff20",
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", boxShadow: "0 0 6px #fff", display: "inline-block" }} />
                Binance · Live
              </span>
              <div style={{ marginTop: 10, fontSize: 11, opacity: 0.85 }}>Last sync · 2s ago</div>
            </div>
          </div>

          <div style={{ marginTop: 14, marginBottom: 6, marginLeft: -18, marginRight: -18 }}>
            <Sparkline data={heroSpark} color="#ffffff" height={60} fill strokeW={2} />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18, fontSize: 12, opacity: 0.9 }}>
            <div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>Tüm Zaman P&L</div>
              <div className="mono" style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>
                +${allTimePnl.toLocaleString("en-US", { maximumFractionDigits: 0 })}{" "}
                <span style={{ fontSize: 11, opacity: 0.8 }}>{fmtPct(allTimePnlPct, 1)}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>Aylık Net</div>
              <div className="mono" style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>
                +${net.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>Maliyet</div>
              <div className="mono" style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>
                ${totalCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </div>
            </div>
            <Link
              href="/portfolio"
              className="flex items-center gap-[6px]"
              style={{
                background: "#ffffff15",
                borderColor: "#ffffff20",
                color: "#fff",
                backdropFilter: "blur(8px)",
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #ffffff20",
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Cüzdana Git <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Donut card */}
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
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Varlık Dağılımı</div>
              <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 2 }}>{positions.length} pozisyon</div>
            </div>
            <Link
              href="/portfolio"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-dim)",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                padding: "5px 8px",
                textDecoration: "none",
              }}
            >
              Detay
            </Link>
          </div>
          <div className="flex items-center gap-[16px]">
            <div style={{ position: "relative" }}>
              <DonutChart data={donutData} size={150} thick={22} hoveredKey={hovered} onHover={setHovered} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  pointerEvents: "none",
                  textAlign: "center",
                }}
              >
                {hovered ? (
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-mute)" }}>{hovered}</div>
                    <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>
                      {((donutData.find((d) => d.key === hovered)!.value / totalValue) * 100).toFixed(1)}%
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-mute)" }}>Toplam</div>
                    <div className="mono" style={{ fontSize: 14, fontWeight: 600 }}>{fmtCompact(totalValue)}</div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
              {donutData.slice(0, 5).map((d) => (
                <div
                  key={d.key}
                  onMouseEnter={() => setHovered(d.key)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 0",
                    cursor: "pointer",
                    opacity: hovered && hovered !== d.key ? 0.5 : 1,
                    transition: "opacity .15s ease",
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                  <span style={{ fontWeight: 500 }}>{d.label}</span>
                  <span className="mono" style={{ marginLeft: "auto", color: "var(--text-dim)" }}>
                    {((d.value / totalValue) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "En İyi Performer", value: "SOL", delta: 5.84, sub: "+$782.34 · 24s" },
          { label: "En Kötü Performer", value: "AVAX", delta: -2.11, sub: "-$52.40 · 24s" },
          { label: "Bu Ay İşlem", value: "24", sub: "12 alış · 12 satış", delta: null },
          { label: "Vergiye Tabi Kâr", value: "$2.41K", sub: "2026 yılı · %20 oranı", delta: null },
        ].map((k, i) => (
          <div
            key={i}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-soft)",
              borderRadius: 14,
              padding: "14px 16px",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div style={{ fontSize: 11, color: "var(--text-mute)" }}>{k.label}</div>
            <div className="flex items-baseline gap-[8px]" style={{ marginTop: 6 }}>
              <div className="mono" style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>{k.value}</div>
              {k.delta != null && <Delta value={k.delta} />}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Row 3: Goals + Trades + Monthly */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.6fr 1fr", gap: 16 }}>
        {/* Goals */}
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
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Aktif Hedefler</div>
              <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 2 }}>{goals.length} hedef · 1 risk altında</div>
            </div>
            <Link href="/goals" style={{ fontSize: 12, color: "var(--text-dim)", textDecoration: "none" }}>Tümü</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {goals.slice(0, 3).map((g) => {
              const pct = (g.current / g.target) * 100;
              const isWarn = !g.onTrack;
              return (
                <div key={g.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{g.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-mute)" }}>
                        Hedef: <span className="mono">${g.target.toLocaleString()}</span> · {g.deadline}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{pct.toFixed(0)}%</div>
                      {isWarn && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: 999,
                            color: "var(--warn)",
                            background: "color-mix(in srgb, var(--warn) 14%, transparent)",
                          }}
                        >
                          Risk
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "var(--bg-hover)",
                      borderRadius: 999,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        height: "100%",
                        width: pct + "%",
                        background: isWarn
                          ? "linear-gradient(90deg, #f59e0b, #d97706)"
                          : "linear-gradient(90deg, var(--accent-grad-1), var(--accent-grad-2))",
                        borderRadius: 999,
                        transition: "width .8s cubic-bezier(.2,.8,.2,1)",
                        position: "relative",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent trades */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-soft)",
            borderRadius: 14,
            padding: 0,
            boxShadow: "var(--shadow-card)",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 18px 0" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Son İşlemler</div>
              <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 2 }}>Son 5 hareket</div>
            </div>
            <Link href="/trades" style={{ fontSize: 12, color: "var(--text-dim)", textDecoration: "none" }}>Tümü</Link>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 10 }}>
            <thead>
              <tr>
                {["Coin", "Tip", "Adet", "P&L"].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      textAlign: i >= 2 ? "right" : "left",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text-mute)",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      padding: "10px 12px",
                      borderBottom: "1px solid var(--border-soft)",
                      background: "var(--bg-card-2)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trades.slice(0, 5).map((t) => (
                <tr
                  key={t.id}
                  style={{ borderBottom: "1px solid var(--border-soft)", transition: "background .15s ease" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "")}
                >
                  <td style={{ padding: "12px" }}><Coin sym={t.coin} sub={t.exchange} /></td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: 999,
                        color: t.type === "buy" ? "var(--gain)" : "var(--loss)",
                        background: t.type === "buy"
                          ? "color-mix(in srgb, var(--gain) 12%, transparent)"
                          : "color-mix(in srgb, var(--loss) 12%, transparent)",
                      }}
                    >
                      {t.type === "buy" ? "Alış" : "Satış"}
                    </span>
                  </td>
                  <td className="mono" style={{ textAlign: "right", padding: "12px" }}>{t.qty}</td>
                  <td style={{ textAlign: "right", padding: "12px" }}>
                    <Delta value={t.pnl} format="usd" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Monthly net + Quick nav */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Aylık Net</div>
                <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 2 }}>Mayıs 2026</div>
              </div>
              <BarChart3 size={14} style={{ color: "var(--text-mute)" }} />
            </div>
            <div className="mono" style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em" }}>
              +${net.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 12 }}>
              <div>
                <div style={{ color: "var(--text-mute)", fontSize: 11 }}>Gelir</div>
                <div className="mono" style={{ color: "var(--gain)", fontWeight: 600 }}>${monthlyIncome.toFixed(0)}</div>
              </div>
              <div>
                <div style={{ color: "var(--text-mute)", fontSize: 11 }}>Gider</div>
                <div className="mono" style={{ color: "var(--loss)", fontWeight: 600 }}>${monthlyExpense.toFixed(0)}</div>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <BarSet
                height={56}
                data={[
                  { label: "Şub", income: 5400, expense: 2700 },
                  { label: "Mar", income: 5800, expense: 2900 },
                  { label: "Nis", income: 5200, expense: 2200 },
                  { label: "May", income: 6200, expense: 2400 },
                ]}
              />
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-soft)",
              borderRadius: 14,
              padding: 14,
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Hızlı Erişim</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { href: "/watchlist", label: "Varlıklar" },
                { href: "/trades", label: "Yeni İşlem" },
                { href: "/tax", label: "Vergi" },
                { href: "/calendar", label: "Takvim" },
              ].map((q) => (
                <Link
                  key={q.href}
                  href={q.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: 10,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-soft)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "var(--text)",
                    textDecoration: "none",
                    transition: "background .15s ease",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--bg-card)")}
                >
                  <span style={{ color: "var(--accent-color)", fontSize: 12 }}>→</span>
                  {q.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
