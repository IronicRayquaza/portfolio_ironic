/**
 * Every piece of copy on the site lives here. Edit this file, not the components.
 */

export const identity = {
  name: "Satyam Singh",
  handle: "IronicRayquaza",
  role: "Full-Stack Engineer",
  location: "Uttar Pradesh, India",
  caseNo: "4698",
  volume: "Vol. I",
  established: "Est. 2021",
  edition: "The On-Chain Edition",
  strapline: "The Personal Record of a Software Developer",
  price: "Price: One Gas Fee",
  email: "satyam4698@gmail.com",
  resume: "/assets/Satyam_Singh_Resume.pdf",
  resumeUpdated: "October 2026",
  /** Swap for "/images/portrait.jpg" once you drop a real photo in public/images. */
  portrait: "/images/prorororo.png",
} as const;

export const nav = [
  { label: "Evidence", href: "#evidence" },
  { label: "Stack", href: "#forensics" },
  { label: "Record", href: "#caselog" },
  { label: "Blotter", href: "#blotter" },
  { label: "Contact", href: "#contact" },
] as const;

/* ---------------------------------------------------------------- front page */

export const frontPage = {
  kicker: "Filed under: Open Investigations",
  status: "Findings Published",
  headline: "A developer in Uttar Pradesh who builds on chain — and ships the whole thing.",
  standfirst:
    "Four years on the record: Satyam Singh builds interfaces and the things behind them. Most of 2026 went on Chandigarh University's Lucknow campus site as its lead frontend engineer, alongside smart contract work across Arweave, Solana, Aptos and ICP.",
  byline: "The Investigation Desk",
  bylineNote: "Reporting from Uttar Pradesh · Computer Science, Chandigarh University",
  ctaPrimary: { label: "Read the work", href: "#evidence" },
  ctaSecondary: { label: "Get in touch", href: "#contact" },
  resumeLabel: "On file",
  resumeCta: "Résumé",
  /** The four data boxes under the hero. */
  dateline: [
    { value: `No. ${identity.caseNo}`, label: "Edition · first printing" },
    { value: "5 chains", label: "Arweave · Solana · Aptos · ICP · Tezos" },
    { value: "Global", label: "Circulation · remote-friendly" },
    { value: "Late Final", label: "Ships when it's audited" },
  ],
  plateCaption: "Pictured: the subject, mid-deployment.",
  body: [
    "He likes the part where an idea becomes something people can actually use. Most days that means React and TypeScript on the surface, with Solidity, Lua or Move underneath and the chain doing the bookkeeping.",
    "When the build calls for it he reaches for Python — TensorFlow, OpenCV — or a Flask service and a Firebase layer. Four years of Discord bots taught him the unglamorous half: moderation, scaling and keeping things up when a server has thousands of people in it.",
  ],
} as const;

/* ------------------------------------------------------------------ evidence */

import type { ArtKey } from "@/components/exhibit-art";

export type Exhibit = {
  title: string;
  client: string;
  domain: string;
  description: string;
  stack: readonly string[];
  year: string;
  credit?: string;
  /** A small, quieter suffix printed inside the stamp — e.g. a vote count. */
  creditNote?: string;
  live?: string;
  /** Omitted when the work is closed-source; the Source link then doesn't print. */
  repo?: string;
  /** Which evidence illustration fills this exhibit's plate. */
  art: ArtKey;
};

