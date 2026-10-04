import { T, mark, shift } from "./tokens";

/**
 * ArDacity UI — the composing room. A type cabinet with its top case pulled
 * open, and every sort in it cast as a component instead of a letter: a
 * button, a switch, a slider, a field. Across the room, on the imposing stone,
 * a chase holds a page already set from those pieces, with one slot empty.
 *
 * Hover sets the missing piece: the button sort lifts out of its compartment,
 * crosses the room and drops into the forme, and then the quoin key turns and
 * the forme is locked up. That is the library — components picked from a case
 * and composed — and the permaweb: once a forme is locked it cannot shift.
 *
 * Drawn in oblique, like a patent figure: fronts true, depth receding up and to
 * the right. Every face is a solid knock-out, so things genuinely stand in
 * front of one another rather than being outlined on top of each other.
 */

const KX = 0.35;
const KY = 0.75;

type Origin = readonly [number, number];
/** Front-left floor corner of the open case, and of the imposing stone. */
const CASE: Origin = [14, 96];
const STONE: Origin = [188, 160];

/** Compartment walls, and the height every sort is cast to. */
const RIM = 6;
const TYPE_HIGH = 9;

const PAPER = "var(--color-paper-bright)";

function at(o: Origin, u: number, v: number, z = 0): [number, number] {
  return [+(o[0] + u + KX * v).toFixed(2), +(o[1] - KY * v - z).toFixed(2)];
}

/** Lays local (u along the front, v into the depth) coordinates flat at height z. */
function flat(o: Origin, z = 0) {
  return `matrix(1 0 ${KX} ${-KY} ${o[0]} ${o[1] - z})`;
}

function pts(...p: [number, number][]) {
  return p.map(([x, y]) => `${x},${y}`).join(" ");
}

/** A surface that hides whatever is behind it, then takes its tone. */
function Solid({ points, tone, weight }: { points: string; tone: number; weight?: number }) {
  return (
    <>
      <polygon points={points} fill={PAPER} stroke="none" />
      <polygon points={points} fill="currentColor" fillOpacity={tone} strokeWidth={weight} />
    </>
  );
}

type Glyph = "button" | "toggle" | "check" | "slider" | "avatar" | "field" | "nav" | "card" | "radio";

/**
 * What is cast on a sort's face, in the face's own coordinates. v runs up the
 * page here, so the top of a glyph is its larger v.
 */
function Face({ g, u, v, w, d }: { g: Glyph; u: number; v: number; w: number; d: number }) {
  const mid = v + d / 2;
  const fine = 1.1;

  switch (g) {
    case "button":
      return <rect x={u + 3} y={v + 3} width={w - 6} height={d - 6} rx="2" fill="currentColor" fillOpacity={T.dark} strokeWidth={fine} />;
    case "toggle": {
      const r = (d - 6) / 2;
      return (
        <>
          <rect x={u + 3} y={v + 3} width={w - 6} height={d - 6} rx={r} fill="currentColor" fillOpacity={T.light} strokeWidth={fine} />
          <circle cx={u + w - 3 - r} cy={mid} r={r - 0.6} fill="currentColor" fillOpacity={T.dark} stroke="none" />
        </>
      );
    }
    case "check":
      return (
        <>
          <rect x={u + 3} y={v + 3} width={d - 6} height={d - 6} rx="1" strokeWidth={fine} />
          <path d={`M${u + 4.5} ${mid}l2 -2.4 3.5 5`} strokeWidth={fine} />
        </>
      );
    case "slider":
      return (
        <>
          <path d={`M${u + 3} ${mid}H${u + w - 3}`} strokeWidth={fine} />
          <circle cx={u + w * 0.62} cy={mid} r="3" fill="currentColor" fillOpacity={T.dark} strokeWidth={fine} />
        </>
      );
    case "avatar":
      return (
        <>
          <circle cx={u + 3 + (d - 6) / 2} cy={mid} r={(d - 6) / 2} fill="currentColor" fillOpacity={T.mid} strokeWidth={fine} />
          <path d={`M${u + d} ${mid + 1.5}h${w - d - 3}M${u + d} ${mid - 1.5}h${(w - d - 3) * 0.6}`} strokeWidth={fine} />
        </>
      );
    case "field":
      return (
        <>
          <rect x={u + 2.5} y={v + 3} width={w - 5} height={d - 6} strokeWidth={fine} />
          <path d={`M${u + 5} ${v + 4.5}v${d - 9}`} strokeWidth={fine} />
        </>
      );
    case "nav":
      return (
        <>
          <rect x={u + 2.5} y={v + 2.5} width={w - 5} height={d - 5} fill="currentColor" fillOpacity={T.mid} stroke="none" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={u + w - 6 - i * 5} cy={mid} r="1.3" fill="currentColor" fillOpacity={T.dark} stroke="none" />
          ))}
        </>
      );
    case "card":
      return (
        <>
          <rect x={u + 2.5} y={v + 2.5} width={w - 5} height={d - 5} strokeWidth={fine} />
          <circle cx={u + 8} cy={mid} r="3" fill="currentColor" fillOpacity={T.mid} strokeWidth={fine} />
          <path d={`M${u + 14} ${mid + 1.5}h${w - 20}M${u + 14} ${mid - 1.5}h${(w - 20) * 0.6}`} strokeWidth={fine} />
        </>
      );
    case "radio":
      return (
        <>
          <circle cx={u + w * 0.3} cy={mid} r="2.6" strokeWidth={fine} />
          <circle cx={u + w * 0.3} cy={mid} r="1.1" fill="currentColor" stroke="none" />
          <circle cx={u + w * 0.72} cy={mid} r="2.6" strokeWidth={fine} />
        </>
      );
  }
}

