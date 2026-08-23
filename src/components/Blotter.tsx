import { blotter, identity } from "@/lib/content";
import {
  getContributionYear,
  getRepoIndex,
  languageShares,
  summariseLog,
} from "@/lib/github";
import { BlotterDesk } from "./blotter/BlotterDesk";
import { SectionHead } from "./SectionHead";

/**
 * The police blotter: the daily log a paper prints of everything that came
 * across the desk. Here that is the public GitHub record, and it is a dashboard
 * rather than a single story — four desks over the same account: the year's
 * activity, the index of holdings, what he filed upstream, and what the whole
 * lot is written in.
 *
 * Server component. Both fetches happen at request time, are revalidated, and
 * fall back to a snapshot, so nothing about the network reaches the client —
 * only the finished figures do.
 */
export async function Blotter() {
  const [year, index] = await Promise.all([
    getContributionYear(identity.handle),
    getRepoIndex(identity.handle),
  ]);

  return (
    <section
      id="blotter"
      className="mx-auto mt-28 max-w-[1400px] scroll-mt-24 px-5 sm:px-8 lg:px-12"
    >
      <SectionHead kicker={blotter.kicker} title={blotter.title} note={blotter.note} />

      <BlotterDesk
        year={year}
        summary={summariseLog(year)}
        index={index}
        languages={languageShares(index.repos)}
      />
    </section>
  );
}
