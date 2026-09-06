import { NavigationItem } from '../components/navigation/navigation.type';

export const PATHS: { [key: string]: NavigationItem } = {
  HOME: {
    path: 'home',
    label: 'nav.home',
  },
  CALENDAR: {
    path: 'calendar',
    label: 'nav.calendar',
  },
  CHALLENGE: {
    path: 'challenge',
    label: 'nav.challenge',
  },
};

export const LOGIN_PATH: NavigationItem = {
  path: 'login',
  label: 'nav.login',
};
