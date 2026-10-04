import { T, appear, mark, shift } from "./tokens";
import { Block, Face, PAPER, axo, path, pts, ring } from "./axo";
import { CAMPUS, SCREEN } from "./campus";
import { SITE, SITE_SCREEN } from "./site";

/**
 * Chandigarh University, Lucknow — the campus block as a forensic diorama, the
 * kind built room by room to scale so a scene can be studied after the fact.
 * Its facade is the real photograph from the site, screened into ink.
 *
 * Hover slides the facade aside like the front of a model and shows what the
 * job actually was behind it: floor after floor of pages, each with the real
 * site on its wall, and every floor furnished from the same few pieces — the
 * same counter, the same chairs — because all seventy-four pages were built
 * from one set of shared components. The lamps come on as it opens.
 *
 * Camera: low and in front, a little to the left, the facade almost square to
 * the reader so the photograph on it stays legible and the depth running away
 * up and to the right. The facade slides off to the left, over the plinth
 * that was built long enough to take it.
 */

const p = axo([156, 128], [0.97, 0.16], [0.42, -0.36]);

/** Shallow on purpose, as the real studies were: a deep room hides its own back wall
 * behind the floor above it. */
const BOX = { w: 116, d: 30, h: 76 };
const STOREY = 38;
const SLAB = 3;

/** How far the facade slides along its own face to open the model. */
const SLIDE = -(BOX.w + 4);

/**
 * A screened image. `crispEdges` matters: without it the browser antialiases
 * thousands of abutting rectangles into a grey haze with seams through it.
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
        <rect key={i} x={cx} y={cy} width={n} height={1} fill="currentColor" fillOpacity={ramp[t]} stroke="none" />
      ))}
    </g>
  );
}

/** One storey's furniture: the shared pieces, placed the same way every time. */
function Storey({ z }: { z: number }) {
  return (
    <>
      {/* the page on the back wall: the real site, framed */}
      <g transform={p.wallY(BOX.d, z + 27)}>
        <rect x="12" y="0" width="14" height="23" fill={PAPER} strokeWidth="1.3" />
        <g transform="translate(13.1 1.2) scale(0.165)">
          <use href="#cu-site" />
        </g>
      </g>

      {/* the counter */}
      <Block p={p} x={46} y={18} z={z} w={36} d={8} h={9} weight={1.3} />
      {/* and the chairs either side of it */}
      {[36, 88].map((x) => (
        <g key={x}>
          <Block p={p} x={x} y={12} z={z + 5} w={7} d={2} h={8} weight={1} />
          <Block p={p} x={x} y={4} z={z} w={7} d={8} h={5} weight={1} />
        </g>
      ))}
    </>
  );
}

/** A lamp hanging from the ceiling, and the light it throws once it is on. */
function Lamp({ z }: { z: number }) {
  const [x, y] = [64, 14];
  const top = p.at(x, y, z + STOREY - SLAB);
  const shade = p.at(x, y, z + 22);
  const pool = ring(p, x, y, z + 0.5, 16);

  return (
    <>
      <g {...appear(520 + (z ? 120 : 0), 300)}>
        <polygon points={pts(p.at(x - 5, y, z + 22), p.at(x + 5, y, z + 22), ...pool.slice(0, 21))} fill={PAPER} fillOpacity={0.35} stroke="none" />
        <path d={path(pool, true)} fill={PAPER} fillOpacity={0.5} stroke="none" />
      </g>
      <path d={`M${top[0]} ${top[1]}V${shade[1]}`} strokeWidth="1" />
      <path d={`M${shade[0] - 5} ${shade[1] + 4}L${shade[0] - 2} ${shade[1]}H${shade[0] + 2}L${shade[0] + 5} ${shade[1] + 4}Z`} fill="currentColor" fillOpacity={T.dark} strokeWidth="1" />
    </>
  );
}

