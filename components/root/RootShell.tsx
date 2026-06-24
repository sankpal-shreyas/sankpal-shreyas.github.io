"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/lib/config";
import {
  ACHIEVEMENTS,
  getTrophies,
  unlock,
  type AchievementId,
} from "@/lib/achievements";
import { MatrixRain } from "./MatrixRain";

type Entry = { kind: "input" | "output"; text: string };

type CmdResult = {
  lines: string[];
  control?: "clear" | "exit" | "matrix";
  unlock?: AchievementId;
};

const HELP = [
  "available commands:",
  "  whoami            who am i, really",
  "  hire              why you should reach out",
  "  man shreyas       the full manual page",
  "  ls /skills        list core skills",
  "  nmap localhost    scan my open ports",
  "  cat flag.txt      read the flag",
  "  socials           where to find me",
  "  history           how this site was built",
  "  fortune           a random truth",
  "  cowsay <msg>      a cow says <msg>",
  "  matrix            follow the white rabbit",
  "  trophies          easter eggs you've found",
  "  clear             clear the screen",
  "  exit              close the tunnel",
  "",
  "  (↑/↓ recall history · tab to complete)",
];

const FORTUNES = [
  "there are two hard things in CS: cache invalidation, naming, and off-by-one errors.",
  "it works on my machine ¯\\_(ツ)_/¯",
  "the 'S' in IoT stands for security.",
  "weeks of coding can save you hours of planning.",
  "a SQL query walks into a bar, walks up to two tables and asks: can i join you?",
  "to understand recursion, you must first understand recursion.",
];

// Command strings used for tab-completion.
const COMPLETIONS = [
  "help",
  "whoami",
  "hire",
  "man shreyas",
  "ls /skills",
  "nmap localhost",
  "cat flag.txt",
  "cat /etc/passwd",
  "socials",
  "history",
  "fortune",
  "cowsay ",
  "matrix",
  "trophies",
  "uname -a",
  "ping ",
  "echo ",
  "coffee",
  "vim",
  "date",
  "clear",
  "exit",
];

function cowsay(message: string): string[] {
  const msg = message || "moo";
  const top = " " + "_".repeat(msg.length + 2);
  const bottom = " " + "-".repeat(msg.length + 2);
  return [
    top,
    `< ${msg} >`,
    bottom,
    "        \\   ^__^",
    "         \\  (oo)\\_______",
    "            (__)\\       )\\/\\",
    "                ||----w |",
    "                ||     ||",
  ];
}

function trophyLines(): string[] {
  const have = getTrophies();
  const ids = Object.keys(ACHIEVEMENTS) as AchievementId[];
  const out = [
    `trophies: ${have.length}/${ids.length} found`,
    "",
    ...ids.map((id) => {
      const got = have.includes(id);
      const a = ACHIEVEMENTS[id];
      return `  [${got ? "x" : " "}] ${got ? a.title : "????????"}${
        got ? `  — ${a.blurb}` : ""
      }`;
    }),
  ];
  return out;
}

