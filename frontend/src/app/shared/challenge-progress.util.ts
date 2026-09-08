import { parseDateKey, toDateKey } from './local-date';

export type ChallengeStatus = 'upcoming' | 'active' | 'completed';

export interface ChallengeProgress {
  status: ChallengeStatus;
  // Start- und Endtag zaehlen beide mit, also mindestens 1.
  totalDays: number;
  // 1 am Starttag, totalDays am Endtag, 0 vor dem Start.
  elapsedDays: number;
  daysUntilStart: number;
  // Verbleibende Tage inklusive heute; 0 sobald die Challenge vorbei ist.
  daysRemaining: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function statusForDay(currentDay: number, totalDays: number): ChallengeStatus {
  if (currentDay < 1) {
    return 'upcoming';
  }
  if (currentDay > totalDays) {
    return 'completed';
  }
  return 'active';
}

export function challengeProgress(
  startDate: string,
  endDate: string,
  today: Date = new Date(),
): ChallengeProgress {
  const start = parseDateKey(startDate);
  const end = parseDateKey(endDate);
  const now = parseDateKey(toDateKey(today));

  const totalDays = Math.max(1, daysBetween(start, end) + 1);
  const currentDay = daysBetween(start, now) + 1;
  const elapsedDays = clamp(currentDay, 0, totalDays);
  const status = statusForDay(currentDay, totalDays);

  return {
    status,
    totalDays,
    elapsedDays,
    daysUntilStart: Math.max(daysBetween(now, start), 0),
    daysRemaining: status === 'completed' ? 0 : clamp(totalDays - elapsedDays + 1, 0, totalDays),
  };
}

// String-Vergleich, weil "YYYY-MM-DD" chronologisch sortiert.
export function photographedDaysInRange(
  startDate: string,
  endDate: string,
  captureDates: string[],
): number {
  const daysWithPhoto = new Set<string>();
  const from = startDate.slice(0, 10);
  const to = endDate.slice(0, 10);

  for (const captureDate of captureDates) {
    const day = captureDate.slice(0, 10);
    if (day >= from && day <= to) {
      daysWithPhoto.add(day);
    }
  }

  return daysWithPhoto.size;
}
