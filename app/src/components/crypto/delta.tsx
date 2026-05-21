import { cn } from "@/lib/utils";
import { fmtPct, fmtUSD } from "@/lib/fmt";

interface DeltaProps {
  value: number;
  format?: "pct" | "usd" | "num";
  size?: "sm" | "lg";
  className?: string;
}

export function Delta({ value, format = "pct", size = "sm", className }: DeltaProps) {
  const cls = value > 0 ? "gain" : value < 0 ? "loss" : "neutral";
  const ic = value > 0 ? "▲" : value < 0 ? "▼" : "·";

  let out: string;
  if (format === "pct") out = fmtPct(value);
  else if (format === "usd")
    out = (value >= 0 ? "+" : "−") + "$" + Math.abs(value).toFixed(2);
  else out = value.toFixed(2);

  const colors: Record<string, string> = {
    gain: "var(--gain)",
    loss: "var(--loss)",
    neutral: "var(--text-dim)",
  };

  const bgs: Record<string, string> = {
    gain: "color-mix(in srgb, var(--gain) 12%, transparent)",
    loss: "color-mix(in srgb, var(--loss) 12%, transparent)",
    neutral: "var(--chip-bg)",
  };

  return (
    <span
      className={cn("mono inline-flex items-center gap-[3px] font-semibold", className)}
      style={{
        fontSize: size === "lg" ? 13 : 12,
        color: colors[cls],
        background: bgs[cls],
        padding: "2px 7px",
        borderRadius: 6,
      }}
    >
      <span style={{ fontSize: 8 }}>{ic}</span>
      {out}
    </span>
  );
}
