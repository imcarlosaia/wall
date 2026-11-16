export interface Post {
  id: string;
  author_name: string;
  body: string;
  photo_path: string | null;
  created_at: string;
}

export interface NewPost {
  author_name: string;
  body: string;
  photo_path: string | null;
}
