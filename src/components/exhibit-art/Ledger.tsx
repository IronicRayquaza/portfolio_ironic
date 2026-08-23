import { T, mark, steps } from "./tokens";

/**
 * CapCraft — an open ledger on a desk, coins counted beside it. Follow the money.
 */
export function Ledger() {
  const rules = steps(7, 48, 14);
  /** Entry bars, varied so the page reads as handwriting rather than a table. */
  const entries: Record<number, [number, number][]> = {
    0: [[36, 52]],
    1: [[36, 68], [128, 22]],
    2: [[36, 44]],
    3: [[36, 74], [128, 22]],
    4: [[36, 38]],
    5: [[36, 60], [128, 22]],
  };

  return (
    <>
      <g className="art-base">
        {/* desk surface */}
        <rect x="0" y="150" width="320" height="30" fill="currentColor" fillOpacity={T.faint} />
        <path d="M0 150h320" strokeWidth="1.4" />

        {/* book block — the pages seen edge-on give the book weight */}
        <path d="M22 156l16-10h216l16 10z" fill="currentColor" fillOpacity={T.mid} />
        <path d="M22 156l16-10h216l16 10z" />

        {/* the two open pages */}
        <path d="M38 146V34l112 8v104z" fill="currentColor" fillOpacity={T.faint} />
        <path d="M38 146V34l112 8v104z" />
        <path d="M266 146V34l-112 8v104z" fill="currentColor" fillOpacity={T.faint} />
        <path d="M266 146V34l-112 8v104z" />
        {/* spine */}
        <path d="M150 42v104M154 42v104" strokeWidth="1.4" />

        {/* ruled lines and the column rule on each page */}
        {rules.map((y) => (
          <g key={y} strokeWidth="1.2">
            <path d={`M48 ${y + 4}h94`} />
            <path d={`M162 ${y}h94`} />
          </g>
        ))}
        <path d="M124 46v96M234 42v96" strokeWidth="1.2" />

        {/* written entries */}
        {Object.entries(entries).map(([row, bars]) =>
          bars.map(([x, w], i) => (
            <rect
              key={`${row}-${i}`}
              x={x + (x > 100 ? 26 : 12)}
              y={rules[Number(row)] - 4 + (x > 100 ? 0 : 4)}
              width={w}
              height="5"
              fill="currentColor"
              fillOpacity={T.mid}
            />
          )),
        )}
        {/* the ruled-off total on the right page */}
        <path d="M162 132h94M162 136h94" strokeWidth="1.6" />
        <rect x="188" y="120" width="46" height="6" fill="currentColor" fillOpacity={T.dark} />

        {/* coin stack */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <ellipse
              cx="292"
              cy={140 - i * 9}
              rx="22"
              ry="7"
              fill="currentColor"
              fillOpacity={i === 3 ? T.light : T.mid}
            />
            <ellipse cx="292" cy={140 - i * 9} rx="22" ry="7" />
          </g>
        ))}
        <path d="M282 110v-4M292 108v-6M302 110v-4" strokeWidth="1.4" />

        {/* pen resting across the desk */}
        <path d="M40 168l52-14" strokeWidth="4" />
        <path d="M92 154l14-4-10 9z" fill="currentColor" fillOpacity={T.dark} />
      </g>

      <g className="art-marks">
        <ellipse {...mark(0)} cx="210" cy="123" rx="42" ry="14" />
        <path {...mark(1)} d="M160 148h100" />
        <path {...mark(2)} d="M160 154h100" />
        <path {...mark(3)} d="M268 118l24-14" />
      </g>
    </>
  );
}
