import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarDay, CalendarGrid } from './calendar-grid';

describe('CalendarGrid', () => {
  let component: CalendarGrid;
  let fixture: ComponentFixture<CalendarGrid>;

  const days: CalendarDay[] = [
    { date: new Date(2026, 8, 1), hasPhoto: false },
    { date: new Date(2026, 8, 2), hasPhoto: true },
    { date: new Date(2026, 8, 3), hasPhoto: false },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarGrid],
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
});
