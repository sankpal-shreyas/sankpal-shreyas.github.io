"use client";

import { useEffect, useState } from "react";

export function CalEmbedClient() {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let alive = true;
    import("./CalEmbed")
      .then((mod) => {
        if (alive) setComponent(() => mod.CalEmbed);
      })
      .catch(() => {
        if (alive) setComponent(null);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!Component) {
    return (
      <div className="flex h-[420px] items-center justify-center font-mono text-xs text-text-dim">
        <span className="terminal-cursor">loading calendar</span>
      </div>
    );
  }

  return <Component />;
}
