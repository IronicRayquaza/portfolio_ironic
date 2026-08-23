"use client";

import { useRef } from "react";

export type Desk = {
  readonly id: string;
  readonly label: string;
  readonly note: string;
};

/**
 * The desk rail: index tabs sitting on the section's thick rule, the active one
 * inked solid the way the front-page CTA is.
 *
 * A real tablist, so a keyboard reaches it the way a screen reader announces
 * it — one tab stop for the whole rail, arrows to move between desks. The
 * count beside each label is the tab's own figure, not decoration: it is how
 * you tell there are seventy-three repositories without opening the desk.
 */
export function DeskRail({
  desks,
  active,
  onSelect,
  counts,
}: {
  desks: readonly Desk[];
  active: string;
  onSelect: (id: string) => void;
  counts: Readonly<Record<string, string | undefined>>;
}) {
  const rail = useRef<HTMLDivElement>(null);

  function onKeyDown(event: React.KeyboardEvent) {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    const i = desks.findIndex((d) => d.id === active);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? desks.length - 1
          : (i + (event.key === "ArrowRight" ? 1 : -1) + desks.length) % desks.length;

    onSelect(desks[next].id);
    // Follow the selection with focus — the rail is a single tab stop.
    rail.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }

  return (
    <div
      ref={rail}
      role="tablist"
      aria-label="Blotter desks"
      onKeyDown={onKeyDown}
      className="no-scrollbar -mx-5 flex items-stretch gap-px overflow-x-auto px-5 sm:mx-0 sm:px-0"
    >
      {desks.map((desk) => {
        const selected = desk.id === active;
        return (
          <button
            key={desk.id}
            role="tab"
            type="button"
            id={`desk-tab-${desk.id}`}
            aria-selected={selected}
            aria-controls={`desk-panel-${desk.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(desk.id)}
            className={`control slug slug-sm press shrink-0 whitespace-nowrap border border-b-0 ${
              selected
                ? "border-ink bg-ink text-paper-bright"
                : "border-ink/20 bg-transparent text-ink-soft hover:bg-paper-warm hover:text-ink"
            }`}
          >
            {desk.label}
            {counts[desk.id] && (
              <span className={selected ? "text-paper-bright/55" : "text-ink-faint"}>
                {counts[desk.id]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
