import { NextResponse } from "next/server";
import { updateContent } from "@/lib/store";
import { guard, isCollection, revalidateSite } from "@/lib/api";
import type { Content, Project } from "@/lib/types";

type Item = { id: string; order?: number; [key: string]: unknown };

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const denied = await guard();
  if (denied) return denied;

  const { collection, id } = await params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  const patch = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  let slug: string | undefined;
  const found = await updateContent((content) => {
    const list = (content as unknown as Record<string, Item[]>)[collection];
    const item = list?.find((entry) => entry.id === id);
    if (!item) return false;
    Object.assign(item, patch, { id });
    if (collection === "projects") slug = (item as unknown as Project).slug;
    return true;
  });

  if (!found) return NextResponse.json({ error: "Item not found" }, { status: 404 });
  revalidateSite(slug);
  return NextResponse.json({ ok: true });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const denied = await guard();
  if (denied) return denied;

  const { collection, id } = await params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  let slug: string | undefined;
  const found = await updateContent((content) => {
    const list = (content as unknown as Record<string, Item[]>)[collection];
    const index = list?.findIndex((entry) => entry.id === id) ?? -1;
    if (index < 0) return false;
    const merged = { ...list[index], ...body, id } as Item;
    list[index] = merged;
    if (collection === "projects") slug = (merged as unknown as Project).slug;
    return true;
  });

  if (!found) return NextResponse.json({ error: "Item not found" }, { status: 404 });
  revalidateSite(slug);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const denied = await guard();
  if (denied) return denied;

  const { collection, id } = await params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  const content = (await updateContent((content) => {
    const list = (content as unknown as Record<string, Item[]>)[collection];
    const index = list?.findIndex((entry) => entry.id === id) ?? -1;
    if (index < 0) return null;
    list.splice(index, 1);
    return content;
  })) as Content | null;

  if (!content) return NextResponse.json({ error: "Item not found" }, { status: 404 });
  revalidateSite();
  return NextResponse.json({ ok: true });
}
