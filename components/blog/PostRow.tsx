"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { PostSummary } from "@/lib/mdx";

export type ListPost = PostSummary & { isNew: boolean };

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

function NewBadge() {
  return (
    <span className="shrink-0 rounded-sm border border-primary/50 bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary">
      new
    </span>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

// One blog entry.
//   variant="featured" + hero → full-width highlighted hero (lone featured post)
//   variant="featured"        → compact card (used in the 2-up featured grid)
//   variant="row"             → full-width log row (animated when asListItem)
export function PostRow({
  post,
  variant = "row",
  asListItem = false,
  hero = false,
}: {
  post: ListPost;
  variant?: "row" | "featured";
  asListItem?: boolean;
  hero?: boolean;
}) {
  if (variant === "featured") {
    if (hero) {
      return (
        <Link
          href={`/blog/${post.slug}`}
          className="group block rounded-md border border-primary/30 bg-bg-panel/40 p-5 transition-colors hover:border-primary/60"
        >
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <time dateTime={post.date} className="text-accent glow-accent">
              {post.date}
            </time>
            <span className="text-text-dim">·</span>
            <span className="text-text-dim">{post.readingMinutes} min</span>
            {post.isNew && <NewBadge />}
          </div>
          <p className="mt-2 font-mono text-lg font-semibold text-text group-hover:text-primary group-hover:glow-text">
            {post.title}
          </p>
          <p className="mt-2 max-w-2xl font-mono text-sm text-text-dim">
            {post.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            {post.tags && post.tags.length > 0 ? <TagList tags={post.tags} /> : <span />}
            <span className="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-primary">
              read post
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </span>
          </div>
        </Link>
      );
    }

    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group flex h-full flex-col rounded-md border border-border bg-bg-panel/40 p-4 transition-colors hover:border-primary/50"
      >
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <time dateTime={post.date} className="text-accent glow-accent">
            {post.date}
          </time>
          <span className="text-text-dim">·</span>
          <span className="text-text-dim">{post.readingMinutes} min</span>
          {post.isNew && <NewBadge />}
        </div>
        <p className="mt-2 font-mono text-sm text-text group-hover:text-primary group-hover:glow-text">
          {post.title}
        </p>
        <p className="mt-1 line-clamp-2 font-mono text-xs text-text-dim">
          {post.description}
        </p>
      </Link>
    );
  }

  const row = (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-4 border-b border-border py-5 font-mono transition-colors hover:border-primary/60"
    >
      <div className="flex flex-col gap-0.5">
        <time dateTime={post.date} className="text-xs text-accent glow-accent">
          {post.date}
        </time>
        <span className="text-[11px] text-text-dim">{post.readingMinutes} min</span>
      </div>
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-2 text-base text-text group-hover:text-primary group-hover:glow-text">
          {post.title}
          {post.isNew && <NewBadge />}
        </p>
        <p className="mt-1 max-w-2xl text-xs text-text-dim">{post.description}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2">
            <TagList tags={post.tags} />
          </div>
        )}
      </div>
      <ArrowRight
        className="size-4 self-center text-text-dim transition-all group-hover:translate-x-1 group-hover:text-primary"
        aria-hidden
      />
    </Link>
  );

  return asListItem ? <motion.li variants={rowVariants}>{row}</motion.li> : row;
}
