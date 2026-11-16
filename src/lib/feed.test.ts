import { describe, expect, it } from 'vitest';
import { FEED_LIMIT, comparePosts, mergePosts } from './feed';
import type { Post } from './types';

const post = (id: string, minutesAgo: number): Post => ({
  id,
  author_name: 'Tester',
  body: `post ${id}`,
  photo_path: null,
  created_at: new Date(Date.UTC(2026, 10, 14, 12, 0) - minutesAgo * 60_000).toISOString(),
});

describe('comparePosts', () => {
  it('puts the newer post first', () => {
    expect([post('a', 10), post('b', 1)].sort(comparePosts).map((p) => p.id)).toEqual(['b', 'a']);
  });

  it('breaks a tie on time by id', () => {
    expect([post('b', 5), post('a', 5)].sort(comparePosts).map((p) => p.id)).toEqual(['a', 'b']);
  });
});

describe('mergePosts', () => {
  it('sorts an initial load newest first', () => {
    const merged = mergePosts([], [post('old', 60), post('new', 1), post('mid', 30)]);
    expect(merged.map((p) => p.id)).toEqual(['new', 'mid', 'old']);
  });

  it('puts a newer incoming post at the top', () => {
    const current = mergePosts([], [post('a', 10), post('b', 20)]);
    expect(mergePosts(current, [post('c', 0)]).map((p) => p.id)).toEqual(['c', 'a', 'b']);
  });

  it('returns the same array when the post is already present', () => {
    const current = mergePosts([], [post('a', 10), post('b', 20)]);
    expect(mergePosts(current, [post('a', 10)])).toBe(current);
  });

  it('returns the same array when nothing is incoming', () => {
    const current = mergePosts([], [post('a', 10)]);
    expect(mergePosts(current, [])).toBe(current);
  });

  it('adds a post only once when it arrives twice in one batch', () => {
    const merged = mergePosts([], [post('a', 1), post('a', 1)]);
    expect(merged).toHaveLength(1);
  });

  it('does not change the array it was given', () => {
    const current = mergePosts([], [post('a', 10)]);
    mergePosts(current, [post('b', 0)]);
    expect(current.map((p) => p.id)).toEqual(['a']);
  });

  it('never holds more than the limit and drops the oldest', () => {
    const many = Array.from({ length: FEED_LIMIT + 5 }, (_, i) => post(`p${i}`, i));
    const merged = mergePosts([], many);
    expect(merged).toHaveLength(FEED_LIMIT);
    expect(merged[0].id).toBe('p0');
    expect(merged.at(-1)?.id).toBe(`p${FEED_LIMIT - 1}`);
  });
});
