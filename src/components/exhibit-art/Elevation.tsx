import { T, mark, steps } from "./tokens";

/**
 * Chandigarh University, Lucknow — the campus drawn as a surveyor's elevation
 * on the left, the site it became on the right. Everything on the left is
 * mirrored about x=79: tower, frontispiece, windows and colonnade all share one
 * axis, because an elevation that isn't symmetrical reads as a mistake rather
 * than a drawing. The browser's hero carries a miniature of the same silhouette,
 * so the two halves are visibly the same building.
 */

/** The axis the whole elevation is built around. */
const AXIS = 79;

/** Upper-storey windows, two per wing, mirrored about the axis. */
const WINDOWS = [22, 42, 104, 124];

/** Colonnade piers, three per wing — the centre bay is the entrance, not a pier. */
const PIERS = [21, 35, 49, 102, 116, 130];

/** Three cards in a row inside the viewport. */
const CARDS = steps(3, 174, 46);

/** The dome, drawn twice — filled, then struck. */
const DOME = "M64 40a15 13 0 0 1 30 0";
/** The arched entrance inside the frontispiece. */
const DOOR = "M69 146v-20a10 10 0 0 1 20 0v20";

export function Elevation() {
  return (
    <>
      <defs>
        {/* The browser's viewport. The page inside scrolls on hover, and a page
            that isn't clipped simply slides out through the chrome. */}
        <clipPath id="elevation-screen">
          <rect x="168" y="40" width="144" height="118" />
        </clipPath>
      </defs>

      <g className="art-base">
        {/* the drawing sheet — ruled both ways, faint enough to sit under the
            drawing rather than compete with it */}
        <rect x="0" y="0" width="320" height="180" fill="currentColor" fillOpacity={T.faint} />
        {steps(6, 14, 28).map((y) => (
          <path key={`h${y}`} d={`M0 ${y}h320`} strokeWidth="1" strokeOpacity="0.22" />
        ))}
        {steps(11, 16, 28).map((x) => (
          <path key={`v${x}`} d={`M${x} 0v180`} strokeWidth="1" strokeOpacity="0.22" />
        ))}

        {/* ─────────── the campus, in elevation ─────────── */}

        {/* finial, dome, clock tower */}
        <path d={`M${AXIS} 27v-9`} strokeWidth="1.6" />
        <path d={DOME} fill="currentColor" fillOpacity={T.dark} />
        <path d={DOME} strokeWidth="2.4" />
        <rect x="64" y="40" width="30" height="38" fill="currentColor" fillOpacity={T.mid} />
        <rect x="64" y="40" width="30" height="38" strokeWidth="2.4" />
        <circle cx={AXIS} cy="57" r="9" fill="currentColor" fillOpacity={T.faint} />
        <circle cx={AXIS} cy="57" r="9" strokeWidth="1.4" />
        <path d={`M${AXIS} 51v6h5`} strokeWidth="1.4" />

        {/* Entablature stops at x=148, short of the viewport at 168. The marks
            live in that gap, and a mark landing on a hard edge reads as one long
            stroke rather than two annotations. */}
        <rect x="10" y="78" width="138" height="8" fill="currentColor" fillOpacity={T.dark} />
        <rect x="10" y="78" width="138" height="8" strokeWidth="1.6" />

        {/* the body */}
        <rect x="16" y="86" width="126" height="60" fill="currentColor" fillOpacity={T.light} />
        <rect x="16" y="86" width="126" height="60" strokeWidth="2.4" />

        {/* upper-storey windows, wings only */}
        {WINDOWS.map((x) => (
          <rect
            key={x}
            x={x}
            y="92"
            width="12"
            height="16"
            fill="currentColor"
            fillOpacity={T.dark}
          />
        ))}
        <path d="M16 114h126" strokeWidth="1.2" strokeOpacity="0.5" />

        {/* colonnade along the ground floor of each wing */}
        {PIERS.map((x) => (
          <rect
            key={x}
            x={x}
            y="114"
            width="7"
            height="32"
            fill="currentColor"
            fillOpacity={T.mid}
            strokeWidth="1.2"
          />
        ))}

        {/* the centre bay projects forward: one block from cornice to plinth,
            carrying the arched entrance and a rose window above it */}
        <rect x="64" y="86" width="30" height="60" fill="currentColor" fillOpacity={T.mid} />
        <rect x="64" y="86" width="30" height="60" strokeWidth="2.4" />
        <circle cx={AXIS} cy="100" r="6" fill="currentColor" fillOpacity={T.faint} />
        <circle cx={AXIS} cy="100" r="6" strokeWidth="1.4" />
        <path d={DOOR} fill="currentColor" fillOpacity={T.dark} />
        <path d={DOOR} strokeWidth="1.6" />

        {/* plinth, and the steps widening down from the entrance */}
        <path d="M6 146h148" strokeWidth="2.4" />
        {steps(3, 150, 4).map((y, i) => (
          <path
            key={y}
            d={`M${AXIS - 22 - i * 8} ${y}h${44 + i * 16}`}
            strokeWidth="1.4"
          />
        ))}

        {/* the overall dimension, ticked at both ends — it is a survey drawing */}
        <path d="M16 164h126" strokeWidth="1.2" strokeOpacity="0.6" />
        <path d="M16 160v8M142 160v8" strokeWidth="1.2" strokeOpacity="0.6" />

        {/* ─────────── the site it became ─────────── */}

        <rect x="168" y="26" width="144" height="132" fill="currentColor" fillOpacity={T.faint} />
        <rect x="168" y="26" width="144" height="132" strokeWidth="2.4" />

        {/* chrome: traffic lights and an address bar */}
        <rect x="168" y="26" width="144" height="14" fill="currentColor" fillOpacity={T.mid} />
        <path d="M168 40h144" strokeWidth="1.4" />
        {steps(3, 176, 10).map((x) => (
          <circle key={x} cx={x} cy="33" r="2.6" fill="currentColor" fillOpacity={T.dark} />
        ))}
        <rect
          x="206"
          y="29"
          width="96"
          height="8"
          rx="4"
          fill="currentColor"
          fillOpacity={T.faint}
          strokeWidth="1"
        />

        {/* Everything below the chrome is the page itself, so it travels
            together when the site scrolls. */}
        <g clipPath="url(#elevation-screen)">
        <g className="art-scroll">

        {/* hero: the same silhouette, sold as a photograph */}
        <rect x="174" y="46" width="132" height="40" fill="currentColor" fillOpacity={T.mid} />
        <g fill="currentColor" fillOpacity={T.dark}>
          <rect x="210" y="76" width="22" height="10" />
          <rect x="248" y="76" width="22" height="10" />
          <path d="M232 70a8 7 0 0 1 16 0" />
          <rect x="232" y="70" width="16" height="16" />
        </g>
        <path d="M182 56h54" strokeWidth="3" />
        <path d="M182 64h34" strokeWidth="1.6" strokeOpacity="0.7" />
        <path d="M174 86h132" strokeWidth="1.2" />

        {/* section heading */}
        <path d="M174 94h74" strokeWidth="2.4" />
        <path d="M174 101h48" strokeWidth="1.2" strokeOpacity="0.6" />

        {/* a row of cards, each with its own thumbnail */}
        {CARDS.map((x) => (
          <g key={x}>
            <rect x={x} y="108" width="40" height="30" fill="currentColor" fillOpacity={T.light} />
            <rect x={x} y="108" width="40" height="12" fill="currentColor" fillOpacity={T.mid} />
            <rect x={x} y="108" width="40" height="30" strokeWidth="1.4" />
            <path d={`M${x + 5} 126h30`} strokeWidth="1.2" strokeOpacity="0.6" />
            <path d={`M${x + 5} 132h18`} strokeWidth="1.2" strokeOpacity="0.4" />
          </g>
        ))}

        {/* footer */}
        <rect x="174" y="146" width="132" height="8" fill="currentColor" fillOpacity={T.mid} />

        {/* more of the page, waiting under the fold — this is what the scroll
            brings into view, and why the motion reads as a page and not a jolt */}
        <path d="M174 164h110" strokeWidth="1.2" strokeOpacity="0.55" />
        <path d="M174 171h74" strokeWidth="1.2" strokeOpacity="0.4" />

        </g>
        </g>
      </g>

      <g className="art-marks">
        {/* the building is the hero */}
        <ellipse {...mark(0)} cx="240" cy="66" rx="70" ry="25" />
        {/* and this is where it goes */}
        <path {...mark(1)} d="M152 66h13m-6-6l6 6-6 6" />
        <path {...mark(2)} d="M152 136l4 5 9-11" />
      </g>
    </>
  );
}
