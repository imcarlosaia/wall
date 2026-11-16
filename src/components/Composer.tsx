'use client';

import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { loadName, saveName } from '@/lib/name-storage';
import { createPost, uploadPhoto } from '@/lib/posts';
import type { Post } from '@/lib/types';
import { NAME_MAX, authorName, remaining, validateBody, validateName, validatePhoto } from '@/lib/validation';
import { PhotoPicker, type PickedPhoto } from './PhotoPicker';

type Field = 'name' | 'body' | 'photo' | 'form';

interface ComposerError {
  field: Field;
  message: string;
}

const SAVE_FAILED = "Couldn't share your post. Try again.";
const PHOTO_FAILED = "Couldn't upload that photo. Try again or share without it.";

const INPUT =
  'w-full rounded-md border px-3 py-2 placeholder:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

export function Composer({ onPosted }: { onPosted: (post: Post) => void }) {
  const [name, setName] = useState(loadName);
  const [body, setBody] = useState('');
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ComposerError | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const left = remaining(body);
  const canShare = !busy && body.trim() !== '' && left >= 0;

  const pickPhoto = (file: File) => {
    const problem = validatePhoto(file);
    if (problem) {
      setError({ field: 'photo', message: problem });
      return;
    }
    if (photo) URL.revokeObjectURL(photo.url);
    setPhoto({ file, url: URL.createObjectURL(file) });
    setError(null);
  };

  const removePhoto = () => {
    if (photo) URL.revokeObjectURL(photo.url);
    setPhoto(null);
    setError(null);
  };

  const share = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;

    const nameProblem = validateName(name);
    if (nameProblem) {
      setError({ field: 'name', message: nameProblem });
      nameRef.current?.focus();
      return;
    }
    const bodyProblem = validateBody(body);
    if (bodyProblem) {
      setError({ field: 'body', message: bodyProblem });
      bodyRef.current?.focus();
      return;
    }

    setBusy(true);
    setError(null);
    try {
      let photoPath: string | null = null;
      if (photo) {
        try {
          photoPath = await uploadPhoto(photo.file);
        } catch {
          setError({ field: 'photo', message: PHOTO_FAILED });
          return;
        }
      }
      const post = await createPost({ author_name: authorName(name), body: body.trim(), photo_path: photoPath });
      onPosted(post);
      setBody('');
      if (photo) URL.revokeObjectURL(photo.url);
      setPhoto(null);
    } catch {
      setError({ field: 'form', message: SAVE_FAILED });
    } finally {
      setBusy(false);
      bodyRef.current?.focus();
    }
  };

  const shareOnShortcut = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <form onSubmit={share} aria-busy={busy} noValidate>
      <label htmlFor="wall-name" className="sr-only">
        Your name (optional)
      </label>
      <input
        id="wall-name"
        ref={nameRef}
        value={name}
        maxLength={NAME_MAX}
        placeholder="Your name (optional)"
        autoComplete="nickname"
        readOnly={busy}
        aria-invalid={error?.field === 'name'}
        aria-describedby="wall-error"
        onChange={(event) => {
          setName(event.target.value);
          saveName(event.target.value);
          if (error?.field === 'name') setError(null);
        }}
        className={`${INPUT} max-w-xs ${error?.field === 'name' ? 'border-danger' : 'border-line'}`}
      />

      <label htmlFor="wall-body" className="sr-only">
        Message
      </label>
      <textarea
        id="wall-body"
        ref={bodyRef}
        value={body}
        rows={3}
        placeholder="What's on your mind?"
        readOnly={busy}
        aria-invalid={error?.field === 'body' || left < 0}
        aria-describedby="wall-counter wall-error"
        onChange={(event) => {
          setBody(event.target.value);
          if (error?.field === 'body' || error?.field === 'form') setError(null);
        }}
        onKeyDown={shareOnShortcut}
        className={`${INPUT} mt-2 resize-y border-dashed bg-brand-soft ${left < 0 ? 'border-danger' : 'border-line'}`}
      />
      <p id="wall-counter" className={`mt-1 text-sm ${left < 0 ? 'font-semibold text-danger' : 'text-ink-soft'}`}>
        {left} characters remaining
      </p>

      <PhotoPicker photo={photo} disabled={busy} onPick={pickPhoto} onRemove={removePhoto} />

      <div className="mt-3 flex items-start justify-between gap-3">
        <p id="wall-error" role="alert" className="min-h-5 text-sm text-danger">
          {error?.message ?? ''}
        </p>
        <button
          type="submit"
          disabled={!canShare}
          className="shrink-0 cursor-pointer rounded-md bg-brand px-6 py-2 font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-default disabled:bg-line disabled:hover:brightness-100"
        >
          {busy ? 'Sharing…' : 'Share'}
        </button>
      </div>
    </form>
  );
}
