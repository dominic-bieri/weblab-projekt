import {Component, signal} from '@angular/core';
import {PictureCard} from '../dumb_components/picture-card/picture-card';

@Component({
  imports: [
    PictureCard
  ],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  protected readonly date = new Date();
  items = signal(Array.from({ length: 10 }, (_, i) => i + 1));
}
