import { Component, computed, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ActiveLanguage } from '../../../../core/i18n/active-language';
import { parseDateKey } from '../../../../shared/local-date';

@Component({
  imports: [NgOptimizedImage],
  selector: 'app-photo-tile',
  styleUrl: './photo-tile.css',
  templateUrl: './photo-tile.html',
})
export class PhotoTile {
  private readonly currentLang = inject(ActiveLanguage).current;

  imageSource = input.required<string>();
  captureDate = input.required<string>();

  protected readonly formattedCaptureDate = computed(() =>
    parseDateKey(this.captureDate()).toLocaleDateString(this.currentLang(), {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
  );
}
