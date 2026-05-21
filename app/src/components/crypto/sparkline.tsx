"use client";

import { useId, useEffect, useState, useRef } from "react";

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  fill?: boolean;
  strokeW?: number;
}

export function Sparkline({
  data,
  color = "#22c55e",
  height = 32,
  fill = true,
  strokeW = 1.5,
}: SparklineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(120);
  const id = useId();

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(() => {
      if (ref.current) setW(ref.current.clientWidth);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    height - 4 - ((v - min) / range) * (height - 8),
  ]);

  const path = pts
    .map(([x, y], i) =>
      i ? `L${x.toFixed(1)} ${y.toFixed(1)}` : `M${x.toFixed(1)} ${y.toFixed(1)}`
    )
    .join(" ");

  const fillPath = `${path} L${w} ${height} L0 ${height} Z`;

  return (
    <div ref={ref} style={{ width: "100%", height }}>
      <svg
        viewBox={`0 0 ${w} ${height}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height }}
      >
        <defs>
          <linearGradient id={`sp-${id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {fill && <path d={fillPath} fill={`url(#sp-${id})`} stroke="none" />}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="spark-line"
        />
      </svg>
    </div>
  );
}
