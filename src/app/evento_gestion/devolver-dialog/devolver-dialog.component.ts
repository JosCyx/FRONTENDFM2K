import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { GlobalGestEventosService } from 'src/app/services/global-gest-eventos.service';

@Component({
  selector: 'app-devolver-dialog',
  templateUrl: './devolver-dialog.component.html',
  styleUrls: ['./devolver-dialog.component.css']
})
export class DevolverDialogComponent {


  
  constructor(
    private dialogService: DialogServiceService,
    public dialogRef: MatDialogRef<DevolverDialogComponent>,
    public GlobalGestEvService: GlobalGestEventosService,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string }
    
  ) {
  }

  closeDialog() {
    this.dialogService.setConfirmResultGestEv(false);
    this.dialogRef.close();
  }

  confirmAction() {
    if (this.GlobalGestEvService.motivoDevolucion == '') {
      this.dialogService.openAlertDialog("Ingrese un motivo de devolución", false);
      return;
    }
    this.dialogService.setConfirmResultGestEv(true);
    this.dialogRef.close();
  }

  

}




