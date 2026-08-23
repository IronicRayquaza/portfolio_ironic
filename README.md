# The Satyam Singh Times

A portfolio set as a detective broadsheet. Next.js 15, Tailwind v4, no runtime dependencies beyond React.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Editing content

**All copy lives in `src/lib/content.ts`.** Components read from it and never hardcode text, so you can rewrite the whole site without touching a component.

| Export | Controls |
| --- | --- |
| `identity` | Name, role, case number, email, résumé path, portrait |
| `frontPage` | Headline, standfirst, byline, the four dateline boxes |
| `exhibits` | Projects, rendered as Exhibits A–F |
| `papers`, `packages` | Secondary evidence columns |
| `substances` | The Lab Report stack table |
| `caseLog` | Hackathons and competitions |
| `ledger` | Work and education history |
| `wireServices` | Social links |

Add a project by appending to `exhibits` — the exhibit letter, layout and stamp are derived automatically.

### Portrait

The Front Page plate currently shows a placeholder. Drop a photo at `public/images/portrait.jpg` and change `identity.portrait` to `"/images/portrait.jpg"`.

### Résumé

Put your PDF at `public/assets/Resume.pdf` to match `identity.resume`.

## Design system

Tokens are defined once in `src/app/globals.css` under `@theme`, then used as Tailwind utilities (`bg-paper`, `text-ink-soft`, `border-stamp`).

| Token | Value | Role |
| --- | --- | --- |
| `paper` | `#f4f1e9` | Page stock |
| `paper-warm` / `paper-deep` | `#efeadd` / `#e7e0cf` | Hover and fill |
| `paper-bright` | `#fbfaf5` | Inputs, knockout text |
| `ink` | `#16140f` | Body text, rules |
| `ink-soft` | `#45413a` | Secondary text |
| `ink-faint` | `#8b8678` | Labels, metadata |
| `stamp` | `#a6382c` | The one accent — stamps, links, active state |

Type: **Libre Caslon Display** (nameplate), **Libre Caslon Text** (body), **Libre Franklin** (labels), **JetBrains Mono** (codes). Loaded via `next/font`, self-hosted at build time.

## Motion

Every animation is gated behind a `.js-motion` class that an inline script adds to `<html>` before first paint — and only when the visitor has not set `prefers-reduced-motion: reduce`.

This means: **no JS or reduced motion → content is simply visible.** There is nothing to un-hide, so nothing can flash or get stuck invisible.

Use them via `<Reveal variant="…">` or `<RevealWords text="…">` from `src/components/Reveal.tsx`.

| Variant | Motion | Timing |
| --- | --- | --- |
| `settle` | Rises 12px into place | .55s `cubic-bezier(.22,1,.36,1)` |
| `words` | Headline assembles word by word | .45s, 40ms stagger |
| `develop` | Surfaces from `blur(5px) contrast(1.35)` — darkroom paper | .7s ease-out |
| `rule` | Hairline draws left→right via `scaleX` | .6s |
| `stamp` | Slams from `scale(1.5) rotate(-6deg)` | .4s, overshoot |
| `fade` | Opacity only | .5s |

`delay` is in seconds and sets `--rv-delay`.

### Hover

- `.link-pencil` — a hand-drawn wavy underline (inline SVG) wipes in from the left, .3s
- `.press` — `scale(0.96)` on `:active`, disabled under reduced motion
- `.exhibit` — the row warms to `paper-warm` and its arrow slides 4px

### Evidence plates

Each exhibit carries a taped-up evidence photograph (`EvidencePlate.tsx`) holding an illustration specific to that project (`ExhibitArt.tsx`). Hovering the exhibit is *the detective marking up the evidence in red pen*:

- the halftone tints red — two stacked dot layers cross-fade, since a gradient's colour cannot transition
- the drawing shifts from faint ink to red
- red annotation strokes draw themselves in, staggered 70ms apart via `--m`

| Exhibit | Drawing | The red marks |
| --- | --- | --- |
| ArDacity UI | Sealed archive crate | Circle the permanence seal |
| CapCraft | Ledger sheet + coins | Circle the entry, double-underline |
| Uni Hub | Pinboard of pins | String the pins together |
| Damascus | Fingerprint on a card | Crosshair + match circle |
| Solana Statistics | Trail of shoe prints | Dashed line tracing the route |
| Healers Healthcare | Chalk outline + padlock | Circle the lock, medical cross |

The subject is **always visible** at rest — hover only recolours it and adds marks, so nothing is hidden from touch or keyboard users. `:focus-within` gives keyboard parity, and under reduced motion the marks appear without drawing.

Draw-in uses `pathLength="1"`, which normalises every path so one `stroke-dasharray: 1; stroke-dashoffset: 1 → 0` rule animates any shape regardless of its real length.

To add an illustration: add a component to `ExhibitArt.tsx`, register it in the `ART` map, and set `art:` on the exhibit in `content.ts`. Give base strokes no class and annotation strokes `className="art-mark"` with `style={{"--m": n}}`. Everything strokes `currentColor` — never hardcode a colour.

### Tuning

Both easings are single tokens in `globals.css`:

```css
--ease-settle: cubic-bezier(0.22, 1, 0.36, 1);  /* everything that settles */
--ease-stamp:  cubic-bezier(0.34, 1.56, 0.64, 1); /* the overshoot */
```

Stagger lives in one line — `.js-motion .rv-word { transition-delay: calc(var(--rv-delay,0s) + var(--i,0) * 40ms) }`.

To review motion honestly, open DevTools → Animations and replay at 10% speed.

## Accessibility

- Skip link, semantic landmarks, one `h1`, no skipped heading levels
- The Lab Report meter pairs a bar with a text label — strength is never colour-only
- Form errors are tied by `aria-describedby`, set `aria-invalid`, and focus moves to the first failure
- Submit status announced via `role="status"` `aria-live="polite"`
- Focus visible everywhere: 2px `stamp` outline, 3px offset

## A note on `next.config.mjs`

`D:\` root contains a stray `package.json`, `package-lock.json` and `next.config.ts` from an earlier project. Next.js walks up looking for a workspace root, finds that lockfile, and concludes the workspace is the **entire D: drive** — then tries to trace 447 GB of games and video. It never prints an error; it just hangs forever with no output.

`next.config.mjs` pins both roots to this folder to prevent that:

```js
outputFileTracingRoot: import.meta.dirname,
turbopack: { root: import.meta.dirname },
```

Don't remove those. The real fix is to delete the stray Next files at `D:\` root (`package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `next-env.d.ts`, `postcss.config.mjs`, `eslint.config.mjs`) — any tool that searches upward for a project root will trip on them.

Also: don't run `next build` while `next dev` is running. They share `.next`, and the build will corrupt the dev server's chunks (`__webpack_modules__[moduleId] is not a function`). If that happens, stop both, `rm -rf .next`, restart.

## Deploying

Push to GitHub and import in Vercel — it detects Next.js with no configuration.

The contact form composes a prefilled `mailto:` draft, so there is no backend and no secret to manage. To route it through a form service instead, replace the body of `handleSubmit` in `src/components/Contact.tsx` with a POST; the markup, validation and states stay as they are.
