import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

const rateSchema = z.object({
  taxRate: z.number().min(0).max(100),
});

export async function PUT(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = rateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Vergi oranı 0-100 arasında olmalı" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: auth.userId },
    data: { taxRate: parsed.data.taxRate },
    select: { taxRate: true },
  });

  return NextResponse.json({ taxRate: user.taxRate });
}
