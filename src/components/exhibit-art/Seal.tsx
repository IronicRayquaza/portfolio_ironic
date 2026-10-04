import { T, appear, mark, shift } from "./tokens";
import { Block, Cylinder, PAPER, axo, curve, path, ring, type Axo } from "./axo";

/**
 * Uni Hub — a notary's seal press on a desk blotter. Certificates of attendance
 * wait in a pile on the left; one sits in the jaw of the press; the pile on the
 * right has already been sealed. A seal is the oldest proof that a document is
 * what it says it is, which is what an NFT certificate is for: proof you were
 * there, struck once and not forged afterwards.
 *
 * Hover works the press: the lever comes down, the die strikes, the seal is
 * raised in the paper, and the certificate slides onto the sealed pile.
 *
 * Camera: a three-quarter view from the front right, the desk running away up
 * and to the left. Nowhere else on the page is seen from this side.
 */

const p = axo([118, 46], [0.98, 0.34], [-0.66, 0.46]);

const MAT = { w: 168, d: 92 };
const SHEET = { w: 50, d: 32 };
const PILE_H = 1.3;
const SEALED_TOP = 3 + 4 * PILE_H;

/** The die's axis. Everything that strikes is centred on it. */
const DIE = { x: 96, y: 41 };
/** The sheet in the jaw sits with its seal spot under the die. */
const JAW = { x: DIE.x - (SHEET.w - 12), y: DIE.y - 11, z: 14 };
/** The face of the die, and how far the ram travels to bring it onto the sheet. */
const RAM_FOOT = 26.6;
const STRIKE = +(RAM_FOOT - (JAW.z + PILE_H)).toFixed(2);

/** The sealed pile, at the front right: the end of the line. */
const SEALED = { x: 112, y: 54 };

/** One certificate, on the face of a sheet: border, title, the name line. */
function Certificate({ x, y, sealed = false }: { x: number; y: number; sealed?: boolean }) {
  const { w, d } = SHEET;

  return (
    <>
      <rect x={x + 2.5} y={y + 2.5} width={w - 5} height={d - 5} strokeWidth="0.9" />
      <path d={`M${x + 9} ${y + d - 9}h${w - 26}`} strokeWidth="2.2" />
      <path d={`M${x + 9} ${y + d - 16}h${w - 32}M${x + 9} ${y + 10}h${w - 34}`} strokeWidth="0.9" />
      {sealed && <SealMark cx={x + w - 12} cy={y + 11} />}
    </>
  );
}

/** The raised seal: a scalloped rim round a plain boss, and two ribbon tails. */
function SealMark({ cx, cy }: { cx: number; cy: number }) {
  const rim = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    const r = i % 2 ? 6.2 : 7.2;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");

  return (
    <>
      <path d={`M${cx - 3} ${cy - 5}l-3 -8 3 1.5 2 -2.5z M${cx + 3} ${cy - 5}l3 -8 -3 1.5 -2 -2.5z`} fill="currentColor" fillOpacity={T.dark} strokeWidth="0.9" />
      <polygon points={rim} fill="currentColor" fillOpacity={T.mid} strokeWidth="1" />
      <circle cx={cx} cy={cy} r="3.6" fill={PAPER} strokeWidth="1" />
    </>
  );
}

/** A loose pile: sheets not quite squared, the way paper is when it is handled. */
function Pile({ x, y, sealed }: { x: number; y: number; sealed: boolean }) {
  const drift = [
    [0, 0],
    [1.5, -1],
    [-1, 1.2],
    [0.8, 0.4],
  ];

  return (
    <>
      {drift.map(([dx, dy], i) => (
        <Block key={i} p={p} x={x + dx} y={y + dy} z={3 + i * PILE_H} w={SHEET.w} d={SHEET.d} h={PILE_H} weight={1}>
          {i === drift.length - 1 && <Certificate x={x + dx} y={y + dy} sealed={sealed} />}
        </Block>
      ))}
    </>
  );
}

function Lever({ q }: { q: Axo }) {
  // Drawn on the upright plane through the die's axis, pivot at the local
  // origin, so a rotation here swings it in that plane: a real hinge.
  return (
    <g transform={q.wallY(DIE.y, 74)}>
      <g transform="translate(64 0)">
        <g {...shift("rotate(17deg)", { dur: 200, ease: "cubic-bezier(0.55, 0, 1, 0.45)", pivot: true })}>
          <g {...shift("rotate(-17deg)", { dur: 380, delay: 330, pivot: true })}>
            <path d="M0 0L70 -20" strokeWidth="5.4" />
            <path d="M0 0L70 -20" stroke={PAPER} strokeWidth="2.6" />
            <circle cx="74" cy="-21" r="5.5" fill={PAPER} strokeWidth="1.6" />
            <circle cx="74" cy="-21" r="5.5" fill="currentColor" fillOpacity={T.dark} strokeWidth="1.6" />
            <circle cx="0" cy="0" r="3.4" fill={PAPER} strokeWidth="1.6" />
          </g>
        </g>
      </g>
    </g>
  );
}

