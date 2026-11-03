import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { del, list } from "@vercel/blob";
import { guard } from "@/lib/api";
import { blobEnabled } from "@/lib/store";

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif|svg)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov)$/i;

interface MediaFile {
  url: string;
  name: string;
  size: number;
  kind: "image" | "video";
  folder: string;
}

async function listFolder(folder: string): Promise<MediaFile[]> {
  const dir = path.join(process.cwd(), "public", folder);
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries
        .filter((entry) => entry.isFile() && !entry.name.startsWith("."))
        .map(async (entry) => {
          const stat = await fs.stat(path.join(dir, entry.name));
          const kind = IMAGE_EXT.test(entry.name)
            ? "image"
            : VIDEO_EXT.test(entry.name)
              ? "video"
              : null;
          if (!kind) return null;
          return {
            url: `/${folder}/${entry.name}`,
            name: entry.name,
            size: stat.size,
            kind,
            folder,
          } satisfies MediaFile;
        })
    );
    return files
      .filter((file): file is MediaFile => Boolean(file))
      .sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;

  const [uploads, work, media] = await Promise.all([
    listFolder("uploads"),
    listFolder("work"),
    listFolder("media"),
  ]);

  let blobUploads: MediaFile[] = [];
  if (blobEnabled()) {
    try {
      const { blobs } = await list({ prefix: "uploads/" });
      blobUploads = blobs.map((blob) => {
        const name = blob.pathname.split("/").pop() || blob.pathname;
        const kind = IMAGE_EXT.test(name) ? "image" : "video";
        return { url: blob.url, name, size: blob.size, kind, folder: "uploads" } satisfies MediaFile;
      });
    } catch {
      blobUploads = [];
    }
  }

  return NextResponse.json({ files: [...media, ...blobUploads, ...uploads, ...work] });
}

export async function DELETE(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const url = new URL(request.url);
  const target = url.searchParams.get("path") ?? "";

  if (blobEnabled() && /^https?:\/\//.test(target)) {
    try {
      await del(target);
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }
  }

  if (!target.startsWith("/uploads/")) {
    return NextResponse.json({ error: "Only uploaded files can be deleted." }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(process.cwd(), "public", path.normalize(target));
  if (!filePath.startsWith(uploadsDir)) {
    return NextResponse.json({ error: "Invalid path." }, { status: 400 });
  }

  try {
    await fs.unlink(filePath);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }
}
