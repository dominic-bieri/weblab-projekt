import {Component, input} from '@angular/core';
import {NavigationItem} from './navigation.type';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  selector: 'app-navigation',
  styleUrl: './navigation.css',
  templateUrl: './navigation.html',
})
export class Navigation {

  links = input.required<NavigationItem[]>()

}
