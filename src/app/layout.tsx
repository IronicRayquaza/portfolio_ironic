import type { Metadata } from "next";
import {
  Libre_Caslon_Display,
  Libre_Caslon_Text,
  Libre_Franklin,
  JetBrains_Mono,
  Courier_Prime,
} from "next/font/google";
import { identity } from "@/lib/content";
import "./globals.css";

const caslonDisplay = Libre_Caslon_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-caslon-display",
  display: "swap",
});

const caslonText = Libre_Caslon_Text({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-caslon-text",
  display: "swap",
});

const franklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-franklin",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

/**
 * The control face. Every button, nav link, stamp and form label is set in
 * this typewriter — a case file is typed, not laid out. Regular weight only:
 * uppercase Courier at 400 with open tracking already reads as emphasis.
 */
const courier = Courier_Prime({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-courier",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${identity.name} — ${identity.role}`,
  description:
    "The personal record of a software developer. Smart contracts and the interfaces on top of them — Arweave, Solana, Aptos and ICP.",
  openGraph: {
    title: `${identity.name} — ${identity.role}`,
    description: "The personal record of a software developer.",
    type: "website",
  },
};

/**
 * Adds `.js-motion` to <html> before first paint, but only when the visitor
 * has not asked for reduced motion. Inline and blocking on purpose: if this
 * ran after paint, revealed content would flash before hiding itself.
 */
const MOTION_GATE = `
try {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-motion');
  }
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${caslonDisplay.variable} ${caslonText.variable} ${franklin.variable} ${jetbrains.variable} ${courier.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_GATE }} />
      </head>
      <body className="relative min-h-screen bg-paper text-ink">
        <a
          href="#main"
          className="control sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-3 focus:text-paper-bright"
        >
          Skip to content
        </a>
        {children}
        <div className="grain fixed" aria-hidden="true" />
      </body>
    </html>
  );
}
