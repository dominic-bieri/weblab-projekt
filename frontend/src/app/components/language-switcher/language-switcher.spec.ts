import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { LANGUAGE_STORAGE_KEY } from '../../core/i18n/active-language';
import { LanguageSwitcher } from './language-switcher';

describe('LanguageSwitcher', () => {
  let component: LanguageSwitcher;
  let fixture: ComponentFixture<LanguageSwitcher>;

  beforeEach(async () => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);

    await TestBed.configureTestingModule({
      imports: [LanguageSwitcher],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcher);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an option per language', () => {
    expect(component.languages.length).toBe(2);
  });

  it('persists the language selection so it survives a reload', () => {
    component.switchLanguage('de');

    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('de');
  });

  it('does nothing when switching to the already active language', () => {
    component.switchLanguage(component.currentLang());

    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBeNull();
  });
});
