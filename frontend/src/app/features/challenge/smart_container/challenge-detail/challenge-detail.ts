import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ChallengeApi } from '../../services/challenge.api';
import { PhotoApi } from '../../../home/services/photo.api';
import { Photo } from '../../../home/photo.type';
import { PhotoTile } from '../../../home/dumb_components/photo-tile/photo-tile';
import { ChallengeProgress } from '../../dumb_components/challenge-progress/challenge-progress';

@Component({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    PhotoTile,
    ChallengeProgress,
    RouterLink,
    TranslatePipe,
  ],
  selector: 'app-challenge-detail',
  styleUrl: './challenge-detail.css',
  templateUrl: './challenge-detail.html',
})
export class ChallengeDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly challengeApi = inject(ChallengeApi);
  private readonly photoApi = inject(PhotoApi);

  private readonly challengeId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { requireSync: true },
  );

  protected readonly challenges = this.challengeApi.challenges;
  protected readonly photos = this.photoApi.photos;

  protected readonly challenge = computed(
    () => this.challenges.value().find((challenge) => challenge.id === this.challengeId()) ?? null,
  );

  protected readonly challengePhotos = computed(() =>
    this.photos.value().filter((photo) => photo.challengeId === this.challengeId()),
  );

  protected readonly challengePhotoDates = computed(() =>
    this.challengePhotos().map((photo) => photo.captureDate),
  );

  protected photoUrl(photo: Photo): string {
    return this.photoApi.photoUrl(photo);
  }
}
