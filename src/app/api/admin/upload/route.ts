import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

const typeToExtension: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif"
};

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await request.formData();
  const file = data.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "File is required" }, { status: 400 });
  }

  const extension = typeToExtension[file.type];
  if (!extension) {
    return NextResponse.json({ message: "Only image uploads are allowed" }, { status: 400 });
  }

  const fileName = `art_${Date.now()}_${randomUUID().slice(0, 6)}.${extension}`;
  const uploadDir = path.resolve(process.cwd(), "public", "uploads");
  const targetPath = path.join(uploadDir, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(targetPath, bytes);

  return NextResponse.json({ path: `/uploads/${fileName}` });
}
