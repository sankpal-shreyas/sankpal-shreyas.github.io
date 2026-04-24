import { experience } from "@/lib/config";

export function ExperiencePanel() {
  return (
    <div className="rounded-md border border-border bg-bg-panel p-5">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
        <h3 className="font-mono text-sm uppercase tracking-[0.3em] text-primary glow-text">
          ./experience
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-dim">
          {experience.length} entries
        </span>
      </div>
      <ul className="space-y-6">
        {experience.map((e) => (
          <li key={e.company} className="font-mono text-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <p className="text-text">
                <span className="text-primary">{e.company}</span>{" "}
                <span className="text-text-dim">— {e.role}</span>
              </p>
              <p className="text-xs text-accent glow-accent">{e.period}</p>
            </div>
            <p className="mt-0.5 text-xs text-muted">{e.location}</p>
            <ul className="mt-2 space-y-1 text-xs text-text-dim">
              {e.bullets.map((b, i) => (
                <li key={i} className="flex gap-2">
                  <span className="select-none text-primary/70">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
