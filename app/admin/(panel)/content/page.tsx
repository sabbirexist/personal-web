import type { Metadata } from "next";
import { readContent, sortByOrder } from "@/lib/store";
import { ListEditor } from "@/components/admin/list-editor";

export const metadata: Metadata = { title: "Services & process" };

export default async function AdminContentPage() {
  const content = await readContent();
  const services = sortByOrder(content.services);
  const process = sortByOrder(content.process);

  return (
    <div className="space-y-6">
      <header>
        <p className="mono mb-2 text-faint">Content</p>
        <h1 className="text-[1.75rem] font-semibold tracking-[-0.035em] text-ink">
          Services &amp; process
        </h1>
        <p className="mt-2 text-[0.85rem] text-muted">
          These populate the {'"'}What I do{'"'} list and the four-step process section.
        </p>
      </header>

      <ListEditor
        collection="services"
        singular="Service"
        addLabel="Add service"
        title="Services"
        description="Keep it to four for the strongest layout."
        requiredKey="title"
        items={services as unknown as (Record<string, unknown> & { id: string })[]}
        fields={[
          { key: "title", label: "Title", placeholder: "Editing & Post" },
          { key: "deliverables", label: "Deliverables", type: "lines", hint: "One per line.", placeholder: "Offline & online edit\nColour grade" },
          { key: "description", label: "Description", type: "textarea", full: true },
          { key: "image", label: "Card image", type: "media", full: true, hint: "Shown when this service is expanded." },
        ]}
      />

      <ListEditor
        collection="process"
        singular="Step"
        addLabel="Add step"
        title="Process"
        description="The calm four-step story clients read before they email."
        requiredKey="title"
        items={process as unknown as (Record<string, unknown> & { id: string })[]}
        fields={[
          { key: "title", label: "Title", placeholder: "Brief & Discovery" },
          { key: "description", label: "Description", type: "textarea", full: true },
        ]}
      />
    </div>
  );
}
