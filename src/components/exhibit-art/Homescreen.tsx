import { T, beat, mark, steps } from "./tokens";

/**
 * PokeWidget — the same sprite on two screens. A phone home screen with the
 * widget dropped onto it, and the frameless desktop window that reads the very
 * same generated catalogue. The annotation is that shared catalogue: one source,
 * two runtimes, no argument about what to draw.
 */

/** The creature, drawn in its own 40×44 box and placed at each screen's scale. */
const BODY = "M20 42c-11 0-18-7-18-16S9 10 20 10s18 7 18 16-7 16-18 16z";
const EARS = "M9 14L3 2l13 6zM31 14L37 2l-13 6z";

/**
 * One sprite, wherever it is standing.
 *
 * Tall eyes with a catchlight and no mouth: two round dots over a smile curve
 * is an emoji, and an emoji is the one thing this scene must not look like. A
 * game sprite reads from the eyes alone at this size.
 *
 * The bob sits on a group *outside* the placement transform. Inside it, the
 * translate would be multiplied by the sprite's own scale and the 1.5x desktop
 * sprite would lift half again as far as the one on the phone, tearing off its
 * shadow. Outside, both rise by the same few units. It has to be a separate
 * element either way: a CSS transform on an SVG element replaces that element's
 * `transform` attribute outright rather than composing with it.
 */
function sprite(x: number, y: number, s: number, order: number) {
  return (
    <g {...beat("art-bob", order)}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d={EARS} fill="currentColor" fillOpacity={T.dark} />
        <path d={EARS} strokeWidth={2.4 / s} />
        <path d={BODY} fill="currentColor" fillOpacity={T.mid} />
        <path d={BODY} strokeWidth={2.4 / s} />
        <ellipse cx="13" cy="23" rx="3.2" ry="4.2" fill="currentColor" fillOpacity={T.dark} />
        <ellipse cx="27" cy="23" rx="3.2" ry="4.2" fill="currentColor" fillOpacity={T.dark} />
        <circle cx="14.3" cy="21.2" r="1.2" fill="currentColor" fillOpacity={T.faint} />
        <circle cx="28.3" cy="21.2" r="1.2" fill="currentColor" fillOpacity={T.faint} />
      </g>
    </g>
  );
}

export function Homescreen() {
  return (
    <>
      <g className="art-base">
        <rect x="0" y="0" width="320" height="180" fill="currentColor" fillOpacity={T.faint} />

        {/* ───────────── the phone ───────────── */}
        <rect x="18" y="10" width="108" height="160" rx="12" fill="currentColor" fillOpacity={T.light} />
        <rect x="18" y="10" width="108" height="160" rx="12" strokeWidth="2.4" />

        {/* status bar: clock left, battery right */}
        <path d="M30 22h12" strokeWidth="1.6" />
        <rect x="104" y="18" width="12" height="7" rx="1.5" strokeWidth="1.2" />

        {/* the widget, holding the sprite */}
        <rect x="28" y="36" width="88" height="62" fill="currentColor" fillOpacity={T.faint} />
        <rect x="28" y="36" width="88" height="62" strokeWidth="2" />
        {sprite(53, 42, 0.95, 0)}
        {/* the ground it stands on */}
        <path d="M36 92h72" strokeWidth="1.4" />

        {/* two ordinary app tiles beneath it, for scale */}
        <rect x="28" y="108" width="40" height="40" rx="8" fill="currentColor" fillOpacity={T.mid} />
        <rect x="28" y="108" width="40" height="40" rx="8" strokeWidth="1.4" />
        <rect x="76" y="108" width="40" height="40" rx="8" fill="currentColor" fillOpacity={T.mid} />
        <rect x="76" y="108" width="40" height="40" rx="8" strokeWidth="1.4" />

        {/* the dock */}
        {steps(4, 40, 22).map((x) => (
          <circle key={x} cx={x} cy="160" r="4" fill="currentColor" fillOpacity={T.dark} />
        ))}

        {/* ───────────── the desktop window ───────────── */}
        <rect x="156" y="40" width="150" height="104" fill="currentColor" fillOpacity={T.light} />
        <rect x="156" y="40" width="150" height="104" strokeWidth="2.4" />
        <rect x="156" y="40" width="150" height="14" fill="currentColor" fillOpacity={T.mid} />
        <path d="M156 54h150" strokeWidth="1.4" />
        {steps(3, 166, 11).map((x) => (
          <circle key={x} cx={x} cy="47" r="2.8" fill="currentColor" fillOpacity={T.dark} />
        ))}

        {/* the same creature, larger, on a battlefield */}
        {sprite(206, 62, 1.5, 1)}
        <ellipse cx="236" cy="130" rx="52" ry="9" fill="currentColor" fillOpacity={T.faint} />
        <ellipse cx="236" cy="130" rx="52" ry="9" strokeWidth="1.4" />

        {/* the catalogue both of them read */}
        <rect x="132" y="86" width="18" height="24" fill="currentColor" fillOpacity={T.dark} />
        <rect x="132" y="86" width="18" height="24" strokeWidth="1.4" />
        <path d="M136 92h10M136 98h10M136 104h6" strokeWidth="1.2" strokeOpacity="0.5" />
      </g>

      <g className="art-marks">
        {/* this tile is the product */}
        <ellipse {...mark(0)} cx="72" cy="67" rx="50" ry="36" />
        {/* one catalogue, read by both runtimes */}
        <path {...mark(1)} d="M152 98h14m-5-5l5 5-5 5" />
        <path {...mark(2)} d="M170 130l5 6 11-14" />
      </g>
    </>
  );
}
