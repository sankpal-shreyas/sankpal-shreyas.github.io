"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BackSide,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  Points,
  ShaderMaterial,
} from "three";
import { NYCMarker } from "./NYCMarker";
import { site } from "@/lib/config";

const GLOBE_RADIUS = 1;

const CITIES = [
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
  { name: "San Francisco", lat: 37.7749, lng: -122.4194 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "São Paulo", lat: -23.5505, lng: -46.6333 },
  { name: "Sydney", lat: -33.8688, lng: 151.2093 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
];

function latLngToVec3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function buildMeridianGeometry(
  segments = 48,
  meridianCount = 24,
  parallelCount = 12,
) {
  const positions: number[] = [];
  for (let m = 0; m < meridianCount; m++) {
    const lng = (m / meridianCount) * 360 - 180;
    for (let i = 0; i < segments; i++) {
      const lat1 = (i / segments) * 180 - 90;
      const lat2 = ((i + 1) / segments) * 180 - 90;
      positions.push(...latLngToVec3(lat1, lng, GLOBE_RADIUS));
      positions.push(...latLngToVec3(lat2, lng, GLOBE_RADIUS));
    }
  }
  for (let p = 1; p < parallelCount; p++) {
    const lat = (p / parallelCount) * 180 - 90;
    for (let i = 0; i < segments; i++) {
      const lng1 = (i / segments) * 360 - 180;
      const lng2 = ((i + 1) / segments) * 360 - 180;
      positions.push(...latLngToVec3(lat, lng1, GLOBE_RADIUS));
      positions.push(...latLngToVec3(lat, lng2, GLOBE_RADIUS));
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  return geometry;
}

function buildStarfield(count = 1200, radius = 12) {
  const positions: number[] = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius + Math.random() * 6;
    positions.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
    );
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  return geometry;
}

function buildCityPointsGeometry() {
  const positions: number[] = [];
  for (const c of CITIES) {
    positions.push(...latLngToVec3(c.lat, c.lng, GLOBE_RADIUS * 1.005));
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  return geometry;
}

function AtmosphereMaterial() {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uColor: { value: new Color("#39ff14") },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform vec3 uColor;
          void main() {
            float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
            gl_FragColor = vec4(uColor, 1.0) * intensity;
          }
        `,
        blending: AdditiveBlending,
        side: BackSide,
        transparent: true,
      }),
    [],
  );
  return <primitive object={material} attach="material" />;
}

type Quality = "low" | "high";

const PRESETS: Record<Quality, {
  sphereSegments: number;
  meridianSegments: number;
  meridianCount: number;
  parallelCount: number;
  starCount: number;
}> = {
  low: {
    sphereSegments: 32,
    meridianSegments: 28,
    meridianCount: 16,
    parallelCount: 8,
    starCount: 450,
  },
  high: {
    sphereSegments: 64,
    meridianSegments: 48,
    meridianCount: 24,
    parallelCount: 12,
    starCount: 1200,
  },
};

// Land is dark on the water-specular mask (oceans are bright); place a dot
// wherever the sampled pixel is below this luminance.
const LAND_LUM_THRESHOLD = 110;

/**
 * Samples the equirectangular land/water mask once on the client and builds a
 * point cloud of dots over land, so the globe reads as Earth and the NYC marker
 * sits on a recognizable coastline. Density follows the quality preset; the
 * longitude step widens toward the poles to keep dots roughly evenly spaced.
 */
function useLandDotGeometry(quality: Quality) {
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);

  useEffect(() => {
    let cancelled = false;
    let scheduled: number | undefined;

    const ric = (window as { requestIdleCallback?: (cb: () => void) => number })
      .requestIdleCallback;
    const cic = (window as { cancelIdleCallback?: (h: number) => void })
      .cancelIdleCallback;

    const img = new Image();
    img.decoding = "async";
    img.src = "/earth-water.png";

    img.onload = () => {
      if (cancelled) return;

      // Sampling the equirectangular mask is a few thousand point computations
      // plus a getImageData read. Run it during idle time so it never hitches
      // first paint or scroll on load.
      const sample = () => {
        if (cancelled) return;
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const { data } = ctx.getImageData(0, 0, w, h);

        const isLand = (lat: number, lng: number) => {
          const x = Math.min(w - 1, Math.max(0, Math.floor(((lng + 180) / 360) * w)));
          const y = Math.min(h - 1, Math.max(0, Math.floor(((90 - lat) / 180) * h)));
          const i = (y * w + x) * 4;
          return (data[i] + data[i + 1] + data[i + 2]) / 3 < LAND_LUM_THRESHOLD;
        };

        const dLat = quality === "low" ? 2.4 : 1.6;
        const positions: number[] = [];
        for (let lat = -84; lat <= 84; lat += dLat) {
          const dLng = dLat / Math.max(Math.cos((lat * Math.PI) / 180), 0.22);
          for (let lng = -180; lng < 180; lng += dLng) {
            if (isLand(lat, lng)) {
              positions.push(...latLngToVec3(lat, lng, GLOBE_RADIUS * 1.002));
            }
          }
        }

        if (cancelled) return;
        const geo = new BufferGeometry();
        geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
        setGeometry(geo);
      };

      scheduled =
        typeof ric === "function" ? ric(sample) : window.setTimeout(sample, 0);
    };

    return () => {
      cancelled = true;
      if (scheduled !== undefined) {
        if (typeof cic === "function") cic(scheduled);
        else clearTimeout(scheduled);
      }
    };
  }, [quality]);

  // Release the GPU buffer when it's replaced or the globe unmounts.
  useEffect(() => () => geometry?.dispose(), [geometry]);

  return geometry;
}

export function Globe({ quality = "high" }: { quality?: Quality } = {}) {
  const rootRef = useRef<Group>(null!);
  const starsRef = useRef<Points>(null!);
  const drag = useRef({ active: false, lastX: 0, vel: 0 });
  const { gl } = useThree();

  const preset = PRESETS[quality];

  const wireGeometry = useMemo(
    () =>
      buildMeridianGeometry(
        preset.meridianSegments,
        preset.meridianCount,
        preset.parallelCount,
      ),
    [preset],
  );
  const starGeometry = useMemo(
    () => buildStarfield(preset.starCount),
    [preset.starCount],
  );
  const cityGeometry = useMemo(() => buildCityPointsGeometry(), []);
  const landGeometry = useLandDotGeometry(quality);

  const [nycX, nycY, nycZ] = useMemo(
    () => latLngToVec3(site.location.lat, site.location.lng, GLOBE_RADIUS * 1.01),
    [],
  );

  // Desktop-only: drag horizontally to spin the globe in place. Skipped on
  // coarse pointers so it never fights touch scroll / the pinned scroll scene.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = gl.domElement;
    el.style.cursor = "grab";
    el.style.touchAction = "pan-y";

    const onDown = (e: PointerEvent) => {
      drag.current.active = true;
      drag.current.lastX = e.clientX;
      drag.current.vel = 0;
      el.style.cursor = "grabbing";
      el.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.lastX;
      drag.current.lastX = e.clientX;
      const delta = dx * 0.005;
      if (rootRef.current) rootRef.current.rotation.y += delta;
      drag.current.vel = delta;
    };
    const onUp = (e: PointerEvent) => {
      if (!drag.current.active) return;
      drag.current.active = false;
      el.style.cursor = "grab";
      el.releasePointerCapture?.(e.pointerId);
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      el.style.cursor = "";
    };
  }, [gl]);

  useFrame((_, dt) => {
    const root = rootRef.current;
    if (root && !drag.current.active) {
      // Ambient spin + decaying inertia handed off from a drag release.
      root.rotation.y += dt * 0.06 + drag.current.vel;
      drag.current.vel *= 0.92;
    }
    if (starsRef.current) starsRef.current.rotation.y -= dt * 0.01;
  });

  return (
    <>
      <points ref={starsRef} geometry={starGeometry}>
        <pointsMaterial
          color="#9fbf9f"
          size={0.015}
          sizeAttenuation
          transparent
          opacity={0.6}
        />
      </points>

      <group ref={rootRef}>
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS * 0.995, preset.sphereSegments, preset.sphereSegments]} />
          <meshBasicMaterial color="#061206" />
        </mesh>

        <lineSegments geometry={wireGeometry}>
          <lineBasicMaterial color="#39ff14" transparent opacity={0.22} />
        </lineSegments>

        {landGeometry && (
          <points geometry={landGeometry}>
            <pointsMaterial
              color="#39ff14"
              size={0.0115}
              sizeAttenuation
              transparent
              opacity={0.55}
            />
          </points>
        )}

        <points geometry={cityGeometry}>
          <pointsMaterial
            color="#9fbf9f"
            size={0.025}
            sizeAttenuation
            transparent
            opacity={0.85}
          />
        </points>

        <NYCMarker position={[nycX, nycY, nycZ]} />

        <mesh scale={1.15}>
          <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
          <AtmosphereMaterial />
        </mesh>
      </group>
    </>
  );
}
