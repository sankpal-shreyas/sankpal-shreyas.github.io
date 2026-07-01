import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { readingMinutes } from "./readingTime";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  tags?: string[];
  featured?: boolean;
};

export type PostSummary = PostFrontmatter & {
  slug: string;
  readingMinutes: number;
};

export type Post = PostSummary & { content: string };

export type TocItem = { id: string; text: string; depth: number };

function readPostFile(slug: string): Post {
  const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data as PostFrontmatter;
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    tags: data.tags,
    featured: data.featured ?? false,
    readingMinutes: readingMinutes(parsed.content),
    content: parsed.content,
  };
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getAllPosts(): PostSummary[] {
  return getAllPostSlugs()
    .map((slug) => {
      const p = readPostFile(slug);
      return {
        slug: p.slug,
        title: p.title,
        description: p.description,
        date: p.date,
        tags: p.tags,
        featured: p.featured,
        readingMinutes: p.readingMinutes,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  try {
    return readPostFile(slug);
  } catch {
    return null;
  }
}

// Pull h2/h3 headings out of raw MDX for the table of contents. Slugs are
// generated with github-slugger — the same slugger rehype-slug uses on the
// rendered headings — so these ids line up with the anchor targets in the
// article. Scans line by line and skips anything inside a fenced code block so
// `## foo` shown *as* sample markdown (e.g. note templates) never leaks into the
// ToC. Fence tracking honors variable-length fences: a block opened with ```` ```` ````
// only closes on a same-character fence at least as long, so nested ``` blocks
// inside a ```` block are correctly treated as content.
export function getHeadings(content: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let openFence: string | null = null;

  for (const line of content.split("\n")) {
    const fence = line.match(/^[ \t]*([`~]{3,})/)?.[1];
    if (openFence) {
      if (fence && fence[0] === openFence[0] && fence.length >= openFence.length) {
        openFence = null;
      }
      continue;
    }
    if (fence) {
      openFence = fence;
      continue;
    }
    const heading = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      const text = heading[2].replace(/[`*_~]/g, "").trim();
      items.push({ id: slugger.slug(text), text, depth: heading[1].length });
    }
  }
  return items;
}
