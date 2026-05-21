"use client";

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
  usePriceFeed(1800);

  const pathname = usePathname();
  const prices = useStore((s) => s.prices);
  const holdings = useStore((s) => s.holdings);

  const totalValue = holdings.reduce((s, h) => s + (prices[h.sym] ?? 0) * h.qty, 0);
  const totalDelta = 2.34;

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
