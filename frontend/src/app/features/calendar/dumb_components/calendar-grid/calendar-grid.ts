import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface CalendarDay {
  date: Date;
  hasPhoto: boolean;
  isStreak: boolean;
}

@Component({
  imports: [MatButtonModule, MatIconModule],
  selector: 'app-calendar-grid',
  styleUrl: './calendar-grid.css',
  templateUrl: './calendar-grid.html',
})
export class CalendarGrid {
  monthLabel = input.required<string>();
  weekdayLabels = input.required<string[]>();
  days = input.required<CalendarDay[]>();
  selectedDate = input<Date | null>(null);

  previousMonth = output<void>();
  nextMonth = output<void>();
  daySelected = output<Date>();

  protected readonly leadingBlanks = computed(() => {
    const firstDay = this.days()[0]?.date;
    return firstDay ? Array.from({ length: (firstDay.getDay() + 6) % 7 }) : [];
  });

  protected isSelected(date: Date): boolean {
    return this.selectedDate()?.getTime() === date.getTime();
  }

  protected onDayClick(day: CalendarDay): void {
    if (day.hasPhoto) {
      this.daySelected.emit(day.date);
    }
  }
}
