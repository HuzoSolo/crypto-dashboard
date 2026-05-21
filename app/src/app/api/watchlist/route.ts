import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

const addSchema = z.object({
  symbol: z.string().min(1).max(20).toUpperCase(),
});

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.watchlistItem.findMany({
    where: { userId: auth.userId },
    orderBy: { symbol: "asc" },
  });

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz sembol" }, { status: 400 });
  }

  const { symbol } = parsed.data;

  const item = await prisma.watchlistItem.upsert({
    where: { userId_symbol: { userId: auth.userId, symbol } },
    update: {},
    create: { userId: auth.userId, symbol },
  });

  return NextResponse.json({ item }, { status: 201 });
}
