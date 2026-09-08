import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ChallengePage } from './challenge';

describe('ChallengePage', () => {
  let component: ChallengePage;
  let fixture: ComponentFixture<ChallengePage>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
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
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock.expectOne('/api/challenge').flush([]);
    // Seite laedt jetzt auch Fotos (fuer die fotografierten Tage pro Challenge).
    httpMock.expectOne('/api/photo').flush([]);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
