import type { ProcessStep, Stat, Testimonial } from "@/lib/types";
import { Icon, Stars } from "@/components/icons";
import { CountUp } from "@/components/site/count-up";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  accent,
  description,
  align = "center",
  action,
  className,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  align?: "center" | "left" | "split";
  action?: React.ReactNode;
  className?: string;
}) {
  const heading = (
    <h2 className="h2 mt-3.5 text-balance">
      {title}
      {accent && (
        <>
          {" "}
          <span className="serif italic ember-text">{accent}</span>
        </>
      )}
    </h2>
  );

  if (action) {
    return (
      <div
        className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}
        data-reveal
      >
        <div className="max-w-2xl">
          <p className="eyebrow">{eyebrow}</p>
          {heading}
          {description && <p className="lead mt-5 max-w-xl">{description}</p>}
        </div>
        <div className="shrink-0 pb-0.5">{action}</div>
      </div>
    );
  }

  if (align === "split") {
    return (
      <div className={cn("grid gap-5 md:grid-cols-12 md:items-end md:gap-8", className)} data-reveal>
        <div className="md:col-span-7">
          <p className="eyebrow">{eyebrow}</p>
          {heading}
        </div>
        {description && (
          <div className="md:col-span-5">
            <p className="body-copy md:ml-auto md:max-w-[22rem] md:text-right">{description}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center"
          ? "items-start text-left md:mx-auto md:max-w-2xl md:items-center md:text-center"
          : "items-start",
        className
      )}
      data-reveal
    >
      <div
        className={cn(
          "flex flex-col",
          align === "center" ? "items-start md:items-center" : "items-start"
        )}
      >
        <p className="eyebrow">{eyebrow}</p>
        {heading}
        {description && (
          <p
            className={cn(
              "lead mt-5",
              align === "center" ? "max-w-xl md:mx-auto md:text-center" : "max-w-xl"
            )}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

/** Bold inverted marquee — the reference's black band. */
export function CapabilityBand({ items }: { items: string[] }) {
  const doubled = [...items, ...items, ...items];
  return (
    <div
      id="capabilities"
      className="band relative overflow-hidden border-y border-line py-4 sm:py-5"
    >
      <div className="marquee">
        <div className="marquee-track" style={{ "--dur": "40s" } as React.CSSProperties}>
          {doubled.map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center">
              <span className="px-5 text-[clamp(1.02rem,2vw,1.6rem)] font-semibold uppercase tracking-[-0.015em] sm:px-7">
                {item}
              </span>
              <Icon name="plus" size={17} className="shrink-0 text-accent" strokeWidth={2} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TrustedBy({ names }: { names: string[] }) {
  return (
    <section id="trusted" className="pb-4">
      <div className="shell">
        <div className="panel rounded-[24px] p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="mono text-faint">Trusted by</p>
            <p className="mono text-faint">2024 — 2026</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-4">
            {names.map((name) => (
              <div key={name} className="bg-card px-3 py-5 text-center">
                <span className="text-[0.74rem] font-medium uppercase tracking-[0.12em] text-muted">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Process({ steps }: { steps: ProcessStep[] }) {
  return (
    <section id="process" className="section pt-0">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4 lg:col-span-5">
            <div data-reveal>
              <p className="eyebrow">How it runs</p>
              <h2 className="h2 mt-3.5">
                A calm <span className="serif italic text-accent-text">process</span>
              </h2>
              <p className="body-copy mt-5 max-w-xs">
                No black boxes. You see the edit evolve, approve the direction, and get files
                that are actually organised.
              </p>
            </div>
          </div>

          <div className="md:col-span-8 lg:col-span-7">
            <div className="grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2">
              {steps.map((step, i) => (
                <div
                  key={step.id}
                  className="group relative bg-bg p-6 transition-colors duration-500 hover:bg-card sm:p-7"
                  data-reveal
                  style={{ "--delay": `${i * 70}ms` } as React.CSSProperties}
                >
                  <div className="flex items-center justify-between">
                    <span className="index-num">Step 0{i + 1}</span>
                    <span className="size-1.5 rounded-full bg-line-strong transition-colors duration-500 group-hover:bg-accent" />
                  </div>
                  <h3 className="mt-5 text-[1.08rem] font-semibold tracking-[-0.03em]">
                    {step.title}
                  </h3>
                  <p className="body-copy mt-2 text-[0.9rem]">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section className="section pt-0">
      <div className="shell">
        <div
          className="relative overflow-hidden rounded-[26px] border border-line bg-card px-6 py-10 sm:px-10"
          data-reveal
        >
          <div className="glow -right-24 -top-24 h-72 w-72 opacity-40" aria-hidden="true" />
          <div className="grid grid-cols-2 gap-y-9 md:grid-cols-4 md:divide-x md:divide-line">
            {stats.map((stat) => (
              <div key={stat.label} className="px-2 text-center md:px-6">
                <p className="display text-[clamp(2rem,4.2vw,3.1rem)] text-ink">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-[0.74rem] uppercase tracking-[0.13em] text-faint">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section id="testimonials" className="section pt-0">
      <div className="shell">
        <SectionHeader
          align="split"
          eyebrow="Kind words"
          title="Clients, in their"
          accent="own words"
          description="The best part of the job is the people who trust you with the cut."
        />
        <div className="mt-11 grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={t.id}
              className="card group flex h-full flex-col gap-5 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-line-strong sm:p-7"
              data-reveal
              style={{ "--delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <div className="flex items-center justify-between">
                <Icon name="quote" size={22} className="text-accent/70" />
                <Stars />
              </div>
              <blockquote className="text-[0.95rem] leading-[1.7] text-ink-soft">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 border-t border-line pt-5">
                <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-[0.72rem] font-semibold text-accent-text">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <span className="leading-tight">
                  <span className="block text-[0.85rem] font-medium text-ink">{t.name}</span>
                  <span className="block text-[0.74rem] text-faint">
                    {t.title}, {t.company}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
