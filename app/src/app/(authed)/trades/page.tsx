"use client";

import { useState, useEffect } from "react";
import { Download, Plus, Trash2, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { Coin } from "@/components/crypto/coin";
import { Delta } from "@/components/crypto/delta";
import { INITIAL_PRICES } from "@/lib/data";

export default function TradesPage() {
  const trades = useStore((s) => s.trades);
  const tradesLoading = useStore((s) => s.tradesLoading);
  const addTrade = useStore((s) => s.addTrade);
  const deleteTrade = useStore((s) => s.deleteTrade);
  const fetchTrades = useStore((s) => s.fetchTrades);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchTrades(); }, []);

  const filtered = trades.filter((t) => filter === "all" || t.type === filter);
  const totalPnl = filtered.reduce((s, t) => s + t.pnl, 0);

  return (
    <div className="animate-fadeIn" style={{ padding: "20px 24px 40px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="flex items-baseline gap-[12px] mb-[4px]">
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>İşlemler</h1>
        <span style={{ color: "var(--text-mute)", fontSize: 13 }}>
          {tradesLoading ? "Yükleniyor…" : `${trades.length} işlem`} · Toplam P&L{" "}
          <Delta value={totalPnl} format="usd" size="lg" />
        </span>
      </div>

      {/* Toolbar */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: 14, padding: 14 }}>
        <div className="flex items-center gap-[8px] flex-wrap">
          {[
            { key: "all", label: `Tümü (${trades.length})` },
            { key: "buy", label: `Alış (${trades.filter((t) => t.type === "buy").length})` },
            { key: "sell", label: `Satış (${trades.filter((t) => t.type === "sell").length})` },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                fontSize: 11,
                padding: "5px 10px",
                borderRadius: 999,
                border: "1px solid",
                borderColor: filter === f.key ? "transparent" : "var(--border-soft)",
                background: filter === f.key ? "var(--accent-soft)" : "var(--bg-card)",
                color: filter === f.key ? "var(--accent-color)" : "var(--text-dim)",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {f.label}
            </button>
          ))}
          <span style={{ fontSize: 11, color: "var(--text-mute)", marginLeft: 12 }}>Coin:</span>
          <select
            style={{
              padding: "6px 10px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-soft)",
              borderRadius: 8,
              color: "var(--text)",
              fontSize: 12,
              outline: "none",
              fontFamily: "inherit",
            }}
          >
            <option value="">Tümü</option>
            {[...new Set(trades.map((t) => t.coin))].map((c) => <option key={c}>{c}</option>)}
          </select>
          <input
            type="date"
            defaultValue="2026-04-01"
            style={{ padding: "6px 10px", background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: 8, color: "var(--text)", fontSize: 12, outline: "none", fontFamily: "inherit" }}
          />
          <span style={{ color: "var(--text-mute)", fontSize: 11 }}>→</span>
          <input
            type="date"
            defaultValue="2026-05-05"
            style={{ padding: "6px 10px", background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: 8, color: "var(--text)", fontSize: 12, outline: "none", fontFamily: "inherit" }}
          />
          <span style={{ flex: 1 }} />
          <Btn icon={<Download size={13} />}>CSV</Btn>
          <Btn icon={<Plus size={13} />} primary onClick={() => setShowForm(true)}>Yeni İşlem</Btn>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: 14, padding: 0, overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {["Tarih", "Coin", "Tip", "Adet", "Fiyat", "Toplam", "Borsa", "Not", "P&L", ""].map((h, i) => (
                <th key={i} style={{ textAlign: [3, 4, 5, 8].includes(i) ? "right" : "left", fontSize: 11, fontWeight: 600, color: "var(--text-mute)", letterSpacing: "0.04em", textTransform: "uppercase", padding: "10px 12px", borderBottom: "1px solid var(--border-soft)", background: "var(--bg-card-2)", width: i === 9 ? 40 : undefined }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr
                key={t.id}
                style={{ borderBottom: "1px solid var(--border-soft)", transition: "background .15s ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-hover)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "")}
              >
                <td className="mono" style={{ padding: "12px", color: "var(--text-dim)" }}>{t.date}</td>
                <td style={{ padding: "12px" }}><Coin sym={t.coin} /></td>
                <td style={{ padding: "12px" }}>
                  <TypeBadge type={t.type} />
                </td>
                <td className="mono" style={{ textAlign: "right", padding: "12px" }}>{t.qty}</td>
                <td className="mono" style={{ textAlign: "right", padding: "12px" }}>
                  ${t.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </td>
                <td className="mono" style={{ textAlign: "right", padding: "12px", fontWeight: 600 }}>
                  ${(t.qty * t.price).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </td>
                <td style={{ padding: "12px" }}>
                  <span style={{ display: "inline-flex", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: "var(--chip-bg)", color: "var(--text-dim)" }}>
                    {t.exchange}
                  </span>
                </td>
                <td style={{ padding: "12px", color: "var(--text-dim)", fontSize: 12, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {t.note || "—"}
                </td>
                <td style={{ textAlign: "right", padding: "12px" }}>
                  <Delta value={t.pnl} format="usd" />
                </td>
                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() => deleteTrade(t.id)}
                    style={{ display: "grid", placeItems: "center", width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", color: "var(--loss)", cursor: "pointer" }}
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <TradeFormModal
          onClose={() => setShowForm(false)}
          onSubmit={async (data) => {
            await addTrade({
              symbol: data.coin,
              type: data.type === "buy" ? "BUY" : "SELL",
              date: new Date(data.date).toISOString(),
              amount: data.qty,
              price: data.price,
              exchange: data.exchange,
              note: data.note,
            });
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function TypeBadge({ type }: { type: "buy" | "sell" }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 10,
        fontWeight: 600,
        padding: "3px 8px",
        borderRadius: 999,
        color: type === "buy" ? "var(--gain)" : "var(--loss)",
        background: type === "buy" ? "color-mix(in srgb, var(--gain) 12%, transparent)" : "color-mix(in srgb, var(--loss) 12%, transparent)",
      }}
    >
      {type === "buy" ? "↗ Alış" : "↘ Satış"}
    </span>
  );
}

function Btn({ children, icon, primary, onClick }: { children: React.ReactNode; icon?: React.ReactNode; primary?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "1px solid", borderColor: primary ? "var(--accent-color)" : "var(--border-color)", background: primary ? "var(--accent-color)" : "var(--bg-card)", color: primary ? "#fff" : "var(--text)", cursor: "pointer", fontFamily: "inherit", boxShadow: primary ? "0 4px 14px #16a34a30" : undefined }}
    >
      {icon}{children}
    </button>
  );
}

function TradeFormModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (t: any) => void }) {
  const [form, setForm] = useState({ date: "2026-05-05", coin: "BTC", type: "buy" as "buy" | "sell", qty: "", price: "", exchange: "Binance", note: "" });
  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: "t" + Date.now(), ...form, qty: parseFloat(form.qty) || 0, price: parseFloat(form.price) || 0, pnl: Math.random() * 200 - 50 });
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "#00000088", backdropFilter: "blur(4px)", zIndex: 100, display: "grid", placeItems: "center" }}
      onClick={onClose}
    >
      <form
        className="animate-modalIn"
        style={{ width: 460, maxWidth: "92vw", background: "var(--bg-elev)", border: "1px solid var(--border-color)", borderRadius: 14, padding: 22, boxShadow: "0 20px 60px #00000077" }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 600 }}>Yeni İşlem</h2>
            <div style={{ fontSize: 12, color: "var(--text-mute)", marginBottom: 16 }}>Manuel olarak işlem kaydı ekle</div>
          </div>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: 6 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <Field label="Tarih">
            <input className="field-input" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </Field>
          <Field label="Coin">
            <select className="field-input" value={form.coin} onChange={(e) => set("coin", e.target.value)}>
              {Object.keys(INITIAL_PRICES).map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: "var(--text-mute)", fontWeight: 500, display: "block", marginBottom: 4 }}>Tip</label>
          <div className="flex gap-[8px]">
            {(["buy", "sell"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set("type", t)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: 8,
                  border: "1px solid",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  borderColor: form.type === t ? (t === "buy" ? "var(--accent-color)" : "var(--loss)") : "var(--border-soft)",
                  background: form.type === t ? (t === "buy" ? "var(--accent-color)" : "var(--loss)") : "transparent",
                  color: form.type === t ? "#fff" : "var(--text-dim)",
                }}
              >
                {t === "buy" ? "↗ Alış" : "↘ Satış"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <Field label="Adet">
            <input className="field-input mono" required placeholder="0.00" value={form.qty} onChange={(e) => set("qty", e.target.value)} />
          </Field>
          <Field label="Fiyat (USD)">
            <input className="field-input mono" required placeholder="0.00" value={form.price} onChange={(e) => set("price", e.target.value)} />
          </Field>
        </div>

        <div style={{ marginBottom: 12 }}>
          <Field label="Borsa">
            <select className="field-input" value={form.exchange} onChange={(e) => set("exchange", e.target.value)}>
              {["Binance", "Coinbase", "Kraken", "OKX", "Bybit"].map((ex) => <option key={ex}>{ex}</option>)}
            </select>
          </Field>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Field label="Not (opsiyonel)">
            <textarea
              className="field-input"
              rows={2}
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              placeholder="Strateji, sinyal, gözlem…"
              style={{ resize: "none" }}
            />
          </Field>
        </div>

        <div className="flex gap-[8px]">
          <button type="button" onClick={onClose} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>İptal</button>
          <button type="submit" style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid var(--accent-color)", background: "var(--accent-color)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Kaydet</button>
        </div>
      </form>
      <style>{`.field-input { width: 100%; padding: 7px 10px; background: var(--bg-card); border: 1px solid var(--border-soft); border-radius: 8px; color: var(--text); font-size: 13px; outline: none; font-family: inherit; }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, color: "var(--text-mute)", fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  );
}
