import { Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { form, FormField, required } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { toDateKey } from '../../../../shared/local-date';
import { Challenge } from '../../../challenge/challenge.type';

export interface PhotoUpload {
  file: File;
  captureDate: string;
  description: string;
  challengeId: string | null;
}

interface FileUploadFormValue {
  file: File | null;
  captureDate: Date | null;
  description: string;
  challengeId: string | null;
}

const EMPTY_FORM: FileUploadFormValue = {
  file: null,
  captureDate: null,
  description: '',
  challengeId: null,
};

@Component({
  imports: [
    FormField,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
  ],
  selector: 'app-file-upload',
  styleUrl: './file-upload.css',
  templateUrl: './file-upload.html',
})
export class FileUpload {
  challenges = input.required<Challenge[]>();

  accept = input('*');
  submitted = output<PhotoUpload>();

  private readonly model = signal<FileUploadFormValue>({ ...EMPTY_FORM });

  readonly uploadForm = form(this.model, (path) => {
    required(path.file);
    required(path.captureDate);
    required(path.description);
  });

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.uploadForm.file().value.set(input.files?.[0] ?? null);
    input.value = '';
  }

  submitForm(event: Event): void {
    event.preventDefault();

    const { file, captureDate, description, challengeId } = this.model();
    if (this.uploadForm().valid() && file) {
      this.submitted.emit({
        file,
        captureDate: captureDate ? toDateKey(captureDate) : '',
        description,
        challengeId,
      });
    }
  }

  reset(): void {
    this.uploadForm().reset({ ...EMPTY_FORM });
  }
}
