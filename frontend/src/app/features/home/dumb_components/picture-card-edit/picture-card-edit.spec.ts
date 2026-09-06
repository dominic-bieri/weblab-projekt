import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { PhotoEditValue, PictureCardEdit } from './picture-card-edit';

describe('PictureCardEdit', () => {
  let component: PictureCardEdit;
  let fixture: ComponentFixture<PictureCardEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PictureCardEdit],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(PictureCardEdit);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('initialCaptureDate', new Date('2026-09-03'));
    fixture.componentRef.setInput('initialDescription', 'test description');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit saved with the updated description and date', () => {
    const emitted: PhotoEditValue[] = [];
    component.saved.subscribe((value) => emitted.push(value));

    const descriptionInput: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-testid="picture-card-description-input"]',
    );
    descriptionInput.value = 'updated description';
    descriptionInput.dispatchEvent(new Event('input'));

    fixture.nativeElement
      .querySelector('[data-testid="picture-card-save-button"]')
      ?.click();

    expect(emitted).toEqual([{ captureDate: '2026-09-03', description: 'updated description' }]);
  });

  it('should emit cancelled when cancel is clicked', () => {
    let cancelled = false;
    component.cancelled.subscribe(() => (cancelled = true));

    fixture.nativeElement
      .querySelector('[data-testid="picture-card-cancel-button"]')
      ?.click();

    expect(cancelled).toBe(true);
  });
});
