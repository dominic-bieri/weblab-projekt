import { Component, input, OnInit, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { form, FormField, required } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { parseDateKey, toDateKey } from '../../../../shared/local-date';
import { Challenge } from '../../../challenge/challenge.type';

export interface PhotoEditValue {
  captureDate: string;
  description: string;
  challengeId: string | null;
}

interface PictureCardEditFormValue {
  captureDate: Date | null;
  description: string;
  challengeId: string | null;
}

@Component({
  imports: [
    FormField,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    TranslatePipe,
  ],
  selector: 'app-picture-card-edit',
  styleUrl: './picture-card-edit.css',
  templateUrl: './picture-card-edit.html',
})
export class PictureCardEdit implements OnInit {
  challenges = input.required<Challenge[]>();

  initialCaptureDate = input.required<string>();
  initialDescription = input.required<string>();
  initialChallengeId = input.required<string | null>();

  saved = output<PhotoEditValue>();
  cancelled = output<void>();

  private readonly model = signal<PictureCardEditFormValue>({
    captureDate: null,
    description: '',
    challengeId: null,
  });

  readonly editForm = form(this.model, (path) => {
    required(path.captureDate);
    required(path.description);
  });

  ngOnInit(): void {
    this.model.set({
      captureDate: parseDateKey(this.initialCaptureDate()),
      description: this.initialDescription(),
      challengeId: this.initialChallengeId(),
    });
  }

  save(): void {
    const { captureDate, description, challengeId } = this.model();
    this.saved.emit({
      captureDate: captureDate ? toDateKey(captureDate) : '',
      description,
      challengeId,
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
