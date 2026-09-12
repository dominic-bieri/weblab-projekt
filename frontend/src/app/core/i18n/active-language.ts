import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

export const LANGUAGE_STORAGE_KEY = 'language';

export function getStoredLanguage(): string | null {
  return localStorage.getItem(LANGUAGE_STORAGE_KEY);
}

@Injectable({ providedIn: 'root' })
export class ActiveLanguage {
  private readonly translate = inject(TranslateService);

  readonly current = signal(this.translate.getCurrentLang() ?? 'en');

  constructor() {
    this.translate.onLangChange.pipe(takeUntilDestroyed()).subscribe(({ lang }) => {
      this.current.set(lang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    });
  }
}
