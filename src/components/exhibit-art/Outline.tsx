import { T, mark, steps } from "./tokens";

/**
 * Healers Healthcare — the chalk outline, laid along the frame so the figure
 * fills a 16:9 canvas, with the patient file padlocked shut on the chest.
 */

/**
 * Body silhouette: head left, feet right, limbs splayed symmetrically about
 * y = 88. Closed so it can carry a fill.
 */
const BODY =
  "M78 70L100 66L118 22L134 27L118 74L200 78L258 52L266 65L212 88L266 111L258 124L200 98L118 102L134 149L118 154L100 110L78 106Z";

export function Outline() {
  return (
    <>
      <g className="art-base">
        {/* floor tiles */}
        <rect x="0" y="0" width="320" height="180" fill="currentColor" fillOpacity={T.faint} />
        {steps(4, 46, 44).map((y) => (
          <path key={y} d={`M0 ${y}h320`} strokeWidth="1" strokeOpacity="0.45" />
        ))}
        {steps(4, 62, 76).map((x) => (
          <path key={x} d={`M${x} 0v180`} strokeWidth="1" strokeOpacity="0.45" />
        ))}

        {/* the outline: filled faintly, chalked in a broken line */}
        <circle cx="56" cy="88" r="23" fill="currentColor" fillOpacity={T.light} />
        <path d={BODY} fill="currentColor" fillOpacity={T.light} />
        <circle cx="56" cy="88" r="23" strokeWidth="3" strokeDasharray="13 5" />
        <path d={BODY} strokeWidth="3" strokeDasharray="13 5" />

        {/* patient file, padlocked, resting on the chest */}
        <g transform="rotate(-6 152 88)">
          <rect x="122" y="62" width="62" height="50" fill="currentColor" fillOpacity={T.mid} />
          <rect x="122" y="62" width="62" height="50" />
          <path d="M122 74h62" strokeWidth="1.4" />
          {/* the cross that names it medical */}
          <path d="M148 82h10v9h9v10h-9v9h-10v-9h-9V91h9z" fill="currentColor" fillOpacity={T.dark} />
          <path d="M148 82h10v9h9v10h-9v9h-10v-9h-9V91h9z" strokeWidth="1.4" />
        </g>

        {/* padlock clasping the file shut */}
        <rect x="196" y="76" width="30" height="24" rx="3" fill="currentColor" fillOpacity={T.dark} />
        <rect x="196" y="76" width="30" height="24" rx="3" />
        <path d="M203 76v-7a8 8 0 0 1 16 0v7" strokeWidth="2.4" />
        <circle cx="211" cy="87" r="3.5" fill="currentColor" fillOpacity={T.faint} />

        {/* numbered marker beside the scene */}
        <path d="M270 160h26l-6-32h-14z" fill="currentColor" fillOpacity={T.light} />
        <path d="M270 160h26l-6-32h-14z" />
        <path d="M281 154v-20l-5 4" strokeWidth="2.4" />
      </g>

      <g className="art-marks">
        <ellipse {...mark(0)} cx="211" cy="88" rx="30" ry="26" />
        <path {...mark(1)} d="M40 30h24M52 18v24" />
        <path {...mark(2)} d="M240 122l24 20" />
      </g>
    </>
  );
}
