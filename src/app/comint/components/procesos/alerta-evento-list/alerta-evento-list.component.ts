import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { MatPaginator } from '@angular/material/paginator';
import { AlertEventService } from 'src/app/services/comunicationAPI/comint/alert-event.service';
import { AlertEvent } from 'src/app/comint/models/AlertEvent';
import { GlobalComintService } from 'src/app/services/global-comint.service';
import { Router } from '@angular/router';
import { DialogServiceService } from 'src/app/services/dialog-service.service';

@Component({
  selector: 'app-alerta-evento-list',
  templateUrl: './alerta-evento-list.component.html',
  styleUrls: ['./alerta-evento-list.component.css']
})
export class AlertaEventoListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['tipo','asunto', 'fecha', 'hora', 'lugar', 'estado', 'enviado'];
  dataSource: any = [];

  alertEventList: AlertEvent[] = [];

  constructor(
    private alertService: AlertEventService,
    private globalComintSerice: GlobalComintService,
    private router: Router,
    private dialogService: DialogServiceService
  ) { 

  }

  ngOnInit() {
    //consultar las solicitudes de evento y crear el MatTableDataSource
    setTimeout(() => {

      this.alertService.getAlertEvents().subscribe(
        (res: AlertEvent[]) => {
          //console.log("Alertas obtenidas: ", res);
          this.alertEventList = _.cloneDeep(res);
          this.dataSource = new MatTableDataSource<any>(res);
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error(error);
        }
      );
    }, 300);
  }

  callMensaje(mensaje: string, type: boolean) {
    this.dialogService.openAlertDialog(mensaje, type);
  }

  selectAlertEvent(row: any){
    //hacer la peticion de la alerta seleccionada
    this.alertService.getAlertEventById(row.altEvId).subscribe(
      (res: any) => {
        //console.log("Alerta seleccionada: ", res);

        //ASIGNAR LAS PROPIEDADES DE A ALERTA AL OBJETO ALEREVENT DEL SERVICIO GLOBAL
        this.globalComintSerice.alertEvent = res.alerta;
        this.globalComintSerice.alertEvent.altEvImagenAlerta = res.image;
        this.globalComintSerice.alertEvent.altEvProgramacion = res.programacion;
        console.log("ALERTA FORMATEADA: ", this.globalComintSerice.alertEvent);
        this.globalComintSerice.editMode = true;
        //redirigir a la pagina de alerta para visualizar la alerta seleccionada
        this.router.navigate(['alertev']);
      },
      (error) => {
        console.error(error);
        this.callMensaje("La alerta seleccionada no posee datos completos. Por favor seleccione otra.", false);
      }
    );
  }
}
