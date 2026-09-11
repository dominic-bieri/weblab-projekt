import { Component, computed, inject, viewChild } from '@angular/core';
import { PhotoEdit, PictureCard } from '../dumb_components/picture-card/picture-card';
import { FileUpload, PhotoUpload } from '../dumb_components/file-upload/file-upload';
import { StreakBadge } from '../dumb_components/streak-badge/streak-badge';
import { PhotoApi } from '../services/photo.api';
import { StreakApi } from '../services/streak.api';
import { Photo } from '../photo.type';
import { ChallengeApi } from '../../challenge/services/challenge.api';

@Component({
  imports: [FileUpload, PictureCard, StreakBadge],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  private readonly photoApi = inject(PhotoApi);
  private readonly streakApi = inject(StreakApi);
  private readonly challengeApi = inject(ChallengeApi);
  private readonly fileUpload = viewChild.required(FileUpload);

  protected readonly photos = this.photoApi.photos;
  protected readonly challenges = this.challengeApi.challenges;
  protected readonly streak = computed(() => this.streakApi.streak.value().streak);

  protected imageUrl(photo: Photo): string {
    return this.photoApi.imageUrl(photo);
  }

  protected onPhotoUpload(upload: PhotoUpload): void {
    this.photoApi.uploadPhoto(upload).subscribe(() => {
      this.fileUpload().reset();
      this.photos.reload();
      this.streakApi.streak.reload();
    });
  }

  protected onPhotoDelete(id: string): void {
    this.photoApi.deleteAndSync(id).subscribe(() => this.streakApi.streak.reload());
  }

  protected onPhotoEdit(edit: PhotoEdit): void {
    const { id, ...changes } = edit;
    this.photoApi.updateAndSync(id, changes).subscribe(() => this.streakApi.streak.reload());
  }
}
