"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LocatorHUD } from "@/components/home/LocatorHUD";
import { HeroName } from "@/components/home/HeroName";
import { getLenis } from "@/lib/smoothScroll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const RING_COUNT = 18;

const HANDSHAKE_LINES = [
  "[tcp] SYN  172.16.254.12 → 40.71.28.74:443",
  "[tcp] SYN,ACK remote → local seq=0xA21F",
  "[tcp] ACK  handshake complete",
  "[tls] ClientHello · tls_1_3",
  "[tls] ServerHello · ECDHE-X25519",
  "[tls] cert_chain verified · STRICT",
  "[app] HTTP/2 GET /shreyas",
  "[app] 200 OK · content-type: text/ego",
];

function HeroFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="grid-floor absolute inset-0 opacity-30" />
      <div className="font-mono text-xs text-muted">
        <span className="terminal-cursor">initialising geosphere</span>
      </div>
    </div>
  );
}

/**
 * Genuinely concentric rings: every circle shares the viewport center and grows
 * by a fixed ratio, so they nest like a target. The scroll timeline scales the
 * [data-tunnel-rings] group up from the center, so the rings expand outward and
 * sweep past the viewer — the "moving into the scene" illusion, without the
 * off-axis drift that 3D perspective introduces. The radial + linear vignettes
 * melt the outermost rings into the dark.
 */
