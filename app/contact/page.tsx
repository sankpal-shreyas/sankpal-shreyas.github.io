import type { Metadata } from "next";
import { TerminalForm } from "@/components/contact/TerminalForm";
import { CalEmbedClient } from "@/components/contact/CalEmbedClient";

export const metadata: Metadata = {
  title: "contact",
  description:
    "Terminal-style contact form + Cal.com booking. Drop a message or grab 15 minutes.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <header className="mb-10 border-b border-border pb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-primary glow-text">
          ./contact
        </p>
        <h1 className="mt-2 font-mono text-4xl font-semibold text-text">
          open channel
        </h1>
        <p className="mt-3 max-w-2xl font-mono text-sm text-text-dim">
          Type into the terminal for a text transmission, or book a 15-minute
          slot on my calendar.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-label="Terminal contact">
          <TerminalForm />
        </section>
        <section aria-label="Schedule a call">
          <div className="rounded-md border border-border bg-bg-panel p-4">
            <div className="mb-3 flex items-center justify-between border-b border-border pb-2 font-mono text-xs text-text-dim">
              <span className="text-primary glow-text">./schedule</span>
              <span>cal.com</span>
            </div>
            <CalEmbedClient />
          </div>
        </section>
      </div>
    </div>
  );
}
