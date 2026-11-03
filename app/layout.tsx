import type { Metadata, Viewport } from "next";
import "./globals.css";
import { readContent } from "@/lib/store";
import { bootScript } from "@/lib/boot";
import { LogoMark } from "@/components/logo";
import { RevealObserver, ScrollProgress } from "@/components/client/motion";
import { LightboxHost } from "@/components/client/lightbox";
import { Analytics } from "@vercel/analytics/next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3007";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await readContent();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: site.seo.title,
      template: `%s — ${site.wordmark}`,
    },
    description: site.seo.description,
    keywords: site.seo.keywords,
    authors: [{ name: site.name }],
    creator: site.name,
    openGraph: {
      type: "website",
      url: siteUrl,
      title: site.seo.title,
      description: site.seo.description,
      siteName: `${site.wordmark} — ${site.role}`,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: site.seo.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: site.seo.title,
      description: site.seo.description,
      images: ["/og.png"],
    },
    robots: { index: true, follow: true },
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/favicon.svg" }],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0a09" },
    { media: "(prefers-color-scheme: light)", color: "#f7f4ee" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { site } = await readContent();

  return (
    <html
      lang="en"
      data-theme="dark"
      data-accent={site.accent}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preload"
          href="/fonts/InterTight.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/InstrumentSerif-Italic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <div className="intro-curtain">
          <div className="intro-inner flex flex-col items-center gap-5">
            <span className="text-accent">
              <LogoMark size={46} />
            </span>
            <div className="flex flex-col items-center gap-2">
              <span className="display text-[1.35rem] tracking-[-0.05em] text-ink">
                {site.wordmark}
                <span className="text-accent">.</span>
              </span>
              <span className="mono text-[9px] text-faint">Showreel · MMXXVI</span>
            </div>
            <div className="h-px w-44 overflow-hidden bg-line">
              <div className="intro-bar h-full w-full bg-accent" />
            </div>
          </div>
        </div>

        <ScrollProgress />
        <RevealObserver />
        <LightboxHost />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