/** One piece of type: a block standing on the floor at o, with a component on its face. */
function Sort({
  o,
  u,
  v,
  w,
  d,
  g,
  h = TYPE_HIGH,
  weight = 1.3,
}: {
  o: Origin;
  u: number;
  v: number;
  w: number;
  d: number;
  g?: Glyph;
  h?: number;
  weight?: number;
}) {
  const [x, y] = at(o, u, v, h);

  return (
    <g strokeWidth={weight}>
      <Solid points={pts(at(o, u + w, v), at(o, u + w, v + d), at(o, u + w, v + d, h), at(o, u + w, v, h))} tone={T.mid} />
      <rect x={x} y={y} width={w} height={h} fill={PAPER} stroke="none" />
      <rect x={x} y={y} width={w} height={h} fill="currentColor" fillOpacity={T.light} />
      <g transform={flat(o, h)} className="art-flat">
        <rect x={u} y={v} width={w} height={d} fill={PAPER} stroke="none" />
        <rect x={u} y={v} width={w} height={d} fill="currentColor" fillOpacity={T.faint} />
        {g && <Face g={g} u={u} v={v} w={w} d={d} />}
      </g>
    </g>
  );
}

/**
 * An open compartment, seen from above the rim: the floor, the back wall facing
 * the reader, and the left wall falling into shade. Drawn in the rim's plane;
 * the floor shows up shifted down and right by exactly the wall's height.
 */
function Compartment({ u0, u1, v0, v1 }: { u0: number; u1: number; v0: number; v1: number }) {
  const du = (RIM * KX) / KY;
  const dv = RIM / KY;
  const w = u1 - u0;
  const d = v1 - v0;
  const back = `${u0},${v1} ${u1},${v1} ${u1},${v1 - dv} ${u0 + du},${v1 - dv}`;

  return (
    <>
      <rect x={u0} y={v0} width={w} height={d} fill={PAPER} stroke="none" />
      <rect x={u0} y={v0} width={w} height={d} fill="currentColor" fillOpacity={T.mid} stroke="none" />
      <polygon points={back} fill={PAPER} stroke="none" />
      <polygon points={back} fill="currentColor" fillOpacity={T.light} stroke="none" />
      <rect x={u0 + du} y={v0} width={w - du} height={d - dv} fill={PAPER} stroke="none" />
      <rect x={u0 + du} y={v0} width={w - du} height={d - dv} fill="currentColor" fillOpacity={T.faint} stroke="none" />
      <rect x={u0} y={v0} width={w} height={d} strokeWidth="1.1" />
    </>
  );
}

/**
 * The case, back row first. Compartments are irregular on purpose — a real job
 * case is laid out by how often each piece is used, not on a grid. A sort
 * stands at the back of its compartment and clear of the right-hand wall, so
 * nothing in front of it has to be drawn twice to hide it.
 */
