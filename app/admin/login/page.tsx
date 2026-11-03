import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { readContent } from "@/lib/store";
import { LoginForm } from "@/components/admin/login-form";
import { LogoMark } from "@/components/logo";

export const metadata: Metadata = {
  title: "Studio sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");
  const { site } = await readContent();

  return (
    <main className="grid min-h-[100svh] overflow-hidden lg:grid-cols-2">
      {/* brand panel */}
      <div className="relative hidden overflow-hidden border-r border-line bg-bg-deep lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="grid-lines opacity-40" aria-hidden="true" />
        <div className="glow -left-20 top-1/3 h-[420px] w-[420px] opacity-80" aria-hidden="true" />

        <div className="relative flex items-center gap-3">
          <span className="text-accent">
            <LogoMark size={30} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[1rem] font-semibold tracking-[-0.03em] text-ink">
              {site.wordmark}
              <span className="text-accent">.</span>
            </span>
            <span className="mono mt-1 text-[8px] text-faint">{site.role}</span>
          </span>
        </div>

        <div className="relative max-w-md">
          <p className="mono mb-4 text-accent-text">Content management</p>
          <h2 className="display text-[3.2rem] leading-[0.92] text-ink">
            Every frame,
            <br />
            <span className="serif italic text-accent-text">under control.</span>
          </h2>
          <p className="mt-6 text-[0.9rem] leading-relaxed text-muted">
            Projects, case studies, services and enquiries — all in one quiet place. Changes go
            live the moment you hit save.
          </p>
        </div>

        <div className="relative flex items-center gap-6 text-[0.75rem] text-faint">
          <span className="flex items-center gap-2">
            <span className="dot" /> {site.available ? "Available" : "Booked"}
          </span>
          <span>{site.location}</span>
          <span>GMT+6</span>
        </div>
      </div>

      {/* form */}
      <div className="relative flex items-center justify-center px-6 py-16">
        <div className="glow -right-24 top-0 h-80 w-80 opacity-50 lg:hidden" aria-hidden="true" />
        <LoginForm />
      </div>
    </main>
  );
}
