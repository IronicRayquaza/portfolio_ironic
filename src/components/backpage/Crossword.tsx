"use client";

import { useEffect, useRef, useState } from "react";
import { builtCrosswords, crosswords, entryKey, type OpenCell } from "@/lib/puzzles";
import { PUZZLE_BUTTON, PUZZLE_BUTTON_PRIMARY } from "./faces";
import { PuzzleFrame } from "./PuzzleFrame";
import { useViewportInset } from "./useViewportInset";

const RUBRIC = "Five by five. Tap a square to switch between across and down.";

type Dir = "across" | "down";

/** Typing fills the entry you are in and stops at its end — it never leaps to
 *  the next clue. That jump is the most complained-about crossword behaviour. */
const ADVANCE_TO_NEXT_ENTRY = false;

const openCellsOf = (i: number) =>
  builtCrosswords[i].cells.filter((c): c is OpenCell => !c.blocked);

const firstOpenOf = (i: number) => openCellsOf(i)[0].index;

const idleStatus = (i: number) => `${openCellsOf(i).length} squares to fill.`;

/**
 * Deals puzzle indices out of a shuffled bag, refilling it once it empties.
 *
 * A plain "pick anything but the current one" allows A → B → A → B forever,
 * which reads as random but doesn't feel unique across more than two resets.
 * A shuffle bag guarantees every puzzle is seen once before any repeats —
 * genuinely "unique every time" for a run of resets equal to the pool size.
 */
function makeShuffleBag(size: number) {
  let bag: number[] = [];

  function refill(avoidFirst?: number) {
    bag = Array.from({ length: size }, (_, i) => i);
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    // Without this, the bag can legally reshuffle to start with the puzzle
    // that just finished, giving a visible back-to-back repeat at the seam.
    if (avoidFirst !== undefined && bag[0] === avoidFirst && bag.length > 1) {
      [bag[0], bag[1]] = [bag[1], bag[0]];
    }
  }

  return function draw(current: number) {
    if (size <= 1) return current;
    if (bag.length === 0) refill(current);
    return bag.shift()!;
  };
}

const drawPuzzle = makeShuffleBag(crosswords.length);

