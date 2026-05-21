interface BarSetItem {
  label: string;
  income: number;
  expense: number;
}

interface BarSetProps {
  data: BarSetItem[];
  height?: number;
}

export function BarSet({ data, height = 180 }: BarSetProps) {
  const max = Math.max(...data.flatMap((d) => [d.income, d.expense]));

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height, padding: "8px 0" }}>
      {data.map((d) => (
        <div
          key={d.label}
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}
        >
          <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: height - 28 }}>
            <div
              style={{
                width: 14,
                height: `${(d.income / max) * 100}%`,
                background: "linear-gradient(180deg, var(--gain), color-mix(in srgb, var(--gain) 60%, transparent))",
                borderRadius: "4px 4px 1px 1px",
                transition: "height .8s cubic-bezier(.2,.8,.2,1)",
              }}
            />
            <div
              style={{
                width: 14,
                height: `${(d.expense / max) * 100}%`,
                background: "linear-gradient(180deg, var(--loss), color-mix(in srgb, var(--loss) 60%, transparent))",
                borderRadius: "4px 4px 1px 1px",
                transition: "height .8s cubic-bezier(.2,.8,.2,1)",
              }}
            />
          </div>
          <div className="mono" style={{ fontSize: 10, color: "var(--text-mute)" }}>
            {d.label}
          </div>
        </div>
      ))}
    </div>
  );
}
