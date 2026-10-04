import { T, mark, shift } from "./tokens";
import { Block, Cylinder, PAPER, axo, curve, path, ring, type Pt } from "./axo";

/**
 * Unify — a reel-to-reel deck of the kind a wiretap is recorded on, with four
 * lines patched into it. Four services come in on four channels, through four
 * faders, onto one tape. The two reels are two libraries: the tape runs off
 * one and winds onto the other, which is a playlist migrating between services
 * without anyone rebuilding it by hand.
 *
 * Hover opens the four channels, presses play, and the deck runs: the faders
 * come up one after another, the meters kick, the reels turn, and the pack of
 * tape shrinks on the left reel as it grows on the right.
 *
 * Camera: from the front and to the right, the deck's width running down
 * toward the reader — the only plate looked at from that side.
 */

const p = axo([40, 100], [0.9, 0.3], [0.55, -0.45]);

const DECK = { w: 150, d: 90, h: 26 };
const H = DECK.h;
const REELS = [
  { x: 38, y: 58 },
  { x: 112, y: 58 },
] as const;
const FLANGE = 25;
const PACK = { full: 18, low: 9 };

/** One reel: the flange, the wound pack, a three-spoke hub. */
function Reel({ x, y, pack, grow }: { x: number; y: number; pack: number; grow: number }) {
  return (
    <>
      <Cylinder p={p} cx={x} cy={y} z={H} r={FLANGE} h={2} tones={[T.faint, T.mid]} weight={1.4} />
      <g transform={p.floor(H + 2)} className="art-flat">
        {/* the pack, wound on or paid out about the reel's own centre */}
        <g transform={`translate(${x} ${y})`}>
          <g {...shift(`scale(${grow})`, { dur: 1500, delay: 460, ease: "cubic-bezier(0.45, 0, 0.55, 1)", pivot: true })}>
            <circle r={pack} fill="currentColor" fillOpacity={T.dark} strokeWidth="1.2" />
            <circle r={pack * 0.82} fill="none" strokeWidth="0.6" strokeOpacity="0.6" />
          </g>
          <g {...shift("rotate(720deg)", { dur: 1500, delay: 460, ease: "cubic-bezier(0.45, 0, 0.55, 1)", snap: true, pivot: true })}>
            {/* the hub, with the three keyways that drive it */}
            <circle r="7" fill={PAPER} strokeWidth="1.3" />
            {[0, 120, 240].map((a) => (
              <rect key={a} x="-1.3" y="-7.6" width="2.6" height="3.4" fill="currentColor" stroke="none" transform={`rotate(${a})`} />
            ))}
            <circle r="2.6" fill={PAPER} strokeWidth="1" />
          </g>
        </g>
      </g>
    </>
  );
}

/** A level meter on the front panel: a window, its scale, a needle on a pivot. */
function Meter({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y="6" width="20" height="13" rx="1.5" fill={PAPER} strokeWidth="1.2" />
      <path d={`M${x + 4} 14a6 6 0 0 1 12 0`} strokeWidth="0.8" />
      <path d={`M${x + 13.5} 10.4l1.2 -1.4`} strokeWidth="1.2" />
      <g transform={`translate(${x + 10} 17)`}>
        <g {...shift("rotate(62deg)", { from: "rotate(0deg)", dur: 380, delay: 470, ease: "cubic-bezier(0.34, 1.56, 0.64, 1)", pivot: true })}>
          <path d="M0 0L-6.5 -6" strokeWidth="1" />
        </g>
      </g>
    </g>
  );
}

