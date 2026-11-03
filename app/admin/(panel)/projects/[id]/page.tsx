import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readContent } from "@/lib/store";
import { ProjectForm } from "@/components/admin/project-form";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { projects } = await readContent();
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  return <ProjectForm project={project} />;
}
