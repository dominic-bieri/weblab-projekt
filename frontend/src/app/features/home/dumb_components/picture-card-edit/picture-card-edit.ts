import { Component, OnInit, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { form, FormField } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';

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
  initialCaptureDate = input<Date | string | null>(null);
  initialDescription = input('');

  saved = output<PhotoEditValue>();
  cancelled = output<void>();

  private readonly model = signal<PictureCardEditFormValue>({
    captureDate: null,
    description: '',
  });

  readonly editForm = form(this.model);

  ngOnInit(): void {
    const date = this.initialCaptureDate();
    this.model.set({
      captureDate: date ? new Date(date) : null,
      description: this.initialDescription(),
    });
  }

  save(): void {
    const { captureDate, description } = this.model();
    this.saved.emit({ captureDate: this.toIsoDate(captureDate), description });
  }

  cancel(): void {
    this.cancelled.emit();
  }

  private toIsoDate(date: Date | null): string {
    if (!date) {
      return '';
    }
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }
}
