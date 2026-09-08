import { challengeProgress, photographedDaysInRange } from './challenge-progress.util';

describe('challengeProgress', () => {
  const start = '2026-09-01';
  const end = '2026-09-14'; // 14 Tage inklusive

  it('reports upcoming before the start date', () => {
    const result = challengeProgress(start, end, new Date(2026, 7, 30));

    expect(result.status).toBe('upcoming');
    expect(result.totalDays).toBe(14);
    expect(result.elapsedDays).toBe(0);
    expect(result.daysUntilStart).toBe(2);
    expect(result.daysRemaining).toBe(14);
  });

  it('counts the start day as day 1', () => {
    const result = challengeProgress(start, end, new Date(2026, 8, 1));

    expect(result.status).toBe('active');
    expect(result.elapsedDays).toBe(1);
    expect(result.daysRemaining).toBe(14);
  });

  it('reports the progress for a day in the middle', () => {
    const result = challengeProgress(start, end, new Date(2026, 8, 8));

    expect(result.status).toBe('active');
    expect(result.elapsedDays).toBe(8);
    expect(result.daysRemaining).toBe(7);
  });

  it('has one day left on the end day and stays active', () => {
    const result = challengeProgress(start, end, new Date(2026, 8, 14));

    expect(result.status).toBe('active');
    expect(result.elapsedDays).toBe(14);
    expect(result.daysRemaining).toBe(1);
  });

  it('reports completed after the end date', () => {
    const result = challengeProgress(start, end, new Date(2026, 8, 20));

    expect(result.status).toBe('completed');
    expect(result.elapsedDays).toBe(14);
    expect(result.daysRemaining).toBe(0);
  });

  it('handles a single-day challenge', () => {
    const result = challengeProgress('2026-09-05', '2026-09-05', new Date(2026, 8, 5));

    expect(result.status).toBe('active');
    expect(result.totalDays).toBe(1);
    expect(result.elapsedDays).toBe(1);
    expect(result.daysRemaining).toBe(1);
  });
});

describe('photographedDaysInRange', () => {
  const start = '2026-09-07';
  const end = '2026-09-13';

  it('returns 0 without any photos', () => {
    expect(photographedDaysInRange(start, end, [])).toBe(0);
  });

  it('counts a single photo inside the range', () => {
    expect(photographedDaysInRange(start, end, ['2026-09-08'])).toBe(1);
  });

  it('counts each calendar day only once', () => {
    expect(photographedDaysInRange(start, end, ['2026-09-08', '2026-09-08', '2026-09-10'])).toBe(2);
  });

  it('ignores photos captured before the start or after the end', () => {
    expect(photographedDaysInRange(start, end, ['2026-09-06', '2026-09-09', '2026-09-14'])).toBe(1);
  });

  it('includes photos captured on the start and end day', () => {
    expect(photographedDaysInRange(start, end, ['2026-09-07', '2026-09-13'])).toBe(2);
  });
});
