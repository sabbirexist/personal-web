import type { Metadata } from "next";
import { readContent } from "@/lib/store";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const { site } = await readContent();
  return <SettingsForm site={site} />;
}
