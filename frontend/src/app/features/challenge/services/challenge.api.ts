import { inject, Injectable } from '@angular/core';
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

  createChallenge(challenge: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
  }) {
    return this.http.post<Challenge>(this.baseUrl, challenge);
  }

  deleteChallenge(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