export function Crossword() {
  /*
   * The puzzle index starts at 0 rather than a random pick. Choosing randomly
   * here would run during the server render too, and the client's own random
   * pick on hydration would almost certainly disagree with it — a mismatch
   * React can't reconcile. Reset is a user action with no server render to
   * agree with, so that is where the randomising happens instead.
   */
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [letters, setLetters] = useState<readonly string[]>(() => Array(25).fill(""));
  const [cursor, setCursor] = useState(() => firstOpenOf(0));
  const [dir, setDir] = useState<Dir>("across");
  const [wrong, setWrong] = useState<ReadonlySet<number>>(new Set());
  const [status, setStatus] = useState(() => idleStatus(0));
  const [tone, setTone] = useState<"neutral" | "good" | "bad">("neutral");

  const input = useRef<HTMLInputElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const inset = useViewportInset();

  const puzzle = crosswords[puzzleIndex];
  const { cells, entries, clueFor } = builtCrosswords[puzzleIndex];
  const OPEN = openCellsOf(puzzleIndex);

  // The cursor only ever lands on an open square, so narrowing here once keeps
  // every read below free of a blocked-cell check.
  const under = cells[cursor];
  const cell: OpenCell = under.blocked ? OPEN[0] : under;
  const isOpen = (i: number) => i >= 0 && i < 25 && !cells[i].blocked;

  /* Which entry the cursor is in. Falls back to the other direction for a cell
     that only belongs to one — a lone square across is still part of a down. */
  const activeN = dir === "across" ? cell.acrossN : cell.downN;
  const activeDir: Dir = activeN !== null ? dir : dir === "across" ? "down" : "across";
  const activeNumber = (activeDir === "across" ? cell.acrossN : cell.downN) ?? 0;
  const activeKey = entryKey(activeDir, activeNumber);
  const activeCells = entries.get(activeKey) ?? [];
  const activeClue = clueFor.get(activeKey);

  const filled = letters.filter(Boolean).length;
  const total = OPEN.length;

  /* Keep the board in the band the keyboard leaves behind. `scrollIntoView`
     centres in the layout viewport, which is the wrong box once a keyboard is
     up, so scroll against the visual viewport instead. No `behavior` is passed
     on purpose: it inherits `scroll-behavior` from the page, including the
     reduced-motion override that turns it off. */
  useEffect(() => {
    if (inset === 0 || !board.current) return;
    const rect = board.current.getBoundingClientRect();
    const visible = window.visualViewport?.height ?? window.innerHeight;
    window.scrollTo(0, rect.top + window.scrollY - Math.max(12, (visible - rect.height) / 2));
  }, [inset]);

  function move(to: number | null) {
    if (to === null) return;
    setCursor(to);
    input.current?.focus();
  }

  function typeLetter(ch: string) {
    const next = [...letters];
    next[cursor] = ch;
    setLetters(next);
    setWrong(new Set());
    setTone("neutral");

    const pos = activeCells.indexOf(cursor);
    const rest = activeCells.slice(pos + 1);
    const target = rest.find((i) => !next[i]) ?? rest[0];
    if (target !== undefined) move(target);
    else if (ADVANCE_TO_NEXT_ENTRY) move(activeCells[0]);
  }

  function backspace() {
    const next = [...letters];
    if (next[cursor]) {
      next[cursor] = "";
      setLetters(next);
      return;
    }
    const pos = activeCells.indexOf(cursor);
    const prev = activeCells[pos - 1];
    if (prev === undefined) return;
    next[prev] = "";
    setLetters(next);
    move(prev);
  }

  /* Letters come through onChange, never onKeyDown: Android's keyboard reports
     `key: "Unidentified"` with keyCode 229 for ordinary letters, so a keydown
     handler works perfectly on desktop and silently fails on half of mobile. */
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputType = (e.nativeEvent as InputEvent).inputType;
    if (inputType === "deleteContentBackward") return backspace();
    const ch = e.target.value.replace(/\s/g, "").slice(-1).toUpperCase();
    if (/^[A-Z]$/.test(ch)) typeLetter(ch);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const { key } = e;

    if (key === "Backspace") {
      e.preventDefault();
      return backspace();
    }
    if (key === " " || key === "Enter") {
      e.preventDefault();
      return setDir(dir === "across" ? "down" : "across");
    }
    if (key === "Escape") {
      // Always a way out of a widget that swallows the arrow keys.
      e.preventDefault();
      return input.current?.blur();
    }

    const horizontal = key === "ArrowLeft" || key === "ArrowRight";
    const vertical = key === "ArrowUp" || key === "ArrowDown";
    if (!horizontal && !vertical) return;
    e.preventDefault();

    // First press across the grain turns the cursor rather than moving it —
    // without this, half the arrow keys feel dead.
    if (horizontal && dir === "down") return setDir("across");
    if (vertical && dir === "across") return setDir("down");

    const step = key === "ArrowRight" || key === "ArrowDown" ? 1 : -1;
    const delta = horizontal ? step : step * 5;
    // Clamp at the edges; no wraparound. A crossword is a map, not a carousel.
    for (let i = cursor + delta; i >= 0 && i < 25; i += delta) {
      if (horizontal && Math.floor(i / 5) !== cell.row) break;
      if (isOpen(i)) return move(i);
      break;
    }
  }

  function check() {
    const bad = new Set<number>();
    for (const c of cells) {
      if (c.blocked) continue;
      if (letters[c.index] && letters[c.index] !== c.solution) bad.add(c.index);
    }
    setWrong(bad);
    if (filled === total && bad.size === 0) {
      setTone("good");
      setStatus("All correct — the grid is complete.");
      return;
    }
    setTone(bad.size > 0 ? "bad" : "neutral");
    setStatus(
      bad.size > 0
        ? `${bad.size} ${bad.size === 1 ? "letter is" : "letters are"} wrong.`
        : `Nothing wrong so far — ${total - filled} squares to go.`,
    );
  }

  function reveal() {
    setLetters(cells.map((c) => (c.blocked ? "" : c.solution)));
    setWrong(new Set());
    setTone("good");
    setStatus("Filled in for you.");
  }

  /**
   * A new puzzle every time, drawn fresh rather than off the current render's
   * memoised values — `puzzleIndex` hasn't changed yet in this closure, so the
   * next index, its first cell and its own idle count are all computed
   * directly from `builtCrosswords[next]` instead of trusting stale state.
   */
  function reset() {
    const next = drawPuzzle(puzzleIndex);
    setPuzzleIndex(next);
    setLetters(Array(25).fill(""));
    setCursor(firstOpenOf(next));
    setDir("across");
    setWrong(new Set());
    setTone("neutral");
    setStatus(idleStatus(next));
  }

  const solved = filled === total && cells.every((c) => c.blocked || letters[c.index] === c.solution);

  return (
    <PuzzleFrame
      id="crossword"
      title="The Crossword"
      rubric={RUBRIC}
      status={solved ? "All correct — the grid is complete." : status}
      tone={solved ? "good" : tone}
      actions={
        <>
          <button type="button" onClick={reset} className={PUZZLE_BUTTON}>
            Reset
          </button>
          <button type="button" onClick={reveal} className={PUZZLE_BUTTON}>
            Reveal
          </button>
          <button type="button" onClick={check} className={PUZZLE_BUTTON_PRIMARY}>
            Check
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <div>
          {/* The current clue sits directly above the grid below lg, so it can
              never be the thing a phone keyboard covers. Sticky as a second
              line of defence — note this must not sit inside an overflow
              container, or sticky silently stops working. */}
          <p
            aria-live="polite"
            className="sticky top-16 z-20 mb-3 border-y border-ink/15 bg-paper-bright py-2"
          >
            <span className="control text-stamp">
              {activeNumber} {activeDir}
            </span>
            <span className="font-serif ml-3 text-[0.9375rem] text-ink">{activeClue}</span>
          </p>

          <div
            key={puzzleIndex}
            ref={board}
            className="relative mx-auto grid aspect-square w-full max-w-[17.5rem] grid-cols-5 gap-px border border-ink bg-ink sm:max-w-[22rem]"
          >
            {cells.map((c, i) =>
              c.blocked ? (
                <div key={i} className="bg-ink" />
              ) : (
                <button
                  key={i}
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  onClick={() => {
                    if (i === cursor) setDir(dir === "across" ? "down" : "across");
                    move(i);
                  }}
                  // Backgrounds are opaque: the container behind the 1px gaps is
                  // solid ink, so a translucent tint renders muddy. A wrong
                  // letter is underlined as well as recoloured, in currentColor
                  // so the mark survives on the inked cursor cell too.
                  className={`relative font-typewriter text-[1.375rem] leading-none uppercase ${
                    i === cursor
                      ? "bg-stamp text-paper-bright"
                      : activeCells.includes(i)
                        ? "bg-paper-deep text-ink"
                        : "bg-paper-bright text-ink"
                  } ${wrong.has(i) ? "underline decoration-2 underline-offset-[3px]" : ""} ${
                    wrong.has(i) && i !== cursor ? "text-stamp" : ""
                  }`}
                >
                  {c.number && (
                    <span
                      className={`absolute top-[2px] left-[3px] text-[0.5rem] leading-none tracking-normal ${
                        i === cursor ? "text-paper-bright/70" : "text-ink-faint"
                      }`}
                    >
                      {c.number}
                    </span>
                  )}
                  {letters[i]}
                </button>
              ),
            )}

            {/* One roaming input, moved by inline offsets rather than
                re-parented into the active cell — re-parenting would remount
                it and drop focus (and the IME) on every keystroke. */}
            <input
              ref={input}
              // Never empty: on Android, Backspace against an empty field
              // often fires no event at all, so a sentinel space guarantees
              // a deleteContentBackward every time.
              value={letters[cursor] || " "}
              onChange={onChange}
              onKeyDown={onKeyDown}
              inputMode="text"
              autoCapitalize="characters"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              aria-label={`${activeNumber} ${activeDir}. ${activeClue}. Letter ${
                activeCells.indexOf(cursor) + 1
              } of ${activeCells.length}, ${letters[cursor] || "blank"}. ${filled} of ${total} filled.`}
              style={{
                position: "absolute",
                left: `${cell.col * 20}%`,
                top: `${cell.row * 20}%`,
                width: "20%",
                height: "20%",
                opacity: 0,
                // 16px or iOS Safari zooms the page on focus. Invisible, so
                // the size costs nothing.
                fontSize: "16px",
                caretColor: "transparent",
              }}
            />
          </div>
        </div>

        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {(["across", "down"] as const).map((d) => (
            <div key={d}>
              <p className="label border-b border-ink/15 pb-2 text-ink-faint">{d}</p>
              <ul className="mt-2 space-y-1">
                {(d === "across" ? puzzle.across : puzzle.down).map((clue) => {
                  const on = activeDir === d && activeNumber === clue.n;
                  return (
                    <li key={clue.n}>
                      {/* `flex`, not two inline spans in a block button: an
                          inline number followed by wrapping text snaps its
                          second line back to the button's own left edge,
                          landing it under the number instead of the clue —
                          the "weird alignment" on longer clues. Flex makes the
                          number a fixed column, so wrapped lines hang under
                          the first word of the clue instead. */}
                      <button
                        type="button"
                        onClick={() => {
                          setDir(d);
                          move((entries.get(entryKey(d, clue.n)) ?? [])[0]);
                        }}
                        className={`flex w-full gap-2 text-left text-[0.875rem] leading-snug ${
                          on ? "text-ink" : "text-ink-soft hover:text-ink"
                        }`}
                      >
                        <span
                          className={`control-sm w-4 shrink-0 pt-[0.1em] text-right ${on ? "text-stamp" : "text-ink-faint"}`}
                        >
                          {clue.n}
                        </span>
                        <span className="font-serif">{clue.clue}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </PuzzleFrame>
  );
}
