"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Globe } from "./Globe";

export function GlobeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 3.2], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      className="!absolute inset-0"
    >
      <color attach="background" args={["#0a0f0a"]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 2]} intensity={0.5} />
      <Suspense fallback={null}>
        <Globe />
      </Suspense>
    </Canvas>
  );
}
