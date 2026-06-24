"use client";

import { useCallback, useEffect, useState } from "react";
import type { ToastDetail, ToastTone } from "@/lib/eggs";

const TONE: Record<ToastTone, string> = {
  primary: "border-primary/50 text-primary",
  accent: "border-accent/50 text-accent",
  danger: "border-danger/50 text-danger",
};

export function EasterEggToaster() {
  const [toasts, setToasts] = useState<ToastDetail[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  useEffect(() => {
    const onToast = (e: Event) => {
      const detail = (e as CustomEvent<ToastDetail>).detail;
      setToasts((t) => [...t.slice(-3), detail]);
      window.setTimeout(() => dismiss(detail.id), 4200);
    };
    window.addEventListener("egg:toast", onToast as EventListener);
    return () => window.removeEventListener("egg:toast", onToast as EventListener);
  }, [dismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[300] flex w-full max-w-xs flex-col gap-2">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismiss(t.id)}
          className={`pointer-events-auto rounded-md border bg-bg-panel/95 px-4 py-2 text-left font-mono text-xs leading-5 shadow-glow-md backdrop-blur-sm ${TONE[t.tone]}`}
        >
          <span className="mr-2 opacity-70">▸</span>
          {t.message}
        </button>
      ))}
    </div>
  );
}
