import fs from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const mimeByExt: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif"
};

function uploadsDir(): string {
  return process.env.PORTFOLIO_UPLOADS_PATH || path.resolve(process.cwd(), "public", "uploads");
}

type Context = {
  params: Promise<{ filename: string }>;
};

export async function GET(_: NextRequest, context: Context) {
  const { filename } = await context.params;
  const safeName = path.basename(filename);
  const filePath = path.join(uploadsDir(), safeName);
  const extension = safeName.split(".").pop()?.toLowerCase() || "";

  try {
    const content = await fs.readFile(filePath);
    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": mimeByExt[extension] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
}

