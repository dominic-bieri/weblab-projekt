import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { flushDialog } from '../../../../shared/testing/flush-dialog';
import { PhotoCard, PhotoEdit } from './photo-card';

describe('PhotoCard', () => {
  let component: PhotoCard;
  let fixture: ComponentFixture<PhotoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCard],
      providers: [provideTranslateService({ lang: 'de' }), provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'photo-1');
    fixture.componentRef.setInput('photoSource', 'test.jpg');
    fixture.componentRef.setInput('captureDate', '2026-09-03');
    fixture.componentRef.setInput('description', 'test description');
    fixture.componentRef.setInput('challengeId', null);
    fixture.componentRef.setInput('challenges', []);
    await fixture.whenStable();
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the formatted capture date, photo and description', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('mat-card-title')?.textContent?.trim()).toBe('03.09.2026');

    const img = element.querySelector('img');
    expect(img?.getAttribute('src') ?? img?.getAttribute('ngSrc')).toContain('test.jpg');
    expect(img?.getAttribute('alt')).toContain('test description');

    expect(element.querySelector('mat-card-content p')?.textContent?.trim()).toBe(
      'test description',
    );
  });

  it('should not render a challenge name when no challenge is assigned', () => {
    expect(fixture.nativeElement.querySelector('[data-testid="photo-card-challenge"]')).toBeNull();
  });

  it('should render the assigned challenge name', async () => {
    fixture.componentRef.setInput('challengeId', 'challenge-1');
    fixture.componentRef.setInput('challenges', [
      {
        id: 'challenge-1',
        title: 'Architecture Week',
        description: '',
        startDate: '',
        endDate: '',
      },
    ]);
    await fixture.whenStable();

    expect(
      fixture.nativeElement
        .querySelector('[data-testid="photo-card-challenge"]')
        ?.textContent?.trim(),
    ).toBe('Architecture Week');
  });

  it('should ask for confirmation and emit deleted once confirmed', async () => {
    const emitted: string[] = [];
    component.deleted.subscribe((id) => emitted.push(id));

    fixture.nativeElement.querySelector('[data-testid="photo-card-delete-button"]')?.click();
    fixture.detectChanges();
    await flushDialog();

    expect(emitted).toEqual([]);

    document
      .querySelector<HTMLButtonElement>('[data-testid="delete-dialog-confirm-button"]')
      ?.click();
    await flushDialog();

    expect(emitted).toEqual(['photo-1']);
  });

  it('should not emit deleted when the confirmation is cancelled', async () => {
    const emitted: string[] = [];
    component.deleted.subscribe((id) => emitted.push(id));

    fixture.nativeElement.querySelector('[data-testid="photo-card-delete-button"]')?.click();
    fixture.detectChanges();
    await flushDialog();

    document
      .querySelector<HTMLButtonElement>('[data-testid="delete-dialog-cancel-button"]')
      ?.click();
    await flushDialog();

    expect(emitted).toEqual([]);
  });

  it('should open the edit dialog and emit edited with the updated values', async () => {
    const emitted: PhotoEdit[] = [];
    component.edited.subscribe((edit) => emitted.push(edit));

    fixture.nativeElement.querySelector('[data-testid="photo-card-edit-button"]')?.click();
    fixture.detectChanges();
    await flushDialog();

    const descriptionInput = document.querySelector<HTMLInputElement>(
      '[data-testid="photo-card-description-input"]',
    );
    descriptionInput!.value = 'updated description';
    descriptionInput!.dispatchEvent(new Event('input'));
    await flushDialog();

    document.querySelector<HTMLButtonElement>('[data-testid="photo-card-save-button"]')?.click();
    await flushDialog();

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
    const emitted: PhotoEdit[] = [];
    component.edited.subscribe((edit) => emitted.push(edit));

    fixture.nativeElement.querySelector('[data-testid="photo-card-edit-button"]')?.click();
    fixture.detectChanges();
    await flushDialog();

    document.querySelector<HTMLButtonElement>('[data-testid="photo-card-cancel-button"]')?.click();
    await flushDialog();

    expect(emitted).toEqual([]);
    expect(
      fixture.nativeElement
        .querySelector('[data-testid="photo-card-description"]')
        ?.textContent?.trim(),
    ).toBe('test description');
  });
});
