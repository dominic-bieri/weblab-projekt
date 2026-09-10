import { Component, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { form, FormField, maxLength, required } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { toDateKey } from '../../../../shared/local-date';
import { TITLE_MAX_LENGTH } from '../../challenge.type';

export interface ChallengeCreate {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface ChallengeFormValue {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
}

const EMPTY_FORM: ChallengeFormValue = {
  title: '',
  description: '',
  startDate: null,
  endDate: null,
};

@Component({
  imports: [
    FormField,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    TranslatePipe,
  ],
  selector: 'app-challenge-form',
  styleUrl: './challenge-form.css',
  templateUrl: './challenge-form.html',
})
export class ChallengeForm {
  submitted = output<ChallengeCreate>();

  private readonly model = signal<ChallengeFormValue>({ ...EMPTY_FORM });

  protected readonly titleMaxLength = TITLE_MAX_LENGTH;

  readonly challengeForm = form(this.model, (path) => {
    required(path.title);
    maxLength(path.title, TITLE_MAX_LENGTH);
    required(path.description);
    required(path.startDate);
    required(path.endDate);
  });

  submitForm(event: Event): void {
    event.preventDefault();

    const { title, description, startDate, endDate } = this.model();
    if (this.challengeForm().valid() && startDate && endDate) {
      this.submitted.emit({
        title,
        description,
        startDate: toDateKey(startDate),
        endDate: toDateKey(endDate),
      });
    }
  }

  reset(): void {
    this.challengeForm().reset({ ...EMPTY_FORM });
  }
}
