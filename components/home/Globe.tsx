"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
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

function buildMeridianGeometry(segments = 48) {
  const positions: number[] = [];
  const meridianCount = 24;
  for (let m = 0; m < meridianCount; m++) {
    const lng = (m / meridianCount) * 360 - 180;
    for (let i = 0; i < segments; i++) {
      const lat1 = (i / segments) * 180 - 90;
      const lat2 = ((i + 1) / segments) * 180 - 90;
      positions.push(...latLngToVec3(lat1, lng, GLOBE_RADIUS));
      positions.push(...latLngToVec3(lat2, lng, GLOBE_RADIUS));
    }
  }
  const parallelCount = 12;
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

export function Globe() {
  const rootRef = useRef<Group>(null!);
  const starsRef = useRef<Points>(null!);

  const wireGeometry = useMemo(() => buildMeridianGeometry(), []);
  const starGeometry = useMemo(() => buildStarfield(), []);
  const cityGeometry = useMemo(() => buildCityPointsGeometry(), []);

  const [nycX, nycY, nycZ] = useMemo(
    () => latLngToVec3(site.location.lat, site.location.lng, GLOBE_RADIUS * 1.01),
    [],
  );

  useFrame((_, dt) => {
    if (rootRef.current) rootRef.current.rotation.y += dt * 0.06;
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
          <sphereGeometry args={[GLOBE_RADIUS * 0.995, 64, 64]} />
          <meshBasicMaterial color="#061206" />
        </mesh>

        <lineSegments geometry={wireGeometry}>
          <lineBasicMaterial color="#39ff14" transparent opacity={0.22} />
        </lineSegments>

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
