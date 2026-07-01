import type { Metadata } from "next";
import { Rss } from "lucide-react";
import { getAllPosts } from "@/lib/mdx";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { SubscribeForm } from "@/components/blog/SubscribeForm";

export const metadata: Metadata = {
  title: "blog",
  description: "Security writeups, tooling notes, and ML side-quests.",
};

// A post counts as "new" if published within this many days of the build.
const NEW_WINDOW_DAYS = 30;

export default function BlogIndexPage() {
  const now = Date.now();
  const posts = getAllPosts().map((p) => ({
    ...p,
    isNew: now - Date.parse(p.date) < NEW_WINDOW_DAYS * 86_400_000,
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 pt-32 pb-24">
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
        {/* Subscribe options: email (Buttondown) + RSS. */}
        <div className="mt-5 space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-text-dim">
            get new posts
          </p>
          <SubscribeForm />
          <a
            href="/feed.xml"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-text-dim transition-colors hover:text-primary"
          >
            <Rss className="size-3.5" aria-hidden />
            or subscribe via rss
          </a>
        </div>
      </header>

      <BlogExplorer posts={posts} />
    </div>
  );
}
