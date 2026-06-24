"use client";

import { useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import type { Mesh } from "three";
import { site } from "@/lib/config";
import { showToast } from "@/lib/eggs";
import { unlock } from "@/lib/achievements";

type Props = { position: [number, number, number] };

export function NYCMarker({ position }: Props) {
  const ringRef = useRef<Mesh>(null!);
  const dotRef = useRef<Mesh>(null!);

  const onMarkerClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    unlock("nyc-marker");
    showToast(`you found me · ${site.location.city}`, "primary");
  };

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pulse = (Math.sin(t * 2.2) + 1) / 2;
    if (ringRef.current) {
      const scale = 1 + pulse * 1.8;
      ringRef.current.scale.set(scale, scale, scale);
      const mat = ringRef.current.material as { opacity?: number };
      if ("opacity" in mat) mat.opacity = 0.8 * (1 - pulse);
    }
    if (dotRef.current) {
      const s = 1 + 0.15 * pulse;
      dotRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={position}>
      {/* Invisible, generously sized hitbox so the tiny pulsing marker is
          actually clickable — the "find me on the globe" easter egg. */}
      <mesh
        onClick={onMarkerClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshBasicMaterial color="#39ff14" toneMapped={false} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.02, 0.028, 32]} />
        <meshBasicMaterial color="#39ff14" transparent opacity={0.8} toneMapped={false} />
      </mesh>
    </group>
  );
}
