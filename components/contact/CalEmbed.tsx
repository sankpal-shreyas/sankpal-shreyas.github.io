"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { site } from "@/lib/config";

export function CalEmbed() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "intro" });
      const dark = {
        "cal-brand": "#39ff14",
        "cal-bg": "#0f1510",
        "cal-bg-emphasis": "#121a13",
        "cal-text": "#d6ffd6",
        "cal-text-emphasis": "#39ff14",
      };
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: { dark, light: dark },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-sm">
      <Cal
        namespace="intro"
        calLink={site.cal.link}
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{ layout: "month_view", theme: "dark" }}
      />
    </div>
  );
}
