import { Component, computed, inject, viewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PhotoCard, PhotoEdit } from '../dumb_components/photo-card/photo-card';
import { PhotoUpload, PhotoUploadValue } from '../dumb_components/photo-upload/photo-upload';
import { StreakBadge } from '../dumb_components/streak-badge/streak-badge';
import { PhotoApi } from '../services/photo.api';
import { StreakApi } from '../services/streak.api';
import { Photo } from '../photo.type';
import { ChallengeApi } from '../../challenge/services/challenge.api';

@Component({
  imports: [PhotoUpload, PhotoCard, StreakBadge, TranslatePipe],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  private readonly photoApi = inject(PhotoApi);
  private readonly streakApi = inject(StreakApi);
  private readonly challengeApi = inject(ChallengeApi);
  private readonly photoUpload = viewChild.required(PhotoUpload);

  protected readonly photos = this.photoApi.photos;
  protected readonly challenges = this.challengeApi.challengesValue;
  protected readonly streak = computed(() => this.streakApi.streakValue().streak);

  protected photoUrl(photo: Photo): string {
    return this.photoApi.photoUrl(photo);
  }

  protected onPhotoUpload(upload: PhotoUploadValue): void {
    this.photoApi.uploadPhoto(upload).subscribe(() => {
      this.photoUpload().reset();
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
