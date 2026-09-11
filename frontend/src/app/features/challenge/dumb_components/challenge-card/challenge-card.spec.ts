import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { flushDialog } from '../../../../shared/testing/flush-dialog';
import { ChallengeCard, ChallengeEdit } from './challenge-card';

describe('ChallengeCard', () => {
  let component: ChallengeCard;
  let fixture: ComponentFixture<ChallengeCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeCard],
      providers: [
        provideTranslateService({ lang: 'de' }),
        provideNativeDateAdapter(),
        provideRouter([]),
      ],
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

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
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

  it('should link to the challenge detail page', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector(
      '[data-testid="challenge-card-view-photos-link"]',
    );

    expect(link.getAttribute('href')).toBe('/challenge/challenge-1');
  });

  it('should ask for confirmation and emit deleted once confirmed', async () => {
    const emitted: string[] = [];
    component.deleted.subscribe((id) => emitted.push(id));

    fixture.nativeElement.querySelector('[data-testid="challenge-card-delete-button"]')?.click();
    fixture.detectChanges();
    await flushDialog();

    expect(emitted).toEqual([]);

    document
      .querySelector<HTMLButtonElement>('[data-testid="delete-dialog-confirm-button"]')
      ?.click();
    await flushDialog();

    expect(emitted).toEqual(['challenge-1']);
  });

  it('should not emit deleted when the confirmation is cancelled', async () => {
    const emitted: string[] = [];
    component.deleted.subscribe((id) => emitted.push(id));

    fixture.nativeElement.querySelector('[data-testid="challenge-card-delete-button"]')?.click();
    fixture.detectChanges();
    await flushDialog();

    document
      .querySelector<HTMLButtonElement>('[data-testid="delete-dialog-cancel-button"]')
      ?.click();
    await flushDialog();

    expect(emitted).toEqual([]);
  });

  it('should open the edit dialog and emit edited with the updated values', async () => {
    const emitted: ChallengeEdit[] = [];
    component.edited.subscribe((value) => emitted.push(value));

    fixture.nativeElement.querySelector('[data-testid="challenge-card-edit-button"]')?.click();
    fixture.detectChanges();
    await flushDialog();

    const titleInput = document.querySelector<HTMLInputElement>(
      '[data-testid="challenge-card-title-input"]',
    );
    titleInput!.value = 'Portrait Week';
    titleInput!.dispatchEvent(new Event('input'));
    await flushDialog();

    document
      .querySelector<HTMLButtonElement>('[data-testid="challenge-card-save-button"]')
      ?.click();
    await flushDialog();

    expect(emitted).toEqual([
      {
        id: 'challenge-1',
        title: 'Portrait Week',
        description: 'Only architecture shots',
        startDate: '2026-09-01',
        endDate: '2026-09-14',
      },
    ]);
  });

  it('should not emit edited when the edit dialog is cancelled', async () => {
    const emitted: ChallengeEdit[] = [];
    component.edited.subscribe((value) => emitted.push(value));

    fixture.nativeElement.querySelector('[data-testid="challenge-card-edit-button"]')?.click();
    fixture.detectChanges();
    await flushDialog();

    document
      .querySelector<HTMLButtonElement>('[data-testid="challenge-card-cancel-button"]')
      ?.click();
    await flushDialog();

    expect(emitted).toEqual([]);
    expect(
      fixture.nativeElement
        .querySelector('[data-testid="challenge-card-title"]')
        ?.textContent?.trim(),
    ).toBe('Architecture Week');
  });
});
