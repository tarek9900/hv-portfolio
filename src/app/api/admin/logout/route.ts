import { NextResponse } from "next/server";
import { adminCookieName } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, "", {
    path: "/",
    maxAge: 0
  });
  return response;
}
