function toDateKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function previousDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  return toDateKey(new Date(year, month - 1, day - 1));
}

export function calculateStreakDates(
  captureDates: string[],
  today: Date = new Date(),
): string[] {
  const daysWithPhoto = new Set(captureDates.map((date) => date.slice(0, 10)));

  let cursor = toDateKey(today);
  if (!daysWithPhoto.has(cursor)) {
    cursor = previousDateKey(cursor);
    if (!daysWithPhoto.has(cursor)) {
      return [];
    }
  }

  const dates: string[] = [];
  while (daysWithPhoto.has(cursor)) {
    dates.push(cursor);
    cursor = previousDateKey(cursor);
  }
  return dates;
}

export function calculateStreak(
  captureDates: string[],
  today: Date = new Date(),
): number {
  return calculateStreakDates(captureDates, today).length;
}
