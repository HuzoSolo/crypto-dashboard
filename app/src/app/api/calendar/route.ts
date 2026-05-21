import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

const eventSchema = z.object({
  title: z.string().min(1).max(128),
  date: z.string().datetime(),
  description: z.string().max(500).optional(),
});

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const events = await prisma.calendarEvent.findMany({
    where: {
      userId: auth.userId,
      ...((from || to) && {
        date: {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        },
      }),
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz veri", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const event = await prisma.calendarEvent.create({
    data: {
      userId: auth.userId,
      ...parsed.data,
      date: new Date(parsed.data.date),
      type: "MANUAL",
    },
  });

  return NextResponse.json({ event }, { status: 201 });
}
