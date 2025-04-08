import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { CookieService } from 'ngx-cookie-service';
import { AusentismosService } from 'src/app/services/comunicationAPI/tthh/ausentismos.service';
import { GlobalAusService } from 'src/app/services/global-aus.service';

@Component({
  selector: 'app-vista-listado-ausentismos',
  templateUrl: './vista-listado-ausentismos.component.html',
  styleUrls: ['./vista-listado-ausentismos.component.css']
})
export class VistaListadoAusentismosComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('filterInput') filterInput!: ElementRef; 

    displayedColumns: string[] = ['Codigo', 'Area', 'Departamento', 'Solicitante', 'fecha', 'Motivo', 'Estado'];
    dataSource =new MatTableDataSource<any>();
    dataSourceOriginal = new MatTableDataSource<any>();

    opSelected: number = 1;
    opList: any[] = [];
    selectedFechaInicio: Date | null = null;
    selectedFechaFin: Date | null = null;
    ausentismosList: any[] = [];

     constructor(
      private cookieService: CookieService,
      private AusentismosService: AusentismosService,
      private globalAusService: GlobalAusService,
      private router: Router
    ) { 

    }
    ngOnInit(): void {
      setTimeout(() => {
        const { fechaInicio, fechaFin } = this.calcularRangoMensual(new Date());
        this.selectedFechaInicio= this.calcularRangoMensual(new Date()).fechaInicio;
        this.selectedFechaFin= this.calcularRangoMensual(new Date()).fechaFin;
        this.listarAusentismos(this.opSelected, fechaInicio, fechaFin);
        this.listarOp();
      }, 200);
    }

    onOpChange() {
      if (this.selectedFechaInicio && this.selectedFechaFin && this.opSelected) {
        this.listarAusentismos(this.opSelected, this.selectedFechaInicio, this.selectedFechaFin);
      }
    }
    listarAusentismos(opSelected: number, fechaInicio: Date, fechaFin: Date){
      console.log("ListaAus",opSelected, fechaInicio, fechaFin);
      this.AusentismosService.getAusentismo(opSelected, /*fechaInicio, fechaFin,*/ this.cookieService.get('userIdNomina')).subscribe(
        (data) => {
          this.ausentismosList = data;
          console.log("Ausentismo List",this.ausentismosList);
          this.dataSourceOriginal.data = this.ausentismosList;
          this.dataSourceOriginal.paginator = this.paginator;
          this.dataSource.data = this.dataSourceOriginal.data;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.log(error);
        }
      );
     // this.dataSourceOriginal.data = [];
    }


    listarOp(){
      this.AusentismosService.getOpList().subscribe(
        (exito: any) => {
          this.opList = exito;
          //console.log("Op List", exito)
        },
        error => {
          console.log(error)
        }
      )
    } 

    calcularRangoMensual(fechaReferencia: Date): { fechaInicio: Date, fechaFin: Date } {
      const fechaInicio = new Date(fechaReferencia.getFullYear(), fechaReferencia.getMonth(), 1); // Primer día del mes
      const fechaFin = new Date(fechaReferencia.getFullYear(), fechaReferencia.getMonth() + 1, 0); // Último día del mes
      return { fechaInicio, fechaFin };
    }
    
    selectRow(row: any) {
      //cargar id del evento seleccionado y redirigir a la siguiente vista
      //console.log(row);
      this.globalAusService.idAusentismoSelected = row.id;
      this.globalAusService.creationMode = false;
  
      this.router.navigate(['vista-registro-ausentismo']);
    }

    //FILTROS
      //almacena el tipo de filtro seleccionado
      filterType: number = 0;
      //almacena el valor del filtro cuando se selecciona una cadena
      filterStrContent: string = "";
      //almacena el valor del filtro cuando se selecciona una opcion de las listas
      //filterTypeContent: number = 0;
    
      //variable para controlar el cambio de filtro
      handleFilter: boolean = false;
    
      //establece el tipo de filtro seleccionado, si se selecciona el mismo tipo de filtro se limpia el filtro
      setFilterType(type: number): void {
        this.filterType = type;
        if (this.handleFilter) {
          this.handleFilter = false
          this.filterType = 0;
          this.filterStrContent = "";
          this.dataSource.data = _.cloneDeep(this.dataSourceOriginal.data);
        } else {
          this.handleFilter = true;
          setTimeout(() => {
            this.filterInput.nativeElement.focus();        // Establece el foco en el input
          }, 0); 
        }
      }
    
      //aplica el filtro de cadena
      applyStrFilter(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement) {
          this.filterStrContent = inputElement.value;
          this.applyFilter();
        }
      }
    
    
      //aplica el filtro dependiendo del tipo seleccionado
      applyFilter(): void {
        if (this.filterType === 1) {
          this.dataSource.data = this.dataSourceOriginal.data.filter(item =>
            item.area.toLowerCase().includes(this.filterStrContent.toLowerCase())
          );
        }else if (this.filterType === 2) {
          this.dataSource.data = this.dataSourceOriginal.data.filter(item =>
            item.departamento.toLowerCase().includes(this.filterStrContent.toLowerCase())
          );
        } else if (this.filterType === 3) {
          this.dataSource.data = this.dataSourceOriginal.data.filter(item =>
            item.solicitante.toLowerCase().includes(this.filterStrContent.toLowerCase())
          );
        } else if (this.filterType === 4) {
          this.dataSource.data = this.dataSourceOriginal.data.filter(item =>
            item.fecha.toLowerCase().includes(this.filterStrContent.toLowerCase())
          );
        } else if (this.filterType === 5) {
          this.dataSource.data = this.dataSourceOriginal.data.filter(item =>
            item.motivo.toLowerCase().includes(this.filterStrContent.toLowerCase())
          );
        } else if (this.filterType === 6) {
          this.dataSource.data = this.dataSourceOriginal.data.filter(item =>
            item.estado.toLowerCase().includes(this.filterStrContent.toLowerCase())
          );
        } else if (this.filterType === 7) {
          this.dataSource.data = this.dataSourceOriginal.data.filter(item =>
            item.codigo.toLowerCase().includes(this.filterStrContent.toLowerCase())
          );
        }
      }
}
