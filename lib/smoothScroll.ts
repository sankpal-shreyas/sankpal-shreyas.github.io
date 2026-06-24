import type Lenis from "lenis";

// Holds the live Lenis instance created by SmoothScrollProvider so other
// client components (e.g. the home scene's snap-to-warroom) can drive scroll
// through Lenis instead of fighting it with native scrollTo.
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}
