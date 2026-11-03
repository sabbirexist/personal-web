import { promises as fs } from "fs";
import path from "path";
import type { Content, Project, Service, Testimonial, ProcessStep } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "content.json");

export async function readContent(): Promise<Content> {
  const raw = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(raw) as Content;
}

export const isReadOnlyDeployment = () => Boolean(process.env.VERCEL);

export async function writeContent(content: Content): Promise<void> {
  if (isReadOnlyDeployment()) {
    throw new Error(
      "This deployment is read-only. Editing needs a database or blob store — run the site locally to change content."
    );
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.${Date.now()}.tmp`;
  const body = JSON.stringify(content, null, 2);
  await fs.writeFile(tmp, body, "utf8");
  await fs.rename(tmp, DATA_FILE);
}

/** Read, mutate, write — serialised so concurrent admin saves never clobber each other. */
let queue: Promise<unknown> = Promise.resolve();
export function updateContent<T>(fn: (content: Content) => T): Promise<T> {
  const run = queue.then(async () => {
    const content = await readContent();
    const result = fn(content);
    await writeContent(content);
    return result;
  });
  queue = run.catch(() => undefined);
  return run as Promise<T>;
}

export const sortByOrder = <T extends { order: number }>(items: T[]): T[] =>
  [...items].sort((a, b) => a.order - b.order);

export async function getProjects(): Promise<Project[]> {
  const c = await readContent();
  return sortByOrder(c.projects);
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const c = await readContent();
  return c.projects.find((p) => p.slug === slug);
}

export async function getServices(): Promise<Service[]> {
  const c = await readContent();
  return sortByOrder(c.services);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const c = await readContent();
  return sortByOrder(c.testimonials);
}

export async function getProcess(): Promise<ProcessStep[]> {
  const c = await readContent();
  return sortByOrder(c.process);
}

export async function getCategories(): Promise<string[]> {
  const c = await readContent();
  return Array.from(new Set(c.projects.map((p) => p.category))).filter(Boolean);
}
