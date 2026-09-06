import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ChallengeCreate, ChallengeForm } from './challenge-form';

describe('ChallengeForm', () => {
  let component: ChallengeForm;
  let fixture: ComponentFixture<ChallengeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeForm],
      providers: [provideTranslateService(), provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should stay invalid until all fields are filled', () => {
    expect(component.challengeForm().valid()).toBe(false);

    component.challengeForm.title().value.set('Architecture Week');
    component.challengeForm.description().value.set('Only architecture shots');
    component.challengeForm.startDate().value.set(new Date(2026, 8, 1));
    component.challengeForm.endDate().value.set(new Date(2026, 8, 14));

    expect(component.challengeForm().valid()).toBe(true);
  });

  it('should emit the created challenge on submit', () => {
    component.challengeForm.title().value.set('Architecture Week');
    component.challengeForm.description().value.set('Only architecture shots');
    component.challengeForm.startDate().value.set(new Date(2026, 8, 1));
    component.challengeForm.endDate().value.set(new Date(2026, 8, 14));

    const emitted: ChallengeCreate[] = [];
    component.submitted.subscribe((value) => emitted.push(value));

    component.submitForm(new Event('submit'));

    expect(emitted).toEqual([
      {
        title: 'Architecture Week',
        description: 'Only architecture shots',
        startDate: '2026-09-01',
        endDate: '2026-09-14',
      },
    ]);
  });

  it('should not clear the form on submit until reset() is called externally', () => {
    component.challengeForm.title().value.set('Architecture Week');
    component.challengeForm.description().value.set('Only architecture shots');
    component.challengeForm.startDate().value.set(new Date(2026, 8, 1));
    component.challengeForm.endDate().value.set(new Date(2026, 8, 14));

    component.submitForm(new Event('submit'));
    expect(component.challengeForm.title().value()).toBe('Architecture Week');

    component.reset();
    expect(component.challengeForm.title().value()).toBe('');
  });
});
