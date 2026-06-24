"use client";

import { useEffect, useState } from "react";

// Thin fixed bar pinned to the very top of the viewport that fills left-to-right
// as the reader moves through the article. Sits above the navbar (z-[60]) and
// rides native scroll events — which Lenis also emits — so it tracks the
// smooth-scroll glide. Purely decorative, so it's hidden from assistive tech.
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5"
      aria-hidden
    >
      <div
        className="h-full w-full origin-left bg-primary shadow-glow-sm will-change-transform"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
