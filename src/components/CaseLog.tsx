import { caseLog, type CaseEntry } from "@/lib/content";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

/**
 * Wins get the filled stamp. Client work gets the outline in red, so freelance
 * reads apart from a competition placing without colour carrying it alone — the
 * word on the stamp says which it is. Everything else stays outlined in ink.
 */
function Verdict({ verdict }: { verdict: CaseEntry["verdict"] }) {
  const tone =
    verdict === "Winner"
      ? "border-stamp bg-stamp text-paper-bright"
      : verdict === "Delivered"
        ? "border-stamp bg-transparent text-stamp"
        : "border-ink/40 bg-transparent text-ink-soft";

  return (
    <Reveal
      variant="stamp"
      as="span"
      delay={0.2}
      className={`control -rotate-[3deg] whitespace-nowrap border-2 px-2 py-1 ${tone}`}
    >
      {verdict}
    </Reveal>
  );
}

export function CaseLog() {
  return (
    <section
      id="caselog"
      className="mx-auto mt-28 max-w-[1400px] scroll-mt-24 px-5 sm:px-8 lg:px-12"
    >
      <SectionHead
        kicker="Prior Appearances"
        title="The Case Log"
        note="Client work, hackathons and workshops on record since 2023"
      />

      {/* Two-column broadsheet flow of entries */}
      <ol className="mt-12 grid gap-x-10 gap-y-0 lg:grid-cols-2">
        {caseLog.map((entry, i) => (
          <Reveal
            key={entry.event}
            variant="settle"
            as="li"
            delay={(i % 2) * 0.06}
            className="border-t border-ink/15 py-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                {/* Client work links out; a hackathon placing has nowhere to go. */}
                <h3 className="font-display text-2xl leading-tight sm:text-3xl">
                  {entry.href ? (
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noreferrer"
                      className="link-pencil press"
                    >
                      {entry.event} ↗
                    </a>
                  ) : (
                    entry.event
                  )}
                </h3>
                <p className="mono-label mt-1.5 text-ink-faint">{entry.date}</p>
              </div>
              <Verdict verdict={entry.verdict} />
            </div>

            <p className="font-display mt-3 text-xl leading-tight text-stamp">{entry.outcome}</p>
            <p className="font-serif mt-1.5 text-[0.9375rem] leading-relaxed text-ink-soft">
              {entry.detail}
            </p>
          </Reveal>
        ))}
      </ol>

      <Reveal variant="rule" as="div" className="rule-thin" />

    </section>
  );
}
