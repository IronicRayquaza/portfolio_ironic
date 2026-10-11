import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Masthead } from "@/components/Masthead";
import { Reveal, RevealWords } from "@/components/Reveal";
import { SearchSlip } from "@/components/SearchSlip";
import { identity, nav, notFound } from "@/lib/content";

export const metadata: Metadata = {
  title: `Page not found — ${identity.name}`,
};

/**
 * Every unmatched address lands here instead of the host's bare fallback. The
 * nameplate and colophon are the same ones the front page prints, so a reader
 * who mistyped still knows which paper they are holding.
 *
 * No sticky Nav: its links are in-page anchors that only resolve on the front
 * page. The index in the right column does that job here, root-relative.
 */
export default function NotFound() {
  return (
    <>
      <Masthead />
      <main id="main" className="mx-auto max-w-[1400px] px-5 pt-10 sm:px-8 lg:px-12">
        <Reveal
          variant="fade"
          as="div"
          className="mono-label flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-faint"
        >
          <span>{notFound.kicker}</span>
          <span aria-hidden="true">·</span>
          <span className="text-stamp">Case No. 404</span>
          <span aria-hidden="true">·</span>
          <span>— {notFound.status}</span>
        </Reveal>

        <RevealWords
          as="h2"
          delay={0.1}
          text={notFound.headline}
          className="font-display mt-5 max-w-[16ch] text-[clamp(2.1rem,6.4vw,5.2rem)] leading-[0.98] tracking-[-0.022em] text-balance"
        />

        <Reveal variant="rule" as="div" delay={0.4} className="rule-thin mt-8" />

        <div className="grid gap-10 pt-8 lg:grid-cols-12 lg:gap-0">
          {/* Left — the correction itself, the slip, the way back */}
          <div className="lg:col-span-7 lg:pr-10">
            <Reveal variant="settle" delay={0.15}>
              <p className="font-serif dropcap max-w-[52ch] text-lg leading-[1.55] text-ink sm:text-xl">
                {notFound.standfirst}
              </p>
              <SearchSlip />
            </Reveal>
          </div>

          {/* Right — the empty plate and the section index */}
          <div className="lg:col-span-5 lg:col-rule lg:pl-10">
            <Reveal variant="develop" delay={0.25}>
              <figure>
                <div className="relative grid aspect-[16/11] place-items-center overflow-hidden border border-dashed border-ink/30 bg-paper-warm">
                  <p
                    aria-hidden="true"
                    className="font-display select-none text-[clamp(6rem,20vw,11rem)] leading-none tracking-[-0.04em] text-ink/15"
                  >
                    404
                  </p>
                  <div className="halftone halftone-ink" aria-hidden="true" />
                  <div className="absolute inset-0 grid place-items-center">
                    <Reveal variant="stamp" delay={0.7} as="span">
                      <span className="control inline-block -rotate-[8deg] border-2 border-stamp px-5 pt-[0.8rem] pb-[0.65rem] text-lg tracking-[0.22em] text-stamp mix-blend-multiply sm:text-2xl">
                        {notFound.stamp}
                      </span>
                    </Reveal>
                  </div>
                </div>
                <figcaption className="font-serif mt-2.5 border-t border-ink/15 pt-2 text-xs italic text-ink-soft">
                  {notFound.plateCaption}
                </figcaption>
              </figure>
            </Reveal>

            <Reveal variant="settle" delay={0.35} className="mt-8">
              <nav aria-labelledby="edition-index">
                <p id="edition-index" className="label text-ink-faint">
                  {notFound.indexTitle}
                </p>
                <ol className="mt-3 border-t border-ink/15">
                  {nav.map((item, i) => (
                    <li key={item.href} className="border-b border-ink/15">
                      <a
                        href={`/${item.href}`}
                        className="index-row press flex items-baseline gap-3 py-2.5"
                      >
                        <span className="font-serif link-pencil text-base">
                          {item.label}
                        </span>
                        <span
                          aria-hidden="true"
                          className="mb-[0.3em] flex-1 border-b border-dotted border-ink/30"
                        />
                        <span className="index-page mono-label text-ink-faint">
                          <span className="sr-only">Page </span>A{i + 2}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </Reveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
