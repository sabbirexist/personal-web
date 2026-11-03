import type { Metadata } from "next";
import { readContent } from "@/lib/store";
import { MessagesList } from "@/components/admin/messages-list";

export const metadata: Metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  const { messages } = await readContent();

  return (
    <div className="space-y-6">
      <header>
        <p className="mono mb-2 text-faint">Inbox</p>
        <h1 className="text-[1.75rem] font-semibold tracking-[-0.035em] text-ink">Messages</h1>
        <p className="mt-2 text-[0.85rem] text-muted">
          Every enquiry from the contact form, newest first. Reply straight from here.
        </p>
      </header>
      <MessagesList messages={messages} />
    </div>
  );
}
