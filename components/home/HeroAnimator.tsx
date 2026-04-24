"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroAnimator({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const triggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      const name = container.querySelector<HTMLElement>("[data-hero-name]");
      const subtitle = container.querySelector<HTMLElement>(
        "[data-hero-subtitle]",
      );
      const kicker = container.querySelector<HTMLElement>("[data-hero-kicker]");
      const hud = container.querySelector<HTMLElement>("[data-hero-hud]");
      const scroll = container.querySelector<HTMLElement>("[data-hero-scroll]");
      const canvas = container.querySelector<HTMLElement>("[data-hero-canvas]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);

      if (kicker) tl.to(kicker, { opacity: 0, y: -20 }, 0);
      if (name)
        tl.to(
          name,
          {
            scale: 0.35,
            y: -160,
            letterSpacing: "0.1em",
            ease: "power2.inOut",
          },
          0,
        );
      if (subtitle) tl.to(subtitle, { opacity: 0, y: -20 }, 0);
      if (hud) tl.to(hud, { opacity: 0, x: -40 }, 0);
      if (scroll) tl.to(scroll, { opacity: 0, y: 20 }, 0);
      if (canvas) tl.to(canvas, { scale: 1.2, opacity: 0.35 }, 0);
    }, container);

    return () => {
      triggers.forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {children}
    </div>
  );
}
