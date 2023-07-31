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

  fecha: Date = new Date;
  fechaFormat: string = this.formatDateToSpanish(this.fecha);

  changeview: string = 'crear';
  showEmpExist: boolean = false;

  empleadosList$!: Observable<any[]>;
  empleados: any[] = [];

  constructor(private service: CommunicationApiService) { }

  ngOnInit(): void {
    this.empleadosList$ = this.service.getEmpleadosList();

    
  }

  searchEmpleado(){
    this.empleadosList$.subscribe((data) => {
      this.empleados = data;
    });
  }
  
  changeView(view: string): void {
    this.changeview = view;
  }

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