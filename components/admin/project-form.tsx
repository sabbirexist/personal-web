"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Project } from "@/lib/types";
import { Field, SectionCard, SaveButton, Toggle, toast } from "@/components/admin/ui";
import { GalleryField, MediaField } from "@/components/admin/media-field";
import { Icon } from "@/components/icons";
import { slugify } from "@/lib/utils";

type Draft = Omit<Project, "body" | "tools"> & { bodyText: string; toolsText: string };

function toDraft(project?: Project): Draft {
  return {
    id: project?.id ?? "",
    slug: project?.slug ?? "",
    title: project?.title ?? "",
    subtitle: project?.subtitle ?? "",
    category: project?.category ?? "Brand Film",
    year: project?.year ?? String(new Date().getFullYear()),
    client: project?.client ?? "",
    role: project?.role ?? "",
    summary: project?.summary ?? "",
    poster: project?.poster ?? "",
    videoUrl: project?.videoUrl ?? "",
    previewUrl: project?.previewUrl ?? "",
    gallery: project?.gallery ?? [],
    featured: project?.featured ?? false,
    size: project?.size ?? "half",
    results: project?.results ?? [],
    order: project?.order ?? 99,
    bodyText: (project?.body ?? []).join("\n\n"),
    toolsText: (project?.tools ?? []).join(", "),
  };
}

const categories = [
  "Brand Film",
  "Commercial",
  "Motion Graphics",
  "Social",
  "Branding",
  "Documentary",
  "Fashion",
  "3D & VFX",
  "Music Video",
];

