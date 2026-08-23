import type { LanguageShare } from "@/lib/github";

/**
 * The composition of the holdings, set as a table of inked rules. A bar chart
 * on a broadsheet is just a rule of varying length, so that is what it is —
 * no fills, no gridlines — and the count is printed beside every row, because
 * a bar on its own is not a number.
 *
 * Two columns from `lg`. One column across a 1400px sheet leaves the short
 * languages as a stub against acres of paper, and puts the figure so far from
 * its bar that they stop reading as the same row.
 */
export function LanguageDesk({
  languages,
  total,
}: {
  languages: readonly LanguageShare[];
  total: number;
}) {
  // Bars are scaled against the largest share rather than against 100%, so the
  // tail of the list stays legible instead of collapsing to a dot.
  const widest = languages[0]?.share ?? 1;
  const split = Math.ceil(languages.length / 2);
  const columns = [languages.slice(0, split), languages.slice(split)];

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 className="font-display text-2xl leading-none sm:text-3xl">Composition</h3>
        <p className="control-sm text-ink-faint">
          {total} repositories · {languages.length} languages
        </p>
      </div>

      <div className="rule-thin mt-3 grid gap-x-12 lg:grid-cols-2">
        {columns.map((column, c) => (
          <dl
            key={c}
            className={`min-w-0 divide-y divide-ink/12 ${c === 1 ? "lg:col-rule lg:pl-12" : ""}`}
          >
            {column.map((lang) => (
              <div
                key={lang.name}
                className="lab-row grid grid-cols-[minmax(6rem,9rem)_1fr_auto] items-center gap-x-4 py-3"
              >
                <dt className="font-serif truncate text-[0.9375rem] text-ink">{lang.name}</dt>

                <dd aria-hidden="true" className="h-2.5">
                  <span
                    className={`block h-full ${
                      lang.name === "Unclassified" ? "bg-ink/20" : "bg-ink/75"
                    }`}
                    style={{ width: `${Math.max((lang.share / widest) * 100, 2)}%` }}
                  />
                </dd>

                <dd className="control-sm whitespace-nowrap text-right text-ink-soft">
                  {lang.count}
                  <span className="ml-2 text-ink-faint">{Math.round(lang.share * 100)}%</span>
                </dd>
              </div>
            ))}
          </dl>
        ))}
      </div>
    </div>
  );
}
