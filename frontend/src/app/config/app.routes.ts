import {Routes} from '@angular/router';
import {PATHS} from './paths.config';
import {Home} from '../features/home/smart_container/home';

const {HOME, CHALLENGE} = PATHS;

export const routes: Routes = [
  {
    path: HOME.path,
    component: Home
  },
  {
    path: CHALLENGE.path,
    component: Home // TODO auf eigentliche challenge seite wechseln
  },
  {
    path: "**",
    component: Home
  }
];
