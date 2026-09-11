import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ChallengeDetail } from './challenge-detail';

describe('ChallengeDetail', () => {
  let fixture: ComponentFixture<ChallengeDetail>;
  let httpMock: HttpTestingController;

  async function setup(challengeId: string) {
    await TestBed.configureTestingModule({
      imports: [ChallengeDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: challengeId })) },
        },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ChallengeDetail);
    fixture.detectChanges();

    httpMock.expectOne('/api/challenge').flush([
      {
        id: 'challenge-1',
        title: 'Architecture Week',
        description: 'Only architecture shots',
        startDate: '2026-09-01',
        endDate: '2026-09-14',
      },
      {
        id: 'challenge-2',
        title: 'Portrait Week',
        description: 'Only portrait shots',
        startDate: '2026-09-15',
        endDate: '2026-09-28',
      },
    ]);
    httpMock.expectOne('/api/photo').flush([
      {
        id: 'photo-1',
        filename: 'a.jpg',
        mimeType: 'image/jpeg',
        captureDate: '2026-09-03',
        description: 'test',
        photoUrl: '/photo/photo-1?exp=1&sig=abc',
        challengeId: 'challenge-1',
      },
      {
        id: 'photo-2',
        filename: 'b.jpg',
        mimeType: 'image/jpeg',
        captureDate: '2026-09-04',
        description: 'other',
        photoUrl: '/photo/photo-2?exp=1&sig=abc',
        challengeId: null,
      },
    ]);
    await fixture.whenStable();
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('should render the challenge title and only its own photos', async () => {
    await setup('challenge-1');
    const element: HTMLElement = fixture.nativeElement;

    expect(
      element.querySelector('[data-testid="challenge-detail-title"]')?.textContent?.trim(),
    ).toBe('Architecture Week');
    expect(element.querySelectorAll('[data-testid="photo-tile"]').length).toBe(1);
  });

  it('should show the empty state when the challenge has no photos', async () => {
    await setup('challenge-2');
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('[data-testid="challenge-detail-empty"]')).toBeTruthy();
    expect(element.querySelectorAll('[data-testid="photo-tile"]').length).toBe(0);
  });

  it('should show a not-found message for an unknown challenge id', async () => {
    await setup('unknown-challenge');
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('[data-testid="challenge-detail-not-found"]')).toBeTruthy();
  });
});
