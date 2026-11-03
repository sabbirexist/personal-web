export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export type Embed =
  | { kind: "iframe"; src: string }
  | { kind: "video"; src: string }
  | { kind: "none" };

/** Turns a YouTube / Vimeo / direct-file URL into something we can render. */
export function resolveVideo(url: string | undefined | null): Embed {
  const raw = (url ?? "").trim();
  if (!raw) return { kind: "none" };

  const yt = raw.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i);
  if (yt) {
    return {
      kind: "iframe",
      src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
    };
  }
  const vimeo = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeo) {
    return { kind: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&title=0&byline=0` };
  }
  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(raw) || raw.startsWith("/")) {
    return { kind: "video", src: raw };
  }
  return { kind: "iframe", src: raw };
}

export function isVideoFile(url: string): boolean {
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(url);
}

export function pick<T>(list: T[], index: number): T {
  return list[index % list.length];
}
