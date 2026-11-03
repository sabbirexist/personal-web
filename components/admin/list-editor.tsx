"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { Field, SaveButton, SectionCard, toast, EmptyState } from "@/components/admin/ui";
import { MediaField } from "@/components/admin/media-field";

export type EditorField = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "lines" | "number" | "media";
  placeholder?: string;
  hint?: string;
  full?: boolean;
};

type Item = Record<string, unknown> & { id: string };

export function ListEditor({
  collection,
  items: initialItems,
  fields,
  title,
  description,
  singular,
  addLabel,
  requiredKey = "title",
}: {
  collection: string;
  items: Item[];
  fields: EditorField[];
  title: string;
  description: string;
  singular: string;
  addLabel: string;
  requiredKey?: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  function update(index: number, key: string, value: unknown) {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
    setDirty(true);
  }

  function add() {
    const blank: Item = { id: `new-${Date.now()}` };
    fields.forEach((f) => {
      blank[f.key] = f.type === "lines" ? [] : f.type === "number" ? 0 : "";
    });
    setItems((prev) => [...prev, blank]);
    setDirty(true);
  }

  function remove(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setDirty(true);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setDirty(true);
  }

  async function save() {
    const invalid = items.find((item) => !String(item[requiredKey] ?? "").trim());
    if (invalid) {
      toast(`Every ${singular.toLowerCase()} needs a ${requiredKey}.`, "error");
      return;
    }
    setSaving(true);
    try {
      const payload = items.map((item, index) => ({
        ...item,
        id: item.id.startsWith("new-") ? undefined : item.id,
        order: index + 1,
      }));
      const res = await fetch("/api/admin/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, items: payload }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not save.");
      toast("Changes saved");
      setDirty(false);
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <SectionCard
        title={title}
        description={description}
        aside={
          <div className="flex items-center gap-2">
            {dirty && <span className="mono text-[8px] text-accent-text">Unsaved</span>}
            <button type="button" onClick={save} disabled={saving} className="btn btn-primary btn-sm">
              <Icon name={saving ? "refresh" : "save"} size={13} className={saving ? "animate-spin" : ""} />
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="rounded-xl border border-line bg-[color-mix(in_oklab,var(--bg)_45%,transparent)] p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="mono text-[9px] text-faint">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.8rem] text-muted">
                    {String(item[requiredKey] ?? "") || `New ${singular.toLowerCase()}`}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="grid size-6 place-items-center rounded border border-line text-faint hover:text-ink disabled:opacity-25"
                    aria-label="Move up"
                  >
                    <Icon name="arrowUp" size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    className="grid size-6 place-items-center rounded border border-line text-faint hover:text-ink disabled:opacity-25"
                    aria-label="Move down"
                  >
                    <Icon name="arrowDown" size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="grid size-6 place-items-center rounded border border-line text-faint hover:border-red-500/40 hover:text-red-400"
                    aria-label="Remove"
                  >
                    <Icon name="trash" size={11} />
                  </button>
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {fields.map((field) => {
                  const value = item[field.key];
                  const common = {
                    id: `${collection}-${item.id}-${field.key}`,
                    placeholder: field.placeholder,
                  };
                  return (
                    <div key={field.key} className={field.full ? "sm:col-span-2" : undefined}>
                      <Field label={field.label} htmlFor={common.id} hint={field.hint}>
                        {field.type === "textarea" || field.type === "lines" ? (
                          <textarea
                            {...common}
                            className="textarea min-h-[90px] text-[0.86rem]"
                            value={
                              field.type === "lines"
                                ? Array.isArray(value)
                                  ? (value as string[]).join("\n")
                                  : String(value ?? "")
                                : String(value ?? "")
                            }
                            onChange={(e) =>
                              update(
                                index,
                                field.key,
                                field.type === "lines"
                                  ? e.target.value.split("\n").map((v) => v.trim()).filter(Boolean)
                                  : e.target.value
                              )
                            }
                          />
                        ) : field.type === "media" ? (
                          <MediaField
                            label={field.label}
                            value={String(value ?? "")}
                            onChange={(next) => update(index, field.key, next)}
                            hint={field.hint}
                          />
                        ) : field.type === "number" ? (
                          <input
                            {...common}
                            type="number"
                            className="input"
                            value={Number(value ?? 0)}
                            onChange={(e) => update(index, field.key, Number(e.target.value))}
                          />
                        ) : (
                          <input
                            {...common}
                            className="input"
                            value={String(value ?? "")}
                            onChange={(e) => update(index, field.key, e.target.value)}
                          />
                        )}
                      </Field>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {!items.length && (
            <EmptyState
              title={`No ${singular.toLowerCase()}s yet`}
              description={`Add your first ${singular.toLowerCase()} to show it on the site.`}
              action={
                <button type="button" onClick={add} className="btn btn-primary btn-sm mt-2">
                  <Icon name="plus" size={13} />
                  {addLabel}
                </button>
              }
            />
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button type="button" onClick={add} className="btn btn-ghost btn-sm">
            <Icon name="plus" size={13} />
            {addLabel}
          </button>
          <SaveButton saving={saving} label="Save changes" />
        </div>
      </SectionCard>
    </div>
  );
}