export const exhibits: readonly Exhibit[] = [
  {
    title: "Chandigarh University, Lucknow",
    client: "Chandigarh University",
    domain: "chandigarh-university-lk.vercel.app",
    description:
      "The university's public site, replacing a PHP build a decade out of date. Lead frontend on a team of five and the biggest contributor to it — 351 of 777 commits — across the homepage, the course and admissions pages, and the shared components all 74 pages are built from. Built to stay quick at around a million users a month.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Framer Motion", "amCharts"],
    year: "2026",
    credit: "Frontend",
    creditNote: "· 1M users/mo",
    live: "https://chandigarh-university-lk.vercel.app",
    art: "diorama",
  },
  {
    title: "PokeWidget",
    client: "Personal",
    domain: "ironicrayquaza.github.io/Pokewidget",
    description:
      "Animated Pokémon that live on your Android home screen — any sprite from any game, shiny or not, with a trainer beside it if you want one. The phone, web and desktop versions all read the same catalogue, so they always show the same thing. No ads, no accounts, nothing tracked.",
    stack: ["Kotlin", "Android", "TypeScript", "Tauri"],
    year: "2026",
    credit: "Solo",
    creditNote: "· 221 users",
    live: "https://ironicrayquaza.github.io/Pokewidget/",
    repo: "https://github.com/IronicRayquaza/Pokewidget",
    art: "popup",
  },
  {
    title: "ArDacity UI",
    client: "Arweave India · Cohort 4",
    domain: "ardacityui.arweave.net",
    description:
      "A functional UI and Web3 component library that lives entirely on chain. Built during the Arweave India Hackerhouse, where the subject placed in the top 10 developers — components are served from permaweb storage rather than a CDN, so the library cannot rot.",
    stack: ["React", "TypeScript", "Arweave", "AO", "Tailwind"],
    year: "2025",
    credit: "Top 10 · Hackerhouse",
    live: "https://ardacityui.arweave.net",
    repo: "https://github.com/IronicRayquaza/ardacity-builder_ironic",
    art: "typecase",
  },
  {
    title: "Oleidian",
    client: "Personal · Design tooling",
    domain: "glyph-web-ui-blue.vercel.app",
    description:
      "Git for Figma. Repositories, visual commits, branches and pull requests, run against a design file instead of a codebase — so a change arrives as a side-by-side diff rather than a file called final_v2_ACTUALLY_final. A branch touches the one component it needs instead of duplicating the whole document, and review happens in the same structured shape developers have had for years.",
    stack: ["Next.js", "TypeScript", "Figma API", "Tailwind"],
    year: "2026",
    credit: "Solo",
    live: "https://glyph-web-ui-blue.vercel.app",
    art: "lightbox",
  },
  {
    title: "Unify",
    client: "Personal",
    domain: "unify-phi.vercel.app",
    description:
      "One always-on-top desktop widget over every music service. Spotify, YouTube Music, SoundCloud and Apple Music all play through the same overlay, playlists migrate between them on metadata match rather than vendor lock-in, and the whole thing is driven from the keyboard — so switching platforms stops meaning rebuilding a library by hand.",
    stack: ["Next.js", "TypeScript", "OAuth 2.0", "Tailwind"],
    year: "2026",
    credit: "Peerlist",
    creditNote: "▲ 15",
    live: "https://unify-phi.vercel.app",
    art: "deck",
  },
  {
    title: "Solana Statistics",
    client: "Personal",
    domain: "github.com/IronicRayquaza",
    description:
      "An indexer that traces your Solana footprint — it walks transaction history and turns it into something readable, so a wallet stops being a wall of signatures.",
    stack: ["Solana", "Rust", "React", "Web3.js"],
    year: "2024",
    credit: "Solo",
    repo: "https://github.com/IronicRayquaza/solana_bounty",
    art: "ticker",
  },
  {
    title: "Uni Hub",
    client: "Hack with Tricity",
    domain: "uni-event-hub-frontend.vercel.app",
    description:
      "An event hosting platform for colleges, with participation tracked on Ethereum and attendance issued as NFT certificates. Organisers host, sponsors fund, attendees mint proof they were there. Took first place.",
    stack: ["React", "Ethereum", "Solidity", "IPFS", "Express"],
    year: "2025",
    credit: "Winner · Hackathon",
    live: "https://uni-event-hub-frontend.vercel.app/",
    repo: "https://github.com/DivyanshuJswl/uni-event-hub-frontend",
    art: "seal",
  },
];

/* ---------------------------------------------------- side evidence: packages */

export type Package = {
  title: string;
  description: string;
  /** Present when the entry has a live site as well as a repo. */
  live?: string;
  repo: string;
};

export const packages: readonly Package[] = [
  {
    title: "Damascus",
    description:
      "A Discord auth and moderation bot wired into the Volta testnet — wallet ownership becomes a role.",
    live: "https://discord.com/oauth2/authorize?client_id=1261033470940020808",
    repo: "https://github.com/IronicRayquaza/Damascus-Auth-Bot",
  },
  {
    title: "AO Trading Bot",
    description:
      "An APM package on Arweave that gives Lua scripts trading primitives out of the box.",
    repo: "https://github.com/IronicRayquaza/Package_on_Arweave_AO",
  },
  {
    title: "Detective Racoon",
    description: "A web-scraping browser extension written in JavaScript.",
    repo: "https://github.com/IronicRayquaza/Detective_Racoon-aka-Darkrai",
  },
  {
    title: "Dynamic Comments",
    description:
      "Floating, dynamic-island style comment previews while watching YouTube in the browser.",
    repo: "https://github.com/IronicRayquaza/Float_comments",
  },
];

