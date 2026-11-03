import "server-only";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";

export async function guard(): Promise<NextResponse | null> {
  if (await isAuthenticated()) return null;
  return NextResponse.json({ error: "Unauthorised. Sign in again." }, { status: 401 });
}

export const COLLECTIONS = ["projects", "services", "testimonials", "process", "messages"] as const;
export type CollectionName = (typeof COLLECTIONS)[number];

export function isCollection(value: string): value is CollectionName {
  return (COLLECTIONS as readonly string[]).includes(value);
}

export function revalidateSite(slug?: string) {
  try {
    revalidatePath("/");
    revalidatePath("/work");
    if (slug) revalidatePath(`/work/${slug}`);
  } catch {
    /* revalidation is best-effort in dev */
  }
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v)).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

export function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function asBool(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}
