"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/config";

const LINES = [
  "[ SCAN ] pinging node 0x00A21F…",
  "[ LOCK ] biometric signature matched",
  "[  OK  ] identity: SHREYAS SANKPAL",
  "[ GEO  ] Brooklyn, NY · 40.7128°N 74.0060°W",
];

// `site.location.latencyMs` is only the pre-measurement fallback now.
const FALLBACK_MS = site.location.latencyMs;

/**
 * Real connection latency, measured client-side. We seed it instantly from the
 * actual document load (Navigation Timing TTFB — no extra request), then refine
 * to a live round-trip by fetching a tiny same-origin asset a few times,
 * cache-busted, and taking the best sample. Falls back to the config value if
 * the API is unavailable or the requests are blocked (offline / ad blocker).
 */
function useConnectionLatency() {
  const [latency, setLatency] = useState<number>(FALLBACK_MS);

  useEffect(() => {
    let cancelled = false;

    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav) {
      const ttfb = nav.responseStart - nav.requestStart;
      if (ttfb > 0 && ttfb < 60000) setLatency(Math.round(ttfb));
    }

    const measure = async () => {
      const samples: number[] = [];
      for (let i = 0; i < 3 && !cancelled; i++) {
        const start = performance.now();
        try {
          await fetch(`/favicon.svg?p=${Date.now()}-${i}`, { cache: "no-store" });
        } catch {
          return; // blocked / offline — keep the TTFB or fallback value
        }
        samples.push(performance.now() - start);
      }
      if (cancelled || samples.length === 0) return;
      setLatency(Math.max(1, Math.round(Math.min(...samples))));
    };

    // Defer so the pings never compete with first paint or scroll.
    const ric = (window as { requestIdleCallback?: (cb: () => void) => number })
      .requestIdleCallback;
    const idle =
      typeof ric === "function"
        ? ric(() => void measure())
        : window.setTimeout(() => void measure(), 200);

    return () => {
      cancelled = true;
      const cic = (window as { cancelIdleCallback?: (h: number) => void })
        .cancelIdleCallback;
      if (idle !== undefined) {
        if (typeof cic === "function") cic(idle);
        else clearTimeout(idle);
      }
    };
  }, []);

  return latency;
}

export function LocatorHUD() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const latency = useConnectionLatency();

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
        <span className="text-accent glow-accent">{latency}ms</span>
        <span>status</span>
        <span className="text-primary glow-text">online</span>
      </div>
    </div>
  );
}
