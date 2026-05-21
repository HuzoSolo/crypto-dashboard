"use client";

import { useState, useEffect } from "react";
import { Download, Plus, X } from "lucide-react";
import { getFinance, createFinanceEntry, deleteFinanceEntry, exportFinanceCSV, type ApiFinanceEntry } from "@/lib/api";

export default function IncomeExpensePage() {
  const [entries, setEntries] = useState<ApiFinanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, net: 0 });
  const [filter, setFilter] = useState<"all" | "INCOME" | "EXPENSE">("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "INCOME" as "INCOME" | "EXPENSE", category: "", amount: "", date: new Date().toISOString().slice(0, 10), description: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getFinance(filter !== "all" ? { type: filter } : undefined);
      setEntries(data.entries);
      setSummary({ totalIncome: data.totalIncome, totalExpense: data.totalExpense, net: data.net });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const handleDelete = async (id: string) => {
    await deleteFinanceEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSave = async () => {
    if (!form.category || !form.amount) return;
    setSaving(true);
    try {
      await createFinanceEntry({ ...form, amount: parseFloat(form.amount), date: new Date(form.date).toISOString() });
      setShowForm(false);
      setForm({ type: "INCOME", category: "", amount: "", date: new Date().toISOString().slice(0, 10), description: "" });
      load();
    } finally {
      setSaving(false);
    }
  };

  const filtered = entries;
  const income = summary.totalIncome;
  const expense = summary.totalExpense;
  const net = summary.net;

  const cats = [...new Set(entries.map((e) => e.category))];
  const catTotals = cats
    .map((c) => ({
      cat: c,
      total: entries.filter((e) => e.category === c && e.type === "EXPENSE").reduce((s, e) => s + e.amount, 0),
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
              { key: "INCOME", label: "Gelir" },
              { key: "EXPENSE", label: "Gider" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as "all" | "INCOME" | "EXPENSE")}
                style={{ fontSize: 11, padding: "5px 10px", borderRadius: 999, border: "1px solid", borderColor: filter === f.key ? "transparent" : "var(--border-soft)", background: filter === f.key ? "var(--accent-soft)" : "var(--bg-card)", color: filter === f.key ? "var(--accent-color)" : "var(--text-dim)", cursor: "pointer", fontFamily: "inherit" }}
              >
                {f.label}
              </button>
            ))}
            <span style={{ flex: 1 }} />
            <Btn icon={<Download size={13} />} onClick={() => exportFinanceCSV()}>CSV</Btn>
            <Btn icon={<Plus size={13} />} primary onClick={() => setShowForm(true)}>Yeni Kayıt</Btn>
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
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 999, color: e.type === "INCOME" ? "var(--gain)" : "var(--loss)", background: e.type === "INCOME" ? "color-mix(in srgb, var(--gain) 12%, transparent)" : "color-mix(in srgb, var(--loss) 12%, transparent)" }}>
                      {e.type === "INCOME" ? "↗ Gelir" : "↘ Gider"}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>{e.category}</td>
                  <td style={{ padding: "12px", color: "var(--text-dim)" }}>{e.description}</td>
                  <td className="mono" style={{ textAlign: "right", padding: "12px", fontWeight: 600, color: e.type === "INCOME" ? "var(--gain)" : "var(--loss)" }}>
                    {e.type === "INCOME" ? "+" : "−"}${e.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: "var(--chip-bg)", color: "var(--text-dim)" }}>USD</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <button onClick={() => handleDelete(e.id)} style={{ display: "grid", placeItems: "center", width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", color: "var(--loss)", cursor: "pointer" }}>
                      <X size={13} />
                    </button>
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
      {/* Yeni Kayıt Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", backdropFilter: "blur(4px)", zIndex: 100, display: "grid", placeItems: "center" }} onClick={() => setShowForm(false)}>
          <div style={{ width: 440, background: "var(--bg-elev)", border: "1px solid var(--border-color)", borderRadius: 14, padding: 22, boxShadow: "0 20px 60px #00000077" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Yeni Kayıt</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer" }}><X size={16} /></button>
            </div>
            <div className="flex gap-[8px]" style={{ marginBottom: 12 }}>
              {(["INCOME", "EXPENSE"] as const).map((t) => (
                <button key={t} onClick={() => setForm({ ...form, type: t })} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", borderColor: form.type === t ? (t === "INCOME" ? "var(--accent-color)" : "var(--loss)") : "var(--border-soft)", background: form.type === t ? (t === "INCOME" ? "var(--accent-color)" : "var(--loss)") : "transparent", color: form.type === t ? "#fff" : "var(--text-dim)" }}>
                  {t === "INCOME" ? "↗ Gelir" : "↘ Gider"}
                </button>
              ))}
            </div>
            {[
              { label: "Kategori", key: "category", placeholder: "Salary, Trading, Rent…" },
              { label: "Tutar (USD)", key: "amount", placeholder: "0.00" },
              { label: "Tarih", key: "date", placeholder: "", type: "date" },
              { label: "Açıklama (opsiyonel)", key: "description", placeholder: "…" },
            ].map(({ label, key, placeholder, type }) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: "var(--text-mute)", fontWeight: 500, display: "block", marginBottom: 4 }}>{label}</label>
                <input
                  type={type ?? "text"}
                  value={(form as Record<string, string>)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  style={{ width: "100%", padding: "7px 10px", background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: 8, color: "var(--text)", fontSize: 13, outline: "none", fontFamily: "inherit" }}
                />
              </div>
            ))}
            <div className="flex gap-[8px]">
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>İptal</button>
              <button onClick={handleSave} disabled={saving || !form.category || !form.amount} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid var(--accent-color)", background: "var(--accent-color)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Kaydediliyor…" : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
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

function Btn({ children, icon, primary, onClick }: { children: React.ReactNode; icon?: React.ReactNode; primary?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "1px solid", borderColor: primary ? "var(--accent-color)" : "var(--border-color)", background: primary ? "var(--accent-color)" : "var(--bg-card)", color: primary ? "#fff" : "var(--text)", cursor: "pointer", fontFamily: "inherit", boxShadow: primary ? "0 4px 14px #16a34a30" : undefined }}>
      {icon}{children}
    </button>
  );
}
