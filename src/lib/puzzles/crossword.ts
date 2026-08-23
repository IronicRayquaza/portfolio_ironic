import { assertPuzzle, type CrosswordPuzzle } from "./types";

/**
 * The Crossword — a 5×5 mini, drawn from a small pool so a reset does not just
 * blank the same nine clues.
 *
 * Every grid was found by search, not by hand. A blockless 5×5 whose rows and
 * columns are all real words has no solution in common vocabulary, and the
 * symmetric squares that do exist are useless as puzzles — every Down clue is
 * a repeat of an Across clue. So each of these uses blocks in a pattern that
 * is not symmetric about the main diagonal, and was additionally filtered so
 * no word appears in both directions of the same grid.
 */
export const crosswords: readonly CrosswordPuzzle[] = [
  {
    /*
     *     # # A C E
     *     D E L A Y
     *     R A I S E
     *     A S K E D
     *     B E E # #
     */
    grid: ["##ACE", "DELAY", "RAISE", "ASKED", "BEE##"],
    across: [
      { n: 1, clue: "Card that beats a king" },
      { n: 4, clue: "What a signal failure causes" },
      { n: 6, clue: "Lift — or ask for more pay" },
      { n: 7, clue: "Put the question" },
      { n: 8, clue: "Hive dweller, or a spelling contest" },
    ],
    down: [
      { n: 1, clue: "Two peas in a pod, so to speak" },
      { n: 2, clue: "What a detective works" },
      { n: 3, clue: "Looked over" },
      { n: 4, clue: "Dull and colourless" },
      { n: 5, clue: "Comfort, or to lessen" },
    ],
  },
  {
    /*
     *     # # F O E
     *     M O O D Y
     *     A G R E E
     *     T R U S S
     *     H E M # #
     */
    grid: ["##FOE", "MOODY", "AGREE", "TRUSS", "HEM##"],
    across: [
      { n: 1, clue: "Enemy" },
      { n: 4, clue: "Given to sudden changes of temper" },
      { n: 6, clue: "See eye to eye" },
      { n: 7, clue: "Support for a sagging roof" },
      { n: 8, clue: "Fold and sew a garment's edge" },
    ],
    down: [
      { n: 1, clue: "Place for public discussion" },
      { n: 2, clue: "Lyric poems of praise" },
      { n: 3, clue: "Windows to the soul, so they say" },
      { n: 4, clue: "Subject with numbers, for short" },
      { n: 5, clue: "Fairy-tale giant" },
    ],
  },
  {
    /*
     *     # L A W #
     *     C O U R T
     *     O R D E R
     *     P R I C E
     *     # Y O K E
     */
    grid: ["#LAW#", "COURT", "ORDER", "PRICE", "#YOKE"],
    across: [
      { n: 1, clue: "What a court upholds" },
      { n: 4, clue: "Where a judge presides" },
      { n: 6, clue: "Command — the opposite of chaos" },
      { n: 7, clue: "What something costs" },
      { n: 8, clue: "Wooden bar joining a pair of oxen" },
    ],
    down: [
      { n: 1, clue: "British word for a truck" },
      { n: 2, clue: "Sound recording" },
      { n: 3, clue: "Result of a bad crash" },
      { n: 4, clue: "Police officer, informally" },
      { n: 5, clue: "Has rings that mark its age" },
    ],
  },
  {
    /*
     *     # B R A N
     *     # L O S E
     *     H A B I T
     *     A M I D #
     *     G E N E #
     */
    grid: ["#BRAN", "#LOSE", "HABIT", "AMID#", "GENE#"],
    across: [
      { n: 1, clue: "Cereal husk, high in fibre" },
      { n: 5, clue: "Fail to win" },
      { n: 6, clue: "Something you do without thinking" },
      { n: 7, clue: "In the middle of" },
      { n: 8, clue: "Unit of heredity" },
    ],
    down: [
      { n: 1, clue: "Point the finger" },
      { n: 2, clue: "Bird on a Christmas card" },
      { n: 3, clue: "Remark made to the audience, not the other actors" },
      { n: 4, clue: "Catch fish with this" },
      { n: 6, clue: "Witch, in an old tale" },
    ],
  },
];

/* ------------------------------------------------------------------ derived */

export type CrosswordCell =
  | { readonly blocked: true }
  | {
      readonly blocked: false;
      readonly row: number;
      readonly col: number;
      readonly index: number;
      readonly solution: string;
      /** Printed in the corner when this cell starts an entry. */
      readonly number: number | null;
      readonly acrossN: number | null;
      readonly downN: number | null;
    };

