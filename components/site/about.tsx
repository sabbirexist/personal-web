import type { SiteSettings } from "@/lib/types";
import { Icon } from "@/components/icons";
import { tools } from "@/lib/options";

export function About({ site }: { site: SiteSettings }) {
  return (
    <section id="about" className="section">
      <div className="shell">
        <div className="grid gap-9 lg:grid-cols-12 lg:items-center lg:gap-x-10 lg:gap-y-6 xl:gap-x-14">
          {/* header — first on mobile, top-right on desktop */}
          <div className="order-1 lg:col-span-7 lg:col-start-6 lg:row-start-1">
            <div data-reveal>
              <p className="eyebrow">About me</p>
              <h2 className="h2 mt-3.5 text-balance">
                Who is <span className="serif italic ember-text">{site.name}</span>?
              </h2>
            </div>
          </div>

          {/* circular portrait — second on mobile, left column on desktop */}
          <div className="relative order-2 mx-auto w-full max-w-[320px] sm:max-w-[380px] lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:max-w-none lg:pr-6">
            <div
              className="absolute inset-x-4 inset-y-6 rounded-full bg-[radial-gradient(circle,var(--accent-soft),transparent_72%)]"
              aria-hidden="true"
            />
            <div
              className="relative aspect-square overflow-hidden rounded-full border border-line"
              data-reveal="scale"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={site.portraitSquare || site.portrait}
                alt={`${site.name} — ${site.role}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-[50%_30%]"
              />
              <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-3 right-0 rounded-2xl border border-line bg-bg/92 px-4 py-3 sm:right-2">
              <p className="mono text-[8px] text-faint">Happy clients</p>
              <p className="mt-0.5 text-[1.15rem] font-semibold leading-none text-ink">50+</p>
            </div>

            <div
              className="absolute -left-2 top-6 hidden size-16 rounded-full border border-dashed border-accent/40 sm:block"
              aria-hidden="true"
            />
          </div>

          {/* body — third on mobile, below the header on desktop */}
          <div className="order-3 lg:col-span-7 lg:col-start-6 lg:row-start-2">
            <div className="space-y-4" data-reveal>
              {site.bio.map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-[1.02rem] leading-[1.7] text-ink-soft sm:text-[1.08rem]"
                      : "body-copy"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-7" data-reveal style={{ "--delay": "60ms" } as React.CSSProperties}>
              <p className="mono mb-3 text-faint">Toolkit</p>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
                {tools.map((tool) => (
                  <div key={tool} className="flex items-center gap-2 bg-card px-3 py-3">
                    <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <span className="truncate text-[0.76rem] text-ink-soft">{tool}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6"
              data-reveal
            >
              <div>
                <p className="mono mb-1 text-faint">Signature</p>
                <p className="serif text-[2rem] leading-none text-ink">{site.name}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {site.socials.slice(0, 3).map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[0.78rem] text-muted transition-colors duration-300 hover:border-accent hover:text-accent-text"
                  >
                    {s.label}
                    <Icon
                      name="arrowUpRight"
                      size={12}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
