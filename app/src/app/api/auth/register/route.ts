import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signToken, setAuthCookie } from "@/lib/auth";

const schema = z.object({
  username: z.string().min(3).max(32),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz veri", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { username, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ error: "Bu kullanıcı adı zaten alınmış" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { username, password: hash },
    select: { id: true, username: true, taxRate: true },
  });

  const token = await signToken(user.id);
  await setAuthCookie(token);

  return NextResponse.json({ user }, { status: 201 });
}
