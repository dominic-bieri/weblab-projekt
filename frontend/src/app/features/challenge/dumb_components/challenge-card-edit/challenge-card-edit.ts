import { Component, input, OnInit, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { form, FormField, maxLength, required } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { parseDateKey, toDateKey } from '../../../../shared/local-date';
import { TITLE_MAX_LENGTH } from '../../challenge.type';

export interface ChallengeEditValue {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface ChallengeCardEditFormValue {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
}

@Component({
  imports: [
    FormField,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    TranslatePipe,
  ],
  selector: 'app-challenge-card-edit',
  styleUrl: './challenge-card-edit.css',
  templateUrl: './challenge-card-edit.html',
})
export class ChallengeCardEdit implements OnInit {
  initialTitle = input.required<string>();
  initialDescription = input.required<string>();
  initialStartDate = input.required<string>();
  initialEndDate = input.required<string>();

  saved = output<ChallengeEditValue>();
  cancelled = output<void>();

  private readonly model = signal<ChallengeCardEditFormValue>({
    title: '',
    description: '',
    startDate: null,
    endDate: null,
  });

  protected readonly titleMaxLength = TITLE_MAX_LENGTH;

  readonly editForm = form(this.model, (path) => {
    required(path.title);
    maxLength(path.title, TITLE_MAX_LENGTH);
    required(path.description);
    required(path.startDate);
    required(path.endDate);
  });

  ngOnInit(): void {
    this.model.set({
      title: this.initialTitle(),
      description: this.initialDescription(),
      startDate: parseDateKey(this.initialStartDate()),
      endDate: parseDateKey(this.initialEndDate()),
    });
  }

  save(): void {
    const { title, description, startDate, endDate } = this.model();
    if (!this.editForm().valid() || !startDate || !endDate) {
      return;
    }
    this.saved.emit({
      title,
      description,
      startDate: toDateKey(startDate),
      endDate: toDateKey(endDate),
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
