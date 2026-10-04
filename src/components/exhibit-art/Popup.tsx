import { T, beat, hinge, mark } from "./tokens";
import { Block, PAPER, axo, curve, path, type Pt } from "./axo";
import { INK, RAYQUAZA } from "./rayquaza";

/**
 * PokeWidget — a phone lying face up on the desk, the widget on its home
 * screen, and in the widget the real Emerald sprite. At rest the creature is
 * printed flat on the glass like any other picture on a phone.
 *
 * Hover stands it up: it hinges off the screen like the page of a pop-up book
 * and then breathes, which is the whole idea of the app — a Pokemon that lives
 * on the home screen instead of lying on it.
 *
 * Camera: the 2:1 pixel-art projection old handheld games were drawn in, for
 * the one plate about one of their sprites. The sprite is screened from the
 * real asset (see `rayquaza.ts`), not drawn.
 */

const p = axo([190, 46], [0.98, 0.49], [-0.98, 0.49]);

const PHONE = { w: 80, d: 140, h: 5 };
const H = PHONE.h;

/** The widget on the home screen, and the hinge along its lower edge. */
const WIDGET = { x: 6, y: 13, w: 68, d: 66 };
const SCALE = 2;
const SPRITE = { w: RAYQUAZA.w * SCALE, h: RAYQUAZA.h * SCALE };
const FOOT = { x: WIDGET.x + (WIDGET.w - SPRITE.w) / 2, y: WIDGET.y + WIDGET.d - 3 };

function Sprite() {
  return (
    <g shapeRendering="crispEdges" transform={`translate(0 ${-SPRITE.h}) scale(${SCALE})`}>
      {RAYQUAZA.runs.map(([x, y, n, t], i) => (
        <rect key={i} x={x} y={y} width={n} height={1} fill="currentColor" fillOpacity={INK[t]} stroke="none" />
      ))}
    </g>
  );
}

/** The home screen, on the phone's glass: status bar, widget, apps, dock. */
function Screen() {
  return (
    <>
      <rect x="3" y="3" width={PHONE.w - 6} height={PHONE.d - 6} rx="6" fill={PAPER} strokeWidth="1.2" />
      <path d="M8 7.5h8" strokeWidth="1.4" />
      <rect x="65" y="5.5" width="8" height="4" rx="1" strokeWidth="1" />

      <rect x={WIDGET.x} y={WIDGET.y} width={WIDGET.w} height={WIDGET.d} rx="4" fill="currentColor" fillOpacity={T.faint} strokeWidth="1.4" />
      {/* the ground line the creature stands on */}
      <path d={`M${WIDGET.x + 6} ${FOOT.y}h${WIDGET.w - 12}`} strokeWidth="1.2" />

      {[0, 1].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={9 + col * 17}
            y={88 + row * 13}
            width="10"
            height="9"
            rx="2.4"
            fill="currentColor"
            fillOpacity={(row + col) % 3 === 0 ? T.mid : T.light}
            strokeWidth="1"
          />
        )),
      )}
      {[0, 1, 2, 3].map((col) => (
        <circle key={col} cx={14 + col * 17} cy={PHONE.d - 12} r="3.4" fill="currentColor" fillOpacity={T.dark} strokeWidth="1" />
      ))}
    </>
  );
}

export function Popup() {
  const foot = p.at(FOOT.x, FOOT.y, H + 0.5);
  const stood = (u: number, up: number): Pt => [+(foot[0] + u * p.ex[0]).toFixed(2), +(foot[1] + u * p.ex[1] - up).toFixed(2)];
  // A ring round the creature once it is standing, drawn in its own plane.
  const ringed = Array.from({ length: 41 }, (_, i): Pt => {
    const a = (i / 40) * Math.PI * 2;
    return stood(SPRITE.w / 2 + (SPRITE.w / 2 + 8) * Math.cos(a), SPRITE.h / 2 - 2 + (SPRITE.h / 2 + 4) * Math.sin(a));
  });

  return (
    <>
      <g className="art-base">
        {/* the phone's shadow on the desk */}
        <g transform={p.floor(0)}>
          <rect x="5" y="4" width={PHONE.w} height={PHONE.d} rx="8" fill="currentColor" fillOpacity={T.faint} stroke="none" />
        </g>

        <Block p={p} x={0} y={0} z={0} w={PHONE.w} d={PHONE.d} h={H} weight={2.2} tones={[T.light, T.mid, T.dark]}>
          <Screen />
        </Block>

        {/* Its shadow on the widget, there only once it has stood up. */}
        <g transform={p.floor(H)} className="art-flat">
          <ellipse
            className="art-appear"
            style={{ "--delay": "260ms", "--dur": "300ms" } as React.CSSProperties}
            cx={FOOT.x + SPRITE.w / 2}
            cy={FOOT.y - 9}
            rx={SPRITE.w / 2.2}
            ry="8"
            fill="currentColor"
            fillOpacity={T.light}
            stroke="none"
          />
        </g>

        {/* The creature: on the hinge along the widget's ground line. Lying
            flat it is printed on the glass; standing, it is a cut-out facing
            the reader. The breathing is outside the hinge so it moves straight
            up the page whatever angle the hinge is at. */}
        <g {...beat("art-bob", 3)}>
          <g transform={`translate(${foot[0]} ${foot[1]})`}>
            <g {...hinge(p.ex, p.ey, 86, { dur: 620, delay: 80, ease: "cubic-bezier(0.34, 1.4, 0.64, 1)" })}>
              <Sprite />
            </g>
          </g>
        </g>
      </g>

      <g className="art-marks">
        {/* up off the glass */}
        <path {...mark(1)} d={curve(stood(-14, -6), stood(-30, 18), stood(-30, 44), stood(-12, 58))} />
        <path {...mark(12)} d={path(ringed)} />
        <path {...mark(16)} d={`M${stood(SPRITE.w + 14, 70)[0]} ${stood(SPRITE.w + 14, 70)[1]}l5 6 11-14`} />
      </g>
    </>
  );
}
