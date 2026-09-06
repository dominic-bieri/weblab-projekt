import { Component, input, OnInit, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { form, FormField, required } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { parseDateKey, toDateKey } from '../../../../shared/local-date';

export interface PhotoEditValue {
  captureDate: string;
  description: string;
}

interface PictureCardEditFormValue {
  captureDate: Date | null;
  description: string;
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
  providers: [provideNativeDateAdapter()],
  selector: 'app-picture-card-edit',
  styleUrl: './picture-card-edit.css',
  templateUrl: './picture-card-edit.html',
})
export class PictureCardEdit implements OnInit {
  initialCaptureDate = input.required<Date | string>();
  initialDescription = input.required<string>();

  saved = output<PhotoEditValue>();
  cancelled = output<void>();

  private readonly model = signal<PictureCardEditFormValue>({
    captureDate: null,
    description: '',
  });

  readonly editForm = form(this.model, (path) => {
    required(path.captureDate);
    required(path.description);
  });

  ngOnInit(): void {
    this.model.set({
      captureDate: parseDateKey(this.initialCaptureDate()),
      description: this.initialDescription(),
    });
  }

  save(): void {
    const { captureDate, description } = this.model();
    this.saved.emit({ captureDate: captureDate ? toDateKey(captureDate) : '', description });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
