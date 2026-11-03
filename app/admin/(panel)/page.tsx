import Link from "next/link";
import type { Metadata } from "next";
import { readContent, sortByOrder } from "@/lib/store";
import { Icon } from "@/components/icons";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminOverviewPage() {
  const content = await readContent();
  const projects = sortByOrder(content.projects);
  const messages = content.messages;
  const unread = messages.filter((m) => !m.read);

  const stats = [
    {
      label: "Projects",
      value: projects.length,
      hint: `${projects.filter((p) => p.featured).length} featured`,
      href: "/admin/projects",
      icon: "film" as const,
    },
    {
      label: "Services",
      value: content.services.length,
      hint: "visible on site",
      href: "/admin/content",
      icon: "layers" as const,
    },
    {
      label: "Enquiries",
      value: messages.length,
      hint: `${unread.length} unread`,
      href: "/admin/messages",
      icon: "message" as const,
    },
    {
      label: "Testimonials",
      value: content.testimonials.length,
      hint: "on the homepage",
      href: "/admin/testimonials",
      icon: "quote" as const,
    },
  ];

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mono mb-2 text-faint">Studio overview</p>
          <h1 className="text-[1.75rem] font-semibold tracking-[-0.035em] text-ink">
            Good to see you,{" "}
            <span className="serif italic text-accent-text">{content.site.name}</span>
          </h1>
          <p className="mt-2 text-[0.85rem] text-muted">
            {content.site.available
              ? "Your site is live and showing you as available for work."
              : "Your site is live — availability is currently set to booked."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/" target="_blank" className="btn btn-ghost btn-sm">
            <Icon name="external" size={14} />
            View site
          </Link>
          <Link href="/admin/projects/new" className="btn btn-primary btn-sm">
            <Icon name="plus" size={14} />
            New project
          </Link>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="admin-card group p-5 transition-colors duration-300 hover:border-line-strong"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-lg bg-accent-soft text-accent">
                <Icon name={stat.icon} size={16} />
              </span>
              <Icon
                name="arrowUpRight"
                size={14}
                className="text-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </div>
            <p className="mt-5 text-[1.9rem] font-semibold leading-none tracking-[-0.04em] text-ink">
              {String(stat.value).padStart(2, "0")}
            </p>
            <p className="mt-2 text-[0.78rem] text-muted">{stat.label}</p>
            <p className="mono mt-1 text-[8px] text-faint">{stat.hint}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <section className="admin-card lg:col-span-3">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-[0.9rem] font-semibold tracking-[-0.02em]">Recent enquiries</h2>
            <Link href="/admin/messages" className="mono text-[9px] text-accent-text hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-line">
            {messages.slice(0, 4).map((message) => (
              <Link
                key={message.id}
                href="/admin/messages"
                className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--ink)_4%,transparent)]"
              >
                <span
                  className={`mt-1.5 size-1.5 shrink-0 rounded-full ${message.read ? "bg-line-strong" : "bg-accent"}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3">
                    <span className="truncate text-[0.86rem] font-medium text-ink">{message.name}</span>
                    <span className="mono shrink-0 text-[8px] text-faint">
                      {formatDate(message.createdAt)}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-[0.78rem] text-muted">
                    {message.projectType} — {message.message}
                  </span>
                </span>
              </Link>
            ))}
            {messages.length === 0 && (
              <p className="px-5 py-10 text-center text-[0.82rem] text-faint">
                No enquiries yet. They&apos;ll appear here the moment someone writes.
              </p>
            )}
          </div>
        </section>

        <section className="admin-card lg:col-span-2">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-[0.9rem] font-semibold tracking-[-0.02em]">Publishing</h2>
          </div>
          <dl className="divide-y divide-line text-[0.82rem]">
            {[
              { label: "Availability", value: content.site.available ? "Open" : "Booked" },
              { label: "Accent", value: content.site.accent },
              { label: "Projects live", value: `${projects.length}` },
              { label: "Location", value: content.site.location },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between px-5 py-3">
                <dt className="text-faint">{row.label}</dt>
                <dd className="font-medium capitalize text-ink-soft">{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className="p-5 pt-4">
            <Link href="/admin/settings" className="btn btn-ghost btn-sm w-full">
              <Icon name="pencil" size={13} />
              Edit site settings
            </Link>
          </div>
        </section>
      </div>

      <section className="admin-card">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-[0.9rem] font-semibold tracking-[-0.02em]">Latest work</h2>
          <Link href="/admin/projects" className="mono text-[9px] text-accent-text hover:underline">
            Manage
          </Link>
        </div>
        <div className="divide-y divide-line">
          {projects.slice(0, 4).map((project) => (
            <Link
              key={project.id}
              href={`/admin/projects/${project.id}`}
              className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-[color-mix(in_oklab,var(--ink)_4%,transparent)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.poster}
                alt=""
                className="h-11 w-16 shrink-0 rounded-md object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.86rem] font-medium text-ink">
                  {project.title}
                </span>
                <span className="mono mt-0.5 block text-[8px] text-faint">
                  {project.category} · {project.year}
                </span>
              </span>
              {project.featured && <span className="badge badge-accent">Featured</span>}
              <Icon name="arrowRight" size={14} className="text-faint" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