export function Seal() {
  const [dx, dy] = [SEALED.x - JAW.x, SEALED.y - JAW.y];
  const [sx, sy] = [dx * p.ex[0] + dy * p.ey[0], dx * p.ex[1] + dy * p.ey[1] + (JAW.z - SEALED_TOP)];
  const seal = { x: SEALED.x + SHEET.w - 12, y: SEALED.y + 11 };
  const struck = p.at(seal.x, seal.y, SEALED_TOP + PILE_H);

  return (
    // The desk's own bounds centred on the plate and brought up to fill it.
    <g transform="translate(160 90) scale(1.1) translate(-170 -79)">
      <g className="art-base">
        {/* the blotter, with its leather corners */}
        <Block p={p} x={0} y={0} z={0} w={MAT.w} d={MAT.d} h={3} weight={2.2}>
          {[
            [0, 0, 1, 1],
            [MAT.w, 0, -1, 1],
            [0, MAT.d, 1, -1],
            [MAT.w, MAT.d, -1, -1],
          ].map(([cx, cy, ux, uy]) => (
            <path
              key={`${cx}-${cy}`}
              d={`M${cx} ${cy}h${ux * 20}L${cx} ${cy + uy * 20}z`}
              fill="currentColor"
              fillOpacity={T.mid}
              strokeWidth="1.2"
            />
          ))}
        </Block>

        <Pile x={4} y={50} sealed={false} />

        {/* the press: an iron base, the lower die, the sheet on it */}
        <Block p={p} x={52} y={22} z={3} w={60} d={38} h={8} tones={[T.light, T.mid, T.dark]} weight={1.8} />
        <Cylinder p={p} cx={DIE.x} cy={DIE.y} z={11} r={8} h={3} tones={[T.light, T.mid]} />

        {/* the frame behind the jaw */}
        <Block p={p} x={56} y={34} z={11} w={16} d={14} h={58} tones={[T.light, T.mid, T.dark]} weight={1.8} />

        {/* The sealed pile sits in front of the press but never under its arm,
            so it can be drawn before the travelling sheet, which then lands on
            top of it instead of sliding underneath. */}
        <Pile x={SEALED.x} y={SEALED.y} sealed />

        <g {...shift(`translate(${+sx.toFixed(2)}px, ${+sy.toFixed(2)}px)`, { dur: 580, delay: 720 })}>
          <Block p={p} x={JAW.x} y={JAW.y} z={JAW.z} w={SHEET.w} d={SHEET.d} h={PILE_H} weight={1.2}>
            <Certificate x={JAW.x} y={JAW.y} />
            {/* raised the moment the die comes down on it */}
            <g {...appear(330, 120)}>
              <SealMark cx={JAW.x + SHEET.w - 12} cy={JAW.y + 11} />
            </g>
          </Block>
        </g>

        {/* The ram: a shaft that slides through a guide collar under the arm,
            with the die head on its end. It is drawn before the collar and the
            arm so that both cover its top — the shaft is always seen running
            up into the iron, at rest and at the bottom of the stroke, instead
            of hanging loose beneath it. */}
        <g {...shift(`translateY(${STRIKE}px)`, { dur: 200, ease: "cubic-bezier(0.55, 0, 1, 0.45)" })}>
          <g {...shift(`translateY(${-STRIKE}px)`, { dur: 380, delay: 330 })}>
            {/* bottom up: the engraved face, the head it is set in, the shaft */}
            <Cylinder p={p} cx={DIE.x} cy={DIE.y} z={RAM_FOOT} r={5.6} h={28 - RAM_FOOT} tones={[T.mid, T.dark]} weight={1.3} />
            <Cylinder p={p} cx={DIE.x} cy={DIE.y} z={28} r={7.4} h={5} tones={[T.light, T.mid]} weight={1.6} />
            <Cylinder p={p} cx={DIE.x} cy={DIE.y} z={33} r={3.6} h={28} tones={[T.light, T.mid]} weight={1.3} />
          </g>
        </g>

        {/* the collar the ram runs in, bolted under the arm, then the arm */}
        <Cylinder p={p} cx={DIE.x} cy={DIE.y} z={47} r={9} h={2} tones={[T.mid, T.dark]} weight={1.4} />
        <Cylinder p={p} cx={DIE.x} cy={DIE.y} z={49} r={7.4} h={7} tones={[T.mid, T.dark]} weight={1.6} />
        <Block p={p} x={56} y={34} z={56} w={48} d={14} h={13} tones={[T.light, T.mid, T.dark]} weight={1.8} />

        <Lever q={p} />
      </g>

      <g className="art-marks">
        {/* from the waiting pile into the press */}
        <path {...mark(0)} d={curve(p.at(26, 70, 14), p.at(22, 64, 58), p.at(66, 50, 52), p.at(72, 50, 24))} />
        {/* the seal, once struck and filed */}
        <path {...mark(15)} d={path(ring(p, seal.x, seal.y, SEALED_TOP + PILE_H, 13), true)} />
        <path {...mark(18)} d={`M${struck[0] + 20} ${struck[1] - 22}l5 6 11-14`} />
      </g>
    </g>
  );
}
