import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode, {
  type Options as PrettyOptions,
} from "rehype-pretty-code";
import { ArrowLeft } from "lucide-react";
import { getAllPostSlugs, getPost } from "@/lib/mdx";
import { mdxComponents } from "@/components/blog/mdxComponents";

const prettyCodeOptions: PrettyOptions = {
  theme: "github-dark",
  keepBackground: false,
  defaultLang: "plaintext",
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
  return {
    title: post.title,
    description: post.description,
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

  return (
    <article className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <Link
        href="/blog"
        className="mb-10 inline-flex items-center gap-1.5 font-mono text-xs text-text-dim hover:text-primary"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        back to log
      </Link>

      <header className="mb-10 border-b border-border pb-6">
        <time
          dateTime={post.date}
          className="font-mono text-xs text-accent glow-accent"
        >
          {post.date}
        </time>
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
              rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
            },
          }}
        />
      </div>
    </article>
  );
}
