import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Home } from './home';

describe('Home', () => {
  let fixture: ComponentFixture<Home>;
  let httpMock: HttpTestingController;

  async function setup() {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService(),
        provideNativeDateAdapter(),
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', async () => {
    await setup();
    httpMock.expectOne('/api/photo').flush([]);
    httpMock.expectOne('/api/streak').flush({ streak: 0 });
    httpMock.expectOne('/api/challenge').flush([]);
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show an error message when the photos fail to load', async () => {
    await setup();
    httpMock.expectOne('/api/photo').flush(null, { status: 500, statusText: 'Server Error' });
    httpMock.expectOne('/api/streak').flush({ streak: 0 });
    httpMock.expectOne('/api/challenge').flush([]);
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('[data-testid="home-photos-error"]')).toBeTruthy();
  });
});
