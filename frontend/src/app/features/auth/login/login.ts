import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  imports: [MatButtonModule, TranslatePipe],
  selector: 'app-login',
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);

  protected login(): void {
    void this.auth.login();
  }

  protected register(): void {
    void this.auth.register();
  }
}
