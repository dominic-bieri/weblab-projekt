import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PhotoCardEdit, PhotoCardEditData } from './photo-card-edit';

describe('PhotoCardEdit', () => {
  let fixture: ComponentFixture<PhotoCardEdit>;
  let closeSpy: ReturnType<typeof vi.fn>;

  const data: PhotoCardEditData = {
    challenges: [],
    initialCaptureDate: '2026-09-03',
    initialDescription: 'test description',
    initialChallengeId: null,
  };

  beforeEach(async () => {
    closeSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [PhotoCardEdit],
      providers: [
        provideTranslateService(),
        provideNativeDateAdapter(),
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: { close: closeSpy } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCardEdit);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should close with the updated description and date when saved', () => {
    const descriptionInput: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-testid="photo-card-description-input"]',
    );
    descriptionInput.value = 'updated description';
    descriptionInput.dispatchEvent(new Event('input'));

    fixture.nativeElement.querySelector('[data-testid="photo-card-save-button"]')?.click();

    expect(closeSpy).toHaveBeenCalledWith({
      captureDate: '2026-09-03',
      description: 'updated description',
      challengeId: null,
    });
  });

  it('should close without a value when cancelled', () => {
    fixture.nativeElement.querySelector('[data-testid="photo-card-cancel-button"]')?.click();

    expect(closeSpy).toHaveBeenCalledWith();
  });
});
