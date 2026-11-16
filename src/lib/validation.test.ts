import { describe, expect, it } from 'vitest';
import {
  BODY_MAX,
  NAME_MAX,
  PHOTO_MAX_BYTES,
  authorName,
  charCount,
  photoExtension,
  remaining,
  validateBody,
  validateName,
  validatePhoto,
} from './validation';

describe('charCount', () => {
  it('counts plain characters', () => {
    expect(charCount('hello')).toBe(5);
  });

  it('counts an emoji as one character', () => {
    expect(charCount('hi 👋')).toBe(4);
  });

  it('counts an empty string as zero', () => {
    expect(charCount('')).toBe(0);
  });
});

describe('remaining', () => {
  it('starts at the full limit', () => {
    expect(remaining('')).toBe(280);
  });

  it('goes negative past the limit', () => {
    expect(remaining('a'.repeat(283))).toBe(-3);
  });
});

describe('validateName', () => {
  it('accepts an empty name, because the name is optional', () => {
    expect(validateName('')).toBeNull();
    expect(validateName('   ')).toBeNull();
  });

  it('accepts one character and the maximum length', () => {
    expect(validateName('A')).toBeNull();
    expect(validateName('a'.repeat(NAME_MAX))).toBeNull();
  });

  it('ignores surrounding spaces when measuring', () => {
    expect(validateName(`  ${'a'.repeat(NAME_MAX)}  `)).toBeNull();
  });

  it('rejects a name over the maximum', () => {
    expect(validateName('a'.repeat(NAME_MAX + 1))).toBe('Keep your name to 40 characters');
  });
});

describe('authorName', () => {
  it('uses the typed name, trimmed', () => {
    expect(authorName('  Sam  ')).toBe('Sam');
  });

  it('falls back to Guest when the name is empty or only spaces', () => {
    expect(authorName('')).toBe('Guest');
    expect(authorName('   ')).toBe('Guest');
  });
});

describe('validateBody', () => {
  it('rejects empty and whitespace-only messages', () => {
    expect(validateBody('')).toBe('Write a message first');
    expect(validateBody(' \n ')).toBe('Write a message first');
  });

  it('accepts the maximum length', () => {
    expect(validateBody('a'.repeat(BODY_MAX))).toBeNull();
  });

  it('rejects one character over the maximum', () => {
    expect(validateBody('a'.repeat(BODY_MAX + 1))).toBe('Keep it to 280 characters');
  });

  it('counts emoji as single characters at the limit', () => {
    expect(validateBody('👋'.repeat(BODY_MAX))).toBeNull();
    expect(validateBody('👋'.repeat(BODY_MAX + 1))).toBe('Keep it to 280 characters');
  });
});

describe('validatePhoto', () => {
  it.each(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])('accepts %s', (type) => {
    expect(validatePhoto({ type, size: 1000 })).toBeNull();
  });

  it('rejects other file types', () => {
    expect(validatePhoto({ type: 'application/pdf', size: 1000 })).toBe('Use a JPG, PNG, GIF or WebP image.');
    expect(validatePhoto({ type: 'image/svg+xml', size: 1000 })).toBe('Use a JPG, PNG, GIF or WebP image.');
    expect(validatePhoto({ type: '', size: 1000 })).toBe('Use a JPG, PNG, GIF or WebP image.');
  });

  it('accepts exactly 5 MB and rejects one byte more', () => {
    expect(validatePhoto({ type: 'image/png', size: PHOTO_MAX_BYTES })).toBeNull();
    expect(validatePhoto({ type: 'image/png', size: PHOTO_MAX_BYTES + 1 })).toBe('That photo is over 5MB.');
  });
});

describe('photoExtension', () => {
  it('maps each accepted type to its extension', () => {
    expect(photoExtension('image/jpeg')).toBe('jpg');
    expect(photoExtension('image/png')).toBe('png');
    expect(photoExtension('image/gif')).toBe('gif');
    expect(photoExtension('image/webp')).toBe('webp');
  });

  it('returns null for anything else', () => {
    expect(photoExtension('text/plain')).toBeNull();
  });
});
