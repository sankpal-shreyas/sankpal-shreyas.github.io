"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { getLenis } from "@/lib/smoothScroll";

// Floating "back to top" control. Appears once scrolled past `threshold` px
// (defaults to ~0.8 of a viewport for long pages; pass a smaller value for
// shorter pages). Rides Lenis for the smooth glide (falling back to native
// scroll — instant under reduced-motion — when Lenis isn't running).
export function ScrollToTop({ threshold }: { threshold?: number } = {}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const limit = threshold ?? window.innerHeight * 0.8;
      setVisible(window.scrollY > limit);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.0 });
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="scroll to top"
      title="scroll to top"
      className={`fixed bottom-6 right-6 z-40 inline-flex size-11 items-center justify-center rounded-md border border-border bg-bg-panel/90 text-primary backdrop-blur-sm transition-all duration-300 hover:border-primary/60 hover:shadow-glow-md ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="size-5" aria-hidden />
    </button>
  );
}
