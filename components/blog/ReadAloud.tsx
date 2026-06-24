"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, Square, Volume2 } from "lucide-react";

type State = "idle" | "playing" | "paused";

// Strip MDX down to readable prose so the synth doesn't narrate markup/code.
function toPlainText(mdx: string): string {
  return mdx
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/[*_~]+/g, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\s+/g, " ")
    .trim();
}

// Break prose into short, sentence-aligned utterances. Keeping each utterance
// small also sidesteps the Chrome bug that cuts off long single utterances.
function chunk(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+|\S[^.!?]*$/g) ?? [text];
  const out: string[] = [];
  let cur = "";
  for (const s of sentences) {
    if (cur && (cur + s).length > 180) {
      out.push(cur.trim());
      cur = s;
    } else {
      cur += s;
    }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

export function ReadAloud({ content }: { content: string }) {
  const [state, setState] = useState<State>("idle");
  const [supported, setSupported] = useState(false);
  const chunks = useMemo(() => chunk(toPlainText(content)), [content]);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Chrome silently stops synthesis after ~15s; a periodic pause/resume while
  // playing keeps it alive without audibly interrupting.
  useEffect(() => {
    if (state !== "playing") return;
    const id = window.setInterval(() => {
      const synth = window.speechSynthesis;
      if (synth.speaking && !synth.paused) {
        synth.pause();
        synth.resume();
      }
    }, 10000);
    return () => window.clearInterval(id);
  }, [state]);

  const start = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    chunks.forEach((c, i) => {
      const u = new SpeechSynthesisUtterance(c);
      if (i === chunks.length - 1) u.onend = () => setState("idle");
      synth.speak(u);
    });
    setState("playing");
  };

  const onToggle = () => {
    const synth = window.speechSynthesis;
    if (state === "idle") start();
    else if (state === "playing") {
      synth.pause();
      setState("paused");
    } else {
      synth.resume();
      setState("playing");
    }
  };

  const onStop = () => {
    window.speechSynthesis.cancel();
    setState("idle");
  };

  if (!supported || chunks.length === 0) return null;

  return (
    <>
      <span aria-hidden className="text-text-dim">
        ·
      </span>
      <span className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={onToggle}
        aria-label={state === "playing" ? "pause narration" : "read article aloud"}
        className="inline-flex items-center gap-1 rounded-sm border border-border px-1.5 py-0.5 text-text-dim transition-colors hover:border-primary/60 hover:text-primary"
      >
        {state === "idle" ? (
          <>
            <Volume2 className="size-3" aria-hidden /> read aloud
          </>
        ) : state === "playing" ? (
          <>
            <Pause className="size-3" aria-hidden /> pause
          </>
        ) : (
          <>
            <Play className="size-3" aria-hidden /> resume
          </>
        )}
      </button>
      {state !== "idle" && (
        <button
          type="button"
          onClick={onStop}
          aria-label="stop narration"
          className="inline-flex items-center rounded-sm border border-border px-1.5 py-0.5 text-text-dim transition-colors hover:border-primary/60 hover:text-primary"
        >
          <Square className="size-3" aria-hidden />
        </button>
      )}
      </span>
    </>
  );
}
