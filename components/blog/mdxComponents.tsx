import type { ComponentProps } from "react";
import { CopyablePre } from "@/components/blog/CopyablePre";

// Hover-revealed "#" deep link next to a heading. `id` is stamped on the
// heading by rehype-slug; the parent heading uses `group` so the link fades in
// on hover.
function HeadingAnchor({ id }: { id?: string }) {
  if (!id) return null;
  return (
    <a
      href={`#${id}`}
      aria-label="link to this section"
      className="ml-2 select-none font-normal text-primary/40 opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
    >
      #
    </a>
  );
}

export const mdxComponents = {
  h1: ({ id, children, ...p }: ComponentProps<"h1">) => (
    <h1
      id={id}
      className="group mt-8 mb-4 scroll-mt-28 font-mono text-3xl font-semibold text-text glow-text"
      {...p}
    >
      {children}
      <HeadingAnchor id={id} />
    </h1>
  ),
  h2: ({ id, children, ...p }: ComponentProps<"h2">) => (
    <h2
      id={id}
      className="group mt-10 mb-3 scroll-mt-28 font-mono text-2xl font-semibold text-primary glow-text"
      {...p}
    >
      {children}
      <HeadingAnchor id={id} />
    </h2>
  ),
  h3: ({ id, children, ...p }: ComponentProps<"h3">) => (
    <h3
      id={id}
      className="group mt-8 mb-2 scroll-mt-28 font-mono text-xl font-semibold text-text"
      {...p}
    >
      {children}
      <HeadingAnchor id={id} />
    </h3>
  ),
  p: (p: ComponentProps<"p">) => (
    <p className="my-4 font-mono text-sm leading-7 text-text-dim" {...p} />
  ),
  a: (p: ComponentProps<"a">) => (
    <a
      className="text-primary underline decoration-primary/50 underline-offset-4 hover:decoration-primary"
      target={p.href?.startsWith("http") ? "_blank" : undefined}
      rel={p.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...p}
    />
  ),
  ul: (p: ComponentProps<"ul">) => (
    <ul className="my-4 ml-5 list-disc space-y-2 font-mono text-sm text-text-dim marker:text-primary" {...p} />
  ),
  ol: (p: ComponentProps<"ol">) => (
    <ol className="my-4 ml-5 list-decimal space-y-2 font-mono text-sm text-text-dim marker:text-accent" {...p} />
  ),
  code: (p: ComponentProps<"code">) => (
    <code
      className="rounded-sm border border-border bg-bg-panel px-1.5 py-0.5 font-mono text-[13px] text-primary"
      {...p}
    />
  ),
  pre: CopyablePre,
  blockquote: (p: ComponentProps<"blockquote">) => (
    <blockquote
      className="my-6 border-l-2 border-primary/60 bg-primary/5 px-4 py-2 font-mono text-sm italic text-text-dim"
      {...p}
    />
  ),
  hr: (p: ComponentProps<"hr">) => (
    <hr className="my-10 border-border" {...p} />
  ),
};
