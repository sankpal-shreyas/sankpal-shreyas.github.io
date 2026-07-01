"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { PostRow, type ListPost } from "@/components/blog/PostRow";

type Sort = "newest" | "oldest" | "longest";

const SORTS: { value: Sort; label: string }[] = [
  { value: "newest", label: "newest" },
  { value: "oldest", label: "oldest" },
  { value: "longest", label: "longest read" },
];

// Client-side browser for the post list: free-text search, tag filtering, and
// sort — all in-memory over the full index (cheap on a static site). Controls
// live in a sticky sidebar on large screens and collapse to a stacked block on
// small ones. Featured posts pin above the log in the default view; once you
// search or filter, the featured strip collapses and everything matching shows
// in one list.
export function BlogExplorer({ posts }: { posts: ListPost[] }) {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("newest");

  // Tag universe with counts, most-used first.
  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) for (const t of p.tags ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [posts]);

  const isFiltering = query.trim() !== "" || activeTags.length > 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = posts.filter((p) => {
      if (activeTags.length && !(p.tags ?? []).some((t) => activeTags.includes(t))) {
        return false;
      }
      if (!q) return true;
      const hay = `${p.title} ${p.description} ${(p.tags ?? []).join(" ")}`.toLowerCase();
      return q.split(/\s+/).every((token) => hay.includes(token));
    });
    return [...out].sort((a, b) => {
      if (sort === "longest") return b.readingMinutes - a.readingMinutes;
      const cmp = a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
      return sort === "oldest" ? cmp : -cmp;
    });
  }, [posts, query, activeTags, sort]);

  const featured = useMemo(() => posts.filter((p) => p.featured), [posts]);
  const showFeatured = !isFiltering && featured.length > 0;
  // Default view pins featured above the log, so drop them from the list to
  // avoid showing the same post twice.
  const listPosts = showFeatured ? filtered.filter((p) => !p.featured) : filtered;

  const toggleTag = (tag: string) =>
    setActiveTags((cur) => (cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]));

  const clear = () => {
    setQuery("");
    setActiveTags([]);
  };

  return (
    <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
      {/* Controls — sticky sidebar on large screens, stacked block on small. */}
      <aside className="mb-8 lg:mb-0">
        <div className="space-y-5 lg:sticky lg:top-28">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-text-dim"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search posts…"
              aria-label="search posts"
              className="w-full rounded-sm border border-border bg-bg-panel py-2 pl-9 pr-3 font-mono text-xs text-text placeholder:text-text-dim focus:border-primary/60 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="post-sort"
              className="block font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim"
            >
              sort
            </label>
            <select
              id="post-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="w-full rounded-sm border border-border bg-bg-panel px-2 py-1.5 font-mono text-xs text-text focus:border-primary/60 focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {tags.length > 0 && (
            <div className="space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
                filter by tag
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map(([tag, count]) => {
                  const on = activeTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      aria-pressed={on}
                      className={`inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 font-mono text-[11px] transition-colors ${
                        on
                          ? "border-primary/60 bg-primary/10 text-primary"
                          : "border-border text-text-dim hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      {tag}
                      <span className="text-[10px] text-muted">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isFiltering && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1 font-mono text-[11px] text-text-dim transition-colors hover:text-primary"
            >
              <X className="size-3" aria-hidden />
              clear filters
            </button>
          )}
        </div>
      </aside>

      {/* Posts */}
      <div className="min-w-0">
        {showFeatured && (
          <section className="mb-10">
            <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-accent glow-accent">
              featured
            </h2>
            {featured.length === 1 ? (
              <PostRow post={featured[0]} variant="featured" hero />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {featured.map((p) => (
                  <PostRow key={p.slug} post={p} variant="featured" />
                ))}
              </div>
            )}
          </section>
        )}

        <div className="mb-4 font-mono text-[11px] text-text-dim">
          {filtered.length} {filtered.length === 1 ? "post" : "posts"}
          {isFiltering ? ` of ${posts.length}` : ""}
        </div>

        {filtered.length === 0 ? (
          <p className="py-12 text-center font-mono text-sm text-muted">
            [ no posts match{query.trim() ? ` “${query.trim()}”` : " these filters"} ]
          </p>
        ) : (
          <motion.ul
            key={`${query}|${activeTags.join(",")}|${sort}`}
            className="flex flex-col"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          >
            {listPosts.map((p) => (
              <PostRow key={p.slug} post={p} asListItem />
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  );
}
