import { education } from "@/lib/config";

export function EducationPanel() {
  return (
    <div className="rounded-md border border-border bg-bg-panel p-5">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
        <h3 className="font-mono text-sm uppercase tracking-[0.3em] text-primary glow-text">
          ./education
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-dim">
          {education.length} entries
        </span>
      </div>
      <ul className="space-y-5">
        {education.map((e) => (
          <li key={e.school} className="grid gap-1 font-mono text-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <p className="text-text">{e.school}</p>
              <p className="text-xs text-accent glow-accent">{e.period}</p>
            </div>
            <p className="text-xs text-text-dim">{e.degree}</p>
            <p className="text-xs text-muted">{e.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
