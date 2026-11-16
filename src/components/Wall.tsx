import type { ReactNode } from 'react';
import { ProfileSidebar } from './ProfileSidebar';

export function Wall({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-5xl md:p-4">
      <div className="min-h-dvh overflow-hidden bg-surface md:min-h-0 md:rounded-lg md:border md:border-line">
        <header className="bg-brand px-4 py-2 text-lg font-semibold text-white">wall</header>
        <div className="md:grid md:grid-cols-[260px_minmax(0,1fr)]">
          <ProfileSidebar />
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
