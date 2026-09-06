import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { Calendar } from './calendar';
import { Photo } from '../../home/photo.type';

describe('Calendar', () => {
  let component: Calendar;
  let fixture: ComponentFixture<Calendar>;
  let httpMock: HttpTestingController;

  const today = new Date();
  const photo: Photo = {
    id: 'photo-1',
    filename: 'test.jpg',
    mimeType: 'image/jpeg',
    captureDate: today.toISOString(),
    description: 'test description',
    imageUrl: '/photo/photo-1',
  };

  beforeEach(() => {
    return TestBed.configureTestingModule({
      imports: [Calendar],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideTranslateService()],
    })
      .compileComponents()
      .then(() => {
        httpMock = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(Calendar);
        component = fixture.componentInstance;
      });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', async () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/photo').flush([]);
    await fixture.whenStable();

    expect(component).toBeTruthy();
  });

  it('should not show a picture card before a day is selected', async () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/photo').flush([photo]);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('[data-testid="picture-card"]')).toBeFalsy();
  });

  it('should show the picture card for the selected day', async () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/photo').flush([photo]);
    await fixture.whenStable();

    fixture.nativeElement.querySelector('[data-testid="calendar-day-filled"]')?.click();
    await fixture.whenStable();

    expect(
      fixture.nativeElement
        .querySelector('[data-testid="picture-card-description"]')
        ?.textContent?.trim(),
    ).toBe('test description');
  });
});
