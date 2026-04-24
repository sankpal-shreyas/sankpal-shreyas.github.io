import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-2xl flex-col justify-center px-6 pt-32 pb-24 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-danger">
        {"// segfault · 0x00000000"}
      </p>
      <h1 className="mt-3 font-mono text-6xl font-semibold text-text glow-text">
        404
      </h1>
      <p className="mt-2 font-mono text-sm text-text-dim">
        the route you requested dereferenced a null pointer. no such page.
      </p>

      <pre className="mx-auto mt-8 overflow-x-auto rounded-md border border-border bg-bg-panel p-4 text-left font-mono text-[12px] leading-6 text-text-dim">
        {`$ route --trace \${requested}
[0] GET  \${requested}
[1] 404  not in routing table
[2] suggestion: cd /`}
      </pre>

      <div className="mt-8 flex justify-center gap-3 font-mono text-xs">
        <Link
          href="/"
          className="rounded-sm border border-primary/60 bg-primary/10 px-4 py-2 text-primary hover:bg-primary/20"
        >
          ▸ return home
        </Link>
        <Link
          href="/projects"
          className="rounded-sm border border-border px-4 py-2 text-text-dim hover:border-primary/60 hover:text-primary"
        >
          ▸ see projects
        </Link>
      </div>
    </div>
  );
}
