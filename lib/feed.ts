import { site } from "@/lib/config";
import { getAllPosts } from "@/lib/mdx";

const FEED_DESCRIPTION = "Security writeups, tooling notes, and ML side-quests.";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// RFC-822 date (what RSS 2.0 expects) from a YYYY-MM-DD frontmatter date, pinned
// to UTC midnight so output is stable regardless of the build machine's timezone.
function rfc822(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

// Build an RSS 2.0 feed from the published posts. Pure string generation so it
// runs at build time and exports to a static /feed.xml under `output: export`.
export function generateRssFeed(): string {
  const base = site.baseUrl.replace(/\/$/, "");
  const posts = getAllPosts();
  const lastBuild = posts[0] ? rfc822(posts[0].date) : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const url = `${base}/blog/${post.slug}/`;
      const lines = [
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${rfc822(post.date)}</pubDate>`,
        `      <description>${escapeXml(post.description)}</description>`,
        ...(post.tags ?? []).map(
          (tag) => `      <category>${escapeXml(tag)}</category>`
        ),
      ];
      return `    <item>\n${lines.join("\n")}\n    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.name} — blog`)}</title>
    <link>${base}/blog/</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
    <generator>Next.js static export</generator>
${items}
  </channel>
</rss>
`;
}
