import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { Icon } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center px-6 py-24">
      <div className="flex max-w-md flex-col items-center text-center">
        <span className="text-accent">
          <LogoMark size={40} />
        </span>
        <p className="mono mt-8 text-faint">Error 404</p>
        <h1 className="h2 mt-3">
          This frame doesn&apos;t <span className="serif italic ember-text">exist</span>
        </h1>
        <p className="body-copy mt-4">
          The page you were looking for has been cut. Let&apos;s get you back to the timeline.
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          Back to home
          <Icon name="arrowRight" size={15} />
        </Link>
      </div>
    </main>
  );
}
