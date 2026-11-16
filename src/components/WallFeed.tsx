'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { mergePosts } from '@/lib/feed';
import { fetchLatest, subscribeToNewPosts } from '@/lib/posts';
import { isConfigured } from '@/lib/supabase';
import type { Post } from '@/lib/types';
import { Composer } from './Composer';
import { FeedSkeleton, PostList, type FeedStatus } from './PostList';

const NOT_CONNECTED = "This wall isn't connected to its database yet.";
const MINUTE = 60_000;

const subscribeToNothing = () => () => {};

function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}

export function WallFeed() {
  const hydrated = useHydrated();

  if (!isConfigured) {
    return (
      <div role="status" className="rounded-md border border-line bg-page p-4">
        <p className="font-semibold">{NOT_CONNECTED}</p>
        <p className="mt-1 text-sm text-ink-soft">
          Add the two Supabase values described in the README, then reload the page.
        </p>
      </div>
    );
  }

  if (!hydrated) return <FeedSkeleton />;
  return <ConnectedFeed />;
}

function ConnectedFeed() {
  const [posts, setPosts] = useState<readonly Post[]>([]);
  const [status, setStatus] = useState<FeedStatus>('loading');
  const [now, setNow] = useState(() => new Date());
  const [attempt, setAttempt] = useState(0);

  // Loads the latest posts on mount and again whenever Retry bumps `attempt`.
  // A response that arrives after the effect is cleaned up is ignored.
  useEffect(() => {
    let cancelled = false;
    fetchLatest().then(
      (latest) => {
        if (cancelled) return;
        setPosts((current) => mergePosts(current, latest));
        setNow(new Date());
        setStatus('ready');
      },
      () => {
        if (!cancelled) setStatus('error');
      },
    );
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  // New posts from any visitor. mergePosts ignores a post that is already
  // shown, so the visitor's own post is not added twice.
  useEffect(
    () =>
      subscribeToNewPosts((post) => {
        setPosts((current) => mergePosts(current, [post]));
        setNow(new Date());
      }),
    [],
  );

  // Keep "2m" and "1h" moving while the page stays open.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), MINUTE);
    return () => window.clearInterval(timer);
  }, []);

  const handlePosted = (post: Post) => {
    setPosts((current) => mergePosts(current, [post]));
    setNow(new Date());
  };

  const retry = () => {
    setStatus('loading');
    setAttempt((count) => count + 1);
  };

  return (
    <>
      <Composer onPosted={handlePosted} />
      <div className="mt-6 border-t border-line-soft">
        <PostList posts={posts} status={status} now={now} onRetry={retry} />
      </div>
    </>
  );
}
