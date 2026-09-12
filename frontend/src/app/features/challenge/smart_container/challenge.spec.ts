import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ChallengePage } from './challenge';

describe('ChallengePage', () => {
  let fixture: ComponentFixture<ChallengePage>;
  let httpMock: HttpTestingController;

  async function setup() {
    await TestBed.configureTestingModule({
      imports: [ChallengePage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService(),
        provideNativeDateAdapter(),
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ChallengePage);
    fixture.detectChanges();
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', async () => {
    await setup();
    httpMock.expectOne('/api/challenge').flush([]);
    // Seite laedt jetzt auch Fotos (fuer die fotografierten Tage pro Challenge).
    httpMock.expectOne('/api/photo').flush([]);
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show an error message when the challenges fail to load', async () => {
    await setup();
    httpMock.expectOne('/api/challenge').flush(null, { status: 500, statusText: 'Server Error' });
    httpMock.expectOne('/api/photo').flush([]);
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('[data-testid="challenge-list-error"]')).toBeTruthy();
  });
});
