import { Component, OnInit } from '@angular/core';
import { CommunicationApiService } from 'src/app/services/communication-api.service';
import { Observable, map } from 'rxjs';
import { Detalle } from 'src/app/models/procesos/Detalle';
import { ItemSector } from 'src/app/models/procesos/ItemSector';

@Component({
  selector: 'app-solicoti',
  templateUrl: './solicoti.component.html',
  styleUrls: ['./solicoti.component.css']
})
export class SolicotiComponent implements OnInit {
  empleado: string = '';
  inspector: string = '';
  showArea: string = '';
  descripcion: string = '';
  fecha: Date = new Date;


  //variables para guardar el tracking
  trTipoSolicitud: number = 1;//indica el tipo de solicitud co el que estamos trabajando, este valor cambia en cada tipo de solicitud
  trLastNoSol!: number;
  trNivelEmision: number = 10;//nivel de emision por defecto
  trIdNomEmp!: number;

  //variables de la cabecera
  cab_area!: number;
  cab_fecha: string = this.formatDateToYYYYMMDD(this.fecha);
  cab_asunto!: string;
  cab_proc!: string;
  cab_obsrv!: string;
  cab_adjCot: string = 'NO';
  cab_ncot: number = 0;
  cab_estado: string = 'A';//estado inicial Activo
  cab_plazo!: Date;
  cab_fechaMax!: Date;
  cab_inspector!: number;
  cab_telef_insp!: string;

  //variables del detalle
  cab_id!: number;
  det_id!: number;//se usa para el detalle y para el item por sector
  det_descp!: string;//se usa para el detalle y para el item por sector
  det_unidad!: number;
  det_cantidad!: number;

  //variables del item por sector
  item_id!: number;
  item_cant!: number;
  item_sector!: number;


 

  //variables para controlar la funcionalidad de la pagina
  fechaFormat: string = this.formatDateToSpanish(this.fecha);
  changeview: string = 'crear';

  //listas con datos de la DB
  empleadosList$!: Observable<any[]>;
  areaList$!: Observable<any[]>;
  inspectores$!: Observable<any[]>;

  //listas locales para manejar los datos
  detalle: Detalle[] = [];
  itemSector: ItemSector[] = [];
  empleados: any[] = [];
  areas: any[] = [];
  inspectores: any[] = [];

  constructor(private service: CommunicationApiService) { }

  ngOnInit(): void {
    this.empleadosList$ = this.service.getEmpleadosList();
    this.inspectores$ = this.service.getEmpleadobyArea(12);

    this.areaList$ = this.service.getAreaList();
    this.areaList$.subscribe((data) => {
      this.areas = data;
    });
  }

  //guarda los datos de los empleados en una lista local dependiendo del tamaño de la variable de busqueda, esto se controla con un keyup
  searchEmpleado(): void {
    if (this.empleado.length > 2) {
      this.empleadosList$.subscribe((data) => {
        this.empleados = data;
      });
    } else {
      this.empleados = [];
    }
  }

  searchInspector(): void {
    if (this.inspector.length > 2) {
      this.inspectores$.subscribe((data) => {
        this.inspectores = data;
      });
    } else {
      this.inspectores = [];
    }
  }

  //guarda el nombre del area del empleado seleccionado
  selectEmpleado(): void {
    this.showArea = '';
    if (!this.empleado) {
      this.showArea = '';
    } else {
      for (let emp of this.empleados) {
        if ((emp.empleadoNombres + ' ' + emp.empleadoApellidos) == this.empleado) {
          this.trIdNomEmp = emp.empleadoIdNomina;
          console.log(this.trIdNomEmp);
          for (let area of this.areas) {
            if (area.areaIdNomina == emp.empleadoIdArea) {
              this.cab_area = area.areaIdNomina;
              this.showArea = area.areaDecp;
              console.log(this.cab_area);
            } else if (emp.empleadoIdArea === 0) {
              this.showArea = 'El empleado no posee un area asignada.'
            }
          }
        }
      }
    }
  }

  /*//controla el contenido que se muestra en la pagina
  changeView(view: string): void {
    this.changeview = view;
  }*/

  //tranforma la fecha actual en un formato especifico "Lunes, 31 de julio de 2023"
  formatDateToSpanish(date: Date): string {
    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
      "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayOfWeek}, ${dayOfMonth} de ${month} de ${year}`;
  }

  //fomatea la fecha a yyyymmdd
  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  //obtiene el valor de la ultima solicitud registrada y le suma 1 para asignar ese numero a la solicitud nueva
  getLastSol(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.service.getLastSolicitud(this.trTipoSolicitud).subscribe(
        (resultado) => {
          if (resultado === 0) {
            console.log('No se ha registrado ninguna solicitud de este tipo.');
            resolve(1);
          } else {
            const lastNoSol = resultado[0].solTrNumSol + 1;
            //console.log('Último valor de solicitud:', lastNoSol);
            resolve(lastNoSol);
          }
        },
        (error) => {
          console.error('Error al obtener el último valor de solicitud:', error);
          reject(error);
        }
      );
    });
  }

  //guarda la solicitud con estado emitido
  async guardarSolicitud() {

    this.trLastNoSol = await this.getLastSol();

    const dataTRK = {
      solTrTipoSol: this.trTipoSolicitud,//valor por defecto del tipo de solicitud
      solTrNumSol: this.trLastNoSol,//ultimo numero de solicitud de cotizacion
      solTrNivel: this.trNivelEmision,//nivel 10 por defecto emision
      solTrIdEmisor: this.trIdNomEmp//id del emisor
    }
    console.log(dataTRK);



    /*this.service.generateTracking(data).subscribe(
      response => {
        console.log("Tracking guardado con exito.");
      },
      error => {
        console.log("Error al guardar el tracking: ",error);
      }
    );*/

    const dataCAB = {
      cabSolCotTipoSolicitud: this.trTipoSolicitud,
      cabSolCotArea: this.cab_area,
      cabSolCotNoSolicitud: this.trLastNoSol,
      cabSolCotSolicitante: this.trIdNomEmp,
      cabSolCotFecha: this.cab_fecha,
      cabSolCotAsunto: this.cab_asunto,
      cabSolCotProcedimiento: this.cab_proc,
      cabSolCotObervaciones: this.cab_obsrv,
      cabSolCotAdjCot: this.cab_adjCot,
      cabSolCotNumCotizacion: this.cab_ncot,
      cabSolCotEstado: this.cab_estado,
      cabSolCotEstadoTracking: this.trNivelEmision,
      cabSolCotPlazoEntrega: this.cab_plazo,
      cabSolCotFechaMaxentrega: this.cab_fechaMax,
      cabSolCotInspector: this.cab_inspector,
      cabSolCotTelefInspector: this.cab_telef_insp
    }

    console.log(dataCAB);
  }



 
 metodo(){
  console.log(this.cab_fechaMax);
  console.log(this.cab_plazo);
 }
  

  addItemSector() {

  }

}