export const papers = [
  {
    title:
      "Smart Contracts in Blockchain Technology: Working with Solidity Programming",
    description:
      "An exploration of blockchain trust models in government and public services.",
  },
  {
    title: "Plant Disease Detection using Machine Learning",
    description: "Deep learning models applied to classifying disease in plants.",
  },
] as const;

/* ------------------------------------------------------------------ forensics */

export type Substance = {
  name: string;
  code: string;
  detected: string;
  finding: "Primary tool" | "Comfortable" | "In training" | "Trace amount";
};

export const substances: readonly Substance[] = [
  { name: "JavaScript / TS", code: "JSTS", detected: "Most days", finding: "Primary tool" },
  { name: "React + Vite", code: "RVT", detected: "Most days", finding: "Primary tool" },
  { name: "Python", code: "PY", detected: "Most days", finding: "Primary tool" },
  { name: "Solidity", code: "SOL", detected: "In projects", finding: "Primary tool" },
  { name: "Arweave / AO", code: "AR", detected: "In projects", finding: "Primary tool" },
  { name: "Solana", code: "SLN", detected: "In projects", finding: "Comfortable" },
  { name: "Aptos · Move", code: "APT", detected: "Currently", finding: "Comfortable" },
  { name: "ICP · Motoko", code: "ICP", detected: "In projects", finding: "Comfortable" },
  { name: "Firebase", code: "FBS", detected: "Most days", finding: "Comfortable" },
  { name: "MongoDB / SQL", code: "DB", detected: "When needed", finding: "Comfortable" },
  { name: "Express · Flask", code: "API", detected: "In projects", finding: "Comfortable" },
  { name: "Next.js", code: "NEXT", detected: "Most days", finding: "Primary tool" },
  { name: "Framer Motion", code: "FM", detected: "In projects", finding: "Comfortable" },
  { name: "Kotlin · Android", code: "KT", detected: "In projects", finding: "In training" },
  { name: "TensorFlow", code: "TF", detected: "Occasionally", finding: "In training" },
  { name: "OpenCV", code: "CV", detected: "Occasionally", finding: "In training" },
  { name: "C++", code: "CPP", detected: "Coursework", finding: "In training" },
  { name: "Docker", code: "DCKR", detected: "Learning", finding: "Trace amount" },
  { name: "AWS", code: "AWS", detected: "Learning", finding: "Trace amount" },
];

export const forensicsNote =
  "Findings are illustrative — what he reaches for day to day, not a ranking.";

/* -------------------------------------------------------------------- caselog */

export type CaseEntry = {
  event: string;
  date: string;
  outcome: string;
  detail: string;
  /** The live site, when the entry is client work worth clicking through to. */
  href?: string;
  verdict: "Winner" | "Finalist" | "Shortlisted" | "Selected" | "Mentor" | "Delivered";
};

export const caseLog: readonly CaseEntry[] = [
  {
    event: "Chandigarh University, Lucknow",
    date: "Mar — Oct 2026",
    outcome: "Frontend on the campus rebuild",
    detail:
      "Seven months replacing the campus's PHP site. Frontend engineer on a team of five and the largest contributor of them — 351 of 777 commits — across the landing page, the programme and admissions pages, and the shared UI underneath all 74 routes.",
    href: "https://chandigarh-university-lk.vercel.app",
    verdict: "Delivered",
  },
  {
    event: "Park East by Navdesh Group",
    date: "January 2026",
    outcome: "Sales site for a Mohali development",
    detail:
      "Freelance. Built the marketing site for a 1–3 BHK residential project in Kharar — specifications, gallery, amenities, location advantages and the site-visit enquiry form that feeds their sales desk.",
    href: "https://www.parkeastbynavdeshgroup.com",
    verdict: "Delivered",
  },
  {
    event: "Lauffer Vision India",
    date: "8 July 2025",
    outcome: "Corporate site for an AI sorting firm",
    detail:
      "Freelance. Built the site for a Bhopal manufacturer of sensor-based sorting machines, covering their AI sorting solutions across agriculture, recycling and mining alongside the service and contact desks.",
    href: "https://www.lauffervisionindia.in",
    verdict: "Delivered",
  },
  {
    event: "Arweave India Hackerhouse",
    date: "Apr — May 2025",
    outcome: "Top 10 developers",
    detail:
      "Cohort 4. Shipped ArDacity UI, a Web3 component library served entirely from the permaweb.",
    verdict: "Selected",
  },
  {
    event: "Hack with Tricity",
    date: "March 2025",
    outcome: "First place",
    detail:
      "Built Uni Hub — an event hosting platform issuing NFT participation certificates on chain.",
    verdict: "Winner",
  },
  {
    event: "Hashbite",
    date: "October 2024",
    outcome: "Tech team · mentor",
    detail:
      "Guided students through Web3 and the ICP network, supporting 50+ deployments to ICP mainnet.",
    verdict: "Mentor",
  },
  {
    event: "Hashmine",
    date: "April 2024",
    outcome: "Deployed to mainnet",
    detail:
      "Shipped TokenVerse on ICP — users could mint and trade testnet tokens on the live network.",
    verdict: "Finalist",
  },
  {
    event: "Hack Mole 5.0",
    date: "February 2024",
    outcome: "Finals at NIT Jalandhar",
    detail:
      "Built FWRS, a catering platform redirecting surplus food to reduce waste.",
    verdict: "Finalist",
  },
  {
    event: "Flutter Peer-to-Peer Workshop",
    date: "February 2024",
    outcome: "Led a team of four",
    detail:
      "Ran a Flutter bootcamp at Chandigarh University, taking students from zero to a working mobile app.",
    verdict: "Mentor",
  },
  {
    event: "Hack Octo 2.0",
    date: "October 2023",
    outcome: "Top 10 teams",
    detail:
      "Built ADD, a marketplace where developers and designers meet project demand.",
    verdict: "Finalist",
  },
  {
    event: "Smart India Hackathon",
    date: "September 2023",
    outcome: "Second round",
    detail:
      "Shortlisted at inter-college level, working on improving education quality in rural areas.",
    verdict: "Shortlisted",
  },
];

