"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { Icon } from "@/components/icons";
import { ThemeToggle } from "@/components/client/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { label: "Work", href: "/#work", id: "work" },
  { label: "Services", href: "/#services", id: "services" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Contact", href: "/#contact", id: "contact" },
];

export function Nav({
  wordmark,
  email,
  available,
  availability,
  socials = [],
}: {
  wordmark: string;
  email: string;
  available: boolean;
  availability: string;
  socials?: { label: string; url: string }[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("is-locked", open);
    return () => document.body.classList.remove("is-locked");
  }, [open]);

  useEffect(() => {
    if (pathname !== "/" || typeof IntersectionObserver === "undefined") return;
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-ink"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-50 pt-5 sm:pt-6">
        <div className="shell">
          <div
            className={cn(
              "glass relative mx-auto flex h-[52px] w-full max-w-[1120px] items-center justify-between rounded-full border border-line px-2.5 transition-all duration-500 sm:h-14 sm:px-4",
              scrolled && "shadow-[0_18px_50px_-30px_rgba(0,0,0,0.65)]"
            )}
          >
            <div className="flex items-center">
              <Logo wordmark={wordmark} size={24} sub="Edit / Motion" />
            </div>

            <nav
              className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex"
              aria-label="Primary"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link"
                  data-active={
                    active === link.id ||
                    (link.id === "work" && pathname.startsWith("/work")) ||
                    (link.id === "contact" && pathname === "/contact")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center justify-end gap-2">
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
              <Link href="/#contact" className="btn btn-primary btn-sm hidden sm:inline-flex">
                Let&apos;s talk
                <Icon name="arrowUpRight" size={15} />
              </Link>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="icon-btn md:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
              >
                <Icon name={open ? "close" : "menu"} size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[45] flex flex-col bg-bg transition-[opacity] duration-300 md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="h-[84px] shrink-0" />
        <nav className="shell flex flex-1 flex-col gap-1 pt-2" aria-label="Mobile">
          <p className="mono mb-3 text-faint">Navigate</p>
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="group flex items-baseline gap-4 border-b border-line py-5"
              style={{
                transform: open ? "none" : "translateY(14px)",
                opacity: open ? 1 : 0,
                transition: `all .6s cubic-bezier(.16,1,.3,1) ${100 + i * 60}ms`,
              }}
            >
              <span className="index-num w-6">0{i + 1}</span>
              <span className="display text-[2.4rem] leading-none text-ink group-hover:text-accent-text">
                {link.label}
              </span>
              <Icon
                name="arrowUpRight"
                size={20}
                className="ml-auto self-center text-faint transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
              />
            </Link>
          ))}
          {socials.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[0.76rem] text-muted"
                >
                  {social.label}
                  <Icon name="arrowUpRight" size={11} />
                </a>
              ))}
            </div>
          )}

          <div className="mt-7 flex items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3">
            <span className="text-[0.82rem] text-muted">Appearance</span>
            <ThemeToggle />
          </div>
        </nav>

        <div className="shell shrink-0 pb-8">
          <div className="mb-6 flex items-center gap-2">
            <span className={cn("dot", !available && "is-busy")} />
            <span className="text-[0.8rem] text-muted">{availability}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <a href={`mailto:${email}`} className="link-underline text-sm text-ink">
              {email}
            </a>
            <a href={`mailto:${email}`} className="btn btn-primary btn-sm">
              Start a project
              <Icon name="arrowUpRight" size={15} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
