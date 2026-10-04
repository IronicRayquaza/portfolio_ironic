import { T, feed, mark, shift } from "./tokens";
import { Cylinder, PAPER, axo, curve, path, pts, type Pt } from "./axo";

/**
 * Solana Statistics — a stock ticker under its glass bell on a pedestal, and the
 * newsroom spike beside it. The spike holds what a wallet is before an indexer
 * gets to it: slips of signatures, impaled in the order they came. The ticker
 * is the indexer, and its tape is the history made readable — letters and
 * figures in entries, not hash.
 *
 * Hover sets it running: the reel pays out, the type wheel turns, and the
 * printed tape runs out of the bell, down the column and across the floor.
 *
 * Camera: low and almost square to the room, the floor falling away gently to
 * the right — the ticker is a tall thing and gets a camera that shows height.
 */

const p = axo([72, 122], [0.95, 0.12], [-0.45, 0.38]);

/** The pedestal stands on the origin; the spike to its left. */
const S = { x: -50, y: 2 };
const TOP = 46;

/** Where the tape leaves the works and where it meets the floor. */
const SLOT = { x: 17, y: 8 };

/** The print on the tape, as dash lengths: letters, word spaces, a wider gap between entries. */
const PRINT = [1.6, 1, 2.4, 1, 1.6, 1, 1.6, 3.2, 2.4, 1, 1.6, 1, 2.4, 1, 1.6, 3.2, 1.6, 1, 1.6, 6];
const REPEAT = PRINT.reduce((a, b) => a + b, 0);

/** The run across the floor, in floor coordinates — it lies flat, so it foreshortens. */
const FLOOR_TAPE =
  "M17 8C30 26 56 24 76 14C100 2 112 30 132 26C156 20 158 -12 140 -12C124 -12 124 16 146 28C160 36 172 40 186 44";

function hull(points: Pt[]): Pt[] {
  const q = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [];
  for (const k of q) {
    while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], k) <= 0) lo.pop();
    lo.push(k);
  }
  const hi: Pt[] = [];
  for (const k of q.reverse()) {
    while (hi.length >= 2 && cross(hi[hi.length - 2], hi[hi.length - 1], k) <= 0) hi.pop();
    hi.push(k);
  }
  return [...lo.slice(0, -1), ...hi.slice(0, -1)];
}

/** The bell: glass, straight-sided and domed, sitting in its brass band. */
function Bell() {
  const r = 19;
  const base = TOP + 8;
  const shoulder = TOP + 20;
  const glass: Pt[] = [];
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    glass.push(p.at(r * Math.cos(a), r * Math.sin(a), base));
    for (let j = 0; j <= 6; j++) {
      const phi = (j / 6) * (Math.PI / 2);
      glass.push(p.at(r * Math.cos(phi) * Math.cos(a), r * Math.cos(phi) * Math.sin(a), shoulder + r * Math.sin(phi)));
    }
  }
  const [a, b, c] = [p.at(-12, 4, TOP + 14), p.at(-14, 2, TOP + 28), p.at(-6, -2, TOP + 34)];

  return (
    <>
      <polygon points={pts(...hull(glass))} fill={PAPER} fillOpacity={0.3} strokeWidth="1.6" />
      {/* the shine on the glass */}
      <path d={`M${a[0]} ${a[1]}Q${b[0]} ${b[1]} ${c[0]} ${c[1]}`} stroke={PAPER} strokeWidth="2.2" />
    </>
  );
}

/** A slip on the spike: hash in rows, no words in it anywhere. */
function Slip({ z, turn }: { z: number; turn: number }) {
  return (
    <g transform={p.floor(z)}>
      <g transform={`translate(${S.x} ${S.y}) rotate(${turn})`}>
        <rect x="-16" y="-10" width="32" height="20" fill={PAPER} strokeWidth="1.2" />
        <path
          d="M-12 -5h4m2 0h6m2 0h3m2 0h4M-12 0h7m2 0h3m2 0h6M-12 5h3m2 0h5m2 0h8"
          strokeWidth="1.1"
          strokeOpacity="0.7"
        />
      </g>
    </g>
  );
}

function Spike() {
  const slips = [
    [5, -14],
    [9, 22],
    [13, -2],
    [17, 31],
    [21, 9],
    [25, -24],
  ] as const;
  const needle = (z0: number, z1: number) => {
    const [a, b] = [p.at(S.x, S.y, z0), p.at(S.x, S.y, z1)];
    return <path d={`M${a[0]} ${a[1]}V${b[1]}`} strokeWidth="1.6" />;
  };

  return (
    <>
      <Cylinder p={p} cx={S.x} cy={S.y} z={0} r={12} h={4} tones={[T.mid, T.dark]} />
      {slips.map(([z, turn], i) => (
        <g key={z}>
          {needle(i ? slips[i - 1][0] : 4, z)}
          <Slip z={z} turn={turn} />
        </g>
      ))}
      {needle(25, 46)}
    </>
  );
}

