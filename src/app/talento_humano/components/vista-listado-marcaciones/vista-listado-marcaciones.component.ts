import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import { MarcacionesService } from 'src/app/services/comunicationAPI/tthh/marcaciones.service';

@Component({
  selector: 'app-vista-listado-marcaciones',
  templateUrl: './vista-listado-marcaciones.component.html',
  styleUrls: ['./vista-listado-marcaciones.component.css']
})
export class VistaListadoMarcacionesComponent {
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    displayedColumns: string[] = ['fecha', 'tp_marc', 'hora', 'ubicacion', 'estado', 'horas_trabajadas','tipo_jornada'];
    dataSource =new MatTableDataSource<any>();

    selectedFechaInicio: Date | null = null;
    selectedFechaFin: Date | null = null;
    marcacionesList: any[] = [];

    //private confirmSubscription: Subscription;
    
     constructor(
      //public globalAusService: GlobalAusService,
      private cookieService: CookieService,
      private marcacionesService: MarcacionesService
    ) { 
      //this.confirmSubscription = this.globalAusService.
      //confirmObserv.subscribe()
    }
    ngOnInit(): void {
      setTimeout(() => {
        const { fechaInicio, fechaFin } = this.calcularRangoMensual(new Date());
        this.selectedFechaInicio= this.calcularRangoMensual(new Date()).fechaInicio;
        this.selectedFechaFin= this.calcularRangoMensual(new Date()).fechaFin;
        this.listarMarcaciones(fechaInicio, fechaFin);
      }, 200);
    }

  
    // Se ejecuta cada vez que cambia alguna de las fechas
    onDateChange() {
      // Verifica que ambos valores hayan sido seleccionados
      if (this.selectedFechaInicio && this.selectedFechaFin) {
        this.listarMarcaciones(this.selectedFechaInicio, this.selectedFechaFin);
      }
    }
    listarMarcaciones(fechaInicio: Date, fechaFin: Date){
      this.marcacionesService.getGeneralData(this.cookieService.get('userIdNomina'), fechaInicio, fechaFin).subscribe(
        (data) => {
          this.marcacionesList = data;
          console.log(this.marcacionesList);
          this.dataSource.data = this.marcacionesList;
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
}
