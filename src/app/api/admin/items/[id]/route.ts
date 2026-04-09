import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { buildArtworkPayload } from "@/lib/admin-item";
import { readPortfolioItems, writePortfolioItems } from "@/lib/portfolio-store";

export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: Context) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const payload = (await request.json()) as Record<string, unknown>;
  const items = await readPortfolioItems();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const updated = buildArtworkPayload(payload, items[index]);
  items[index] = updated;
  await writePortfolioItems(items);

  return NextResponse.json({ item: updated });
}

export async function DELETE(_: NextRequest, context: Context) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const items = await readPortfolioItems();
  const remaining = items.filter((item) => item.id !== id);

  if (remaining.length === items.length) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  await writePortfolioItems(remaining);
  return NextResponse.json({ ok: true });
}
