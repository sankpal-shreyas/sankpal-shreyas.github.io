"use client";

import { useEffect, useState, type MouseEvent } from "react";
import type { TocItem } from "@/lib/mdx";
import { getLenis } from "@/lib/smoothScroll";

// Sticky table of contents shown in the right margin on wide (xl+) screens.
// Highlights the section currently in view via IntersectionObserver and glides
// to a heading on click (through Lenis when it's running). Hidden for posts with
// too few headings to be worth the chrome.
export function TableOfContents({ headings }: { headings: TocItem[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (headings.length === 0) return;
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Highlight the topmost heading currently inside the upper band.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-112px 0px -70% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  const onClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    setActiveId(id);
    history.replaceState(null, "", `#${id}`);
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(el, { offset: -112, duration: 1.0 });
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="table of contents"
      className="fixed right-6 top-32 z-30 hidden max-h-[62vh] w-52 overflow-auto xl:block"
    >
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
        on this page
      </p>
      <ul className="font-mono text-xs">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => onClick(e, h.id)}
              style={{ paddingLeft: h.depth === 3 ? 24 : 12 }}
              className={`block border-l-2 py-1 transition-colors ${
                activeId === h.id
                  ? "border-primary text-primary glow-text"
                  : "border-border text-text-dim hover:border-primary/50 hover:text-primary"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
