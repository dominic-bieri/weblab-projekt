import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PictureCard } from './picture-card';

describe('PictureCard', () => {
  let component: PictureCard;
  let fixture: ComponentFixture<PictureCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PictureCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PictureCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('imageSource', 'test.jpg');
    fixture.componentRef.setInput('captureDate', new Date('2026-09-03'));
    fixture.componentRef.setInput('description', 'test description');
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
});
