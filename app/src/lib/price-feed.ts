"use client";

import { useEffect, useMemo } from "react";
import { useStore } from "@/lib/store";

export function usePriceFeed(intervalMs = 15000) {
  const watchlistItems = useStore((s) => s.watchlistItems);
  const holdings = useStore((s) => s.holdings);
  const fetchPricesForSymbols = useStore((s) => s.fetchPricesForSymbols);

  const symbols = useMemo(() => {
    const set = new Set([
      ...watchlistItems.map((w) => w.symbol),
      ...holdings.map((h) => h.sym),
    ]);
    return [...set];
  }, [watchlistItems, holdings]);

  const symbolsKey = symbols.sort().join(",");

  useEffect(() => {
    if (symbols.length === 0) return;
    fetchPricesForSymbols(symbols);
    const id = setInterval(() => fetchPricesForSymbols(symbols), intervalMs);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbolsKey, intervalMs]);
}
