"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ toast */
type ToastKind = "success" | "error" | "info";
interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

let listeners: Array<(item: ToastItem) => void> = [];

export function toast(message: string, kind: ToastKind = "success") {
  const item = { id: Date.now() + Math.random(), message, kind };
  listeners.forEach((listener) => listener(item));
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = (item: ToastItem) => {
      setItems((prev) => [...prev, item]);
      setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== item.id)), 3600);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-5 z-[95] mx-auto flex w-auto max-w-sm flex-col gap-2 sm:left-auto sm:right-5 sm:mx-0">
      {items.map((item) => (
        <div
          key={item.id}
          role="status"
          className={cn(
            "pointer-events-auto flex items-center gap-2.5 rounded-xl border px-4 py-3 text-[0.85rem] shadow-lg backdrop-blur-md",
            "bg-card/95",
            item.kind === "error"
              ? "border-red-500/40 text-red-400"
              : item.kind === "info"
                ? "border-line text-ink"
                : "border-emerald-500/35 text-emerald-400"
          )}
          style={{ animation: "rise .35s cubic-bezier(.16,1,.3,1)" }}
        >
          <Icon
            name={item.kind === "error" ? "close" : item.kind === "info" ? "sparkle" : "check"}
            size={15}
            strokeWidth={2}
          />
          {item.message}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ atoms */
export function Field({
  label,
  hint,
  children,
  htmlFor,
  required,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {required && <span className="ml-1 text-accent-text">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[0.72rem] leading-relaxed text-faint">{hint}</p>}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 text-left"
      aria-pressed={checked}
    >
      <span
        className={cn(
          "relative mt-0.5 h-5 w-9 shrink-0 rounded-full border transition-colors duration-300",
          checked ? "border-accent bg-accent" : "border-line-strong bg-transparent"
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full transition-all duration-300",
            checked ? "left-[18px] bg-accent-ink" : "left-[3px] bg-muted"
          )}
        />
      </span>
      <span>
        <span className="block text-[0.86rem] font-medium text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-[0.74rem] text-faint">{description}</span>}
      </span>
    </button>
  );
}

export function SectionCard({
  title,
  description,
  children,
  aside,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="admin-card p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[0.95rem] font-semibold tracking-[-0.02em] text-ink">{title}</h2>
          {description && <p className="mt-1 text-[0.78rem] text-faint">{description}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function SaveButton({
  saving,
  label = "Save changes",
  saved,
}: {
  saving: boolean;
  label?: string;
  saved?: boolean;
}) {
  return (
    <button type="submit" disabled={saving} className={cn("btn btn-primary btn-sm", saving && "opacity-70")}>
      {saving ? (
        <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Icon name={saved ? "check" : "save"} size={14} />
      )}
      {saving ? "Saving…" : label}
    </button>
  );
}

export function EmptyState({
  icon = "film",
  title,
  description,
  action,
}: {
  icon?: React.ComponentProps<typeof Icon>["name"];
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line px-6 py-14 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent">
        <Icon name={icon} size={19} />
      </span>
      <p className="text-[0.95rem] font-medium text-ink">{title}</p>
      <p className="max-w-sm text-[0.82rem] text-faint">{description}</p>
      {action}
    </div>
  );
}
