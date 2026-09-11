import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChallengeCardEdit, ChallengeCardEditData } from './challenge-card-edit';

describe('ChallengeCardEdit', () => {
  let fixture: ComponentFixture<ChallengeCardEdit>;
  let closeSpy: ReturnType<typeof vi.fn>;

  const data: ChallengeCardEditData = {
    initialTitle: 'Architecture Week',
    initialDescription: 'Only architecture shots',
    initialStartDate: '2026-09-01',
    initialEndDate: '2026-09-14',
  };

  beforeEach(async () => {
    closeSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ChallengeCardEdit],
      providers: [
        provideTranslateService(),
        provideNativeDateAdapter(),
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: { close: closeSpy } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeCardEdit);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should close with the updated title and description when saved', () => {
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

    expect(closeSpy).toHaveBeenCalledWith({
      title: 'Portrait Week',
      description: 'Only portrait shots',
      startDate: '2026-09-01',
      endDate: '2026-09-14',
    });
  });

  it('should close without a value when cancelled', () => {
    fixture.nativeElement.querySelector('[data-testid="challenge-card-cancel-button"]')?.click();

    expect(closeSpy).toHaveBeenCalledWith();
  });
});