/* --------------------------------------------------------------------- ledger */

export const ledger = [
  {
    period: "2021 — Now",
    role: "Discord Active Developer",
    org: "Independent",
    note:
      "First recorded appearance. Built and deployed bots for administration and moderation, then spent four years learning what breaks when a server gets large — security, rate limits and scaling under real load.",
  },
  {
    period: "Jun — Jul 2023",
    role: "Frontend Intern",
    org: "Dabotics Pvt. Ltd.",
    note:
      "Worked as a developer building interfaces and wireframes, and tuning sites to stay smooth across devices and slower networks.",
  },
  {
    period: "Jun — Aug 2024",
    role: "Blockchain Intern",
    org: "Metacrafters",
    note:
      "Built DApps and a cross-chain gateway enabling chain fusion across networks. Awarded a scholarship for completing the project track early.",
  },
  {
    period: "2023 — Now",
    role: "B.E. Computer Science",
    org: "Chandigarh University",
    note:
      "Currently a junior. Coursework in systems and algorithms alongside the on-chain work, plus two published research papers.",
  },
] as const;

/* -------------------------------------------------------------------- contact */

export const wireServices = [
  { label: "GitHub", handle: "IronicRayquaza", href: "https://github.com/IronicRayquaza" },
  { label: "LinkedIn", handle: "Satyam Singh", href: "https://www.linkedin.com/in/satyam-singh4698/" },
  { label: "Twitter", handle: "@satyams60519097", href: "https://twitter.com/satyams60519097" },
  { label: "LeetCode", handle: "IronicRayquaza", href: "https://leetcode.com/u/IronicRayquaza/" },
  { label: "Instagram", handle: "satyam_4698", href: "https://www.instagram.com/satyam_4698" },
  { label: "Discord", handle: "The CU Lounge", href: "https://discord.gg/sxvdN2SYCf" },
  { label: "Reddit", handle: "IronicRayquaza", href: "https://www.reddit.com/user/IronicRayquaza/" },
  {
    label: "Spotify",
    handle: "Ironic",
    href: "https://open.spotify.com/user/w3scx01h6zxms2namozfoi4mw",
  },
] as const;

export const contact = {
  kicker: "Submit a Tip",
  title: "Letters & Commissions",
  note: "The desk is open for select work — 2026",
  intro: "Put it in writing",
  blurb:
    "A project in mind, a role to fill, or just a good question — send it through and he'll get back to you.",
  hint: "Usually replies within 24 hours",
  submit: "Send the letter",
  directLineNote:
    "For commissions, contracts, internships, and arguments about which chain wins.",
  desk: {
    title: "The Desk",
    location: "Uttar Pradesh, India",
    note: "IST — working with teams worldwide, remote-first.",
  },
  availability: {
    title: "Availability",
    status: "Internships & freelance",
    note: "Studying full-time at Chandigarh University, so he takes on select projects alongside it.",
  },
} as const;

