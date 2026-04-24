export type Project = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  stack: string[];
  tags: ("security" | "ai-ml" | "backend" | "fullstack")[];
  description: string;
  highlights: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "saaransh",
    title: "SAARANSH — AI Minutes of Meeting",
    tagline: "Fine-tuned BART-large for long-transcript meeting summarization.",
    year: "2024",
    stack: ["Python", "PyTorch", "BART", "Node.js", "Puppeteer", "React", "AWS", "AKS"],
    tags: ["ai-ml", "fullstack"],
    description:
      "Led a 4-person team to build an end-to-end AI meeting-minutes generator. Fine-tuned BART-large on AMI and ICSI datasets and extended the effective context from 1024 to 8000+ tokens using n-gram overlap stitching. Deployed as microservices behind a Node.js/Puppeteer bot that joins Google Meet calls and streams transcripts in real time.",
    highlights: [
      "Context extension 1024 → 8000+ tokens via n-gram overlap.",
      "Autonomous Google Meet bot (Node + Puppeteer).",
      "2 copyrights + merit position at Aavishkar Research Convention 2024.",
    ],
  },
  {
    slug: "tracing-e-messages",
    title: "Tracing E-Messages via Digital Stamping",
    tagline:
      "Elliptic-curve signatures + smart contracts to attribute electronic messages.",
    year: "2022",
    stack: ["Solidity", "Node.js", "React", "Ethereum", "ECDSA"],
    tags: ["security"],
    description:
      "Smart India Hackathon prototype — a system for law-enforcement to trace the origin and propagation of flagged electronic messages using ECDSA digital signatures anchored to a blockchain. Built the API gateway for smart-contract integration and a React dashboard for forensics analysts.",
    highlights: [
      "ECDSA-signed envelopes anchored on-chain.",
      "API gateway bridging Node ↔ Solidity contracts.",
      "Poster at Conference on Technologies for Future Cities 2022.",
    ],
  },
];
