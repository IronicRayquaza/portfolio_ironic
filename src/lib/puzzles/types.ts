/**
 * Shared types for the back page.
 *
 * Puzzle payloads live here rather than in `content.ts` because they are not
 * copy — they are data with invariants. A crossword grid whose across and down
 * runs must both be real words, a tile set whose groups must not overlap, a
 * cipher key that must be a derangement. Each is asserted at module load in
 * development, and each lives in its own file so deleting a game is a two-file
 * removal.
 */

/* ------------------------------------------------------------------ line-up */

export type LineUpGroup = {
  readonly name: string;
  readonly members: readonly [string, string, string, string];
};

export type LineUpPuzzle = {
  /** Authored easiest to hardest; the index picks the solved band's ink density. */
  readonly groups: readonly [LineUpGroup, LineUpGroup, LineUpGroup, LineUpGroup];
  /**
   * The sixteen tiles in printed order, hand-shuffled.
   *
   * Deliberately authored rather than shuffled at runtime: shuffling during
   * render is a hydration mismatch, and shuffling in an effect makes the tiles
   * visibly jump on first paint. Shuffling stays a user action, which is safe
   * because it happens after mount.
   */
  readonly layout: readonly string[];
};

/* ------------------------------------------------------------------- cipher */

export type CipherPuzzle = {
  /** Plaintext, upper case. Punctuation is kept and rendered without a rule. */
  readonly quote: string;
  readonly attribution: string;
  /** Plain letter to cipher letter. Authored, never generated — see the note in cipher.ts. */
  readonly key: Readonly<Record<string, string>>;
  /** Plain letters filled in from the start, so the solver has a way in. */
  readonly given: readonly string[];
};

/* ---------------------------------------------------------------- crossword */

export type Clue = { readonly n: number; readonly clue: string };

export type CrosswordPuzzle = {
  /**
   * Five rows of five characters. A–Z is a light square, `#` is a block.
   * The grid *is* the answer key, so there is no separate solution list to
   * drift out of sync with it.
   */
  readonly grid: readonly [string, string, string, string, string];
  readonly across: readonly Clue[];
  readonly down: readonly Clue[];
};

/* ----------------------------------------------------------- spot the error */

export type SpotError = {
  readonly kind: "typo" | "homophone" | "doubled";
  /** Shown after marking up — what was wrong and what it should have been. */
  readonly note: string;
};

export type SpotPuzzle = {
  readonly headline: string;
  readonly standfirst: string;
  /**
   * Paragraphs with each planted error wrapped in `[[ ]]`. Markers pair with
   * `errors` in order of appearance. Inline markers beat token indices, which
   * drift the moment anyone edits the prose.
   */
  readonly body: readonly string[];
  readonly errors: readonly SpotError[];
};

/* ------------------------------------------------------------------ dev use */

/** Throws in development only; compiled out of the production bundle. */
export function assertPuzzle(ok: boolean, message: string) {
  if (process.env.NODE_ENV !== "production" && !ok) {
    throw new Error(`Puzzle data: ${message}`);
  }
}
