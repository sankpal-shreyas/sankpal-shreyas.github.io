"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { Globe } from "./Globe";

function detectQuality(): "low" | "high" {
  if (typeof window === "undefined") return "high";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 720;
  const lowMem =
    typeof navigator !== "undefined" &&
    "deviceMemory" in navigator &&
    typeof (navigator as { deviceMemory?: number }).deviceMemory === "number" &&
    (navigator as { deviceMemory?: number }).deviceMemory! < 4;
  return coarse || narrow || lowMem ? "low" : "high";
}

export function GlobeScene() {
  const [quality, setQuality] = useState<"low" | "high">("high");
  const containerRef = useRef<HTMLDivElement>(null);
  // Gate the WebGL render loop: only run while the globe is on-screen and the
  // tab is visible. Otherwise the canvas keeps drawing at 60fps behind the
  // warroom (and on hidden tabs), permanently competing with scroll.
  const [active, setActive] = useState(true);

  useEffect(() => {
    setQuality(detectQuality());
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let onScreen = true;
    const sync = () => setActive(onScreen && !document.hidden);

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: "100px" },
    );
    observer.observe(el);

    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const dpr: [number, number] = quality === "low" ? [1, 1.5] : [1, 1.75];

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0.4, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={dpr}
        className="!absolute inset-0"
      >
        <color attach="background" args={["#0a0f0a"]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 2]} intensity={0.5} />
        <Suspense fallback={null}>
          <Globe quality={quality} />
        </Suspense>
      </Canvas>
    </div>
  );
}
