"use client";

import { useRef, useState } from "react";
import { site } from "@/lib/config";

type Step = "email" | "message" | "sending" | "sent" | "error";

export function TerminalForm() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [log, setLog] = useState<string[]>([
    "welcome to transmission.sh v1.0",
    `connection: ${site.baseUrl.replace(/^https?:\/\//, "")}`,
    "type /help for commands, or enter your email to begin.",
    "",
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  const appendLog = (lines: string | string[]) =>
    setLog((prev) => [...prev, ...(Array.isArray(lines) ? lines : [lines])]);

  const prompt = (() => {
    switch (step) {
      case "email":
        return "email ▸";
      case "message":
        return "message ▸";
      case "sending":
        return "[…] transmitting";
      case "sent":
        return "[ OK ]";
      case "error":
        return "[ERR]";
    }
  })();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("field") as HTMLInputElement;
    const value = input.value.trim();
    input.value = "";

    if (step === "email") {
      if (value.toLowerCase() === "/help") {
        appendLog([
          "commands:",
          "  /help         show this help",
          "  /clear        clear log",
          "  /socials      print socials",
          "",
        ]);
        return;
      }
      if (value.toLowerCase() === "/clear") {
        setLog([]);
        return;
      }
      if (value.toLowerCase() === "/socials") {
        appendLog([
          `github:   ${site.socials.github}`,
          `linkedin: ${site.socials.linkedin}`,
          `email:    ${site.socials.email}`,
          "",
        ]);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        appendLog(`[ERR] invalid email: "${value}"`);
        return;
      }
      setEmail(value);
      appendLog([`email ▸ ${value}`, ""]);
      setStep("message");
      return;
    }

    if (step === "message") {
      if (value.length < 4) {
        appendLog(`[ERR] message too short (min 4 chars)`);
        return;
      }
      appendLog([`message ▸ ${value}`, "", "dispatching via formspree…"]);
      setStep("sending");

      try {
        const res = await fetch(`https://formspree.io/f/${site.formspree.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, message: value }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        appendLog(["[ OK ] 200 transmission logged", "thanks — i'll reply soon."]);
        setStep("sent");
      } catch (err) {
        appendLog([
          `[ERR] transmission failed: ${
            err instanceof Error ? err.message : "unknown"
          }`,
          `fallback: mail ${site.socials.email} directly.`,
        ]);
        setStep("error");
      }
    }
  };

  const inputDisabled = step === "sending" || step === "sent";

  return (
    <div
      className="flex h-[460px] flex-col rounded-md border border-primary/40 bg-bg-panel shadow-glow-md"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center justify-between border-b border-border bg-bg px-4 py-2 font-mono text-xs text-text-dim">
        <span className="text-primary glow-text">~/transmission</span>
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-danger/70" />
          <span className="size-2.5 rounded-full bg-accent/70" />
          <span className="size-2.5 rounded-full bg-primary/70" />
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-6 text-text-dim"
        role="log"
        aria-live="polite"
      >
        {log.map((line, i) => (
          <p key={i} className="whitespace-pre-wrap">
            {line}
          </p>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-border px-4 py-2">
        <label className="flex items-center gap-2 font-mono text-[13px]">
          <span
            className={
              step === "error"
                ? "text-danger"
                : step === "sent"
                  ? "text-primary glow-text"
                  : "text-primary"
            }
          >
            {prompt}
          </span>
          <input
            ref={inputRef}
            name="field"
            type={step === "message" ? "text" : "email"}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={inputDisabled}
            placeholder={
              step === "email"
                ? "you@domain.tld"
                : step === "message"
                  ? "what's up?"
                  : ""
            }
            className="w-full flex-1 bg-transparent text-text caret-primary outline-none placeholder:text-muted disabled:opacity-50"
          />
        </label>
      </form>
    </div>
  );
}
