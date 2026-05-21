import { Trade } from "@/generated/prisma/client";

export interface TaxLotResult {
  date: Date;
  symbol: string;
  buyPrice: number;
  sellPrice: number;
  amount: number;
  pnl: number;
  tax: number;
}

interface BuyLot {
  price: number;
  remaining: number;
}

export function computeFIFO(
  trades: Trade[],
  year: number,
  taxRate: number
): TaxLotResult[] {
  // Tüm BUY'ları coin bazlı kuyruğa ekle (yıldan bağımsız — önceki yıllar da gerekli)
  const buyQueues = new Map<string, BuyLot[]>();

  trades
    .filter((t) => t.type === "BUY")
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .forEach((t) => {
      const q = buyQueues.get(t.symbol) ?? [];
      q.push({ price: t.price, remaining: t.amount });
      buyQueues.set(t.symbol, q);
    });

  const results: TaxLotResult[] = [];

  trades
    .filter((t) => t.type === "SELL" && t.date.getFullYear() === year)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .forEach((sell) => {
      let remaining = sell.amount;
      const queue = buyQueues.get(sell.symbol) ?? [];

      while (remaining > 0 && queue.length > 0) {
        const lot = queue[0];
        const matched = Math.min(lot.remaining, remaining);
        const pnl = (sell.price - lot.price) * matched;

        results.push({
          date: sell.date,
          symbol: sell.symbol,
          buyPrice: lot.price,
          sellPrice: sell.price,
          amount: matched,
          pnl,
          tax: pnl > 0 ? pnl * (taxRate / 100) : 0,
        });

        lot.remaining -= matched;
        remaining -= matched;
        if (lot.remaining === 0) queue.shift();
      }
    });

  return results;
}
