import { Component, inject, viewChild } from '@angular/core';
import { ChallengeCreate, ChallengeForm } from '../dumb_components/challenge-form/challenge-form';
import { ChallengeCard } from '../dumb_components/challenge-card/challenge-card';
import { ChallengeApi } from '../services/challenge.api';

@Component({
  imports: [ChallengeForm, ChallengeCard],
  selector: 'app-challenge',
  styleUrl: './challenge.css',
  templateUrl: './challenge.html',
})
export class ChallengePage {
  private readonly challengeApi = inject(ChallengeApi);
  private readonly challengeForm = viewChild.required(ChallengeForm);

  protected readonly challenges = this.challengeApi.challenges;

  protected onCreate(create: ChallengeCreate): void {
    this.challengeApi.createChallenge(create).subscribe(() => {
      this.challengeForm().reset();
      this.challenges.reload();
    });
  }

  protected onDelete(id: string): void {
    this.challengeApi.deleteChallenge(id).subscribe(() => this.challenges.reload());
  }
}
