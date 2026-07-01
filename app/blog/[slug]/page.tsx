import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode, {
  type Options as PrettyOptions,
} from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Rss } from "lucide-react";
import { getAllPostSlugs, getHeadings, getPost } from "@/lib/mdx";
import { site } from "@/lib/config";
import { mdxComponents } from "@/components/blog/mdxComponents";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ReadAloud } from "@/components/blog/ReadAloud";
import { CopyLinkButton } from "@/components/blog/CopyLinkButton";
import { ReadingTheme } from "@/components/blog/ReadingTheme";
import { SubscribeForm } from "@/components/blog/SubscribeForm";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

const prettyCodeOptions: PrettyOptions = {
  theme: "github-dark",
  keepBackground: false,
  // Block-only default. A bare string applies to inline code too, which makes
  // rehype-pretty-code wrap every `inline` span in a figure + data-line — and
  // the figure CSS then renders each inline fragment as its own block line.
  defaultLang: { block: "plaintext" },
};

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `${site.baseUrl.replace(/\/$/, "")}/blog/${slug}/`;
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      siteName: site.name,
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const headings = getHeadings(post.content);

  return (
    <>
      <ReadingProgress />
      <TableOfContents headings={headings} />
      <article className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <div className="mb-10 flex items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-text-dim hover:text-primary"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            back to log
          </Link>
          <div className="flex items-center gap-2">
            <CopyLinkButton />
            <ReadingTheme />
          </div>
        </div>

        <header className="mb-10 border-b border-border pb-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs">
            <time dateTime={post.date} className="text-accent glow-accent">
              {post.date}
            </time>
            <span aria-hidden className="text-text-dim">
              ·
            </span>
            <span className="text-text-dim">~{post.readingMinutes} min read</span>
            <ReadAloud content={post.content} />
          </div>
          <h1 className="mt-2 font-mono text-3xl font-semibold text-text sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 font-mono text-sm text-text-dim">{post.description}</p>
        </header>

        <div className="prose-terminal">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
              },
            }}
          />
        </div>

        <footer className="mt-16 border-t border-border pt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-text-dim">
            get new posts
          </p>
          <p className="mb-4 mt-2 max-w-xl font-mono text-sm text-text-dim">
            New writeups on security, backend, and ML — straight to your inbox.
            No spam, unsubscribe anytime.
          </p>
          <SubscribeForm />
          <a
            href="/feed.xml"
            className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-text-dim transition-colors hover:text-primary"
          >
            <Rss className="size-3.5" aria-hidden />
            or subscribe via rss
          </a>
        </footer>

        <ScrollToTop />
      </article>
    </>
  );
}
