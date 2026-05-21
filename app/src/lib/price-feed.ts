"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { INITIAL_PRICES } from "@/lib/data";

export function usePriceFeed(intervalMs = 1800) {
  const setPrices = useStore((s) => s.setPrices);

  useEffect(() => {
    const id = setInterval(() => {
      setPrices(
        Object.fromEntries(
          Object.entries(useStore.getState().prices).map(([k, v]) => {
            const drift = (Math.random() - 0.5) * 2 * 0.0015;
            return [k, Math.max(0.0001, v * (1 + drift))];
          })
        )
      );
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, setPrices]);
}

export { INITIAL_PRICES };
