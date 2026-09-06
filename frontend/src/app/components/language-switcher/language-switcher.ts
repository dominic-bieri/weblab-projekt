import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ActiveLanguage } from '../../core/i18n/active-language';

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

  readonly currentLang = inject(ActiveLanguage).current;

  switchLanguage(lang: string): void {
    if (lang && lang !== this.currentLang()) {
      this.translate.use(lang);
    }
  }
}
