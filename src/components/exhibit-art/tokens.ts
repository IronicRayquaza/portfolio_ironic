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
