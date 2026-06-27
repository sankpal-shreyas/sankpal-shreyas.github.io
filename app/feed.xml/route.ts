import { generateRssFeed } from "@/lib/feed";

// Statically rendered at build time → emitted as /out/feed.xml by `output: export`.
export const dynamic = "force-static";

export function GET() {
  return new Response(generateRssFeed(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
