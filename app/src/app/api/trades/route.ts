import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { TradeType } from "@/generated/prisma/client";

const tradeSchema = z.object({
  symbol: z.string().min(1).max(20).toUpperCase(),
  type: z.enum(["BUY", "SELL"]),
  date: z.string().datetime(),
  amount: z.number().positive(),
  price: z.number().positive(),
  exchange: z.string().max(64).optional(),
  note: z.string().max(500).optional(),
});

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const symbol = searchParams.get("symbol")?.toUpperCase();
  const type = searchParams.get("type") as TradeType | null;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const trades = await prisma.trade.findMany({
    where: {
      userId: auth.userId,
      ...(symbol && { symbol }),
      ...(type && { type }),
      ...((from || to) && {
        date: {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        },
      }),
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ trades });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = tradeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz veri", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const trade = await prisma.trade.create({
    data: { userId: auth.userId, ...parsed.data, date: new Date(parsed.data.date) },
  });

  // Trade takvime otomatik yansıt
  await prisma.calendarEvent.create({
    data: {
      userId: auth.userId,
      title: `${parsed.data.type === "BUY" ? "Alım" : "Satım"}: ${parsed.data.symbol}`,
      date: new Date(parsed.data.date),
      type: "TRADE",
      tradeId: trade.id,
    },
  });

  return NextResponse.json({ trade }, { status: 201 });
}
