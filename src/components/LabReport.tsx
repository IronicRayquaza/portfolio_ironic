import { forensicsNote, substances, type Substance } from "@/lib/content";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

/**
 * Finding strength is carried by a filled-bar meter AND the text label — never
 * by colour alone, so it reads without colour vision or on a printout.
 */
const STRENGTH: Record<Substance["finding"], number> = {
  "Primary tool": 4,
  Comfortable: 3,
  "In training": 2,
  "Trace amount": 1,
};

function Meter({ finding }: { finding: Substance["finding"] }) {
  const level = STRENGTH[finding];
  return (
    <span className="inline-flex gap-[3px]" aria-hidden="true">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`block h-2.5 w-1.5 ${i <= level ? "bg-stamp" : "bg-ink/15"}`}
        />
      ))}
    </span>
  );
}

export function LabReport() {
  return (
    <section
      id="forensics"
      className="mx-auto mt-28 max-w-[1400px] scroll-mt-24 px-5 sm:px-8 lg:px-12"
    >
      <SectionHead
        kicker="Forensics"
        title="The Lab Report"
        note="Substances detected on the subject, as of this edition"
      />

      <Reveal variant="settle" delay={0.1} className="mt-12 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">
            Technologies used, with how often each is detected and the strength of the finding
          </caption>
          <thead>
            <tr className="border-y-2 border-ink">
              <th scope="col" className="label py-3 pr-4 text-ink-faint">
                Substance
              </th>
              <th scope="col" className="label py-3 pr-4 text-ink-faint">
                Code
              </th>
              <th scope="col" className="label py-3 pr-4 text-ink-faint">
                Detected
              </th>
              <th scope="col" className="label py-3 text-ink-faint">
                Finding
              </th>
            </tr>
          </thead>
          <tbody>
            {substances.map((s) => (
              <tr key={s.code} className="lab-row border-b border-ink/12">
                <th scope="row" className="font-display py-3 pr-4 text-lg leading-snug">
                  {s.name}
                </th>
                <td className="font-mono py-3 pr-4 text-xs tracking-wider text-stamp">
                  {s.code}
                </td>
                <td className="font-serif py-3 pr-4 text-sm text-ink-soft">{s.detected}</td>
                <td className="py-3">
                  <span className="flex items-center gap-2.5">
                    <Meter finding={s.finding} />
                    <span className="mono-label text-ink-soft">{s.finding}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      <Reveal
        variant="fade"
        as="p"
        delay={0.15}
        className="font-serif mt-4 text-sm italic text-ink-faint"
      >
        {forensicsNote}
      </Reveal>
    </section>
  );
}
