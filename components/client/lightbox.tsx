"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { resolveVideo } from "@/lib/utils";

interface LightboxPayload {
  src: string;
  poster?: string;
  title?: string;
  subtitle?: string;
}

/**
 * Any element with data-video="url" opens the reel lightbox.
 * Server-rendered pages stay server-rendered; the listener is delegated.
 */
export function LightboxHost() {
  const [active, setActive] = useState<LightboxPayload | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>("[data-video]");
      if (!trigger) return;
      const src = trigger.dataset.video;
      if (!src) return;
      event.preventDefault();
      restoreFocus.current = document.activeElement as HTMLElement;
      setActive({
        src,
        poster: trigger.dataset.poster,
        title: trigger.dataset.title,
        subtitle: trigger.dataset.subtitle,
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    document.body.classList.remove("is-locked");
    restoreFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!active) return;
    document.body.classList.add("is-locked");
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-locked");
    };
  }, [active, close]);

  if (!active) return null;
  const embed = resolveVideo(active.src);

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={active.title ? `${active.title} — video player` : "Video player"}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal-panel">
        <div className="mb-4 flex items-end justify-between gap-4 px-1">
          <div className="min-w-0">
            {active.subtitle && (
              <p className="mono mb-2 text-accent-text">{active.subtitle}</p>
            )}
            <p className="truncate text-lg font-medium tracking-tight text-white">
              {active.title ?? "Showreel"}
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={close}
            className="icon-btn shrink-0 border-white/20 text-white hover:bg-white/10"
            aria-label="Close video"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="frame aspect-video w-full bg-black shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
          {embed.kind === "video" && (
            <video
              key={embed.src}
              src={embed.src}
              poster={active.poster}
              controls
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />
          )}
          {embed.kind === "iframe" && (
            <iframe
              src={embed.src}
              title={active.title ?? "Video"}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          )}
          {embed.kind === "none" && (
            <div className="grid h-full place-items-center p-8 text-center text-sm text-white/60">
              No video attached to this project yet.
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-center gap-2 px-1">
          <span className="mono text-white/35">Press</span>
          <kbd className="rounded border border-white/20 px-1.5 py-0.5 text-[10px] text-white/60">ESC</kbd>
          <span className="mono text-white/35">to close</span>
        </div>
      </div>
    </div>
  );
}
