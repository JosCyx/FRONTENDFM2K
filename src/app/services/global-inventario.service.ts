import { Injectable } from '@angular/core';
import { Producto } from '../models/inventario/Producto';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalInventarioService {
  private confirmSubject = new BehaviorSubject<boolean>(false);
  confirmObserv = this.confirmSubject.asObservable();

  setConfirmObserv(value: boolean) {
    this.confirmSubject.next(value);
  }
  
  areaSelected: number = 0;
  sectorSelected: number = 0;
  sectorName: string = '';
  filterHistoryName: string = '-Todos-';


  //almacena el numero del sector autorizado del usuario
  grupoAutorizado: number[] = [];


  //producto seleccionado para ver detalle
  productoToView: any = {};

  //id de producto selccionado para consultar los movimientos
  productSelectedID: number = 0;

  //datos del producto para registrar un movimiento
  productoNombre: string = '';
  productoCodigo: string = '';

  //GUARDA UNA COPIA DEL DATASOURCE DEL HISTORIAL
  dataSourceCopyHistory: any[] = [];

  clearProductoToView() {
    this.productoToView = {};
  }
 
  constructor(
    private router: Router
  ) { }

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

  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

}
