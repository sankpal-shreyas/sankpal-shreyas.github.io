"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/config";

type Entry = { kind: "input" | "output"; text: string };

const HELP = [
  "available:",
  "  whoami           who am i, really",
  "  cat flag.txt     read the flag",
  "  ls /skills       list core skills",
  "  history          what this site is",
  "  socials          where to find me",
  "  clear            clear screen",
  "  exit             close tunnel",
];

function handleCommand(raw: string): string[] {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return [];
  if (cmd === "help" || cmd === "/help") return HELP;
  if (cmd === "whoami")
    return [
      "uid=1337(shreyas) gid=1337(shreyas) groups=1337(shreyas),42(osiris),808(ctf-players)",
      `location: ${site.location.city}`,
      `role:     ${site.role}`,
    ];
  if (cmd === "cat flag.txt")
    return ["ctf{y0u_f0und_th3_s3cr3t_r00m_–_ping_me_i_got_f1ags_4_u}"];
  if (cmd === "ls /skills" || cmd === "ls /skills/")
    return [
      "backend.py  security.md  ml.ipynb  cloud.yaml  crypto.pem  devops.sh",
    ];
  if (cmd === "history")
    return [
      "0001  git init portfolio",
      "0002  npx create-next-app",
      "0003  ./build-globe.sh",
      "0004  ./choreograph-tunnel.sh",
      "0005  ./ship",
      "0006  echo 'if you are reading this, you are hired.'",
    ];
  if (cmd === "socials")
    return [
      `github:   ${site.socials.github}`,
      `linkedin: ${site.socials.linkedin}`,
      `email:    ${site.socials.email}`,
    ];
  if (cmd === "clear" || cmd === "cls") return ["__CLEAR__"];
  if (cmd === "exit" || cmd === "quit") return ["__EXIT__"];
  if (cmd === "sudo rm -rf /")
    return [
      "[sudo] nice try, kiddo.",
      "effective UID check: FAILED",
      "this sandbox has no destructive syscalls.",
    ];
  return [`${raw}: command not found — try 'help'`];
}

export function RootShell() {
  const [entries, setEntries] = useState<Entry[]>([
    { kind: "output", text: "last login: now, from tty1" },
    { kind: "output", text: "type 'help' for a list of commands." },
    { kind: "output", text: "" },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("cmd") as HTMLInputElement;
    const value = input.value;
    input.value = "";

    const out = handleCommand(value);
    if (out[0] === "__CLEAR__") {
      setEntries([]);
      return;
    }
    if (out[0] === "__EXIT__") {
      setEntries((prev) => [
        ...prev,
        { kind: "input", text: value },
        { kind: "output", text: "closing tunnel…" },
      ]);
      setTimeout(() => {
        window.location.href = "/";
      }, 600);
      return;
    }

    setEntries((prev) => [
      ...prev,
      { kind: "input", text: value },
      ...out.map((o) => ({ kind: "output" as const, text: o })),
      { kind: "output", text: "" },
    ]);
  };

  return (
    <div
      className="flex h-[520px] flex-col rounded-md border border-primary/50 bg-bg-panel shadow-glow-lg"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center justify-between border-b border-border bg-bg px-4 py-2 font-mono text-xs text-text-dim">
        <span className="text-primary glow-text">root@shreyas:~</span>
        <span>zsh · 80×24</span>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-6 text-text-dim"
      >
        {entries.map((e, i) =>
          e.kind === "input" ? (
            <p key={i} className="whitespace-pre-wrap">
              <span className="text-primary">root@shreyas:~#</span>{" "}
              <span className="text-text">{e.text}</span>
            </p>
          ) : (
            <p key={i} className="whitespace-pre-wrap">
              {e.text}
            </p>
          ),
        )}
      </div>
      <form onSubmit={onSubmit} className="border-t border-border px-4 py-2">
        <label className="flex items-center gap-2 font-mono text-[13px]">
          <span className="text-primary">root@shreyas:~#</span>
          <input
            ref={inputRef}
            name="cmd"
            autoComplete="off"
            spellCheck={false}
            className="w-full flex-1 bg-transparent text-text caret-primary outline-none"
            aria-label="shell input"
          />
        </label>
      </form>
    </div>
  );
}
