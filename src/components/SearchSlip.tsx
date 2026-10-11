"use client";

import { useSyncExternalStore } from "react";
import { identity, notFound } from "@/lib/content";

/**
 * The 404 is prerendered once and served for every missing address, so the
 * address can only be read in the browser. The server snapshot is empty and
 * the slip prints a neutral placeholder until hydration fills it in — reading
 * `usePathname()` instead would print "/_not-found" into the static HTML and
 * then mismatch on hydrate.
 */
function subscribe() {
  return () => {};
}
const getPath = () => window.location.pathname;
const getServerPath = () => "";

/** The typed slip a records clerk hands back: what was asked for, and what was found. */
export function SearchSlip() {
  const path = useSyncExternalStore(subscribe, getPath, getServerPath);

  const subject = encodeURIComponent(`Broken link on your site: ${path || "unknown page"}`);
  const body = encodeURIComponent(
    `Hi Satyam,\n\nI followed a link to ${path ? `${path} ` : "a page "}and it wasn't there.\n\nI came from: `,
  );

  return (
    <>
      <dl className="mt-8 border border-ink/25 bg-paper-bright/60">
        <div className="border-b border-ink/15 px-4 py-2.5">
          <p className="control-sm text-ink-faint">{notFound.slip.title}</p>
        </div>
        <div className="grid grid-cols-[7rem_1fr] gap-x-4 gap-y-3 px-4 py-4 sm:grid-cols-[8rem_1fr]">
          <dt className="control-sm pt-[0.2em] text-ink-faint">{notFound.slip.requested}</dt>
          <dd className="font-mono min-h-[1.5em] text-sm text-ink [overflow-wrap:anywhere]">
            {path || <span className="text-ink-faint">this address</span>}
          </dd>
          <dt className="control-sm pt-[0.2em] text-ink-faint">{notFound.slip.status}</dt>
          <dd className="font-mono text-sm text-stamp">{notFound.slip.statusValue}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={notFound.ctaPrimary.href}
          className="control slug slug-back press border border-ink bg-ink text-paper-bright hover:border-stamp hover:bg-stamp"
        >
          <span className="slug-arrow" aria-hidden="true">
            ←
          </span>
          {notFound.ctaPrimary.label}
        </a>
        <a
          href={`mailto:${identity.email}?subject=${subject}&body=${body}`}
          className="control slug press border border-ink/30 text-ink hover:border-ink hover:bg-paper-warm"
        >
          {notFound.ctaReport}
        </a>
      </div>
    </>
  );
}