export function ProjectForm({ project, isNew }: { project?: Project; isNew?: boolean }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(() => toDraft(project));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(project));

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.title.trim()) {
      toast("Give the project a title first.", "error");
      return;
    }
    setSaving(true);
    setSaved(false);

    const payload = {
      ...draft,
      slug: slugify(draft.slug || draft.title),
      body: draft.bodyText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      tools: draft.toolsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch(
        isNew ? "/api/admin/projects" : `/api/admin/projects/${project?.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not save.");

      setSaved(true);
      toast(isNew ? "Project created" : "Project saved");
      router.refresh();

      if (isNew && json.item?.id) {
        router.push(`/admin/projects/${json.item.id}`);
      }
      setTimeout(() => setSaved(false), 2200);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!project) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed.");
      toast("Project deleted");
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Delete failed.", "error");
      setDeleting(false);
    }
  }

  const previewSlug = slugify(draft.slug || draft.title || "new-project");

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/admin/projects"
            className="mono mb-3 inline-flex items-center gap-1.5 text-[9px] text-faint transition-colors hover:text-ink"
          >
            <Icon name="arrowLeft" size={11} />
            All projects
          </Link>
          <h1 className="text-[1.6rem] font-semibold tracking-[-0.035em] text-ink">
            {isNew ? "New project" : draft.title || "Edit project"}
          </h1>
          <p className="mono mt-2 text-[9px] text-faint">
            /work/<span className="text-accent-text">{previewSlug}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!isNew && (
            <>
              <a
                href={`/work/${project?.slug}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-sm"
              >
                <Icon name="external" size={13} />
                View live
              </a>
              <button
                type="button"
                onClick={remove}
                disabled={deleting}
                className="btn btn-ghost btn-sm text-red-400 hover:border-red-500/40"
              >
                <Icon name="trash" size={13} />
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </>
          )}
          <SaveButton saving={saving} saved={saved} label={isNew ? "Create project" : "Save changes"} />
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <SectionCard title="Identity" description="How the project is titled and filed.">
            <div className="space-y-4">
              <Field label="Title" htmlFor="p-title" required>
                <input
                  id="p-title"
                  className="input"
                  value={draft.title}
                  onChange={(e) => {
                    set("title", e.target.value);
                    if (!slugTouched) set("slug", slugify(e.target.value));
                  }}
                  placeholder="Aether"
                  required
                />
              </Field>

              <Field label="Subtitle" htmlFor="p-subtitle">
                <input
                  id="p-subtitle"
                  className="input"
                  value={draft.subtitle}
                  onChange={(e) => set("subtitle", e.target.value)}
                  placeholder="Cinematic Brand Film"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Slug" htmlFor="p-slug" hint="Used in the URL — lowercase and hyphens.">
                  <input
                    id="p-slug"
                    className="input"
                    value={draft.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set("slug", e.target.value);
                    }}
                    placeholder="aether-brand-film"
                  />
                </Field>
                <Field label="Year" htmlFor="p-year">
                  <input
                    id="p-year"
                    className="input"
                    value={draft.year}
                    onChange={(e) => set("year", e.target.value)}
                    placeholder="2026"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Category" htmlFor="p-category">
                  <input
                    id="p-category"
                    className="input"
                    list="category-options"
                    value={draft.category}
                    onChange={(e) => set("category", e.target.value)}
                    placeholder="Brand Film"
                  />
                  <datalist id="category-options">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </Field>
                <Field label="Client" htmlFor="p-client">
                  <input
                    id="p-client"
                    className="input"
                    value={draft.client}
                    onChange={(e) => set("client", e.target.value)}
                    placeholder="Aether Studios"
                  />
                </Field>
              </div>

              <Field label="Role" htmlFor="p-role" hint="Shown in the case study credits.">
                <input
                  id="p-role"
                  className="input"
                  value={draft.role}
                  onChange={(e) => set("role", e.target.value)}
                  placeholder="Editor · Colorist · Motion"
                />
              </Field>

              <Field label="Tools" htmlFor="p-tools" hint="Comma separated.">
                <input
                  id="p-tools"
                  className="input"
                  value={draft.toolsText}
                  onChange={(e) => set("toolsText", e.target.value)}
                  placeholder="Premiere Pro, DaVinci Resolve, After Effects"
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Story" description="The one-liner and the case study itself.">
            <div className="space-y-4">
              <Field label="Summary" htmlFor="p-summary" hint="One sentence used on cards and previews.">
                <textarea
                  id="p-summary"
                  className="textarea min-h-[80px]"
                  value={draft.summary}
                  onChange={(e) => set("summary", e.target.value)}
                  placeholder="A 90-second manifesto film — cut to breathe, graded to glow."
                />
              </Field>
              <Field
                label="Case study body"
                htmlFor="p-body"
                hint="One paragraph per block. Leave a blank line between paragraphs."
              >
                <textarea
                  id="p-body"
                  className="textarea min-h-[220px] font-mono text-[0.82rem] leading-relaxed"
                  value={draft.bodyText}
                  onChange={(e) => set("bodyText", e.target.value)}
                  placeholder={"The brief was simple: make light feel emotional.\n\nWe shot for two nights across three locations..."}
                />
              </Field>
            </div>

            <div className="mt-5 border-t border-line pt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="field-label mb-0">Results</span>
                <button
                  type="button"
                  onClick={() => set("results", [...draft.results, { label: "", value: "" }])}
                  className="text-[0.74rem] text-accent-text hover:underline"
                >
                  + Add result
                </button>
              </div>
              <div className="space-y-2">
                {draft.results.map((result, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <input
                        className="input h-9 text-[0.82rem]"
                        value={result.label}
                        placeholder="Watch-through"
                        onChange={(e) => {
                          const next = [...draft.results];
                          next[index] = { ...next[index], label: e.target.value };
                          set("results", next);
                        }}
                      />
                    </div>
                    <div className="w-28">
                      <input
                        className="input h-9 text-[0.82rem]"
                        value={result.value}
                        placeholder="+38%"
                        onChange={(e) => {
                          const next = [...draft.results];
                          next[index] = { ...next[index], value: e.target.value };
                          set("results", next);
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => set("results", draft.results.filter((_, i) => i !== index))}
                      className="grid size-9 shrink-0 place-items-center rounded-md border border-line text-faint hover:text-red-400"
                      aria-label="Remove result"
                    >
                      <Icon name="trash" size={13} />
                    </button>
                  </div>
                ))}
                {!draft.results.length && (
                  <p className="text-[0.76rem] text-faint">Optional — a few numbers make a case study land.</p>
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Media" description="Poster first. Then the film, preview loop and stills.">
            <div className="space-y-4">
              <MediaField
                label="Poster image"
                value={draft.poster}
                onChange={(v) => set("poster", v)}
                hint="16:10 landscape recommended (1600×1000)."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <MediaField
                  label="Main film"
                  kind="video"
                  value={draft.videoUrl}
                  onChange={(v) => set("videoUrl", v)}
                  hint="mp4 or a YouTube / Vimeo URL."
                />
                <MediaField
                  label="Hover preview loop"
                  kind="video"
                  value={draft.previewUrl}
                  onChange={(v) => set("previewUrl", v)}
                  hint="Short muted mp4, under 2MB."
                />
              </div>
              <GalleryField value={draft.gallery} onChange={(v) => set("gallery", v)} />
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Publishing">
            <div className="space-y-5">
              <Toggle
                checked={draft.featured}
                onChange={(v) => set("featured", v)}
                label="Featured"
                description="Pinned to the top of the work grid."
              />
              <Field label="Card size" htmlFor="p-size" hint="Wide cards span the full row.">
                <select
                  id="p-size"
                  className="select"
                  value={draft.size}
                  onChange={(e) => set("size", e.target.value as Project["size"])}
                >
                  <option value="half">Half — pairs with another card</option>
                  <option value="wide">Wide — full row</option>
                </select>
              </Field>
              <Field label="Sort order" htmlFor="p-order" hint="Lower numbers come first.">
                <input
                  id="p-order"
                  type="number"
                  className="input"
                  value={draft.order}
                  onChange={(e) => set("order", Number(e.target.value))}
                />
              </Field>
            </div>
          </SectionCard>

          <div className="admin-card space-y-3 p-5">
            <p className="mono text-[8px] text-faint">Preview</p>
            <div className="overflow-hidden rounded-lg border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={draft.poster || "/work/ember.webp"}
                alt=""
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="bg-card p-3">
                <p className="text-[0.86rem] font-medium text-ink">{draft.title || "Untitled"}</p>
                <p className="mono mt-1 text-[8px] text-faint">
                  {draft.category || "Category"} · {draft.year || "Year"}
                </p>
              </div>
            </div>
            <p className="text-[0.74rem] leading-relaxed text-faint">
              Saved content appears on the public site immediately.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-line pt-5">
        <Link href="/admin/projects" className="btn btn-ghost btn-sm">
          Cancel
        </Link>
        <SaveButton saving={saving} saved={saved} label={isNew ? "Create project" : "Save changes"} />
      </div>
    </form>
  );
}
