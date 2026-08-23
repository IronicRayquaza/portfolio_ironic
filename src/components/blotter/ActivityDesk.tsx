import { blotter } from "@/lib/content";
import type { ContributionYear, Level } from "@/lib/github";
import { INK, LogGrid, monthRule } from "./LogGrid";

function formatRange(from: string, to: string) {
  const opts = { month: "long", year: "numeric", timeZone: "UTC" } as const;
  const a = new Date(`${from}T00:00:00Z`).toLocaleDateString("en-GB", opts);
  const b = new Date(`${to}T00:00:00Z`).toLocaleDateString("en-GB", opts);
  return `${a} — ${b}`;
}

/** The twelve-month log, plus the commendations the account has collected. */
export function ActivityDesk({ year }: { year: ContributionYear }) {
  const months = monthRule(year.from, year.weeks.length);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-0">
      <div className="min-w-0 lg:col-span-8 lg:pr-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 className="font-display text-2xl leading-none sm:text-3xl">
            Twelve-Month Activity Log
          </h3>
          <p className="control-sm text-ink-faint">{formatRange(year.from, year.to)}</p>
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
      </div>

      <div className="min-w-0 lg:col-span-4 lg:col-rule lg:pl-10">
        <p className="label text-ink-faint">Commendations</p>
        <ul className="mt-4 flex flex-wrap gap-2.5">
          {blotter.commendations.map((c) => (
            <li key={c.name}>
              <span className="control -rotate-[3deg] inline-block border-2 border-stamp px-2.5 py-1.5 text-stamp">
                {c.name}
                {c.tier && <span className="ml-1.5 text-ink-faint">{c.tier}</span>}
              </span>
            </li>
          ))}
        </ul>
        <ul className="font-serif mt-5 space-y-2 text-sm leading-relaxed text-ink-soft">
          {blotter.commendations.map((c) => (
            <li key={c.name}>
              <span className="text-ink">{c.name}</span> — {c.note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
