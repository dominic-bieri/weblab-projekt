import { Component, inject, input } from '@angular/core';
import { NavigationItem } from './navigation.type';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  imports: [RouterLink, RouterLinkActive, MatButtonModule, TranslatePipe, LanguageSwitcher],
  selector: 'app-navigation',
  styleUrl: './navigation.css',
  templateUrl: './navigation.html',
})
export class Navigation {
  private readonly auth = inject(AuthService);

  links = input.required<NavigationItem[]>();

  protected readonly authenticated = this.auth.authenticated;

  protected logout(): void {
    void this.auth.logout();
  }
}
