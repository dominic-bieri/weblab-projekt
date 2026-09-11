import { Component, computed, inject, input, output } from '@angular/core';
import { MatCard, MatCardContent, MatCardImage, MatCardTitle } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { PhotoCardEdit, PhotoEditValue } from '../photo-card-edit/photo-card-edit';
import { DeleteDialog } from '../../../../shared/delete-dialog/delete-dialog';
import { ActiveLanguage } from '../../../../core/i18n/active-language';
import { formatDateKey } from '../../../../shared/local-date';
import { Challenge } from '../../../challenge/challenge.type';

export interface PhotoEdit extends PhotoEditValue {
  id: string;
}

@Component({
  imports: [
    MatCard,
    MatCardImage,
    MatCardContent,
    MatCardTitle,
    MatButtonModule,
    MatIconModule,
    NgOptimizedImage,
    TranslatePipe,
  ],
  selector: 'app-photo-card',
  styleUrl: './photo-card.css',
  templateUrl: './photo-card.html',
})
export class PhotoCard {
  private readonly currentLang = inject(ActiveLanguage).current;
  private readonly dialog = inject(MatDialog);

  id = input.required<string>();
  photoSource = input.required<string>();
  captureDate = input.required<string>();
  description = input.required<string>();
  challengeId = input.required<string | null>();
  challenges = input.required<Challenge[]>();
  // true für das LCP-Bild (erste Karte): deaktiviert loading="lazy" und setzt fetchpriority="high"
  priority = input<boolean>(false);

  deleted = output<string>();
  edited = output<PhotoEdit>();

  protected readonly formattedCaptureDate = computed(() =>
    formatDateKey(this.captureDate(), this.currentLang()),
  );

  protected readonly challengeName = computed(() => {
    const challengeId = this.challengeId();
    if (!challengeId) {
      return null;
    }
    return this.challenges().find((challenge) => challenge.id === challengeId)?.title ?? null;
  });

  onDelete(): void {
    this.dialog
      .open(DeleteDialog, { data: { name: this.formattedCaptureDate() } })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.deleted.emit(this.id());
        }
      });
  }

  startEdit(): void {
    this.dialog
      .open(PhotoCardEdit, {
        data: {
          challenges: this.challenges(),
          initialCaptureDate: this.captureDate(),
          initialDescription: this.description(),
          initialChallengeId: this.challengeId(),
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
