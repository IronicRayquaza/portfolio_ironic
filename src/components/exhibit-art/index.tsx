import { VIEWBOX } from "./tokens";
import { Archive } from "./Archive";
import { Ledger } from "./Ledger";
import { Pinboard } from "./Pinboard";
import { Fingerprint } from "./Fingerprint";
import { Footprints } from "./Footprints";
import { Outline } from "./Outline";
import { Branches } from "./Branches";
import { Signals } from "./Signals";
import { Elevation } from "./Elevation";
import { Homescreen } from "./Homescreen";

export type ArtKey =
  | "archive"
  | "ledger"
  | "pinboard"
  | "fingerprint"
  | "footprints"
  | "outline"
  | "branches"
  | "signals"
  | "elevation"
  | "homescreen";

const ART: Record<ArtKey, () => React.JSX.Element> = {
  archive: Archive,
  ledger: Ledger,
  pinboard: Pinboard,
  fingerprint: Fingerprint,
  footprints: Footprints,
  outline: Outline,
  branches: Branches,
  signals: Signals,
  elevation: Elevation,
  homescreen: Homescreen,
};

/**
 * An evidence illustration, drawn 16:9 to fill its plate.
 *
 * Every scene is two layers: `.art-base` is the subject, always visible; the
 * `.art-marks` group is red pen, drawn in on hover. Both take their colour from
 * `currentColor`, so one asset covers every state rather than one per state.
 *
 * Decorative by design — the exhibit's title and description already carry the
 * meaning, so this is hidden from assistive tech instead of described twice.
 */
export function ExhibitArt({ art }: { art: ArtKey }) {
  const Scene = ART[art];

  return (
    <svg
      viewBox={VIEWBOX}
      className="exhibit-art h-full w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <Scene />
    </svg>
  );
}
