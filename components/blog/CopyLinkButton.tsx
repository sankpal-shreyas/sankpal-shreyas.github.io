"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

// Copies the current post's URL to the clipboard — the share affordance people
// actually use, and it fits the terminal aesthetic (no third-party widgets or
// trackers). Strips any #section hash so it always copies the clean post link.
export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href.split("#")[0]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable (insecure context) — nothing to do */
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? "link copied" : "copy link to this post"}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-border px-2 py-1 font-mono text-xs text-text-dim transition-colors hover:border-primary/60 hover:text-primary"
    >
      {copied ? (
        <>
          <Check className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">copied</span>
        </>
      ) : (
        <>
          <Link2 className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">copy link</span>
        </>
      )}
    </button>
  );
}
