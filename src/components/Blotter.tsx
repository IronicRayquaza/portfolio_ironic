import { blotter } from "@/lib/content";
import { getContributionYear, type Level } from "@/lib/github";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

/**
 * The police blotter: the daily log a paper prints of everything that came
 * across the desk. Here that is the public GitHub record — a year of activity
 * set as a punch-card grid, the largest upstream contribution written up as the
 * lead story, and the accepted filings listed as a docket.
 *
 * Server component: the calendar is fetched at request time (revalidated, with
 * a snapshot fallback) so nothing about this ships to the client.
 */

/* Ink density per level. The calendar is printed, not lit — so it runs from
   bare paper up to solid ink, with the two heaviest days struck in red the way
   a sub-editor would ring the ones that matter. */
const INK: Record<Level, string> = {
  0: "bg-ink/[0.06]",
  1: "bg-ink/25",
  2: "bg-ink/50",
  3: "bg-stamp/60",
  4: "bg-stamp",
};

function LogGrid({
  weeks,
  months,
}: {
  weeks: readonly (readonly (Level | null)[])[];
  months: readonly { label: string; col: number }[];
}) {
  return (
    <div className="no-scrollbar -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <div className="min-w-[46rem]">
        {/* Month rule. Grid-positioned so a label sits over its own first week. */}
        <div
          className="mb-1.5 grid gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
          aria-hidden="true"
        >
          {months.map((month) => (
            <span
              key={`${month.label}-${month.col}`}
              className="control-sm whitespace-nowrap text-ink-faint"
              style={{ gridColumnStart: month.col + 1 }}
            >
              {month.label}
            </span>
          ))}
        </div>

        <div
          className="grid gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
        >
          {weeks.map((week, w) => (
            <div key={w} className="grid grid-rows-7 gap-[3px]">
              {week.map((level, d) => (
                <span
                  key={d}
                  className={`aspect-square w-full ${
                    level === null ? "bg-transparent" : INK[level]
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Fixed three-letter forms. `toLocaleDateString` under en-GB returns "Sept",
   which is a character wider than every other label and breaks the rule. */
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/** Month labels, placed at the first week column that belongs to each month. */
function monthRule(from: string, weekCount: number) {
  const start = new Date(`${from}T00:00:00Z`);
  const out: { label: string; col: number }[] = [];
  let seen = -1;

  for (let col = 0; col < weekCount; col++) {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + col * 7);
    const month = day.getUTCMonth();
    if (month === seen) continue;
    seen = month;

    // A label is about three columns wide. Drop one that would print on top of
    // its neighbour — the year opens mid-month, so the first two often collide —
    // and drop a month whose first column is the last, which would run off.
    const previous = out[out.length - 1];
    if (previous && col - previous.col < 3) continue;
    if (col > weekCount - 3) continue;

    out.push({ label: MONTHS[month], col });
  }
  return out;

}

function formatRange(from: string, to: string) {
  const opts = { month: "long", year: "numeric", timeZone: "UTC" } as const;
  const a = new Date(`${from}T00:00:00Z`).toLocaleDateString("en-GB", opts);
  const b = new Date(`${to}T00:00:00Z`).toLocaleDateString("en-GB", opts);
  return `${a} — ${b}`;
}

export async function Blotter() {
  const year = await getContributionYear("IronicRayquaza");
  const months = monthRule(year.from, year.weeks.length);
  const { lead } = blotter;

  return (
    <section
      id="blotter"
      className="mx-auto mt-28 max-w-[1400px] scroll-mt-24 px-5 sm:px-8 lg:px-12"
    >
      <SectionHead kicker={blotter.kicker} title={blotter.title} note={blotter.note} />

      {/* ------------------------------------------------ the twelve-month log */}
      <Reveal variant="settle" delay={0.1} className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 className="font-display text-2xl leading-none sm:text-3xl">
            Twelve-Month Activity Log
          </h3>
          <p className="control-sm text-ink-faint">
            {formatRange(year.from, year.to)}
            {year.live ? "" : " · last filed edition"}
          </p>
        </div>

        <div className="rule-thin mt-3 pt-5">
          <LogGrid weeks={year.weeks} months={months} />

          {/* Total plus legend. The legend is decorative — the figure carries it. */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-ink/12 pt-4">
            <p className="font-serif text-sm text-ink-soft">
              <strong className="font-display text-xl not-italic text-ink">
                {year.total.toLocaleString("en-GB")}
              </strong>{" "}
              contributions entered in the log this year.
            </p>

            <p className="control-sm flex items-center gap-2 text-ink-faint" aria-hidden="true">
              Quiet
              <span className="flex gap-[3px]">
                {([0, 1, 2, 3, 4] as Level[]).map((l) => (
                  <span key={l} className={`h-2.5 w-2.5 ${INK[l]}`} />
                ))}
              </span>
              Busy
            </p>
          </div>
        </div>
      </Reveal>

      {/* ------------------------------------------------------- the lead story */}
      <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-0">
        <div className="lg:col-span-7 lg:pr-12">
          <Reveal variant="fade" as="p" className="label text-stamp">
            {lead.label}
          </Reveal>
          <Reveal variant="rule" as="div" delay={0.05} className="rule-thin mt-3" />

          <Reveal variant="settle" delay={0.1}>
            <h3 className="font-display mt-4 text-4xl leading-[0.95] tracking-tight sm:text-5xl">
              <a href={lead.href} target="_blank" rel="noreferrer" className="link-pencil">
                <span className="text-ink-faint">{lead.owner} / </span>
                {lead.name}
              </a>
            </h3>

            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-ink/15 py-4 sm:grid-cols-4">
              {lead.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="control-sm text-ink-faint">{stat.label}</dt>
                  <dd className="font-display mt-1.5 text-2xl leading-none">{stat.value}</dd>
                </div>
              ))}
            </dl>

            <p className="font-serif mt-5 max-w-[62ch] hyphens-auto text-justify text-[0.975rem] leading-[1.62] text-ink-soft">
              {lead.blurb}
            </p>
          </Reveal>

          {/* The docket. A numbered log of accepted filings — this is the blotter
              proper, so it is set as typed entries rather than editorial copy. */}
          <Reveal variant="fade" as="p" delay={0.15} className="label mt-8 text-stamp">
            Accepted Filings
          </Reveal>
          <Reveal variant="rule" as="div" delay={0.18} className="rule-thin mt-3" />

          <ol className="mt-1">
            {lead.docket.map((entry, i) => (
              <Reveal
                key={entry.no}
                variant="settle"
                as="li"
                delay={0.06 + Math.min(i, 5) * 0.04}
                className="lab-row flex items-baseline gap-3 border-b border-ink/12 py-3 sm:gap-4"
              >
                <a
                  href={`${lead.href}/pull/${entry.no}`}
                  target="_blank"
                  rel="noreferrer"
                  className="control press link-pencil shrink-0 text-stamp"
                >
                  №&nbsp;{entry.no}
                </a>
                <p className="font-serif min-w-0 flex-1 text-[0.9375rem] leading-snug text-ink-soft">
                  {entry.title}
                </p>
                <span className="control-sm hidden shrink-0 border border-ink/25 bg-paper-warm px-2 py-1 text-ink-faint sm:inline-block">
                  {entry.area}
                </span>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* ------------------------------------------------------- the margin */}
        <div className="space-y-8 lg:col-span-5 lg:col-rule lg:pl-12">
          <Reveal variant="settle" delay={0.1}>
            <p className="label text-ink-faint">The Register</p>
            <dl className="mt-3 divide-y divide-ink/12 border-y border-ink/15">
              {blotter.register.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="font-serif text-sm text-ink-soft">{row.label}</dt>
                  <dd className="font-display text-2xl leading-none">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3">
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
          </Reveal>

          <Reveal variant="settle" delay={0.16} className="border-t border-ink/15 pt-6">
            <p className="label text-ink-faint">Commendations</p>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {blotter.commendations.map((c, i) => (
                <li key={c.name}>
                  <Reveal
                    variant="stamp"
                    as="span"
                    delay={0.1 + i * 0.08}
                    className="control -rotate-[3deg] inline-block border-2 border-stamp px-2.5 py-1.5 text-stamp"
                    threshold={0.4}
                  >
                    {c.name}
                    {c.tier && <span className="ml-1.5 text-ink-faint">{c.tier}</span>}
                  </Reveal>
                </li>
              ))}
            </ul>
            <ul className="font-serif mt-4 space-y-1 text-sm text-ink-soft">
              {blotter.commendations.map((c) => (
                <li key={c.name}>
                  <span className="text-ink">{c.name}</span> — {c.note}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal variant="settle" delay={0.22} className="border-t border-ink/15 pt-6">
            <p className="label text-ink-faint">Also Filed</p>
            <ul className="mt-4 space-y-5">
              {blotter.alsoFiled.map((item) => (
                <li key={item.name}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-display press link-pencil text-lg leading-tight"
                    >
                      {item.name} ↗
                    </a>
                    <span className="control-sm text-stamp">{item.count}</span>
                  </div>
                  <p className="font-serif mt-1.5 text-sm leading-relaxed text-ink-soft">
                    {item.note}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
