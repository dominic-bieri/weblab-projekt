import { computed, Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';

const EMPTY_STREAK = { streak: 0, dates: [] };

@Injectable({
  providedIn: 'root',
})
export class StreakApi {
  readonly streak = httpResource<{ streak: number; dates: string[] }>(() => '/api/streak', {
    defaultValue: EMPTY_STREAK,
  });

  // Sicherer Zugriff: streak.value() wirft im Error-Status, auch mit defaultValue gesetzt.
  readonly streakValue = computed(() =>
    this.streak.hasValue() ? this.streak.value() : EMPTY_STREAK,
  );
}
