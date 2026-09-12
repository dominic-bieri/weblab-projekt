import { Component, computed, inject, viewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ChallengeCreate, ChallengeForm } from '../dumb_components/challenge-form/challenge-form';
import { ChallengeCard, ChallengeEdit } from '../dumb_components/challenge-card/challenge-card';
import { ChallengeApi } from '../services/challenge.api';
import { PhotoApi } from '../../home/services/photo.api';

const NO_CAPTURE_DATES: string[] = [];

@Component({
  imports: [ChallengeForm, ChallengeCard, TranslatePipe],
  selector: 'app-challenge',
  styleUrl: './challenge.css',
  templateUrl: './challenge.html',
})
export class ChallengePage {
  private readonly challengeApi = inject(ChallengeApi);
  private readonly photoApi = inject(PhotoApi);
  private readonly challengeForm = viewChild.required(ChallengeForm);

  protected readonly challenges = this.challengeApi.challenges;

  private readonly captureDatesByChallenge = computed(() => {
    const datesByChallenge = new Map<string, string[]>();

    for (const photo of this.photoApi.photosValue()) {
      if (!photo.challengeId) {
        continue;
      }
      const dates = datesByChallenge.get(photo.challengeId) ?? [];
      dates.push(photo.captureDate);
      datesByChallenge.set(photo.challengeId, dates);
    }

    return datesByChallenge;
  });

  protected captureDatesFor(challengeId: string): string[] {
    return this.captureDatesByChallenge().get(challengeId) ?? NO_CAPTURE_DATES;
  }

  protected onCreate(create: ChallengeCreate): void {
    this.challengeApi.createChallenge(create).subscribe(() => {
      this.challengeForm().reset();
      this.challenges.reload();
    });
  }

  protected onDelete(id: string): void {
    this.challengeApi.deleteChallenge(id).subscribe(() => {
      this.challenges.reload();
      this.photoApi.photos.reload();
    });
  }

  protected onEdit(edit: ChallengeEdit): void {
    const { id, ...changes } = edit;
    this.challengeApi.updateChallenge(id, changes).subscribe(() => this.challenges.reload());
  }
}
