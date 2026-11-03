"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Message } from "@/lib/types";
import { Icon } from "@/components/icons";
import { toast, EmptyState } from "@/components/admin/ui";
import { cn, formatDate } from "@/lib/utils";

export function MessagesList({ messages: initial }: { messages: Message[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initial);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const visible = filter === "all" ? messages : messages.filter((m) => !m.read);
  const unread = messages.filter((m) => !m.read).length;

  async function setRead(id: string, read: boolean) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      toast("Could not update the message.", "error");
    }
  }

  async function remove(id: string) {
    const previous = messages;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast("Message deleted");
      router.refresh();
    } catch {
      setMessages(previous);
      toast("Could not delete the message.", "error");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1">
          {(["all", "unread"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[0.78rem] capitalize transition-colors",
                filter === key
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-line text-muted hover:text-ink"
              )}
            >
              {key}
              <span className="ml-2 tabular-nums opacity-60">
                {key === "all" ? messages.length : unread}
              </span>
            </button>
          ))}
        </div>
        <p className="mono text-[8px] text-faint">Inbox · stored in data/content.json</p>
      </div>

      {!visible.length ? (
        <EmptyState
          icon="message"
          title={filter === "unread" ? "No unread messages" : "Inbox zero"}
          description="Enquiries from the contact form land here — name, email, project type and message."
        />
      ) : (
        <ul className="admin-card divide-y divide-line overflow-hidden">
          {visible.map((message) => {
            const isOpen = openId === message.id;
            return (
              <li key={message.id}>
                <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenId(isOpen ? null : message.id);
                      if (!message.read) setRead(message.id, true);
                    }}
                    className="flex min-w-0 flex-1 items-start gap-3 text-left"
                  >
                    <span
                      className={cn(
                        "mt-1.5 size-2 shrink-0 rounded-full",
                        message.read ? "bg-line-strong" : "bg-accent"
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span
                          className={cn(
                            "text-[0.88rem]",
                            message.read ? "font-medium text-ink-soft" : "font-semibold text-ink"
                          )}
                        >
                          {message.name}
                        </span>
                        <span className="mono rounded border border-line px-1.5 py-0.5 text-[7.5px] text-muted">
                          {message.projectType}
                        </span>
                      </span>
                      <span className="mt-1 block truncate text-[0.8rem] text-muted">
                        {message.message}
                      </span>
                      <span className="mono mt-1.5 block text-[8px] text-faint">
                        {message.email} · {formatDate(message.createdAt)}
                      </span>
                    </span>
                    <Icon
                      name="chevronDown"
                      size={15}
                      className={cn(
                        "mt-1 shrink-0 text-faint transition-transform duration-300",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                </div>

                <div
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-300",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-line bg-[color-mix(in_oklab,var(--bg)_40%,transparent)] px-4 py-4 sm:px-5">
                      <p className="whitespace-pre-wrap text-[0.86rem] leading-relaxed text-ink-soft">
                        {message.message}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <a
                          href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.projectType)}`}
                          className="btn btn-primary btn-sm"
                        >
                          <Icon name="mail" size={13} />
                          Reply
                        </a>
                        <button
                          type="button"
                          onClick={() => setRead(message.id, !message.read)}
                          className="btn btn-ghost btn-sm"
                        >
                          <Icon name={message.read ? "eyeOff" : "eye"} size={13} />
                          Mark {message.read ? "unread" : "read"}
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(message.id)}
                          className="btn btn-ghost btn-sm text-red-400 hover:border-red-500/40"
                        >
                          <Icon name="trash" size={13} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
