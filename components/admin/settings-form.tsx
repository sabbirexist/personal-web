"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteSettings } from "@/lib/types";
import { Field, SectionCard, SaveButton, Toggle, toast } from "@/components/admin/ui";
import { MediaField } from "@/components/admin/media-field";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

const accents: { key: SiteSettings["accent"]; label: string; color: string }[] = [
  { key: "ember", label: "Ember", color: "#FF5A1A" },
  { key: "tangerine", label: "Tangerine", color: "#FF7A18" },
  { key: "amber", label: "Amber", color: "#FFB03A" },
  { key: "coral", label: "Coral", color: "#FF6B4A" },
];

export function SettingsForm({ site }: { site: SiteSettings }) {
  const router = useRouter();
  const [form, setForm] = useState<SiteSettings>(site);
  const [bioText, setBioText] = useState(site.bio.join("\n\n"));
  const [keywords, setKeywords] = useState(site.seo.keywords.join(", "));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function chooseAccent(accent: SiteSettings["accent"]) {
    set("accent", accent);
    document.documentElement.dataset.accent = accent;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const payload = {
        ...form,
        bio: bioText
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean),
        seo: {
          ...form.seo,
          keywords: keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
        },
      };
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not save settings.");
      setSaved(true);
      toast("Settings saved");
      router.refresh();
      setTimeout(() => setSaved(false), 2200);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save settings.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <header className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mono mb-2 text-faint">Configuration</p>
          <h1 className="text-[1.75rem] font-semibold tracking-[-0.035em] text-ink">Site settings</h1>
          <p className="mt-2 text-[0.85rem] text-muted">
            Identity, copy, socials and theme. Everything here is reflected across the site.
          </p>
        </div>
        <SaveButton saving={saving} saved={saved} />
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <SectionCard title="Identity" description="The name, role and contact details.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" htmlFor="s-name">
                <input id="s-name" className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
              </Field>
              <Field label="Wordmark" htmlFor="s-wordmark" hint="Used in the logo and footer.">
                <input
                  id="s-wordmark"
                  className="input"
                  value={form.wordmark}
                  onChange={(e) => set("wordmark", e.target.value.toUpperCase())}
                />
              </Field>
              <Field label="Role" htmlFor="s-role">
                <input id="s-role" className="input" value={form.role} onChange={(e) => set("role", e.target.value)} />
              </Field>
              <Field label="Email" htmlFor="s-email">
                <input
                  id="s-email"
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>
              <Field label="Phone" htmlFor="s-phone">
                <input id="s-phone" className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </Field>
              <Field label="Location" htmlFor="s-location">
                <input
                  id="s-location"
                  className="input"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                />
              </Field>
              <Field label="Timezone" htmlFor="s-tz" hint="IANA name, e.g. Asia/Dhaka">
                <input
                  id="s-tz"
                  className="input"
                  value={form.timezone}
                  onChange={(e) => set("timezone", e.target.value)}
                />
              </Field>
              <Field label="Availability label" htmlFor="s-avail">
                <input
                  id="s-avail"
                  className="input"
                  value={form.availability}
                  onChange={(e) => set("availability", e.target.value)}
                />
              </Field>
            </div>
            <div className="mt-4 rounded-lg border border-line p-4">
              <Toggle
                checked={form.available}
                onChange={(v) => set("available", v)}
                label="Available for work"
                description="Shows a green status dot and the booking message across the site."
              />
            </div>
          </SectionCard>

          <SectionCard title="Hero" description="The first sentence people read.">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tagline" htmlFor="s-tagline" hint="Line before the accent word.">
                  <input
                    id="s-tagline"
                    className="input"
                    value={form.tagline}
                    onChange={(e) => set("tagline", e.target.value)}
                  />
                </Field>
                <Field label="Accent word" htmlFor="s-accent" hint="Rendered in italic serif.">
                  <input
                    id="s-accent"
                    className="input"
                    value={form.taglineAccent}
                    onChange={(e) => set("taglineAccent", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Intro paragraph" htmlFor="s-intro">
                <textarea
                  id="s-intro"
                  className="textarea min-h-[100px]"
                  value={form.intro}
                  onChange={(e) => set("intro", e.target.value)}
                />
              </Field>
              <div className="rounded-lg border border-line bg-[color-mix(in_oklab,var(--bg)_40%,transparent)] p-4 text-center">
                <p className="mono mb-2 text-[8px] text-faint">Live preview</p>
                <p className="display text-[1.5rem] leading-[0.95] text-ink">
                  {form.tagline}{" "}
                  <span className="serif italic text-accent-text">{form.taglineAccent}</span>
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="About" description="The story and the portrait.">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <MediaField
                  label="Portrait — 4:5"
                  value={form.portrait}
                  onChange={(v) => set("portrait", v)}
                  hint="Used in the hero card."
                />
                <MediaField
                  label="Portrait — square"
                  value={form.portraitSquare}
                  onChange={(v) => set("portraitSquare", v)}
                  hint="Used in the circular about."
                />
              </div>
              <Field label="Bio" htmlFor="s-bio" hint="One paragraph per block, blank line between.">
                <textarea
                  id="s-bio"
                  className="textarea min-h-[200px] font-mono text-[0.82rem]"
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Showreel" description="What plays when someone hits ‘Watch showreel’.">
            <div className="grid gap-4 sm:grid-cols-2">
              <MediaField
                label="Reel video"
                kind="video"
                value={form.reelUrl}
                onChange={(v) => set("reelUrl", v)}
                hint="mp4 or YouTube / Vimeo."
              />
              <MediaField
                label="Reel poster"
                value={form.reelPoster}
                onChange={(v) => set("reelPoster", v)}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Stats"
            description="The four numbers on the homepage."
            aside={
              <button
                type="button"
                onClick={() => set("stats", [...form.stats, { label: "", value: 0, suffix: "+" }])}
                className="text-[0.74rem] text-accent-text hover:underline"
              >
                + Add
              </button>
            }
          >
            <div className="space-y-2">
              {form.stats.map((stat, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <input
                      className="input h-9 text-[0.82rem]"
                      value={stat.label}
                      placeholder="Projects delivered"
                      onChange={(e) => {
                        const next = [...form.stats];
                        next[index] = { ...next[index], label: e.target.value };
                        set("stats", next);
                      }}
                    />
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      className="input h-9 text-[0.82rem]"
                      value={stat.value}
                      onChange={(e) => {
                        const next = [...form.stats];
                        next[index] = { ...next[index], value: Number(e.target.value) };
                        set("stats", next);
                      }}
                    />
                  </div>
                  <div className="w-16">
                    <input
                      className="input h-9 text-[0.82rem]"
                      value={stat.suffix}
                      placeholder="+"
                      onChange={(e) => {
                        const next = [...form.stats];
                        next[index] = { ...next[index], suffix: e.target.value };
                        set("stats", next);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => set("stats", form.stats.filter((_, i) => i !== index))}
                    className="grid size-9 shrink-0 place-items-center rounded-md border border-line text-faint hover:text-red-400"
                    aria-label="Remove stat"
                  >
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Socials"
            description="Links shown in the about and contact sections."
            aside={
              <button
                type="button"
                onClick={() => set("socials", [...form.socials, { label: "", url: "", handle: "" }])}
                className="text-[0.74rem] text-accent-text hover:underline"
              >
                + Add
              </button>
            }
          >
            <div className="space-y-2">
              {form.socials.map((social, index) => (
                <div key={index} className="flex flex-wrap items-start gap-2">
                  <div className="w-[104px]">
                    <input
                      className="input h-9 text-[0.82rem]"
                      value={social.label}
                      placeholder="Instagram"
                      onChange={(e) => {
                        const next = [...form.socials];
                        next[index] = { ...next[index], label: e.target.value };
                        set("socials", next);
                      }}
                    />
                  </div>
                  <div className="min-w-[160px] flex-1">
                    <input
                      className="input h-9 text-[0.82rem]"
                      value={social.url}
                      placeholder="https://instagram.com/…"
                      onChange={(e) => {
                        const next = [...form.socials];
                        next[index] = { ...next[index], url: e.target.value };
                        set("socials", next);
                      }}
                    />
                  </div>
                  <div className="w-[112px]">
                    <input
                      className="input h-9 text-[0.82rem]"
                      value={social.handle}
                      placeholder="@handle"
                      onChange={(e) => {
                        const next = [...form.socials];
                        next[index] = { ...next[index], handle: e.target.value };
                        set("socials", next);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => set("socials", form.socials.filter((_, i) => i !== index))}
                    className="grid size-9 shrink-0 place-items-center rounded-md border border-line text-faint hover:text-red-400"
                    aria-label="Remove social"
                  >
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="SEO" description="How the site appears in search and shares.">
            <div className="space-y-4">
              <Field label="Meta title" htmlFor="s-seo-title">
                <input
                  id="s-seo-title"
                  className="input"
                  value={form.seo.title}
                  onChange={(e) => set("seo", { ...form.seo, title: e.target.value })}
                />
              </Field>
              <Field label="Meta description" htmlFor="s-seo-desc" hint="Around 155 characters.">
                <textarea
                  id="s-seo-desc"
                  className="textarea min-h-[80px]"
                  value={form.seo.description}
                  onChange={(e) => set("seo", { ...form.seo, description: e.target.value })}
                />
              </Field>
              <Field label="Keywords" htmlFor="s-seo-keywords" hint="Comma separated.">
                <input
                  id="s-seo-keywords"
                  className="input"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </Field>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Appearance" description="The single accent colour.">
            <div className="grid grid-cols-2 gap-2">
              {accents.map((accent) => (
                <button
                  key={accent.key}
                  type="button"
                  onClick={() => chooseAccent(accent.key)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors",
                    form.accent === accent.key ? "border-accent bg-accent-soft" : "border-line hover:border-line-strong"
                  )}
                >
                  <span
                    className="size-5 rounded-full"
                    style={{ background: accent.color }}
                    aria-hidden="true"
                  />
                  <span className="text-[0.78rem] text-ink capitalize">{accent.label}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[0.72rem] leading-relaxed text-faint">
              Saved with the rest of the settings. Each preset has a tuned light-mode variant.
            </p>
            <div className="mt-4 rounded-lg border border-line p-3">
              <p className="mono mb-2 text-[8px] text-faint">Buttons</p>
              <div className="flex flex-wrap gap-2">
                <span className="btn btn-primary btn-sm pointer-events-none">Primary</span>
                <span className="btn btn-ghost btn-sm pointer-events-none">Ghost</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Footer" description="The closing line.">
            <Field label="Footer note" htmlFor="s-footer">
              <textarea
                id="s-footer"
                className="textarea min-h-[80px]"
                value={form.footerNote}
                onChange={(e) => set("footerNote", e.target.value)}
              />
            </Field>
          </SectionCard>

          <div className="admin-card space-y-3 p-5">
            <p className="mono text-[8px] text-faint">SEO preview</p>
            <div className="rounded-lg border border-line p-3">
              <p className="text-[0.8rem] font-medium text-accent-text line-clamp-2">{form.seo.title}</p>
              <p className="mt-1 text-[0.7rem] text-faint">localhost:3007</p>
              <p className="mt-1 line-clamp-3 text-[0.72rem] leading-relaxed text-muted">
                {form.seo.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-line pt-5">
        <SaveButton saving={saving} saved={saved} />
      </div>
    </form>
  );
}
