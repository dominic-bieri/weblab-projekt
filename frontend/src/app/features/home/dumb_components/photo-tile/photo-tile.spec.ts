import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { PhotoTile } from './photo-tile';

describe('PhotoTile', () => {
  let component: PhotoTile;
  let fixture: ComponentFixture<PhotoTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoTile],
      providers: [provideTranslateService({ lang: 'de' })],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoTile);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('imageSource', 'test.jpg');
    fixture.componentRef.setInput('captureDate', '2026-09-03');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the image and the formatted capture date', () => {
    const element: HTMLElement = fixture.nativeElement;

    const img = element.querySelector('[data-testid="photo-tile-image"]');
    expect(img?.getAttribute('src') ?? img?.getAttribute('ngSrc')).toContain('test.jpg');

    expect(element.querySelector('[data-testid="photo-tile-date"]')?.textContent?.trim()).toBe(
      '03.09.2026',
    );
  });
});
