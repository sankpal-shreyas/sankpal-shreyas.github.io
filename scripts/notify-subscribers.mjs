// Emails subscribers about newly published blog posts via the Buttondown API.
// Runs in CI after a successful Pages deploy. It diffs the just-pushed commit
// range, finds blog `.mdx` files that were ADDED (not edited), and sends one
// newsletter per new post with status "about_to_send".
//
// Idempotent: skips a post when an email with the same subject already exists in
// Buttondown, so re-running the workflow never double-sends. Edits to existing
// posts are ignored (only added files trigger a send).
//
// Env:
//   BUTTONDOWN_API_KEY  (required unless DRY_RUN)  Token from Buttondown → Settings → API
//   HEAD_SHA            the pushed commit (defaults to HEAD)
//   BASE_SHA            the commit before the push (github.event.before)
//   SITE_BASE_URL       canonical origin (defaults to the GitHub Pages URL)
//   DRY_RUN=1           log what would be sent; no network calls
//
// NOTE: the first real send may return 400 `sending_requires_confirmation` —
// Buttondown requires a one-time confirmation in the UI before it will auto-send
// via the API. Confirm once, then this runs unattended.

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const API = "https://api.buttondown.com/v1/emails";
const API_KEY = process.env.BUTTONDOWN_API_KEY;
const HEAD_SHA = process.env.HEAD_SHA || "HEAD";
const BASE_SHA = process.env.BASE_SHA || "";
const BASE_URL = (process.env.SITE_BASE_URL || "https://sankpal-shreyas.github.io").replace(/\/$/, "");
const DRY_RUN = process.env.DRY_RUN === "1";
const ZERO = "0".repeat(40);

if (!API_KEY && !DRY_RUN) {
  console.error("BUTTONDOWN_API_KEY is not set.");
  process.exit(1);
}

const git = (cmd) => execSync(`git ${cmd}`, { encoding: "utf8" }).trim();

// The commit to diff against. Prefer the push's "before" SHA; fall back to the
// previous commit (e.g. for branch creation / force pushes where before is 0s).
function resolveBase() {
  if (BASE_SHA && BASE_SHA !== ZERO) {
    try {
      execSync(`git cat-file -e ${BASE_SHA}`, { stdio: "ignore" });
      return BASE_SHA;
    } catch {
      /* not in history — fall through */
    }
  }
  try {
    return git(`rev-parse ${HEAD_SHA}~1`);
  } catch {
    return null;
  }
}

function addedPosts(base) {
  return git(`diff --name-only --diff-filter=A ${base} ${HEAD_SHA} -- content/blog`)
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.endsWith(".mdx"));
}

// Minimal frontmatter reader (title/description) — avoids pulling deps into CI.
function parseFrontmatter(raw) {
  // Normalize CRLF/CR up front so trailing \r never breaks line-level parsing.
  const text = raw.replace(/\r\n?/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const fm = {};
  if (!m) return fm;
  for (const line of m[1].split("\n")) {
    const km = line.match(/^(\w+):\s*(.*)$/);
    if (!km) continue;
    let v = km[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    fm[km[1]] = v;
  }
  return fm;
}

const headers = { Authorization: `Token ${API_KEY}` };

async function alreadySent(subject) {
  try {
    const res = await fetch(API, { headers });
    if (!res.ok) return false;
    const data = await res.json();
    return (data.results || []).some((e) => e.subject === subject);
  } catch {
    return false;
  }
}

async function send(subject, body) {
  const res = await fetch(API, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ subject, body, status: "about_to_send" }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${text}`);
}

async function main() {
  const base = resolveBase();
  if (!base) {
    console.log("No base commit to diff against — nothing to send.");
    return;
  }

  const files = addedPosts(base);
  if (files.length === 0) {
    console.log("No new blog posts in this push — nothing to send.");
    return;
  }

  let failures = 0;
  for (const file of files) {
    const slug = file.replace(/^.*\//, "").replace(/\.mdx$/, "");
    const fm = parseFrontmatter(readFileSync(file, "utf8"));
    const subject = fm.title || slug;
    const url = `${BASE_URL}/blog/${slug}/`;
    const body = `# ${subject}\n\n${fm.description || ""}\n\n[Read the full post →](${url})`;

    if (DRY_RUN) {
      console.log(`[dry-run] would send "${subject}" → ${url}`);
      continue;
    }

    if (await alreadySent(subject)) {
      console.log(`↩︎  Already sent, skipping: "${subject}"`);
      continue;
    }

    try {
      await send(subject, body);
      console.log(`✅ Queued newsletter: "${subject}" (${url})`);
    } catch (err) {
      failures++;
      console.error(`❌ Failed to send "${subject}": ${err.message}`);
    }
  }

  if (failures > 0) process.exit(1);
}

main().catch((err) => {
  console.error("notify-subscribers failed:", err);
  process.exit(1);
});
