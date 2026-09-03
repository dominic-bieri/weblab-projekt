import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

interface Language {
  code: string;
  label: string;
}

@Component({
  imports: [MatFormFieldModule, MatSelectModule, TranslatePipe],
  selector: 'app-language-switcher',
  styleUrl: './language-switcher.css',
  templateUrl: './language-switcher.html',
})
export class LanguageSwitcher {
  private readonly translate = inject(TranslateService);

  readonly languages: Language[] = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
  ];

  readonly currentLang = signal(this.translate.getCurrentLang() ?? this.languages[0].code);

  constructor() {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed())
      .subscribe(({ lang }) => this.currentLang.set(lang));
  }

  switchLanguage(lang: string): void {
    if (lang && lang !== this.currentLang()) {
      this.translate.use(lang);
    }
  }
}