function handleCommand(raw: string): CmdResult {
  const cmd = raw.trim().toLowerCase();
  const rest = raw.trim().slice(raw.trim().indexOf(" ") + 1);
  if (!cmd) return { lines: [] };

  if (cmd === "help" || cmd === "?" || cmd === "/help") return { lines: HELP };

  if (cmd === "whoami")
    return {
      lines: [
        "uid=1337(shreyas) gid=1337(shreyas) groups=1337(shreyas),42(nyu),808(ctf-players)",
        `location: ${site.location.city}`,
        `role:     ${site.role}`,
      ],
    };

  if (cmd === "cat flag.txt" || cmd === "flag" || cmd === "decrypt")
    return {
      lines: ["ctf{y0u_f0und_th3_s3cr3t_r00m_–_ping_me_i_got_f1ags_4_u}"],
      unlock: "flag",
    };

  if (cmd === "ls /skills" || cmd === "ls /skills/")
    return {
      lines: ["backend.py  security.md  ml.ipynb  cloud.yaml  crypto.pem  devops.sh"],
    };

  if (cmd === "ls" || cmd === "ls /")
    return { lines: ["bin  etc  home  skills  flag.txt  README.md"] };

  if (cmd === "history")
    return {
      lines: [
        "0001  git init portfolio",
        "0002  npx create-next-app",
        "0003  ./build-globe.sh",
        "0004  ./choreograph-tunnel.sh",
        "0005  ./ship",
        "0006  echo 'if you are reading this, you have earned my respect.'",
      ],
    };

  if (cmd === "socials")
    return {
      lines: [
        `github:   ${site.socials.github}`,
        `linkedin: ${site.socials.linkedin}`,
        `email:    ${site.socials.email}`,
      ],
    };

  if (cmd === "man shreyas" || cmd === "man")
    return {
      lines: [
        "SHREYAS(1)                  User Commands                 SHREYAS(1)",
        "",
        "NAME",
        `    shreyas — ${site.role}`,
        "",
        "SYNOPSIS",
        "    shreyas [--security] [--swe] [--ai-ml] [--hire]",
        "",
        "DESCRIPTION",
        "    Builds at the intersection of security, software, and ML.",
        "    Currently leveling up via an M.S. Cybersecurity @ NYU.",
        "",
        "SEE ALSO",
        "    hire(1), socials(1), nmap(1)",
      ],
    };

  if (cmd === "hire" || cmd === "recruit")
    return {
      lines: [
        "$ ./why_hire_shreyas --tldr",
        "  • security mindset + shipping-grade SWE + AI/ML chops",
        "  • backend (Python/Node) in production, now offensive + defensive sec",
        "  • talks to humans, writes docs, finishes things",
        "",
        `→ open to roles. fastest path: ${site.socials.email}`,
        "→ or run 'socials' for the rest.",
      ],
    };

  if (cmd === "nmap localhost" || cmd === "nmap")
    return {
      lines: [
        "Starting Nmap 7.95 ( https://nmap.org )",
        "Nmap scan report for shreyas (127.0.0.1)",
        "Host is up (0.00042s latency).",
        "",
        "PORT     STATE    SERVICE",
        "22/tcp   open     ssh        # always learning",
        "80/tcp   open     http       # /projects",
        "443/tcp  open     https      # /blog",
        "1337/tcp open     elite      # you're already in",
        "31337/tcp filtered leet      # cat flag.txt",
        "",
        "Nmap done: 1 IP address (1 host up) scanned in 0.42s",
      ],
    };

  if (cmd === "cat /etc/passwd")
    return {
      lines: [
        "root:x:0:0:root:/root:/bin/zsh",
        "shreyas:x:1337:1337:the guy you're hiring:/home/shreyas:/bin/zsh",
        "recruiter:x:1000:1000:hopefully you:/home/recruiter:/bin/bash",
        "nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin",
      ],
    };

  if (cmd.startsWith("ping")) {
    const host = rest && cmd !== "ping" ? rest : "shreyas.dev";
    return {
      lines: [
        `PING ${host}: 56 data bytes`,
        `64 bytes from ${host}: icmp_seq=0 ttl=64 time=0.042 ms`,
        `64 bytes from ${host}: icmp_seq=1 ttl=64 time=1337 ms (coffee break)`,
        `64 bytes from ${host}: icmp_seq=2 ttl=64 time=0.042 ms`,
        "--- ping statistics ---",
        "3 packets transmitted, 3 received, 0% packet loss",
      ],
    };
  }

  if (cmd === "uname -a" || cmd === "uname")
    return {
      lines: [
        "ShreyasOS 13.37-elite x86_64 GNU/Caffeine — built with ☕ and curiosity",
      ],
    };

  if (cmd === "fortune")
    return { lines: [FORTUNES[Math.floor(Math.random() * FORTUNES.length)]] };

  if (cmd.startsWith("cowsay"))
    return { lines: cowsay(cmd === "cowsay" ? "" : rest) };

  if (cmd === "vim" || cmd === "nano" || cmd === "emacs")
    return {
      lines: [
        `${cmd}: opened. now you're stuck here forever.`,
        "(this is a website. try :q!  …it won't help.)",
      ],
    };

  if (cmd === "coffee" || cmd === "brew" || cmd === "brew coffee")
    return {
      lines: [
        "HTTP/1.1 418 I'm a teapot",
        "the requested entity body is short and stout.",
      ],
    };

  if (cmd === "matrix" || cmd === "hack")
    return { lines: ["wake up, neo…"], control: "matrix", unlock: "matrix" };

  if (cmd === "trophies" || cmd === "achievements")
    return { lines: trophyLines() };

  if (cmd === "date") return { lines: [new Date().toString()] };

  if (cmd.startsWith("echo"))
    return { lines: [cmd === "echo" ? "" : rest] };

  if (cmd === "clear" || cmd === "cls") return { lines: [], control: "clear" };

  if (cmd === "exit" || cmd === "quit")
    return { lines: ["closing tunnel…"], control: "exit" };

  if (cmd === "sudo su" || cmd === "su")
    return { lines: ["You are already root, genius!"], unlock: "sudo" };

  if (cmd === "sudo rm -rf /")
    return {
      lines: [
        "[sudo] nice try, kiddo.",
        "effective UID check: FAILED",
        "this sandbox has no destructive syscalls.",
      ],
      unlock: "sudo",
    };

  if (cmd.startsWith("sudo"))
    return {
      lines: [`[sudo] password for guest: `, "nice try — you're not in the sudoers file."],
      unlock: "sudo",
    };

  return { lines: [`${raw}: command not found — try 'help'`] };
}

