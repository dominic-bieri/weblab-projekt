import { computed, inject, Injectable } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Challenge } from '../challenge.type';

@Injectable({
  providedIn: 'root',
})
export class ChallengeApi {
  private readonly baseUrl = '/api/challenge';

  private readonly http = inject(HttpClient);

  readonly challenges = httpResource<Challenge[]>(() => this.baseUrl, {
    defaultValue: [],
  });

  // Sicherer Zugriff: challenges.value() wirft im Error-Status, auch mit defaultValue gesetzt.
  readonly challengesValue = computed(() =>
    this.challenges.hasValue() ? this.challenges.value() : [],
  );

  createChallenge(challenge: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
  }) {
    return this.http.post<Challenge>(this.baseUrl, challenge);
  }

  updateChallenge(
    id: string,
    challenge: {
      title: string;
      description: string;
      startDate: string;
      endDate: string;
    },
  ) {
    return this.http.put<Challenge>(`${this.baseUrl}/${id}`, challenge);
  }

  deleteChallenge(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
