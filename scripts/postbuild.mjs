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
  const src = path.join(outDir, "opengraph-image");
  const dst = path.join(outDir, "opengraph-image.png");

  try {
    await fs.access(src);
  } catch {
    console.warn("[postbuild] no /opengraph-image to rename — skipping");
    return;
  }

  await fs.rename(src, dst);
  console.log("[postbuild] renamed opengraph-image → opengraph-image.png");

  const files = await walk(outDir);
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
