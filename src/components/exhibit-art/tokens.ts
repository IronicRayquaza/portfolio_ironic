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
