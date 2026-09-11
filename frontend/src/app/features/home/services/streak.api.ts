import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StreakApi {
  readonly streak = httpResource<{ streak: number; dates: string[] }>(() => '/api/streak', {
    defaultValue: { streak: 0, dates: [] },
  });
}
