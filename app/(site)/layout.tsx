import { readContent } from "@/lib/store";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { site } = await readContent();

  return (
    <>
      <span id="top" className="absolute top-0" aria-hidden="true" />
      <Nav
        wordmark={site.wordmark}
        email={site.email}
        available={site.available}
        availability={site.availability}
        socials={site.socials.map((s) => ({ label: s.label, url: s.url }))}
      />
      <main id="main">{children}</main>
      <Footer site={site} />
    </>
  );
}
