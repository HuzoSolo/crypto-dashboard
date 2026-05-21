import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { FinanceType } from "@/generated/prisma/client";

const entrySchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1).max(64),
  amount: z.number().positive(),
  date: z.string().datetime(),
  description: z.string().max(500).optional(),
});

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type") as FinanceType | null;
  const category = searchParams.get("category");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const entries = await prisma.financeEntry.findMany({
    where: {
      userId: auth.userId,
      ...(type && { type }),
      ...(category && { category }),
      ...((from || to) && {
        date: {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        },
      }),
    },
    orderBy: { date: "desc" },
  });

  const totalIncome = entries
    .filter((e) => e.type === "INCOME")
    .reduce((s, e) => s + e.amount, 0);
  const totalExpense = entries
    .filter((e) => e.type === "EXPENSE")
    .reduce((s, e) => s + e.amount, 0);

  return NextResponse.json({ entries, totalIncome, totalExpense, net: totalIncome - totalExpense });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = entrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz veri", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const entry = await prisma.financeEntry.create({
    data: {
      userId: auth.userId,
      ...parsed.data,
      date: new Date(parsed.data.date),
    },
  });

  return NextResponse.json({ entry }, { status: 201 });
}
