import { identity } from "@/lib/content";
import { Reveal } from "./Reveal";

function todayFormatted() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** The nameplate. Everything a broadsheet puts above the fold, before the news. */
export function Masthead() {
  return (
    <header className="mx-auto max-w-[1400px] px-5 pt-8 sm:px-8 lg:px-12">
      {/* Ears — the small print flanking the nameplate */}
      <Reveal
        variant="fade"
        as="div"
        className="label flex items-center justify-between text-ink-faint"
      >
        <span>{identity.location}</span>
        <span className="hidden text-center sm:block">{identity.edition}</span>
        <span>{identity.established}</span>
      </Reveal>

      <Reveal variant="rule" as="div" delay={0.05} className="rule-thin mt-3" />

      {/* Nameplate */}
      <Reveal variant="settle" as="div" delay={0.1} className="pt-6 pb-5 text-center">
        {/* pb clears the descenders on "y" and "g" — at leading 0.86 they hang
            below the line box and collide with the strapline underneath. */}
        <h1 className="font-display pb-[0.16em] text-[clamp(2.75rem,11vw,9rem)] leading-[0.86] tracking-[-0.02em]">
          {identity.name}
        </h1>
        <p className="font-serif mt-2 text-sm italic text-ink-soft sm:text-base">
          {identity.strapline}
        </p>
      </Reveal>

      <Reveal variant="rule" as="div" delay={0.2} className="rule-thick" />

      {/* Dateline strip */}
      <Reveal
        variant="fade"
        as="div"
        delay={0.3}
        className="mono-label flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-b border-ink/20 py-2.5 text-ink-soft sm:justify-between"
      >
        <span>{todayFormatted()}</span>
        <span className="hidden sm:inline">{identity.volume}</span>
        <span>Selected Works &amp; Notes</span>
        <span className="hidden sm:inline">{identity.price}</span>
      </Reveal>
    </header>
  );
}