type Piece = { u: number; w: number; g?: Glyph; h?: number; v?: number; d?: number };
const ROWS: { v0: number; v1: number; cells: { u0: number; u1: number; sorts: Piece[] }[] }[] = [
  {
    v0: 62,
    v1: 85,
    cells: [
      { u0: 3, u1: 30, sorts: [{ u: 4, w: 21, g: "toggle" }] },
      { u0: 33, u1: 58, sorts: [{ u: 34, w: 20, g: "avatar" }] },
      { u0: 61, u1: 76, sorts: [{ u: 62, w: 5, d: 5, h: 7, v: 77 }, { u: 66, w: 5, d: 5, h: 7, v: 72 }] },
      { u0: 79, u1: 96, sorts: [{ u: 80, w: 12, g: "check" }] },
      { u0: 99, u1: 125, sorts: [{ u: 100, w: 21, g: "slider" }] },
    ],
  },
  {
    v0: 33,
    v1: 59,
    cells: [
      { u0: 3, u1: 42, sorts: [{ u: 4, w: 34, g: "nav" }] },
      { u0: 45, u1: 60, sorts: [{ u: 46, w: 11, g: "radio" }] },
      { u0: 63, u1: 98, sorts: [{ u: 64, w: 30, g: "card" }] },
      { u0: 101, u1: 125, sorts: [{ u: 102, w: 5, d: 5, h: 7, v: 50 }, { u: 108, w: 5, d: 5, h: 7, v: 52 }, { u: 114, w: 5, d: 5, h: 7, v: 46 }] },
    ],
  },
  {
    v0: 3,
    v1: 30,
    cells: [
      { u0: 3, u1: 20, sorts: [{ u: 4, w: 5, d: 5, h: 7, v: 22 }, { u: 10, w: 5, d: 5, h: 7, v: 17 }] },
      // the button's compartment: its sort is the one that moves, drawn later
      { u0: 23, u1: 50, sorts: [] },
      { u0: 53, u1: 86, sorts: [{ u: 54, w: 28, g: "field" }] },
      { u0: 89, u1: 106, sorts: [{ u: 90, w: 5, d: 5, h: 7, v: 21 }, { u: 96, w: 5, d: 5, h: 7, v: 16 }] },
      { u0: 109, u1: 125, sorts: [{ u: 110, w: 12, g: "check" }] },
    ],
  },
];

/** The sort that gets set, in the case and in the forme. */
const PIECE = { u: 24, v: 16, w: 20, d: 12 };
const SLOT = { u: 34, v: 9 };
/** How high it is lifted to clear the walls on its way across. */
const LIFT = 16;

function Cabinet() {
  const width = 128;
  const depth = 88;
  const below = -72;

  return (
    <g>
      {/* the cabinet's side, and its front with two closed cases */}
      <Solid
        points={pts(at(CASE, width, 0, RIM), at(CASE, width, depth, RIM), at(CASE, width, depth, below), at(CASE, width, 0, below))}
        tone={T.mid}
        weight={2.4}
      />
      <rect x={CASE[0]} y={CASE[1] - RIM} width={width} height={RIM - below} fill={PAPER} stroke="none" />
      <rect x={CASE[0]} y={CASE[1] - RIM} width={width} height={RIM - below} fill="currentColor" fillOpacity={T.light} strokeWidth="2.4" />
      <path d={`M${CASE[0]} ${CASE[1]}h${width}`} strokeWidth="1.6" />
      {[100, 134].map((y) => (
        <g key={y}>
          <rect x={CASE[0] + 6} y={y} width={width - 12} height="30" fill="currentColor" fillOpacity={T.faint} strokeWidth="1.6" />
          {/* the label holder, and the cup pull under it */}
          <rect x={CASE[0] + width / 2 - 13} y={y + 6} width="26" height="8" fill={PAPER} strokeWidth="1.4" />
          <path d={`M${CASE[0] + width / 2 - 9} ${y + 19}a9 6 0 0 0 18 0z`} fill="currentColor" fillOpacity={T.dark} strokeWidth="1.4" />
        </g>
      ))}

      {/* the open case: its rim, then compartments back to front */}
      <g transform={flat(CASE, RIM)} className="art-flat">
        <rect width={width} height={depth} fill={PAPER} stroke="none" />
        <rect width={width} height={depth} fill="currentColor" fillOpacity={T.light} strokeWidth="2.4" />
      </g>
      {ROWS.map((row) => (
        <g key={row.v0}>
          <g transform={flat(CASE, RIM)} className="art-flat">
            {row.cells.map((c) => (
              <Compartment key={c.u0} u0={c.u0} u1={c.u1} v0={row.v0} v1={row.v1} />
            ))}
          </g>
          {row.cells.flatMap((c) =>
            c.sorts.map((s) => (
              <Sort
                key={`${s.u}-${s.v ?? 0}`}
                o={CASE}
                u={s.u}
                v={s.v ?? row.v1 - 13}
                w={s.w}
                d={s.d ?? 12}
                h={s.h}
                g={s.g}
                weight={s.g ? 1.3 : 1}
              />
            )),
          )}
        </g>
      ))}
    </g>
  );
}

