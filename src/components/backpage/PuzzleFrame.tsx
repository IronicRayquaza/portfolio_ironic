import type { ReactNode } from "react";

/**
 * The sheet a puzzle is printed on.
 *
 * Presentational only — it holds no game state and knows nothing about the
 * particular puzzle inside it: a bordered card, a header, a rubric, one live
 * region and an action row. `no` is optional because the crossword is the
 * only game left on the page — nothing to number it against.
 *
 * `bg-paper-bright` is already the site's fresh-sheet surface (it is what the
 * contact form's fields sit on), so this reads as something to fill in too.
 */
export function PuzzleFrame({
  id,
  no,
  title,
  rubric,
  status,
  tone = "neutral",
  actions,
  aside,
  children,
}: {
  id: string;
  no?: number;
  title: string;
  rubric: string;
  /** The live line. Kept short — it is spoken on every change. */
  status: string;
  /** Colour only; the wording always carries the meaning on its own. */
  tone?: "neutral" | "good" | "bad";
  actions?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  const toneClass =
    tone === "good" ? "text-stamp" : tone === "bad" ? "text-ink" : "text-ink-faint";

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="flex h-full scroll-mt-24 flex-col border border-ink/20 bg-paper-bright"
    >
      <header className="flex items-baseline justify-between gap-4 border-b border-ink/15 px-4 py-3 sm:px-6">
        <h3 id={`${id}-title`} className="font-display text-2xl leading-none sm:text-3xl">
          {title}
        </h3>
        {no !== undefined && (
          <p className="control-sm shrink-0 text-ink-faint">No. {no}</p>
        )}
      </header>

      <p className="font-serif px-4 pt-4 text-sm italic text-ink-soft sm:px-6">{rubric}</p>

      <div className="grow px-4 py-5 sm:px-6">{children}</div>

      {aside && <div className="border-t border-ink/15 px-4 py-4 sm:px-6">{aside}</div>}

      <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-ink/15 px-4 py-3 sm:px-6">
        {/* One live region per puzzle. Polite, never assertive — a puzzle should
            not interrupt whatever a screen reader is already saying. */}
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={`control-sm min-h-[1rem] flex-1 ${toneClass}`}
        >
          {status}
        </p>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </footer>
    </section>
  );
}
