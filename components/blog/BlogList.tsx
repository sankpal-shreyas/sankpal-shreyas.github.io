"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { PostSummary } from "@/lib/mdx";

const EASE = [0.22, 1, 0.36, 1] as const;

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const row: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
};

export function BlogList({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) {
    return (
      <p className="font-mono text-sm text-muted">
        [ empty log — first transmission incoming ]
      </p>
    );
  }

  return (
    <motion.ul
      className="flex flex-col gap-2"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={list}
    >
      {posts.map((post) => (
        <motion.li key={post.slug} variants={row}>
          <Link
            href={`/blog/${post.slug}`}
            className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-4 border-b border-border py-5 font-mono transition-colors hover:border-primary/60"
          >
            <time
              dateTime={post.date}
              className="text-xs text-accent glow-accent"
            >
              {post.date}
            </time>
            <div>
              <p className="text-base text-text group-hover:text-primary group-hover:glow-text">
                {post.title}
              </p>
              <p className="mt-1 text-xs text-text-dim">{post.description}</p>
            </div>
            <ArrowRight
              className="size-4 text-text-dim transition-all group-hover:translate-x-1 group-hover:text-primary"
              aria-hidden
            />
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}
