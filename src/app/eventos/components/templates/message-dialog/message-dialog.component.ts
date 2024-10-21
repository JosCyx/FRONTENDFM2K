import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogServiceService } from 'src/app/services/dialog-service.service';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent {

  constructor(
    private dialogService: DialogServiceService,
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string }
  ) {
  }

  closeDialog() {
    this.dialogService.setConfirmResult(false);
    this.dialogRef.close();
  }

  confirmAction() {
    this.dialogService.setConfirmResult(true);
    this.dialogRef.close();
  }

}
