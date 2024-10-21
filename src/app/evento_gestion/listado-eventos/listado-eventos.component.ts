import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FichaEventoService } from 'src/app/services/comunicationAPI/eventos/ficha-evento.service';
import { FichaGestEventoService } from 'src/app/services/comunicationAPI/gest-eventos/ficha-gest-evento.service';
import { GlobalEventosService } from 'src/app/services/global-eventos.service';
import { GlobalGestEventosService } from 'src/app/services/global-gest-eventos.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-listado-eventos',
  templateUrl: './listado-eventos.component.html',
  styleUrls: ['./listado-eventos.component.css']
})
export class ListadoEventosComponent implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('filterInput') filterInput!: ElementRef;

  dataSourceOriginal: MatTableDataSource<any> = new MatTableDataSource();
  dataSourceEv: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['nombre', 'lugar', 'cliente', 'tp_contrato', 'estado'];

  constructor(
    private evGestservice: FichaGestEventoService,
    private globalEvService: GlobalGestEventosService,
    private router: Router
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.evGestservice.getFichaGestEventoList().subscribe(
        (data: any) => {
          this.dataSourceEv.data = _.cloneDeep(data);
          this.dataSourceOriginal.data = _.cloneDeep(data);
          this.dataSourceEv.paginator = this.paginator;
          //console.log(data);
        },
        (error) => {
          console.log(error);
        }
      )
    }, 300);
  }

  selectRow(row: any) {
    //cargar id del evento seleccionado y redirigir a la siguiente vista
    this.globalEvService.idEventoSelected = row.id;
    this.globalEvService.editMode = true;

    this.router.navigate(['addEventoGest']);
  }

  filterType: number = 0;
  filterStrContent: string = "";
  handleFilter: boolean = false;

  setFilterType(type: number) {
    this.filterType = type;
    if(this.handleFilter){
      this.handleFilter = false;
      this.filterType = 0;
      this.filterStrContent = "";
      this.dataSourceEv.data = _.cloneDeep(this.dataSourceOriginal.data);
    } else {
      this.handleFilter = true;
      setTimeout(() => {
        this.filterInput.nativeElement.focus();
      }, 0);
    }
  }

  applyStrFilter(event: Event){
    const inputElement = event.target as HTMLInputElement;
    if(inputElement){
      this.filterStrContent = inputElement.value;
      this.applyFilter();
    }
  }

  applyFilter(): void{
    if(this.filterType == 1){
      this.dataSourceEv.data = _.cloneDeep(this.dataSourceOriginal.data.filter((item: any) => item.nombre.toLowerCase().includes(this.filterStrContent.toLowerCase())));
    } else if(this.filterType == 2){
      this.dataSourceEv.data = _.cloneDeep(this.dataSourceOriginal.data.filter((item: any) => item.lugar.toLowerCase().includes(this.filterStrContent.toLowerCase())));
    } else if (this.filterType == 3){
      this.dataSourceEv.data = _.cloneDeep(this.dataSourceOriginal.data.filter((item: any) => item.cliente.toLowerCase().includes(this.filterStrContent.toLowerCase())));
    } else if (this.filterType == 4){
      this.dataSourceEv.data = _.cloneDeep(this.dataSourceOriginal.data.filter((item: any) => item.tp_contrato.toLowerCase().includes(this.filterStrContent.toLowerCase())));
    } else if (this.filterType == 5){
      this.dataSourceEv.data = _.cloneDeep(this.dataSourceOriginal.data.filter((item: any) => item.estado.toLowerCase().includes(this.filterStrContent.toLowerCase())));
    }
  }




}
