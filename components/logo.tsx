import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The mark: a pair of editing scissors — the cut — drawn as one monoline icon.
 * Pure SVG, inherits currentColor, scales from 16px favicon to billboard.
 */
export function LogoMark({
  size = 30,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="6.2" cy="6.4" r="2.3" />
      <circle cx="6.2" cy="17.6" r="2.3" />
      <path d="M8.2 7.6 14.2 12 19.8 17.2" />
      <path d="M8.2 16.4 14.2 12 19.8 6.8" />
    </svg>
  );
}

export function Logo({
  wordmark = "SABBIR",
  href = "/",
  size = 28,
  sub = "Edit / Motion",
  className,
  invert = false,
}: {
  wordmark?: string;
  href?: string;
  size?: number;
  sub?: string;
  className?: string;
  invert?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={`${wordmark} — home`}
      className={cn(
        "group inline-flex items-center gap-1.5 select-none",
        className
      )}
    >
      <span className="relative text-accent transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-rotate-[18deg]">
        <LogoMark size={size} />
      </span>
      <span
        className={cn(
          "flex flex-col leading-none",
          invert ? "text-accent-ink" : "text-ink"
        )}
      >
        <span className="flex items-center gap-1.5">
          <span className="font-semibold tracking-[-0.05em]" style={{ fontSize: size * 0.62 }}>
            {wordmark}
          </span>
          <span
            className="mono whitespace-nowrap opacity-40"
            style={{ fontSize: Math.max(6.5, size * 0.28), letterSpacing: "0.16em" }}
          >
            — PORTFOLIO
          </span>
        </span>
        <span
          className={cn(
            "mono mt-1 hidden whitespace-nowrap opacity-55 sm:block",
            invert ? "text-accent-ink" : "text-muted"
          )}
          style={{ fontSize: Math.max(7, size * 0.24), letterSpacing: "0.18em" }}
        >
          {sub}
        </span>
      </span>
    </Link>
  );
}

/** Big footer wordmark with the accent full-stop. */
export function Wordmark({ text = "SABBIR", className }: { text?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline", className)}>
      {text}
      <span className="text-accent">.</span>
    </span>
  );
}
