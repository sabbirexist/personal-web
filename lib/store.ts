import { promises as fs } from "fs";
import path from "path";
import { get, put } from "@vercel/blob";
import seed from "@/data/content.json";
import type { Content, Project, Service, Testimonial, ProcessStep } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "content.json");
const BLOB_PATH = "data/content.json";

/** On Vercel the filesystem is read-only, so content lives in a private Blob store. */
export const blobEnabled = () => Boolean(process.env.VERCEL && process.env.CONTENT_READ_WRITE_TOKEN);
export const isReadOnlyDeployment = () => Boolean(process.env.VERCEL) && !blobEnabled();
/** Uploaded media lives in the public Blob store. */
export const uploadsEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function readBundled(): Promise<Content> {
  if (process.env.VERCEL) return seed as Content;
  const raw = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(raw) as Content;
}

async function readBlob(): Promise<Content | null> {
  try {
    // Private blobs are read through the API (no CDN), so admin writes are visible immediately.
    const result = await get(BLOB_PATH, {
      access: "private",
      token: process.env.CONTENT_READ_WRITE_TOKEN,
      useCache: false,
    });
    if (!result || result.statusCode !== 200) return null;
    const text = await new Response(result.stream).text();
    if (!text) return null;
    return JSON.parse(text) as Content;
  } catch {
    return null;
  }
}

async function putBlob(content: Content): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(content, null, 2), {
    access: "private",
    token: process.env.CONTENT_READ_WRITE_TOKEN,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function readContent(): Promise<Content> {
  if (blobEnabled()) {
    const stored = await readBlob();
    if (stored) return stored;
    const initial = await readBundled();
    await putBlob(initial);
    return initial;
  }
  return readBundled();
}

export async function writeContent(content: Content): Promise<void> {
  if (blobEnabled()) {
    await putBlob(content);
    return;
  }
  if (isReadOnlyDeployment()) {
    throw new Error(
      "This deployment is read-only. Connect a Blob store to enable editing on the live site."
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
