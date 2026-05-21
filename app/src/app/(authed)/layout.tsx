"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/shell/sidebar";
import { Header } from "@/components/shell/header";
import { useStore } from "@/lib/store";
import { usePriceFeed } from "@/lib/price-feed";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":      "Ana Sayfa",
  "/watchlist":      "Varlık Listesi",
  "/portfolio":      "Cüzdan",
  "/trades":         "İşlemler",
  "/calendar":       "Takvim",
  "/goals":          "Hedefler",
  "/income-expense": "Gelir & Gider",
  "/tax":            "Vergi",
};

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  const fetchPortfolio = useStore((s) => s.fetchPortfolio);
  const fetchWatchlist = useStore((s) => s.fetchWatchlist);
  const fetchCurrentUser = useStore((s) => s.fetchCurrentUser);

  useEffect(() => {
    fetchCurrentUser();
    fetchPortfolio();
    fetchWatchlist();
  }, []);

  usePriceFeed(15000);

  const pathname = usePathname();
  const prices = useStore((s) => s.prices);
  const holdings = useStore((s) => s.holdings);
  const portfolioMeta = useStore((s) => s.portfolioMeta);

  const totalValue = portfolioMeta.totalValue ||
    holdings.reduce((s, h) => s + (prices[h.sym] ?? 0) * h.qty, 0);
  const totalDelta = portfolioMeta.change24hPct;

  const pageTitle = PAGE_TITLES[pathname] ?? "Cryptolio";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "232px 1fr",
        minHeight: "100vh",
        background: "var(--bg)",
      }}
    >
      <Sidebar totalValue={totalValue} totalDelta={totalDelta} />
      <div className="flex flex-col min-w-0">
        <Header pageTitle={pageTitle} />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
