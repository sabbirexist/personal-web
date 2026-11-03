import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { readContent } from "@/lib/store";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Toaster } from "@/components/admin/ui";

export const metadata = {
  title: "Studio admin",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const { messages } = await readContent();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-[100svh] bg-bg">
      <AdminSidebar unread={unread} />
      <Toaster />
      <div className="lg:pl-[250px]">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
          {children}
        </div>
      </div>
    </div>
  );
}
