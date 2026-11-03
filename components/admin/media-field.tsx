"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { toast } from "@/components/admin/ui";

export function MediaField({
  label,
  value,
  onChange,
  kind = "image",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  kind?: "image" | "video";
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Upload failed.");
      onChange(json.url);
      toast("File uploaded");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      setError(message);
      toast(message, "error");
    } finally {
      setUploading(false);
    }
  }

  const isVideo = kind === "video" || /\.(mp4|webm|mov)(\?.*)?$/i.test(value);

  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="flex gap-3">
        <div className="relative grid h-[70px] w-[104px] shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-card-2">
          {value ? (
            isVideo ? (
              <video src={value} muted playsInline preload="metadata" className="h-full w-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="h-full w-full object-cover" />
            )
          ) : (
            <Icon name={kind === "video" ? "film" : "image"} size={18} className="text-faint" />
          )}
          {uploading && (
            <span className="absolute inset-0 grid place-items-center bg-bg/70">
              <span className="size-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            className="input h-[38px] text-[0.82rem]"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={kind === "video" ? "/media/loop.mp4 or a YouTube link" : "/uploads/poster.jpg"}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="btn btn-ghost btn-xs"
            >
              <Icon name="upload" size={12} />
              {uploading ? "Uploading…" : "Upload"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-[0.74rem] text-faint transition-colors hover:text-red-400"
              >
                Clear
              </button>
            )}
            {error && <span className="text-[0.72rem] text-red-400">{error}</span>}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={kind === "video" ? "video/*" : "image/*"}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>
      {hint && <p className="mt-1.5 text-[0.72rem] text-faint">{hint}</p>}
    </div>
  );
}

export function GalleryField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="field-label mb-0">Gallery</span>
        <button
          type="button"
          onClick={() => onChange([...value, ""])}
          className="text-[0.74rem] text-accent-text hover:underline"
        >
          + Add image
        </button>
      </div>
      <div className="space-y-3">
        {value.map((src, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1">
              <MediaField
                label={`Image ${index + 1}`}
                value={src}
                onChange={(next) => {
                  const copy = [...value];
                  copy[index] = next;
                  onChange(copy);
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              className="mt-6 grid size-8 shrink-0 place-items-center rounded-md border border-line text-faint transition-colors hover:border-red-500/40 hover:text-red-400"
              aria-label={`Remove image ${index + 1}`}
            >
              <Icon name="trash" size={13} />
            </button>
          </div>
        ))}
        {!value.length && (
          <p className={cn("rounded-lg border border-dashed border-line px-3 py-6 text-center text-[0.78rem] text-faint")}>
            No gallery images yet — case studies look better with 2–3 stills.
          </p>
        )}
      </div>
    </div>
  );
}
