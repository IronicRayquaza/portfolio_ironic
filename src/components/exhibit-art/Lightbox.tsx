import { T, mark, shift } from "./tokens";

/**
 * Oleidian — transparencies on a light box, drawn isometric. Each sheet of
 * acetate is one commit of the same frame, and the design builds up through
 * the pile: a header, then an avatar, then copy, then the button. One sheet has
 * been slid half out of the stack: the branch, where the button is wider and
 * still selected.
 *
 * Hover fans the pile into an exploded view, so the history reads as layers
 * the way the product shows it, and the branch slides out level with the head
 * for a side-by-side diff. The red pen is the review: the commit line, the
 * branch leaving it, and the one component it touched ringed on the acetate.
 */

/** Isometric camera. The back corner of a sheet at height z sits at (OX, OY - z). */
const OX = 150;
const OY = 66;
const C = 0.866;
const S = 0.5;

/** One sheet: a landscape frame, top edge running away to the right. */
const W = 88;
const D = 64;

/** Gap between sheets in the pile, and once fanned out. */
const PILED = 5;
const FANNED = 16;
const HEAD = 3;

/** On hover the pile steps left and the branch comes out to the right of it. */
const PILE_SHIFT = -70;
/** The pile alone is short, so at rest the whole scene is lifted to sit centred. */
const REST_LIFT = 14;
const BRANCH_SHIFT = 78;
/** The branch's slide, in the film's own units: one step along x and back along y is straight right on screen. */
const BRANCH_SLIDE = +(BRANCH_SHIFT / (2 * C)).toFixed(2);

const PAPER = "var(--color-paper-bright)";

function iso(x: number, y: number, z = 0): [number, number] {
  return [+(OX + (x - y) * C).toFixed(2), +(OY + (x + y) * S - z).toFixed(2)];
}

/** Lays local sheet coordinates flat at height z. */
function flat(z: number) {
  return `matrix(${C} ${S} ${-C} ${S} ${OX} ${OY - z})`;
}

function pts(...p: [number, number][]) {
  return p.map(([x, y]) => `${x},${y}`).join(" ");
}

/** The frame as it stood at a given commit. */
function Design({ stage, branch = false }: { stage: number; branch?: boolean }) {
  const button = branch ? 50 : 26;

  return (
    <>
      <rect x="5" y="5" width="78" height="8" fill="currentColor" fillOpacity={T.mid} />
      {stage >= 1 && <circle cx="17" cy="28" r="7.5" fill="currentColor" fillOpacity={T.light} />}
      {stage >= 2 && <path d="M30 24h46M30 31h32M6 57h54" strokeWidth="1.1" />}
      {stage >= 3 && (
        <rect x="6" y="42" width={button} height="9" rx="2" fill="currentColor" fillOpacity={T.dark} />
      )}
      {/* The branch's copy is still selected in the editor. */}
      {branch &&
        [
          [6, 42],
          [6 + button, 42],
          [6, 51],
          [6 + button, 51],
        ].map(([x, y]) => (
          <rect
            key={`${x}-${y}`}
            x={x - 1.8}
            y={y - 1.8}
            width="3.6"
            height="3.6"
            fill={PAPER}
            strokeWidth="1.1"
          />
        ))}
    </>
  );
}

/**
 * A sheet of acetate. The ground is only mostly opaque, so whatever is under it
 * ghosts through — the pile reads as film rather than as a stack of cards.
 */
function Sheet({
  z,
  stage,
  weight,
  branch = false,
  flatten = true,
}: {
  z: number;
  stage: number;
  weight: number;
  branch?: boolean;
  /** False when the caller has already laid the sheet flat, to move it within its own plane. */
  flatten?: boolean;
}) {
  return (
    <g transform={flatten ? flat(z) : undefined} className="art-flat" strokeWidth={weight}>
      {/* the frame's name tab, as the editor draws it */}
      <rect x="0" y="-6" width="26" height="6" fill={PAPER} stroke="none" />
      <rect x="0" y="-6" width="26" height="6" fill="currentColor" fillOpacity={T.mid} strokeWidth="1" />

      <rect width={W} height={D} fill={PAPER} fillOpacity={0.8} stroke="none" />
      <rect width={W} height={D} fill="currentColor" fillOpacity={T.faint} />
      <Design stage={stage} branch={branch} />
    </g>
  );
}

/** The commit's node, pinned to the sheet's right-hand corner. */
function Node({ at }: { at: [number, number] }) {
  return (
    <>
      <circle cx={at[0]} cy={at[1]} r="3.4" fill={PAPER} stroke="none" />
      <circle cx={at[0]} cy={at[1]} r="3.4" fill="currentColor" fillOpacity={T.dark} strokeWidth="1.4" />
    </>
  );
}

