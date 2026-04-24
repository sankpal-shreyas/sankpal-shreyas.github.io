import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";

export const metadata: Metadata = {
  title: "projects",
  description:
    "Security prototypes, AI/ML systems, and backend services I've shipped.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <header className="mb-12 border-b border-border pb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-primary glow-text">
          ./projects
        </p>
        <h1 className="mt-2 font-mono text-4xl font-semibold text-text">
          build log
        </h1>
        <p className="mt-3 max-w-2xl font-mono text-sm text-text-dim">
          Selected things I&apos;ve built across security, AI/ML, and backend —
          production services, hackathon prototypes, and research projects.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </div>
  );
}
