import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponentComponent } from 'src/app/components/templates/dialog-component/dialog-component.component';
import { RegistrarProductoComponent } from '../inventario/dialogs/registrar-producto/registrar-producto.component';
import { AsignarProductoComponent } from '../inventario/dialogs/asignar-producto/asignar-producto.component';
import { RegistrarMovimientoComponent } from '../inventario/dialogs/registrar-movimiento/registrar-movimiento.component';

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

  openRegistroProductoDialog(){
    //console.log('openRegistroProductoDialog called');
    this.dialog.open(RegistrarProductoComponent, {
      width: '1000px',
      height: 'auto',
    });
  }

  openAsignarProductoDialog(){
    console.log('openAsignarProductoDialog called');
    this.dialog.open(AsignarProductoComponent, {
      width: '1000px',
      height: 'auto',
    });
  }

  openMovimientoDialog(){
    console.log('openMovimientoDialog called');
    this.dialog.open(RegistrarMovimientoComponent, {
      width: '1000px',
      height: 'auto',
    });
  }
}
