import { T, beat, mark, steps } from "./tokens";

/**
 * Uni Hub — a cork board of participants and passes. The red string is the
 * annotation: hovering wires the network together, which is what the platform
 * does with events, sponsors and attendees.
 */

/** Pin heads, in the order the string runs through them. */
const PINS = [
  [62, 40],
  [148, 34],
  [252, 44],
  [160, 96],
  [58, 116],
  [258, 128],
] as const;

function Portrait({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="56" height="62" fill="currentColor" fillOpacity={T.faint} />
      <rect x={x} y={y} width="56" height="62" />
      {/* head and shoulders, filled so it reads at a glance */}
      <circle cx={x + 28} cy={y + 24} r="11" fill="currentColor" fillOpacity={T.mid} />
      <path
        d={`M${x + 10} ${y + 56}a18 16 0 0 1 36 0z`}
        fill="currentColor"
        fillOpacity={T.mid}
      />
      <path d={`M${x + 10} ${y + 56}a18 16 0 0 1 36 0`} />
      <circle cx={x + 28} cy={y + 24} r="11" />
    </g>
  );
}

export function Pinboard() {
  return (
    <>
      <g className="art-base">
        {/* the board and its frame */}
        <rect x="8" y="10" width="304" height="160" fill="currentColor" fillOpacity={T.faint} />
        <rect x="8" y="10" width="304" height="160" strokeWidth="3" />
        {[
          [18, 20],
          [302, 20],
          [18, 160],
          [302, 160],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="currentColor" fillOpacity={T.dark} />
        ))}

        <Portrait x={34} y={44} />
        <Portrait x={120} y={38} />

        {/* index card, top right */}
        <rect x="216" y="48" width="76" height="46" fill="currentColor" fillOpacity={T.light} />
        <rect x="216" y="48" width="76" height="46" />
        {steps(4, 58, 9).map((y) => (
          <path key={y} d={`M224 ${y}h${y === 85 ? 34 : 60}`} strokeWidth="1.2" />
        ))}

        {/* certificate with a rosette — the NFT the platform mints */}
        <rect x="34" y="120" width="88" height="44" fill="currentColor" fillOpacity={T.light} />
        <rect x="34" y="120" width="88" height="44" />
        <path d="M44 130h44M44 138h56M44 146h32" strokeWidth="1.2" />
        {/* the seal is struck on hover — the moment the certificate is minted */}
        <g {...beat("art-pop")}>
          <circle cx="104" cy="142" r="10" fill="currentColor" fillOpacity={T.dark} />
          <circle cx="104" cy="142" r="10" />
          <path d="M98 151l-4 12 10-5 10 5-4-12" fill="currentColor" fillOpacity={T.mid} />
          <path d="M98 151l-4 12 10-5 10 5-4-12" />
        </g>

        {/* event pass, tilted, with a tear-off stub */}
        <g transform="rotate(-5 176 128)">
          <rect x="136" y="104" width="80" height="42" fill="currentColor" fillOpacity={T.light} />
          <rect x="136" y="104" width="80" height="42" />
          <path d="M192 104v42" strokeDasharray="4 4" strokeWidth="1.4" />
          <rect x="144" y="112" width="40" height="7" fill="currentColor" fillOpacity={T.mid} />
          <path d="M144 128h40M144 136h26" strokeWidth="1.2" />
        </g>

        {/* pinned note, bottom right */}
        <rect x="230" y="106" width="62" height="58" fill="currentColor" fillOpacity={T.light} />
        <rect x="230" y="106" width="62" height="58" />
        {steps(5, 120, 10).map((y) => (
          <path key={y} d={`M238 ${y}h${y === 160 ? 24 : 46}`} strokeWidth="1.2" />
        ))}

        {/* pin heads sit above everything they hold */}
        {PINS.map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="6" fill="currentColor" fillOpacity={T.dark} />
            <circle cx={cx} cy={cy} r="6" />
            <circle cx={cx - 2} cy={cy - 2} r="1.6" fill="currentColor" fillOpacity={T.faint} />
          </g>
        ))}
      </g>

      <g className="art-marks">
        {PINS.map(([x, y], i) => {
          const next = PINS[(i + 1) % PINS.length];
          return <path key={i} {...mark(i)} d={`M${x} ${y}L${next[0]} ${next[1]}`} />;
        })}
      </g>
    </>
  );
}
