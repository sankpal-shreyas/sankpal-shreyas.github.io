import { site } from "@/lib/config";

export function AvailabilityPill() {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-primary/60 bg-primary/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-primary glow-text"
      role="status"
    >
      <span className="relative inline-flex size-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-primary" />
      </span>
      {site.availability.text}
    </div>
  );
}
