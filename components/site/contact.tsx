import type { SiteSettings } from "@/lib/types";
import { Icon } from "@/components/icons";
import { ContactForm } from "@/components/site/contact-form";
import { CopyButton } from "@/components/site/count-up";
import { LocalClock } from "@/components/client/local-clock";

export function Contact({ site }: { site: SiteSettings }) {
  return (
    <section id="contact" className="section">
      <div className="shell">
        <div className="panel relative overflow-hidden rounded-[var(--radius-xl)]" data-reveal="scale">
          <div className="glow -left-32 -top-36 h-[420px] w-[420px] opacity-25" aria-hidden="true" />
          <div className="grid-lines opacity-20" aria-hidden="true" />

          <div className="relative grid lg:grid-cols-12">
            {/* left rail */}
            <div className="border-b border-line p-6 sm:p-9 lg:col-span-5 lg:border-b-0 lg:border-r lg:p-11">
              <div className="flex items-center justify-between gap-4">
                <p className="eyebrow">Contact</p>
                <span className="mono flex items-center gap-2 text-faint">
                  <span className="dot" />
                  {site.available ? "Open for work" : "Currently booked"}
                </span>
              </div>

              <h2 className="display mt-7 text-[clamp(2.05rem,4vw,3.25rem)] leading-[0.98] tracking-[-0.045em]">
                Let&apos;s make something that{" "}
                <span className="serif italic ember-text">moves</span>.
              </h2>

              <p className="body-copy mt-4 max-w-sm">
                Tell me about the film, the deadline and the feeling. I&apos;ll tell you honestly
                whether I&apos;m the right cut for it.
              </p>

              <a href={`mailto:${site.email}`} className="group mt-8 block">
                <span className="mono text-faint">Direct line</span>
                <span className="mt-2 flex items-center justify-between gap-4 border-b border-line pb-3 text-[clamp(1rem,1.5vw,1.22rem)] font-medium tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-accent-text">
                  <span className="truncate">{site.email}</span>
                  <Icon
                    name="arrowUpRight"
                    size={18}
                    className="shrink-0 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </a>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <CopyButton value={site.email} label="Copy email" />
                <a
                  href={`mailto:${site.email}?subject=Project%20enquiry`}
                  className="btn btn-ghost btn-sm"
                >
                  <Icon name="mail" size={13} />
                  Email me
                </a>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-line pt-6">
                <div>
                  <dt className="mono text-[8px] text-faint">Response</dt>
                  <dd className="mt-1.5 text-[0.82rem] text-ink-soft">Within 1 working day</dd>
                </div>
                <div>
                  <dt className="mono text-[8px] text-faint">Studio time</dt>
                  <dd className="mt-1.5 flex items-center gap-1.5 text-[0.82rem] text-ink-soft">
                    <Icon name="clock" size={11} className="text-faint" />
                    <LocalClock timezone={site.timezone} />
                    <span className="text-faint">· GMT+6</span>
                  </dd>
                </div>
                <div>
                  <dt className="mono text-[8px] text-faint">Based in</dt>
                  <dd className="mt-1.5 text-[0.82rem] text-ink-soft">{site.location}</dd>
                </div>
                <div>
                  <dt className="mono text-[8px] text-faint">Working</dt>
                  <dd className="mt-1.5 text-[0.82rem] text-ink-soft">Worldwide · remote</dd>
                </div>
              </dl>

              <div className="mt-7 flex flex-wrap gap-x-4 gap-y-2">
                {site.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-[0.78rem] text-muted transition-colors hover:text-ink"
                  >
                    {s.label}
                    <Icon
                      name="arrowUpRight"
                      size={11}
                      className="text-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* form */}
            <div className="flex flex-col p-6 sm:p-9 lg:col-span-7 lg:p-11">
              <div className="flex items-center justify-between gap-4">
                <p className="mono text-faint">Project brief</p>
                <p className="mono text-faint">2 min</p>
              </div>
              <div className="mt-6 flex flex-1 flex-col">
                <ContactForm email={site.email} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
