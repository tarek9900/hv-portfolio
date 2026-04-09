import { NextResponse } from "next/server";
import { readPortfolioItems } from "@/lib/portfolio-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await readPortfolioItems();
  return NextResponse.json({ items });
}
