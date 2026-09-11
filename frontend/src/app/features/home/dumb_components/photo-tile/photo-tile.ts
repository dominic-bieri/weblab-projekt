import { Component, computed, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ActiveLanguage } from '../../../../core/i18n/active-language';
import { formatDateKey } from '../../../../shared/local-date';

@Component({
  imports: [NgOptimizedImage],
  selector: 'app-photo-tile',
  styleUrl: './photo-tile.css',
  templateUrl: './photo-tile.html',
})
export class PhotoTile {
  private readonly currentLang = inject(ActiveLanguage).current;

  photoSource = input.required<string>();
  captureDate = input.required<string>();
  description = input.required<string>();
  // true für das LCP-Bild (erste Kachel): deaktiviert loading="lazy" und setzt fetchpriority="high"
  priority = input<boolean>(false);

  protected readonly formattedCaptureDate = computed(() =>
    formatDateKey(this.captureDate(), this.currentLang()),
  );
}
