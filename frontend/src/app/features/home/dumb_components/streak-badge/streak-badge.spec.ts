import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { StreakBadge } from './streak-badge';

describe('StreakBadge', () => {
  let fixture: ComponentFixture<StreakBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreakBadge],
      providers: [provideTranslateService({ lang: 'de' })],
    }).compileComponents();

    TestBed.inject(TranslateService).setTranslation('de', {
      home: { streak: '{{count}} Tage Streak' },
    });

    fixture = TestBed.createComponent(StreakBadge);
  });

  function render(streak: number): HTMLElement {
    fixture.componentRef.setInput('streak', streak);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should mark a zero streak as inactive', () => {
    const element = render(0);

    expect(element.querySelector('[data-testid="streak-badge"]')?.classList).toContain(
      'streak-hero--inactive',
    );
  });

  it('should mark a streak above zero as active', () => {
    const element = render(5);

    expect(element.querySelector('[data-testid="streak-badge"]')?.classList).not.toContain(
      'streak-hero--inactive',
    );
    expect(element.querySelector('[data-testid="streak-badge-count"]')?.textContent).toContain('5');
  });
});
