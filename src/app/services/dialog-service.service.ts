import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponentComponent } from 'src/app/components/templates/dialog-component/dialog-component.component';

@Injectable({
  providedIn: 'root'
})
export class DialogServiceService {

  constructor(private dialog: MatDialog) { }

  openAlertDialog(message: string, type: boolean) {
    console.log('openAlertDialog called');
    this.dialog.open(DialogComponentComponent, {
      data: { message, type },
      width: '400px',
    });
  }
}
