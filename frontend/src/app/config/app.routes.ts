import { Routes } from '@angular/router';
import { LOGIN_PATH, PATHS } from './paths.config';
import { canActivateAuth } from './auth.guard';
import { Home } from '../features/home/smart_container/home';
import { Calendar } from '../features/calendar/smart_container/calendar';
import { ChallengePage } from '../features/challenge/smart_container/challenge';
import { ChallengeDetail } from '../features/challenge/smart_container/challenge-detail/challenge-detail';
import { Login } from '../features/auth/login/login';

const { HOME, CALENDAR, CHALLENGE } = PATHS;

export const routes: Routes = [
  {
    path: LOGIN_PATH.path,
    component: Login,
  },
  {
    path: HOME.path,
    component: Home,
    canActivate: [canActivateAuth],
  },
  {
    path: CALENDAR.path,
    component: Calendar,
    canActivate: [canActivateAuth],
  },
  {
    path: CHALLENGE.path,
    component: ChallengePage,
    canActivate: [canActivateAuth],
  },
  {
    path: `${CHALLENGE.path}/:id`,
    component: ChallengeDetail,
    canActivate: [canActivateAuth],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: HOME.path,
  },
  {
    path: '**',
    redirectTo: HOME.path,
  },
];
