import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

const goalSchema = z.object({
  name: z.string().min(1).max(128),
  targetUSD: z.number().positive(),
  deadline: z.string().datetime(),
});

// Hedef ilerlemesi: gerçekleşen kâr (sadece SELL işlemleri baz alınır)
async function computeProgress(userId: string): Promise<number> {
  const sells = await prisma.trade.findMany({
    where: { userId, type: "SELL" },
    orderBy: { date: "asc" },
  });

  // Basit yaklaşım: tüm satışların USDT toplam değeri − ortalama alış maliyeti
  // Tam FIFO ilerleme için Tax modülü kullanılır; burada hızlı özet yeterli
  const totalSellValue = sells.reduce((sum, t) => sum + t.amount * t.price, 0);
  return totalSellValue;
}

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const goals = await prisma.goal.findMany({
    where: { userId: auth.userId },
    orderBy: { deadline: "asc" },
  });

  const totalPnl = await computeProgress(auth.userId);

  const goalsWithProgress = goals.map((g) => ({
    ...g,
    currentUSD: totalPnl,
    progressPct: Math.min(100, (totalPnl / g.targetUSD) * 100),
    onTrack: totalPnl / g.targetUSD >= 0.5, // basit heuristic
  }));

  return NextResponse.json({ goals: goalsWithProgress });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = goalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz veri", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const goal = await prisma.goal.create({
    data: {
      userId: auth.userId,
      ...parsed.data,
      deadline: new Date(parsed.data.deadline),
    },
  });

  return NextResponse.json({ goal }, { status: 201 });
}
