import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { createAuthGuard } from 'keycloak-angular';

export const canActivateAuth = createAuthGuard<CanActivateFn>(
  async (_route, _state, { authenticated }) => authenticated || inject(Router).parseUrl('/login'),
);
