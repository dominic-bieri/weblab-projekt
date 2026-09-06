import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ChallengeCard } from './challenge-card';

describe('ChallengeCard', () => {
  let component: ChallengeCard;
  let fixture: ComponentFixture<ChallengeCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeCard],
      providers: [provideTranslateService({ lang: 'de' })],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'challenge-1');
    fixture.componentRef.setInput('title', 'Architecture Week');
    fixture.componentRef.setInput('description', 'Only architecture shots');
    fixture.componentRef.setInput('startDate', '2026-09-01');
    fixture.componentRef.setInput('endDate', '2026-09-14');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title, period and description', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('[data-testid="challenge-card-title"]')?.textContent?.trim()).toBe(
      'Architecture Week',
    );
    expect(
      element.querySelector('[data-testid="challenge-card-period"]')?.textContent?.trim(),
    ).toBe('01.09.2026 – 14.09.2026');
    expect(
      element.querySelector('[data-testid="challenge-card-description"]')?.textContent?.trim(),
    ).toBe('Only architecture shots');
  });

  it('should emit deleted with the challenge id when the delete button is clicked', () => {
    const emitted: string[] = [];
    component.deleted.subscribe((id) => emitted.push(id));

    fixture.nativeElement.querySelector('[data-testid="challenge-card-delete-button"]')?.click();

    expect(emitted).toEqual(['challenge-1']);
  });
});
