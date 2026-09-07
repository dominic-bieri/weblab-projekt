import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ChallengeCardEdit, ChallengeEditValue } from './challenge-card-edit';

describe('ChallengeCardEdit', () => {
  let component: ChallengeCardEdit;
  let fixture: ComponentFixture<ChallengeCardEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeCardEdit],
      providers: [provideTranslateService(), provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeCardEdit);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('initialTitle', 'Architecture Week');
    fixture.componentRef.setInput('initialDescription', 'Only architecture shots');
    fixture.componentRef.setInput('initialStartDate', '2026-09-01');
    fixture.componentRef.setInput('initialEndDate', '2026-09-14');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit saved with the updated title and description', () => {
    const emitted: ChallengeEditValue[] = [];
    component.saved.subscribe((value) => emitted.push(value));

    const titleInput: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-testid="challenge-card-title-input"]',
    );
    titleInput.value = 'Portrait Week';
    titleInput.dispatchEvent(new Event('input'));

    const descriptionInput: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-testid="challenge-card-description-input"]',
    );
    descriptionInput.value = 'Only portrait shots';
    descriptionInput.dispatchEvent(new Event('input'));

    fixture.nativeElement.querySelector('[data-testid="challenge-card-save-button"]')?.click();

    expect(emitted).toEqual([
      {
        title: 'Portrait Week',
        description: 'Only portrait shots',
        startDate: '2026-09-01',
        endDate: '2026-09-14',
      },
    ]);
  });

  it('should emit cancelled when cancel is clicked', () => {
    let cancelled = false;
    component.cancelled.subscribe(() => (cancelled = true));

    fixture.nativeElement.querySelector('[data-testid="challenge-card-cancel-button"]')?.click();

    expect(cancelled).toBe(true);
  });
});
