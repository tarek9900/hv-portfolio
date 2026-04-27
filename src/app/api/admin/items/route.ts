import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { buildArtworkPayload } from "@/lib/admin-item";
import { readPortfolioItems, writePortfolioItems } from "@/lib/portfolio-store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const items = await readPortfolioItems();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const items = await readPortfolioItems();
  const created = buildArtworkPayload(payload);

  items.push(created);
  await writePortfolioItems(items);

  return NextResponse.json({ item: created }, { status: 201 });
}