/** The quoin: a wedge lock, with its key lying in the socket. */
const QUOIN = { u: 76, v: 15, w: 10, d: 26, h: 7 };

/**
 * A pen stroke that lies on a surface: an arc in that surface's coordinates,
 * projected point by point, with its arrowhead. Done in screen space rather
 * than under a transform so the pen's dash is measured where it is drawn.
 */
function arcOn(o: Origin, z: number, cu: number, cv: number, r: number, from: number, sweep: number) {
  const steps = 36;
  const p = Array.from({ length: steps + 1 }, (_, i) => {
    const a = ((from + (sweep * i) / steps) * Math.PI) / 180;
    return at(o, cu + r * Math.cos(a), cv + r * Math.sin(a), z);
  });
  const [ex, ey] = p[steps];
  const [px, py] = p[steps - 2];
  const len = Math.hypot(ex - px, ey - py);
  const [dx, dy] = [(ex - px) / len, (ey - py) / len];
  const head = (side: number) =>
    `L${+(ex - dx * 4.5 + side * dy * 3.5).toFixed(2)} ${+(ey - dy * 4.5 - side * dx * 3.5).toFixed(2)}`;

  return `M${p.map(([x, y]) => `${x} ${y}`).join("L")}${head(1)}M${ex} ${ey}${head(-1)}`;
}

