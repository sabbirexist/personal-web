import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { Icon } from "@/components/icons";
import { Spotlight } from "@/components/client/motion";
import { cn } from "@/lib/utils";

const stills = [
  { src: "/work/rings.webp", label: "Aether — Brand Film" },
  { src: "/work/ember.webp", label: "Nova — Titles" },
  { src: "/work/orb.webp", label: "Terra — Launch" },
  { src: "/work/streak.webp", label: "Pulse — Social" },
];

/** Rotating circular type mark. */
export function RotatingBadge() {
  return (
    <div className="relative grid size-[104px] place-items-center rounded-full border border-line-strong bg-bg shadow-[0_16px_40px_-22px_rgba(0,0,0,0.55)]">
      <svg viewBox="0 0 104 104" className="spin-ring absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <path id="badge-top" d="M 13.5 52 A 38.5 38.5 0 0 1 90.5 52" fill="none" />
          <path id="badge-bottom" d="M 13.5 52 A 38.5 38.5 0 0 0 90.5 52" fill="none" />
        </defs>
        <text
          className="fill-ink"
          textAnchor="middle"
          style={{ fontSize: "7px", letterSpacing: "0.2em", fontFamily: "var(--font-mono)" }}
        >
          <textPath href="#badge-top" startOffset="50%">
            AVAILABLE FOR WORK
          </textPath>
          <textPath href="#badge-bottom" startOffset="50%">
            LET&apos;S TALK
          </textPath>
        </text>
      </svg>
      <span className="grid size-9 place-items-center rounded-full bg-accent text-accent-ink">
        <Icon name="arrowUpRight" size={15} />
      </span>
      <span className="sr-only">Available for work</span>
    </div>
  );
}

function PortraitCard({ site }: { site: SiteSettings }) {
  const pills = ["Editing", "Motion", "Colour"];

  return (
    <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px] lg:ml-auto lg:mr-0 lg:max-w-[430px] xl:max-w-[450px]">
      <div
        className="absolute -inset-x-8 -bottom-8 -top-6 -z-10 rounded-[44px] bg-[radial-gradient(60%_60%_at_50%_55%,var(--accent-soft),transparent_72%)]"
        aria-hidden="true"
      />
      <div className="absolute -right-6 -top-8 -z-10 size-52 rounded-full bg-[radial-gradient(circle,var(--accent-soft),transparent_70%)]" aria-hidden="true" />

      <div className="relative overflow-hidden rounded-[28px] border border-line bg-card shadow-[0_44px_90px_-46px_rgba(0,0,0,0.95),0_0_70px_-32px_var(--accent-glow)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={site.portrait}
          alt={`${site.name} — ${site.role}`}
          width={880}
          height={1100}
          className="aspect-[4/5] w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/30" />

        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          {pills.map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[0.68rem] font-medium text-white/85"
            >
              {pill}
            </span>
          ))}
        </div>

        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="mono text-[9px] text-white/55">
              {site.wordmark} / {site.location.split(",")[0]}
            </p>
            <p className="mt-1.5 flex items-center gap-2 text-[0.9rem] font-medium text-white">
              <span className="dot" />
              {site.available ? "Open for work" : "Currently booked"}
            </p>
          </div>
          <a
            href="#contact"
            className="group grid size-10 shrink-0 place-items-center rounded-full bg-accent text-accent-ink transition-transform duration-500 hover:scale-105"
            aria-label="Go to contact"
          >
            <Icon
              name="arrowUpRight"
              size={16}
              className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>

      <div className="absolute -left-6 -top-6 hidden min-[380px]:block">
        <RotatingBadge />
      </div>
    </div>
  );
}

