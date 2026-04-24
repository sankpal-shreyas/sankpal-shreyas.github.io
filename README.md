# sankpal-shreyas.github.io

🚧 **Under Construction** 🚧

Personal portfolio: cybersecurity + software + AI/ML.

Built with Next.js (App Router, static export), Tailwind v4, React Three Fiber,
GSAP, Lenis. Deploys to GitHub Pages.

## Getting started

```bash
npm install
npm run dev
# http://localhost:3000
```

Production build (what GitHub Pages serves):

```bash
npm run build
# outputs a static site to ./out/
```

## Project structure

```
app/                     # App Router pages
  page.tsx               # landing (globe → tunnel → warroom)
  projects/page.tsx
  blog/page.tsx          # list
  blog/[slug]/page.tsx   # MDX post
  contact/page.tsx       # terminal form + Cal.com
  root/page.tsx          # konami easter egg
components/
  home/                  # globe, tunnel, warroom pieces
  projects/              # project card
  blog/                  # MDX components
  contact/               # terminal + Cal embed
  shell/                 # Navbar, Footer
  providers/             # Lenis, Konami
content/
  blog/*.mdx             # posts (drop new files to publish)
  projects.ts            # typed project list
lib/
  config.ts              # single source of truth for identity/socials/links
  mdx.ts                 # MDX read helpers
public/
  me.jpg                 # YOU: drop a square headshot here
  resume.pdf             # YOU: drop your resume PDF here
  favicon.svg
  .nojekyll
```

## Editing content

Everything user-facing routes through two files:

- **`lib/config.ts`** — name, socials, availability, Cal.com link, Formspree ID,
  education, experience, CTF/certs.
- **`content/projects.ts`** — typed array of projects.

Blog posts are plain `.mdx` files in `content/blog/`. Frontmatter:

```mdx
---
title: "..."
description: "..."
date: "2026-04-22"
tags: ["ctf"]
---
```

## Easter egg

Type the Konami code anywhere on the site:

```
↑ ↑ ↓ ↓ ← → ← → B A
```

## Licence

Personal portfolio. Code MIT; content & imagery © Shreyas Sankpal.