export function Diorama() {
  const counters = [0, STOREY].map((z) => ring(p, 64, 22, z + 5, 24));
  const roof = p.at(BOX.w - 34, BOX.d, BOX.h + 8);

  return (
    // Centred on the plate and brought up to fill it.
    <g transform="translate(160 92) scale(1.2) translate(-160 -96)">
      <defs>
        <g id="cu-site">
          <Screened runs={SITE.runs} ramp={SITE_SCREEN} />
        </g>
      </defs>

      <g className="art-base">
        {/* the display base the model sits on */}
        <Block p={p} x={-BOX.w - 10} y={-12} z={-7} w={2 * BOX.w + 18} d={BOX.d + 18} h={7} weight={2.2} tones={[T.light, T.mid, T.dark]} />
        {/* the plaque on the front of the base, as every study carries */}
        <g transform={p.wallY(-12, -1)}>
          <rect x="-104" y="0.6" width="40" height="5" fill="currentColor" fillOpacity={T.dark} strokeWidth="1" />
          <path d="M-100 3.1h22" stroke={PAPER} strokeWidth="1" />
        </g>

        {/* Inside, back to front: the back wall, the left wall in shade, the
            ground floor and what stands on it. */}
        <Face points={pts(p.at(0, BOX.d, 0), p.at(BOX.w, BOX.d, 0), p.at(BOX.w, BOX.d, BOX.h), p.at(0, BOX.d, BOX.h))} tone={T.light} weight={1.4} />
        <Face points={pts(p.at(0, 0, 0), p.at(0, BOX.d, 0), p.at(0, BOX.d, BOX.h), p.at(0, 0, BOX.h))} tone={T.mid} weight={1.4} />
        <Face points={pts(p.at(0, 0, 0), p.at(BOX.w, 0, 0), p.at(BOX.w, BOX.d, 0), p.at(0, BOX.d, 0))} tone={T.faint} weight={1.4} />
        <Lamp z={0} />
        <Storey z={0} />

        {/* the floor between, and the upper storey on it */}
        <Block p={p} x={0} y={0} z={STOREY - SLAB} w={BOX.w} d={BOX.d} h={SLAB} weight={1.6} />
        <Lamp z={STOREY} />
        <Storey z={STOREY} />

        {/* the roof, and the model's right-hand wall seen from outside */}
        <Block p={p} x={-3} y={-3} z={BOX.h} w={BOX.w + 6} d={BOX.d + 6} h={7} weight={2.2} tones={[T.light, T.mid, T.dark]} />
        <Face points={pts(p.at(BOX.w, 0, 0), p.at(BOX.w, BOX.d, 0), p.at(BOX.w, BOX.d, BOX.h), p.at(BOX.w, 0, BOX.h))} tone={T.mid} weight={2.2} />

        {/* The facade: a slab carrying the real photograph, slid aside on
            hover along its own face like the front of a model being opened. */}
        <g {...shift(`translate(${+(SLIDE * p.ex[0]).toFixed(2)}px, ${+(SLIDE * p.ex[1]).toFixed(2)}px)`, { dur: 720 })}>
          <Block p={p} x={0} y={-3} z={0} w={BOX.w} d={3} h={BOX.h} weight={2.4} tones={[T.light, T.light, T.mid]} />
          <g transform={p.wallY(-3, BOX.h)}>
            <rect x="0" y="0" width={BOX.w} height={BOX.h} fill={PAPER} stroke="none" />
            <g transform="translate(0 3) scale(1.5)">
              <Screened runs={CAMPUS.runs} ramp={SCREEN} />
            </g>
            <rect x="0" y="0" width={BOX.w} height={BOX.h} strokeWidth="2.4" />
          </g>
        </g>
      </g>

      <g className="art-marks">
        {/* the same counter on every floor */}
        <path {...mark(10)} d={path(counters[1], true)} />
        <path {...mark(12)} d={path(counters[0], true)} />
        <path {...mark(14)} d={`M${p.at(40, 22, 5 + STOREY)[0]} ${p.at(40, 22, 5 + STOREY)[1] + 4}V${p.at(40, 22, 5)[1] - 4}`} />
        <path {...mark(17)} d={`M${roof[0]} ${roof[1] - 4}l5 6 11-14`} />
      </g>
    </g>
  );
}
