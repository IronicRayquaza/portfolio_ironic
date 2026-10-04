import { T } from "./tokens";

/**
 * Axonometric projection for the 3D plates.
 *
 * Every scene picks its own camera — the axes x and y are given as the screen
 * vectors one world unit along each projects to, and z always runs straight up
 * the page. Picking different axes per plate is deliberate: a set of drawings
 * all on the same 30° grid reads as a template, not as seven photographs.
 *
 * This is geometry only. What a scene is *of* is drawn in its own file.
 */

export type Pt = [number, number];

const r2 = (n: number) => +n.toFixed(2);

export type Axo = ReturnType<typeof axo>;

export function axo(origin: Pt, ex: Pt, ey: Pt) {
  const at = (x: number, y: number, z = 0): Pt => [
    r2(origin[0] + x * ex[0] + y * ey[0]),
    r2(origin[1] + x * ex[1] + y * ey[1] - z),
  ];

  // Which way round a face facing the camera winds once projected. The top of
  // anything is always seen, so it sets the sign every other face is held to.
  const up = Math.sign(area([at(0, 0), at(1, 0), at(1, 1), at(0, 1)]));

  return {
    at,
    up,
    ex,
    ey,
    /** Local (x, y) laid flat at height z. */
    floor: (z = 0) => `matrix(${ex[0]} ${ex[1]} ${ey[0]} ${ey[1]} ${origin[0]} ${r2(origin[1] - z)})`,
    /**
     * Local (x, down) on the upright plane y = y0, whose local origin sits at
     * height `top`. Down runs down the page, so an image drawn the usual way up
     * stands the right way up on the wall.
     */
    wallY: (y0: number, top: number) => {
      const [ox, oy] = at(0, y0, top);
      return `matrix(${ex[0]} ${ex[1]} 0 1 ${ox} ${oy})`;
    },
    /** Local (y, down) on the upright plane x = x0. */
    wallX: (x0: number, top: number) => {
      const [ox, oy] = at(x0, 0, top);
      return `matrix(${ey[0]} ${ey[1]} 0 1 ${ox} ${oy})`;
    },
  };
}

export function pts(...p: Pt[]) {
  return p.map(([x, y]) => `${x},${y}`).join(" ");
}

function area(p: Pt[]) {
  let a = 0;
  for (let i = 0; i < p.length; i++) {
    const [x1, y1] = p[i];
    const [x2, y2] = p[(i + 1) % p.length];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}

/** Convex hull, for the silhouette of anything round. */
function hull(points: Pt[]): Pt[] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Pt[] = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
    lower.push(q);
  }
  const upper: Pt[] = [];
  for (const q of p.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
    upper.push(q);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

export const PAPER = "var(--color-paper-bright)";

/** A surface that hides whatever is behind it, then takes its tone. */
export function Face({ points, tone, weight }: { points: string; tone: number; weight?: number }) {
  return (
    <>
      <polygon points={points} fill={PAPER} stroke="none" />
      <polygon points={points} fill="currentColor" fillOpacity={tone} strokeWidth={weight} />
    </>
  );
}

/**
 * A box, drawn as the faces the camera can see and no others — worked out from
 * the projection, so the same component is right under every scene's camera.
 * Light comes from the upper left: the top is palest, the side turned left is
 * lit, the side turned right is in shade.
 */
export function Block({
  p,
  x,
  y,
  z,
  w,
  d,
  h,
  weight = 1.4,
  tones = [T.faint, T.light, T.mid],
  children,
}: {
  p: Axo;
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  weight?: number;
  /** top, lit side, shaded side */
  tones?: readonly [number, number, number];
  /** Drawn on the top face, in its own (x, y) coordinates. */
  children?: React.ReactNode;
}) {
  const [x1, y1, z1] = [x + w, y + d, z + h];
  const sides: Pt[][] = [
    [p.at(x1, y, z), p.at(x1, y1, z), p.at(x1, y1, z1), p.at(x1, y, z1)], // +x
    [p.at(x, y, z), p.at(x, y, z1), p.at(x, y1, z1), p.at(x, y1, z)], // -x
    [p.at(x, y1, z), p.at(x, y1, z1), p.at(x1, y1, z1), p.at(x1, y1, z)], // +y
    [p.at(x, y, z), p.at(x1, y, z), p.at(x1, y, z1), p.at(x, y, z1)], // -y
  ];
  const seen = sides.filter((f) => Math.sign(area(f)) === p.up);
  const cx = (f: Pt[]) => f.reduce((s, q) => s + q[0], 0) / f.length;
  const lit = seen.length > 1 ? (cx(seen[0]) < cx(seen[1]) ? 0 : 1) : 0;

  return (
    <g strokeWidth={weight}>
      {seen.map((f, i) => (
        <Face key={i} points={pts(...f)} tone={i === lit ? tones[1] : tones[2]} />
      ))}
      <g transform={p.floor(z1)} className="art-flat">
        <rect x={x} y={y} width={w} height={d} fill={PAPER} stroke="none" />
        <rect x={x} y={y} width={w} height={d} fill="currentColor" fillOpacity={tones[0]} />
        {children}
      </g>
    </g>
  );
}

/** Points round a horizontal circle, projected. */
export function ring(p: Axo, cx: number, cy: number, z: number, r: number, n = 40): Pt[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return p.at(cx + r * Math.cos(a), cy + r * Math.sin(a), z);
  });
}

/** An upright cylinder: its silhouette, then its top. */
export function Cylinder({
  p,
  cx,
  cy,
  z,
  r,
  h,
  weight = 1.4,
  tones = [T.faint, T.light],
  children,
}: {
  p: Axo;
  cx: number;
  cy: number;
  z: number;
  r: number;
  h: number;
  weight?: number;
  /** top, side */
  tones?: readonly [number, number];
  /** Drawn on the top face, in world (x, y). */
  children?: React.ReactNode;
}) {
  const body = hull([...ring(p, cx, cy, z, r), ...ring(p, cx, cy, z + h, r)]);

  return (
    <g strokeWidth={weight}>
      <Face points={pts(...body)} tone={tones[1]} />
      <Face points={pts(...ring(p, cx, cy, z + h, r))} tone={tones[0]} />
      {children && (
        <g transform={p.floor(z + h)} className="art-flat">
          {children}
        </g>
      )}
    </g>
  );
}

/** A pen stroke from a to b, bowed through two control points, with its arrowhead. */
export function curve(a: Pt, c1: Pt, c2: Pt, b: Pt) {
  const len = Math.hypot(b[0] - c2[0], b[1] - c2[1]) || 1;
  const [ux, uy] = [(b[0] - c2[0]) / len, (b[1] - c2[1]) / len];
  const wing = (side: number): Pt => [r2(b[0] - ux * 7 + side * uy * 5), r2(b[1] - uy * 7 - side * ux * 5)];
  const [w1, w2] = [wing(1), wing(-1)];
  return `M${a[0]} ${a[1]}C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${b[0]} ${b[1]}M${w1[0]} ${w1[1]}L${b[0]} ${b[1]}L${w2[0]} ${w2[1]}`;
}

/** A pen stroke along points, for marks that have to sit on a projected surface. */
export function path(p: Pt[], closed = false) {
  return `M${p.map(([x, y]) => `${x} ${y}`).join("L")}${closed ? "Z" : ""}`;
}
