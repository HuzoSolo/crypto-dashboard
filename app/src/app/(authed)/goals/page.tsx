"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Target, AlertTriangle, X } from "lucide-react";
import { useStore } from "@/lib/store";

const NOW = new Date("2026-05-05");

function onTrack(g: { current: number; target: number; deadline: string }) {
  const dl = new Date(g.deadline);
  const total = (dl.getTime() - new Date("2026-01-01").getTime()) / 86400000;
  const elapsed = (NOW.getTime() - new Date("2026-01-01").getTime()) / 86400000;
  const expected = (elapsed / total) * 100;
  const actual = (g.current / g.target) * 100;
  return actual >= expected - 8;
}

export default function GoalsPage() {
  const goals = useStore((s) => s.goals);
  const [showNew, setShowNew] = useState(false);

  const atRisk = goals.filter((g) => !onTrack(g)).length;

  return (
    <div className="animate-fadeIn" style={{ padding: "20px 24px 40px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="flex items-baseline gap-[12px] mb-[4px]">
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>Hedefler</h1>
        <span style={{ color: "var(--text-mute)", fontSize: 13 }}>
          {goals.length} aktif hedef · {atRisk} risk altında
        </span>
      </div>

      {/* Toolbar */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: 14, padding: 14 }}>
        <div className="flex items-center gap-[8px]">
          {["Aktif (4)", "Tamamlanmış (2)", "Arşiv"].map((label, i) => (
            <button
              key={label}
              style={{
                fontSize: 11, padding: "5px 10px", borderRadius: 999, border: "1px solid",
                borderColor: i === 0 ? "transparent" : "var(--border-soft)",
                background: i === 0 ? "var(--accent-soft)" : "var(--bg-card)",
                color: i === 0 ? "var(--accent-color)" : "var(--text-dim)",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {label}
            </button>
          ))}
          <span style={{ flex: 1 }} />
          <button
            onClick={() => setShowNew(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "1px solid var(--accent-color)", background: "var(--accent-color)", color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px #16a34a30" }}
          >
            <Plus size={13} />Yeni Hedef
          </button>
        </div>
      </div>

      {/* Goal cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {goals.map((g) => {
          const pct = Math.min(100, (g.current / g.target) * 100);
          const ok = onTrack(g);
          const projDate = ok
            ? new Date(new Date(g.deadline).getTime() - 12 * 86400000).toISOString().slice(0, 10)
            : "Gecikme";
          return (
            <div
              key={g.id}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-soft)",
                borderRadius: 14,
                padding: 18,
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex justify-between items-start gap-[8px]">
                <div style={{ minWidth: 0 }}>
                  <div className="flex items-center gap-[6px]" style={{ fontSize: 11, color: "var(--text-mute)", whiteSpace: "nowrap" }}>
                    <Target size={11} />
                    Hedef · {g.priority === "high" ? "Yüksek" : g.priority === "med" ? "Orta" : "Düşük"} öncelik
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 600, marginTop: 4, letterSpacing: "-0.01em" }}>{g.name}</div>
                </div>
                {ok ? (
                  <span className="inline-flex items-center gap-[4px]" style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 999, color: "var(--gain)", background: "color-mix(in srgb, var(--gain) 12%, transparent)", whiteSpace: "nowrap" }}>
                    <span className="live-dot" />Hedefe uygun
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-[4px]" style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 999, color: "var(--warn)", background: "color-mix(in srgb, var(--warn) 14%, transparent)", whiteSpace: "nowrap" }}>
                    <AlertTriangle size={10} />Risk altında
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-[8px]" style={{ marginTop: 18, whiteSpace: "nowrap" }}>
                <div className="mono" style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em" }}>
                  ${g.current.toLocaleString()}
                </div>
                <div className="mono" style={{ color: "var(--text-mute)", fontSize: 13 }}>
                  / ${g.target.toLocaleString()}
                </div>
                <div className="mono" style={{ marginLeft: "auto", fontSize: 13, fontWeight: 600 }}>
                  {pct.toFixed(0)}%
                </div>
              </div>

              <div style={{ height: 8, background: "var(--bg-hover)", borderRadius: 999, overflow: "hidden", marginTop: 10, position: "relative" }}>
                <span
                  style={{
                    display: "block",
                    height: "100%",
                    width: pct + "%",
                    background: ok
                      ? "linear-gradient(90deg, var(--accent-grad-1), var(--accent-grad-2))"
                      : "linear-gradient(90deg, #f59e0b, #d97706)",
                    borderRadius: 999,
                    transition: "width .8s cubic-bezier(.2,.8,.2,1)",
                  }}
                />
              </div>

              <div className="flex justify-between" style={{ marginTop: 14, fontSize: 12, color: "var(--text-dim)", gap: 12 }}>
                <div style={{ whiteSpace: "nowrap" }}>
                  <div style={{ fontSize: 10, color: "var(--text-mute)" }}>Son tarih</div>
                  <div className="mono" style={{ marginTop: 2, fontWeight: 500 }}>{g.deadline}</div>
                </div>
                <div style={{ whiteSpace: "nowrap" }}>
                  <div style={{ fontSize: 10, color: "var(--text-mute)" }}>Tahmini</div>
                  <div className="mono" style={{ marginTop: 2, fontWeight: 500 }}>{projDate}</div>
                </div>
                <div style={{ whiteSpace: "nowrap" }}>
                  <div style={{ fontSize: 10, color: "var(--text-mute)" }}>Kalan</div>
                  <div className="mono" style={{ marginTop: 2, fontWeight: 500 }}>${(g.target - g.current).toLocaleString()}</div>
                </div>
                <div className="flex gap-[4px]">
                  <button style={{ display: "grid", placeItems: "center", width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", color: "var(--text-dim)", cursor: "pointer" }}>
                    <Pencil size={13} />
                  </button>
                  <button style={{ display: "grid", placeItems: "center", width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", color: "var(--loss)", cursor: "pointer" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showNew && (
        <div
          style={{ position: "fixed", inset: 0, background: "#00000088", backdropFilter: "blur(4px)", zIndex: 100, display: "grid", placeItems: "center" }}
          onClick={() => setShowNew(false)}
        >
          <div
            className="animate-modalIn"
            style={{ width: 460, maxWidth: "92vw", background: "var(--bg-elev)", border: "1px solid var(--border-color)", borderRadius: 14, padding: 22, boxShadow: "0 20px 60px #00000077" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start" style={{ marginBottom: 4 }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 600 }}>Yeni Hedef</h2>
                <div style={{ fontSize: 12, color: "var(--text-mute)", marginBottom: 16 }}>Bir kâr hedefi belirle ve ilerlemeyi takip et</div>
              </div>
              <button onClick={() => setShowNew(false)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: 6 }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: "var(--text-mute)", fontWeight: 500 }}>Hedef adı</label>
              <input style={{ width: "100%", padding: "7px 10px", background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: 8, color: "var(--text)", fontSize: 13, outline: "none", fontFamily: "inherit" }} placeholder="Örn: 2026 Yıl Sonu Kâr" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, color: "var(--text-mute)", fontWeight: 500 }}>Hedef miktar (USD)</label>
                <input className="mono" style={{ width: "100%", padding: "7px 10px", background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: 8, color: "var(--text)", fontSize: 13, outline: "none", fontFamily: "inherit" }} placeholder="10000" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, color: "var(--text-mute)", fontWeight: 500 }}>Son tarih</label>
                <input type="date" defaultValue="2026-12-31" style={{ width: "100%", padding: "7px 10px", background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: 8, color: "var(--text)", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: "var(--text-mute)", fontWeight: 500, display: "block", marginBottom: 4 }}>Öncelik</label>
              <div className="flex gap-[8px]">
                {["Yüksek", "Orta", "Düşük"].map((p) => (
                  <button key={p} style={{ flex: 1, padding: "5px 10px", borderRadius: 999, border: "1px solid var(--border-soft)", background: "var(--bg-card)", color: "var(--text-dim)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{p}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-[8px]">
              <button onClick={() => setShowNew(false)} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>İptal</button>
              <button onClick={() => setShowNew(false)} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid var(--accent-color)", background: "var(--accent-color)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Hedef Oluştur</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
