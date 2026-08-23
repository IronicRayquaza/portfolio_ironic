/**
 * The blotter's live half.
 *
 * GitHub's REST API rate-limits anonymous callers hard enough that a build can
 * fail on it, so this reads the same public contributions fragment the profile
 * page uses. No token, no key, nothing to leak.
 *
 * The fetch is revalidated twice a day and every failure path falls back to the
 * snapshot below, so the section renders identically whether GitHub answered,
 * rate-limited, or was unreachable. A blotter that 500s the page is worse than
 * one that is a few days stale.
 */

/** Contribution intensity, 0 (none) through 4 (heaviest) — GitHub's own scale. */
export type Level = 0 | 1 | 2 | 3 | 4;

/** One column of the calendar: seven days, Sunday first. `null` = outside the year. */
export type Week = readonly (Level | null)[];

export type ContributionYear = {
  weeks: readonly Week[];
  total: number;
  from: string;
  to: string;
  /** False when the snapshot was used — surfaced in the section's dateline. */
  live: boolean;
};

/* ------------------------------------------------------------------ snapshot */

/** Recorded 2026-08-23. Weeks are `|`-separated, one digit per day, `.` = blank. */
const SNAPSHOT_WEEKS =
  "0011120|2121001|1000110|0101011|1000001|1110000|0100000|0000000|0000000|0000000|" +
  "0000010|0000000|0000000|0001011|1111010|0000100|0101111|0000000|0000111|0110000|" +
  "0000001|0010111|1000000|1110111|1000011|1001110|2211111|0101000|0011121|1000110|" +
  "1101000|0113121|0011000|0101134|0231221|2231303|0242010|0001121|1110000|0232220|" +
  "1101110|2033122|0002002|1002111|1122311|1101212|2121010|1012111|1211212|1242242|" +
  "1111110|1124101|0......";

const SNAPSHOT: ContributionYear = {
  weeks: parseWeeks(SNAPSHOT_WEEKS),
  total: 892,
  from: "2025-08-24",
  to: "2026-08-22",
  live: false,
};

function parseWeeks(packed: string): readonly Week[] {
  return packed
    .split("|")
    .map((week) =>
      [...week].map((c) => (c === "." ? null : (Number(c) as Level))),
    );
}

/* --------------------------------------------------------------------- fetch */

const CELL =
  /data-date="(\d{4}-\d{2}-\d{2})"\s+id="contribution-day-component-(\d+)-(\d+)"\s+data-level="([0-4])"/g;

const TOTAL = /([\d,]+)\s*\n?\s*contributions?\s*\n?\s*in the last year/;

/**
 * Reads the public contributions calendar for `login`.
 *
 * Never throws and never rejects: any failure — network, non-200, markup drift
 * that yields too few cells — returns the snapshot with `live: false`.
 */
export async function getContributionYear(
  login: string,
): Promise<ContributionYear> {
  try {
    const res = await fetch(`https://github.com/users/${login}/contributions`, {
      headers: {
        // GitHub serves the fragment only to something that looks like a browser.
        "User-Agent": "Mozilla/5.0 (compatible; portfolio-blotter/1.0)",
        Accept: "text/html",
      },
      next: { revalidate: 43_200 },
    });
    if (!res.ok) return SNAPSHOT;

    const html = await res.text();

    const cells: { date: string; row: number; col: number; level: Level }[] = [];
    for (const m of html.matchAll(CELL)) {
      cells.push({
        date: m[1],
        row: Number(m[2]),
        col: Number(m[3]),
        level: Number(m[4]) as Level,
      });
    }

    // A real year is 365 or 366 cells. Anything much shorter means the markup
    // moved and a half-drawn calendar would look like a dead account.
    if (cells.length < 300) return SNAPSHOT;

    const columns = Math.max(...cells.map((c) => c.col)) + 1;
    const grid: (Level | null)[][] = Array.from({ length: columns }, () =>
      Array<Level | null>(7).fill(null),
    );
    for (const cell of cells) {
      if (cell.row < 7 && cell.col < columns) grid[cell.col][cell.row] = cell.level;
    }

    const dates = cells.map((c) => c.date).sort();
    const total = Number(html.match(TOTAL)?.[1].replace(/,/g, "") ?? 0);

    return {
      weeks: grid,
      total: total > 0 ? total : SNAPSHOT.total,
      from: dates[0],
      to: dates[dates.length - 1],
      live: true,
    };
  } catch {
    return SNAPSHOT;
  }
}
