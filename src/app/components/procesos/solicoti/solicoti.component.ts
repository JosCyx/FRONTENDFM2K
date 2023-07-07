import { Component } from '@angular/core';
import { Solicoti } from 'src/app/models/procesos/solicoti';

@Component({
  selector: 'app-solicoti',
  templateUrl: './solicoti.component.html',
  styleUrls: ['./solicoti.component.css']
})
export class SolicotiComponent {
  changeview: string = 'consultar';
  indice: number = 0;
  listaCoti: Solicoti[] = [];
  fecha: Date = new Date;
  sector: string = '';
  asunto:string = '';
  nrosoli: string = '';
  solicitadopor: string = '';


  
  changeView(view: string): void {
    this.changeview = view;
  }
  
  eliminarSolicoti(index:number):void{
    this.listaCoti.splice(index,1);
  }
  editarSolicoti(solicoti: Solicoti, index: number): void {
    this.indice = index;
    this.fecha = solicoti.fecha;
    this.sector = solicoti.sector;
    this.asunto = solicoti.asunto;
    this.nrosoli = solicoti.nrosoli;
    
}
}