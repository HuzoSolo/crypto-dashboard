import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

const updateSchema = z.object({
  amount: z.number().positive(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const asset = await prisma.portfolioAsset.findUnique({ where: { id } });
  if (!asset || asset.userId !== auth.userId) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz miktar" }, { status: 400 });
  }

  const updated = await prisma.portfolioAsset.update({
    where: { id },
    data: { amount: parsed.data.amount },
  });

  return NextResponse.json({ asset: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const asset = await prisma.portfolioAsset.findUnique({ where: { id } });
  if (!asset || asset.userId !== auth.userId) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }

  await prisma.portfolioAsset.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
