import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { guard } from "@/lib/api";
import { slugify } from "@/lib/utils";
import { put } from "@vercel/blob";
import { uploadsEnabled } from "@/lib/store";

const MAX_BYTES = 30 * 1024 * 1024;
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg", ".mp4", ".webm"]);

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Upload failed — try a smaller file." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is larger than 30MB." }, { status: 413 });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED.has(ext)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use jpg, png, webp, avif, gif, svg, mp4 or webm." },
      { status: 415 }
    );
  }

  const base = slugify(path.basename(file.name, ext)) || "asset";
  const filename = `${base}-${Date.now().toString(36)}${ext}`;

  if (uploadsEnabled()) {
    const blob = await put(`uploads/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || undefined,
      cacheControlMaxAge: 31536000,
    });
    return NextResponse.json({ ok: true, url: blob.url, name: file.name, size: file.size });
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buffer);

  return NextResponse.json({
    ok: true,
    url: `/uploads/${filename}`,
    name: file.name,
    size: file.size,
  });
}
