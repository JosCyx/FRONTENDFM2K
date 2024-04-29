import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { _MatTableDataSource, MatTableDataSource } from '@angular/material/table';
export interface PeriodicElement {
  NProveedor: string;
  position: number;
  NActividad: string;
  RespInter: string;
  Fecha:string;
  Hora:string;
  Riesgo:string;

}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, NProveedor: 'KFC', NActividad: '1.0079', RespInter:'gfhgfdh', Fecha:'dgashh',Hora:'dsga', Riesgo:'alto' },
  {position: 2, NProveedor: 'proveedor2', NActividad: '1.0079', RespInter:'gfhgfdh', Fecha:'dgashh',Hora:'dsga', Riesgo:'bajo' },{position: 3, NProveedor: 'prov 3', NActividad: '1.0079', RespInter:'gfhgfdh', Fecha:'dgashh',Hora:'dsga', Riesgo:'dfsg' },{position: 4, NProveedor: 'prov 4', NActividad: '1.0079', RespInter:'gfhgh', Fecha:'dgashh',Hora:'dsga', Riesgo:'dfsg' },{position: 5, NProveedor: 'prov 5', NActividad: '1.0079', RespInter:'gfhgfdh', Fecha:'dh',Hora:'a', Riesgo:'dfsg' },{position: 6, NProveedor: 'kytj', NActividad: '1.0079', RespInter:'gfhgfh', Fecha:'dgashh',Hora:'dsga', Riesgo:'dfsg' },{position: 7, NProveedor: 'rtury', NActividad: '1.0079', RespInter:'gfhgfdh', Fecha:'dgashh',Hora:'dsga', Riesgo:'dfsg' },{position: 8, NProveedor: 'dfhfds', NActividad: '1.0079', RespInter:'gfhgfdh', Fecha:'dgashh',Hora:'dsga', Riesgo:'dfsg' },{position: 9, NProveedor: 'KFC', NActividad: '1.0079', RespInter:'gfhgfdh', Fecha:'dgashh',Hora:'dsga', Riesgo:'dfsg' },{position: 10, NProveedor: 'KFC', NActividad: '1.0079', RespInter:'gfhgfdh', Fecha:'dgashh',Hora:'dsga', Riesgo:'dfsg' },
  {position: 11, NProveedor: 'KFC', NActividad: '1.0079', RespInter:'gfhgfdh', Fecha:'dgashh',Hora:'dsga', Riesgo:'dfsg' },
  {position: 12, NProveedor: 'KFC', NActividad: '1.0079', RespInter:'gfhgfdh', Fecha:'dgashh',Hora:'dsga', Riesgo:'dfsg' },{position: 13, NProveedor: 'KFC', NActividad: '1.0079', RespInter:'gfhgfdh', Fecha:'dgashh',Hora:'dsga', Riesgo:'dfsg' },{position: 14, NProveedor: 'KFC', NActividad: '1.0079', RespInter:'gfhgfdh', Fecha:'dgashh',Hora:'dsga', Riesgo:'dfsg' },{position: 15, NProveedor: 'KFC', NActividad: '1.0079', RespInter:'gfhgfdh', Fecha:'dgashh',Hora:'dsga', Riesgo:'dfsg' },{position: 16, NProveedor: 'KFC', NActividad: '1.0079', RespInter:'gfhgfdh', Fecha:'dgashh',Hora:'dsga', Riesgo:'dfsg' },{position: 17, NProveedor: 'KFC', NActividad: '1.0079', RespInter:'gfhgfdh', Fecha:'dgashh',Hora:'dsga', Riesgo:'dfsg' },{position: 18, NProveedor: 'KFC', NActividad: '1.0079', RespInter:'gfhgfdh', Fecha:'dgashh',Hora:'dsga', Riesgo:'dfsg' },{position: 19, NProveedor: 'KFC', NActividad: '1.0079', RespInter:'gfhgfdh', Fecha:'dgashh',Hora:'dsga', Riesgo:'dfsg' },
  {position: 20, NProveedor: 'KFC', NActividad: '1.0079', RespInter:'gfhgfdh', Fecha:'dgashh',Hora:'dsga', Riesgo:'dfsg' },
];


@Component({
  selector: 'app-permiso-registrado',
  templateUrl: './permiso-registrado.component.html',
  styleUrls: ['./permiso-registrado.component.css']
})

export class PermisoRegistradoComponent {
  displayedColumns: string[] = ['position', 'NProveedor', 'NActividad', 'RespInter', 'Fecha', 'Hora', 'Riesgo'];
  dataSource = new _MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor (){
     
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
