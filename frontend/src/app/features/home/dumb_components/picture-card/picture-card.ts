import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatCard, MatCardContent, MatCardImage, MatCardTitle } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { PhotoEditValue, PictureCardEdit } from '../picture-card-edit/picture-card-edit';
import { ActiveLanguage } from '../../../../core/i18n/active-language';
import { parseDateKey } from '../../../../shared/local-date';

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
    PictureCardEdit,
  ],
  selector: 'app-picture-card',
  styleUrl: './picture-card.css',
  templateUrl: './picture-card.html',
})
export class PictureCard {
  private readonly currentLang = inject(ActiveLanguage).current;

  id = input.required<string>();
  imageSource = input.required<string>();
  captureDate = input.required<string>();
  description = input.required<string>();

  deleted = output<string>();
  edited = output<PhotoEdit>();

  protected readonly isEditing = signal(false);

  protected readonly formattedCaptureDate = computed(() =>
    parseDateKey(this.captureDate()).toLocaleDateString(this.currentLang(), {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
  );

  onDelete(): void {
    this.deleted.emit(this.id());
  }

  startEdit(): void {
    this.isEditing.set(true);
  }

  onEditCancelled(): void {
    this.isEditing.set(false);
  }

  onEditSaved(value: PhotoEditValue): void {
    this.edited.emit({ id: this.id(), ...value });
    this.isEditing.set(false);
  }
}
