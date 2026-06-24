"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Download, Menu, Terminal, X } from "lucide-react";
import { navLinks, site } from "@/lib/config";
import { unlock } from "@/lib/achievements";

export function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [isMac, setIsMac] = useState(false);
  const [open, setOpen] = useState(false);
  const logoClicks = useRef<number[]>([]);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
  }, []);

  // Mash the logo 5× in quick succession to trip an easter egg. The Navbar
  // lives in the root layout, so the ref survives client-side navigation.
  const onLogoClick = () => {
    const now = Date.now();
    logoClicks.current = [...logoClicks.current, now].filter((t) => now - t < 1500);
    if (logoClicks.current.length >= 5) {
      logoClicks.current = [];
      unlock("logo-masher");
    }
  };

  // Collapse the mobile menu whenever the route changes or Escape is pressed.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          onClick={onLogoClick}
          className="flex min-w-0 items-center gap-2 font-mono text-sm text-primary glow-text hover:text-primary-dim"
        >
          <Terminal className="size-4 shrink-0" aria-hidden />
          <span className="truncate tracking-wider">
            {onHome ? "~" : `~/${pathname.replace(/^\//, "")}`}
          </span>
          <span aria-hidden className="hidden sm:inline">
            /
          </span>
          <span className="hidden truncate text-text sm:inline">{site.handle}</span>
          <span className="terminal-cursor shrink-0" aria-hidden />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 font-mono text-xs uppercase tracking-widest md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-sm px-3 py-1.5 transition-colors ${
                isActive(link.href)
                  ? "text-primary glow-text"
                  : "text-text-dim hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
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
            className="ml-1 inline-flex items-center gap-1.5 rounded-sm border border-border px-2 py-1.5 text-text-dim transition-colors hover:border-primary/60 hover:text-primary"
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

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "close menu" : "open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="inline-flex shrink-0 items-center justify-center rounded-sm border border-border p-2 text-text-dim transition-colors hover:border-primary/60 hover:text-primary md:hidden"
        >
          {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-nav"
          className="border-t border-border/60 bg-bg/95 backdrop-blur-md md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 font-mono text-sm uppercase tracking-widest">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-sm px-3 py-2 transition-colors ${
                  isActive(link.href)
                    ? "text-primary glow-text"
                    : "text-text-dim hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={site.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              data-no-transition="true"
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center gap-1.5 self-start rounded-sm border border-accent/50 bg-accent/10 px-3 py-2 text-accent transition-colors hover:bg-accent/20"
            >
              <Download className="size-3.5" aria-hidden />
              resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
