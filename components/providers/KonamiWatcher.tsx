"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/eggs";
import { unlock } from "@/lib/achievements";

const SEQUENCE = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

function isEditable(el: EventTarget | null) {
  const node = el as HTMLElement | null;
  if (!node) return false;
  return (
    node.tagName === "INPUT" ||
    node.tagName === "TEXTAREA" ||
    node.isContentEditable === true
  );
}

export function KonamiWatcher() {
  const router = useRouter();

  useEffect(() => {
    let buffer: string[] = [];
    let typed = "";

    const enterRoot = () => {
      document.body.classList.add("crt-flicker");
      window.setTimeout(() => {
        document.body.classList.remove("crt-flicker");
        router.push("/root");
      }, 600);
    };

    const onKey = (e: KeyboardEvent) => {
      // Never hijack keystrokes while the visitor is typing into a field.
      if (isEditable(e.target)) return;

      const key = e.key.toLowerCase();
      buffer = [...buffer, key].slice(-SEQUENCE.length);
      if (
        buffer.length === SEQUENCE.length &&
        buffer.every((k, i) => k === SEQUENCE[i])
      ) {
        buffer = [];
        unlock("konami");
        showToast("sequence accepted — opening root shell…", "accent");
        enterRoot();
        return;
      }

      // Typed-word triggers (single printable chars only).
      if (e.key.length === 1) {
        typed = (typed + key).slice(-8);
        if (typed.endsWith("sudo")) {
          typed = "";
          unlock("sudo");
          showToast("sudo: nice try — you're not in the sudoers file.", "danger");
        } else if (typed.endsWith("root")) {
          typed = "";
          showToast("elevating privileges…", "accent");
          enterRoot();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return null;
}
