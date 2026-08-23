import { T, mark, steps } from "./tokens";

/**
 * ArDacity UI — a card-catalogue drawer bank with one drawer pulled open,
 * component specimens filed inside. The library lives on the permaweb, so the
 * cabinet is sealed rather than locked.
 */
export function Archive() {
  const drawerRows = steps(3, 38, 42);

  return (
    <>
      <g className="art-base">
        {/* cabinet carcass */}
        <rect x="18" y="24" width="188" height="140" fill="currentColor" fillOpacity={T.faint} />
        <rect x="18" y="24" width="188" height="140" />
        {/* cornice and plinth */}
        <rect x="12" y="16" width="200" height="10" fill="currentColor" fillOpacity={T.mid} />
        <rect x="12" y="16" width="200" height="10" />
        <rect x="14" y="164" width="196" height="10" fill="currentColor" fillOpacity={T.mid} />
        <rect x="14" y="164" width="196" height="10" />

        {/* drawer grid — two columns, three rows */}
        {drawerRows.map((y) =>
          [26, 116].map((x) => (
            <g key={`${x}-${y}`}>
              <rect
                x={x}
                y={y}
                width="82"
                height="34"
                fill="currentColor"
                fillOpacity={T.light}
              />
              <rect x={x} y={y} width="82" height="34" />
              {/* label plate */}
              <rect
                x={x + 8}
                y={y + 7}
                width="34"
                height="12"
                fill="currentColor"
                fillOpacity={T.mid}
              />
              {/* pull handle */}
              <rect
                x={x + 54}
                y={y + 13}
                width="20"
                height="6"
                rx="3"
                fill="currentColor"
                fillOpacity={T.dark}
              />
              <path d={`M${x + 8} ${y + 26}h58`} strokeWidth="1.2" />
            </g>
          )),
        )}

        {/* the open drawer, pulled out to the right */}
        <path
          d="M116 80l64-16v46l-64 16z"
          fill="currentColor"
          fillOpacity={T.light}
        />
        <path d="M116 80l64-16v46l-64 16z" />
        <path d="M180 64l58 8v42l-58 12z" fill="currentColor" fillOpacity={T.faint} />
        <path d="M180 64l58 8v42l-58 12z" />

        {/* component specimens filed upright in the open drawer */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect
              x={188 + i * 13}
              y={54 - i * 2}
              width="10"
              height="40"
              fill="currentColor"
              fillOpacity={i === 1 ? T.mid : T.light}
            />
            <rect x={188 + i * 13} y={54 - i * 2} width="10" height="40" strokeWidth="1.4" />
          </g>
        ))}

        {/* loose specimen card, propped at right: a UI component under glass */}
        <rect x="248" y="66" width="60" height="76" fill="currentColor" fillOpacity={T.faint} />
        <rect x="248" y="66" width="60" height="76" />
        <rect x="248" y="66" width="60" height="14" fill="currentColor" fillOpacity={T.mid} />
        <path d="M256 92h44M256 102h44M256 112h28" strokeWidth="1.4" />
        <rect
          x="256"
          y="122"
          width="30"
          height="12"
          rx="2"
          fill="currentColor"
          fillOpacity={T.dark}
        />

        {/* wax seal hanging off the cornice on a cord */}
        <path d="M240 26v22" strokeWidth="1.4" />
        <circle cx="240" cy="56" r="12" fill="currentColor" fillOpacity={T.dark} />
        <circle cx="240" cy="56" r="12" />
        <path d="M234 56h12M240 50v12" strokeWidth="1.4" />
      </g>

      <g className="art-marks">
        <ellipse {...mark(0)} cx="278" cy="104" rx="40" ry="48" />
        <path {...mark(1)} d="M240 150l28-10" />
        <path {...mark(2)} d="M268 140l-11-2 3 10" />
      </g>
    </>
  );
}
