import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FileUpload } from './file-upload';

describe('FileUpload', () => {
  let component: FileUpload;
  let fixture: ComponentFixture<FileUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUpload],
      providers: [provideTranslateService(), provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(FileUpload);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('challenges', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not clear the form on submit until reset() is called externally', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    component.uploadForm.file().value.set(file);
    component.uploadForm.captureDate().value.set(new Date(2026, 8, 6));
    component.uploadForm.description().value.set('valid description');

    const emitted: unknown[] = [];
    component.submitted.subscribe((value) => emitted.push(value));

    component.submitForm(new Event('submit'));
    expect(emitted.length).toBe(1);
    expect(component.uploadForm.file().value()).toBe(file);

    component.reset();
    expect(component.uploadForm.file().value()).toBeNull();
  });

  it('should reject a non-image file', () => {
    component.uploadForm.file().value.set(new File([''], 'doc.pdf', { type: 'application/pdf' }));
    component.uploadForm.captureDate().value.set(new Date(2026, 8, 6));
    component.uploadForm.description().value.set('valid description');

    expect(component.uploadForm().valid()).toBe(false);

    const emitted: unknown[] = [];
    component.submitted.subscribe((value) => emitted.push(value));
    component.submitForm(new Event('submit'));
    expect(emitted.length).toBe(0);
  });
});
