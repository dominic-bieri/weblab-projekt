import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { ChallengeProgress } from './challenge-progress';

describe('ChallengeProgress', () => {
  let fixture: ComponentFixture<ChallengeProgress>;

  beforeEach(async () => {
    // "Heute" = Tag 8 der Challenge 2026-09-01..2026-09-14, also noch 7 Tage.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 8, 8));

    await TestBed.configureTestingModule({
      imports: [ChallengeProgress],
      providers: [provideTranslateService({ lang: 'de' })],
    }).compileComponents();

    TestBed.inject(TranslateService).setTranslation('de', {
      challenge: {
        progress: {
          active: 'Noch {{days}} Tage',
          photographed: '{{count}} / {{total}}',
        },
      },
    });

    fixture = TestBed.createComponent(ChallengeProgress);
    fixture.componentRef.setInput('startDate', '2026-09-01');
    fixture.componentRef.setInput('endDate', '2026-09-14');
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('drives the progress bar from the photographed days', async () => {
    fixture.componentRef.setInput('captureDates', ['2026-09-03', '2026-09-05', '2026-09-10']);
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement;

    // 3 von 14 Tagen fotografiert -> round(3 / 14 * 100) = 21 %
    expect(
      element.querySelector('[data-testid="challenge-progress-percent"]')?.textContent?.trim(),
    ).toBe('21%');
    expect(
      element
        .querySelector('[data-testid="challenge-progress-bar"]')
        ?.getAttribute('aria-valuenow'),
    ).toBe('21');
  });

  it('counts the distinct days inside the range that have a photo', async () => {
    fixture.componentRef.setInput('captureDates', [
      '2026-08-31', // vor dem Zeitraum
      '2026-09-03',
      '2026-09-03', // derselbe Tag nochmal
      '2026-09-10',
    ]);
    await fixture.whenStable();

    expect(
      fixture.nativeElement
        .querySelector('[data-testid="challenge-progress-label"]')
        ?.textContent?.trim(),
    ).toBe('2 / 14');
  });

  it('shows the remaining time as plain text while active', () => {
    expect(
      fixture.nativeElement
        .querySelector('[data-testid="challenge-progress-time"]')
        ?.textContent?.trim(),
    ).toBe('Noch 7 Tage');
  });
});