export function Ticker() {
  const fall = [p.at(SLOT.x, SLOT.y, TOP + 10), p.at(SLOT.x, SLOT.y, 0)];
  const wheel = p.at(6, 2, TOP + 18);
  // A ring lying on the floor round one entry of the tape.
  const ringed = Array.from({ length: 41 }, (_, i): Pt => {
    const a = (i / 40) * Math.PI * 2;
    const [cx, cy, rx, ry, turn] = [98, 9, 18, 8, -0.25];
    const [u, v] = [rx * Math.cos(a), ry * Math.sin(a)];
    return p.at(cx + u * Math.cos(turn) - v * Math.sin(turn), cy + u * Math.sin(turn) + v * Math.cos(turn), 0);
  });

  return (
    // Centred on the plate and brought up to fill it.
    <g transform="translate(160 92) scale(1.25) translate(-128 -100)">
      <g className="art-base">
        {/* the pedestal's shadow, thrown right across the floor */}
        <g transform={p.floor(0)}>
          <ellipse cx="10" cy="6" rx="26" ry="22" fill="currentColor" fillOpacity={T.faint} stroke="none" />
        </g>

        <Spike />

        {/* The tape on the floor. Paper with an inked edge, then its print,
            which runs on hover by a whole number of repeats — so leaving can
            drop it back with no transition, and nothing visibly rewinds. */}
        <g transform={p.floor(0)}>
          <path d={FLOOR_TAPE} strokeWidth="8" />
          <path d={FLOOR_TAPE} stroke={PAPER} strokeWidth="6" />
          <path
            d={FLOOR_TAPE}
            strokeWidth="2.8"
            strokeLinecap="butt"
            strokeDasharray={PRINT.join(" ")}
            strokeOpacity="0.8"
            {...feed(-REPEAT * 6, { dur: 1700, delay: 200 })}
          />
        </g>

        {/* the pedestal: a weighted foot, a column, the capital */}
        <Cylinder p={p} cx={0} cy={0} z={0} r={17} h={6} tones={[T.light, T.dark]} weight={1.8} />
        <Cylinder p={p} cx={0} cy={0} z={6} r={6} h={TOP - 14} tones={[T.light, T.mid]} weight={1.6} />
        <Cylinder p={p} cx={0} cy={0} z={TOP - 8} r={12} h={4} tones={[T.light, T.mid]} weight={1.6} />

        {/* the tape falling from the slot to the floor */}
        <path d={`M${fall[0][0]} ${fall[0][1]}V${fall[1][1]}`} strokeWidth="7" />
        <path d={`M${fall[0][0]} ${fall[0][1]}V${fall[1][1]}`} stroke={PAPER} strokeWidth="5" strokeLinecap="butt" />
        <path
          d={`M${fall[0][0]} ${fall[0][1]}V${fall[1][1]}`}
          strokeWidth="2.4"
          strokeLinecap="butt"
          strokeDasharray={PRINT.join(" ")}
          strokeOpacity="0.8"
          {...feed(-REPEAT * 3, { dur: 1700, delay: 120 })}
        />

        {/* the plinth, and the brass band the glass sits in */}
        <Cylinder p={p} cx={0} cy={0} z={TOP - 4} r={25} h={8} tones={[T.light, T.mid]} weight={2} />
        <Cylinder p={p} cx={0} cy={0} z={TOP + 4} r={20} h={4} tones={[T.mid, T.dark]} weight={1.6} />

        {/* the works: the paper reel lying flat, the type wheel upright */}
        <g transform={p.floor(TOP + 9)} className="art-flat">
          <g transform="translate(-7 -5)">
            <g {...shift("rotate(-720deg)", { dur: 1700, delay: 120, snap: true, pivot: true })}>
              <circle r="9" fill={PAPER} strokeWidth="1.3" />
              <circle r="9" fill="currentColor" fillOpacity={T.light} strokeWidth="1.3" />
              {[0, 60, 120].map((a) => (
                <path key={a} d="M-9 0H9" transform={`rotate(${a})`} strokeWidth="1" />
              ))}
              <circle r="2.6" fill="currentColor" fillOpacity={T.dark} stroke="none" />
            </g>
          </g>
        </g>
        <g transform={`translate(${wheel[0]} ${wheel[1]})`}>
          {/* Upright and seen nearly edge-on: squashed along its own axis, and
              spun inside that squash so the teeth travel round the rim. */}
          <g transform="rotate(7) scale(0.5 1)">
            <g {...shift("rotate(1080deg)", { dur: 1700, delay: 120, snap: true, pivot: true })}>
              <circle r="9" fill={PAPER} strokeWidth="2.6" />
              {Array.from({ length: 12 }, (_, i) => (
                <path key={i} d="M0 -9V-5" transform={`rotate(${i * 30})`} strokeWidth="2.4" />
              ))}
              <circle r="2.8" fill="currentColor" fillOpacity={T.dark} stroke="none" />
            </g>
          </g>
        </g>

        <Bell />
      </g>

      <g className="art-marks">
        {/* the slips go in */}
        <path {...mark(0)} d={curve(p.at(S.x + 6, S.y, 44), [30, 50], [42, 40], p.at(-20, 0, TOP + 18))} />
        {/* and a line of it comes out readable */}
        <path {...mark(13)} d={path(ringed)} />
        <path {...mark(16)} d={`M${p.at(108, -6, 0)[0]} ${p.at(108, -6, 0)[1] - 16}l5 6 11-14`} />
      </g>
    </g>
  );
}
