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

/* ============================================================== the holdings ==
   The second half of the blotter: what is actually on the account.

   Same contract as the calendar above — revalidated twice a day, and every
   failure path returns the snapshot rather than letting a rate-limited API take
   the section down. GitHub allows sixty anonymous calls an hour per IP, and a
   deployment shares its IP with whatever else is on the box, so being turned
   away is a normal Tuesday rather than an exception.
   ============================================================================ */

export type Repo = {
  name: string;
  /** GitHub's detected primary language. `null` when it could not tell. */
  language: string | null;
  /** Last push, `YYYY-MM-DD`. */
  pushed: string;
  /** Deployed host, scheme stripped. `null` when nothing is published. */
  deployed: string | null;
};

export type RepoIndex = {
  /** Repositories he owns, most recently pushed first. */
  repos: readonly Repo[];
  /** Forks on the account. Counted for the figures, kept out of the index. */
  forks: number;
  /** False when the snapshot was used — surfaced in the desk's dateline. */
  live: boolean;
};

/** Recorded 2026-08-23. One repository per line: name~language~pushed~deployed. */
const REPO_SNAPSHOT = `
portfolio_ironic~TypeScript~2026-08-23~portfolio-ironic.vercel.app
glyph_web_ui~JavaScript~2026-08-05~glyph-web-ui.vercel.app
ClipVault~Kotlin~2026-07-03~
crypto-legal-skill~Shell~2026-06-20~
ulla_britta~JavaScript~2026-06-07~
ulla_britta_frontend~TypeScript~2026-05-16~ulla-britta-frontend.vercel.app
pushing-code-through-issues~~2026-05-05~
unify~HTML~2026-05-02~unify-phi.vercel.app
ulla-sre-lab~TypeScript~2026-04-30~
testing_react_on_ulla~JavaScript~2026-04-28~
mayhaps_mew~TypeScript~2026-04-28~mayhapsmew.vercel.app
brand_new_demo~HTML~2026-04-26~brandnewdemo.vercel.app
narrator_testing~JavaScript~2026-04-24~
anzu_monster~JavaScript~2026-04-15~anzu-monster.vercel.app
files~JavaScript~2026-03-25~
hobie~HTML~2026-02-22~hobie-seven.vercel.app
truffle_test~JavaScript~2025-11-26~
idk_man~~2025-09-28~
PokemonWidget~Kotlin~2025-09-11~
random~Python~2025-09-03~
my_QT_Token~TypeScript~2025-07-30~
randao~TypeScript~2025-07-28~
We-Don-t-Talk-Anymore-Ft.JAVA~Java~2025-07-28~
ardacity-builder_ironic~TypeScript~2025-07-24~ardacity-builder.vercel.app
permaweb_shit~TypeScript~2025-07-18~
solana_Shit~TypeScript~2025-07-15~
work_demo~TypeScript~2025-07-08~work-demo.vercel.app
chatrooms_worked~JavaScript~2025-06-25~chatrooms-worked.vercel.app
spotify_gith~Python~2025-06-19~
ironic_added_bot_and_signer~TypeScript~2025-06-01~
AOSignerPackage~TypeScript~2025-05-16~
signer_package~JavaScript~2025-05-11~
drag_drop~TypeScript~2025-04-26~
solana_bounty~TypeScript~2025-04-17~
anon_knows_twitch~TypeScript~2025-04-15~
NFT_Certificate~JavaScript~2025-04-03~
Quiz_MERN~JavaScript~2025-03-27~
theia~TypeScript~2026-08-25~theia-cyan.vercel.app
bhfl_frontend~JavaScript~2025-02-21~bhfl-frontend-one.vercel.app
api_test_2~JavaScript~2025-02-21~
Package_on_Arweave_AO~Lua~2025-02-08~
Meta_React_Native_UI_temp~JavaScript~2025-01-20~
MERN-template~JavaScript~2025-01-08~
Float_comments~JavaScript~2025-01-01~
Domain_Camp-DSA-~C++~2024-12-24~
Detective_Racoon-aka-Darkrai~JavaScript~2024-10-12~
house_prediction~Python~2024-10-06~
Rep_Scrutiny~Python~2024-10-03~
Proximity_Chat-on-Minecraft-1.20.6~Java~2024-09-28~
Plants_VS_Zombies_model~Jupyter Notebook~2024-09-19~
KalC~JavaScript~2024-09-17~
healersicp~JavaScript~2024-08-01~
PolyAdvance-MOD_1~JavaScript~2024-07-16~
Damascus-Auth-Bot~JavaScript~2024-07-12~
Endowcation~JavaScript~2024-07-02~
ballot~JavaScript~2024-06-29~
Decentralized-Defenestrate~JavaScript~2024-06-17~
Tipped~JavaScript~2024-06-12~
OppenZepplin-ERC-20-IRONIC~JavaScript~2024-06-11~
Ethereum-Avax-Intermediate-module_3-by-Metacrafters~Solidity~2024-06-07~
Ethereum-Avax-Intermediate-module_2_By-Metacrafters~~2024-06-06~
Ethereum-Avax_Intermediate-By-Metacrafters~Solidity~2024-06-03~
vesting-ironic~Solidity~2024-05-31~
Ethereum_BEGINNERS_Metacrafters~Solidity~2024-05-24~
JS_Proof_Metacrafters~JavaScript~2024-05-22~
Flutter-Peer-Workshop~C++~2024-04-09~
discord_bot~Python~2024-03-24~
smartcontract_got_frontend~HTML~2024-03-02~
Food-Waste-Reduction-System~JavaScript~2024-02-24~
food_resource~JavaScript~2024-02-22~
git~C++~2024-02-16~
test_demo~~2023-10-20~
Hotel-Management-System~Python~2023-03-22~
`;

