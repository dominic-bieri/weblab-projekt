import { Component, signal } from '@angular/core';
import { PictureCard } from '../dumb_components/picture-card/picture-card';
import { FileUpload } from '../dumb_components/file-upload/file-upload';

@Component({
  imports: [FileUpload, PictureCard],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  protected readonly date = new Date();
  items = signal(Array.from({ length: 10 }, (_, i) => i + 1));

  protected onFileSelected(file: File): void {
    console.log('File received in Home:', file.name, file.size, file.type);
  }
}
