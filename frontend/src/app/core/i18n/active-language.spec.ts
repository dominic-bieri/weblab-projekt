import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { ActiveLanguage, getStoredLanguage, LANGUAGE_STORAGE_KEY } from './active-language';

describe('ActiveLanguage', () => {
  let translate: TranslateService;
  let service: ActiveLanguage;

  beforeEach(() => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);

    TestBed.configureTestingModule({
      providers: [provideTranslateService()],
    });

    translate = TestBed.inject(TranslateService);
    service = TestBed.inject(ActiveLanguage);
  });

  afterEach(() => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('updates the current signal when the language changes', () => {
    translate.use('de');

    expect(service.current()).toBe('de');
  });

  it('persists the selected language to localStorage', () => {
    translate.use('de');

    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('de');
  });

  it('overwrites the previously persisted language on a subsequent change', () => {
    translate.use('de');
    translate.use('en');

    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
  });
});

describe('getStoredLanguage', () => {
  afterEach(() => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
  });

  it('returns null when no language was stored yet', () => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);

    expect(getStoredLanguage()).toBeNull();
  });

  it('returns the previously stored language', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'de');

    expect(getStoredLanguage()).toBe('de');
  });
});
