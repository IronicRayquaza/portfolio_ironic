import { exhibits, packages, papers, type Exhibit } from "@/lib/content";
import { EvidencePlate } from "./EvidencePlate";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** The red rubber stamp that slams onto each confirmed exhibit. */
function Stamp({ label }: { label: string }) {
  return (
    <Reveal
      variant="stamp"
      as="span"
      delay={0.3}
      className="control -rotate-[4deg] border-2 border-stamp px-2.5 py-1.5 text-stamp"
    >
      {label}
    </Reveal>
  );
}

function ExhibitRow({ exhibit, index }: { exhibit: Exhibit; index: number }) {
  const letter = LETTERS[index];
  const href = exhibit.live ?? exhibit.repo;

  return (
    <Reveal variant="settle" as="article" delay={0.05} className="exhibit group relative">
      <div className="grid gap-8 border-t border-ink/15 py-10 lg:grid-cols-12 lg:gap-10 lg:px-4">
        {/* The evidence photograph. min-w-0: a grid item defaults to
            `min-width: auto`, so the plate's domain line — which is set to
            truncate — was instead sizing the whole track to the full URL and
            pushing the page sideways on a phone. */}
        <div className="min-w-0 lg:col-span-5">
          <EvidencePlate art={exhibit.art} letter={letter} domain={exhibit.domain} />
        </div>

        {/* The case notes. Flex column so the filing row can sink to the
            bottom rather than leaving dead space under the copy. */}
        <div className="flex min-w-0 flex-col lg:col-span-7">
          <p className="label text-stamp">Exhibit {letter}</p>
          <p className="mono-label mt-2 text-ink-faint">{exhibit.client}</p>

          <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
            <h3 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              <a href={href} target="_blank" rel="noreferrer" className="link-pencil">
                {exhibit.title}
              </a>
            </h3>
            <Stamp label={exhibit.credit ?? "Confirmed"} />
          </div>

          {/* Justified and hyphenated, set to a readable measure — the column is
              wide enough that full-bleed copy would run past 90 characters. */}
          <p className="font-serif mt-4 max-w-[68ch] hyphens-auto text-justify text-[0.975rem] leading-[1.62] text-ink-soft">
            {exhibit.description}
          </p>

          {/* Substances found at the scene */}
          <ul className="mt-5 mb-6 flex flex-wrap gap-1.5" aria-label="Technologies used">
            {exhibit.stack.map((tech) => (
              <li
                key={tech}
                className="mono-label border border-ink/25 bg-paper-warm px-2 py-1 text-ink-soft"
              >
                {tech}
              </li>
            ))}
          </ul>

          {/* mt-auto sinks this to the bottom; the tags' mb-6 above guarantees a
              minimum gap when the copy is long enough to fill the column. */}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-ink/12 pt-4">
            {/* Credit is already on the stamp — don't print it twice. */}
            <p className="mono-label text-ink-faint">Filed {exhibit.year}</p>

            <div className="flex items-center gap-5">
              {exhibit.live && (
                <a
                  href={exhibit.live}
                  target="_blank"
                  rel="noreferrer"
                  className="control press link-pencil inline-flex items-center gap-1.5 text-stamp"
                >
                  Open case file
                  <span className="exhibit-arrow inline-block" aria-hidden="true">
                    →
                  </span>
                </a>
              )}
              <a
                href={exhibit.repo}
                target="_blank"
                rel="noreferrer"
                className="control press link-pencil text-ink-soft hover:text-ink"
              >
                Source ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function Evidence() {
  return (
    <section
      id="evidence"
      className="mx-auto mt-24 max-w-[1400px] scroll-mt-24 px-5 sm:px-8 lg:px-12"
    >
      <SectionHead
        kicker="The Evidence"
        title="Selected Works"
        note={`Exhibits A – ${LETTERS[exhibits.length - 1]} · Entered 2023 – Now`}
      />

      <div className="mt-12">
        {exhibits.map((exhibit, i) => (
          <ExhibitRow key={exhibit.title} exhibit={exhibit} index={i} />
        ))}
        <Reveal variant="rule" as="div" className="rule-thin" />
      </div>

      {/* Secondary evidence — two columns of smaller entries */}
      <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-0">
        <div className="lg:pr-10">
          <Reveal variant="fade" as="p" className="label text-stamp">
            Supporting Documents
          </Reveal>
          <Reveal variant="rule" as="div" delay={0.05} className="rule-thin mt-3" />
          <h3 className="font-display mt-4 text-3xl leading-none">Research Papers</h3>

          <ul className="mt-5 space-y-5">
            {papers.map((paper, i) => (
              <Reveal
                key={paper.title}
                variant="settle"
                as="li"
                delay={i * 0.06}
                className="border-t border-ink/12 pt-4 first:border-t-0 first:pt-0"
              >
                <h4 className="font-display text-lg leading-snug">{paper.title}</h4>
                <p className="font-serif mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {paper.description}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="lg:col-rule lg:pl-10">
          <Reveal variant="fade" as="p" className="label text-stamp">
            Also Recovered
          </Reveal>
          <Reveal variant="rule" as="div" delay={0.05} className="rule-thin mt-3" />
          <h3 className="font-display mt-4 text-3xl leading-none">Packages &amp; Extensions</h3>

          <ul className="mt-5 space-y-5">
            {packages.map((pkg, i) => (
              <Reveal
                key={pkg.title}
                variant="settle"
                as="li"
                delay={i * 0.06}
                className="border-t border-ink/12 pt-4 first:border-t-0 first:pt-0"
              >
                <h4 className="font-display text-lg leading-snug">
                  <a
                    href={pkg.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="link-pencil press"
                  >
                    {pkg.title} ↗
                  </a>
                </h4>
                <p className="font-serif mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {pkg.description}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
