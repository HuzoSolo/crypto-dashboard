import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { computeFIFO } from "@/lib/fifo";

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const yearParam = req.nextUrl.searchParams.get("year");
  const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

  if (isNaN(year)) {
    return NextResponse.json({ error: "Geçersiz yıl" }, { status: 400 });
  }

  const [trades, user] = await Promise.all([
    prisma.trade.findMany({ where: { userId: auth.userId }, orderBy: { date: "asc" } }),
    prisma.user.findUnique({ where: { id: auth.userId }, select: { taxRate: true } }),
  ]);

  const taxRate = user?.taxRate ?? 20;
  const lots = computeFIFO(trades, year, taxRate);

  const totalGain = lots.filter((l) => l.pnl > 0).reduce((s, l) => s + l.pnl, 0);
  const totalLoss = lots.filter((l) => l.pnl < 0).reduce((s, l) => s + l.pnl, 0);
  const netPnl = totalGain + totalLoss;
  const estimatedTax = lots.reduce((s, l) => s + l.tax, 0);

  return NextResponse.json({ year, taxRate, lots, totalGain, totalLoss, netPnl, estimatedTax });
}
