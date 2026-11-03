import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readContent, sortByOrder } from "@/lib/store";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  const { projects } = await readContent();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { projects } = await readContent();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} — ${project.subtitle}`,
    description: project.summary,
    openGraph: {
      title: `${project.title} — ${project.subtitle}`,
      description: project.summary,
      images: [{ url: project.poster, width: 1600, height: 1000, alt: project.title }],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await readContent();
  const projects = sortByOrder(content.projects);
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.id === project.id);
  const next = projects[(index + 1) % projects.length];
  const hero = project.gallery[0] ?? project.poster;
  const gallery = project.gallery.slice(0, 3);

  return (
    <>
      <article className="pt-28 sm:pt-36">
        <div className="shell">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 text-[0.82rem] text-muted transition-colors hover:text-ink"
            >
              <Icon
                name="arrowLeft"
                size={14}
                className="transition-transform duration-500 group-hover:-translate-x-1"
              />
              All work
            </Link>
            <p className="mono text-faint">
              {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl text-center">
            <p className="eyebrow eyebrow-center justify-center">
              {project.category} — {project.year}
            </p>
            <h1 className="h1 display mt-4 text-balance">
              {project.title}
              <span className="text-accent">.</span>
            </h1>
            <p className="mt-3 text-[1.05rem] tracking-[-0.02em] text-muted sm:text-[1.2rem]">
              {project.subtitle}
            </p>
            <p className="lead mx-auto mt-6 max-w-2xl">{project.summary}</p>

            {project.videoUrl && (
              <button
                type="button"
                data-video={project.videoUrl}
                data-poster={project.poster}
                data-title={project.title}
                data-subtitle={project.subtitle}
                className="btn btn-primary mt-8"
                aria-label={`Play ${project.title}`}
              >
                <span className="grid size-6 place-items-center rounded-full bg-black/15">
                  <Icon name="play" size={11} className="ml-px" />
                </span>
                Play the film
              </button>
            )}
          </div>

          <div className="relative mt-14" data-reveal="scale">
            <div className="glow left-1/2 top-1/4 h-[320px] w-[70%] -translate-x-1/2 opacity-40" aria-hidden="true" />
            <button
              type="button"
              data-video={project.videoUrl}
              data-poster={hero}
              data-title={project.title}
              className="frame group relative block aspect-[16/9] w-full cursor-pointer"
              aria-label={`Play ${project.title}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero}
                alt={`${project.title} — ${project.subtitle}`}
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/25 text-white transition-transform duration-500 group-hover:scale-110 sm:size-20">
                <Icon name="play" size={22} className="ml-0.5" />
              </span>
            </button>
          </div>

          <dl className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-y-8 border-y border-line py-8 sm:grid-cols-4">
            {[
              { k: "Client", v: project.client },
              { k: "Role", v: project.role },
              { k: "Tools", v: project.tools.slice(0, 2).join(", ") },
              { k: "Year", v: project.year },
            ].map((item) => (
              <div key={item.k} className="px-1 sm:text-center">
                <dt className="mono text-[9px] text-faint">{item.k}</dt>
                <dd className="mt-2 text-[0.88rem] leading-snug text-ink-soft">{item.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mx-auto mt-16 grid max-w-5xl gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-4">
              <h2 className="mono text-faint">The brief</h2>
              <p className="mt-4 text-[1.02rem] leading-[1.7] text-ink-soft">{project.body[0]}</p>
            </div>
            <div className="space-y-5 md:col-span-8">
              <p className="mono text-faint">The work</p>
              {project.body.slice(1).map((paragraph, i) => (
                <p key={i} className="body-copy">
                  {paragraph}
                </p>
              ))}

              {project.results.length > 0 && (
                <div className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-md)] border border-line bg-line sm:grid-cols-3">
                  {project.results.map((r) => (
                    <div key={r.label} className="bg-card px-5 py-6 text-center">
                      <p className="display text-[1.35rem] text-ink">{r.value}</p>
                      <p className="mt-1.5 text-[0.7rem] uppercase tracking-[0.14em] text-faint">
                        {r.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {gallery.length > 1 && (
            <div className="mt-16">
              <div className="mb-5 flex items-end justify-between">
                <p className="mono text-faint">Frames</p>
                <p className="mono text-faint">{String(gallery.length).padStart(2, "0")} stills</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {gallery.map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className={cn("frame aspect-[4/3]", i === 0 && "sm:col-span-2 sm:aspect-[16/9]")}
                    data-reveal="scale"
                    style={{ "--delay": `${i * 70}ms` } as React.CSSProperties}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${project.title} still ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <section className="section">
        <div className="shell">
          <Link
            href={`/work/${next.slug}`}
            className="group relative block overflow-hidden rounded-[var(--radius-lg)] border border-line"
          >
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={next.poster}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover opacity-35 transition-all duration-700 group-hover:scale-105 group-hover:opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40" />
            </div>
            <div className="relative flex flex-col items-center gap-3 px-6 py-16 text-center sm:py-20">
              <p className="mono text-white/50">Next project</p>
              <p className="display text-[clamp(2rem,5vw,3.6rem)] text-white">
                {next.title}
                <span className="text-accent">.</span>
              </p>
              <p className="text-[0.8rem] text-white/55">{next.subtitle}</p>
              <span className="mt-3 inline-flex items-center gap-2 text-[0.8rem] text-white/80">
                View case study
                <Icon
                  name="arrowRight"
                  size={15}
                  className="transition-transform duration-500 group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
