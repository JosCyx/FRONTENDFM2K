import { Component, OnInit } from '@angular/core';
import { CommunicationApiService } from 'src/app/services/communication-api.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-solicoti',
  templateUrl: './solicoti.component.html',
  styleUrls: ['./solicoti.component.css']
})
export class SolicotiComponent implements OnInit {
  empleado: string = '';
  showArea: string = '';

  fecha: Date = new Date;
  fechaFormat: string = this.formatDateToSpanish(this.fecha);

  changeview: string = 'crear';
  showEmpExist: boolean = false;

  empleadosList$!: Observable<any[]>;
  areaList$!: Observable<any[]>;
  empleados: any[] = [];
  areas: any[] = [];

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

  //guarda el nombre del area del empleado seleccionado
  selectEmpleado(): void {
    for (let emp of this.empleados) {
      if ((emp.empleadoNombres + ' ' + emp.empleadoApellidos) == this.empleado) {
        for (let area of this.areas) {
          if (area.areaIdNomina == emp.empleadoIdArea) {
            this.showArea = area.areaDecp
          }
        }
      }
    }
    console.log(this.showArea);
  }



  changeView(view: string): void {
    this.changeview = view;
  }

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



}