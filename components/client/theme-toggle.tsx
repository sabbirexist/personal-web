"use client";

import { Icon } from "@/components/icons";

/** Renders both icons and lets CSS pick one from html[data-theme] — no hydration flash. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "light" ? "#f7f4ee" : "#0b0a09");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`icon-btn relative overflow-hidden ${className}`}
      aria-label="Switch between light and dark mode"
      title="Switch theme"
    >
      <span className="theme-icon theme-icon-sun">
        <Icon name="sun" size={17} />
      </span>
      <span className="theme-icon theme-icon-moon">
        <Icon name="moon" size={16} />
      </span>
    </button>
  );
}
