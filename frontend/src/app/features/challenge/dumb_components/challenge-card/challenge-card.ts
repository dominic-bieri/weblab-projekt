import { Component, computed, inject, input, output } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ActiveLanguage } from '../../../../core/i18n/active-language';
import { parseDateKey } from '../../../../shared/local-date';

@Component({
  imports: [MatCard, MatCardContent, MatCardTitle, MatButtonModule, MatIconModule, TranslatePipe],
  selector: 'app-challenge-card',
  styleUrl: './challenge-card.css',
  templateUrl: './challenge-card.html',
})
export class ChallengeCard {
  private readonly currentLang = inject(ActiveLanguage).current;

  id = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
  startDate = input.required<string>();
  endDate = input.required<string>();

  deleted = output<string>();

  protected readonly formattedPeriod = computed(() => {
    const format = (value: string) =>
      parseDateKey(value).toLocaleDateString(this.currentLang(), {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    return `${format(this.startDate())} – ${format(this.endDate())}`;
  });

  onDelete(): void {
    this.deleted.emit(this.id());
  }
}
