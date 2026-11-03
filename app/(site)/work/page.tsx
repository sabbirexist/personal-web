import type { Metadata } from "next";
import Link from "next/link";
import { readContent, sortByOrder } from "@/lib/store";
import { WorkExplorer } from "@/components/site/work-explorer";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected brand films, title sequences, motion systems and social campaigns by Sabbir — video editor and motion designer.",
};

export const revalidate = 3600;

export default async function WorkPage() {
  const content = await readContent();
  const projects = sortByOrder(content.projects);
  const years = Array.from(new Set(projects.map((p) => p.year))).sort();
  const categories = Array.from(new Set(projects.map((p) => p.category)));

  return (
    <>
      <header className="relative overflow-hidden pb-10 pt-32 sm:pt-40">
        <div className="glow -top-20 left-1/2 h-64 w-[600px] -translate-x-1/2 opacity-35" aria-hidden="true" />
        <div className="shell relative">
          <div className="max-w-3xl text-left md:mx-auto md:text-center">
            <p className="eyebrow">Archive</p>
            <h1 className="h1 display mt-4 text-balance">
              Selected <span className="serif italic ember-text">work</span>
            </h1>
            <p className="lead mt-5 max-w-xl md:mx-auto">
              Eight projects that show how I think — from a 90-second brand manifesto to a
              generative music visualiser.
            </p>
          </div>

          <div className="mt-10 flex max-w-3xl flex-wrap items-center justify-start gap-x-6 gap-y-2 border-y border-line py-4 sm:gap-x-8 md:mx-auto md:justify-center">
            <span className="mono text-faint">
              <span className="text-ink">{String(projects.length).padStart(2, "0")}</span> projects
            </span>
            <span className="hidden h-3 w-px bg-line-strong sm:block" aria-hidden="true" />
            <span className="mono text-faint">
              {years[0]} — {years[years.length - 1]}
            </span>
            <span className="hidden h-3 w-px bg-line-strong sm:block" aria-hidden="true" />
            <span className="mono text-faint">{categories.length} disciplines</span>
          </div>
        </div>
      </header>

      <section className="pb-6">
        <div className="shell">
          <WorkExplorer projects={projects} idPrefix="archive-" />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="card relative overflow-hidden p-8 text-center sm:p-12">
            <div className="glow -bottom-28 left-1/2 h-64 w-96 -translate-x-1/2 opacity-35" aria-hidden="true" />
            <div className="relative">
              <h2 className="h2">
                Your film could be <span className="serif italic ember-text">next</span>
              </h2>
              <p className="lead mx-auto mt-4 max-w-md">
                Got footage that deserves better pacing, or a launch that needs motion? Let&apos;s
                talk about it.
              </p>
              <Link href="/#contact" className="btn btn-primary mt-7">
                Start a project
                <Icon name="arrowUpRight" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
