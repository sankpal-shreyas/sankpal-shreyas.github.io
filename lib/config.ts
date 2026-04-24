export const site = {
  name: "Shreyas Sankpal",
  handle: "shreyas-sankpal",
  tagline: "Software & Security",
  role: "Software & Security · MS Cybersecurity @ NYU",
  bio:
    "Backend engineer turned security grad student. Previously shipped Python/FastAPI on GCP; now building at the seam of cybersecurity, software, and AI/ML.",
  availability: {
    enabled: true,
    text: "AVAILABLE — Summer 2026 SWE/Security Intern",
  },
  location: {
    city: "Brooklyn, NY",
    lat: 40.7128,
    lng: -74.006,
    latencyMs: 42,
  },
  socials: {
    github: "https://github.com/Shreyas582",
    linkedin: "https://linkedin.com/in/shreyas-sankpal",
    email: "ce.shreyas@gmail.com",
  },
  cal: {
    link: "shreyas-sankpal/15min",
  },
  formspree: {
    id: "mrerrjdb",
  },
  resumePath: "/resume.pdf",
  ogImage: "/og.png",
  baseUrl: "https://shreyas-sankpal.github.io",
} as const;

export type SiteConfig = typeof site;

export const navLinks = [
  { href: "/", label: "home" },
  { href: "/projects", label: "projects" },
  { href: "/blog", label: "blog" },
  { href: "/contact", label: "contact" },
] as const;

export const education = [
  {
    school: "New York University, Tandon School of Engineering",
    degree: "M.S. Cybersecurity",
    period: "Sep 2025 – May 2027",
    detail: "GPA 4.0 · InfoSec & Privacy, AppSec, ML, Cloud, Post-Quantum Crypto",
  },
  {
    school: "University of Mumbai",
    degree: "B.Tech Computer Engineering",
    period: "Dec 2020 – May 2024",
    detail:
      "CGPA 9.17/10 · Specialization in Network & Info Security · Honors in Blockchain",
  },
] as const;

export const experience = [
  {
    company: "Impact Analytics",
    role: "Software Engineer (Backend · Python)",
    period: "May 2024 – Jun 2025",
    location: "Bengaluru, India",
    bullets: [
      "Built FastAPI services on GCP (BigQuery, Cloud Run/Tasks/Scheduler, Pub/Sub) with PostgreSQL.",
      "Led a client-onboarding automation initiative — 70%+ reduction in manual dev work; spot award.",
      "Migrated ELK → Grafana observability across 10+ SaaS products.",
    ],
  },
  {
    company: "Coditas",
    role: "Associate Software Engineer (Backend · Node)",
    period: "Jan 2024 – Apr 2024",
    location: "Pune, India",
    bullets: [
      "Intensive full-stack program with backend specialization in Node.js/TypeScript.",
      "Capstone: secure REST APIs with JWT + OAuth2 role-based access.",
    ],
  },
  {
    company: "Cyber Secured India",
    role: "Cybersecurity & Digital Forensics Intern",
    period: "Nov 2022 – Feb 2023",
    location: "Navi Mumbai, India",
    bullets: [
      "20+ labs on HackTheBox & PortSwigger using nmap, Burp, Metasploit, Wireshark.",
      "Contributed as Vulnerable Machine Developer — shipped 5+ intentionally vulnerable apps for CTFs.",
    ],
  },
] as const;

export const ctfAndCerts = [
  { label: "HackTheBox", value: "20+ labs" },
  { label: "PortSwigger", value: "Web Security Academy" },
  { label: "Hackathons", value: "Smart India · KAVACH 2.0 · DeepBlue" },
  { label: "NYU OSIRIS Lab", value: "Member" },
  { label: "Certifications", value: "Postman API Student Expert · freeCodeCamp" },
] as const;
