// captureDate ist ein reines Kalenderdatum ohne Zeit/Zeitzone.
// Backend kodiert es als UTC-Mitternacht -> immer über Y-M-D-String parsen, nie lokale Getter auf UTC-Zeit.

export function toDateKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function parseDateKey(value: Date | string): Date {
  if (value instanceof Date) {
    return value;
  }
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}
