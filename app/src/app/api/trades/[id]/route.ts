import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const trade = await prisma.trade.findUnique({ where: { id } });
  if (!trade || trade.userId !== auth.userId) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }

  // Takvim kaydını da sil (cascade yok, tradeId unique)
  await prisma.calendarEvent.deleteMany({ where: { tradeId: id } });
  await prisma.trade.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
