import { NextResponse } from "next/server";
import { updateContent } from "@/lib/store";
import { guard, isCollection, revalidateSite } from "@/lib/api";

/** Replace a whole collection (used by the inline editors + drag reordering). */
export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as {
    collection?: string;
    items?: unknown[];
  };

  if (!body.collection || !isCollection(body.collection) || body.collection === "messages") {
    return NextResponse.json({ error: "Unknown collection" }, { status: 400 });
  }
  if (!Array.isArray(body.items)) {
    return NextResponse.json({ error: "items must be an array" }, { status: 400 });
  }

  const collection = body.collection;
  const items = body.items;

  await updateContent((content) => {
    const normalised = items.map((raw, index) => ({
      ...(raw as Record<string, unknown>),
      order: index + 1,
    }));
    (content as unknown as Record<string, unknown[]>)[collection] = normalised;
  });

  revalidateSite();
  return NextResponse.json({ ok: true });
}

/** Reorder by id list: { collection, ids: [...] } */
export async function PATCH(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as {
    collection?: string;
    ids?: string[];
  };

  if (!body.collection || !isCollection(body.collection) || !Array.isArray(body.ids)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const collection = body.collection;
  const ids = body.ids;
  await updateContent((content) => {
    const list = (content as unknown as Record<string, { id: string; order: number }[]>)[collection];
    list?.forEach((item) => {
      const index = ids.indexOf(item.id);
      if (index >= 0) item.order = index + 1;
    });
    list?.sort((a, b) => a.order - b.order);
  });

  revalidateSite();
  return NextResponse.json({ ok: true });
}
