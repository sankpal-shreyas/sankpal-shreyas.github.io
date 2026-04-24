import { site } from "@/lib/config";

export function PhotoCard() {
  return (
    <figure className="relative overflow-hidden rounded-md border border-primary/40 bg-bg-panel shadow-glow-md">
      <div className="relative aspect-square w-full bg-bg-panel">
        <img
          src="/me.jpg"
          alt={`${site.name} portrait`}
          className="h-full w-full object-cover grayscale-[0.2] contrast-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
        <div
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 3px, rgba(57,255,20,0.12) 4px, rgba(57,255,20,0.12) 4px)",
          }}
        />
      </div>

      <figcaption className="flex items-center justify-between border-t border-border bg-bg px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-text-dim">
        <span className="text-primary glow-text">ID: 0x00A21F</span>
        <span>{site.location.city}</span>
      </figcaption>
    </figure>
  );
}
