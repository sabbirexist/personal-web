"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** One observer for the whole document — elements opt in with data-reveal. */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])")
    );
    if (!nodes.length) return;

    const show = (el: HTMLElement) => el.setAttribute("data-in", "true");

    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach(show);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target as HTMLElement);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
    );

    nodes.forEach((n) => {
      const rect = n.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        show(n);
      } else {
        io.observe(n);
      }
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}

/** Hairline progress bar — transform only, rAF-throttled. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      data-scroll-progress
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] bg-transparent"
    >
      <div
        ref={ref}
        className="h-full w-full origin-left bg-accent"
        style={{ transform: "scaleX(0)", opacity: 0.85 }}
      />
    </div>
  );
}

/** Pointer-follow ember light for the hero. Desktop pointers only. */
export function Spotlight({ targetId }: { targetId: string }) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let x = 50;
    let y = 40;
    const apply = () => {
      raf = 0;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = ((e.clientX - r.left) / r.width) * 100;
      y = ((e.clientY - r.top) / r.height) * 100;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onEnter = () => el.classList.add("has-pointer");
    const onLeave = () => el.classList.remove("has-pointer");

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targetId]);

  return null;
}
