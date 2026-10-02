import { T, mark, steps } from "./tokens";
import { CAMPUS, SCREEN } from "./campus";
import { SITE, SITE_SCREEN } from "./site";

/**
 * Chandigarh University, Lucknow — the campus photograph, and the site built
 * for it filed behind. Both are the real thing screened into ink: the block as
 * it was photographed for the site, and the site as it actually renders.
 *
 * At rest the window is tucked behind the print with only its edge showing.
 * Hover slides it clear and then scrolls the page, which is the one gesture
 * that says what the job was — seventy-four pages of it, under that building.
 *
 * Nothing runs off the frame. Cropping the subject is the usual way to make a
 * drawing read as a photograph, but a plate is already a print with its own
 * border, and a second crop just looks like the artwork ran out of room.
 */

const HORIZON = 28;
const VP = 170;

/** Stroke weight by distance from the lens, not by importance. */
const W = { front: 2.8, near: 2.2, mid: 1.6, far: 1.1 } as const;

const FLOOR_COLS = Array.from({ length: 7 }, (_, i) => {
  const t = -1 + (2 * i) / 6;
  return +(VP + Math.sign(t) * 340 * t * t).toFixed(1);
});

function tilt(deg: number, cx: number, cy: number) {
  return { transform: `rotate(${deg} ${cx} ${cy})` };
}

function Solid(props: { x: number; y: number; width: number; height: number }) {
  return <rect {...props} fill="var(--color-paper-bright)" stroke="none" />;
}

/**
 * A screened image. `crispEdges` matters: without it the browser antialiases
 * thousands of abutting rectangles into a grey haze with seams running through
 * it, and a halftone has hard cells.
 */
function Screened({
  runs,
  ramp,
}: {
  runs: readonly (readonly [number, number, number, number])[];
  ramp: readonly number[];
}) {
  return (
    <g shapeRendering="crispEdges">
      {runs.map(([cx, cy, n, t], i) => (
        <rect
          key={i}
          x={cx}
          y={cy}
          width={n}
          height={1}
          fill="currentColor"
          fillOpacity={ramp[t]}
          stroke="none"
        />
      ))}
    </g>
  );
}

export function Elevation() {
  return (
    <>
      <g className="art-base">
        {/* The ground plane. Its recession lines are meant to run past the
            frame and be clipped — that is how a plane fills a view. Grouped
            so an overflow check can tell a floor apart from a cropped object. */}
        <g className="art-ground">
          <rect
            x="0"
            y={HORIZON}
            width="320"
            height={180 - HORIZON}
            fill="currentColor"
            fillOpacity={T.faint}
          />
          {FLOOR_COLS.map((x) => (
            <path key={x} d={`M${VP} ${HORIZON}L${x} 180`} strokeWidth={W.far} strokeOpacity="0.14" />
          ))}
          <path d={`M0 ${HORIZON}h320`} strokeWidth={W.far} strokeOpacity="0.4" />
        </g>

        {/* ───────── the site, filed behind the print ─────────
            Drawn first so the print covers it; `art-emerge` slides it clear. */}
        <g {...tilt(1.6, 236, 92)}>
          <g className="art-emerge">
            <path d="M154 150h112l-6 7H160z" fill="currentColor" fillOpacity={T.light} stroke="none" />
            <Solid x={152} y={28} width={114} height={122} />
            <rect x="152" y="28" width="114" height="122" strokeWidth={W.mid} />

            {/* browser chrome, so the grey panel reads as a screen */}
            <rect x="152" y="28" width="114" height="12" fill="currentColor" fillOpacity={T.mid} />
            <path d="M152 40h114" strokeWidth="1.4" />
            {steps(3, 159, 7).map((x) => (
              <circle key={x} cx={x} cy="34" r="2" fill="currentColor" fillOpacity={T.dark} />
            ))}
            <rect x="182" y="31" width="78" height="6" rx="3" fill="currentColor" fillOpacity={T.light} />

            {/* A nested viewport rather than a clipPath: SVG clips to it
                natively, so there is no global id to collide with and no second
                rectangle to keep in step with this one. The viewBox repeats the
                x/y/width/height, so children keep absolute coordinates. */}
            <svg x="152" y="40" width="114" height="110" viewBox="152 40 114 110">
              <g className="art-page">
                <g transform="translate(152 40) scale(1.5833)">
                  <Screened runs={SITE.runs} ramp={SITE_SCREEN} />
                </g>
              </g>
            </svg>
          </g>
        </g>

        {/* ───────── the print, nearest the lens ─────────
            Drawn last so it occludes the window — draw order is depth order. */}
        <g {...tilt(-2.5, 126, 88)}>
          <path d="M38 138h176l-7 7H45z" fill="currentColor" fillOpacity={T.light} stroke="none" />
          {/* the print's own paper border */}
          <Solid x={36} y={38} width={178} height={100} />
          <rect x="36" y="38" width="178" height="100" strokeWidth={W.front} />
          <g transform="translate(42 44) scale(2.075)">
            <Screened runs={CAMPUS.runs} ramp={SCREEN} />
          </g>
          {/* the caption strip a filed print carries */}
          <path d="M42 132h92" strokeWidth="1.4" strokeOpacity="0.55" />
          <path d="M176 132h22" strokeWidth="1.4" strokeOpacity="0.4" />
        </g>
      </g>

      <g className="art-marks">
        {/* the building in the print */}
        <ellipse {...mark(0)} cx="125" cy="84" rx="68" ry="38" />
        {/* and the page that was built under it */}
        <path {...mark(1)} d="M202 128C222 136 240 140 258 138m-8 6l8-6-6-7" />
      </g>
    </>
  );
}
