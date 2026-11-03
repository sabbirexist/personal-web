"use client";

import { useState } from "react";
import type { Service } from "@/lib/types";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function ServicesAccordion({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-2.5">
      {services.map((service, index) => {
        const isActive = active === index;
        return (
          <div
            key={service.id}
            className={cn(
              "overflow-hidden rounded-[22px] border transition-colors duration-500",
              isActive ? "svc-active" : "border-line bg-card text-ink hover:border-line-strong"
            )}
            data-reveal
            style={{ "--delay": `${index * 60}ms` } as React.CSSProperties}
          >
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-expanded={isActive}
              aria-controls={`service-panel-${service.id}`}
              className="flex w-full items-center gap-3 px-4 py-4 text-left sm:gap-5 sm:px-6 sm:py-5"
            >
              <span className={cn("mono w-6 shrink-0 text-[10px]", isActive ? "svc-dim" : "text-faint")}>
                0{index + 1}
              </span>
              <span className="flex-1 text-[1.05rem] font-semibold tracking-[-0.03em] sm:text-[1.25rem]">
                {service.title}
              </span>
              <span className="hidden items-center gap-1.5 md:flex">
                {service.deliverables.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[0.72rem] whitespace-nowrap",
                      isActive ? "svc-border svc-muted" : "border-line text-muted"
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </span>
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-500 sm:size-10",
                  isActive
                    ? "border-transparent bg-accent text-accent-ink"
                    : "border-line text-muted"
                )}
              >
                <Icon
                  name="plus"
                  size={16}
                  className={cn("transition-transform duration-500", isActive && "rotate-45")}
                />
              </span>
            </button>

            <div
              id={`service-panel-${service.id}`}
              role="region"
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
                isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="grid gap-5 px-4 pb-5 sm:px-6 sm:pb-6 md:grid-cols-12 md:items-stretch md:gap-7">
                  <div className="flex flex-col justify-center md:col-span-6">
                    <p className={cn("text-[0.92rem] leading-[1.65]", isActive ? "svc-muted" : "text-muted")}>
                      {service.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {service.deliverables.map((tag) => (
                        <span
                          key={tag}
                          className="svc-border rounded-full border px-2.5 py-1 text-[0.72rem] svc-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href="#contact"
                      className="svc-border svc-muted mt-5 inline-flex items-center gap-1.5 self-start rounded-full border px-3.5 py-1.5 text-[0.76rem] font-medium transition-colors duration-300 hover:border-accent hover:text-accent"
                    >
                      Start a project
                      <Icon name="arrowUpRight" size={12} />
                    </a>
                  </div>
                  <div className="md:col-span-6">
                    <div className="relative h-full min-h-[170px] overflow-hidden rounded-xl bg-black/25 sm:min-h-[190px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={service.image || "/work/ember.webp"}
                        alt={`${service.title} — recent frame`}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
