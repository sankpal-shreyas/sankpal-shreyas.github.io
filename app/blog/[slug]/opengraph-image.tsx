import { ImageResponse } from "next/og";
import { getAllPostSlugs, getPost } from "@/lib/mdx";
import { site } from "@/lib/config";

export const dynamic = "force-static";
export const alt = `Blog post — ${site.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  const title = post?.title ?? "Post";
  const description = post?.description ?? "";
  const desc = description.length > 118 ? `${description.slice(0, 115)}…` : description;
  const meta = post ? `${post.date}  ·  ~${post.readingMinutes} min read` : "";
  // Shrink the title as it gets longer so it always fits in two-ish lines.
  const titleSize = title.length > 52 ? 54 : title.length > 34 ? 64 : 74;

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
            "radial-gradient(circle at 20% 25%, rgba(57,255,20,0.10), transparent 45%), radial-gradient(circle at 85% 85%, rgba(255,176,0,0.06), transparent 40%)",
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
            gap: 14,
            fontSize: 24,
            fontFamily: "monospace",
            letterSpacing: 4,
            zIndex: 1,
          }}
        >
          <span style={{ color: "#39ff14" }}>~/blog</span>
          <span style={{ color: "#7a8a7a" }}>—</span>
          <span style={{ color: "#9fbf9f" }}>{site.handle}</span>
        </div>

        {/* title + description */}
        <div style={{ display: "flex", flexDirection: "column", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              fontSize: titleSize,
              fontWeight: 700,
              letterSpacing: -1,
              lineHeight: 1.08,
              color: "#ffffff",
            }}
          >
            {title}
          </div>
          {desc ? (
            <div
              style={{
                display: "flex",
                marginTop: 24,
                fontSize: 28,
                lineHeight: 1.4,
                color: "#9fbf9f",
              }}
            >
              {desc}
            </div>
          ) : null}
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
            <span>{meta}</span>
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
