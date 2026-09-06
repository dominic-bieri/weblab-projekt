import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DateAdapter } from '@angular/material/core';
import { Navigation } from './components/navigation/navigation';
import { PATHS } from './config/paths.config';
import { ActiveLanguage } from './core/i18n/active-language';

@Component({
  imports: [RouterOutlet, Navigation],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  constructor() {
    const dateAdapter = inject(DateAdapter);
    const activeLanguage = inject(ActiveLanguage);
    effect(() => dateAdapter.setLocale(activeLanguage.current()));
  }

  getAvailableLinks() {
    return Object.values(PATHS);
  }
}
