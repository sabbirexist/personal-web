"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/lib/types";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

function HoverPreview({ src, poster, active }: { src: string; poster: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!active) {
      v.pause();
      return;
    }
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!v.getAttribute("src")) v.setAttribute("src", src);
    v.play()
      .then(() => setReady(true))
      .catch(() => undefined);
  }, [active, src]);

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
          ready ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const full = project.size === "wide";
  const [hover, setHover] = useState(false);

  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn(
        "work-card group relative block overflow-hidden rounded-[var(--radius-md)] border border-line bg-card-2",
        full ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[4/3] md:aspect-[4/3]"
      )}
      aria-label={`${project.title} — ${project.subtitle}`}
      onPointerEnter={(e) => {
        if (e.pointerType === "touch") return;
        setHover(true);
      }}
      onPointerLeave={() => setHover(false)}
    >
      <div className="work-media absolute inset-0">
        {project.previewUrl ? (
          <HoverPreview src={project.previewUrl} poster={project.poster} active={hover} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.poster}
            alt={`${project.title} — ${project.subtitle}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/35" />
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(60% 60% at 50% 100%, var(--accent-soft), transparent)" }} />

      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <span className="mono text-[10px] text-white/55">
            {String(index + 1).padStart(2, "0")} / {project.category}
          </span>
          <span className="mono text-[10px] text-white/55">{project.year}</span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h3 className="work-title display text-[clamp(1.4rem,3vw,2.3rem)] text-white">
              {project.title}
            </h3>
            <p className="mt-1 truncate text-[0.82rem] text-white/60">{project.subtitle}</p>
          </div>
          <span className="card-arrow grid size-11 shrink-0 place-items-center rounded-full border border-white/25 text-white sm:size-12">
            <Icon name="arrowUpRight" size={19} />
          </span>
        </div>
      </div>

      <span className="card-play absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/25 text-white">
        <Icon name="play" size={20} className="ml-0.5" />
      </span>
    </Link>
  );
}

function packRows(projects: Project[]): Project[][] {
  const rows: Project[][] = [];
  let pending: Project[] = [];
  for (const p of projects) {
    if (p.size === "wide") {
      if (pending.length) {
        rows.push(pending);
        pending = [];
      }
      rows.push([p]);
    } else {
      pending.push(p);
      if (pending.length === 2) {
        rows.push(pending);
        pending = [];
      }
    }
  }
  if (pending.length) rows.push(pending);
  return rows;
}

export function WorkExplorer({
  projects,
  showFilter = true,
  idPrefix = "",
}: {
  projects: Project[];
  showFilter?: boolean;
  idPrefix?: string;
}) {
  const [filter, setFilter] = useState("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );
  const visible = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects]
  );
  const rows = useMemo(() => packRows(visible), [visible]);

  return (
    <div id={`${idPrefix}work-grid`}>
      {showFilter && (
        <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:flex-wrap md:items-center md:justify-between">
          <div
            className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
            style={{
              maskImage: "linear-gradient(to right, black 92%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, black 92%, transparent)",
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                aria-pressed={filter === cat}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-[0.8rem] transition-all duration-300",
                  filter === cat
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-line text-muted hover:border-line-strong hover:text-ink"
                )}
              >
                {cat}
                {filter === cat && (
                  <span className="ml-2 tabular-nums opacity-60">{visible.length}</span>
                )}
              </button>
            ))}
          </div>
          <p className="mono hidden text-faint md:block md:text-right">
            {String(visible.length).padStart(2, "0")} selected{" "}
            {filter === "All" ? "works" : "in view"}
          </p>
        </div>
      )}

      <div key={filter} className="flex flex-col gap-3 sm:gap-4">
        {rows.map((row, rowIndex) => (
          <div
            key={row.map((p) => p.id).join("-") || rowIndex}
            className="grid gap-3 sm:gap-4 md:grid-cols-2"
          >
            {row.map((project, i) => (
              <div
                key={project.id}
                className={cn(row.length === 1 && "md:col-span-2")}
                style={{
                  animation: "rise .7s cubic-bezier(.16,1,.3,1) both",
                  animationDelay: `${(rowIndex * 2 + i) * 55}ms`,
                }}
              >
                <ProjectCard project={project} index={projects.findIndex((p) => p.id === project.id)} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {!visible.length && (
        <p className="py-16 text-center text-muted">Nothing here yet — check back soon.</p>
      )}
    </div>
  );
}
