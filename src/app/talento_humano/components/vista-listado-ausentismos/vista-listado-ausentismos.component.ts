import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AusentismosService } from 'src/app/services/comunicationAPI/tthh/ausentismos.service';
import { GlobalAusService } from 'src/app/services/global-aus.service';

@Component({
  selector: 'app-vista-listado-ausentismos',
  templateUrl: './vista-listado-ausentismos.component.html',
  styleUrls: ['./vista-listado-ausentismos.component.css']
})
export class VistaListadoAusentismosComponent {
  @ViewChild('MatPaginator') paginator!: MatPaginator;

    displayedColumns: string[] = ['Area', 'Departamento', 'Solicitante', 'fecha', 'Motivo', 'Estado'];
    dataSource =new MatTableDataSource<any>();
    areaSelected: number = 0;
    areaList: any[] = [];
    selectedFechaInicio: Date | null = null;
    selectedFechaFin: Date | null = null;
    ausentismosList: any[] = [];

     constructor(
      //public globalAusService: GlobalAusService,
      private cookieService: CookieService,
      private AusentismosService: AusentismosService,
      private globalAusService: GlobalAusService,
      private router: Router
    ) { 
      //this.confirmSubscription = this.globalAusService.
      //confirmObserv.subscribe()
    }
    ngOnInit(): void {
      setTimeout(() => {
        const { fechaInicio, fechaFin } = this.calcularRangoMensual(new Date());
        this.selectedFechaInicio= this.calcularRangoMensual(new Date()).fechaInicio;
        this.selectedFechaFin= this.calcularRangoMensual(new Date()).fechaFin;
        this.listarAusentismos(fechaInicio, fechaFin);
        this.consultarArea(this.areaSelected, fechaInicio, fechaFin);
        //this.tipoArea$ = this.AusentismosService.getTipoArea();
      }, 200);
    }
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }
  
    // Se ejecuta cada vez que cambia alguna de las fechas
    onDateChange() {
      // Verifica que ambos valores hayan sido seleccionados
      if (this.selectedFechaInicio && this.selectedFechaFin) {
        this.listarAusentismos(this.selectedFechaInicio, this.selectedFechaFin);
      }else if (this.selectedFechaInicio && this.selectedFechaFin &&  this.areaSelected){
        this.consultarArea(this.areaSelected, this.selectedFechaInicio, this.selectedFechaFin);
      }
    }

    listarAusentismos(fechaInicio: Date, fechaFin: Date){
      this.AusentismosService.getAusSolicitante(this.cookieService.get('userIdNomina'), fechaInicio, fechaFin).subscribe(
        (data) => {
          this.ausentismosList = data;
          console.log(this.ausentismosList);
          this.dataSource.data = this.ausentismosList;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.log(error);
        }
      );
      this.dataSource.data = [];
    }

    consultarArea(areaSelected:number,fechaInicio: Date, fechaFin: Date ){
      console.log(areaSelected);
      this.AusentismosService.getAusbyArea(areaSelected, fechaInicio, fechaFin).subscribe(
        (data) => {
          this.ausentismosList = data;
          console.log("area",this.areaList);
          this.dataSource.data = this.areaList;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.log(error);
        }
      );
      this.dataSource.data = [];
    }

    calcularRangoMensual(fechaReferencia: Date): { fechaInicio: Date, fechaFin: Date } {
      const fechaInicio = new Date(fechaReferencia.getFullYear(), fechaReferencia.getMonth(), 1); // Primer día del mes
      const fechaFin = new Date(fechaReferencia.getFullYear(), fechaReferencia.getMonth() + 1, 0); // Último día del mes
      return { fechaInicio, fechaFin };
    }
    
    selectRow(row: any) {
      //cargar id del evento seleccionado y redirigir a la siguiente vista
      this.globalAusService.idAusentismoSelected = row.id;
      this.globalAusService.creationMode = false;
  
      this.router.navigate(['vista-registro-ausentismo']);
      
      
  
    }
}