function LightBox() {
  const top = -3;
  const base = -15;
  const [x0, x1, y0, y1] = [-4, W + 4, -4, D + 4];

  const front = pts(iso(x0, y1, top), iso(x1, y1, top), iso(x1, y1, base), iso(x0, y1, base));
  const side = pts(iso(x1, y0, top), iso(x1, y1, top), iso(x1, y1, base), iso(x1, y0, base));

  return (
    <g>
      <polygon points={front} fill="currentColor" fillOpacity={T.light} strokeWidth="2.4" />
      <polygon points={side} fill="currentColor" fillOpacity={T.mid} strokeWidth="2.4" />
      {/* the switch, on the face toward the reader */}
      <rect x={iso(x0 + 10, y1)[0] - 4} y={iso(x0 + 10, y1, -9)[1] - 1.5} width="8" height="4" rx="1" fill="currentColor" fillOpacity={T.dark} strokeWidth="1.2" />

      <g transform={flat(top)} className="art-flat">
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="currentColor" fillOpacity={T.light} strokeWidth="2.4" />
        {/* the glass, lit from underneath */}
        <rect x={x0 + 3} y={y0 + 3} width={x1 - x0 - 6} height={y1 - y0 - 6} fill={PAPER} strokeWidth="1.2" />
      </g>
    </g>
  );
}

export function Lightbox() {
  const rise = FANNED - PILED;
  const top = HEAD * FANNED;

  // Where the pen writes: everything as it stands once the pile has slid over
  // and the branch has come out.
  const shifted = ([x, y]: [number, number], dx: number): [number, number] => [+(x + dx).toFixed(2), y];
  const head = shifted(iso(W, 0, top), PILE_SHIFT);
  const foot = shifted(iso(W, 0, 0), PILE_SHIFT);
  const fork = shifted(iso(0, D, top), BRANCH_SHIFT);

  // The ring lies on the branch's film, so it is an ellipse in the sheet's own
  // coordinates, projected point by point. Projecting it here rather than with
  // a transform keeps the pen's dash in screen units, where it draws in full.
  const ring = Array.from({ length: 49 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2 - 2.6;
    const [x, y] = shifted(iso(31 + 34 * Math.cos(a), 46.5 + 11 * Math.sin(a), top), BRANCH_SHIFT);
    return `${i ? "L" : "M"}${x} ${y}`;
  }).join("");

  return (
    <>
      <g className="art-base">
        {/* The pile, light box and all, steps aside to make room for the branch.
            At rest it sits a little higher, in the middle of the plate. */}
        <g {...shift(`translate(${PILE_SHIFT}px, 0px)`, { from: `translate(0px, ${-REST_LIFT}px)`, dur: 640 })}>
          <LightBox />

          {/* The history, oldest at the bottom. Each sheet rises by its own
              index, so the pile opens like a fan rather than lifting as a block. */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i} {...shift(`translateY(${-rise * i}px)`, { dur: 560, delay: 60 + i * 50 })}>
              <Sheet z={i * PILED} stage={i} weight={1.4 + i * 0.3} />
              <Node at={iso(W, 0, i * PILED)} />
            </g>
          ))}
        </g>

        {/* The branch. At rest it is a loose sheet dropped askew on top of the
            pile; on hover it lifts to the head's height, squares up and slides
            out alongside it. Height is a screen move; the slide and the turn
            happen in the plane of the film, so they stay isometric. */}
        <g
          {...shift(`translateY(${-(top - (HEAD + 1) * PILED)}px)`, {
            from: `translateY(${-REST_LIFT}px)`,
            dur: 620,
            delay: 120,
          })}
        >
          <g transform={flat((HEAD + 1) * PILED)}>
            <g
              {...shift(`translate(${BRANCH_SLIDE}px, ${-BRANCH_SLIDE}px) rotate(0deg)`, {
                from: "translate(9px, -3px) rotate(-8deg)",
                dur: 760,
                delay: 120,
              })}
            >
              <Sheet z={0} stage={HEAD} weight={2.4} branch flatten={false} />
              {/* its commit node, lying on the film at the corner nearest the pile */}
              <g className="art-flat" strokeWidth="1.4">
                <circle cx="0" cy={D} r="3.6" fill={PAPER} />
                <circle cx="0" cy={D} r="3.6" fill="currentColor" fillOpacity={T.dark} />
              </g>
            </g>
          </g>
        </g>
      </g>

      {/* Late in the stagger, so the pen arrives after the sheets do. */}
      <g className="art-marks">
        {/* one line through every commit on main */}
        <path {...mark(11)} d={`M${foot[0]} ${foot[1]}V${head[1]}`} />
        {/* and the branch leaving the head */}
        <path {...mark(13)} d={`M${head[0]} ${head[1]}C${head[0] + 10} ${head[1]} ${fork[0] - 10} ${fork[1]} ${fork[0]} ${fork[1]}`} />
        {/* the one component it changed, ringed on the film itself */}
        <path {...mark(15)} d={ring} />
        {/* approved */}
        <path {...mark(18)} d="M280 22l5 6 11-14" />
      </g>
    </>
  );
}
