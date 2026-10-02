import { T, beat, mark } from "./tokens";

/**
 * ArDacity UI — the visual builder. A component palette on the left, a canvas in
 * the middle where those components are actually assembled, and the permaweb
 * block stack on the right holding the result. The annotation is the workflow:
 * drag a component in, and the composition is written to storage that cannot rot.
 *
 * Every glyph in the palette is the real control it stands for — a button, a
 * switch, a slider, a field — so the scene reads as a component library rather
 * than as generic boxes.
 */

/** Where the palette's dividers fall, separating one component from the next. */
const PALETTE_RULES = [58, 90, 122];

export function Archive() {
  return (
    <>
      <g className="art-base">
        {/* the component palette */}
        <rect x="12" y="18" width="56" height="144" fill="currentColor" fillOpacity={T.faint} />
        <rect x="12" y="18" width="56" height="144" strokeWidth="2.4" />
        <rect x="12" y="18" width="56" height="12" fill="currentColor" fillOpacity={T.mid} />
        {PALETTE_RULES.map((y) => (
          <path key={y} d={`M12 ${y}h56`} strokeWidth="1.2" />
        ))}

        {/* a button */}
        <rect x="22" y="38" width="36" height="12" rx="2" fill="currentColor" fillOpacity={T.dark} />
        {/* a switch, thrown on */}
        <rect x="24" y="68" width="30" height="12" rx="6" fill="currentColor" fillOpacity={T.light} />
        <rect x="24" y="68" width="30" height="12" rx="6" strokeWidth="1.4" />
        <circle cx="48" cy="74" r="4.5" fill="currentColor" fillOpacity={T.dark} />
        {/* a slider */}
        <path d="M22 105h36" strokeWidth="1.6" />
        <circle cx="44" cy="105" r="5" fill="currentColor" fillOpacity={T.dark} />
        <circle cx="44" cy="105" r="5" strokeWidth="1.4" />
        {/* a text field, with its caret */}
        <rect x="22" y="131" width="36" height="14" strokeWidth="1.4" />
        <path d="M28 134v8" strokeWidth="1.4" />

        {/* the canvas, named like a frame */}
        <rect x="80" y="8" width="50" height="10" fill="currentColor" fillOpacity={T.mid} />
        <rect x="80" y="8" width="50" height="10" />
        <rect x="80" y="18" width="176" height="144" fill="currentColor" fillOpacity={T.faint} />
        <rect x="80" y="18" width="176" height="144" strokeWidth="2.4" />

        {/* what has been assembled on it: a nav, a card, a switch row, a slider */}
        <rect x="88" y="26" width="160" height="14" fill="currentColor" fillOpacity={T.mid} />

        <rect x="88" y="48" width="160" height="54" fill="currentColor" fillOpacity={T.light} />
        <rect x="88" y="48" width="160" height="54" />
        <circle cx="106" cy="66" r="10" fill="currentColor" fillOpacity={T.mid} />
        <circle cx="106" cy="66" r="10" />
        <path d="M124 62h72" strokeWidth="1.4" />
        <path d="M124 72h52" strokeWidth="1.2" />
        {/* The deploy control. Pressed once the dragged component has landed on
            it — the two rects are wrapped so the press scales the whole button
            rather than its fill and its outline separately. */}
        <g className="art-press" style={{ "--delay": "1.02s" } as React.CSSProperties}>
          <rect x="124" y="82" width="48" height="13" rx="2" fill="currentColor" fillOpacity={T.dark} />
          <rect x="124" y="82" width="48" height="13" rx="2" strokeWidth="1.4" />
        </g>

        <rect x="88" y="112" width="34" height="14" rx="7" fill="currentColor" fillOpacity={T.light} />
        <rect x="88" y="112" width="34" height="14" rx="7" strokeWidth="1.4" />
        <circle cx="114" cy="119" r="5" fill="currentColor" fillOpacity={T.dark} />
        <path d="M130 119h44" strokeWidth="1.2" />

        <path d="M88 144h96" strokeWidth="1.6" />
        <circle cx="152" cy="144" r="6" fill="currentColor" fillOpacity={T.dark} />
        <circle cx="152" cy="144" r="6" strokeWidth="1.4" />

        <rect x="192" y="110" width="56" height="44" fill="currentColor" fillOpacity={T.faint} />
        <rect x="192" y="110" width="56" height="44" />
        <path d="M200 120h40M200 130h28M200 140h40" strokeWidth="1.2" />

        {/* the permaweb: three blocks, chained, each carrying its hash */}
        <rect x="264" y="84" width="44" height="8" fill="currentColor" fillOpacity={T.mid} />
        {[
          [100, T.light, 14],
          [124, T.mid, 22],
          [148, T.light, 18],
        ].map(([y, tone, bar], i) => (
          <g key={y as number}>
            <rect x="264" y={y as number} width="44" height="18" fill="currentColor" fillOpacity={tone as number} />
            <rect x="264" y={y as number} width="44" height="18" />
            {/* The hash, written block by block — the blocks themselves hold
                still, because they are chained to one another. Offset well down
                the stagger so the writing starts only after the deploy has been
                pressed: the order on screen is drag, drop, deploy, stored. */}
            <rect
              {...beat("art-wave", i + 18)}
              x="270"
              y={(y as number) + 6}
              width={bar as number}
              height="5"
              fill="currentColor"
              fillOpacity={T.dark}
            />
          </g>
        ))}
        <path d="M286 118v6M286 142v6" strokeWidth="1.6" />

        {/* The component being carried across: a copy of the palette's button,
            drawn last so it travels over the canvas rather than under it. It is
            invisible except while the drag is playing, so the scene still reads
            as finished at rest. Offsets are the gap between the palette button's
            middle and the deploy control's. */}
        <g
          className="art-drag"
          style={
            { "--dx": "108px", "--dy": "44.5px", "--dur": "1.05s" } as React.CSSProperties
          }
        >
          <rect x="22" y="38" width="36" height="12" rx="2" fill="currentColor" fillOpacity={T.mid} />
          <rect x="22" y="38" width="36" height="12" rx="2" strokeWidth="1.6" />
        </g>
      </g>

      <g className="art-marks">
        {/* drag the button out of the palette and onto the card */}
        <path {...mark(0)} d="M60 44C96 40 100 74 120 84m-8-3l8 3-3 8" />
        <ellipse {...mark(1)} cx="148" cy="89" rx="34" ry="14" />
        {/* and the whole composition goes to storage, permanently */}
        <path {...mark(2)} d="M252 128h10m-5-5l5 5-5 5" />
        <path {...mark(3)} d="M272 109l4 5 9-11" />
      </g>
    </>
  );
}
