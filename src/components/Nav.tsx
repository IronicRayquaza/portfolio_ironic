"use client";

import { useEffect, useState } from "react";
import { identity, nav } from "@/lib/content";

/**
 * Sticky rail. Sits transparent under the masthead, then gains its paper
 * background and rules once the page scrolls past the nameplate.
 */
export function Nav() {
  const [stuck, setStuck] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section owns the viewport so the rail can mark it.
  useEffect(() => {
    const sections = nav
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => el !== null);

    if (sections.length === 0 || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Sections"
      className={`sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300 ease-out ${
        stuck
          ? "border-b border-ink/20 bg-paper/95 shadow-[0_1px_0_0_rgba(22,20,15,0.06),0_8px_24px_-16px_rgba(22,20,15,0.35)] backdrop-blur-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12">
        <a
          href="#top"
          className="font-display press link-pencil shrink-0 text-lg leading-none tracking-tight"
        >
          {identity.name}
        </a>

        {/* overflow-y-hidden + no-scrollbar: with only overflow-x set, the rail
            resolved overflow-y to auto as well and printed a scrollbar straight
            down the right edge of the Hire him plate. */}
        <ul className="no-scrollbar -my-1 flex min-w-0 items-center gap-4 overflow-x-auto overflow-y-hidden py-1 sm:gap-6">
          {nav.map((item) => (
            <li key={item.href} className="shrink-0">
              <a
                href={item.href}
                aria-current={active === item.href ? "true" : undefined}
                className={`control press link-pencil whitespace-nowrap ${
                  active === item.href ? "text-stamp" : "text-ink-soft hover:text-ink"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="shrink-0">
            <a
              href={`mailto:${identity.email}`}
              className="control press border border-ink bg-ink px-3.5 py-2.5 text-paper-bright hover:border-stamp hover:bg-stamp sm:px-4"
            >
              Hire him
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
