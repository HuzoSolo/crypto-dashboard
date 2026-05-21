import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

const syncSchema = z.object({
  apiKey: z.string().min(1),
  apiSecret: z.string().min(1),
  symbol: z.string().min(1).max(20).toUpperCase().optional(),
});

interface BinanceTrade {
  symbol: string;
  orderId: number;
  time: number;
  isBuyer: boolean;
  qty: string;
  price: string;
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = syncSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "API anahtarı gerekli" }, { status: 400 });
  }

  const { apiKey, apiSecret, symbol } = parsed.data;
  const targetSymbol = symbol ? `${symbol}USDT` : "BTCUSDT";

  // HMAC imzası
  const timestamp = Date.now();
  const queryString = `symbol=${targetSymbol}&timestamp=${timestamp}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(apiSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(queryString)
  );
  const signature = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const url = `https://api.binance.com/api/v3/myTrades?${queryString}&signature=${signature}`;
  const res = await fetch(url, { headers: { "X-MBX-APIKEY": apiKey } });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json(
      { error: "Binance API hatası", detail: err },
      { status: 502 }
    );
  }

  const binanceTrades: BinanceTrade[] = await res.json();
  let created = 0;

  for (const bt of binanceTrades) {
    const sym = bt.symbol.replace(/USDT$/, "");
    const date = new Date(bt.time);
    const type = bt.isBuyer ? "BUY" : "SELL";

    const existing = await prisma.trade.findFirst({
      where: {
        userId: auth.userId,
        symbol: sym,
        date,
        type,
        amount: parseFloat(bt.qty),
        price: parseFloat(bt.price),
      },
    });

    if (!existing) {
      const trade = await prisma.trade.create({
        data: {
          userId: auth.userId,
          symbol: sym,
          type,
          date,
          amount: parseFloat(bt.qty),
          price: parseFloat(bt.price),
          exchange: "Binance",
        },
      });

      await prisma.calendarEvent.create({
        data: {
          userId: auth.userId,
          title: `${type === "BUY" ? "Alım" : "Satım"}: ${sym}`,
          date,
          type: "TRADE",
          tradeId: trade.id,
        },
      });

      created++;
    }
  }

  return NextResponse.json({ synced: binanceTrades.length, created });
}