export function RootShell() {
  const [entries, setEntries] = useState<Entry[]>([
    { kind: "output", text: "last login: now, from tty1" },
    { kind: "output", text: "type 'help' for a list of commands." },
    { kind: "output", text: "" },
  ]);
  const [value, setValue] = useState("");
  const [matrix, setMatrix] = useState(false);
  const cmdHistory = useRef<string[]>([]);
  const histIndex = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reaching the shell at all is itself an achievement.
    unlock("root-terminal");
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries]);

  const closeMatrix = useCallback(() => setMatrix(false), []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitted = value;
    setValue("");

    if (submitted.trim()) cmdHistory.current = [...cmdHistory.current, submitted];
    histIndex.current = null;

    const result = handleCommand(submitted);
    if (result.unlock) unlock(result.unlock);

    if (result.control === "clear") {
      setEntries([]);
      return;
    }

    setEntries((prev) => [
      ...prev,
      { kind: "input", text: submitted },
      ...result.lines.map((o) => ({ kind: "output" as const, text: o })),
      { kind: "output", text: "" },
    ]);

    if (result.control === "exit") {
      setTimeout(() => {
        window.location.href = "/";
      }, 600);
    }
    if (result.control === "matrix") setMatrix(true);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const v = value.toLowerCase();
      if (!v) return;
      const matches = COMPLETIONS.filter((c) => c.startsWith(v));
      if (matches.length === 1) {
        setValue(matches[0]);
      } else if (matches.length > 1) {
        setEntries((prev) => [
          ...prev,
          { kind: "input", text: value },
          { kind: "output", text: matches.map((m) => m.trim()).join("   ") },
          { kind: "output", text: "" },
        ]);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const hist = cmdHistory.current;
      if (hist.length === 0) return;
      const next =
        histIndex.current === null
          ? hist.length - 1
          : Math.max(0, histIndex.current - 1);
      histIndex.current = next;
      setValue(hist[next] ?? "");
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const hist = cmdHistory.current;
      if (histIndex.current === null) return;
      const next = histIndex.current + 1;
      if (next >= hist.length) {
        histIndex.current = null;
        setValue("");
      } else {
        histIndex.current = next;
        setValue(hist[next]);
      }
    }
  };

  return (
    <>
      {matrix && <MatrixRain onDone={closeMatrix} />}
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
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              spellCheck={false}
              className="w-full flex-1 bg-transparent text-text caret-primary outline-none"
              aria-label="shell input"
            />
          </label>
        </form>
      </div>
    </>
  );
}