export function Deck() {
  // The tape's path over the deck: off the left pack, round a guide, across the
  // head, round the other guide, onto the right pack.
  const tape = "M52 46L58 22L75 14L92 22L98 46";
  const lines: Pt[][] = [18, 34, 50, 66].map((y, i) => {
    const jack = p.at(DECK.w, y, H - 13);
    const floor = p.at(DECK.w + 26 + i * 8, y - 18 + i * 6, 0);
    const end = p.at(DECK.w + 60 + i * 4, y - 34 + i * 12, 0);
    return [jack, floor, end];
  });

  // A ring drawn on the front panel itself, round the four faders.
  const faders = Array.from({ length: 40 }, (_, i): Pt => {
    const a = (i / 40) * Math.PI * 2;
    return p.at(27 + 26 * Math.cos(a), 0, H - 12 - 11 * Math.sin(a));
  });

  return (
    // Centred on the plate and brought up to fill it.
    <g transform="translate(160 92) scale(1.12) translate(-162 -100)">
      <g className="art-base">
        {/* its shadow on the desk */}
        <g transform={p.floor(0)}>
          <rect x="6" y="-8" width={DECK.w} height={DECK.d} fill="currentColor" fillOpacity={T.faint} stroke="none" />
        </g>

        <Block p={p} x={0} y={0} z={0} w={DECK.w} d={DECK.d} h={H} weight={2.4}>
          {/* the transport plate the reels sit on */}
          <rect x="6" y="28" width={DECK.w - 12} height={DECK.d - 34} rx="3" strokeWidth="1" />
        </Block>

        {/* The front panel: four channel faders, then the two meters. Drawn on
            the face itself, so a fader moving "up" moves up that face. */}
        <g transform={p.wallY(0, H)} className="art-flat">
          {[10, 21, 32, 43].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 6V21`} strokeWidth="1.8" />
              <g {...shift("translateY(-12px)", { dur: 360, delay: i * 70 })}>
                <rect x={x - 3.5} y="18" width="7" height="3.4" rx="0.8" fill={PAPER} strokeWidth="1.2" />
                <rect x={x - 3.5} y="18" width="7" height="3.4" rx="0.8" fill="currentColor" fillOpacity={T.dark} strokeWidth="1.2" />
              </g>
            </g>
          ))}
          <Meter x={58} />
          <Meter x={82} />
        </g>

        {/* The input panel on the right side: four jacks, four lines in. */}
        <g transform={p.wallX(DECK.w, H)} className="art-flat">
          {[18, 34, 50, 66].map((y) => (
            <g key={y}>
              <circle cx={y} cy="13" r="3.4" fill={PAPER} strokeWidth="1.3" />
              <circle cx={y} cy="13" r="1.4" fill="currentColor" stroke="none" />
            </g>
          ))}
        </g>
        {lines.map(([jack, floor, end], i) => (
          <g key={i}>
            <path d={`M${jack[0]} ${jack[1]}C${jack[0] + 10} ${jack[1] + 2} ${floor[0] - 8} ${floor[1]} ${floor[0]} ${floor[1]}S${end[0] - 10} ${end[1]} ${end[0]} ${end[1]}`} strokeWidth="2.2" />
            <rect x={end[0] - 1} y={end[1] - 2.5} width="9" height="5" rx="1.5" fill="currentColor" fillOpacity={T.dark} strokeWidth="1.2" transform={`rotate(${-10 + i * 6} ${end[0]} ${end[1]})`} />
          </g>
        ))}

        {/* the head block and its two tape guides, between the reels */}
        <Block p={p} x={66} y={8} z={H} w={18} d={10} h={6} tones={[T.light, T.mid, T.dark]} weight={1.3} />
        <Cylinder p={p} cx={58} cy={22} z={H} r={2.4} h={7} tones={[T.light, T.mid]} weight={1.2} />
        <Cylinder p={p} cx={92} cy={22} z={H} r={2.4} h={7} tones={[T.light, T.mid]} weight={1.2} />

        {/* the transport keys along the front edge; play goes down */}
        {[0, 1, 2, 3, 4].map((i) => {
          const key = <Block p={p} x={104 + i * 8.6} y={3} z={H} w={7.6} d={14} h={3} tones={[T.faint, T.light, T.mid]} weight={1.1} />;
          return i === 2 ? (
            <g key={i} {...shift("translateY(2px)", { dur: 140, delay: 330 })}>
              {key}
            </g>
          ) : (
            <g key={i}>{key}</g>
          );
        })}

        <Reel x={REELS[0].x} y={REELS[0].y} pack={PACK.full} grow={PACK.low / PACK.full} />
        <Reel x={REELS[1].x} y={REELS[1].y} pack={PACK.low} grow={PACK.full / PACK.low} />

        {/* the tape itself, threaded over the top of everything on the plate */}
        <g transform={p.floor(H + 4)} className="art-flat">
          <path d={tape} strokeWidth="2.2" />
        </g>
      </g>

      <g className="art-marks">
        {/* all four channels open */}
        <path {...mark(5)} d={path(faders, true)} />
        {/* and one library runs onto the other */}
        <path {...mark(12)} d={curve(p.at(REELS[0].x, REELS[0].y, H + 26), p.at(REELS[0].x + 20, REELS[0].y, H + 46), p.at(REELS[1].x - 20, REELS[1].y, H + 46), p.at(REELS[1].x - 4, REELS[1].y, H + 28))} />
        <path {...mark(16)} d={path(ring(p, REELS[1].x, REELS[1].y, H + 3, FLANGE + 6), true)} />
      </g>
    </g>
  );
}
