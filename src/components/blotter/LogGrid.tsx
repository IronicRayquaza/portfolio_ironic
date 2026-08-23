import type { Level } from "@/lib/github";

/* Ink density per level. The calendar is printed, not lit — so it runs from
   bare paper up to solid ink, with the two heaviest days struck in red the way
   a sub-editor would ring the ones that matter. */
export const INK: Record<Level, string> = {
  0: "bg-ink/[0.06]",
  1: "bg-ink/25",
  2: "bg-ink/50",
  3: "bg-stamp/60",
  4: "bg-stamp",
};

/* Fixed three-letter forms. `toLocaleDateString` under en-GB returns "Sept",
   which is a character wider than every other label and breaks the rule. */
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/** Month labels, placed at the first week column that belongs to each month. */
export function monthRule(from: string, weekCount: number) {
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

export function LogGrid({
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
