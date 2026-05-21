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

  const header = "Tarih,Coin,Alış Fiyatı (USDT),Satış Fiyatı (USDT),Adet,Kâr/Zarar (USD),Vergi Tutarı (USD)\n";
  const rows = lots
    .map((l) =>
      [
        l.date.toISOString().split("T")[0],
        l.symbol,
        l.buyPrice.toFixed(4),
        l.sellPrice.toFixed(4),
        l.amount.toFixed(8),
        l.pnl.toFixed(2),
        l.tax.toFixed(2),
      ].join(",")
    )
    .join("\n");

  return new NextResponse(header + rows, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tax-${year}.csv"`,
    },
  });
}
