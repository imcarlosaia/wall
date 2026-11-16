export const NAME_MAX = 40;
export const DEFAULT_NAME = 'Guest';
export const BODY_MAX = 280;
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

const PHOTO_EXTENSIONS: Readonly<Record<string, string>> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
};

export const PHOTO_ACCEPT = Object.keys(PHOTO_EXTENSIONS).join(',');

// Counts Unicode code points, so one emoji is one character. This matches
// char_length() in Postgres, which enforces the same limits in the database.
export function charCount(text: string): number {
  return [...text].length;
}

export function remaining(body: string): number {
  return BODY_MAX - charCount(body);
}

// The name is optional: a visitor can type a message and press Share straight
// away. Only an over-long name is an error.
export function validateName(raw: string): string | null {
  if (charCount(raw.trim()) > NAME_MAX) return `Keep your name to ${NAME_MAX} characters`;
  return null;
}

// The name a post is saved under: what the visitor typed, or the default.
export function authorName(raw: string): string {
  const name = raw.trim();
  return name === '' ? DEFAULT_NAME : name;
}

export function validateBody(raw: string): string | null {
  const length = charCount(raw.trim());
  if (length === 0) return 'Write a message first';
  if (length > BODY_MAX) return `Keep it to ${BODY_MAX} characters`;
  return null;
}

export function photoExtension(type: string): string | null {
  return PHOTO_EXTENSIONS[type] ?? null;
}

export function validatePhoto(file: { type: string; size: number }): string | null {
  if (photoExtension(file.type) === null) return 'Use a JPG, PNG, GIF or WebP image.';
  if (file.size > PHOTO_MAX_BYTES) return 'That photo is over 5MB.';
  return null;
}
