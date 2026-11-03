import { NextResponse } from "next/server";
import { passwordMatches, rateLimit, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a few minutes." },
      { status: 429 }
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json({ error: "Password required." }, { status: 400 });
  }

  if (!passwordMatches(password)) {
    return NextResponse.json({ error: "Wrong password. Try again." }, { status: 401 });
  }

  await setSessionCookie();
  return NextResponse.json({ ok: true });
}
