"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { ThemeToggle } from "@/components/client/theme-toggle";
import { cn } from "@/lib/utils";

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Overview", icon: "grid" },
  { href: "/admin/projects", label: "Projects", icon: "film" },
  { href: "/admin/content", label: "Services", icon: "layers" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "quote" },
  { href: "/admin/messages", label: "Messages", icon: "message" },
  { href: "/admin/media", label: "Media", icon: "image" },
  { href: "/admin/settings", label: "Settings", icon: "monitor" },
];

export function AdminSidebar({ unread, wordmark = "SABBIR" }: { unread: number; wordmark?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  async function logout() {
    setLeaving(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const active = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const nav = (
    <nav className="flex flex-col gap-1" aria-label="Admin">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.85rem] transition-colors duration-200",
            active(item.href)
              ? "bg-accent-soft text-accent-text"
              : "text-muted hover:bg-[color-mix(in_oklab,var(--ink)_5%,transparent)] hover:text-ink"
          )}
        >
          <Icon name={item.icon} size={16} className="shrink-0" />
          <span className="flex-1">{item.label}</span>
          {item.href === "/admin/messages" && unread > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-accent text-[0.62rem] font-bold text-accent-ink">
              {unread}
            </span>
          )}
          {active(item.href) && <span className="size-1.5 rounded-full bg-accent" />}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* mobile bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-bg/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="text-accent">
            <LogoMark size={22} />
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[0.8rem] font-semibold tracking-tight text-ink">{wordmark}</span>
            <span className="mono whitespace-nowrap text-[7px] tracking-[0.16em] text-faint opacity-60">
              — STUDIO ADMIN
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle admin menu"
          >
            <Icon name={open ? "close" : "menu"} size={17} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-b border-line bg-elev px-4 py-4 lg:hidden">
          {nav}
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
            <Link href="/" className="text-[0.8rem] text-muted">
              View site
            </Link>
            <button type="button" onClick={logout} className="text-[0.8rem] text-muted">
              {leaving ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      )}

      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[250px] flex-col border-r border-line bg-elev px-4 py-5 lg:flex">
        <Link href="/admin" className="flex items-center gap-3 px-1">
          <span className="text-accent">
            <LogoMark size={26} />
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[0.9rem] font-semibold tracking-[-0.02em] text-ink">{wordmark}</span>
            <span className="mono whitespace-nowrap text-[8px] tracking-[0.16em] text-faint opacity-60">
              — STUDIO ADMIN
            </span>
          </span>
        </Link>

        <div className="mt-8 flex-1">
          <p className="mono mb-3 px-3 text-[8px] text-faint">Manage</p>
          {nav}
        </div>

        <div className="space-y-3 border-t border-line pt-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.82rem] text-muted transition-colors hover:text-ink"
          >
            <Icon name="external" size={15} />
            View site
          </a>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[0.82rem] text-muted transition-colors hover:text-ink"
          >
            <Icon name="logout" size={15} />
            {leaving ? "Signing out…" : "Sign out"}
          </button>
          <div className="flex items-center justify-between px-3 pt-1">
            <span className="mono text-[8px] text-faint">Sabbir CMS</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
