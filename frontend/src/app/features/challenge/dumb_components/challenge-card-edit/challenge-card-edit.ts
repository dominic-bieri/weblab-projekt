import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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

export interface ChallengeCardEditData {
  initialTitle: string;
  initialDescription: string;
  initialStartDate: string;
  initialEndDate: string;
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
    MatDialogModule,
    TranslatePipe,
  ],
  selector: 'app-challenge-card-edit',
  styleUrl: './challenge-card-edit.css',
  templateUrl: './challenge-card-edit.html',
})
export class ChallengeCardEdit implements OnInit {
  protected readonly data = inject<ChallengeCardEditData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ChallengeCardEdit, ChallengeEditValue>);

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
      title: this.data.initialTitle,
      description: this.data.initialDescription,
      startDate: parseDateKey(this.data.initialStartDate),
      endDate: parseDateKey(this.data.initialEndDate),
    });
  }

  save(): void {
    const { title, description, startDate, endDate } = this.model();
    if (!this.editForm().valid() || !startDate || !endDate) {
      return;
    }
    this.dialogRef.close({
      title,
      description,
      startDate: toDateKey(startDate),
      endDate: toDateKey(endDate),
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
