import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { BlogList } from "@/components/blog/BlogList";

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

      <BlogList posts={posts} />
    </div>
  );
}
