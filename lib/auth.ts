import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "sabbir_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret(): string {
  return process.env.AUTH_SECRET || "sabbir-portfolio-dev-secret-change-me";
}

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "sabbir2026";
}

function sign(value: string): string {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createToken(): string {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = `admin.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [scope, exp, sig] = parts;
  if (scope !== "admin") return false;
  const payload = `${scope}.${exp}`;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;
  return Number(exp) > Date.now();
}

export function passwordMatches(input: string): boolean {
  const a = Buffer.from(adminPassword());
  const b = Buffer.from(input ?? "");
  if (a.length !== b.length) {
    // still burn a comparison to keep timing uniform-ish
    crypto.timingSafeEqual(a, a);
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

export async function setSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(COOKIE)?.value);
}

/** Simple in-memory throttle for the login endpoint. */
const attempts = new Map<string, { count: number; first: number }>();
export function rateLimit(key: string, limit = 8, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.first > windowMs) {
    attempts.set(key, { count: 1, first: now });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}
