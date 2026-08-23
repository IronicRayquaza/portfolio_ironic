/**
 * The two control faces the puzzles use, named once.
 *
 * Both already exist on the page — the quiet one is the repository-index filter
 * chip, the loud one is the nav's Hire him plate. Naming them here keeps four
 * games from drifting into four slightly different buttons, without inventing
 * a component for something that is a string.
 */

export const PUZZLE_BUTTON =
  "control press border border-ink/25 px-3 py-2.5 text-ink-soft " +
  "hover:border-ink/45 hover:bg-paper-warm hover:text-ink";

export const PUZZLE_BUTTON_PRIMARY =
  "control press border border-ink bg-ink px-3 py-2.5 text-paper-bright " +
  "hover:border-stamp hover:bg-stamp";

/** Disabled controls stay legible — this is paper, not a greyed-out dialog. */
export const PUZZLE_BUTTON_OFF =
  "control border border-ink/15 px-3 py-2.5 text-ink-faint cursor-not-allowed";
