import type { Metadata } from "next";
import { MediaLibrary } from "@/components/admin/media-library";

export const metadata: Metadata = { title: "Media" };

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="mono mb-2 text-faint">Assets</p>
        <h1 className="text-[1.75rem] font-semibold tracking-[-0.035em] text-ink">Media library</h1>
        <p className="mt-2 text-[0.85rem] text-muted">
          Upload posters, stills and preview loops. Copy a path and paste it into any media field.
        </p>
      </header>
      <MediaLibrary />
    </div>
  );
}