export function Typecase() {
  // From the piece's place in the case to its slot in the forme, floor to floor.
  const [fromX, fromY] = at(CASE, PIECE.u, PIECE.v);
  const [toX, toY] = at(STONE, SLOT.u, SLOT.v);
  const dx = +(toX - fromX).toFixed(2);
  const dy = +(toY - fromY).toFixed(2);
  const key = { u: QUOIN.u + QUOIN.w / 2, v: QUOIN.v + QUOIN.d / 2 };

  return (
    <>
      <g className="art-base">
        <Cabinet />

        {/* The proof pulled from the forme, pegged on the line to dry. It is
            the page the chase is setting, printed the right way round. */}
        <path d="M226 9Q269 15 312 9" strokeWidth="1.2" />
        <circle cx="226" cy="9" r="1.8" fill="currentColor" stroke="none" />
        <circle cx="312" cy="9" r="1.8" fill="currentColor" stroke="none" />
        <g transform="rotate(2 267 13)">
          <rect x="236" y="13" width="62" height="76" fill={PAPER} stroke="none" />
          <rect x="236" y="13" width="62" height="76" fill="currentColor" fillOpacity={T.faint} strokeWidth="1.8" />
          <rect x="242" y="20" width="50" height="7" fill="currentColor" fillOpacity={T.mid} />
          <rect x="242" y="32" width="30" height="16" strokeWidth="1.2" />
          <circle cx="249" cy="40" r="3.5" fill="currentColor" fillOpacity={T.mid} strokeWidth="1.1" />
          <path d="M255 38h13M255 42h8" strokeWidth="1.1" />
          <rect x="275" y="35" width="17" height="10" rx="5" strokeWidth="1.2" />
          <circle cx="287" cy="40" r="3.4" fill="currentColor" fillOpacity={T.dark} stroke="none" />
          <rect x="242" y="54" width="20" height="9" strokeWidth="1.2" />
          <rect x="265" y="54" width="16" height="9" rx="2" fill="currentColor" fillOpacity={T.dark} />
          <rect x="284" y="55" width="7" height="7" rx="1" strokeWidth="1.2" />
          <path d="M242 71h50M242 77h34M242 83h42" strokeWidth="1" />
          {/* the pegs */}
          {[245, 289].map((x) => (
            <rect key={x} x={x - 2} y="7" width="4" height="12" rx="1" fill="currentColor" fillOpacity={T.dark} strokeWidth="1.3" />
          ))}
        </g>

        {/* the imposing stone */}
        <Solid points={pts(at(STONE, 96, 0), at(STONE, 96, 60), at(STONE, 96, 60, -10), at(STONE, 96, 0, -10))} tone={T.mid} weight={2.4} />
        <rect x={STONE[0]} y={STONE[1]} width="96" height="10" fill={PAPER} stroke="none" />
        <rect x={STONE[0]} y={STONE[1]} width="96" height="10" fill="currentColor" fillOpacity={T.light} strokeWidth="2.4" />
        <g transform={flat(STONE)} className="art-flat">
          <rect width="96" height="60" fill={PAPER} stroke="none" />
          <rect width="96" height="60" fill="currentColor" fillOpacity={T.faint} strokeWidth="2.4" />
        </g>

        {/* The chase, far bars first so the type can stand in front of them. */}
        <Sort o={STONE} u={3} v={53} w={90} d={4} h={5} weight={1.6} />
        <Sort o={STONE} u={3} v={7} w={4} d={46} h={5} weight={1.6} />

        {/* the page as set so far, back row first */}
        <Sort o={STONE} u={9} v={39} w={63} d={12} g="nav" />
        <Sort o={STONE} u={9} v={24} w={35} d={13} g="card" />
        <Sort o={STONE} u={46} v={24} w={26} d={13} g="toggle" />
        <Sort o={STONE} u={9} v={9} w={23} d={12} g="field" />

        {/* The piece being set. Three wrappers, three motions, so each keeps its
            own timing: lifted clear, carried across, dropped in. On the way back
            the lift and the drop unwind together and cancel out, so the sort
            slides home level instead of bobbing. Its shadow travels with the
            carry but not the lift, which is what sells the height. */}
        <g {...shift(`translate(${dx}px, ${dy}px)`, { dur: 640, delay: 170, ease: "cubic-bezier(0.65, 0, 0.35, 1)" })}>
          <polygon
            points={pts(at(CASE, PIECE.u, PIECE.v), at(CASE, PIECE.u + PIECE.w, PIECE.v), at(CASE, PIECE.u + PIECE.w, PIECE.v + PIECE.d), at(CASE, PIECE.u, PIECE.v + PIECE.d))}
            fill="currentColor"
            fillOpacity={T.mid}
            stroke="none"
          />
          <g {...shift(`translateY(${-LIFT}px)`, { dur: 260 })}>
            <g {...shift(`translateY(${LIFT}px)`, { dur: 230, delay: 780, ease: "cubic-bezier(0.55, 0, 1, 0.45)" })}>
              <Sort o={CASE} u={PIECE.u} v={PIECE.v} w={PIECE.w} d={PIECE.d} g="button" weight={1.6} />
            </g>
          </g>
        </g>

        <Sort o={STONE} u={56} v={9} w={16} d={12} g="check" />

        <Sort o={STONE} u={QUOIN.u} v={QUOIN.v} w={QUOIN.w} d={QUOIN.d} h={QUOIN.h} weight={1.4} />
        {/* The key. It turns a quarter once the last piece is in: the forme is
            locked up, and nothing in it moves again. */}
        <g transform={flat(STONE, QUOIN.h)} className="art-flat">
          <g {...shift("rotate(90deg)", { dur: 320, delay: 1060 })}>
            <rect x={key.u - 7} y={key.v - 1.6} width="14" height="3.2" rx="1.6" fill="currentColor" fillOpacity={T.dark} strokeWidth="1.2" />
          </g>
          <circle cx={key.u} cy={key.v} r="2" fill={PAPER} strokeWidth="1.2" />
        </g>

        {/* the chase's near bars */}
        <Sort o={STONE} u={89} v={7} w={4} d={46} h={5} weight={1.6} />
        <Sort o={STONE} u={3} v={3} w={90} d={4} h={5} weight={1.6} />
      </g>

      <g className="art-marks">
        {/* the piece's route, traced as it goes */}
        <path {...mark(1)} d="M64 66C108 16 206 38 236 134m-8-6l8 6 2-10" />
        {/* the key turned: locked up */}
        <path {...mark(15)} d={arcOn(STONE, QUOIN.h + 1, key.u, key.v, 11, 200, 280)} />
        {/* and the proof passed */}
        <path {...mark(18)} d="M281 68l5 6 11-14" />
      </g>
    </>
  );
}
