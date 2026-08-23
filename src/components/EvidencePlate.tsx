import { ExhibitArt, type ArtKey } from "./exhibit-art";

/**
 * The taped-up evidence photograph. Halftone-printed, annotated in red pen when
 * the exhibit is hovered — see the `.exhibit-art` rules in globals.css.
 */
export function EvidencePlate({
  art,
  letter,
  domain,
}: {
  art: ArtKey;
  letter: string;
  domain: string;
}) {
  return (
    <figure className="relative">
      {/* Tape holding the photo to the page. Sits above the plate edge. */}
      <span
        aria-hidden="true"
        className="absolute -top-3 left-1/2 z-20 h-6 w-24 -translate-x-1/2 -rotate-2 bg-ink/8 outline outline-1 outline-black/5"
      />

      <div className="plate relative border border-ink/55 bg-paper-bright">
        {/* Print area. Panoramic, not 4:3 — a tall plate strands the case notes
            beside it and leaves dead space under them. */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {/* Two halftone layers cross-fade — a gradient cannot transition colour. */}
          <span aria-hidden="true" className="halftone halftone-ink" />
          <span aria-hidden="true" className="halftone halftone-red" />

          <div className="absolute inset-0 flex items-center justify-center p-3">
            <ExhibitArt art={art} />
          </div>
        </div>

        {/* Provenance bar */}
        <div className="flex items-center justify-between gap-3 border-t border-ink/25 px-3 py-2">
          <span className="relative inline-block shrink-0">
            <span className="mono-label relative z-10 px-2 py-0.5">Exhibit {letter}</span>
            {/* Hand-drawn ellipse, ringed in red when the exhibit is hovered */}
            <svg
              aria-hidden="true"
              className="ring-mark absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 100 32"
              preserveAspectRatio="none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path
                d="M50 3c26 0 47 5 47 13s-21 13-47 13S3 24 3 16 24 3 50 3"
                pathLength="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </span>

          {/* min-w-0 or the flex row refuses to shrink below the full domain,
              and that min-content width propagates out through the grid until
              the whole page scrolls sideways on a phone. */}
          <span className="font-mono min-w-0 truncate text-[0.6875rem] text-ink-faint">
            recovered from {domain}
          </span>
        </div>
      </div>
    </figure>
  );
}
