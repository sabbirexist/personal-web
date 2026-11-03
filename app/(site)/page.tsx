import Link from "next/link";
import { readContent, sortByOrder } from "@/lib/store";
import { Hero, ReelBand } from "@/components/site/hero";
import {
  SectionHeader,
  TrustedBy,
  Process,
  Stats,
  Testimonials,
} from "@/components/site/sections";
import { ServicesAccordion } from "@/components/site/services";
import { WorkExplorer } from "@/components/site/work-explorer";
import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";
import { Icon } from "@/components/icons";

export const revalidate = 3600;

const capabilities = [
  "Video editing",
  "Motion design",
  "Colour grading",
  "Title sequences",
  "3D & VFX",
  "Sound design",
];

export default async function HomePage() {
  const content = await readContent();
  const projects = sortByOrder(content.projects);
  const homeProjects = projects.slice(0, 5);
  const clients = Array.from(new Set(projects.map((p) => p.client)));

  return (
    <>
      <Hero site={content.site} />
      <ReelBand site={content.site} items={capabilities} />

      <section id="work" className="section">
        <div className="shell">
          <SectionHeader
            eyebrow="Selected work"
            title="A few films I'm"
            accent="proud of"
            description="Brand films, title sequences and social systems — each one cut to be felt, not just watched."
            action={
              <Link href="/work" className="btn btn-ghost btn-sm group">
                All projects
                <Icon
                  name="arrowRight"
                  size={15}
                  className="transition-transform duration-500 group-hover:translate-x-1"
                />
              </Link>
            }
          />
          <div className="mt-11">
            <WorkExplorer projects={homeProjects} />
          </div>
        </div>
      </section>

      <section id="services" className="section pt-0">
        <div className="shell">
          <SectionHeader
            align="split"
            eyebrow="What I do"
            title="Services I"
            accent="provide"
            description="Every project starts with the same question: what should this make people feel? The service is just the machinery that gets us there."
          />
          <div className="mt-10">
            <ServicesAccordion services={sortByOrder(content.services)} />
          </div>
          <div className="mt-8 flex justify-center">
            <Link href="#contact" className="btn btn-ghost btn-sm group">
              Discuss your project
              <Icon
                name="arrowUpRight"
                size={15}
                className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </section>

      <Process steps={sortByOrder(content.process)} />
      <Stats stats={content.site.stats} />
      <TrustedBy names={clients} />
      <div className="pt-2">
        <Testimonials testimonials={sortByOrder(content.testimonials)} />
      </div>
      <About site={content.site} />
      <Contact site={content.site} />
    </>
  );
}