function TunnelRings() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <div data-tunnel-rings className="absolute inset-0">
        {Array.from({ length: RING_COUNT }).map((_, i) => {
          // Rounded to a fixed precision so the server and client serialize the
          // identical string (Math.pow isn't bit-identical across JS engines).
          const size = (9 * Math.pow(1.3, i)).toFixed(3); // vmin — small → large
          return (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 rounded-full border border-primary/40"
              style={{
                width: `${size}vmin`,
                height: `${size}vmin`,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 28px rgba(57, 255, 20, 0.14)",
              }}
            />
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_24%,var(--color-bg)_72%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
    </div>
  );
}

/**
 * The handshake log shown while the tunnel stalls the screen. In the animated
 * scene each [data-conn-line] is revealed in sequence by the scroll timeline;
 * in the static fallback they're all visible at once.
 */
function ConnectingLog() {
  return (
    <div className="w-full max-w-2xl px-6 font-mono text-[11px] leading-6 text-primary/85 glow-text">
      <p
        data-conn-line
        className="mb-3 text-[10px] uppercase tracking-[0.4em] text-text-dim"
      >
        [tunnel.established] · negotiating secure channel
      </p>
      <ul className="space-y-1">
        {HANDSHAKE_LINES.map((line, i) => (
          <li key={i} data-conn-line className="whitespace-pre">
            {line}
          </li>
        ))}
      </ul>
      <p
        data-conn-line
        className="mt-4 text-sm uppercase tracking-[0.3em] text-accent glow-accent"
      >
        ▸ connection established — entering warroom
      </p>
    </div>
  );
}

function ScrollHint() {
  return (
    <div
      aria-hidden
      data-hero-scroll
      className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-text-dim"
    >
      <span className="opacity-60">scroll to enter</span>
      <span className="h-6 w-px animate-pulse bg-primary" />
    </div>
  );
}

/** Reduced-motion / pre-hydration fallback: plain stacked sections, no pin. */
function StaticIntro({ Globe }: { Globe: ComponentType | null }) {
  return (
    <>
      <section
        id="hero"
        className="relative h-[100svh] w-full overflow-hidden bg-bg"
      >
        <div className="absolute inset-0">
          {Globe ? <Globe /> : <HeroFallback />}
        </div>
        <div className="pointer-events-none absolute inset-0">
          <LocatorHUD />
        </div>
        <HeroName />
        <ScrollHint />
      </section>
      <section className="relative flex min-h-[70svh] items-center justify-center overflow-hidden bg-bg">
        <TunnelRings />
        <div className="relative z-10">
          <ConnectingLog />
        </div>
      </section>
    </>
  );
}

/** Full choreography: one pinned viewport, scroll-scrubbed GSAP timeline. */
function PinnedScene({ Globe }: { Globe: ComponentType | null }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const triggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      const q = <T extends HTMLElement>(sel: string) =>
        track.querySelector<T>(sel);
      const qa = <T extends HTMLElement>(sel: string) =>
        Array.from(track.querySelectorAll<T>(sel));

      const kicker = q("[data-hero-kicker]");
      const name = q("[data-hero-name]");
      const subtitle = q("[data-hero-subtitle]");
      const hud = q("[data-hud]");
      const scrollHint = q("[data-hero-scroll]");
      const globe = q("[data-globe]");
      const tunnel = q("[data-tunnel]");
      const rings = q("[data-tunnel-rings]");
      const connecting = q("[data-connecting]");
      const connLines = qa("[data-conn-line]");

      // Hidden / tight starting states for the layers behind the globe.
      gsap.set(tunnel, { opacity: 0 });
      gsap.set(rings, { scale: 0.5, transformOrigin: "50% 50%" });
      gsap.set(connecting, { opacity: 0 });
      gsap.set(connLines, { opacity: 0, y: 10 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);

      // ── Phase 1 · peel away the intro overlay ─────────────────────────────
      if (kicker)
        tl.to(kicker, { opacity: 0, y: -24, ease: "power2.in", duration: 0.9 }, 0);
      if (subtitle)
        tl.to(subtitle, { opacity: 0, y: -20, ease: "power2.in", duration: 0.9 }, 0);
      if (hud) tl.to(hud, { opacity: 0, x: -60, ease: "power2.in", duration: 0.9 }, 0);
      if (scrollHint)
        tl.to(scrollHint, { opacity: 0, y: 24, ease: "power2.in", duration: 0.7 }, 0);
      if (name)
        tl.to(
          name,
          { scale: 0.62, letterSpacing: "0.4em", ease: "power2.inOut", duration: 1.1 },
          0,
        );

      // ── Phase 2 · fly *into* the globe; tunnel surfaces behind it ─────────
      if (name)
        tl.to(name, { scale: 0.08, opacity: 0, ease: "power2.in", duration: 1.3 }, 1);
      if (globe)
        tl.to(globe, { scale: 3.6, opacity: 0, ease: "power2.in", duration: 1.3 }, 1);
      if (tunnel)
        tl.to(tunnel, { opacity: 1, ease: "power1.out", duration: 1.0 }, 1);

      // Continuous forward travel: the concentric field scales up from center
      // so the rings expand outward and sweep past for the rest of the journey.
      if (rings) tl.to(rings, { scale: 3.2, ease: "none", duration: 5.8 }, 1);

      // ── Phase 3 · stall the screen while the handshake completes ──────────
      if (connecting)
        tl.to(connecting, { opacity: 1, ease: "power1.out", duration: 0.5 }, 2.7);
      if (connLines.length)
        tl.to(
          connLines,
          { opacity: 1, y: 0, ease: "power1.out", stagger: 0.3, duration: 0.4 },
          2.9,
        );

      // ── Phase 4 · establish, then dissolve to reveal the warroom ──────────
      if (connecting)
        tl.to(
          connecting,
          { opacity: 0, scale: 1.08, ease: "power2.in", duration: 0.7 },
          6.2,
        );
      if (tunnel)
        tl.to(tunnel, { opacity: 0, ease: "power2.in", duration: 0.7 }, 6.2);

      // Make the tunnel a one-way transition. Scrolling down past it glides the
      // warroom up to the top; scrolling back up out of the warroom skips the
      // tunnel entirely and returns to the globe hero, so it never re-scrubs.
      const warroom = document.getElementById("warroom");
      if (warroom) {
        const snapDown = ScrollTrigger.create({
          trigger: warroom,
          start: "top bottom",
          onEnter: () => {
            // Lock + force the glide so leftover wheel/touch momentum can't
            // override it. Without lock the pull-up only "takes" at some scroll
            // speeds and silently no-ops at others (the up-snap below already
            // locks for the same reason).
            getLenis()?.scrollTo(warroom, { duration: 1.0, lock: true, force: true });
          },
        });
        const snapUp = ScrollTrigger.create({
          trigger: warroom,
          start: "top top",
          onLeaveBack: () => {
            const lenis = getLenis();
            const st = tl.scrollTrigger;
            if (!lenis || !st) {
              lenis?.scrollTo(0, { duration: 1.0 });
              return;
            }
            // Freeze the scene on the globe-hero state (progress 0) and stop the
            // scrub so the tunnel can't rewind while we glide back to the top.
            // Lock the scroll so the glide can't be interrupted mid-flight,
            // then re-enable the scrub on arrival (progress is 0 there too).
            const scrub = st.getTween();
            if (scrub) scrub.kill();
            st.disable();
            tl.progress(0);
            lenis.scrollTo(0, {
              duration: 1.0,
              lock: true,
              onComplete: () => st.enable(),
            });
          },
        });
        triggers.push(snapDown, snapUp);
      }
    }, track);

    return () => {
      triggers.forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <div ref={trackRef} id="hero" className="relative h-[360svh] w-full">
      <section className="sticky top-0 h-[100svh] w-full overflow-hidden bg-bg">
        <div data-tunnel className="absolute inset-0 z-0">
          <TunnelRings />
        </div>

        <div data-globe className="absolute inset-0 z-10">
          {Globe ? <Globe /> : <HeroFallback />}
        </div>

        <div
          data-connecting
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
        >
          <ConnectingLog />
        </div>

        <div data-hud className="pointer-events-none absolute inset-0 z-30">
          <LocatorHUD />
        </div>
        <HeroName />
        <ScrollHint />
      </section>
    </div>
  );
}

export function HeroTunnelScene() {
  const [Globe, setGlobe] = useState<ComponentType | null>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [decided, setDecided] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnhanced(!reduce);
    setDecided(true);

    let alive = true;
    import("@/components/home/GlobeScene").then((mod) => {
      if (alive) setGlobe(() => mod.GlobeScene);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Before we know the motion preference (SSR + first paint) fall back to the
  // static intro so reduced-motion users never see the pinned track flash in.
  if (!decided || !enhanced) return <StaticIntro Globe={Globe} />;
  return <PinnedScene Globe={Globe} />;
}
