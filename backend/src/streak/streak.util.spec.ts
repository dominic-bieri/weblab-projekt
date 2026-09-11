import { calculateStreak, calculateStreakDates } from './streak.util.js';

describe('calculateStreak', () => {
  it('returns 0 without any photos', () => {
    expect(calculateStreak([], new Date(2026, 8, 10))).toBe(0);
  });

  it('returns 0 when the last photo is older than yesterday', () => {
    expect(calculateStreak(['2026-09-07'], new Date(2026, 8, 10))).toBe(0);
  });

  it('counts a photo taken today', () => {
    expect(calculateStreak(['2026-09-10'], new Date(2026, 8, 10))).toBe(1);
  });

  it('keeps the streak alive when only yesterday has a photo', () => {
    expect(calculateStreak(['2026-09-09'], new Date(2026, 8, 10))).toBe(1);
  });

  it('counts consecutive days ending today', () => {
    const dates = ['2026-09-08', '2026-09-09', '2026-09-10'];
    expect(calculateStreak(dates, new Date(2026, 8, 10))).toBe(3);
  });

  it('counts consecutive days ending yesterday when today has no photo yet', () => {
    const dates = ['2026-09-07', '2026-09-08', '2026-09-09'];
    expect(calculateStreak(dates, new Date(2026, 8, 10))).toBe(3);
  });

  it('stops at the first gap', () => {
    const dates = ['2026-09-05', '2026-09-08', '2026-09-09', '2026-09-10'];
    expect(calculateStreak(dates, new Date(2026, 8, 10))).toBe(3);
  });

  it('ignores duplicate photos on the same day', () => {
    const dates = ['2026-09-10', '2026-09-10', '2026-09-09'];
    expect(calculateStreak(dates, new Date(2026, 8, 10))).toBe(2);
  });

  it('is not confused by a date-time string, only the date part counts', () => {
    expect(
      calculateStreak(['2026-09-10T00:00:00.000Z'], new Date(2026, 8, 10)),
    ).toBe(1);
  });
});

describe('calculateStreakDates', () => {
  it('returns the dates that make up the current streak, most recent first', () => {
    const dates = ['2026-09-05', '2026-09-08', '2026-09-09', '2026-09-10'];
    expect(calculateStreakDates(dates, new Date(2026, 8, 10))).toEqual([
      '2026-09-10',
      '2026-09-09',
      '2026-09-08',
    ]);
  });

  it('returns an empty array without any photos', () => {
    expect(calculateStreakDates([], new Date(2026, 8, 10))).toEqual([]);
  });
});
