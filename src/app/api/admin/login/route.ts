import { NextRequest, NextResponse } from "next/server";
import { adminCookieName, getAdminPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { password?: string };
  const password = (body.password ?? "").trim();

  if (password !== getAdminPassword()) {
    return NextResponse.json({ ok: false, message: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