const SNAPSHOT_FORKS = 24;

function parseRepos(packed: string): readonly Repo[] {
  return packed
    .trim()
    .split("\n")
    .map((line) => {
      const [name, language, pushed, deployed] = line.split("~");
      return { name, language: language || null, pushed, deployed: deployed || null };
    });
}

const REPO_FALLBACK: RepoIndex = {
  repos: parseRepos(REPO_SNAPSHOT),
  forks: SNAPSHOT_FORKS,
  live: false,
};

type ApiRepo = {
  name: string;
  fork: boolean;
  language: string | null;
  pushed_at: string;
  homepage: string | null;
};

/**
 * Reads the public repository list for `login`.
 *
 * Like the calendar this never throws: any failure returns the snapshot with
 * `live: false`. Two pages of a hundred cover the account with room to spare.
 */
export async function getRepoIndex(login: string): Promise<RepoIndex> {
  try {
    const pages = await Promise.all(
      [1, 2].map((page) =>
        fetch(
          `https://api.github.com/users/${login}/repos?per_page=100&sort=pushed&page=${page}`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              "User-Agent": "portfolio-blotter/1.0",
            },
            next: { revalidate: 43_200 },
          },
        ),
      ),
    );
    if (pages.some((res) => !res.ok)) return REPO_FALLBACK;

    const all = (await Promise.all(pages.map((res) => res.json()))).flat() as ApiRepo[];

    // A short or malformed list would print as an abandoned account.
    if (!Array.isArray(all) || all.length < 10) return REPO_FALLBACK;

    const owned = all
      .filter((r) => !r.fork)
      .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))
      .map<Repo>((r) => ({
        name: r.name,
        language: r.language,
        pushed: r.pushed_at.slice(0, 10),
        deployed: r.homepage ? r.homepage.replace(/^https?:\/\//, "") : null,
      }));

    if (owned.length === 0) return REPO_FALLBACK;

    return { repos: owned, forks: all.length - owned.length, live: true };
  } catch {
    return REPO_FALLBACK;
  }
}

/* --------------------------------------------------------------- derivations */

export type LogSummary = {
  /** Days with at least one contribution. */
  activeDays: number;
  /** Longest unbroken run of active days in the year. */
  longestRun: number;
  /** The run still going as of the last day on the calendar. */
  currentRun: number;
  /** Days at the top two ink levels — the ones the grid prints in red. */
  heavyDays: number;
};

/**
 * The calendar carries intensity levels rather than counts, so these are the
 * only honest figures to draw from it: how often he turned up, not how much
 * he did on the day.
 */
export function summariseLog(year: ContributionYear): LogSummary {
  const days: Level[] = [];
  for (const week of year.weeks) {
    for (const day of week) if (day !== null) days.push(day);
  }

  let activeDays = 0;
  let heavyDays = 0;
  let longestRun = 0;
  let run = 0;

  for (const level of days) {
    if (level === 0) {
      run = 0;
      continue;
    }
    activeDays++;
    run++;
    if (level >= 3) heavyDays++;
    if (run > longestRun) longestRun = run;
  }

  return { activeDays, longestRun, currentRun: run, heavyDays };
}

export type LanguageShare = {
  name: string;
  count: number;
  /** Fraction of the index, 0–1. */
  share: number;
};

/** Repository counts by primary language, heaviest first. */
export function languageShares(repos: readonly Repo[]): readonly LanguageShare[] {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    const name = repo.language ?? "Unclassified";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  return [...counts]
    .map(([name, count]) => ({ name, count, share: count / repos.length }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
