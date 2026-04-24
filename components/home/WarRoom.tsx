import { PhotoCard } from "@/components/home/PhotoCard";
import { EducationPanel } from "@/components/home/EducationPanel";
import { ExperiencePanel } from "@/components/home/ExperiencePanel";
import { CTFStrip } from "@/components/home/CTFStrip";
import { AvailabilityPill } from "@/components/home/AvailabilityPill";
import { site } from "@/lib/config";

export function WarRoom() {
  return (
    <section
      id="warroom"
      className="relative min-h-[100svh] w-full overflow-hidden bg-bg-raised py-24"
    >
      <div className="grid-floor absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-primary glow-text">
              {"// sector-02 · warroom"}
            </p>
            <h2 className="mt-2 font-mono text-3xl font-semibold text-text sm:text-4xl">
              who is <span className="text-primary glow-text">{site.name.split(" ")[0].toLowerCase()}</span>?
            </h2>
          </div>
          {site.availability.enabled && <AvailabilityPill />}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <PhotoCard />
            <div className="rounded-md border border-border bg-bg-panel p-4 font-mono text-xs text-text-dim">
              <p className="mb-2 text-primary">$ cat ~/bio.txt</p>
              <p className="leading-6">{site.bio}</p>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <ExperiencePanel />
            <EducationPanel />
            <CTFStrip />
          </div>
        </div>
      </div>
    </section>
  );
}