/** A playable square — the blocked variant narrowed away. */
export type OpenCell = Extract<CrosswordCell, { blocked: false }>;

export type BuiltCrossword = {
  readonly cells: readonly CrosswordCell[];
  /** "A-4" or "D-2" to the cell indices of that entry, in reading order. */
  readonly entries: ReadonlyMap<string, readonly number[]>;
  readonly clueFor: ReadonlyMap<string, string>;
};

export const entryKey = (dir: "across" | "down", n: number) =>
  `${dir === "across" ? "A" : "D"}-${n}`;

/**
 * Numbers a grid and maps every entry to its cells.
 *
 * Numbering is derived, never authored — hand-numbering a grid is the single
 * most likely way for this data to go quietly wrong. Runs once per puzzle at
 * module load, not per render: five puzzles is nothing to recompute, but there
 * is no reason to redo it forty times a second while someone types.
 */
function build(puzzle: CrosswordPuzzle): BuiltCrossword {
  const rows = puzzle.grid;
  const blocked = (r: number, c: number) =>
    r < 0 || r > 4 || c < 0 || c > 4 || rows[r][c] === "#";

  const cells: CrosswordCell[] = [];
  const acrossOf: (number | null)[] = Array(25).fill(null);
  const downOf: (number | null)[] = Array(25).fill(null);
  let n = 0;

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const index = r * 5 + c;
      if (blocked(r, c)) {
        cells.push({ blocked: true });
        continue;
      }
      // An entry starts where the run starts and is at least two cells long.
      const startsAcross = blocked(r, c - 1) && !blocked(r, c + 1);
      const startsDown = blocked(r - 1, c) && !blocked(r + 1, c);
      const number = startsAcross || startsDown ? ++n : null;

      acrossOf[index] = startsAcross ? n : acrossOf[index - 1];
      downOf[index] = startsDown ? n : downOf[index - 5];

      cells.push({
        blocked: false,
        row: r,
        col: c,
        index,
        solution: rows[r][c],
        number,
        acrossN: acrossOf[index],
        downN: downOf[index],
      });
    }
  }

  const entries = new Map<string, number[]>();
  const push = (key: string, index: number) => {
    const list = entries.get(key);
    if (list) list.push(index);
    else entries.set(key, [index]);
  };
  // Cells are walked in reading order, so each entry's indices come out sorted.
  for (const cell of cells) {
    if (cell.blocked) continue;
    if (cell.acrossN !== null) push(entryKey("across", cell.acrossN), cell.index);
    if (cell.downN !== null) push(entryKey("down", cell.downN), cell.index);
  }

  const clueFor = new Map<string, string>();
  for (const c of puzzle.across) clueFor.set(entryKey("across", c.n), c.clue);
  for (const c of puzzle.down) clueFor.set(entryKey("down", c.n), c.clue);

  return { cells, entries, clueFor };
}

export const builtCrosswords: readonly BuiltCrossword[] = crosswords.map(build);

/* Catch the authoring errors that would otherwise show up as a silently wrong
   grid: a clue numbered for an entry that does not exist, an entry with no
   clue written for it, or the same solution word used in both directions of
   one grid (which makes the crossing clue give away the crossed one). */
crosswords.forEach((puzzle, i) => {
  const built = builtCrosswords[i];

  for (const row of puzzle.grid) {
    assertPuzzle(row.length === 5, `puzzle ${i}: row "${row}" is not 5 characters`);
    assertPuzzle(/^[A-Z#]+$/.test(row), `puzzle ${i}: row "${row}" has a bad character`);
  }
  for (const key of built.entries.keys()) {
    assertPuzzle(built.clueFor.has(key), `puzzle ${i}: entry ${key} has no clue`);
  }
  for (const key of built.clueFor.keys()) {
    assertPuzzle(built.entries.has(key), `puzzle ${i}: clue ${key} has no entry in the grid`);
  }
  const clueCount = puzzle.across.length + puzzle.down.length;
  assertPuzzle(
    built.entries.size === clueCount,
    `puzzle ${i}: grid has ${built.entries.size} entries but ${clueCount} clues`,
  );

  const wordAt = (key: string) =>
    (built.entries.get(key) ?? []).map((idx) => puzzle.grid[Math.floor(idx / 5)][idx % 5]).join("");
  const acrossWords = puzzle.across.map((c) => wordAt(entryKey("across", c.n)));
  const downWords = puzzle.down.map((c) => wordAt(entryKey("down", c.n)));
  assertPuzzle(
    !acrossWords.some((w) => downWords.includes(w)),
    `puzzle ${i}: the same word appears in both directions`,
  );
});
