import { PROFILE } from '@/lib/profile';

export function Avatar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 190" className={className} role="img" aria-label={`Illustrated portrait of ${PROFILE.name}`}>
      <rect width="160" height="190" fill="#DCE7FB" />
      <path d="M22 190 C22 140 52 124 80 124 C108 124 138 140 138 190 Z" fill="#2F6FDE" />
      <path d="M62 126 L80 146 L98 126 Z" fill="#EBC3A0" />
      <rect x="68" y="104" width="24" height="30" rx="10" fill="#EBC3A0" />
      <circle cx="80" cy="82" r="34" fill="#F3D2B3" />
      <path
        d="M44 80 C42 46 62 38 82 38 C106 38 120 54 116 84 C108 70 96 62 78 62 C62 62 52 68 44 80 Z"
        fill="#3A2E39"
      />
      <circle cx="68" cy="86" r="3.5" fill="#1C1E21" />
      <circle cx="92" cy="86" r="3.5" fill="#1C1E21" />
      <path d="M68 100 Q80 110 92 100" fill="none" stroke="#1C1E21" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
