import Link from "next/link";
import { ArrowRight, FolderGit2, Notebook, Send } from "lucide-react";

const CARDS = [
  {
    href: "/projects",
    icon: FolderGit2,
    label: "projects",
    description:
      "Security prototypes, AI/ML systems, and backend services I've shipped or hacked together.",
  },
  {
    href: "/blog",
    icon: Notebook,
    label: "blog",
    description:
      "CTF writeups, tooling notes, and half-finished thoughts on security + ML.",
  },
  {
    href: "/contact",
    icon: Send,
    label: "contact",
    description:
      "Drop a message into the terminal — or book 15 minutes on my calendar.",
  },
];

export function HomeCtas() {
  return (
    <section className="border-y border-border bg-bg py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-primary glow-text">
          {"// next-moves"}
        </p>
        <h2 className="mt-2 font-mono text-3xl font-semibold text-text sm:text-4xl">
          what next?
        </h2>
        <p className="mt-3 font-mono text-xs text-text-dim">
          <span className="text-muted">{"// "}</span>
          three doors below — or{" "}
          <span className="text-accent glow-accent">hack your way in</span>!
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {CARDS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group relative flex flex-col gap-3 rounded-md border border-border bg-bg-panel p-6 transition-all hover:border-primary/70 hover:shadow-glow-md"
            >
              <c.icon className="size-5 text-primary glow-text" aria-hidden />
              <h3 className="font-mono text-lg uppercase tracking-wider text-text">
                {c.label}
              </h3>
              <p className="font-mono text-xs leading-6 text-text-dim">
                {c.description}
              </p>
              <span className="mt-auto inline-flex items-center gap-1 font-mono text-xs text-primary">
                open
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
