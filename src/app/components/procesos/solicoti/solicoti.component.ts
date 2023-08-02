import { Component, OnInit } from '@angular/core';
import { CommunicationApiService } from 'src/app/services/communication-api.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-solicoti',
  templateUrl: './solicoti.component.html',
  styleUrls: ['./solicoti.component.css']
})
export class SolicotiComponent implements OnInit {
  //variables para guardar el tracking
  trTipoSolicitud: number = 1;//indica el tipo de solicitud co el que estamos trabajando, este valor cambia en cada tipo de solicitud
  trLastNoSol!: number;
  trNivelEmision: number = 10;//nivel de emision por defecto
  trIdNomEmp!: number;



  empleado: string = '';
  inspector: string = '';
  showArea: string = '';
  descripcion: string = '';
  fecha: Date = new Date;



  //variables para controlar la funcionalidad de la pagina
  fechaFormat: string = this.formatDateToSpanish(this.fecha);
  changeview: string = 'crear';

  //listas con datos de la DB
  empleadosList$!: Observable<any[]>;
  areaList$!: Observable<any[]>;

  //listas locales para manejar los datos
  empleadosOP: any[] = [];
  empleados: any[] = [];
  areas: any[] = [];
  inspectores: any[] = [];

  constructor(private service: CommunicationApiService) { }

  ngOnInit(): void {
    this.empleadosList$ = this.service.getEmpleadosList();

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
      this.empleadosList$.subscribe((data) => {
        this.empleadosOP= data;
        
      });
    } else {
      this.empleados = [];
    }
  }

  //guarda el nombre del area del empleado seleccionado
  selectEmpleado(): void {
    if (!this.empleado) {
      this.showArea = '';
    } else {
      for (let emp of this.empleados) {
        if ((emp.empleadoNombres + ' ' + emp.empleadoApellidos) == this.empleado) {
          this.trIdNomEmp = emp.empleadoIdNomina;
          console.log(this.trIdNomEmp);
          for (let area of this.areas) {
            if (area.areaIdNomina == emp.empleadoIdArea) {
              this.showArea = area.areaDecp
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
            console.log('Último valor de solicitud:', lastNoSol);
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

    const data = {
      solTrTipoSol: this.trTipoSolicitud,//valor por defecto del tipo de solicitud
      solTrNumSol: this.trLastNoSol,//ultimo numero de solicitud de cotizacion
      solTrNivel: this.trNivelEmision,
      solTrIdEmisor: this.trIdNomEmp//modificar
    }
    console.log(data);



    /*this.service.generateTracking(data).subscribe(
      response => {
        console.log("Tracking guardado con exito.");
      },
      error => {
        console.log("Error al guardar el tracking: ",error);
      }
    );*/
  }



}