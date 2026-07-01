"use client";

import { useEffect, useState } from "react";
import { BookOpen, Sun, Terminal } from "lucide-react";

type Mode = "terminal" | "read" | "paper";

const MODES: { value: Mode; label: string; icon: typeof Terminal }[] = [
  { value: "terminal", label: "terminal", icon: Terminal },
  { value: "read", label: "read", icon: BookOpen },
  { value: "paper", label: "paper", icon: Sun },
];

// Reading-theme control for article pages. Sets <html data-reading> to one of
// terminal (default mono + scanlines), read (comfortable dark), or paper (warm
// sepia sheet). An inline script in the root layout applies the stored choice
// before paint so there's no flash; this just flips and persists it.
export function ReadingTheme() {
  const [mode, setMode] = useState<Mode>("terminal");

  useEffect(() => {
    const current = document.documentElement.dataset.reading as Mode | undefined;
    setMode(current ?? "terminal");
  }, []);

  const apply = (next: Mode) => {
    setMode(next);
    document.documentElement.dataset.reading = next;
    try {
      localStorage.setItem("reading", next);
    } catch {
      /* storage blocked — fine, it just won't persist */
    }
  };

  return (
    <div
      role="group"
      aria-label="reading theme"
      className="inline-flex shrink-0 items-center gap-0.5 rounded-sm border border-border p-0.5"
    >
      {MODES.map(({ value, label, icon: Icon }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => apply(value)}
            aria-pressed={active}
            title={`${label} reading theme`}
            className={`inline-flex items-center gap-1 rounded-[3px] px-2 py-1 font-mono text-[11px] transition-colors ${
              active
                ? "bg-primary/15 text-primary"
                : "text-text-dim hover:text-primary"
            }`}
          >
            <Icon className="size-3.5" aria-hidden />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
