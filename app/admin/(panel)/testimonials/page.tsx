import type { Metadata } from "next";
import { readContent, sortByOrder } from "@/lib/store";
import { ListEditor } from "@/components/admin/list-editor";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const content = await readContent();
  const testimonials = sortByOrder(content.testimonials);

  return (
    <div className="space-y-6">
      <header>
        <p className="mono mb-2 text-faint">Content</p>
        <h1 className="text-[1.75rem] font-semibold tracking-[-0.035em] text-ink">Testimonials</h1>
        <p className="mt-2 text-[0.85rem] text-muted">
          Three short quotes work best. Pull the sentence that would convince a stranger.
        </p>
      </header>

      <ListEditor
        collection="testimonials"
        singular="Testimonial"
        addLabel="Add testimonial"
        title="Client quotes"
        description="Shown in a three-column grid on the homepage."
        requiredKey="name"
        items={testimonials as unknown as (Record<string, unknown> & { id: string })[]}
        fields={[
          { key: "quote", label: "Quote", type: "textarea", full: true, hint: "No quotation marks needed." },
          { key: "name", label: "Name", placeholder: "Nadia Rahman" },
          { key: "title", label: "Job title", placeholder: "Brand Director" },
          { key: "company", label: "Company", placeholder: "Aether Studios" },
        ]}
      />
    </div>
  );
}
