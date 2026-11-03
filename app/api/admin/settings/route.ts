import { NextResponse } from "next/server";
import { updateContent } from "@/lib/store";
import { guard, revalidateSite, asString, asBool, asNumber } from "@/lib/api";
import type { Social, Stat } from "@/lib/types";

const accents = ["ember", "tangerine", "amber", "coral"];

export async function PUT(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  await updateContent((content) => {
    const s = content.site;
    const socialsRaw = Array.isArray(body.socials) ? body.socials : [];
    const statsRaw = Array.isArray(body.stats) ? body.stats : [];
    const seoRaw = (body.seo ?? {}) as Record<string, unknown>;

    content.site = {
      ...s,
      name: asString(body.name, s.name).trim() || s.name,
      wordmark: asString(body.wordmark, s.wordmark).trim().toUpperCase() || s.wordmark,
      role: asString(body.role, s.role),
      tagline: asString(body.tagline, s.tagline),
      taglineAccent: asString(body.taglineAccent, s.taglineAccent),
      intro: asString(body.intro, s.intro),
      bio: Array.isArray(body.bio) ? body.bio.map(String).filter(Boolean) : s.bio,
      email: asString(body.email, s.email).trim(),
      phone: asString(body.phone, s.phone),
      location: asString(body.location, s.location),
      timezone: asString(body.timezone, s.timezone) || "Asia/Dhaka",
      availability: asString(body.availability, s.availability),
      available: asBool(body.available, s.available),
      reelUrl: asString(body.reelUrl, s.reelUrl),
      reelPoster: asString(body.reelPoster, s.reelPoster),
      portrait: asString(body.portrait, s.portrait),
      portraitSquare: asString(body.portraitSquare, s.portraitSquare || s.portrait),
      socials: socialsRaw
        .map((raw) => {
          const item = raw as Record<string, unknown>;
          return {
            label: asString(item.label).trim(),
            url: asString(item.url).trim(),
            handle: asString(item.handle).trim(),
          } satisfies Social;
        })
        .filter((item) => item.label && item.url),
      stats: statsRaw
        .map((raw) => {
          const item = raw as Record<string, unknown>;
          return {
            label: asString(item.label).trim(),
            value: asNumber(item.value, 0),
            suffix: asString(item.suffix),
          } satisfies Stat;
        })
        .filter((item) => item.label),
      seo: {
        title: asString(seoRaw.title, s.seo.title),
        description: asString(seoRaw.description, s.seo.description),
        keywords: Array.isArray(seoRaw.keywords)
          ? seoRaw.keywords.map(String)
          : asString(seoRaw.keywords, s.seo.keywords.join(", "))
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean),
      },
      footerNote: asString(body.footerNote, s.footerNote),
      accent: accents.includes(asString(body.accent)) ? (asString(body.accent) as typeof s.accent) : s.accent,
    };
  });

  revalidateSite();
  return NextResponse.json({ ok: true });
}
