import type { SupabaseClient } from '@supabase/supabase-js';
import { FEED_LIMIT } from './feed';
import { PHOTO_BUCKET, supabase } from './supabase';
import type { NewPost, Post } from './types';
import { photoExtension } from './validation';

const COLUMNS = 'id, author_name, body, photo_path, created_at';

function client(): SupabaseClient {
  if (!supabase) throw new Error('Supabase is not configured');
  return supabase;
}

export async function fetchLatest(): Promise<Post[]> {
  const { data, error } = await client()
    .from('posts')
    .select(COLUMNS)
    .order('created_at', { ascending: false })
    .limit(FEED_LIMIT);
  if (error) throw new Error(error.message);
  return data as Post[];
}

export async function createPost(input: NewPost): Promise<Post> {
  const { data, error } = await client().from('posts').insert(input).select(COLUMNS).single();
  if (error) throw new Error(error.message);
  return data as Post;
}

// Stores the file under a random name and resolves to that name. Only the name
// is saved on the post; the public address is built from it when displayed.
export async function uploadPhoto(file: File): Promise<string> {
  const extension = photoExtension(file.type);
  if (!extension) throw new Error('Unsupported photo type');
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await client()
    .storage.from(PHOTO_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: '31536000', upsert: false });
  if (error) throw new Error(error.message);
  return path;
}

export function photoUrl(path: string): string {
  return client().storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}

export function subscribeToNewPosts(onPost: (post: Post) => void): () => void {
  const db = client();
  const channel = db
    .channel('wall-posts')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
      onPost(payload.new as Post);
    })
    .subscribe();
  return () => {
    void db.removeChannel(channel);
  };
}
