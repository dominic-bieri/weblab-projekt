import { formatDateKey, parseDateKey, toDateKey } from './local-date';

describe('toDateKey', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(toDateKey(new Date(2026, 8, 6))).toBe('2026-09-06');
  });

  it('pads single-digit months and days', () => {
    expect(toDateKey(new Date(2026, 0, 1))).toBe('2026-01-01');
  });
});

describe('parseDateKey', () => {
  it('parses a date-only string into a local Date, not shifted by timezone', () => {
    const date = parseDateKey('2026-09-06');

    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(8);
    expect(date.getDate()).toBe(6);
  });

  it('ignores a time component if present', () => {
    const date = parseDateKey('2026-09-06T23:00:00.000Z');

    expect(toDateKey(date)).toBe('2026-09-06');
  });

  it('round-trips with toDateKey', () => {
    expect(toDateKey(parseDateKey('2026-12-31'))).toBe('2026-12-31');
  });
});

describe('formatDateKey', () => {
  it('formats a date key using the given locale', () => {
    expect(formatDateKey('2026-09-06', 'de-CH')).toBe('06.09.2026');
  });

  it('is not shifted by UTC parsing (regression: new Date(string) would roll this back a day)', () => {
    expect(formatDateKey('2026-01-01', 'de-CH')).toBe('01.01.2026');
  });
});
