import { Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { form, required } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';

export interface PhotoUpload {
  file: File;
  captureDate: string;
  description: string;
}

interface FileUploadFormValue {
  file: File | null;
  captureDate: string;
  description: string;
}

const EMPTY_FORM: FileUploadFormValue = {
  file: null,
  captureDate: '',
  description: '',
};

@Component({
  imports: [MatButtonModule, MatIconModule, TranslatePipe],
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
      this.submitted.emit({ file, captureDate, description });
      this.uploadForm().reset({ ...EMPTY_FORM });
    }
  }
}
