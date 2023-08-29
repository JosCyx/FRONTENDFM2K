import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunicationApiService } from 'src/app/services/communication-api.service';

@Component({
  selector: 'app-solipago',
  templateUrl: './solipago.component.html',
  styleUrls: ['./solipago.component.css']
})
export class SolipagoComponent implements OnInit{

  empleado: string = '';
  empleados: any[] = [];
  empleadosList$!: Observable<any[]>;

  constructor(private service: CommunicationApiService){}

  ngOnInit(): void {
    this.empleadosList$ = this.service.getEmpleadosList();
    
  }

  searchEmpleado(): void {
    if (this.empleado.length > 2) {
      this.empleadosList$.subscribe((data) => {
        this.empleados = data;
      });
    } else {
      this.empleados = [];
    }
  }
}
