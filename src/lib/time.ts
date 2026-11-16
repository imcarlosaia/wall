const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function relativeTime(iso: string, now: Date): string {
  const then = new Date(iso);
  const time = then.getTime();
  if (Number.isNaN(time)) return '';

  const elapsed = now.getTime() - time;
  if (elapsed < MINUTE) return 'now';
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h`;
  if (elapsed < 7 * DAY) return `${Math.floor(elapsed / DAY)}d`;
  return `${then.getUTCDate()} ${MONTHS[then.getUTCMonth()]}`;
}
