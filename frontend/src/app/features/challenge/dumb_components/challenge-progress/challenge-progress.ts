import { Component, computed, input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';
import {
  challengeProgress,
  photographedDaysInRange,
} from '../../../../shared/challenge-progress.util';

@Component({
  imports: [MatProgressBarModule, TranslatePipe],
  selector: 'app-challenge-progress',
  styleUrl: './challenge-progress.css',
  templateUrl: './challenge-progress.html',
})
export class ChallengeProgress {
  startDate = input.required<string>();
  endDate = input.required<string>();
  captureDates = input<string[]>([]);

  protected readonly progress = computed(() => challengeProgress(this.startDate(), this.endDate()));

  protected readonly photographedDays = computed(() =>
    photographedDaysInRange(this.startDate(), this.endDate(), this.captureDates()),
  );

  // Fortschrittsbalken = fotografierte Tage. 100 % nur, wenn wirklich jeder Tag ein Foto hat.
  protected readonly photographedPercent = computed(() => {
    const { totalDays } = this.progress();
    const done = this.photographedDays();
    return done >= totalDays ? 100 : Math.min(99, Math.round((done / totalDays) * 100));
  });
}
