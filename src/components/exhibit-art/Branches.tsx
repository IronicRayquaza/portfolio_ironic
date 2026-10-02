import { T, beat, mark } from "./tokens";

/**
 * Oleidian — a pull request on a design file. The same frame twice, before and
 * after, each with its layer name on a tab; in the right-hand copy the button
 * has grown and carries Figma's selection handles, which is the property change
 * the review is about. Underneath, the commit rail the review sits on.
 *
 * The annotation is the review itself: read the diff across the gutter, ring
 * what changed, trace the branch that carried it, and approve.
 */

/** One frame, drawn twice — only the button's width and weight differ. */
function Frame({ x, wide }: { x: number; wide: boolean }) {
  const buttonWidth = wide ? 72 : 48;

  return (
    <g>
      {/* layer name tab */}
      <rect x={x} y="32" width="46" height="9" fill="currentColor" fillOpacity={T.mid} />
      <rect x={x} y="32" width="46" height="9" />

      <rect x={x} y="41" width="136" height="98" fill="currentColor" fillOpacity={T.faint} />
      <rect x={x} y="41" width="136" height="98" strokeWidth="2.4" />

      {/* header band, avatar, two lines of copy */}
      <rect x={x + 8} y="49" width="120" height="14" fill="currentColor" fillOpacity={T.mid} />
      <circle cx={x + 24} cy="84" r="12" fill="currentColor" fillOpacity={T.light} />
      <circle cx={x + 24} cy="84" r="12" />
      <path d={`M${x + 44} 78h76`} strokeWidth="1.4" />
      <path d={`M${x + 44} 88h56`} strokeWidth="1.2" />

      {/* The component under review. In the changed copy this group carries the
          grow: `art-diff` scales it from the width it had on the base branch up
          to this one, so hovering the exhibit plays the property change rather
          than just labelling it. `non-scaling-stroke` keeps the outline an even
          weight while the box is mid-scale — without it the vertical edges thin
          out to two thirds and the button looks like it is made of two
          different pens. */}
      <g className={wide ? "art-diff" : undefined}>
        <rect
          x={x + 8}
          y="108"
          width={buttonWidth}
          height="16"
          rx="2"
          fill="currentColor"
          fillOpacity={wide ? T.dark : T.mid}
        />
        <rect
          x={x + 8}
          y="108"
          width={buttonWidth}
          height="16"
          rx="2"
          vectorEffect={wide ? "non-scaling-stroke" : undefined}
        />
      </g>

      {/* selection handles — only the changed copy is selected. They land after
          the resize settles, which is the order the editor does it in. */}
      {wide &&
        (
          [
            [x + 8, 108],
            [x + 8 + buttonWidth, 108],
            [x + 8, 124],
            [x + 8 + buttonWidth, 124],
          ] as const
        ).map(([hx, hy], i) => (
          <rect
            key={`${hx}-${hy}`}
            className="art-handle"
            style={{ "--m": i } as React.CSSProperties}
            x={hx - 3}
            y={hy - 3}
            width="6"
            height="6"
            fill="currentColor"
            fillOpacity={T.faint}
            strokeWidth="1.6"
          />
        ))}

      <path d={`M${x + 8} 133h100`} strokeWidth="1.2" />
    </g>
  );
}

export function Branches() {
  return (
    <>
      <g className="art-base">
        {/* the pull request header: branch glyph, title, reviewers, status */}
        <path d="M15 8v12" strokeWidth="1.6" />
        <circle cx="15" cy="7" r="3" fill="currentColor" fillOpacity={T.dark} />
        <circle cx="15" cy="21" r="3" fill="currentColor" fillOpacity={T.dark} />
        <circle cx="27" cy="14" r="3" fill="currentColor" fillOpacity={T.dark} />
        <path d="M15 20c0-5 5-6 9-6" strokeWidth="1.6" />

        <rect x="38" y="10" width="110" height="8" fill="currentColor" fillOpacity={T.mid} />

        <circle cx="166" cy="14" r="6" fill="currentColor" fillOpacity={T.light} />
        <circle cx="166" cy="14" r="6" />
        <circle cx="180" cy="14" r="6" fill="currentColor" fillOpacity={T.light} />
        <circle cx="180" cy="14" r="6" />

        {/* The commit control, pressed once the new element has settled into the
            changed frame. Wrapped so the press scales the whole pill rather than
            its parts. */}
        <g className="art-press" style={{ "--delay": "1.2s" } as React.CSSProperties}>
          <rect x="250" y="6" width="56" height="16" rx="8" fill="currentColor" fillOpacity={T.light} />
          <rect x="250" y="6" width="56" height="16" rx="8" />
          <circle cx="261" cy="14" r="3" fill="currentColor" fillOpacity={T.dark} />
          <rect x="269" y="10" width="29" height="8" fill="currentColor" fillOpacity={T.mid} />
        </g>

        {/* before and after, split by the review gutter */}
        <Frame x={14} wide={false} />
        <Frame x={170} wide />
        <path d="M160 36v108" strokeDasharray="4 4" strokeWidth="1.4" />

        {/* the commit rail the pull request sits on */}
        <path d="M14 156h292" strokeWidth="2.4" />
        {/* Commits are not evenly spaced in time, and the newest one is the only
            thing on this rail that moves: it lands when the review does. The
            other three already happened. */}
        {[52, 104, 168, 244].map((cx) => (
          <g key={cx} {...(cx === 244 ? beat("art-pop", 0) : {})}>
            <circle cx={cx} cy="156" r="5" fill="currentColor" fillOpacity={cx === 244 ? T.light : T.dark} />
            <circle cx={cx} cy="156" r="5" />
          </g>
        ))}
      </g>

      <g className="art-marks">
        {/* read the diff across the gutter, ring the change, approve */}
        <path {...mark(0)} d="M152 92h16m-6-5l6 5-6 5" />
        <ellipse {...mark(1)} cx="214" cy="116" rx="50" ry="18" />
        <path {...mark(3)} d="M228 14l5 6 11-14" />
        {/* The history, drawn last and deliberately late — it is what the commit
            press produces, so it has to arrive after it. The line threads every
            dot on the rail rather than arcing over them: a branch that misses
            its own commits is a decoration, not a graph. */}
        <path
          {...mark(20)}
          d="M38 156C58 146 78 166 104 156 130 146 148 166 168 156 196 144 222 168 244 156"
        />
      </g>
    </>
  );
}
