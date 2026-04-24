import type { Metadata } from "next";
import { RootShell } from "@/components/root/RootShell";

export const metadata: Metadata = {
  title: "root@shreyas",
  description: "authorised personnel only",
  robots: { index: false, follow: false },
};

export default function RootPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-32 pb-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent glow-accent">
        {"// override · clearance: red"}
      </p>
      <h1 className="mt-2 font-mono text-4xl font-semibold text-text">
        root@shreyas:~#
      </h1>
      <p className="mt-3 max-w-2xl font-mono text-sm text-text-dim">
        you unlocked the konami door. have a poke around — nothing destructive
        back here, just easter eggs.
      </p>

      <div className="mt-10">
        <RootShell />
      </div>
    </div>
  );
}
