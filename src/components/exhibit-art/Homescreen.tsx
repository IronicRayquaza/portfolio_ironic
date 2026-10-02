import { T, beat, mark, steps } from "./tokens";
import { INK, RAYQUAZA } from "./rayquaza";

/**
 * PokeWidget — the same sprite on two screens. A phone home screen with the
 * widget dropped onto it, and the frameless desktop window that reads the very
 * same generated catalogue. The annotation is that shared catalogue: one source,
 * two runtimes, no argument about what to draw.
 *
 * The creature is the real Emerald sprite, screened down to four ink levels (see
 * `rayquaza.ts`). The thing that stood here before was invented, and no amount
 * of line work hides an invented Pokemon on a page about a Pokemon app.
 */

/** The camera: a desk seen from standing height. */
const HORIZON = 34;
const VP = 138;

/** Stroke weight by distance from the lens, not by importance. */
const W = { front: 2.8, near: 2.2, mid: 1.6, far: 1.1 } as const;

const FLOOR_COLS = Array.from({ length: 7 }, (_, i) => {
  const t = -1 + (2 * i) / 6;
  return +(VP + Math.sign(t) * 340 * t * t).toFixed(1);
});

function tilt(deg: number, cx: number, cy: number) {
  return { transform: `rotate(${deg} ${cx} ${cy})` };
}

/** Knocks the ground out from behind a solid object so it can occlude. */
function Solid(props: { x: number; y: number; width: number; height: number; rx?: number }) {
  return <rect {...props} fill="var(--color-paper-bright)" stroke="none" />;
}

/**
 * The sprite, defined once and stamped twice.
 *
 * `shape-rendering="crispEdges"` matters: without it the browser antialiases
 * every cell boundary and 213 abutting rectangles turn into a grey haze with
 * seams through it. A printed sprite has hard cells.
 */
function SpriteDef() {
  return (
    <g id="pw-rayquaza" shapeRendering="crispEdges">
      {RAYQUAZA.runs.map(([x, y, n, t], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={n}
          height={1}
          fill="currentColor"
          fillOpacity={INK[t]}
          stroke="none"
        />
      ))}
    </g>
  );
}

/**
 * One stamp of the sprite.
 *
 * The bob sits on a group *outside* the placement transform. Inside it, the
 * translate would be multiplied by the sprite's own scale and the larger
 * desktop sprite would lift half again as far as the one on the phone, tearing
 * off its shadow. Outside, both rise by the same few units. It has to be a
 * separate element either way: a CSS transform on an SVG element replaces that
 * element's `transform` attribute outright rather than composing with it.
 */
function Sprite({ x, y, s, order }: { x: number; y: number; s: number; order: number }) {
  return (
    <g {...beat("art-bob", order)}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <use href="#pw-rayquaza" />
      </g>
    </g>
  );
}

export function Homescreen() {
  return (
    <>
      <defs>
        <SpriteDef />
      </defs>

      <g className="art-base">
        {/* the desk */}
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

        {/* ───────── the catalogue both runtimes read.
            Drawn before the phone so the phone covers its left edge — the
            thing that used to float in the gutter between the two screens and
            read as a diagram label. ───────── */}
        <g {...tilt(5, 128, 108)}>
          <Solid x={104} y={84} width={46} height={30} />
          <rect x="104" y="84" width="46" height="30" fill="currentColor" fillOpacity={T.mid} />
          <rect x="104" y="84" width="46" height="30" strokeWidth={W.mid} />
          <path d="M126 90h18M126 97h18M126 104h11" strokeWidth="1.2" strokeOpacity="0.55" />
        </g>

        {/* ───────── the desktop window ───────── */}
        <g {...tilt(1.6, 236, 92)}>
          <path d="M160 146h146l-6 7H166z" fill="currentColor" fillOpacity={T.light} stroke="none" />
          <Solid x={160} y={38} width={146} height={108} />
          <rect x="160" y="38" width="146" height="108" fill="currentColor" fillOpacity={T.light} />
          <rect x="160" y="38" width="146" height="108" strokeWidth={W.mid} />
          <rect x="160" y="38" width="146" height="14" fill="currentColor" fillOpacity={T.mid} />
          <path d="M160 52h146" strokeWidth="1.4" />
          {steps(3, 170, 11).map((x) => (
            <circle key={x} cx={x} cy="45" r="2.8" fill="currentColor" fillOpacity={T.dark} />
          ))}

          {/* the same creature, larger, on a battlefield */}
          <ellipse cx="233" cy="133" rx="48" ry="8" fill="currentColor" fillOpacity={T.light} stroke="none" />
          <Sprite x={194} y={54} s={2.45} order={1} />
          <path d="M186 133h94" strokeWidth="1.4" strokeOpacity="0.6" />
        </g>

        {/* ───────── the phone, nearest the lens ─────────
            Drawn last so it occludes the catalogue — draw order is depth.
            Lifted 5 units before the tilt: rotating a 160-tall body about its
            middle swings the near bottom corner past the frame edge, and the
            contact smear went with it. */}
        <g transform={`translate(0 -5) ${tilt(-3.5, 70, 96).transform}`}>
          <path d="M18 172h108l-7 7H25z" fill="currentColor" fillOpacity={T.light} stroke="none" />
          <Solid x={16} y={12} width={110} height={160} rx={12} />
          <rect x="16" y="12" width="110" height="160" rx="12" fill="currentColor" fillOpacity={T.light} />
          <rect x="16" y="12" width="110" height="160" rx="12" strokeWidth={W.near} />

          {/* status bar: clock left, battery right */}
          <path d="M28 24h12" strokeWidth="1.6" />
          <rect x="102" y="20" width="12" height="7" rx="1.5" strokeWidth="1.2" />

          {/* the widget, holding the sprite */}
          <Solid x={26} y={38} width={90} height={64} />
          <rect x="26" y="38" width="90" height="64" fill="currentColor" fillOpacity={T.faint} />
          <rect x="26" y="38" width="90" height="64" strokeWidth={W.near} />
          <ellipse cx="71" cy="94" rx="24" ry="4" fill="currentColor" fillOpacity={T.light} stroke="none" />
          <Sprite x={44} y={40} s={1.7} order={0} />
          {/* the ground it stands on */}
          <path d="M34 94h74" strokeWidth="1.4" />

          {/* two ordinary app tiles beneath it, for scale */}
          <rect x="26" y="112" width="40" height="40" rx="8" fill="currentColor" fillOpacity={T.mid} />
          <rect x="26" y="112" width="40" height="40" rx="8" strokeWidth="1.4" />
          <rect x="76" y="112" width="40" height="40" rx="8" fill="currentColor" fillOpacity={T.mid} />
          <rect x="76" y="112" width="40" height="40" rx="8" strokeWidth="1.4" />

          {/* the dock */}
          {steps(4, 38, 22).map((x) => (
            <circle key={x} cx={x} cy="163" r="4" fill="currentColor" fillOpacity={T.dark} />
          ))}
        </g>

      </g>

      <g className="art-marks">
        {/* this tile is the product */}
        <ellipse {...mark(0)} cx="70" cy="70" rx="52" ry="38" />
        {/* one catalogue, read by both runtimes */}
        <path {...mark(1)} d="M153 100h14m-5-5l5 5-5 5" />
        <path {...mark(2)} d="M176 126l5 6 11-14" />
      </g>
    </>
  );
}
