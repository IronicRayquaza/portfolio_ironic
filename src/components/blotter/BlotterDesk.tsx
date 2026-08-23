"use client";

import { useState } from "react";
import { blotter } from "@/lib/content";
import { Reveal } from "../Reveal";
import type { ContributionYear, LanguageShare, LogSummary, RepoIndex } from "@/lib/github";
import { ActivityDesk } from "./ActivityDesk";
import { DeskRail } from "./DeskRail";
import { Figures, type Figure } from "./Figures";
import { FilingsDesk } from "./FilingsDesk";
import { LanguageDesk } from "./LanguageDesk";
import { RepositoryDesk } from "./RepositoryDesk";

/**
 * The blotter's switchboard.
 *
 * Four desks over one record. Each carries its own standing figures, so moving
 * between them changes the numbers under the rail as well as the body — that
 * is the difference between a dashboard and four stacked sections.
 *
 * Only the rail and the index filters are stateful; every desk below is a
 * plain render of data the server already fetched.
 */
export function BlotterDesk({
  year,
  summary,
  index,
  languages,
}: {
  year: ContributionYear;
  summary: LogSummary;
  index: RepoIndex;
  languages: readonly LanguageShare[];
}) {
  // `as const` on the content narrows this to the first desk’s literal id.
  const [active, setActive] = useState<string>(blotter.desks[0].id);
  const desk = blotter.desks.find((d) => d.id === active) ?? blotter.desks[0];

  const deployed = index.repos.filter((r) => r.deployed).length;
  const accepted = blotter.lead.docket.length;
  const upstream = 1 + blotter.alsoFiled.length;

  const figures: Record<string, readonly Figure[]> = {
    activity: [
      { value: year.total.toLocaleString("en-GB"), label: "Contributions · 12 months" },
      { value: String(summary.activeDays), label: "Days on the record" },
      { value: String(summary.longestRun), label: "Longest unbroken run" },
      { value: String(summary.heavyDays), label: "Days struck in red" },
    ],
    repositories: [
      { value: String(index.repos.length), label: "Repositories owned" },
      { value: String(index.forks), label: "Forks on the account" },
      { value: String(deployed), label: "Published to the web" },
      { value: String(languages.length), label: "Languages in use" },
    ],
    filings: [
      { value: blotter.lead.stats[2].value, label: "Filed against ODS" },
      { value: String(accepted), label: "Accepted into ODS" },
      { value: String(upstream), label: "Upstream codebases" },
      { value: blotter.lead.stats[0].value, label: "Stars on the lead" },
    ],
    languages: [
      { value: languages[0]?.name ?? "—", label: "Most written" },
      { value: `${Math.round((languages[0]?.share ?? 0) * 100)}%`, label: "Its share of the index" },
      { value: String(languages.length), label: "Languages in use" },
      { value: String(index.repos.length), label: "Repositories counted" },
    ],
  };

  const counts: Record<string, string | undefined> = {
    repositories: String(index.repos.length),
    filings: String(accepted),
    languages: String(languages.length),
  };

  const panels: Record<string, React.ReactNode> = {
    activity: <ActivityDesk year={year} />,
    repositories: <RepositoryDesk repos={index.repos} profile={blotter.profile} />,
    filings: <FilingsDesk />,
    languages: <LanguageDesk languages={languages} total={index.repos.length} />,
  };

  return (
    <div className="mt-12">
      <Reveal variant="settle" delay={0.1}>
        <DeskRail desks={blotter.desks} active={active} onSelect={setActive} counts={counts} />

        {/* The rail's tabs sit on this rule — it is the top edge of the sheet. */}
        <div className="rule-thick" />

        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-ink/15 py-3">
          <p className="font-serif text-sm italic text-ink-soft">{desk.note}</p>
          <p className="control-sm text-ink-faint">
            {index.live && year.live ? "Read from the record today" : "Last filed edition"}
          </p>
        </div>

        <Figures figures={figures[desk.id]} />
      </Reveal>

      <div
        // Keyed on the desk so React mounts a fresh panel: the short fade below
        // needs a new element to run against, and it stops a filter set on one
        // desk from being inherited by the next.
        key={desk.id}
        id={`desk-panel-${desk.id}`}
        role="tabpanel"
        aria-labelledby={`desk-tab-${desk.id}`}
        tabIndex={0}
        className="desk-panel pt-8 focus-visible:outline-offset-8"
      >
        {panels[desk.id]}
      </div>

      <p className="mt-8 border-t border-ink/15 pt-5">
        <a
          href={blotter.profile}
          target="_blank"
          rel="noreferrer"
          className="control press link-pencil inline-flex items-center gap-1.5 text-stamp"
        >
          Open the full record
          <span className="exhibit-arrow inline-block" aria-hidden="true">
            ↗
          </span>
        </a>
      </p>
    </div>
  );
}
