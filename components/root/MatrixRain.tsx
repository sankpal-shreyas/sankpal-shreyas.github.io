"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿ01<>=/\\[]{}#$%".split("");
const DURATION = 6000;
const FONT_SIZE = 16;

/**
 * Full-screen "matrix rain" overlay triggered by the `matrix`/`hack` command in
 * the root shell. Runs for a few seconds, then calls onDone. Click/Esc exits
 * early. Reduced-motion gets a static frame instead of the animation.
 */
export function MatrixRain({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      onDone();
      return;
    }

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDone();
    };
    window.addEventListener("keydown", onKey);

    const cleanup = () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      ctx.fillStyle = "#0a0f0a";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#39ff14";
      ctx.font = "20px monospace";
      ctx.fillText("wake up, neo…", 40, h / 2);
      const t = window.setTimeout(onDone, 2200);
      return () => {
        window.clearTimeout(t);
        cleanup();
      };
    }

    const cols = Math.ceil(w / FONT_SIZE);
    const drops = new Array(cols)
      .fill(0)
      .map(() => Math.floor(Math.random() * -50));

    let raf = 0;
    const start = performance.now();
    const draw = (now: number) => {
      ctx.fillStyle = "rgba(10, 15, 10, 0.12)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#39ff14";
      ctx.font = `${FONT_SIZE}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        ctx.fillText(glyph, i * FONT_SIZE, drops[i] * FONT_SIZE);
        if (drops[i] * FONT_SIZE > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      if (now - start < DURATION) raf = requestAnimationFrame(draw);
      else onDone();
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[400] bg-bg" onClick={onDone}>
      <canvas ref={canvasRef} className="h-full w-full" />
      <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-primary/70">
        click or press esc to exit
      </p>
    </div>
  );
}
