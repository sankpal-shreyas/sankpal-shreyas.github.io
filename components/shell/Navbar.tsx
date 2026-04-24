"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, Terminal } from "lucide-react";
import { navLinks, site } from "@/lib/config";

export function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm text-primary glow-text hover:text-primary-dim"
        >
          <Terminal className="size-4" aria-hidden />
          <span className="tracking-wider">
            {onHome ? "~" : `~/${pathname.replace(/^\//, "")}`}
          </span>
          <span aria-hidden>/</span>
          <span className="text-text">{site.handle}</span>
          <span className="terminal-cursor" aria-hidden />
        </Link>

        <div className="flex items-center gap-1 font-mono text-xs uppercase tracking-widest">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-sm px-3 py-1.5 transition-colors ${
                  active
                    ? "text-primary glow-text"
                    : "text-text-dim hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => {
              const ev = new KeyboardEvent("keydown", {
                key: "k",
                ctrlKey: !isMac,
                metaKey: isMac,
                bubbles: true,
              });
              window.dispatchEvent(ev);
            }}
            aria-label="open command palette"
            className="ml-1 hidden items-center gap-1.5 rounded-sm border border-border px-2 py-1.5 text-text-dim transition-colors hover:border-primary/60 hover:text-primary md:inline-flex"
          >
            <span className="text-[10px]">{isMac ? "⌘" : "ctrl"}</span>
            <span className="text-[10px]">k</span>
          </button>
          <a
            href={site.resumePath}
            target="_blank"
            rel="noopener noreferrer"
            data-no-transition="true"
            className="ml-2 inline-flex items-center gap-1.5 rounded-sm border border-accent/50 bg-accent/10 px-3 py-1.5 text-accent transition-colors hover:bg-accent/20"
          >
            <Download className="size-3.5" aria-hidden />
            resume
          </a>
        </div>
      </nav>
    </header>
  );
}
