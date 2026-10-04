/**
 * Shared vocabulary for the evidence illustrations.
 *
 * Everything is drawn on a 16:9 canvas so the artwork fills the plate rather
 * than letterboxing inside it. Tone is carried by `fill="currentColor"` at these
 * opacities, so a single colour change recolours every mass and stroke at once.
 */

export const VIEWBOX = "0 0 320 180";

/** Tonal steps, lightest to darkest. Engraving logic: few darks, lots of mid. */
export const T = {
  faint: 0.07,
  light: 0.14,
  mid: 0.24,
  dark: 0.4,
} as const;

/** Marks stagger by index so the annotation reads as written, not stamped. */
export function mark(order: number) {
  return {
    className: "art-mark",
    pathLength: 1,
    style: { "--m": order } as React.CSSProperties,
  };
}

/** Evenly spaced values — ruled lines, hatching, shelf rails. */
export function steps(count: number, start: number, gap: number): number[] {
  return Array.from({ length: count }, (_, i) => start + i * gap);
}

/**
 * Scene motion.
 *
 * Each illustration has one signature move, and every one of them is the thing
 * the product it depicts actually does: PokeWidget's sprites bob, Unify's
 * waveform runs, the Solana trail gets walked, the campus site scrolls. None of
 * it hides anything — every scene reads complete at rest, because on a phone
 * there is no hover and on a keyboard there is only focus. The motion is
 * emphasis, never the only way to see the drawing.
 *
 * `order` staggers a group so a sequence reads as one travelling gesture rather
 * than a dozen things twitching at once. See the `.art-*` rules in globals.css.
 */
export type Beat = "art-wave" | "art-meter" | "art-bob" | "art-pop";

export function beat(move: Beat, order = 0) {
  return { className: move, style: { "--m": order } as React.CSSProperties };
}

/** Something the hover produces: absent at rest, faded in at `delay`. */
export function appear(delay = 0, dur = 250) {
  return {
    className: "art-appear",
    style: { "--delay": `${delay}ms`, "--dur": `${dur}ms` } as React.CSSProperties,
  };
}

/**
 * A part of a scene with a second position: where it goes while the exhibit is
 * hovered or focused. Driven by a transition rather than a keyframe, so a reader
 * who leaves halfway gets it handed back from wherever it had got to instead of
 * watching it finish first. Staging is done with `delay`; the way back is always
 * quick and undelayed (see `.art-shift` in globals.css).
 *
 * `from` is the resting pose, when that is not where the element was drawn.
 * Give it the same list of functions as `to` so the two interpolate cleanly.
 *
 * The element must not carry its own `transform` attribute — the CSS transform
 * would replace it. Wrap a placed or projected group in one of these instead.
 */
export function shift(
  to: string,
  {
    from,
    dur = 600,
    delay = 0,
    ease,
    pivot = false,
    snap = false,
  }: {
    from?: string;
    dur?: number;
    delay?: number;
    ease?: string;
    pivot?: boolean;
    /** Whole turns of something symmetric: drop back instantly on leaving. */
    snap?: boolean;
  } = {},
) {
  return {
    className: snap ? "art-shift art-snap" : "art-shift",
    style: {
      "--to": to,
      ...(from ? { "--from": from } : {}),
      "--dur": `${dur}ms`,
      "--delay": `${delay}ms`,
      ...(ease ? { "--ease": ease } : {}),
      // Turn about the local origin rather than the middle of the shape, for a
      // lever or a hinge drawn with its pivot at (0, 0).
      ...(pivot ? { transformBox: "view-box", transformOrigin: "0 0" } : {}),
    } as React.CSSProperties,
  };
}

/**
 * Print that runs along a tape: the dash pattern moves `by` units along its
 * path. Make `by` a whole number of the pattern's repeats.
 */
export function feed(by: number, { dur = 1400, delay = 0, ease }: { dur?: number; delay?: number; ease?: string } = {}) {
  return {
    className: "art-feed",
    style: {
      "--feed": `${by}`,
      "--dur": `${dur}ms`,
      "--delay": `${delay}ms`,
      ...(ease ? { "--ease": ease } : {}),
    } as React.CSSProperties,
  };
}

/**
 * Something lying flat that stands up about a hinge (see `.art-hinge`). `along`
 * is the screen vector of one unit along the hinge. `across` is the screen
 * vector of one unit across the floor, pointing from the thing's head to its
 * foot while it lies flat. Draw the thing in a group placed on the hinge, foot
 * on y = 0 and head toward negative y; `to` is how far it stands, in degrees.
 */
export function hinge(
  along: readonly [number, number],
  across: readonly [number, number],
  to: number,
  { dur = 600, delay = 0, ease }: { dur?: number; delay?: number; ease?: string } = {},
) {
  return {
    className: "art-hinge",
    style: {
      "--ax": `${along[0]}`,
      "--ay": `${along[1]}`,
      "--cx": `${across[0]}`,
      "--cy": `${across[1]}`,
      "--to": `${to}deg`,
      "--dur": `${dur}ms`,
      "--delay": `${delay}ms`,
      ...(ease ? { "--ease": ease } : {}),
    } as React.CSSProperties,
  };
}
