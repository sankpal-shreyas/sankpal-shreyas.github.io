"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
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

  useEffect(() => {
    setQuality(detectQuality());
  }, []);

  const dpr: [number, number] = quality === "low" ? [1, 1.5] : [1, 2];

  return (
    <Canvas
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
  );
}
