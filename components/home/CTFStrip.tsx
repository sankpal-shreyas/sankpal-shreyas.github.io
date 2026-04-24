import { ctfAndCerts } from "@/lib/config";
import { ShieldCheck } from "lucide-react";

export function CTFStrip() {
  return (
    <div className="rounded-md border border-border bg-bg-panel p-5">
      <div className="mb-4 flex items-center gap-2 border-b border-border pb-2">
        <ShieldCheck className="size-4 text-accent" aria-hidden />
        <h3 className="font-mono text-sm uppercase tracking-[0.3em] text-accent glow-accent">
          ./security-ops
        </h3>
      </div>
      <dl className="grid grid-cols-1 gap-3 font-mono text-xs sm:grid-cols-2 lg:grid-cols-3">
        {ctfAndCerts.map((item) => (
          <div
            key={item.label}
            className="rounded-sm border border-border/60 bg-bg px-3 py-2"
          >
            <dt className="text-[10px] uppercase tracking-widest text-text-dim">
              {item.label}
            </dt>
            <dd className="mt-0.5 text-text">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
