/**
 * The standing figures under the desk rail. Every desk prints its own set, so
 * switching desks changes the numbers as well as the body — that is most of
 * what makes this read as a dashboard rather than four stacked sections.
 */
export type Figure = { value: string; label: string };

export function Figures({ figures }: { figures: readonly Figure[] }) {
  return (
    <dl className="grid grid-cols-2 divide-ink/15 border-b border-ink/15 sm:grid-cols-4 sm:divide-x">
      {figures.map((figure, i) => (
        <div
          key={figure.label}
          className={`px-1 py-4 sm:px-5 sm:first:pl-0 ${
            // Two-up on small screens, so only the first row carries a rule.
            i < figures.length - 2 ? "border-b border-ink/15 sm:border-b-0" : ""
          }`}
        >
          <dd className="font-display text-2xl leading-none sm:text-3xl">{figure.value}</dd>
          <dt className="mono-label mt-2 text-ink-faint">{figure.label}</dt>
        </div>
      ))}
    </dl>
  );
}
