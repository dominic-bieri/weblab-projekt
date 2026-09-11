import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { form, FormField, required } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { parseDateKey, toDateKey } from '../../../../shared/local-date';
import { Challenge } from '../../../challenge/challenge.type';

export interface PhotoEditValue {
  captureDate: string;
  description: string;
  challengeId: string | null;
}

export interface PhotoCardEditData {
  challenges: Challenge[];
  initialCaptureDate: string;
  initialDescription: string;
  initialChallengeId: string | null;
}

interface PhotoCardEditFormValue {
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
    MatDialogModule,
    TranslatePipe,
  ],
  selector: 'app-photo-card-edit',
  styleUrl: './photo-card-edit.css',
  templateUrl: './photo-card-edit.html',
})
export class PhotoCardEdit implements OnInit {
  protected readonly data = inject<PhotoCardEditData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<PhotoCardEdit, PhotoEditValue>);

  protected readonly challenges = this.data.challenges;

  private readonly model = signal<PhotoCardEditFormValue>({
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
      captureDate: parseDateKey(this.data.initialCaptureDate),
      description: this.data.initialDescription,
      challengeId: this.data.initialChallengeId,
    });
  }

  save(): void {
    const { captureDate, description, challengeId } = this.model();
    this.dialogRef.close({
      captureDate: captureDate ? toDateKey(captureDate) : '',
      description,
      challengeId,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
