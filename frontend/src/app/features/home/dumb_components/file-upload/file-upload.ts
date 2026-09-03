import { Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { form, required } from '@angular/forms/signals';

interface FileUploadFormValue {
  file: File | null;
}

@Component({
  imports: [MatButtonModule, MatIconModule],
  selector: 'app-file-upload',
  styleUrl: './file-upload.css',
  templateUrl: './file-upload.html',
})
export class FileUpload {
  accept = input('*');
  fileSelected = output<File>();

  private readonly fileModel = signal<FileUploadFormValue>({ file: null });

  readonly uploadForm = form(this.fileModel, (path) => {
    required(path.file);
  });

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.uploadForm.file().value.set(input.files?.[0] ?? null);
    input.value = '';
  }

  submitForm(event: Event): void {
    event.preventDefault();

    const { file } = this.fileModel();
    if (this.uploadForm().valid() && file) {
      this.fileSelected.emit(file);
      this.uploadForm().reset({ file: null });
    }
  }
}
