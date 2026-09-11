import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeleteDialog } from './delete-dialog';

describe('DeleteDialog', () => {
  let fixture: ComponentFixture<DeleteDialog>;
  let closeSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    closeSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [DeleteDialog],
      providers: [
        provideTranslateService({ lang: 'de' }),
        { provide: MAT_DIALOG_DATA, useValue: { name: 'test.jpg' } },
        { provide: MatDialogRef, useValue: { close: closeSpy } },
      ],
    }).compileComponents();

    TestBed.inject(TranslateService).setTranslation('de', {
      deleteDialog: {
        title: 'Löschen bestätigen',
        message: 'Soll „{{name}}“ wirklich gelöscht werden?',
        confirm: 'Löschen',
        cancel: 'Abbrechen',
      },
    });

    fixture = TestBed.createComponent(DeleteDialog);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the interpolated name in the message', () => {
    expect(
      fixture.nativeElement
        .querySelector('[data-testid="delete-dialog-message"]')
        ?.textContent?.trim(),
    ).toBe('Soll „test.jpg“ wirklich gelöscht werden?');
  });

  it('should close with true when confirmed', () => {
    fixture.nativeElement.querySelector('[data-testid="delete-dialog-confirm-button"]')?.click();

    expect(closeSpy).toHaveBeenCalledWith(true);
  });

  it('should close with false when cancelled', () => {
    fixture.nativeElement.querySelector('[data-testid="delete-dialog-cancel-button"]')?.click();

    expect(closeSpy).toHaveBeenCalledWith(false);
  });
});
