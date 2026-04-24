"use client";

import { site } from "@/lib/config";

export function HeroName() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
      <p
        aria-hidden
        data-hero-kicker
        className="mb-4 font-mono text-[11px] uppercase tracking-[0.5em] text-primary glow-text"
      >
        &gt; target acquired
      </p>
      <h1
        className="font-mono text-5xl font-semibold uppercase tracking-[0.2em] text-text glow-text sm:text-6xl md:text-7xl"
        data-hero-name
      >
        {site.name}
      </h1>
      <p
        data-hero-subtitle
        className="mt-4 max-w-xl font-mono text-sm text-text-dim"
      >
        {site.role}
      </p>
    </div>
  );
}
