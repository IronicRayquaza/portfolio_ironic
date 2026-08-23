"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Reveal-on-scroll primitive.
 *
 * Elements start in their revealed state in the markup — the CSS only hides
 * them while `.js-motion` is on <html> AND `.is-revealed` is absent. So with
 * JS off, or reduced motion on, everything is simply visible. Nothing flashes.
 */

type Variant = "settle" | "words" | "develop" | "rule" | "stamp" | "fade";

const VARIANT_CLASS: Record<Variant, string> = {
  settle: "rv-settle",
  words: "rv",
  develop: "rv-develop",
  rule: "rv-rule",
  stamp: "rv-stamp",
  fade: "rv-fade",
};

type RevealProps = {
  /** Optional — a `rule` divider is an empty element that animates its own border. */
  children?: ReactNode;
  /** Which motion this element uses. */
  variant?: Variant;
  /** Seconds to hold before the transition starts. */
  delay?: number;
  as?: ElementType;
  className?: string;
  /** Fraction of the element that must be visible to trigger. */
  threshold?: number;
};

export function Reveal({
  children,
  variant = "settle",
  delay = 0,
  as: Tag = "div",
  className = "",
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver, or motion is off: show it and stop.
    if (
      typeof IntersectionObserver === "undefined" ||
      !document.documentElement.classList.contains("js-motion")
    ) {
      el.classList.add("is-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref}
      className={`${VARIANT_CLASS[variant]} ${className}`.trim()}
      style={delay ? ({ "--rv-delay": `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

/**
 * Headline that assembles word by word. Splits on whitespace and hands each
 * word its index so CSS can stagger by 40ms without any JS timers.
 */
export function RevealWords({
  text,
  delay = 0,
  as: Tag = "h2",
  className = "",
}: {
  text: string;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const words = text.split(" ");

  return (
    <Reveal variant="words" delay={delay} as={Tag} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="rv-word" style={{ "--i": i } as React.CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Reveal>
  );
}
