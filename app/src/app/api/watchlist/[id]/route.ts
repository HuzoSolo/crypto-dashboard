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

  const item = await prisma.watchlistItem.findUnique({ where: { id } });
  if (!item || item.userId !== auth.userId) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }

  await prisma.watchlistItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
