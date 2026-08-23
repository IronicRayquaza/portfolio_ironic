import { colophon, contact, identity, nav, wireServices } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Footer() {
  return (
    <footer className="mx-auto mt-28 max-w-[1400px] px-5 pb-12 sm:px-8 lg:px-12">
      <Reveal variant="rule" as="div" className="rule-thick" />

      <div className="grid gap-10 py-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="font-display text-3xl leading-none">{identity.name}</p>
          <p className="font-serif mt-3 max-w-[46ch] text-sm leading-relaxed text-ink-soft">
            {colophon.blurb}
          </p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-2">
          <p className="label text-ink-faint">Sections</p>
          <ul className="mt-3 space-y-1.5">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="font-serif press link-pencil text-sm">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-2">
          <p className="label text-ink-faint">{contact.desk.title}</p>
          <p className="font-serif mt-3 text-sm text-ink-soft">{contact.desk.location}</p>
          <p className="font-serif mt-1 text-sm text-ink-soft">IST · Remote-first</p>
          <a
            href={`mailto:${identity.email}`}
            className="font-serif press link-pencil mt-2 inline-block text-sm break-all"
          >
            {identity.email}
          </a>
        </div>

        <div className="lg:col-span-3">
          <p className="label text-ink-faint">Wire Services</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {wireServices.map((wire) => (
              <li key={wire.label}>
                <a
                  href={wire.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-serif press link-pencil text-sm"
                >
                  {wire.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Reveal variant="rule" as="div" className="rule-thin" />

      <div className="mono-label flex flex-wrap items-center justify-between gap-3 pt-5 text-ink-faint">
        <span className="text-stamp">Case Closed</span>
        <span>{colophon.rights}</span>
      </div>
    </footer>
  );
}
