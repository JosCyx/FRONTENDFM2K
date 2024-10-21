import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { GlobalEventosService } from 'src/app/services/global-eventos.service';

@Component({
  selector: 'app-finish-requeriment',
  templateUrl: './finish-requeriment.component.html',
  styleUrls: ['./finish-requeriment.component.css']
})
export class FinishRequerimentComponent {



  constructor(
    public globalEvService: GlobalEventosService,
    private dialogService: DialogServiceService,
    public dialogRef: MatDialogRef<FinishRequerimentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reqs: any }
  ) {
  }

  closeDialog() {
    this.dialogService.setConfirmJustify(false);
    this.globalEvService.observContent = '';
    this.dialogRef.close();
  }

  confirmAction() {
    this.dialogService.setConfirmJustify(true);
    this.dialogRef.close();
  }
}
