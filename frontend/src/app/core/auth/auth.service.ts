import { computed, inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { KEYCLOAK_EVENT_SIGNAL } from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakEvent = inject(KEYCLOAK_EVENT_SIGNAL);

  readonly authenticated = computed(() => {
    this.keycloakEvent();
    return this.keycloak.authenticated ?? false;
  });

  login(): Promise<void> {
    return this.keycloak.login({ redirectUri: this.url('/home') });
  }

  register(): Promise<void> {
    return this.keycloak.login({ action: 'register', redirectUri: this.url('/home') });
  }

  logout(): Promise<void> {
    return this.keycloak.logout({ redirectUri: this.url('/login') });
  }

  private url(path: string): string {
    return window.location.origin + path;
  }
}
