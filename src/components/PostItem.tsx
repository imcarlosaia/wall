import { photoUrl } from '@/lib/posts';
import { relativeTime } from '@/lib/time';
import type { Post } from '@/lib/types';

export function PostItem({ post, now }: { post: Post; now: Date }) {
  return (
    <article className="border-b border-line-soft py-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="min-w-0 break-words font-bold">{post.author_name}</h2>
        <time
          dateTime={post.created_at}
          title={new Date(post.created_at).toLocaleString()}
          className="shrink-0 text-xs text-ink-soft"
        >
          {relativeTime(post.created_at, now)}
        </time>
      </div>
      <p className="mt-1 whitespace-pre-wrap break-words">{post.body}</p>
      {post.photo_path && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- visitor uploads of unknown size, served straight from storage */}
          <img
            src={photoUrl(post.photo_path)}
            alt={`Photo shared by ${post.author_name}`}
            loading="lazy"
            className="mt-3 max-h-96 w-full max-w-xs rounded-md object-cover"
          />
        </>
      )}
    </article>
  );
}
