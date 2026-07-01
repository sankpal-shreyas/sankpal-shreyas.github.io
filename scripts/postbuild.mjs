// Next.js generates `/out/opengraph-image` (no extension) from app/opengraph-image.tsx.
// GitHub Pages serves extensionless files as application/octet-stream, which breaks
// social-media OG crawlers. Rename the file, and rewrite HTML references to match.

import { promises as fs } from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.cwd(), "out");

async function walk(dir, acc = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

async function main() {
  const files = await walk(outDir);

  // Next emits every generated OG image (the root one plus one per blog post) as
  // an extensionless file. GitHub Pages serves those as octet-stream, which
  // breaks social crawlers — rename each to .png.
  let renamed = 0;
  for (const file of files) {
    if (path.basename(file) === "opengraph-image") {
      await fs.rename(file, `${file}.png`);
      renamed++;
    }
  }
  console.log(`[postbuild] renamed ${renamed} opengraph-image file(s) → .png`);

  // Repoint HTML/txt references (og:image / twitter:image) to the .png. Paths of
  // these files are unchanged by the rename above, so the collected list is fine.
  const rewriteExts = new Set([".html", ".txt"]);
  let patched = 0;
  for (const file of files) {
    if (!rewriteExts.has(path.extname(file))) continue;
    const content = await fs.readFile(file, "utf8");
    if (!content.includes("opengraph-image")) continue;
    // Only rewrite the bare path, not the already-patched .png version.
    const next = content.replace(/opengraph-image(?!\.png)/g, "opengraph-image.png");
    if (next !== content) {
      await fs.writeFile(file, next, "utf8");
      patched++;
    }
  }

  console.log(`[postbuild] patched ${patched} file(s) to reference opengraph-image.png`);
}

main().catch((err) => {
  console.error("[postbuild] failed:", err);
  process.exit(1);
});
