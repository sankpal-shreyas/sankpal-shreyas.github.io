"use client";

import { useEffect, useState } from "react";
import { unlock } from "@/lib/achievements";

const SHORTCUTS: { keys: string; label: string }[] = [
  { keys: "⌘ / Ctrl + K", label: "open the command palette" },
  { keys: "?", label: "toggle this overlay" },
  { keys: "↑↑↓↓←→←→ b a", label: "??? · hack your way in" },
  { keys: "esc", label: "close any overlay" },
];

function isEditable(el: EventTarget | null) {
  const node = el as HTMLElement | null;
  if (!node) return false;
  return (
    node.tagName === "INPUT" ||
    node.tagName === "TEXTAREA" ||
    node.isContentEditable === true
  );
}

export function ShortcutsOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "?" && !isEditable(e.target)) {
        e.preventDefault();
        setOpen((v) => {
          if (!v) unlock("shortcuts");
          return !v;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="keyboard shortcuts"
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-bg/70 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-md border border-primary/40 bg-bg-panel shadow-glow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-border bg-bg px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
          keyboard shortcuts
        </div>
        <ul className="divide-y divide-border/60 p-2 font-mono text-[13px]">
          {SHORTCUTS.map((s) => (
            <li
              key={s.label}
              className="flex items-center justify-between gap-4 px-2 py-2"
            >
              <span className="text-text-dim">{s.label}</span>
              <kbd className="shrink-0 rounded-sm border border-border px-2 py-0.5 text-[11px] text-primary">
                {s.keys}
              </kbd>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
