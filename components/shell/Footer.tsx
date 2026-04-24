import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { site } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-bg-raised">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 font-mono text-xs text-text-dim sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p>
            <span className="text-primary">$</span> echo &quot;&copy; {new Date().getFullYear()} {site.name}&quot;
          </p>
          <p className="text-muted">
            built with next · three · gsap · deployed on github pages
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={site.socials.github}
            className="inline-flex items-center gap-1 hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="size-4" aria-hidden />
            github
          </Link>
          <Link
            href={site.socials.linkedin}
            className="inline-flex items-center gap-1 hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="size-4" aria-hidden />
            linkedin
          </Link>
          <Link
            href={`mailto:${site.socials.email}`}
            className="inline-flex items-center gap-1 hover:text-primary"
          >
            <Mail className="size-4" aria-hidden />
            email
          </Link>
        </div>
      </div>
    </footer>
  );
}
