"use client";

import { useEffect } from "react";

const IDLE_MS = 30000;

// After a stretch of inactivity, briefly run the CRT `flicker` animation on the
// page for a "the signal dipped" beat. Skipped entirely for reduced-motion.
export function IdleGlitch() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let idleTimer = 0;
    let clearTimer = 0;

    const glitch = () => {
      document.body.classList.add("crt-flicker");
      clearTimer = window.setTimeout(() => {
        document.body.classList.remove("crt-flicker");
        schedule();
      }, 700);
    };

    const schedule = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(glitch, IDLE_MS);
    };

    const onActivity = () => {
      document.body.classList.remove("crt-flicker");
      window.clearTimeout(clearTimer);
      schedule();
    };

    const events = [
      "pointermove",
      "pointerdown",
      "keydown",
      "wheel",
      "touchstart",
      "scroll",
    ] as const;
    events.forEach((ev) =>
      window.addEventListener(ev, onActivity, { passive: true }),
    );
    schedule();

    return () => {
      window.clearTimeout(idleTimer);
      window.clearTimeout(clearTimer);
      events.forEach((ev) => window.removeEventListener(ev, onActivity));
      document.body.classList.remove("crt-flicker");
    };
  }, []);

  return null;
}
