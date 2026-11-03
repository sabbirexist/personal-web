"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { toast } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

interface MediaFile {
  url: string;
  name: string;
  size: number;
  kind: "image" | "video";
  folder: string;
}

const prettySize = (bytes: number) =>
  bytes > 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "image" | "video" | "uploads">("all");
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/media");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setFiles(json.files ?? []);
    } catch {
      toast("Could not load media.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function upload(list: FileList | null) {
    if (!list?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(list)) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Upload failed.");
      }
      toast("Upload complete");
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      toast("Copy failed — select the path manually.", "error");
    }
  }

  async function remove(url: string) {
    try {
      const res = await fetch(`/api/admin/media?path=${encodeURIComponent(url)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed.");
      setFiles((prev) => prev.filter((f) => f.url !== url));
      toast("File deleted");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Delete failed.", "error");
    }
  }

  const visible = files.filter((file) =>
    filter === "all" ? true : filter === "uploads" ? file.folder === "uploads" : file.kind === filter
  );

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          upload(e.dataTransfer.files);
        }}
        className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-line px-6 py-8 text-center transition-colors hover:border-accent/50"
      >
        <span className="grid size-10 place-items-center rounded-full bg-accent-soft text-accent">
          <Icon name={uploading ? "refresh" : "upload"} size={17} className={uploading ? "animate-spin" : ""} />
        </span>
        <p className="text-[0.86rem] font-medium text-ink">
          {uploading ? "Uploading…" : "Drop files to upload"}
        </p>
        <p className="text-[0.76rem] text-faint">
          jpg, png, webp, avif, gif, svg, mp4, webm — up to 30MB
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn btn-ghost btn-sm mt-1"
        >
          <Icon name="image" size={13} />
          Choose files
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            upload(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          {(["all", "image", "video", "uploads"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[0.76rem] capitalize transition-colors",
                filter === key
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-line text-muted hover:text-ink"
              )}
            >
              {key}
              <span className="ml-1.5 tabular-nums opacity-60">
                {key === "all"
                  ? files.length
                  : key === "uploads"
                    ? files.filter((f) => f.folder === "uploads").length
                    : files.filter((f) => f.kind === key).length}
              </span>
            </button>
          ))}
        </div>
        <p className="mono text-[8px] text-faint">Click a path to copy it</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton aspect-[4/3] w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((file) => (
            <div key={file.url} className="group overflow-hidden rounded-xl border border-line bg-card">
              <div className="relative aspect-[4/3] bg-card-2">
                {file.kind === "video" ? (
                  <video src={file.url} muted playsInline className="h-full w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={file.url} alt={file.name} loading="lazy" className="h-full w-full object-cover" />
                )}
                <span className="mono absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[7px] uppercase text-white/80 backdrop-blur">
                  {file.kind}
                </span>
              </div>
              <div className="p-2.5">
                <button
                  type="button"
                  onClick={() => copy(file.url)}
                  className="flex w-full items-center gap-1.5 text-left"
                  title={file.url}
                >
                  <Icon
                    name={copied === file.url ? "check" : "copy"}
                    size={11}
                    className={copied === file.url ? "text-accent-text" : "text-faint"}
                  />
                  <span className="mono truncate text-[8px] text-ink-soft">{file.url}</span>
                </button>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="mono text-[7.5px] text-faint">{prettySize(file.size)}</span>
                  {file.folder === "uploads" ? (
                    <button
                      type="button"
                      onClick={() => remove(file.url)}
                      className="text-faint transition-colors hover:text-red-400"
                      aria-label={`Delete ${file.name}`}
                    >
                      <Icon name="trash" size={12} />
                    </button>
                  ) : (
                    <span className="mono text-[7px] text-faint">seeded</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !visible.length && (
        <p className="py-10 text-center text-[0.82rem] text-faint">Nothing in this folder yet.</p>
      )}
    </div>
  );
}
