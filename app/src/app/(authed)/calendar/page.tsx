"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useStore } from "@/lib/store";

const MONTH_NAMES = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const DOW = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export default function CalendarPage() {
  const trades = useStore((s) => s.trades);
  const [month, setMonth] = useState(4);
  const year = 2026;
  const today = 5;

  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const events: Record<number, { type: string; label: string; qty?: number }[]> = {};
  trades.forEach((t) => {
    const d = new Date(t.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      events[day] = events[day] || [];
      events[day].push({ type: t.type, label: `${t.type === "buy" ? "Alış" : "Satış"} ${t.coin}`, qty: t.qty });
    }
  });
  events[8] = (events[8] || []).concat([{ type: "note", label: "BTC ETF kararı" }]);
  events[14] = (events[14] || []).concat([{ type: "note", label: "CPI verisi" }]);
  events[20] = (events[20] || []).concat([{ type: "note", label: "FOMC tutanak" }]);

  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);

  const [picked, setPicked] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="animate-fadeIn" style={{ padding: "20px 24px 40px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="flex items-baseline gap-[12px] mb-[4px]">
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>Takvim</h1>
        <span style={{ color: "var(--text-mute)", fontSize: 13 }}>
          İşlemler ve etkinlikler · {MONTH_NAMES[month]} {year}
        </span>
      </div>

      {/* Toolbar */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: 14, padding: 14 }}>
        <div className="flex items-center gap-[8px] flex-wrap">
          <button onClick={() => setMonth((m) => (m + 11) % 12)} style={iconBtnStyle}>
            <ChevronLeft size={14} />
          </button>
          <div style={{ minWidth: 140, textAlign: "center", fontWeight: 600, fontSize: 14 }}>
            {MONTH_NAMES[month]} {year}
          </div>
          <button onClick={() => setMonth((m) => (m + 1) % 12)} style={iconBtnStyle}>
            <ChevronRight size={14} />
          </button>
          <button onClick={() => setMonth(4)} style={{ ...btnStyle, padding: "5px 10px", fontSize: 12 }}>
            Bugün
          </button>
          <span style={{ flex: 1 }} />
          <div className="flex gap-[12px]" style={{ fontSize: 11, color: "var(--text-mute)" }}>
            <span className="flex items-center gap-[5px]">
              <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--accent-color)", display: "inline-block" }} />Alış
            </span>
            <span className="flex items-center gap-[5px]">
              <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--loss)", display: "inline-block" }} />Satış
            </span>
            <span className="flex items-center gap-[5px]">
              <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--info)", display: "inline-block" }} />Etkinlik
            </span>
          </div>
          <button
            onClick={() => setShowNew(true)}
            style={{ ...btnStyle, background: "var(--accent-color)", borderColor: "var(--accent-color)", color: "#fff", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Plus size={13} />Etkinlik Ekle
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
          background: "var(--border-soft)",
          border: "1px solid var(--border-soft)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {DOW.map((d) => (
          <div
            key={d}
            style={{
              background: "var(--bg-card-2)",
              padding: 10,
              fontSize: 10,
              fontWeight: 600,
              color: "var(--text-mute)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {d}
          </div>
        ))}
        {cells.map((d, i) => {
          const dayEvents = d != null ? (events[d] || []) : [];
          const isToday = d === today && month === 4;
          return (
            <div
              key={i}
              onClick={() => d && setPicked(d)}
              style={{
                background: d == null ? "var(--bg-elev)" : "var(--bg-card)",
                minHeight: 96,
                padding: 8,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                cursor: d ? "pointer" : "default",
                transition: "background .15s ease",
              }}
              onMouseEnter={(e) => d && ((e.currentTarget as HTMLDivElement).style.background = "var(--bg-hover)")}
              onMouseLeave={(e) => d && ((e.currentTarget as HTMLDivElement).style.background = "var(--bg-card)")}
            >
              {d != null && (
                <div
                  className="mono"
                  style={
                    isToday
                      ? {
                          fontSize: 11,
                          background: "var(--accent-color)",
                          color: "#fff",
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          fontWeight: 600,
                        }
                      : { fontSize: 11, color: "var(--text-dim)" }
                  }
                >
                  {d}
                </div>
              )}
              {dayEvents.slice(0, 3).map((ev, j) => (
                <div
                  key={j}
                  style={{
                    fontSize: 10,
                    padding: "2px 6px",
                    borderRadius: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    background:
                      ev.type === "sell"
                        ? "color-mix(in srgb, var(--loss) 14%, transparent)"
                        : ev.type === "note"
                        ? "color-mix(in srgb, var(--info) 14%, transparent)"
                        : "var(--accent-soft)",
                    color:
                      ev.type === "sell"
                        ? "var(--loss)"
                        : ev.type === "note"
                        ? "var(--info)"
                        : "var(--accent-color)",
                  }}
                >
                  {ev.label}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div style={{ fontSize: 10, color: "var(--text-mute)" }}>+{dayEvents.length - 3} daha</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Day modal */}
      {picked != null && (
        <ModalBackdrop onClose={() => setPicked(null)}>
          <div>
            <div className="flex justify-between items-start" style={{ marginBottom: 4 }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 600 }}>
                  {picked} {MONTH_NAMES[month]} {year}
                </h2>
                <div style={{ fontSize: 12, color: "var(--text-mute)", marginBottom: 16 }}>
                  {(events[picked] || []).length} etkinlik
                </div>
              </div>
              <button onClick={() => setPicked(null)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: 6 }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(events[picked] || []).map((ev, i) => (
                <div key={i} style={{ padding: 12, background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                  <TypeBadge type={ev.type} />
                  <span style={{ fontWeight: 500 }}>{ev.label}</span>
                  {ev.qty && <span className="mono" style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-dim)" }}>{ev.qty}</span>}
                </div>
              ))}
              {(!events[picked] || events[picked].length === 0) && (
                <div style={{ color: "var(--text-mute)", fontSize: 13, padding: 12 }}>Bu güne ait kayıt yok.</div>
              )}
            </div>
            <button style={{ marginTop: 12, width: "100%", padding: "9px", borderRadius: 8, border: "1px solid var(--accent-color)", background: "var(--accent-color)", color: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Plus size={13} />Bu güne etkinlik ekle
            </button>
          </div>
        </ModalBackdrop>
      )}

      {/* New event modal */}
      {showNew && (
        <ModalBackdrop onClose={() => setShowNew(false)}>
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 600 }}>Yeni Etkinlik</h2>
            <div style={{ fontSize: 12, color: "var(--text-mute)", marginBottom: 16 }}>Hatırlatma, haber veya not ekle</div>
            <Field label="Başlık">
              <input className="field-input" placeholder="Örn: BTC halving" />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
              <Field label="Tarih">
                <input className="field-input" type="date" defaultValue="2026-05-15" />
              </Field>
              <Field label="Kategori">
                <select className="field-input">
                  <option>Haber</option><option>Hatırlatma</option><option>Etkinlik</option>
                </select>
              </Field>
            </div>
            <div style={{ marginTop: 12, marginBottom: 16 }}>
              <Field label="Notlar">
                <textarea className="field-input" rows={3} style={{ resize: "none" }} />
              </Field>
            </div>
            <div className="flex gap-[8px]">
              <button onClick={() => setShowNew(false)} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>İptal</button>
              <button onClick={() => setShowNew(false)} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid var(--accent-color)", background: "var(--accent-color)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Kaydet</button>
            </div>
          </div>
        </ModalBackdrop>
      )}
      <style>{`.field-input { width: 100%; padding: 7px 10px; background: var(--bg-card); border: 1px solid var(--border-soft); border-radius: 8px; color: var(--text); font-size: 13px; outline: none; font-family: inherit; }`}</style>
    </div>
  );
}

const btnStyle: React.CSSProperties = { padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text)", cursor: "pointer", fontFamily: "inherit" };
const iconBtnStyle: React.CSSProperties = { ...btnStyle, padding: 7 };

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, [string, string]> = {
    buy:  ["var(--gain)",  "color-mix(in srgb, var(--gain) 12%, transparent)"],
    sell: ["var(--loss)",  "color-mix(in srgb, var(--loss) 12%, transparent)"],
    note: ["var(--info)",  "color-mix(in srgb, var(--info) 14%, transparent)"],
  };
  const [color, bg] = colors[type] || colors.note;
  const label = type === "buy" ? "Alış" : type === "sell" ? "Satış" : "Etkinlik";
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 999, color, background: bg }}>
      {label}
    </span>
  );
}

function ModalBackdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "#00000088", backdropFilter: "blur(4px)", zIndex: 100, display: "grid", placeItems: "center" }}
      onClick={onClose}
    >
      <div
        className="animate-modalIn"
        style={{ width: 460, maxWidth: "92vw", background: "var(--bg-elev)", border: "1px solid var(--border-color)", borderRadius: 14, padding: 22, boxShadow: "0 20px 60px #00000077" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
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
