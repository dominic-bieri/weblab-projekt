import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ActiveLanguage } from '../../../../core/i18n/active-language';
import { parseDateKey } from '../../../../shared/local-date';
import { ChallengeCardEdit, ChallengeEditValue } from '../challenge-card-edit/challenge-card-edit';

export interface ChallengeEdit extends ChallengeEditValue {
  id: string;
}

@Component({
  imports: [
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
    ChallengeCardEdit,
  ],
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
  edited = output<ChallengeEdit>();

  protected readonly isEditing = signal(false);

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

  startEdit(): void {
    this.isEditing.set(true);
  }

  onEditCancelled(): void {
    this.isEditing.set(false);
  }

  onEditSaved(value: ChallengeEditValue): void {
    this.edited.emit({ id: this.id(), ...value });
    this.isEditing.set(false);
  }
}
