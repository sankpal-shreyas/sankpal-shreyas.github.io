import { ImageResponse } from "next/og";
import { site } from "@/lib/config";

export const dynamic = "force-static";
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: "#0a0f0a",
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(57,255,20,0.10), transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,176,0,0.06), transparent 40%)",
          color: "#d6ffd6",
          fontFamily: "sans-serif",
        }}
      >
        {/* grid backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(57,255,20,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {/* kicker */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#39ff14",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#39ff14",
            }}
          />
          target acquired
        </div>

        {/* name + role */}
        <div style={{ display: "flex", flexDirection: "column", zIndex: 1 }}>
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
              color: "#ffffff",
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 32,
              color: "#9fbf9f",
              fontFamily: "monospace",
            }}
          >
            {site.role}
          </div>
        </div>

        {/* footer strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#7a8a7a",
            fontFamily: "monospace",
            letterSpacing: 2,
            textTransform: "uppercase",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 10,
                height: 10,
                backgroundColor: "#ffb000",
                transform: "rotate(45deg)",
              }}
            />
            <span>{site.location.city}</span>
          </div>
          <div style={{ color: "#39ff14" }}>
            {site.baseUrl.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
