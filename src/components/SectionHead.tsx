import { Reveal, RevealWords } from "./Reveal";

/**
 * The section masthead used across Evidence, Forensics, the Blotter and
 * Contact: a small kicker, a display title, and a line of standfirst.
 *
 * The title is set on one line from `sm` up — these are two- and three-word
 * decks, and stacking them left a column of orphans beside acres of blank
 * paper. Below `sm` it is allowed to wrap rather than force a page-wide
 * scrollbar; the fluid size keeps it to one line everywhere else.
 */
export function SectionHead({
  kicker,
  title,
  note,
  align = "left",
}: {
  kicker: string;
  title: string;
  note: string;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "lg:text-right" : ""}>
      <Reveal variant="fade" as="p" className="label text-stamp">
        {kicker}
      </Reveal>

      <Reveal variant="rule" as="div" delay={0.05} className="rule-thick mt-3" />

      {/* pb clears descenders ("p" in Report, "g" in Blotter) at leading 0.88. */}
      <RevealWords
        as="h2"
        delay={0.1}
        text={title}
        className="font-display mt-5 text-balance pb-[0.1em] text-[clamp(2rem,6.4vw,5.25rem)] leading-[0.88] tracking-[-0.02em] sm:whitespace-nowrap"
      />

      <Reveal
        variant="fade"
        as="p"
        delay={0.25}
        className="font-serif mt-3 text-sm italic text-ink-soft sm:text-base"
      >
        {note}
      </Reveal>
    </div>
  );
}
