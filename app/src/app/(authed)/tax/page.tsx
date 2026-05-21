"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { getTax, updateTaxRate, exportTaxCSV, type ApiTaxResponse } from "@/lib/api";
import { Coin } from "@/components/crypto/coin";
import { Delta } from "@/components/crypto/delta";

export default function TaxPage() {
  const [taxData, setTaxData] = useState<ApiTaxResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [rate, setRate] = useState(20);
  const [rateTimeout, setRateTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const load = async (y = year) => {
    setLoading(true);
    try {
      const data = await getTax(y);
      setTaxData(data);
      setRate(data.taxRate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [year]);

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (rateTimeout) clearTimeout(rateTimeout);
    const t = setTimeout(async () => {
      await updateTaxRate(newRate);
      load();
    }, 600);
    setRateTimeout(t);
  };

  const lots = taxData?.lots ?? [];
  const realized = taxData?.netPnl ?? 0;
  const taxable = taxData?.totalGain ?? 0;
  const tax = taxData?.estimatedTax ?? 0;
  const losses = taxData?.totalLoss ?? 0;

  return (
    <div className="animate-fadeIn" style={{ padding: "20px 24px 40px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="flex items-baseline gap-[12px] mb-[4px]">
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>Vergi</h1>
        <span style={{ color: "var(--text-mute)", fontSize: 13 }}>
          FIFO bazlı gerçekleşmiş kâr/zarar · 2026 yılı
        </span>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <KpiCard label="Gerçekleşmiş P&L" sub={`${lots.length} kapatılan pozisyon`}>
          <span className="mono" style={{ fontSize: 22, fontWeight: 600, color: realized >= 0 ? "var(--gain)" : "var(--loss)" }}>
            {realized >= 0 ? "+" : "−"}${Math.abs(realized).toFixed(2)}
          </span>
        </KpiCard>
        <KpiCard label="Vergiye Tabi Kâr" sub="Yalnızca pozitif lotlar">
          <span className="mono" style={{ fontSize: 22, fontWeight: 600 }}>${taxable.toFixed(2)}</span>
        </KpiCard>
        <KpiCard label="Mahsup Edilebilir Zarar" sub="İleriye taşınabilir">
          <span className="mono" style={{ fontSize: 22, fontWeight: 600, color: "var(--loss)" }}>${losses.toFixed(2)}</span>
        </KpiCard>
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
          <div style={{ fontSize: 11, opacity: 0.85 }}>Tahmini Vergi</div>
          <div className="mono" style={{ fontSize: 26, fontWeight: 600, marginTop: 4 }}>${tax.toFixed(2)}</div>
          <div className="flex items-center gap-[8px]" style={{ marginTop: 8 }}>
            <span style={{ fontSize: 11, opacity: 0.85 }}>Oran:</span>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={rate}
              onChange={(e) => handleRateChange(parseInt(e.target.value))}
              style={{ flex: 1, accentColor: "#fff" }}
            />
            <span className="mono" style={{ fontWeight: 600 }}>%{rate}</span>
          </div>
        </div>
      </div>

      {/* FIFO table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center gap-[8px]" style={{ padding: 14, borderBottom: "1px solid var(--border-soft)" }}>
          <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: "color-mix(in srgb, var(--info) 14%, transparent)", color: "var(--info)" }}>
            FIFO
          </span>
          <span style={{ fontSize: 12, color: "var(--text-mute)" }}>
            İlk giren ilk çıkar yöntemi · {lots.length} satılmış lot
          </span>
          <span style={{ flex: 1 }} />
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            style={{ padding: "6px 10px", background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: 8, color: "var(--text)", fontSize: 12, outline: "none", fontFamily: "inherit" }}
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
          <button
            onClick={() => exportTaxCSV(year)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text)", cursor: "pointer", fontFamily: "inherit" }}
          >
            <Download size={13} />CSV İndir
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {["Tarih", "Coin", "Adet", "Alış Fiyatı", "Satış Fiyatı", "P&L", `Vergi (%${rate})`].map((h, i) => (
                <th key={i} style={{ textAlign: i >= 2 ? "right" : "left", fontSize: 11, fontWeight: 600, color: "var(--text-mute)", letterSpacing: "0.04em", textTransform: "uppercase", padding: "10px 12px", borderBottom: "1px solid var(--border-soft)", background: "var(--bg-card-2)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lots.map((l, i) => {
              const taxLot = l.pnl > 0 ? (l.pnl * rate) / 100 : 0;
              return (
                <tr
                  key={i}
                  style={{ borderBottom: "1px solid var(--border-soft)", transition: "background .15s ease" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "")}
                >
                  <td className="mono" style={{ padding: "12px", color: "var(--text-dim)" }}>{l.date}</td>
                  <td style={{ padding: "12px" }}><Coin sym={l.symbol} /></td>
                  <td className="mono" style={{ textAlign: "right", padding: "12px" }}>{l.amount}</td>
                  <td className="mono" style={{ textAlign: "right", padding: "12px" }}>
                    ${l.buyPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </td>
                  <td className="mono" style={{ textAlign: "right", padding: "12px" }}>
                    ${l.sellPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: "right", padding: "12px" }}>
                    <Delta value={l.pnl} format="usd" />
                  </td>
                  <td className="mono" style={{ textAlign: "right", padding: "12px", fontWeight: 600, color: taxLot > 0 ? "var(--text)" : "var(--text-mute)" }}>
                    {taxLot > 0 ? "$" + taxLot.toFixed(2) : "—"}
                  </td>
                </tr>
              );
            })}
            <tr style={{ background: "var(--bg-card-2)", fontWeight: 600 }}>
              <td colSpan={5} style={{ textAlign: "right", fontSize: 11, color: "var(--text-mute)", textTransform: "uppercase", letterSpacing: "0.05em", padding: "12px" }}>
                Toplam
              </td>
              <td style={{ textAlign: "right", padding: "12px" }}>
                <Delta value={realized} format="usd" />
              </td>
              <td className="mono" style={{ textAlign: "right", padding: "12px", fontWeight: 600 }}>
                ${tax.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiCard({ label, sub, children }: { label: string; sub: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: 14, padding: 18, boxShadow: "var(--shadow-card)" }}>
      <div style={{ fontSize: 11, color: "var(--text-mute)" }}>{label}</div>
      <div style={{ marginTop: 4 }}>{children}</div>
      <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 2 }}>{sub}</div>
    </div>
  );
}
