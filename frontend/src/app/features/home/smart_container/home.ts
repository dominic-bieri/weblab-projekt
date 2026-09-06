import { Component, inject, viewChild } from '@angular/core';
import { PhotoEdit, PictureCard } from '../dumb_components/picture-card/picture-card';
import { FileUpload, PhotoUpload } from '../dumb_components/file-upload/file-upload';
import { PhotoApi } from '../services/photo.api';
import { Photo } from '../photo.type';

@Component({
  imports: [FileUpload, PictureCard],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  private readonly photoApi = inject(PhotoApi);
  private readonly fileUpload = viewChild.required(FileUpload);

  protected readonly photos = this.photoApi.photos;

  protected imageUrl(photo: Photo): string {
    return this.photoApi.imageUrl(photo);
  }

  protected onPhotoUpload(upload: PhotoUpload): void {
    this.photoApi.uploadPhoto(upload).subscribe(() => {
      this.fileUpload().reset();
      this.photos.reload();
    });
  }

  protected onPhotoDelete(id: string): void {
    this.photoApi.deletePhoto(id).subscribe(() => this.photos.reload());
  }

  protected onPhotoEdit(edit: PhotoEdit): void {
    this.photoApi.updatePhoto(edit.id, edit).subscribe(() => this.photos.reload());
  }
}
