"use client";

import { useEffect, useRef, useState } from "react";

interface TickerProps {
  value: number;
  format?: (v: number) => string;
  duration?: number;
  className?: string;
}

export function Ticker({
  value,
  format = (v) => v.toFixed(2),
  duration = 600,
  className,
}: TickerProps) {
  const [v, setV] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const start = prev.current;
    const end = value;
    const t0 = performance.now();
    let raf: number;

    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - k, 3);
      setV(start + (end - start) * e);
      if (k < 1) raf = requestAnimationFrame(step);
      else prev.current = end;
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span className={`mono ${className ?? ""}`}>{format(v)}</span>;
}
