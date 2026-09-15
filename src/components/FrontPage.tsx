import { frontPage, identity } from "@/lib/content";
import { Reveal, RevealWords } from "./Reveal";

export function FrontPage() {
  return (
    <section id="top" className="mx-auto max-w-[1400px] px-5 pt-10 sm:px-8 lg:px-12">
      {/* Kicker line: filed-under / case no. / status */}
      <Reveal
        variant="fade"
        as="div"
        className="mono-label flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-faint"
      >
        <span>{frontPage.kicker}</span>
        <span aria-hidden="true">·</span>
        <span className="text-stamp">Case No. {identity.caseNo}</span>
        <span aria-hidden="true">·</span>
        <span>— {frontPage.status}</span>
      </Reveal>

      {/* Headline */}
      <RevealWords
        as="h2"
        delay={0.1}
        text={frontPage.headline}
        className="font-display mt-5 max-w-[18ch] text-[clamp(2.1rem,6.4vw,5.2rem)] leading-[0.98] tracking-[-0.022em] text-balance"
      />

      <Reveal variant="rule" as="div" delay={0.45} className="rule-thin mt-8" />

      {/* Three-column broadsheet block: standfirst | portrait | body */}
      <div className="grid gap-8 pt-8 lg:grid-cols-12 lg:gap-0">
        {/* Left column — standfirst and byline */}
        <div className="lg:col-span-4 lg:pr-8">
          <Reveal variant="settle" delay={0.15}>
            <p className="font-serif dropcap text-lg leading-[1.55] text-ink sm:text-xl">
              {frontPage.standfirst}
            </p>

            <div className="mt-6 border-t border-ink/15 pt-4">
              <p className="label text-ink-faint">By</p>
              <p className="font-display mt-1.5 text-xl leading-tight">{frontPage.byline}</p>
              <p className="font-serif mt-1 text-sm italic text-ink-soft">
                {frontPage.bylineNote}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={identity.resume}
                target="_blank"
                rel="noreferrer"
                className="control slug press border border-ink bg-ink text-paper-bright hover:border-stamp hover:bg-stamp"
              >
                {frontPage.resumeCta}
                <span className="sr-only"> (PDF, opens in a new tab)</span>
                <span className="slug-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
              <a
                href={frontPage.ctaSecondary.href}
                className="control slug press border border-ink/30 text-ink hover:border-ink hover:bg-paper-warm"
              >
                {frontPage.ctaSecondary.label}
              </a>
            </div>
          </Reveal>
        </div>

        {/* Centre column — the plate */}
        <div className="lg:col-span-4 lg:col-rule lg:px-8">
          <Reveal variant="develop" delay={0.25}>
            <figure>
              <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep outline outline-1 outline-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={identity.portrait}
                  alt={`${identity.name}, photographed for this edition`}
                  className="h-full w-full object-cover grayscale-[35%] contrast-[1.08]"
                  loading="eager"
                />
                {/* Halftone over the plate — this is a printed photograph */}
                <div className="grain" aria-hidden="true" />
              </div>
              <figcaption className="font-serif mt-2.5 border-t border-ink/15 pt-2 text-xs italic text-ink-soft">
                {frontPage.plateCaption}
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* Right column — running body copy */}
        <div className="lg:col-span-4 lg:col-rule lg:pl-8">
          <Reveal variant="settle" delay={0.35}>
            <div className="font-serif space-y-4 text-[0.975rem] leading-[1.62] text-ink-soft">
              {frontPage.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <p className="label mt-6 border-t border-ink/15 pt-4 text-ink-faint">
              Currently building
            </p>
            <a
              href="https://theia-cyan.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="font-display press link-pencil mt-1.5 inline-block text-2xl leading-tight"
            >
              Theia
            </a>
            <p className="font-serif mt-1 text-sm italic text-ink-soft">
              An ongoing web project — currently in development.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Dateline boxes */}
      <Reveal variant="rule" as="div" delay={0.1} className="rule-thin mt-10" />
      <div className="grid grid-cols-2 divide-ink/15 lg:grid-cols-4 lg:divide-x">
        {frontPage.dateline.map((box, i) => (
          <Reveal
            key={box.value}
            variant="settle"
            delay={0.1 + i * 0.07}
            className="border-b border-ink/15 px-1 py-5 lg:border-b-0 lg:px-6 lg:first:pl-0"
          >
            <p className="font-display text-2xl leading-none sm:text-3xl">{box.value}</p>
            <p className="mono-label mt-2 text-ink-faint">{box.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