export function Hero({ site }: { site: SiteSettings }) {
  const sentences = site.intro.split(/(?<=[.!?])\s+/);
  const firstSentence = sentences[0] ?? site.intro;
  const rest = sentences.slice(1).join(" ");

  return (
    <section
      id="hero"
      className="relative overflow-hidden pb-8 pt-28 sm:pt-32 lg:flex lg:min-h-[90svh] lg:items-center lg:pb-12 lg:pt-32"
    >
      <div className="grid-lines" aria-hidden="true" />
      <div
        className="glow left-1/2 top-[-16%] h-[520px] w-[820px] -translate-x-1/2 opacity-30"
        aria-hidden="true"
      />
      <Spotlight targetId="hero" />
      <div className="spotlight" aria-hidden="true" />

      <div className="shell relative z-10 w-full">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-8 lg:gap-y-6">
          {/* top copy */}
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:items-start lg:text-left">
            <div className="intro" style={{ "--d": "0ms" } as React.CSSProperties}>
              <span className="pill">
                <span className={cn("dot", !site.available && "is-busy")} />
                {site.available ? site.availability : "Currently booked — join the waitlist"}
              </span>
            </div>

            <p className="eyebrow eyebrow-plain intro mt-6" style={{ "--d": "60ms" } as React.CSSProperties}>
              Hello, I&apos;m {site.name}
            </p>

            <h1
              className="display intro mt-4 text-balance text-[clamp(2.35rem,6vw,5.3rem)] leading-[0.95] tracking-[-0.05em]"
              style={{ "--d": "120ms" } as React.CSSProperties}
            >
              {site.tagline}{" "}
              <span className="serif italic ember-text">{site.taglineAccent}</span>
            </h1>

            <p className="mono intro mt-5 text-muted" style={{ "--d": "170ms" } as React.CSSProperties}>
              Video editor
              <span className="mx-2 text-accent">×</span>
              Motion designer
              <span className="hidden sm:inline">
                <span className="mx-2 text-faint">/</span>
                {site.location.split(",")[0]}
              </span>
            </p>
          </div>

          {/* portrait — appears mid-hero on mobile */}
          <div
            className="intro order-3 lg:order-none lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:self-center"
            style={{ "--d": "240ms" } as React.CSSProperties}
          >
            <PortraitCard site={site} />
          </div>

          {/* bottom copy */}
          <div className="order-2 flex flex-col items-center text-center lg:order-none lg:col-span-7 lg:col-start-1 lg:row-start-2 lg:items-start lg:text-left">
            <p className="lead max-w-[36rem] text-pretty">
              {firstSentence}
              {rest && <span className="hidden sm:inline"> {rest}</span>}
            </p>

            <div className="mt-7 flex w-full flex-col items-stretch gap-2.5 sm:w-auto sm:flex-row sm:items-center">
              <button
                type="button"
                data-video={site.reelUrl}
                data-poster={site.reelPoster}
                data-title="Showreel 2026"
                data-subtitle="Play reel"
                className="btn btn-primary group w-full sm:w-auto"
                aria-label="Play the 2026 showreel"
              >
                <span className="grid size-6 place-items-center rounded-full bg-black/15">
                  <Icon name="play" size={11} className="ml-px" />
                </span>
                Watch showreel
                <span className="mono ml-1 opacity-50">02:14</span>
              </button>
              <a href="#contact" className="btn btn-ghost group w-full sm:w-auto">
                Hire me
                <Icon
                  name="arrowUpRight"
                  size={15}
                  className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 lg:justify-start">
              <div className="flex items-center -space-x-2.5">
                {["AR", "MR", "AT", "LF"].map((initials, i) => (
                  <span
                    key={initials}
                    className={cn(
                      "grid size-8 place-items-center rounded-full border-2 border-bg text-[9px] font-semibold",
                      i % 2 === 0 ? "bg-accent-soft text-accent-text" : "bg-card-2 text-ink-soft"
                    )}
                  >
                    {initials}
                  </span>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" size={11} className="text-accent" />
                  ))}
                  <span className="ml-1.5 text-[0.78rem] font-medium text-ink">4.9/5</span>
                </div>
                <p className="mt-0.5 text-[0.76rem] text-faint">50+ happy clients worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReelBand({ site, items }: { site: SiteSettings; items: string[] }) {
  const ticker = [...items, ...items, ...items];
  return (
    <section aria-label="Showreel and capabilities" className="reel-band relative overflow-hidden">
      <div className="shell relative pt-9 sm:pt-11">
        <div className="mb-5 flex items-end justify-between gap-4">
          <p className="mono flex items-center gap-2 text-[var(--reel-fg)] opacity-65">
            <Icon name="film" size={13} className="text-accent" />
            Reel / 2026
          </p>
          <p className="mono hidden text-[var(--reel-fg)] opacity-40 sm:block">Four frames · one reel</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
          {stills.map((still, i) => (
            <button
              key={still.src}
              type="button"
              data-video={site.reelUrl}
              data-poster={still.src}
              data-title="Showreel 2026"
              data-subtitle={still.label}
              className="frame group relative aspect-[4/3] text-left"
              aria-label={`Play showreel — ${still.label}`}
              style={{ "--d": `${i * 60}ms` } as React.CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={still.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />
              <span className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between gap-2 sm:inset-x-3 sm:bottom-3">
                <span className="mono max-w-[70%] truncate text-[8px] text-white/70 sm:text-[9px]">
                  {still.label}
                </span>
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-white/25 text-white transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
                  <Icon name="play" size={9} className="ml-px" />
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-12 border-t border-line py-5 sm:mt-16 sm:py-6">
          <div className="flex items-center gap-4">
            <span className="mono hidden shrink-0 text-[var(--reel-fg)] opacity-40 sm:block">Capabilities</span>
            <div className="marquee min-w-0 flex-1">
              <div className="marquee-track" style={{ "--dur": "44s" } as React.CSSProperties}>
                {ticker.map((item, i) => (
                  <span key={`${item}-${i}`} className="flex items-center">
                    <span className="px-4 text-[clamp(0.9rem,1.7vw,1.35rem)] font-semibold uppercase tracking-[-0.01em] text-[var(--reel-fg)] opacity-90 sm:px-6">
                      {item}
                    </span>
                    <Icon name="plus" size={15} className="shrink-0 text-accent" strokeWidth={2} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
