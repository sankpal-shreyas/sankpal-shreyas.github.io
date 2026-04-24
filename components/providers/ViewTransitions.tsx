"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type DocumentWithVT = Document & {
  startViewTransition?: (cb: () => void | Promise<void>) => unknown;
};

function isInternalLink(a: HTMLAnchorElement): boolean {
  if (a.target && a.target !== "" && a.target !== "_self") return false;
  if (a.hasAttribute("download")) return false;
  if (a.dataset.noTransition === "true") return false;
  const href = a.getAttribute("href");
  if (!href) return false;
  if (href.startsWith("#")) return false;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  if (a.origin !== window.location.origin) return false;
  if (a.pathname === window.location.pathname) return false;
  return true;
}

export function ViewTransitions({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const doc = document as DocumentWithVT;
    if (typeof doc.startViewTransition !== "function") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      if (!isInternalLink(anchor as HTMLAnchorElement)) return;

      const href = (anchor as HTMLAnchorElement).pathname +
        (anchor as HTMLAnchorElement).search +
        (anchor as HTMLAnchorElement).hash;

      e.preventDefault();
      doc.startViewTransition?.(() => {
        router.push(href);
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  return <>{children}</>;
}
