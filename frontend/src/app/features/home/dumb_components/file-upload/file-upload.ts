import { Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { form, FormField, required } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';

export interface PhotoUpload {
  file: File;
  captureDate: string;
  description: string;
}

interface FileUploadFormValue {
  file: File | null;
  captureDate: Date | null;
  description: string;
}

const EMPTY_FORM: FileUploadFormValue = {
  file: null,
  captureDate: null,
  description: '',
};

@Component({
  imports: [
    FormField,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TranslatePipe,
  ],
  providers: [provideNativeDateAdapter()],
  selector: 'app-file-upload',
  styleUrl: './file-upload.css',
  templateUrl: './file-upload.html',
})
export class FileUpload {
  accept = input('*');
  submitted = output<PhotoUpload>();

  private readonly model = signal<FileUploadFormValue>({ ...EMPTY_FORM });

  readonly uploadForm = form(this.model, (path) => {
    required(path.file);
  });

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.uploadForm.file().value.set(input.files?.[0] ?? null);
    input.value = '';
  }

  submitForm(event: Event): void {
    event.preventDefault();

    const { file, captureDate, description } = this.model();
    if (this.uploadForm().valid() && file) {
      this.submitted.emit({ file, captureDate: this.toIsoDate(captureDate), description });
      this.uploadForm().reset({ ...EMPTY_FORM });
    }
  }

  private toIsoDate(date: Date | null): string {
    if (!date) {
      return '';
    }
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }
}
