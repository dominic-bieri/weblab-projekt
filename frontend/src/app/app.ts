import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Navigation} from './components/navigation/navigation';
import {PATHS} from './config/paths.config';

@Component({
  imports: [RouterOutlet, Navigation],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  getAvailableLinks() {
    return Object.values(PATHS);
  }
}
