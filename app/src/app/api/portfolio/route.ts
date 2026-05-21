import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { fetchPrices } from "@/lib/prices";

const assetSchema = z.object({
  symbol: z.string().min(1).max(20).toUpperCase(),
  amount: z.number().positive(),
});

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assets = await prisma.portfolioAsset.findMany({
    where: { userId: auth.userId },
    orderBy: { symbol: "asc" },
  });

  if (assets.length === 0) {
    return NextResponse.json({ assets: [], totalValue: 0, change24hUSD: 0, change24hPct: 0 });
  }

  const symbols = assets.map((a) => a.symbol);
  const [prices, buyTrades] = await Promise.all([
    fetchPrices(symbols),
    prisma.trade.findMany({ where: { userId: auth.userId, type: "BUY" } }),
  ]);

  const priceMap = new Map(prices.map((p) => [p.symbol, p]));

  // Ortalama alış fiyatı: trade geçmişinden VWAP
  const avgMap = new Map<string, { cost: number; qty: number }>();
  for (const t of buyTrades) {
    const e = avgMap.get(t.symbol) ?? { cost: 0, qty: 0 };
    e.cost += t.price * t.amount;
    e.qty += t.amount;
    avgMap.set(t.symbol, e);
  }

  let totalValue = 0;
  let totalChange24hUSD = 0;

  const enriched = assets.map((a) => {
    const p = priceMap.get(a.symbol);
    const value = p ? a.amount * p.price : 0;
    const change24h = p ? a.amount * p.change24hUSD : 0;
    const avgEntry = avgMap.get(a.symbol);
    const avgPrice = avgEntry && avgEntry.qty > 0 ? avgEntry.cost / avgEntry.qty : 0;
    totalValue += value;
    totalChange24hUSD += change24h;
    return {
      ...a,
      currentPrice: p?.price ?? null,
      value,
      change24hUSD: change24h,
      change24hPct: p?.change24hPct ?? null,
      avgPrice,
    };
  });

  const prevTotal = totalValue - totalChange24hUSD;
  const change24hPct = prevTotal > 0 ? (totalChange24hUSD / prevTotal) * 100 : 0;

  return NextResponse.json({ assets: enriched, totalValue, change24hUSD: totalChange24hUSD, change24hPct });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = assetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz veri", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { symbol, amount } = parsed.data;

  const asset = await prisma.portfolioAsset.upsert({
    where: { userId_symbol: { userId: auth.userId, symbol } },
    update: { amount },
    create: { userId: auth.userId, symbol, amount },
  });

  return NextResponse.json({ asset }, { status: 201 });
}
