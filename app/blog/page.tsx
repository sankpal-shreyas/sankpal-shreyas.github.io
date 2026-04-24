import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "blog",
  description: "Security writeups, tooling notes, and ML side-quests.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-4xl px-6 pt-32 pb-24">
      <header className="mb-12 border-b border-border pb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-primary glow-text">
          ./blog
        </p>
        <h1 className="mt-2 font-mono text-4xl font-semibold text-text">
          transmission log
        </h1>
        <p className="mt-3 max-w-2xl font-mono text-sm text-text-dim">
          Short-form posts on security, backend engineering, and ML experiments.
          New entries land here via plain MDX commits.
        </p>
      </header>

      <ul className="flex flex-col gap-2">
        {posts.map((post) => (
          <li key={post.slug}>
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
          </li>
        ))}
      </ul>

      {posts.length === 0 && (
        <p className="font-mono text-sm text-muted">
          [ empty log — first transmission incoming ]
        </p>
      )}
    </div>
  );
}
