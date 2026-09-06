import { Component, input, output, signal } from '@angular/core';
import { MatCard, MatCardContent, MatCardImage, MatCardTitle } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { PhotoEditValue, PictureCardEdit } from '../picture-card-edit/picture-card-edit';

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
    DatePipe,
    TranslatePipe,
    PictureCardEdit,
  ],
  selector: 'app-picture-card',
  styleUrl: './picture-card.css',
  templateUrl: './picture-card.html',
})
export class PictureCard {
  id = input.required<string>();
  imageSource = input.required<string>();
  captureDate = input.required<Date | string>();
  description = input.required<string>();

  deleted = output<string>();
  edited = output<PhotoEdit>();

  protected readonly isEditing = signal(false);

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
