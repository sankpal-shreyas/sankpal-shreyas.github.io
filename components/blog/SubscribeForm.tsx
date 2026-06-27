"use client";

import { useState, type FormEvent } from "react";
import { Check, Loader2, Mail } from "lucide-react";

// Buttondown embed endpoint for this newsletter. The form posts directly from
// the browser (static site, no backend). A no-cors fetch keeps the page from
// navigating away; the response is opaque, so on a successful send we
// optimistically show the confirm-your-inbox state — Buttondown is double
// opt-in, so that is always the correct next step for a new subscriber.
const ENDPOINT = "https://buttondown.com/api/emails/embed-subscribe/ceshreyas";

type Status = "idle" | "loading" | "done" | "error";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, embed: "1", tag: "website" }).toString(),
      });
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p className="inline-flex items-center gap-2 font-mono text-xs text-primary glow-text">
        <Check className="size-3.5" aria-hidden />
        check your inbox to confirm your subscription.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Mail
          className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-text-dim"
          aria-hidden
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label="email address"
          className="w-60 max-w-full rounded-sm border border-border bg-bg-panel py-1.5 pl-8 pr-3 font-mono text-xs text-text placeholder:text-text-dim focus:border-primary/60 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center gap-1.5 rounded-sm border border-primary/50 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary/20 disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="size-3.5 animate-spin" aria-hidden /> subscribing…
          </>
        ) : (
          "subscribe"
        )}
      </button>
      {status === "error" && (
        <span className="font-mono text-xs text-accent">
          could not reach the server — try the rss feed instead.
        </span>
      )}
    </form>
  );
}
