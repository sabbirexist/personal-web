import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { Icon } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { LocalClock } from "@/components/client/local-clock";
import { navLinks } from "@/lib/options";

export function Footer({ site }: { site: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line pt-14">
      <div className="shell">
        <div className="flex flex-col items-center gap-6 text-center">
          <a
            href={`mailto:${site.email}`}
            className="group inline-flex items-center gap-3 rounded-full border border-line bg-card/60 px-4 py-2 text-[0.82rem] text-muted transition-colors duration-300 hover:border-accent hover:text-ink"
          >
            <span className="dot" />
            {site.availability}
            <Icon
              name="arrowUpRight"
              size={13}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>

          <h2 className="display w-full text-balance pt-2 text-[clamp(3.4rem,17.5vw,15rem)] leading-[0.78] tracking-[-0.06em] text-ink">
            {site.wordmark}
          </h2>

          <p className="max-w-md text-[0.86rem] leading-relaxed text-faint">{site.footerNote}</p>
        </div>

        <div className="mt-14 flex flex-col gap-7 border-t border-line py-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-accent">
              <LogoMark size={22} />
            </span>
            <span className="text-[0.78rem] text-faint">
              © {year} {site.name}. All rights reserved.
            </span>
          </div>

          <nav
            className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-x-6"
            aria-label="Footer"
          >
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="nav-link text-[0.8rem]">
                {l.label}
              </Link>
            ))}
            <Link href="/work" className="nav-link text-[0.8rem]">
              Archive
            </Link>
            <Link href="/admin" className="nav-link text-[0.8rem] text-faint">
              Admin
            </Link>
          </nav>

          <div className="flex items-center justify-between gap-4 text-[0.75rem] text-faint md:justify-end">
            <span className="flex items-center gap-1.5">
              <Icon name="clock" size={12} />
              {site.location.split(",")[0]}{" "}
              <LocalClock timezone={site.timezone} />
            </span>
            <a
              href="#top"
              className="group inline-flex items-center gap-1.5 text-ink transition-colors hover:text-accent-text"
            >
              Back to top
              <Icon
                name="arrowUp"
                size={13}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
