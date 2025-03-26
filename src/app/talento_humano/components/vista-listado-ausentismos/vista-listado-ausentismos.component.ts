import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import { AusentismosService } from 'src/app/services/comunicationAPI/tthh/ausentismos.service';

@Component({
  selector: 'app-vista-listado-ausentismos',
  templateUrl: './vista-listado-ausentismos.component.html',
  styleUrls: ['./vista-listado-ausentismos.component.css']
})
export class VistaListadoAusentismosComponent {
  @ViewChild('MatPaginator') paginator!: MatPaginator;

    displayedColumns: string[] = ['Area', 'Departamento', 'Solicitante', 'fecha', 'Motivo', 'Estado'];
    dataSource =new MatTableDataSource<any>();
    areaSelected: number = 1;
    opSelected: string = '';
    opList: any[] = [];
    selectedFechaInicio: Date | null = null;
    selectedFechaFin: Date | null = null;
    ausentismosList: any[] = [];

     constructor(
      private cookieService: CookieService,
      private AusentismosService: AusentismosService
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
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }
  
    // Se ejecuta cada vez que cambia alguna de las fechas
    onDateChange() {
      // Verifica que ambos valores hayan sido seleccionados
      if (this.selectedFechaInicio && this.selectedFechaFin) {
        this.listarAusentismos(this.opSelected, this.selectedFechaInicio, this.selectedFechaFin);
      }
    }
    onOpChange() {
      if (this.selectedFechaInicio && this.selectedFechaFin && this.opSelected) {
        this.listarAusentismos(this.opSelected, this.selectedFechaInicio, this.selectedFechaFin);
      }
    }
    listarAusentismos(opSelected: any, fechaInicio: Date, fechaFin: Date){
      this.AusentismosService.getAusentismo(opSelected, fechaInicio, fechaFin, this.cookieService.get('userIdNomina')).subscribe(
        (data) => {
          this.ausentismosList = data;
          console.log("Ausentismo List",this.ausentismosList);
          this.dataSource.data = this.ausentismosList;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.log(error);
        }
      );
      this.dataSource.data = [];
    }


    listarOp(){
      this.AusentismosService.getOpList().subscribe(
        (exito: any) => {
          this.opList = exito;
          console.log("Area List",exito)
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
     
}
