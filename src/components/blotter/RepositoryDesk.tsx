"use client";

import { useMemo, useState } from "react";
import type { Repo } from "@/lib/github";

const DATE = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

type Filter = { id: string; label: string; count: number };

/**
 * The index of holdings: every repository he owns, most recently worked first.
 *
 * Set as an index rather than a grid of cards — most of these are working
 * repositories with no description to put on a card, and a newspaper prints a
 * long list as a column of small type. The filters are the point of the desk:
 * they are how you ask the record a question rather than just read it.
 */
export function RepositoryDesk({
  repos,
  profile,
}: {
  repos: readonly Repo[];
  profile: string;
}) {
  const [filter, setFilter] = useState("all");

  const filters = useMemo<readonly Filter[]>(() => {
    const byLanguage = new Map<string, number>();
    for (const repo of repos) {
      if (repo.language) byLanguage.set(repo.language, (byLanguage.get(repo.language) ?? 0) + 1);
    }

    // Six languages is as many chips as fit before the row starts wrapping
    // into a paragraph; the rest stay reachable through the Languages desk.
    const top = [...byLanguage]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 6)
      .map(([label, count]) => ({ id: `lang:${label}`, label, count }));

    return [
      { id: "all", label: "All", count: repos.length },
      { id: "deployed", label: "Deployed", count: repos.filter((r) => r.deployed).length },
      ...top,
    ];
  }, [repos]);

  const shown = useMemo(() => {
    if (filter === "all") return repos;
    if (filter === "deployed") return repos.filter((r) => r.deployed);
    const language = filter.slice("lang:".length);
    return repos.filter((r) => r.language === language);
  }, [repos, filter]);

  const active = filters.find((f) => f.id === filter);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 className="font-display text-2xl leading-none sm:text-3xl">Index of Holdings</h3>
        <p className="control-sm text-ink-faint" aria-live="polite">
          {shown.length} shown{active && active.id !== "all" ? ` · ${active.label}` : ""}
        </p>
      </div>

      <div
        role="group"
        aria-label="Filter the index"
        className="no-scrollbar rule-thin -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pt-4 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {filters.map((f) => {
          const on = f.id === filter;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(f.id)}
              className={`control press shrink-0 whitespace-nowrap border px-2.5 py-2 ${
                on
                  ? "border-stamp bg-stamp text-paper-bright"
                  : "border-ink/20 text-ink-soft hover:border-ink/45 hover:bg-paper-warm hover:text-ink"
              }`}
            >
              {f.label}
              <span className={`ml-2 ${on ? "text-paper-bright/60" : "text-ink-faint"}`}>
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* The index scrolls inside the desk. Seventy-odd rows printed in full
          would push every other desk off the bottom of the page. */}
      <div className="thin-scrollbar mt-4 max-h-[30rem] overflow-y-auto border-t border-ink/15 pr-1">
        <ol className="divide-y divide-ink/12">
          {shown.map((repo, i) => (
            <li
              key={repo.name}
              className="lab-row grid grid-cols-[2.25rem_1fr] items-baseline gap-x-3 py-3 sm:grid-cols-[2.75rem_1fr_7.5rem_6.5rem] sm:gap-x-5"
            >
              <span className="control-sm text-ink-faint">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="flex min-w-0 flex-wrap items-baseline gap-x-2.5">
                <a
                  href={`${profile}/${repo.name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-display press link-pencil text-lg leading-tight break-words"
                >
                  {repo.name}
                </a>
                {repo.deployed && (
                  <a
                    href={`https://${repo.deployed}`}
                    target="_blank"
                    rel="noreferrer"
                    className="control-sm press link-pencil whitespace-nowrap text-stamp"
                  >
                    Live ↗
                  </a>
                )}

                {/* Dot leader, the way a printed index carries the eye from an
                    entry across to its page number. Only from `sm`, where the
                    language and date have columns of their own to reach. */}
                <span
                  aria-hidden="true"
                  className="hidden min-w-8 flex-1 border-b border-dotted border-ink/30 sm:block"
                />

                {/* Below `sm` the two columns collapse into a line under the name. */}
                <span className="control-sm mt-1 block basis-full text-ink-faint sm:hidden">
                  {repo.language ?? "Unclassified"} ·{" "}
                  {DATE.format(new Date(`${repo.pushed}T00:00:00Z`))}
                </span>
              </span>

              <span className="control-sm hidden text-ink-soft sm:block">
                {repo.language ?? <span className="text-ink-faint">Unclassified</span>}
              </span>

              <span className="control-sm hidden whitespace-nowrap text-right text-ink-faint sm:block">
                {DATE.format(new Date(`${repo.pushed}T00:00:00Z`))}
              </span>
            </li>
          ))}
        </ol>

        {shown.length === 0 && (
          <p role="status" className="font-serif py-10 text-center text-sm italic text-ink-soft">
            Nothing on file under that heading.
          </p>
        )}
      </div>
    </div>
  );
}
