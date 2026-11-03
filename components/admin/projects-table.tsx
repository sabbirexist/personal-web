"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Project } from "@/lib/types";
import { Icon } from "@/components/icons";
import { toast, EmptyState } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function persistOrder(ids: string[]) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "projects", ids }),
      });
      if (!res.ok) throw new Error("Could not reorder.");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not reorder.", "error");
    } finally {
      setBusy(false);
    }
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...projects];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    persistOrder(next.map((p) => p.id));
  }

  async function remove(id: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed.");
      toast("Project deleted");
      setConfirmId(null);
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Delete failed.", "error");
    } finally {
      setBusy(false);
    }
  }

  if (!projects.length) {
    return (
      <EmptyState
        title="No projects yet"
        description="Add your first case study — a poster, a summary and the film are enough to start."
        action={
          <Link href="/admin/projects/new" className="btn btn-primary btn-sm mt-2">
            <Icon name="plus" size={14} />
            New project
          </Link>
        }
      />
    );
  }

  return (
    <div className="admin-card overflow-hidden">
      <div className="hidden grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 border-b border-line px-4 py-3 md:grid">
        <span className="mono w-[74px] text-[8px] text-faint">Order</span>
        <span className="mono text-[8px] text-faint">Project</span>
        <span className="mono w-24 text-[8px] text-faint">Category</span>
        <span className="mono w-12 text-[8px] text-faint">Year</span>
        <span className="mono w-[112px] text-right text-[8px] text-faint">Actions</span>
      </div>

      <ul className="divide-y divide-line">
        {projects.map((project, index) => (
          <li key={project.id} className="group">
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 transition-colors hover:bg-[color-mix(in_oklab,var(--ink)_3%,transparent)]">
              <div className="flex w-[74px] shrink-0 items-center gap-1">
                <span className="mono mr-1 text-[9px] text-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0 || busy}
                  className="grid size-6 place-items-center rounded border border-line text-faint transition-colors hover:text-ink disabled:opacity-25"
                  aria-label={`Move ${project.title} up`}
                >
                  <Icon name="arrowUp" size={11} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === projects.length - 1 || busy}
                  className="grid size-6 place-items-center rounded border border-line text-faint transition-colors hover:text-ink disabled:opacity-25"
                  aria-label={`Move ${project.title} down`}
                >
                  <Icon name="arrowDown" size={11} />
                </button>
              </div>

              <Link
                href={`/admin/projects/${project.id}`}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.poster}
                  alt=""
                  className="h-11 w-[70px] shrink-0 rounded-md border border-line object-cover"
                />
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[0.87rem] font-medium text-ink">
                      {project.title}
                    </span>
                    {project.featured && <span className="badge badge-accent">Featured</span>}
                  </span>
                  <span className="mono mt-0.5 block truncate text-[8px] text-faint">
                    /work/{project.slug}
                  </span>
                </span>
              </Link>

              <span className="hidden w-24 truncate text-[0.78rem] text-muted md:block">
                {project.category}
              </span>
              <span className="mono hidden w-12 text-[9px] text-faint md:block">{project.year}</span>

              <div className="flex w-[112px] shrink-0 items-center justify-end gap-1">
                <Link
                  href={`/work/${project.slug}`}
                  target="_blank"
                  className="grid size-7 place-items-center rounded text-faint transition-colors hover:text-ink"
                  aria-label="View live project"
                >
                  <Icon name="external" size={13} />
                </Link>
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="grid size-7 place-items-center rounded text-faint transition-colors hover:text-accent-text"
                  aria-label={`Edit ${project.title}`}
                >
                  <Icon name="pencil" size={13} />
                </Link>
                {confirmId === project.id ? (
                  <span className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => remove(project.id)}
                      disabled={busy}
                      className="rounded bg-red-500/15 px-1.5 py-1 text-[0.65rem] font-semibold text-red-400"
                    >
                      Sure?
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(null)}
                      className="text-[0.65rem] text-faint"
                    >
                      No
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmId(project.id)}
                    className={cn(
                      "grid size-7 place-items-center rounded text-faint transition-colors hover:text-red-400"
                    )}
                    aria-label={`Delete ${project.title}`}
                  >
                    <Icon name="trash" size={13} />
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
