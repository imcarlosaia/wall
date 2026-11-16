import { PROFILE } from '@/lib/profile';
import { Avatar } from './Avatar';

export function ProfileSidebar() {
  const summary = PROFILE.details.map((detail) => detail.value).join(' · ');

  return (
    <aside className="flex items-center gap-4 border-b border-line-soft p-4 md:block md:border-b-0 md:border-r md:p-6">
      <Avatar className="h-24 w-20 shrink-0 rounded-md md:h-auto md:w-full" />
      <div className="min-w-0">
        <h1 className="text-xl font-bold md:mt-4 md:text-2xl">{PROFILE.name}</h1>
        <p className="text-ink-soft md:text-lg">{PROFILE.subtitle}</p>
        <p className="mt-1 truncate text-sm text-ink-soft md:hidden">{summary}</p>
        <div className="hidden md:block">
          <p className="mt-5 inline-block rounded border border-line bg-page px-3 py-1.5 text-xs font-semibold">
            Information
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            {PROFILE.details.map((detail) => (
              <div key={detail.label}>
                <dt className="font-semibold">{detail.label}</dt>
                <dd className="text-ink-soft">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </aside>
  );
}
