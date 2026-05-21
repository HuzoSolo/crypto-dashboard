"use client";

interface DonutSlice {
  key: string;
  value: number;
  color: string;
  label?: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  size?: number;
  thick?: number;
  hoveredKey?: string | null;
  onHover?: (key: string | null) => void;
}

export function DonutChart({
  data,
  size = 180,
  thick = 26,
  hoveredKey,
  onHover,
}: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2;
  const inner = r - thick;
  let acc = 0;

  const slices = data.map((d) => {
    const start = acc / total;
    const end = (acc + d.value) / total;
    acc += d.value;
    const a0 = start * Math.PI * 2 - Math.PI / 2;
    const a1 = end * Math.PI * 2 - Math.PI / 2;
    const large = end - start > 0.5 ? 1 : 0;
    const x0 = r + r * Math.cos(a0), y0 = r + r * Math.sin(a0);
    const x1 = r + r * Math.cos(a1), y1 = r + r * Math.sin(a1);
    const xi0 = r + inner * Math.cos(a0), yi0 = r + inner * Math.sin(a0);
    const xi1 = r + inner * Math.cos(a1), yi1 = r + inner * Math.sin(a1);
    return {
      ...d,
      d: `M${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} L${xi1} ${yi1} A${inner} ${inner} 0 ${large} 0 ${xi0} ${yi0} Z`,
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: "visible" }}
    >
      {slices.map((s) => (
        <path
          key={s.key}
          d={s.d}
          fill={s.color}
          opacity={hoveredKey == null || hoveredKey === s.key ? 1 : 0.32}
          style={{
            transition: "opacity .2s ease, transform .2s ease",
            cursor: "pointer",
            transformOrigin: `${r}px ${r}px`,
            transform: hoveredKey === s.key ? "scale(1.04)" : "scale(1)",
          }}
          onMouseEnter={() => onHover?.(s.key)}
          onMouseLeave={() => onHover?.(null)}
        />
      ))}
    </svg>
  );
}
