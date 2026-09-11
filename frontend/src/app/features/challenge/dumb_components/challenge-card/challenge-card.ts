import { Component, computed, inject, input, output } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ActiveLanguage } from '../../../../core/i18n/active-language';
import { formatDateKey } from '../../../../shared/local-date';
import { DeleteDialog } from '../../../../shared/delete-dialog/delete-dialog';
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
    ChallengeProgress,
  ],
  selector: 'app-challenge-card',
  styleUrl: './challenge-card.css',
  templateUrl: './challenge-card.html',
})
export class ChallengeCard {
  private readonly currentLang = inject(ActiveLanguage).current;
  private readonly dialog = inject(MatDialog);

  id = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
  startDate = input.required<string>();
  endDate = input.required<string>();
  captureDates = input<string[]>([]);

  deleted = output<string>();
  edited = output<ChallengeEdit>();

  protected readonly formattedPeriod = computed(() => {
    const lang = this.currentLang();
    return `${formatDateKey(this.startDate(), lang)} – ${formatDateKey(this.endDate(), lang)}`;
  });

  onDelete(): void {
    this.dialog
      .open(DeleteDialog, { data: { name: this.title() } })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.deleted.emit(this.id());
        }
      });
  }

  startEdit(): void {
    this.dialog
      .open(ChallengeCardEdit, {
        data: {
          initialTitle: this.title(),
          initialDescription: this.description(),
          initialStartDate: this.startDate(),
          initialEndDate: this.endDate(),
        },
      })
      .afterClosed()
      .subscribe((value) => {
        if (value) {
          this.edited.emit({ id: this.id(), ...value });
        }
      });
  }
}
