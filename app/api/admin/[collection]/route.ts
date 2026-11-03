import { NextResponse } from "next/server";
import { readContent, updateContent } from "@/lib/store";
import { guard, isCollection, revalidateSite, asNumber } from "@/lib/api";
import { slugify, uid } from "@/lib/utils";
import type { Content, Project, Service, Testimonial, ProcessStep } from "@/lib/types";

type AnyItem = Project | Service | Testimonial | ProcessStep;

function nextOrder(items: { order: number }[]): number {
  return items.reduce((max, item) => Math.max(max, item.order), 0) + 1;
}

/** Normalise whatever the client posted into a valid item. */
function normalise(collection: string, raw: Record<string, unknown>, existing?: AnyItem): AnyItem {
  const order = existing?.order ?? asNumber(raw.order, 1);

  if (collection === "projects") {
    const base = (existing as Project | undefined) ?? ({} as Project);
    const title = String(raw.title ?? base.title ?? "Untitled project");
    return {
      ...base,
      id: base.id ?? uid("p"),
      slug: slugify(String(raw.slug ?? base.slug ?? title)),
      title,
      subtitle: String(raw.subtitle ?? base.subtitle ?? ""),
      category: String(raw.category ?? base.category ?? "Brand Film"),
      year: String(raw.year ?? base.year ?? String(new Date().getFullYear())),
      client: String(raw.client ?? base.client ?? ""),
      role: String(raw.role ?? base.role ?? ""),
      tools: Array.isArray(raw.tools) ? raw.tools.map(String) : base.tools ?? [],
      summary: String(raw.summary ?? base.summary ?? ""),
      body: Array.isArray(raw.body) ? raw.body.map(String) : base.body ?? [],
      poster: String(raw.poster ?? base.poster ?? "/work/ember.jpg"),
      videoUrl: String(raw.videoUrl ?? base.videoUrl ?? ""),
      previewUrl: String(raw.previewUrl ?? base.previewUrl ?? ""),
      gallery: Array.isArray(raw.gallery) ? raw.gallery.map(String) : base.gallery ?? [],
      featured: typeof raw.featured === "boolean" ? raw.featured : base.featured ?? false,
      size: raw.size === "wide" || raw.size === "half" ? raw.size : base.size ?? "half",
      results: Array.isArray(raw.results)
        ? (raw.results as { label?: string; value?: string }[]).map((r) => ({
            label: String(r.label ?? ""),
            value: String(r.value ?? ""),
          }))
        : base.results ?? [],
      order: asNumber(raw.order, order),
    } satisfies Project;
  }

  if (collection === "services") {
    const base = (existing as Service | undefined) ?? ({} as Service);
    return {
      ...base,
      id: base.id ?? uid("s"),
      title: String(raw.title ?? base.title ?? "New service"),
      description: String(raw.description ?? base.description ?? ""),
      image: String(raw.image ?? base.image ?? "/work/ember.webp"),
      deliverables: Array.isArray(raw.deliverables)
        ? raw.deliverables.map(String)
        : typeof raw.deliverables === "string"
          ? String(raw.deliverables)
              .split(/\r?\n|,/)
              .map((s) => s.trim())
              .filter(Boolean)
          : base.deliverables ?? [],
      order: asNumber(raw.order, order),
    } satisfies Service;
  }

  if (collection === "testimonials") {
    const base = (existing as Testimonial | undefined) ?? ({} as Testimonial);
    return {
      ...base,
      id: base.id ?? uid("t"),
      quote: String(raw.quote ?? base.quote ?? ""),
      name: String(raw.name ?? base.name ?? ""),
      title: String(raw.title ?? base.title ?? ""),
      company: String(raw.company ?? base.company ?? ""),
      order: asNumber(raw.order, order),
    } satisfies Testimonial;
  }

  const base = (existing as ProcessStep | undefined) ?? ({} as ProcessStep);
  return {
    ...base,
    id: base.id ?? uid("pr"),
    title: String(raw.title ?? base.title ?? "New step"),
    description: String(raw.description ?? base.description ?? ""),
    order: asNumber(raw.order, order),
  } satisfies ProcessStep;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  const denied = await guard();
  if (denied) return denied;

  const { collection } = await params;
  if (!isCollection(collection) || collection === "messages") {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  const raw = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const item = normalise(collection, raw);

  await updateContent((content) => {
    const list = content[collection] as unknown as AnyItem[];
    item.order = nextOrder(list);
    list.push(item);
  });

  revalidateSite(collection === "projects" ? (item as Project).slug : undefined);
  return NextResponse.json({ ok: true, item });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  const denied = await guard();
  if (denied) return denied;
  const { collection } = await params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }
  const content = await readContent();
  return NextResponse.json({ items: (content as unknown as Record<string, unknown>)[collection] });
}
