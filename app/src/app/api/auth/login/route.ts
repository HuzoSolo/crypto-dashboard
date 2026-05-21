import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  signToken,
  setAuthCookie,
  checkRateLimit,
  recordFailedAttempt,
  resetAttempts,
} from "@/lib/auth";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Kullanıcı adı ve parola gerekli" }, { status: 400 });
  }

  const { username, password } = parsed.data;

  const rateLimit = checkRateLimit(username);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Çok fazla başarısız giriş. ${rateLimit.retryAfter} saniye bekleyin.` },
      { status: 429 }
    );
  }

  const user = await prisma.user.findUnique({ where: { username } });
  const valid = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !valid) {
    recordFailedAttempt(username);
    return NextResponse.json({ error: "Kullanıcı adı veya parola hatalı" }, { status: 401 });
  }

  resetAttempts(username);

  const token = await signToken(user.id);
  await setAuthCookie(token);

  return NextResponse.json({ user: { id: user.id, username: user.username } });
}
