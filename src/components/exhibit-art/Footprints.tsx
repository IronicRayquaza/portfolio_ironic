import { T, beat, mark, steps } from "./tokens";

/**
 * Solana Statistics — a floor of prints crossing the frame, numbered and scaled.
 * The red dashed line traces the route, which is what an indexer produces.
 */

/** x, y, and which foot — the trail alternates as a real gait does. */
const TRAIL = [
  [40, 150, -1],
  [80, 126, 1],
  [120, 102, -1],
  [160, 78, 1],
  [200, 54, -1],
  [240, 30, 1],
] as const;

/**
 * Drawn around the origin and then placed, so mirroring the left foot is a
 * plain `scale(-1 1)` instead of a flip about the canvas origin.
 */
const SOLE = "M-9-4c0-11 4-19 9-19s9 8 9 19c0 8-2 13-4 17h-10c-2-4-4-9-4-17z";

function Print({ x, y, side, order }: { x: number; y: number; side: number; order: number }) {
  return (
    /* The placement is on the outer group and the step on the inner one: a CSS
       transform replaces an SVG `transform` attribute rather than composing
       with it, which would drop every print back onto the origin. */
    <g transform={`translate(${x} ${y}) rotate(${-16 + side * 3}) scale(${side} 1)`}>
      <g {...beat("art-wave", order)}>
      <path d={SOLE} fill="currentColor" fillOpacity={T.mid} />
      <path d={SOLE} strokeWidth="1.6" />
      {/* tread bars */}
      {steps(3, -16, 7).map((ty) => (
        <path key={ty} d={`M-5 ${ty}h10`} strokeWidth="1.2" />
      ))}
      {/* heel */}
      <ellipse cx="0" cy="22" rx="7" ry="6" fill="currentColor" fillOpacity={T.mid} />
      <ellipse cx="0" cy="22" rx="7" ry="6" strokeWidth="1.6" />
      </g>
    </g>
  );
}

/** Numbered tent card, the kind laid beside each piece of evidence. */
function Tent({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <path d={`M${x - 13} ${y}h26l-6-30h-14z`} fill="currentColor" fillOpacity={T.light} />
      <path d={`M${x - 13} ${y}h26l-6-30h-14z`} />
      <path d={`M${x - 4} ${y - 4}v-18`} strokeWidth={n === 1 ? 2.4 : 0} />
      {n === 2 && <path d={`M${x - 7} ${y - 22}h8v9h-8v9h8`} strokeWidth="2.4" />}
    </g>
  );
}

export function Footprints() {
  return (
    <>
      <g className="art-base">
        {/* floor, with tiling that recedes */}
        <rect x="0" y="0" width="320" height="180" fill="currentColor" fillOpacity={T.faint} />
        {steps(5, 4, 44).map((x) => (
          <path key={x} d={`M${x} 180L${x + 70} 0`} strokeWidth="1" strokeOpacity="0.5" />
        ))}
        {steps(4, 42, 42).map((y) => (
          <path key={y} d={`M0 ${y}h320`} strokeWidth="1" strokeOpacity="0.5" />
        ))}

        {TRAIL.map(([x, y, side], i) => (
          <Print key={`${x}-${y}`} x={x} y={y} side={side} order={i} />
        ))}

        <Tent x={92} y={168} n={1} />
        <Tent x={214} y={96} n={2} />

        {/* photographic scale laid along the bottom */}
        <rect x="238" y="150" width="72" height="14" fill="currentColor" fillOpacity={T.light} />
        <rect x="238" y="150" width="72" height="14" />
        {steps(8, 246, 9).map((x, i) => (
          <path key={x} d={`M${x} 164v${i % 2 ? -5 : -9}`} strokeWidth="1.4" />
        ))}
      </g>

      <g className="art-marks">
        <path
          {...mark(0)}
          d="M30 172C64 150 84 138 112 116s72-56 128-92"
          strokeDasharray="8 7"
        />
        <ellipse {...mark(1)} cx="160" cy="82" rx="26" ry="34" />
        <path {...mark(2)} d="M250 26l16-12" />
        <path {...mark(3)} d="M266 14l-12 1 3 10" />
      </g>
    </>
  );
}
