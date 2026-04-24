import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";

const TAG_COLORS: Record<Project["tags"][number], string> = {
  security: "text-accent border-accent/50 bg-accent/10",
  "ai-ml": "text-primary border-primary/50 bg-primary/10",
  backend: "text-text-dim border-border bg-bg",
  fullstack: "text-text border-border bg-bg",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col rounded-md border border-border bg-bg-panel p-6 transition-colors hover:border-primary/60 hover:shadow-glow-md">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim">
            {project.year}
          </p>
          <h2 className="mt-1 font-mono text-xl font-semibold text-text group-hover:text-primary group-hover:glow-text">
            {project.title}
          </h2>
          <p className="mt-1 font-mono text-xs text-text-dim">
            {project.tagline}
          </p>
        </div>
      </header>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <span
            key={t}
            className={`rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${TAG_COLORS[t]}`}
          >
            {t}
          </span>
        ))}
      </div>

      <p className="mt-5 font-mono text-xs leading-6 text-text-dim">
        {project.description}
      </p>

      <ul className="mt-4 space-y-1 font-mono text-xs text-text-dim">
        {project.highlights.map((h, i) => (
          <li key={i} className="flex gap-2">
            <span className="select-none text-primary/70">▸</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 6).map((s) => (
            <span
              key={s}
              className="rounded-sm border border-border/60 px-1.5 py-0.5 font-mono text-[10px] text-text-dim"
            >
              {s}
            </span>
          ))}
        </div>
        {project.links && project.links.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:glow-text"
              >
                {link.label}
                <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            ))}
          </div>
        )}
      </footer>
    </article>
  );
}
