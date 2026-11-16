import type { Post } from './types';

export const FEED_LIMIT = 50;

export function comparePosts(a: Post, b: Post): number {
  const byTime = Date.parse(b.created_at) - Date.parse(a.created_at);
  if (byTime !== 0) return byTime;
  if (a.id === b.id) return 0;
  return a.id < b.id ? -1 : 1;
}

// Adds posts that are not already in the list, keeps the list newest first and
// capped. A post that arrives twice (once from saving, once from the live
// subscription) is added only once.
export function mergePosts(current: readonly Post[], incoming: readonly Post[]): readonly Post[] {
  const known = new Set(current.map((post) => post.id));
  const fresh: Post[] = [];
  for (const post of incoming) {
    if (known.has(post.id)) continue;
    known.add(post.id);
    fresh.push(post);
  }
  if (fresh.length === 0) return current;
  return [...current, ...fresh].sort(comparePosts).slice(0, FEED_LIMIT);
}
