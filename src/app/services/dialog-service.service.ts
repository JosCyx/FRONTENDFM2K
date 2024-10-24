import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponentComponent } from 'src/app/components/templates/dialog-component/dialog-component.component';
import { RegistrarProductoComponent } from '../inventario/dialogs/registrar-producto/registrar-producto.component';
import { AsignarProductoComponent } from '../inventario/dialogs/asignar-producto/asignar-producto.component';
import { RegistrarMovimientoComponent } from '../inventario/dialogs/registrar-movimiento/registrar-movimiento.component';
import { MessageDialogComponent } from '../eventos/components/templates/message-dialog/message-dialog.component';
import { Subject } from 'rxjs';
import { FinishRequerimentComponent } from '../eventos/components/templates/finish-requeriment/finish-requeriment.component';
import { AddDimensionesComponent } from '../components/templates/add-dimensiones/add-dimensiones.component';
import { DevolverDialogComponent } from '../evento_gestion/devolver-dialog/devolver-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogServiceService {

  constructor(private dialog: MatDialog) { }

  openAlertDialog(message: string, type: boolean) {
    //console.log('openAlertDialog called');
    this.dialog.open(DialogComponentComponent, {
      data: { message, type },
      width: '400px',
    });
  }

  openAddDimensiones(){
    this.dialog.open(AddDimensionesComponent, {
      width: '1000px',
    });
  }

  //INVENTARIO
  openRegistroProductoDialog(){
    //console.log('openRegistroProductoDialog called');
    this.dialog.open(RegistrarProductoComponent, {
      width: '1000px',
      height: 'auto',
    });
  }

  openAsignarProductoDialog(){
    //console.log('openAsignarProductoDialog called');
    this.dialog.open(AsignarProductoComponent, {
      width: '1000px',
      height: 'auto',
    });
  }

  openMovimientoDialog(){
    //console.log('openMovimientoDialog called');
    this.dialog.open(RegistrarMovimientoComponent, {
      width: '1000px',
      height: 'auto',
    });
  }

  //PROYECTOS
  private confirmResultSubject = new Subject<boolean>();
  private confirmResultJustify = new Subject<boolean>();
  
  openMessageEvDialog(message: string){
    this.dialog.open(MessageDialogComponent, {
      data: { mensaje: message},
      width: '600px',
    });

    return this.confirmResultSubject.asObservable();
  }

  setConfirmResult(value: boolean){
    if(value){
      this.confirmResultSubject.next(true);
    } else {
      this.confirmResultSubject.next(false);
    }
  }

  //GESTION DE EVENTOS
  private confirmResultSubjectGestev = new Subject<boolean>();

  
  openMessageGestEvDialog(message: string){
    this.dialog.open(DevolverDialogComponent, {
      data: { mensaje: message},
      width: '600px',
    });

    return this.confirmResultSubjectGestev.asObservable();
  }
  


  setConfirmResultGestEv(value: boolean){
    if(value){
      this.confirmResultSubjectGestev.next(true);
    } else {
      this.confirmResultSubjectGestev.next(false);
    }
  }





  

  openFinishReqDialog(){
    this.dialog.open(FinishRequerimentComponent, {
      width: '800px',
    })

    return this.confirmResultJustify.asObservable();
  }

  setConfirmJustify(value: boolean){
    if(value){
      this.confirmResultJustify.next(true);
    } else {
      this.confirmResultJustify.next(false);
    }
  }
}
