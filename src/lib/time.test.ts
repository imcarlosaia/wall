import { describe, expect, it } from 'vitest';
import { relativeTime } from './time';

const NOW = new Date('2026-11-14T12:00:00.000Z');
const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString();

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe('relativeTime', () => {
  it('says now for anything under a minute', () => {
    expect(relativeTime(ago(0), NOW)).toBe('now');
    expect(relativeTime(ago(59 * SECOND), NOW)).toBe('now');
  });

  it('says now for a timestamp slightly in the future', () => {
    expect(relativeTime(ago(-5 * SECOND), NOW)).toBe('now');
  });

  it('counts minutes from one minute up to an hour', () => {
    expect(relativeTime(ago(MINUTE), NOW)).toBe('1m');
    expect(relativeTime(ago(59 * MINUTE + 59 * SECOND), NOW)).toBe('59m');
  });

  it('counts hours from one hour up to a day', () => {
    expect(relativeTime(ago(HOUR), NOW)).toBe('1h');
    expect(relativeTime(ago(23 * HOUR + 59 * MINUTE), NOW)).toBe('23h');
  });

  it('counts days from one day up to a week', () => {
    expect(relativeTime(ago(DAY), NOW)).toBe('1d');
    expect(relativeTime(ago(6 * DAY + 23 * HOUR), NOW)).toBe('6d');
  });

  it('shows a short date from a week onwards', () => {
    expect(relativeTime(ago(7 * DAY), NOW)).toBe('7 Nov');
    expect(relativeTime('2026-01-03T09:30:00.000Z', NOW)).toBe('3 Jan');
  });

  it('returns an empty string for an unreadable timestamp', () => {
    expect(relativeTime('not a date', NOW)).toBe('');
  });
});
