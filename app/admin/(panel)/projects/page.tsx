import type { Metadata } from "next";
import Link from "next/link";
import { readContent, sortByOrder } from "@/lib/store";
import { ProjectsTable } from "@/components/admin/projects-table";
import { Icon } from "@/components/icons";

export const metadata: Metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
  const content = await readContent();
  const projects = sortByOrder(content.projects);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mono mb-2 text-faint">Content</p>
          <h1 className="text-[1.75rem] font-semibold tracking-[-0.035em] text-ink">Projects</h1>
          <p className="mt-2 text-[0.85rem] text-muted">
            {projects.length} case {projects.length === 1 ? "study" : "studies"} · reorder with the
            arrows, edit to change anything.
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn btn-primary btn-sm">
          <Icon name="plus" size={14} />
          New project
        </Link>
      </header>

      <ProjectsTable projects={projects} />

      <p className="text-[0.76rem] leading-relaxed text-faint">
        Tip: wide cards ({'"'}Wide{'"'} in the editor) span the full row and break up the grid —
        one or two per page is usually enough.
      </p>
    </div>
  );
}
