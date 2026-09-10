// captureDate ist immer ein reiner "YYYY-MM-DD"-String (Backend: Postgres 'date').
// Ein Date-Objekt braucht es nur für den Material-Datepicker -> hier lokal bauen, nie via new Date(string).

export function toDateKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function parseDateKey(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateKey(value: string, locale: string): string {
  return parseDateKey(value).toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
