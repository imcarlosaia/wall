'use client';

import { PHOTO_ACCEPT } from '@/lib/validation';

export interface PickedPhoto {
  file: File;
  url: string;
}

interface PhotoPickerProps {
  photo: PickedPhoto | null;
  disabled: boolean;
  onPick: (file: File) => void;
  onRemove: () => void;
}

export function PhotoPicker({ photo, disabled, onPick, onRemove }: PhotoPickerProps) {
  if (photo) {
    return (
      <div className="mt-3 flex items-center gap-3 rounded-md border border-line p-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- local preview from a blob URL */}
        <img src={photo.url} alt="" className="h-16 w-16 shrink-0 rounded object-cover" />
        <p className="min-w-0 flex-1 truncate text-sm">{photo.file.name}</p>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="cursor-pointer rounded-md border border-line px-3 py-1.5 text-sm font-semibold hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-default disabled:opacity-50"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <label
      className={`mt-3 flex flex-col items-center rounded-md border border-line px-4 py-5 text-center focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand ${
        disabled ? 'opacity-50' : 'cursor-pointer hover:bg-page'
      }`}
    >
      <input
        type="file"
        accept={PHOTO_ACCEPT}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) onPick(file);
        }}
      />
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 text-ink-soft"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="1.6" />
        <path d="M21 16l-5-5-8 8" />
      </svg>
      <span className="mt-1 text-sm">
        <span className="font-semibold">Click to add photo</span> <span className="text-ink-soft">(optional)</span>
      </span>
      <span className="text-xs text-ink-soft">JPG, PNG, GIF or WebP up to 5MB</span>
    </label>
  );
}
