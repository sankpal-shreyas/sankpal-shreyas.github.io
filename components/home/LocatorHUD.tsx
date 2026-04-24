"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/config";

const LINES = [
  "[ SCAN ] pinging node 0x00A21F…",
  "[ LOCK ] biometric signature matched",
  "[  OK  ] identity: SHREYAS SANKPAL",
  "[ GEO  ] Brooklyn, NY · 40.7128°N 74.0060°W",
];

export function LocatorHUD() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisibleLines(LINES);
      return;
    }
    (async () => {
      for (let i = 0; i < LINES.length; i++) {
        await new Promise((r) => setTimeout(r, 550));
        if (cancelled) return;
        setVisibleLines((prev) => [...prev, LINES[i]]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-4 top-20 z-10 w-[340px] max-w-[80vw] font-mono text-[11px] leading-6 text-primary/90 sm:left-6"
    >
      <div className="mb-2 flex items-center gap-2 border-b border-primary/30 pb-1 uppercase tracking-[0.3em] text-text-dim">
        <span className="size-1.5 animate-pulse rounded-full bg-primary" />
        <span>tactical.locate</span>
      </div>
      <ul className="space-y-1">
        {visibleLines.map((line, i) => (
          <li key={i} className="whitespace-pre">
            {line}
          </li>
        ))}
        {visibleLines.length < LINES.length && (
          <li className="terminal-cursor" />
        )}
      </ul>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-primary/20 pt-2 text-[10px] uppercase tracking-widest text-text-dim">
        <span>lat</span>
        <span className="text-text">{site.location.lat.toFixed(4)}°</span>
        <span>long</span>
        <span className="text-text">{site.location.lng.toFixed(4)}°</span>
        <span>latency</span>
        <span className="text-accent glow-accent">{site.location.latencyMs}ms</span>
        <span>status</span>
        <span className="text-primary glow-text">online</span>
      </div>
    </div>
  );
}
