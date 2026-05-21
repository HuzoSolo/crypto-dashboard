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

  const event = await prisma.calendarEvent.findUnique({ where: { id } });
  if (!event || event.userId !== auth.userId) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }

  if (event.type === "TRADE") {
    return NextResponse.json(
      { error: "Trade kaynaklı etkinlikler trade silinerek kaldırılır" },
      { status: 400 }
    );
  }

  await prisma.calendarEvent.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
