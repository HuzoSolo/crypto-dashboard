"use client";

import { useState } from "react";
import { Download, Plus } from "lucide-react";
import { useStore } from "@/lib/store";

export default function IncomeExpensePage() {
  const entries = useStore((s) => s.incomeExpense);
  const [filter, setFilter] = useState("all");

  const filtered = entries.filter((e) => filter === "all" || e.type === filter);
  const income = entries.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const expense = entries.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const net = income - expense;

  const cats = [...new Set(entries.map((e) => e.category))];
  const catTotals = cats
    .map((c) => ({
      cat: c,
      total: entries.filter((e) => e.category === c && e.type === "expense").reduce((s, e) => s + e.amount, 0),
    }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div className="animate-fadeIn" style={{ padding: "20px 24px 40px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="flex items-baseline gap-[12px] mb-[4px]">
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>Gelir & Gider</h1>
        <span style={{ color: "var(--text-mute)", fontSize: 13 }}>Aylık takip · CSV dışa aktarım</span>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <KpiCard label="Toplam Gelir" sub="Bu ay · 4 işlem">
          <span className="mono" style={{ fontSize: 22, fontWeight: 600, color: "var(--gain)" }}>
            +${income.toFixed(2)}
          </span>
        </KpiCard>
        <KpiCard label="Toplam Gider" sub="Bu ay · 5 işlem">
          <span className="mono" style={{ fontSize: 22, fontWeight: 600, color: "var(--loss)" }}>
            -${expense.toFixed(2)}
          </span>
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
          <div style={{ fontSize: 11, opacity: 0.85 }}>Aylık Net</div>
          <div className="mono" style={{ fontSize: 26, fontWeight: 600, marginTop: 4 }}>+${net.toFixed(0)}</div>
          <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>
            Tasarruf oranı: %{((net / income) * 100).toFixed(0)}
          </div>
        </div>
        <KpiCard label="Yıllık Tahmin" sub="12 aylık projeksiyon">
          <span className="mono" style={{ fontSize: 22, fontWeight: 600 }}>
            +${(net * 12).toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </span>
        </KpiCard>
      </div>

      {/* Table + Category breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-[8px]" style={{ padding: 14, borderBottom: "1px solid var(--border-soft)" }}>
            {[
              { key: "all", label: "Tümü" },
              { key: "income", label: "Gelir" },
              { key: "expense", label: "Gider" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{ fontSize: 11, padding: "5px 10px", borderRadius: 999, border: "1px solid", borderColor: filter === f.key ? "transparent" : "var(--border-soft)", background: filter === f.key ? "var(--accent-soft)" : "var(--bg-card)", color: filter === f.key ? "var(--accent-color)" : "var(--text-dim)", cursor: "pointer", fontFamily: "inherit" }}
              >
                {f.label}
              </button>
            ))}
            <span style={{ flex: 1 }} />
            <Btn icon={<Download size={13} />}>CSV</Btn>
            <Btn icon={<Plus size={13} />} primary>Yeni Kayıt</Btn>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Tarih", "Tip", "Kategori", "Açıklama", "Miktar", "Döviz"].map((h, i) => (
                  <th key={i} style={{ textAlign: i === 4 ? "right" : "left", fontSize: 11, fontWeight: 600, color: "var(--text-mute)", letterSpacing: "0.04em", textTransform: "uppercase", padding: "10px 12px", borderBottom: "1px solid var(--border-soft)", background: "var(--bg-card-2)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr
                  key={e.id}
                  style={{ borderBottom: "1px solid var(--border-soft)", transition: "background .15s ease" }}
                  onMouseEnter={(el) => ((el.currentTarget as HTMLTableRowElement).style.background = "var(--bg-hover)")}
                  onMouseLeave={(el) => ((el.currentTarget as HTMLTableRowElement).style.background = "")}
                >
                  <td className="mono" style={{ padding: "12px", color: "var(--text-dim)" }}>{e.date}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 999, color: e.type === "income" ? "var(--gain)" : "var(--loss)", background: e.type === "income" ? "color-mix(in srgb, var(--gain) 12%, transparent)" : "color-mix(in srgb, var(--loss) 12%, transparent)" }}>
                      {e.type === "income" ? "↗ Gelir" : "↘ Gider"}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>{e.category}</td>
                  <td style={{ padding: "12px", color: "var(--text-dim)" }}>{e.desc}</td>
                  <td className="mono" style={{ textAlign: "right", padding: "12px", fontWeight: 600, color: e.type === "income" ? "var(--gain)" : "var(--loss)" }}>
                    {e.type === "income" ? "+" : "−"}${e.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: "var(--chip-bg)", color: "var(--text-dim)" }}>{e.ccy}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Category breakdown */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: 14, padding: 18, boxShadow: "var(--shadow-card)" }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Gider Kategorileri</div>
            <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 2 }}>Bu ay</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {catTotals.map((c) => {
              const pct = (c.total / expense) * 100;
              return (
                <div key={c.cat}>
                  <div className="flex justify-between" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{c.cat}</span>
                    <span className="mono" style={{ fontSize: 12, color: "var(--text-dim)" }}>
                      ${c.total.toFixed(0)}{" "}
                      <span style={{ color: "var(--text-mute)" }}>({pct.toFixed(0)}%)</span>
                    </span>
                  </div>
                  <div style={{ height: 4, background: "var(--bg-hover)", borderRadius: 999, overflow: "hidden", position: "relative" }}>
                    <span
                      style={{
                        display: "block",
                        height: "100%",
                        width: pct + "%",
                        background: "linear-gradient(90deg, var(--accent-grad-1), var(--accent-grad-2))",
                        borderRadius: 999,
                        transition: "width .8s cubic-bezier(.2,.8,.2,1)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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

function Btn({ children, icon, primary }: { children: React.ReactNode; icon?: React.ReactNode; primary?: boolean }) {
  return (
    <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "1px solid", borderColor: primary ? "var(--accent-color)" : "var(--border-color)", background: primary ? "var(--accent-color)" : "var(--bg-card)", color: primary ? "#fff" : "var(--text)", cursor: "pointer", fontFamily: "inherit", boxShadow: primary ? "0 4px 14px #16a34a30" : undefined }}>
      {icon}{children}
    </button>
  );
}
