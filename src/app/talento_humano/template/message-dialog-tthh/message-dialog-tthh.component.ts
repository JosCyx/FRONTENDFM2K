import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { GlobalAusService } from 'src/app/services/global-aus.service';

@Component({
  selector: 'app-message-dialog-tthh',
  templateUrl: './message-dialog-tthh.component.html',
  styleUrls: ['./message-dialog-tthh.component.css']
})
export class MessageDialogTthhComponent {
  observacionAus = this.globalService.autObservacion;

  constructor(
    public globalService: GlobalAusService,
    private dialogService: DialogServiceService,
    public dialogRef: MatDialogRef<MessageDialogTthhComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string }
  ) {
  }

  closeDialogAut() {
    //this.dialogService.setConfirmResultA(false);
    this.dialogRef.close();
  }

  confirmActionAut() {
    //this.dialogService.setConfirmResultA(true);
    this.dialogRef.close(this.observacionAus);
  }
}
