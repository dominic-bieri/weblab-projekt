import { Routes } from '@angular/router';
import { LOGIN_PATH, PATHS } from './paths.config';
import { canActivateAuth } from './auth.guard';
import { Home } from '../features/home/smart_container/home';
import { Calendar } from '../features/calendar/smart_container/calendar';
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
    component: Home, // TODO auf eigentliche challenge seite wechseln
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
