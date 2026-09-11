import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [MatIconModule, TranslatePipe],
  selector: 'app-streak-badge',
  styleUrl: './streak-badge.css',
  templateUrl: './streak-badge.html',
})
export class StreakBadge {
  streak = input.required<number>();

  protected readonly isActive = computed(() => this.streak() > 0);
}
