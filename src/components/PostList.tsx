import type { Post } from '@/lib/types';
import { PostItem } from './PostItem';

export type FeedStatus = 'loading' | 'ready' | 'error';

const LOAD_FAILED = "Couldn't load the wall. Try again.";
const EMPTY = 'No posts yet. Be the first to write on the wall.';

interface PostListProps {
  posts: readonly Post[];
  status: FeedStatus;
  now: Date;
  onRetry: () => void;
}

export function FeedSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse motion-reduce:animate-none">
      {[0, 1, 2].map((row) => (
        <div key={row} className="border-b border-line-soft py-4">
          <div className="h-4 w-28 rounded bg-line-soft" />
          <div className="mt-3 h-4 w-4/5 rounded bg-line-soft" />
        </div>
      ))}
    </div>
  );
}

export function PostList({ posts, status, now, onRetry }: PostListProps) {
  if (status === 'loading') return <FeedSkeleton />;

  return (
    <section aria-label="Posts">
      {status === 'error' && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm text-danger">
          <p>{LOAD_FAILED}</p>
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-md border border-line px-3 py-1.5 font-semibold text-ink hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Retry
          </button>
        </div>
      )}
      {status === 'ready' && posts.length === 0 && <p className="py-8 text-center text-ink-soft">{EMPTY}</p>}
      {posts.length > 0 && (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="wall-enter">
              <PostItem post={post} now={now} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
