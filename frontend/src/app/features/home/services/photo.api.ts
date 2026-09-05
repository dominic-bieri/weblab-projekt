import { inject, Injectable } from '@angular/core';

import { HttpClient, httpResource } from '@angular/common/http';
import { Photo } from '../photo.type';

@Injectable({
  providedIn: 'root',
})
export class PhotoApi {
  private readonly baseUrl = '/api/photo';

  private readonly http = inject(HttpClient);

  readonly photos = httpResource<Photo[]>(() => this.baseUrl, {
    defaultValue: [],
  });

  imageUrl(photo: Photo): string {
    return `/api${photo.imageUrl}`;
  }

  uploadPhoto(upload: { file: File; captureDate: string; description: string }) {
    const body = new FormData();
    body.append('file', upload.file);
    if (upload.captureDate) {
      body.append('captureDate', upload.captureDate);
    }
    if (upload.description) {
      body.append('description', upload.description);
    }
    return this.http.post<Photo>(`${this.baseUrl}/upload`, body);
  }
}
