import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { CalendarDay, CalendarGrid } from '../dumb_components/calendar-grid/calendar-grid';
import { PhotoEdit, PictureCard } from '../../home/dumb_components/picture-card/picture-card';
import { PhotoApi } from '../../home/services/photo.api';
import { Photo } from '../../home/photo.type';
import { parseDateKey, toDateKey } from '../../../shared/local-date';

@Component({
  imports: [CalendarGrid, PictureCard],
  selector: 'app-calendar',
  styleUrl: './calendar.css',
  templateUrl: './calendar.html',
})
export class Calendar {
  private readonly photoApi = inject(PhotoApi);
  private readonly translate = inject(TranslateService);

  private readonly currentMonth = signal(startOfMonth(new Date()));
  protected readonly selectedDate = signal<Date | null>(null);
  private readonly currentLang = signal(this.translate.getCurrentLang() ?? 'en');

  constructor() {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed())
      .subscribe(({ lang }) => this.currentLang.set(lang));
  }

  protected readonly monthLabel = computed(() =>
    this.currentMonth().toLocaleDateString(this.currentLang(), { month: 'long', year: 'numeric' }),
  );

  protected readonly weekdayLabels = computed(() => {
    const formatter = new Intl.DateTimeFormat(this.currentLang(), { weekday: 'short' });
    const monday = new Date(2024, 0, 1); // a Monday
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      return formatter.format(date);
    });
  });

  protected readonly days = computed<CalendarDay[]>(() => {
    const photoDates = new Set(
      this.photoApi.photos.value().map((photo) => toDateKey(parseDateKey(photo.captureDate))),
    );

    const month = this.currentMonth();
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, day) => {
      const date = new Date(month.getFullYear(), month.getMonth(), day + 1);
      return { date, hasPhoto: photoDates.has(toDateKey(date)) };
    });
  });

  protected readonly selectedPhoto = computed<Photo | null>(() => {
    const date = this.selectedDate();
    if (!date) {
      return null;
    }
    const key = toDateKey(date);
    return (
      this.photoApi.photos
        .value()
        .find((photo) => toDateKey(parseDateKey(photo.captureDate)) === key) ?? null
    );
  });

  protected imageUrl(photo: Photo): string {
    return this.photoApi.imageUrl(photo);
  }

  protected previousMonth(): void {
    this.selectedDate.set(null);
    this.currentMonth.update((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1));
  }

  protected nextMonth(): void {
    this.selectedDate.set(null);
    this.currentMonth.update((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1));
  }

  protected onDaySelected(date: Date): void {
    this.selectedDate.set(date);
  }

  protected onPhotoDelete(id: string): void {
    this.photoApi.deletePhoto(id).subscribe(() => {
      this.selectedDate.set(null);
      this.photoApi.photos.reload();
    });
  }

  protected onPhotoEdit(edit: PhotoEdit): void {
    this.photoApi.updatePhoto(edit.id, edit).subscribe(() => this.photoApi.photos.reload());
  }
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
