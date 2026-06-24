// Rough reading-time estimate from a post's raw MDX. Counts whitespace-delimited
// tokens (markup and code included — a slight overcount that roughly offsets the
// slower pace of reading code) against an average prose reading speed.
const WORDS_PER_MINUTE = 200;

export function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
