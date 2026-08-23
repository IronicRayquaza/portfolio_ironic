"use client";

import { useState, type FormEvent } from "react";
import { contact, identity } from "@/lib/content";
import { Crossword } from "./backpage/Crossword";
import { Reveal, RevealWords } from "./Reveal";

type Errors = Partial<Record<"name" | "email" | "subject" | "story", string>>;

const FIELD_CLASS =
  "font-serif mt-1.5 w-full border border-ink/25 bg-paper-bright px-3 py-2.5 text-base " +
  "text-ink placeholder:text-ink-faint transition-colors duration-150 ease-out " +
  "focus:border-stamp focus:outline-none";

/**
 * Composes the letter into a prefilled mail draft — no backend, no secrets, and
 * nothing to leak. To route through a form service instead, swap `handleSubmit`
 * for a POST to your endpoint; the markup and states below stay as they are.
 */
export function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const story = String(data.get("story") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = "We need a name to file this under.";
    if (!email) next.email = "An address, so he can write back.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "That address looks off.";
    if (!subject) next.subject = "Give the letter a subject.";
    if (!story) next.story = "The letter is empty.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      // Move focus to the first problem so keyboard and SR users land on it.
      const firstKey = Object.keys(next)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }

    const body = `${story}\n\n— ${name}\n${email}`;
    window.location.href = `mailto:${identity.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <section
      id="contact"
      className="mx-auto mt-28 max-w-[1400px] scroll-mt-24 px-5 sm:px-8 lg:px-12"
    >
      <Reveal variant="fade" as="p" className="label text-stamp">
        {contact.kicker}
      </Reveal>

      <Reveal variant="rule" as="div" delay={0.05} className="rule-thick mt-3" />

      <div className="mt-5 grid gap-12 lg:grid-cols-12 lg:gap-0">
        {/* The letter */}
        <div className="lg:col-span-7 lg:pr-12">
          <RevealWords
            as="h2"
            delay={0.1}
            text={contact.title}
            className="font-display text-balance pb-[0.1em] text-[clamp(2rem,6.4vw,5.25rem)] leading-[0.88] tracking-[-0.02em] sm:whitespace-nowrap"
          />

          <Reveal
            variant="fade"
            as="p"
            delay={0.25}
            className="font-serif mt-3 text-sm italic text-ink-soft sm:text-base"
          >
            {contact.note}
          </Reveal>

          <Reveal variant="settle" className="mt-12">
            <h3 className="font-display text-3xl leading-none">{contact.intro}</h3>
            <p className="font-serif mt-2.5 text-base leading-relaxed text-ink-soft">
              {contact.blurb}
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Your name" error={errors.name} autoComplete="name" />
                <Field
                  id="email"
                  label="Email"
                  type="email"
                  error={errors.email}
                  autoComplete="email"
                />
              </div>

              <Field id="subject" label="Subject" error={errors.subject} />

              <div>
                <label htmlFor="story" className="control text-ink-soft">
                  The story
                </label>
                <textarea
                  id="story"
                  name="story"
                  rows={6}
                  aria-invalid={errors.story ? true : undefined}
                  aria-describedby={errors.story ? "story-error" : undefined}
                  className={`${FIELD_CLASS} resize-y ${
                    errors.story ? "border-stamp" : ""
                  }`}
                />
                {errors.story && <FieldError id="story-error">{errors.story}</FieldError>}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="control press border border-ink bg-ink px-6 py-4 text-paper-bright hover:border-stamp hover:bg-stamp"
                >
                  {contact.submit} →
                </button>
                <p className="font-serif text-sm italic text-ink-faint">{contact.hint}</p>
              </div>

              {/* Status is announced, and also visible — never motion or colour alone. */}
              <p role="status" aria-live="polite" className="min-h-[1.25rem]">
                {sent && (
                  <span className="font-serif text-sm text-stamp">
                    ✓ Your mail client should be open with the letter drafted. If nothing
                    happened, write to{" "}
                    <a href={`mailto:${identity.email}`} className="link-pencil text-ink">
                      {identity.email}
                    </a>
                    .
                  </span>
                )}
              </p>
            </form>
          </Reveal>
        </div>

        {/* The back page's one surviving game. It stands alone in this column
            now — Direct Line, the Desk and Availability moved to the strip
            below, arranged the same way as everything else so this column
            doesn't run any longer than the letter beside it. */}
        <div className="lg:col-span-5 lg:col-rule lg:pl-12">
          <Reveal variant="settle" delay={0.1}>
            <Crossword />
          </Reveal>
        </div>
      </div>

      {/* The desk, laid out the way the front page's dateline boxes are: one
          row, divided by rule rather than stacked, so the three sit level
          with each other under the letter and the crossword together. */}
      <div className="mt-12 grid gap-8 border-t border-ink/15 pt-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-ink/15">
        <Reveal variant="settle" delay={0.1} className="sm:pr-8">
          <p className="label text-stamp">Direct line</p>
          <a
            href={`mailto:${identity.email}`}
            className="font-display press link-pencil mt-2 inline-block text-xl leading-tight break-all sm:text-2xl"
          >
            {identity.email}
          </a>
          <p className="font-serif mt-2 text-sm leading-relaxed text-ink-soft">
            {contact.directLineNote}
          </p>
        </Reveal>

        <Reveal variant="settle" delay={0.17} className="sm:px-8">
          <p className="label text-ink-faint">{contact.desk.title}</p>
          <p className="font-display mt-1.5 text-lg">{contact.desk.location}</p>
          <p className="font-serif mt-1 text-sm text-ink-soft">{contact.desk.note}</p>
        </Reveal>

        <Reveal variant="settle" delay={0.24} className="sm:pl-8">
          <p className="label text-ink-faint">{contact.availability.title}</p>
          <p className="font-display mt-1.5 text-lg">{contact.availability.status}</p>
          <p className="font-serif mt-1 text-sm text-ink-soft">{contact.availability.note}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ helpers */

function Field({
  id,
  label,
  error,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="control text-ink-soft">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${FIELD_CLASS} ${error ? "border-stamp" : ""}`}
      />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="font-serif mt-1.5 flex items-start gap-1.5 text-sm text-stamp">
      <span aria-hidden="true">✕</span>
      {children}
    </p>
  );
}
