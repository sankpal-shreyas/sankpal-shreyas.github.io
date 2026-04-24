"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  Copy,
  Download,
  FileText,
  Github,
  Home,
  Linkedin,
  Mail,
  Search,
  Terminal,
} from "lucide-react";
import { site } from "@/lib/config";

type Cmd = {
  id: string;
  label: string;
  hint?: string;
  group: "navigate" | "links" | "actions";
  keywords?: string;
  icon: React.ComponentType<{ className?: string }>;
  run: (router: ReturnType<typeof useRouter>) => void;
};

const COMMANDS: Cmd[] = [
  {
    id: "home",
    label: "go home",
    hint: "/",
    group: "navigate",
    keywords: "root index hero",
    icon: Home,
    run: (r) => r.push("/"),
  },
  {
    id: "projects",
    label: "go projects",
    hint: "/projects",
    group: "navigate",
    keywords: "work shipped builds",
    icon: ArrowRight,
    run: (r) => r.push("/projects"),
  },
  {
    id: "blog",
    label: "go blog",
    hint: "/blog",
    group: "navigate",
    keywords: "writing posts notes",
    icon: FileText,
    run: (r) => r.push("/blog"),
  },
  {
    id: "contact",
    label: "go contact",
    hint: "/contact",
    group: "navigate",
    keywords: "terminal email message",
    icon: Terminal,
    run: (r) => r.push("/contact"),
  },
  {
    id: "github",
    label: "open github",
    hint: site.socials.github.replace("https://", ""),
    group: "links",
    keywords: "code source repo",
    icon: Github,
    run: () => window.open(site.socials.github, "_blank", "noopener,noreferrer"),
  },
  {
    id: "linkedin",
    label: "open linkedin",
    hint: site.socials.linkedin.replace("https://", ""),
    group: "links",
    keywords: "profile work",
    icon: Linkedin,
    run: () => window.open(site.socials.linkedin, "_blank", "noopener,noreferrer"),
  },
  {
    id: "email",
    label: "send email",
    hint: site.socials.email,
    group: "links",
    keywords: "mail contact reach",
    icon: Mail,
    run: () => {
      window.location.href = `mailto:${site.socials.email}`;
    },
  },
  {
    id: "cal",
    label: "book a call",
    hint: `cal.com/${site.cal.link}`,
    group: "links",
    keywords: "schedule meeting calendly",
    icon: Calendar,
    run: () =>
      window.open(`https://cal.com/${site.cal.link}`, "_blank", "noopener,noreferrer"),
  },
  {
    id: "resume",
    label: "download resume",
    hint: site.resumePath,
    group: "actions",
    keywords: "cv pdf",
    icon: Download,
    run: () => window.open(site.resumePath, "_blank", "noopener,noreferrer"),
  },
  {
    id: "copy-email",
    label: "copy email to clipboard",
    hint: site.socials.email,
    group: "actions",
    keywords: "address mail",
    icon: Copy,
    run: () => {
      navigator.clipboard?.writeText(site.socials.email).catch(() => {});
    },
  },
];

const GROUP_LABEL: Record<Cmd["group"], string> = {
  navigate: "navigate",
  links: "links",
  actions: "actions",
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter((c) => {
      const hay = `${c.label} ${c.hint ?? ""} ${c.keywords ?? ""}`.toLowerCase();
      return q.split(/\s+/).every((token) => hay.includes(token));
    });
  }, [query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const li = listRef.current?.children.item(active) as HTMLElement | null;
    li?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const grouped = useMemo(() => {
    const map = new Map<Cmd["group"], { cmd: Cmd; index: number }[]>();
    filtered.forEach((cmd, index) => {
      const arr = map.get(cmd.group) ?? [];
      arr.push({ cmd, index });
      map.set(cmd.group, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const run = (cmd: Cmd) => {
    setOpen(false);
    cmd.run(router);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (filtered.length === 0 ? 0 : (i + 1) % filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) =>
        filtered.length === 0 ? 0 : (i - 1 + filtered.length) % filtered.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[active];
      if (cmd) run(cmd);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="command palette"
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-bg/70 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-md border border-primary/40 bg-bg-panel shadow-glow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border bg-bg px-4 py-3 font-mono text-[13px]">
          <Search className="size-4 text-primary" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="type a command or search…"
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent text-text caret-primary outline-none placeholder:text-muted"
          />
          <kbd className="hidden shrink-0 rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] text-text-dim sm:inline">
            esc
          </kbd>
        </div>

        <ul
          ref={listRef}
          role="listbox"
          className="max-h-[60vh] overflow-y-auto py-1 font-mono text-[13px]"
        >
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-text-dim">
              no matches for{" "}
              <span className="text-text">&ldquo;{query}&rdquo;</span>
            </li>
          )}

          {grouped.map(([group, items]) => (
            <li key={group}>
              <p className="px-4 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                {GROUP_LABEL[group]}
              </p>
              <ul>
                {items.map(({ cmd, index }) => {
                  const isActive = index === active;
                  const Icon = cmd.icon;
                  return (
                    <li
                      key={cmd.id}
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => run(cmd)}
                      className={`flex cursor-pointer items-center gap-3 px-4 py-2 ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-text-dim hover:bg-bg"
                      }`}
                    >
                      <Icon
                        className={`size-3.5 shrink-0 ${isActive ? "text-primary" : "text-muted"}`}
                        aria-hidden
                      />
                      <span className="flex-1 truncate">{cmd.label}</span>
                      {cmd.hint && (
                        <span className="hidden truncate text-[11px] text-muted sm:inline">
                          {cmd.hint}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-border bg-bg px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded-sm border border-border px-1 py-0.5 text-[9px] text-text-dim">
                ↑↓
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded-sm border border-border px-1 py-0.5 text-[9px] text-text-dim">
                ⏎
              </kbd>
              run
            </span>
          </span>
          <span className="text-primary glow-text">~/cmd</span>
        </div>
      </div>
    </div>
  );
}
