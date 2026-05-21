import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { FinanceType } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type") as FinanceType | null;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const entries = await prisma.financeEntry.findMany({
    where: {
      userId: auth.userId,
      ...(type && { type }),
      ...((from || to) && {
        date: {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        },
      }),
    },
    orderBy: { date: "asc" },
  });

  const header = "Tarih,Tür,Kategori,Tutar (USD),Açıklama\n";
  const rows = entries
    .map((e) =>
      [
        e.date.toISOString().split("T")[0],
        e.type,
        `"${e.category}"`,
        e.amount.toFixed(2),
        `"${(e.description ?? "").replace(/"/g, '""')}"`,
      ].join(",")
    )
    .join("\n");

  return new NextResponse(header + rows, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="finance-export.csv"`,
    },
  });
}
