import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { CalendarDay, CalendarGrid } from './calendar-grid';

describe('CalendarGrid', () => {
  let component: CalendarGrid;
  let fixture: ComponentFixture<CalendarGrid>;

  const days: CalendarDay[] = [
    { date: new Date(2026, 8, 1), hasPhoto: false, isStreak: false, isToday: false },
    { date: new Date(2026, 8, 2), hasPhoto: true, isStreak: true, isToday: false },
    { date: new Date(2026, 8, 3), hasPhoto: false, isStreak: false, isToday: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarGrid],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarGrid);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('monthLabel', 'September 2026');
    fixture.componentRef.setInput('weekdayLabels', ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']);
    fixture.componentRef.setInput('days', days);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark only the day with a photo as filled', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelectorAll('[data-testid="calendar-day-filled"]').length).toBe(1);
    expect(element.querySelectorAll('[data-testid="calendar-day-empty"]').length).toBe(2);
  });

  it('should mark only the streak day as streak', () => {
    const element: HTMLElement = fixture.nativeElement;
    const filledDay = element.querySelector('[data-testid="calendar-day-filled"]');

    expect(filledDay?.classList.contains('streak')).toBe(true);
  });

  it('should emit daySelected when a day with a photo is clicked', () => {
    const emitted: Date[] = [];
    component.daySelected.subscribe((date) => emitted.push(date));

    fixture.nativeElement.querySelector('[data-testid="calendar-day-filled"]')?.click();

    expect(emitted).toEqual([days[1].date]);
  });

  it('should not emit daySelected when a day without a photo is clicked', () => {
    const emitted: Date[] = [];
    component.daySelected.subscribe((date) => emitted.push(date));

    fixture.nativeElement.querySelector('[data-testid="calendar-day-empty"]')?.click();

    expect(emitted).toEqual([]);
  });

  it('should mark the selected date and no other', async () => {
    fixture.componentRef.setInput('selectedDate', days[1].date);
    await fixture.whenStable();

    const filledDay = fixture.nativeElement.querySelector('[data-testid="calendar-day-filled"]');
    expect(filledDay?.classList.contains('selected')).toBe(true);

    const emptyDays = fixture.nativeElement.querySelectorAll('[data-testid="calendar-day-empty"]');
    emptyDays.forEach((day: Element) => expect(day.classList.contains('selected')).toBe(false));
  });

  it('should emit previousMonth and nextMonth', () => {
    let previous = false;
    let next = false;
    component.previousMonth.subscribe(() => (previous = true));
    component.nextMonth.subscribe(() => (next = true));

    fixture.nativeElement.querySelector('[data-testid="calendar-prev-month"]')?.click();
    fixture.nativeElement.querySelector('[data-testid="calendar-next-month"]')?.click();

    expect(previous).toBe(true);
    expect(next).toBe(true);
  });

  it('should mark only the current day as today', () => {
    const element: HTMLElement = fixture.nativeElement;
    const emptyDays = element.querySelectorAll('[data-testid="calendar-day-empty"]');

    expect(Array.from(emptyDays).filter((day) => day.classList.contains('today')).length).toBe(1);
    expect(
      element.querySelector('[data-testid="calendar-day-filled"]')?.classList.contains('today'),
    ).toBe(false);
  });

  it('should emit today when the today button is clicked', () => {
    let emitted = false;
    component.today.subscribe(() => (emitted = true));

    fixture.nativeElement.querySelector('[data-testid="calendar-today"]')?.click();

    expect(emitted).toBe(true);
  });
});
