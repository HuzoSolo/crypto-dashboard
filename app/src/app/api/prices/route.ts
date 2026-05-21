import { NextRequest, NextResponse } from "next/server";
import { fetchPrices } from "@/lib/prices";

// Public endpoint — auth gerekmez (piyasa verisi)
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("symbols") ?? "";
  const symbols = raw
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  if (symbols.length === 0) {
    return NextResponse.json({ error: "symbols parametresi gerekli" }, { status: 400 });
  }

  const prices = await fetchPrices(symbols);
  return NextResponse.json(prices);
}
