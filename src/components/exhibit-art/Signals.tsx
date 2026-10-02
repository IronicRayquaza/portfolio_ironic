import { T, beat, mark } from "./tokens";

/**
 * Unify — the always-on-top widget sitting over the desk, with four services
 * scattered around it. The red pen is what the product does: hover and every
 * source runs into the one window, which is the difference between four apps
 * and one.
 */

/** Waveform bar heights, centred on the widget's midline. */
const WAVE = [10, 18, 26, 14, 30, 22, 12, 28, 18, 24, 10, 20];

/** Each service card and the stroke that runs from it into the widget. */
const SOURCES: { x: number; y: number; from: string }[] = [
  { x: 16, y: 20, from: "M62 40L98 72" },
  { x: 262, y: 16, from: "M260 36L250 74" },
  { x: 20, y: 112, from: "M66 128L98 118" },
  { x: 266, y: 110, from: "M264 126L252 114" },
];

function Card({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width="44" height="34" fill="currentColor" fillOpacity={T.faint} />
      <rect x={x} y={y} width="44" height="34" />
      {children}
    </g>
  );
}

export function Signals() {
  return (
    <>
      <g className="art-base">
        {/* the desk the widget floats over — tonal band only, so it grounds the
            scene instead of reading as a second empty frame under the widget */}
        <rect x="0" y="160" width="320" height="20" fill="currentColor" fillOpacity={T.faint} stroke="none" />
        <path d="M0 160h320" strokeWidth="1.4" />

        {/* the four services */}
        <Card x={SOURCES[0].x} y={SOURCES[0].y}>
          {/* a disc */}
          <circle cx="38" cy="37" r="11" fill="currentColor" fillOpacity={T.mid} />
          <circle cx="38" cy="37" r="11" />
          <circle cx="38" cy="37" r="3" />
        </Card>
        <Card x={SOURCES[1].x} y={SOURCES[1].y}>
          {/* a play triangle */}
          <path d="M278 25l15 8-15 8z" fill="currentColor" fillOpacity={T.mid} />
          <path d="M278 25l15 8-15 8z" />
        </Card>
        <Card x={SOURCES[2].x} y={SOURCES[2].y}>
          {/* a cloud */}
          <path
            d="M32 138a7 7 0 0 1 2-13 9 9 0 0 1 17 2 6 6 0 0 1 1 11z"
            fill="currentColor"
            fillOpacity={T.mid}
          />
          <path d="M32 138a7 7 0 0 1 2-13 9 9 0 0 1 17 2 6 6 0 0 1 1 11z" />
        </Card>
        <Card x={SOURCES[3].x} y={SOURCES[3].y}>
          {/* a note */}
          <circle cx="280" cy="134" r="6" fill="currentColor" fillOpacity={T.mid} />
          <circle cx="280" cy="134" r="6" />
          <path d="M286 134v-18l12 4" />
        </Card>

        {/* the widget — the offset block behind it is what makes it float */}
        <rect x="104" y="64" width="152" height="76" fill="currentColor" fillOpacity={T.mid} />
        <rect x="98" y="58" width="152" height="76" fill="currentColor" fillOpacity={T.faint} />
        <rect x="98" y="58" width="152" height="76" strokeWidth="2.4" />

        {/* title bar */}
        <rect x="98" y="58" width="152" height="14" fill="currentColor" fillOpacity={T.mid} />
        <path d="M98 72h152" strokeWidth="1.4" />
        <circle cx="107" cy="65" r="2.5" fill="currentColor" fillOpacity={T.dark} />
        <circle cx="115" cy="65" r="2.5" fill="currentColor" fillOpacity={T.dark} />

        {/* the waveform */}
        {WAVE.map((h, i) => (
          <rect
            key={i}
            {...beat("art-meter", i)}
            x={108 + i * 11}
            y={96 - h / 2}
            width="5"
            height={h}
            fill="currentColor"
            fillOpacity={i === 4 || i === 7 ? T.dark : T.mid}
          />
        ))}

        {/* transport row */}
        <path d="M144 116v12" strokeWidth="2" />
        <path d="M156 116l-10 6 10 6z" fill="currentColor" fillOpacity={T.dark} />
        <path d="M168 115l13 7-13 7z" fill="currentColor" fillOpacity={T.dark} />
        <path d="M193 116l10 6-10 6z" fill="currentColor" fillOpacity={T.dark} />
        <path d="M205 116v12" strokeWidth="2" />
      </g>

      <g className="art-marks">
        {SOURCES.map((s, i) => (
          <path key={i} {...mark(i)} d={s.from} />
        ))}
        <ellipse {...mark(4)} cx="174" cy="96" rx="92" ry="48" />
      </g>
    </>
  );
}