export const colophon = {
  blurb:
    "A blockchain and Web3 developer in Uttar Pradesh, India. Writing contracts and the interfaces that sit on them — across Arweave, Solana, Aptos and ICP. This broadsheet is hand-set in Caslon and Franklin.",
  rights: `© ${new Date().getFullYear()} The Satyam Singh Times · All rights reserved · Printed in Uttar Pradesh`,
} as const;

/* -------------------------------------------------------------------- blotter
   The open-source record. Figures below were read off the public profile on
   23 August 2026; the contribution calendar itself is fetched live in
   `lib/github.ts` and only falls back to a snapshot if GitHub is unreachable.
   ============================================================================ */

export const blotter = {
  kicker: "Open Source · Filed Daily",
  title: "The Blotter",
  note: "Every commit, review and merge on the public record — github.com/IronicRayquaza",

  profile: "https://github.com/IronicRayquaza",

  /** The desks the blotter switches between. Order is the order of the rail. */
  desks: [
    {
      id: "activity",
      label: "Activity",
      note: "A year of the public record, printed as a punch card.",
    },
    {
      id: "repositories",
      label: "Repositories",
      note: "Everything on the account, most recently worked first.",
    },
    {
      id: "filings",
      label: "Filings",
      note: "Work filed against other people's codebases, and what was accepted.",
    },
    {
      id: "languages",
      label: "Languages",
      note: "What the holdings are actually written in.",
    },
  ],

  /** GitHub achievements, printed as commendations in the margin. */
  commendations: [
    { name: "Pull Shark", tier: "×2", note: "Merged pull requests, repeatedly" },
    { name: "Pair Extraordinaire", tier: "", note: "Co-authored commits" },
    { name: "Quickdraw", tier: "", note: "Issue or PR closed inside five minutes" },
  ],

  /** The headline contribution — the largest codebase on the record. */
  lead: {
    label: "The Case of Record",
    owner: "Osmantic",
    name: "ODS",
    href: "https://github.com/Osmantic/ODS",
    blurb:
      "A self-hosted AI server — LLM inference, chat, voice, agents, workflows, RAG and image generation on your own machine. The subject filed twenty-three pull requests against it and had ten accepted, most of them in the places nobody volunteers for: the Windows CLI, the installer, and the test harness.",
    stats: [
      { value: "4,645", label: "Stars" },
      { value: "704", label: "Forks" },
      { value: "23", label: "Filed" },
      { value: "10", label: "Accepted" },
    ],
    /** The docket — accepted filings, most recent first, verbatim from the log. */
    docket: [
      { no: "2212", kind: "fix", title: "Pin validated remote-provider addresses", area: "security" },
      { no: "1877", kind: "fix", title: "STRICT mode test coverage and tier-aware model in first-boot-demo", area: "tests" },
      { no: "1853", kind: "chore", title: "Contributor guidance, silent-skip in runtime check, jq guard", area: "docs" },
      { no: "1759", kind: "fix", title: "ODS CLI 'model' subcommand parity in ods.ps1", area: "windows" },
      { no: "1758", kind: "fix", title: "Register-ScheduledTask access denied for standard users", area: "windows" },
      { no: "1743", kind: "feat", title: "External LLM backend connectivity check in ods doctor", area: "cli" },
      { no: "1735", kind: "fix", title: "False failures in test-stack.sh --quick — bearer auth, dynamic ports", area: "tests" },
      { no: "1700", kind: "feat", title: "Enable and disable commands in ods.ps1", area: "windows" },
      { no: "1690", kind: "fix", title: "Disk free-space check probes INSTALL_DIR, not hardcoded $HOME", area: "installer" },
      { no: "1653", kind: "feat", title: "Reuse validated Ollama and LM Studio models", area: "installer" },
    ],
  },

  /** Secondary filings — the rest of the upstream work. */
  alsoFiled: [
    {
      name: "RuffledZest / ardacity-builder",
      href: "https://github.com/RuffledZest/ardacity-builder",
      count: "12 merged",
      note: "The ArDacity component builder — Arweave AO components, Botega liquidity, staking, ArNS and permaweb profiles, shipped across a run of twelve pull requests.",
    },
    {
      name: "azlan-syed / screen-pet-in-python",
      href: "https://github.com/azlan-syed/screen-pet-in-python",
      count: "1 merged",
      note: "A desktop pet with drag, follow, wander and blink — contributed during Hacktoberfest.",
    },
  ],
} as const;

