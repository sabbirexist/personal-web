"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { projectTypes } from "@/lib/options";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState<{ href: string; address: string } | null>(null);
  const [projectType, setProjectType] = useState(projectTypes[0]);
  const [message, setMessage] = useState("");
  const ids = {
    name: useId(),
    email: useId(),
    message: useId(),
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    setFallback(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          projectType,
          message: data.get("message"),
          company: data.get("company"),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const failure = new Error(json.error || "Something went wrong. Try again?") as Error & {
          mailto?: string;
        };
        failure.mailto = json.mailto;
        throw failure;
      }
      setStatus("sent");
      form.reset();
      setMessage("");
    } catch (err) {
      const mailto = (err as { mailto?: string }).mailto || email;
      const bodyText = [
        `Name: ${data.get("name") ?? ""}`,
        `Email: ${data.get("email") ?? ""}`,
        `Project: ${projectType}`,
        "",
        String(data.get("message") ?? ""),
      ].join("\n");
      setFallback({
        address: mailto,
        href: `mailto:${mailto}?subject=${encodeURIComponent("Project enquiry — " + projectType)}&body=${encodeURIComponent(bodyText)}`,
      });
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-line bg-[color-mix(in_oklab,var(--bg)_45%,transparent)] px-6 py-14 text-center"
        aria-live="polite"
      >
        <span className="grid size-14 place-items-center rounded-full bg-accent-soft text-accent">
          <Icon name="check" size={26} strokeWidth={2} />
        </span>
        <h3 className="text-[1.35rem] font-semibold tracking-[-0.03em]">Message received.</h3>
        <p className="max-w-sm text-[0.88rem] leading-relaxed text-muted">
          Thanks for reaching out — I read every message myself and usually reply within one
          working day.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="btn btn-ghost btn-sm mt-1">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex h-full flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.name} className="field-label">
            Your name
          </label>
          <input
            id={ids.name}
            name="name"
            required
            className="input h-[46px]"
            placeholder="Jane Doe"
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor={ids.email} className="field-label">
            Email
          </label>
          <input
            id={ids.email}
            name="email"
            type="email"
            required
            className="input h-[46px]"
            placeholder="jane@studio.com"
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <span className="field-label">What do you need?</span>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Project type">
          {projectTypes.map((type) => {
            const active = projectType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setProjectType(type)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[0.78rem] transition-all duration-300",
                  active
                    ? "border-transparent bg-accent text-accent-ink shadow-[0_10px_26px_-14px_var(--accent-glow)]"
                    : "border-line text-muted hover:border-line-strong hover:text-ink"
                )}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <label htmlFor={ids.message} className="field-label mb-0">
            Project details
          </label>
          <span className="mono text-[8px] text-faint">{message.length} / 1200</span>
        </div>
        <textarea
          id={ids.message}
          name="message"
          required
          minLength={10}
          maxLength={1200}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="textarea min-h-[150px]"
          placeholder="Scope, timeline, references — the more context the better."
        />
      </div>

      {/* honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-auto flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.78rem] text-faint">
          Prefer email?{" "}
          <a
            href={`mailto:${email}`}
            className="text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent-text"
          >
            {email}
          </a>
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className={cn("btn btn-primary w-full sm:w-auto", status === "sending" && "opacity-70")}
        >
          {status === "sending" ? "Sending…" : "Send message"}
          <Icon name="arrowUpRight" size={16} />
        </button>
      </div>

      {status === "error" && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-[0.82rem] text-red-400">
          <p>{error}</p>
          {fallback && (
            <a
              href={fallback.href}
              className="mt-1.5 inline-flex items-center gap-1 font-medium underline decoration-red-400/40 underline-offset-4 hover:text-red-300"
            >
              Email {fallback.address} instead
              <Icon name="arrowUpRight" size={12} />
            </a>
          )}
        </div>
      )}
    </form>
  );
}
