import { T, mark, steps } from "./tokens";

/**
 * Damascus — a print card on the bench under a glass, with the ink pad it came
 * from. Wallet ownership lifted and filed as identity.
 */
export function Fingerprint() {
  /** Concentric whorl ridges. Enough of them to read as a real print. */
  const ridges = steps(7, 14, 7);

  return (
    <>
      <g className="art-base">
        {/* the ten-print card */}
        <rect x="14" y="16" width="150" height="150" fill="currentColor" fillOpacity={T.faint} />
        <rect x="14" y="16" width="150" height="150" />
        <rect x="14" y="16" width="150" height="24" fill="currentColor" fillOpacity={T.mid} />
        <rect x="14" y="16" width="150" height="24" />
        <path d="M24 50h60M24 58h40" strokeWidth="1.2" />

        {/* the print itself: a filled pad with ridge lines carved over it */}
        <ellipse cx="89" cy="104" rx="52" ry="44" fill="currentColor" fillOpacity={T.light} />
        {ridges.map((r, i) => (
          <g key={r}>
            <path
              d={`M${89 - r * 1.18} 104a${r * 1.18} ${r} 0 0 1 ${r * 2.36} 0`}
              strokeWidth={i % 2 ? 1.2 : 1.6}
            />
            <path
              d={`M${89 - r * 1.1} 108a${r * 1.1} ${r * 0.82} 0 0 0 ${r * 2.2} 0`}
              strokeWidth={i % 2 ? 1.2 : 1.6}
            />
          </g>
        ))}
        {/* the core, and a delta to the left */}
        <ellipse cx="89" cy="104" rx="7" ry="5" fill="currentColor" fillOpacity={T.dark} />
        <path d="M46 96l10 8-10 8" strokeWidth="1.4" />
        <ellipse cx="89" cy="104" rx="52" ry="44" />
        <path d="M28 156h122" strokeWidth="1.2" />

        {/* magnifier, angled over the card's right edge */}
        <circle cx="228" cy="74" r="46" fill="currentColor" fillOpacity={T.faint} />
        <circle cx="228" cy="74" r="46" strokeWidth="4" />
        <circle cx="228" cy="74" r="39" strokeWidth="1.2" />
        {/* ridges magnified inside the glass */}
        {steps(4, 12, 11).map((r) => (
          <path
            key={r}
            d={`M${228 - r * 1.5} 82a${r * 1.5} ${r * 1.2} 0 0 1 ${r * 3} 0`}
            strokeWidth="2"
          />
        ))}
        {/* glare */}
        <path d="M204 46a34 34 0 0 0-14 22" strokeWidth="2" />
        <path d="M258 108l40 44" strokeWidth="9" />
        <path d="M292 146l16 18" strokeWidth="13" />

        {/* ink pad and roller, bottom right */}
        <rect x="186" y="140" width="58" height="26" rx="3" fill="currentColor" fillOpacity={T.mid} />
        <rect x="186" y="140" width="58" height="26" rx="3" />
        <rect x="192" y="146" width="46" height="14" fill="currentColor" fillOpacity={T.dark} />
      </g>

      <g className="art-marks">
        <circle {...mark(0)} cx="228" cy="74" r="26" />
        <path {...mark(1)} d="M228 20v22M228 106v22" />
        <path {...mark(2)} d="M176 74h22M258 74h22" />
        <path {...mark(3)} d="M96 176l44-18" />
      </g>
    </>
  );
}
