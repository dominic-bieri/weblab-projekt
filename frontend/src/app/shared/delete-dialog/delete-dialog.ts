import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

export interface DeleteDialogData {
  name: string;
}

@Component({
  imports: [MatDialogModule, MatButtonModule, TranslatePipe],
  selector: 'app-delete-dialog',
  styleUrl: './delete-dialog.css',
  templateUrl: './delete-dialog.html',
})
export class DeleteDialog {
  protected readonly data = inject<DeleteDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DeleteDialog, boolean>);

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
