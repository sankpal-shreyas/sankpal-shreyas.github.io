"use client";

import { useEffect, useState, type ComponentType } from "react";
import { LocatorHUD } from "@/components/home/LocatorHUD";
import { HeroName } from "@/components/home/HeroName";
import { HeroAnimator } from "@/components/home/HeroAnimator";

function HeroFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="grid-floor absolute inset-0 opacity-30" />
      <div className="font-mono text-xs text-muted">
        <span className="terminal-cursor">initialising geosphere</span>
      </div>
    </div>
  );
}

export function Hero() {
  const [GlobeScene, setGlobeScene] = useState<ComponentType | null>(null);

  useEffect(() => {
    let alive = true;
    import("@/components/home/GlobeScene").then((mod) => {
      if (alive) setGlobeScene(() => mod.GlobeScene);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <HeroAnimator>
      <section
        id="hero"
        className="relative h-[100svh] w-full overflow-hidden bg-bg"
      >
        <div className="absolute inset-0" data-hero-canvas>
          {GlobeScene ? <GlobeScene /> : <HeroFallback />}
        </div>
        <div data-hero-hud>
          <LocatorHUD />
        </div>
        <HeroName />
        <div
          data-hero-scroll
          className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-text-dim"
        >
          <span className="opacity-60">scroll</span>
          <span className="h-6 w-px animate-pulse bg-primary" />
        </div>
      </section>
    </HeroAnimator>
  );
}
