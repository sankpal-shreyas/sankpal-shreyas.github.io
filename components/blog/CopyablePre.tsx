"use client";

import { useRef, useState, type ComponentProps } from "react";
import { Check, Copy } from "lucide-react";

// Drop-in replacement for the MDX <pre> that adds a hover-revealed copy button.
// Reads the rendered code via textContent (rehype-pretty-code keeps the source
// newlines between line spans), so no separate copy of the source is needed.
export function CopyablePre(props: ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    const text = ref.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text.replace(/\n$/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — nothing to do.
    }
  };

  return (
    <div className="group relative my-6">
      <pre
        ref={ref}
        tabIndex={0}
        role="region"
        aria-label="code block"
        className="overflow-x-auto rounded-md border border-border bg-bg-panel p-4 font-mono text-[13px] leading-6 text-text focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/60"
        {...props}
      />
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "copied" : "copy code"}
        className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-sm border border-border bg-bg/80 px-2 py-1 font-mono text-[11px] text-text-dim opacity-0 backdrop-blur-sm transition-all hover:border-primary/60 hover:text-primary focus-visible:opacity-100 group-hover:opacity-100"
      >
        {copied ? (
          <>
            <Check className="size-3" aria-hidden /> copied
          </>
        ) : (
          <>
            <Copy className="size-3" aria-hidden /> copy
          </>
        )}
      </button>
    </div>
  );
}
