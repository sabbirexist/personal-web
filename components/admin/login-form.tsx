"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Sign in failed.");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <div className="mb-8">
        <p className="mono mb-4 text-accent-text">Studio admin</p>
        <h1 className="h2 text-[2.1rem] leading-none">Welcome back.</h1>
        <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">
          Enter the studio password to manage projects, services and messages.
        </p>
      </div>

      <label htmlFor="password" className="field-label">
        Password
      </label>
      <div className="relative">
        <input
          id="password"
          type={show ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input pr-11"
          placeholder="••••••••"
          autoComplete="current-password"
          autoFocus
          required
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-faint transition-colors hover:text-ink"
          aria-label={show ? "Hide password" : "Show password"}
        >
          <Icon name={show ? "eyeOff" : "eye"} size={16} />
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[0.8rem] text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={cn("btn btn-primary mt-5 w-full", loading && "opacity-70")}
      >
        {loading ? "Signing in…" : "Enter studio"}
        <Icon name="arrowRight" size={15} />
      </button>

      <div className="mt-6 flex items-center justify-between text-[0.78rem] text-faint">
        <Link href="/" className="link-underline inline-flex items-center gap-1.5 hover:text-ink">
          <Icon name="arrowLeft" size={12} />
          Back to site
        </Link>
        <span className="mono text-[8px]">Protected area</span>
      </div>
    </form>
  );
}
