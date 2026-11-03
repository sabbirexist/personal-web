import { NextResponse } from "next/server";
import { readContent, updateContent } from "@/lib/store";
import { uid } from "@/lib/utils";
import { isAuthenticated } from "@/lib/auth";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // honeypot — silently accept bots
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().slice(0, 160);
  const projectType = String(body.projectType ?? "General enquiry").trim().slice(0, 120);
  const message = String(body.message ?? "").trim().slice(0, 4000);

  if (name.length < 2) return NextResponse.json({ error: "Please add your name." }, { status: 422 });
  if (!emailPattern.test(email))
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 422 });
  if (message.length < 10)
    return NextResponse.json({ error: "Tell me a little more about the project." }, { status: 422 });

  await updateContent((content) => {
    content.messages.unshift({
      id: uid("m"),
      name,
      email,
      projectType,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    });
  });

  // light abuse guard: keep the inbox from growing unbounded
  const after = await readContent();
  if (after.messages.length > 500) {
    await updateContent((content) => {
      content.messages = content.messages.slice(0, 500);
    });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const { messages } = await readContent();
  return NextResponse.json({ messages });
}
