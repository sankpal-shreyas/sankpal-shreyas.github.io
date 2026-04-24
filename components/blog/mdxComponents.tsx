import type { ComponentProps } from "react";

export const mdxComponents = {
  h1: (p: ComponentProps<"h1">) => (
    <h1 className="mt-8 mb-4 font-mono text-3xl font-semibold text-text glow-text" {...p} />
  ),
  h2: (p: ComponentProps<"h2">) => (
    <h2 className="mt-10 mb-3 font-mono text-2xl font-semibold text-primary glow-text" {...p} />
  ),
  h3: (p: ComponentProps<"h3">) => (
    <h3 className="mt-8 mb-2 font-mono text-xl font-semibold text-text" {...p} />
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
  pre: (p: ComponentProps<"pre">) => (
    <pre
      className="my-6 overflow-x-auto rounded-md border border-border bg-bg-panel p-4 font-mono text-[13px] leading-6 text-text"
      {...p}
    />
  ),
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
