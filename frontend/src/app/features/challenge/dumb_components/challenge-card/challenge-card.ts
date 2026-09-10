import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ActiveLanguage } from '../../../../core/i18n/active-language';
import { formatDateKey } from '../../../../shared/local-date';
import { ChallengeCardEdit, ChallengeEditValue } from '../challenge-card-edit/challenge-card-edit';
import { ChallengeProgress } from '../challenge-progress/challenge-progress';

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
    RouterLink,
    TranslatePipe,
    ChallengeCardEdit,
    ChallengeProgress,
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
  captureDates = input<string[]>([]);

  deleted = output<string>();
  edited = output<ChallengeEdit>();

  protected readonly isEditing = signal(false);

  protected readonly formattedPeriod = computed(() => {
    const lang = this.currentLang();
    return `${formatDateKey(this.startDate(), lang)} – ${formatDateKey(this.endDate(), lang)}`;
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
