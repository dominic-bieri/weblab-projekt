import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { PhotoEdit, PictureCard } from './picture-card';

describe('PictureCard', () => {
  let component: PictureCard;
  let fixture: ComponentFixture<PictureCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PictureCard],
      providers: [provideTranslateService({ lang: 'de' }), provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(PictureCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'photo-1');
    fixture.componentRef.setInput('imageSource', 'test.jpg');
    fixture.componentRef.setInput('captureDate', '2026-09-03');
    fixture.componentRef.setInput('description', 'test description');
    fixture.componentRef.setInput('challengeId', null);
    fixture.componentRef.setInput('challenges', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the formatted capture date, image and description', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('mat-card-title')?.textContent?.trim()).toBe('03.09.2026');

    const img = element.querySelector('img');
    expect(img?.getAttribute('src') ?? img?.getAttribute('ngSrc')).toContain('test.jpg');

    expect(element.querySelector('mat-card-content p')?.textContent?.trim()).toBe(
      'test description',
    );
  });

  it('should emit deleted with the photo id when the delete button is clicked', () => {
    const emitted: string[] = [];
    component.deleted.subscribe((id) => emitted.push(id));

    const button: HTMLButtonElement | null = fixture.nativeElement.querySelector(
      '[data-testid="picture-card-delete-button"]',
    );
    button?.click();

    expect(emitted).toEqual(['photo-1']);
  });

  it('should emit edited with the updated description and date when saved', async () => {
    const emitted: PhotoEdit[] = [];
    component.edited.subscribe((edit) => emitted.push(edit));

    const editButton: HTMLButtonElement | null = fixture.nativeElement.querySelector(
      '[data-testid="picture-card-edit-button"]',
    );
    editButton?.click();
    await fixture.whenStable();

    const descriptionInput: HTMLInputElement | null = fixture.nativeElement.querySelector(
      '[data-testid="picture-card-description-input"]',
    );
    descriptionInput!.value = 'updated description';
    descriptionInput!.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    const saveButton: HTMLButtonElement | null = fixture.nativeElement.querySelector(
      '[data-testid="picture-card-save-button"]',
    );
    saveButton?.click();

    expect(emitted).toEqual([
      {
        id: 'photo-1',
        captureDate: '2026-09-03',
        description: 'updated description',
        challengeId: null,
      },
    ]);
  });

  it('should discard changes when edit is cancelled', async () => {
    const editButton: HTMLButtonElement | null = fixture.nativeElement.querySelector(
      '[data-testid="picture-card-edit-button"]',
    );
    editButton?.click();
    await fixture.whenStable();

    const cancelButton: HTMLButtonElement | null = fixture.nativeElement.querySelector(
      '[data-testid="picture-card-cancel-button"]',
    );
    cancelButton?.click();
    await fixture.whenStable();

    expect(
      fixture.nativeElement
        .querySelector('[data-testid="picture-card-description"]')
        ?.textContent?.trim(),
    ).toBe('test description');
  });
});
