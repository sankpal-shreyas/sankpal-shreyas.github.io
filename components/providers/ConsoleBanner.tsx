"use client";

import { useEffect } from "react";
import { site } from "@/lib/config";

// Prints a banner + hint to the devtools console. Anyone technical enough to
// open the console — i.e. the audience this site is for — gets a breadcrumb to
// the hidden root shell.
export function ConsoleBanner() {
  useEffect(() => {
    const banner =
      "color:#39ff14;font-family:monospace;font-weight:700;text-shadow:0 0 8px #39ff1466";
    const dim = "color:#9fbf9f;font-family:monospace";
    const accent = "color:#ffb000;font-family:monospace";

    console.log(
      `%c
 ┌─[ root@shreyas ]─────────────────────────────┐
 │   >_  you opened the console. of course.      │
 └───────────────────────────────────────────────┘`,
      banner,
    );
    console.log(`%c→ ${site.socials.github}`, dim);
    console.log(
      "%c// psst — there's a hidden root shell. the contra code opens it:\n//    ↑ ↑ ↓ ↓ ← → ← → b a",
      accent,
    );
    console.log("%c// or press ?  anywhere for the shortcut list.", dim);
  }, []);

  return null;
}
