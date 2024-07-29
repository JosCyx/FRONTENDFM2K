import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { MatPaginator } from '@angular/material/paginator';
import { AlertEventService } from 'src/app/services/comunicationAPI/comint/alert-event.service';
import { AlertEvent } from 'src/app/comint/models/AlertEvent';
import { GlobalComintService } from 'src/app/services/global-comint.service';
import { Router } from '@angular/router';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { AuxComintService } from 'src/app/services/comunicationAPI/comint/aux-comint.service';
import { HighContrastMode } from '@angular/cdk/a11y';

@Component({
  selector: 'app-alerta-evento-list',
  templateUrl: './alerta-evento-list.component.html',
  styleUrls: ['./alerta-evento-list.component.css']
})
export class AlertaEventoListComponent {
  //@ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;

  displayedColumns: string[] = ['tipo', 'asunto', 'fecha', 'hora', 'lugar', 'estado', 'enviado'];
  displayedColumnsView: string[] = ['tipo', 'asunto', 'fecha', 'hora', 'lugar'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  dataSourceView: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  //alertEventList: AlertEvent[] = [];

  alertTypesList: any[] = [];
  estadoAlertList: any[] = [];
  numEnviosList: any[] = [];

  originalData: any[] = [];
  originalDataView: any[] = [];

  clientscount: number = 0;


  constructor(
    private alertService: AlertEventService,
    private globalComintSerice: GlobalComintService,
    private router: Router,
    private dialogService: DialogServiceService,
    private auxService: AuxComintService,

  ) {

  }

  ngOnInit() {
    /* this.signalRServicee.clientCount$.subscribe(
       (count) => {
         this.clientscount = count;
         console.log("Cantidad de clientes conectados:", count);
       }
     );*/

    setTimeout(() => {
      this.auxService.getAlertTypes().subscribe(
        (res: any[]) => {
          //console.log("Tipos de alertas obtenidos: ", res);
          this.alertTypesList = _.cloneDeep(res);
        },
        (error) => {
          console.error(error);
        }
      );

      this.auxService.getEventStatus().subscribe(
        (res: any[]) => {
          //console.log("Estados de alertas obtenidos: ", res);
          this.estadoAlertList = _.cloneDeep(res);
        },
        (error) => {
          console.error(error);
        }
      );
    }, 200);

    //consultar las solicitudes de evento y crear el MatTableDataSource
    setTimeout(() => {

      this.alertService.getAlertEvents().subscribe(
        (res: AlertEvent[]) => {
          //console.log("Alertas obtenidas: ", res);
          //this.alertEventList = _.cloneDeep(res);
          this.originalData = _.cloneDeep(res);

          this.dataSource = new MatTableDataSource<any>(res);
          this.dataSource.paginator = this.paginator1;

          this.alertService.getFechasAlertas().subscribe(
            (res: any) => {
              this.numEnviosList = _.cloneDeep(res);
              //console.log("NUMERO DE ENVIOS: ", this.numEnviosList);
            },
            (error) => {
              console.error(error);
            }
          );
        },
        (error) => {
          console.error(error);
        }
      );

      this.alertService.getAlertEventsView().subscribe(
        (res: any) => {
          console.log("Alertas obtenidas view: ", res);
          //this.alertEventList = _.cloneDeep(res);
          this.originalDataView = _.cloneDeep(res);

          this.dataSourceView = new MatTableDataSource<any>(res);
          this.dataSourceView.paginator = this.paginator2;
        },
        (error) => {
          console.error(error);
        }
      
      );
    }, 400);
  }




  callMensaje(mensaje: string, type: boolean) {
    this.dialogService.openAlertDialog(mensaje, type);
  }

  selectAlertEvent(row: any) {
    //hacer la peticion de la alerta seleccionada
    this.alertService.getAlertEventById(row.altEvId).subscribe(
      (res: any) => {
        //console.log("Alerta seleccionada: ", res);

        //ASIGNAR LAS PROPIEDADES DE A ALERTA AL OBJETO ALEREVENT DEL SERVICIO GLOBAL
        this.globalComintSerice.alertEvent = res.alerta;
        this.globalComintSerice.alertEvent.altEvImagenAlerta = res.image;
        this.globalComintSerice.alertEvent.altEvProgramacion = res.programacion;
        this.globalComintSerice.alertEvent.idImage = res.idImage;
        //console.log("ALERTA FORMATEADA: ", this.globalComintSerice.alertEvent);
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

  getTipoAlertaName(idAlerta: number) {
    let tipo = this.alertTypesList.find((alert) => alert.typeAltId === idAlerta);
    return tipo?.typeAltDescripcion;
  }

  getEstadoAlertaName(idEstado: number) {
    let estado = this.estadoAlertList.find((est) => est.estEvId === idEstado);
    return estado?.estEvDescripcion;
  }

  getFechaFormat(fecha: string) {
    if (!fecha) return "Sin fecha";
    return fecha.split('T')[0];
  }

  getHoraFormat(hora: string) {
    if (!hora) return "Sin hora";
    return hora
  }

  getNumEnvios(idAlerta: number): string {
    let numEnvios = this.numEnviosList.find((env) => env.alertId === idAlerta);
    return numEnvios ? `${numEnvios.send} de ${numEnvios.total}` : "";
  }

  ////////////////////FILTROS////////////////////////
  filterType: number = 0;
  //almacena el valor del filtro cuando se selecciona una cadena
  filterStrContent: string = "";
  //almacena el valor del filtro cuando se selecciona una opcion de las listas
  filterTypeContent: number = 0;
  handleFilter: boolean = false;


  //establece el tipo de filtro seleccionado
  setFilterType(type: number): void {
    this.filterType = type;
    if (this.handleFilter) {
      this.handleFilter = false
      this.filterType = 0;
      this.filterStrContent = "";
      this.dataSource.data = _.cloneDeep(this.originalData);
    } else {
      this.handleFilter = true;
    }
  }

  //extrae el valor del filtro de las listas
  applyListFilter(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
      this.filterTypeContent = Number(selectElement.value);
      this.applyFilter();
    }
  }

  applyStrFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.filterStrContent = inputElement.value;
      this.applyFilter();
    }
  }

  applyFilter(): void {
    if (this.filterType === 1) {
      this.dataSource.data = this.originalData.filter(item =>
        item.altEvTipoAlerta == this.filterTypeContent
      );
      this.dataSourceView.data = this.originalDataView.filter(item =>
        item.altEvTipoAlerta == this.filterTypeContent
      );
    } else if (this.filterType === 2) {
      this.dataSource.data = this.originalData.filter(item =>
        item.altEvTituloAlerta.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
      this.dataSourceView.data = this.originalDataView.filter(item =>
        item.altEvTituloAlerta.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
    } else if (this.filterType === 3) {
      this.dataSource.data = this.originalData.filter(item =>
        item.altEvLugar.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
      this.dataSourceView.data = this.originalDataView.filter(item =>
        item.altEvLugar.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
    } else if (this.filterType === 4) {
      this.dataSource.data = this.originalData.filter(item =>
        item.altEvEstadoEvento == this.filterTypeContent
      );
      this.dataSourceView.data = this.originalDataView.filter(item =>
        item.altEvEstadoEvento == this.filterTypeContent
      );
    }
  }

  sortByAsunto(type: number) {
    //si es 1 ordena de forma ascendente
    if (type == 1) {
      this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => (a.altEvTituloAlerta.toLowerCase() > b.altEvTituloAlerta.toLowerCase()) ? 1 : -1);
      this.dataSourceView.data = this.dataSourceView.data.sort((a: any, b: any) => (a.altEvTituloAlerta.toLowerCase() > b.altEvTituloAlerta.toLowerCase()) ? 1 : -1);
    } else {
      this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => (a.altEvTituloAlerta.toLowerCase() < b.altEvTituloAlerta.toLowerCase()) ? 1 : -1);
      this.dataSourceView.data = this.dataSourceView.data.sort((a: any, b: any) => (a.altEvTituloAlerta.toLowerCase() < b.altEvTituloAlerta.toLowerCase()) ? 1 : -1);
    }
  }
}
