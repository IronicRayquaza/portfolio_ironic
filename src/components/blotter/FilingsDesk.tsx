import { blotter } from "@/lib/content";

/**
 * The lead story and the docket: work filed against other people's codebases.
 * This is the blotter proper — a numbered log of what was accepted — so it is
 * set as typed entries rather than editorial copy.
 */
export function FilingsDesk() {
  const { lead } = blotter;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-0">
      <div className="min-w-0 lg:col-span-7 lg:pr-10">
        <p className="label text-stamp">{lead.label}</p>
        <div className="rule-thin mt-3" />

        <h3 className="font-display mt-4 text-4xl leading-[0.95] tracking-tight sm:text-5xl">
          <a href={lead.href} target="_blank" rel="noreferrer" className="link-pencil">
            <span className="text-ink-faint">{lead.owner} / </span>
            {lead.name}
          </a>
        </h3>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-ink/15 py-4 sm:grid-cols-4">
          {lead.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="control-sm text-ink-faint">{stat.label}</dt>
              <dd className="font-display mt-1.5 text-2xl leading-none">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <p className="font-serif mt-5 max-w-[62ch] hyphens-auto text-justify text-[0.975rem] leading-[1.62] text-ink-soft">
          {lead.blurb}
        </p>

        <p className="label mt-8 text-stamp">Accepted Filings</p>
        <div className="rule-thin mt-3" />

        <ol className="mt-1">
          {lead.docket.map((entry) => (
            <li
              key={entry.no}
              className="lab-row flex items-baseline gap-3 border-b border-ink/12 py-3 sm:gap-4"
            >
              <a
                href={`${lead.href}/pull/${entry.no}`}
                target="_blank"
                rel="noreferrer"
                className="control press link-pencil shrink-0 text-stamp"
              >
                №&nbsp;{entry.no}
              </a>
              <p className="font-serif min-w-0 flex-1 text-[0.9375rem] leading-snug text-ink-soft">
                {entry.title}
              </p>
              <span className="control-sm hidden shrink-0 border border-ink/25 bg-paper-warm px-2 py-1 text-ink-faint sm:inline-block">
                {entry.area}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="min-w-0 lg:col-span-5 lg:col-rule lg:pl-10">
        <p className="label text-ink-faint">Also Filed</p>
        <ul className="mt-4 space-y-5">
          {blotter.alsoFiled.map((item) => (
            <li key={item.name}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-display press link-pencil text-lg leading-tight"
                >
                  {item.name} ↗
                </a>
                <span className="control-sm text-stamp">{item.count}</span>
              </div>
              <p className="font-serif mt-1.5 text-sm leading-relaxed text-ink-soft">
                {item.note}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
