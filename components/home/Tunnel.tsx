"use client";

import { useEffect, useRef } from "react";

const HANDSHAKE_LINES = [
  "[tcp] SYN  172.16.254.12 → 40.71.28.74:443",
  "[tcp] SYN,ACK remote → local seq=0xA21F",
  "[tcp] ACK  handshake complete",
  "[tls] ClientHello · tls_1_3",
  "[tls] ServerHello · ECDHE-X25519",
  "[tls] cert_chain verified · STRICT",
  "[app] HTTP/2 GET /shreyas",
  "[app] 200 OK · content-type: text/ego",
  "[nav] entering warroom…",
];

export function Tunnel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
  }, []);

  return (
    <section
      ref={ref}
      id="tunnel"
      className="relative flex h-[80svh] items-center justify-center overflow-hidden bg-bg"
      aria-hidden
    >
      <div className="absolute inset-0 perspective-[600px] flex items-center justify-center">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="absolute aspect-square w-[80vmin] rounded-full border border-primary/40"
            style={{
              transform: `translateZ(${-i * 120}px) scale(${1 - i * 0.05})`,
              opacity: Math.max(0, 0.9 - i * 0.07),
              animation: `tunnel-fade 5s ease-in-out ${i * 0.2}s infinite alternate`,
              boxShadow: "0 0 32px rgba(57, 255, 20, 0.15)",
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />

      <div className="relative z-10 w-full max-w-3xl px-6 font-mono text-[11px] leading-6 text-primary/80 glow-text">
        <p className="mb-2 text-[10px] uppercase tracking-[0.4em] text-text-dim">
          [tunnel.established]
        </p>
        <ul className="space-y-1">
          {HANDSHAKE_LINES.map((line, i) => (
            <li
              key={i}
              style={{
                animation: `tunnel-line 4s ease-in-out ${i * 0.25}s infinite`,
              }}
              className="whitespace-pre"
            >
              {line}
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @keyframes tunnel-fade {
          0% { opacity: 0.05; transform: translateZ(-1600px) scale(0.2); }
          50% { opacity: 0.8; }
          100% { opacity: 0.05; transform: translateZ(100px) scale(1.6); }
        }
        @keyframes tunnel-line {
          0%, 100% { opacity: 0.2; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(4px); }
        }
      `}</style>
    </section>
  );
}
