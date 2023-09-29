import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
// import * as ExcelJS from 'exceljs';

//Services
import { TipoSolService } from 'src/app/services/comunicationAPI/solicitudes/tipo-sol.service';
import { CabCotizacionService } from 'src/app/services/comunicationAPI/solicitudes/cab-cotizacion.service';
import { AreasService } from 'src/app/services/comunicationAPI/seguridad/areas.service';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { NivelRuteoService } from 'src/app/services/comunicationAPI/seguridad/nivel-ruteo.service';
import { CabOrdCompraService } from 'src/app/services/comunicationAPI/solicitudes/cab-ord-compra.service';
import { CabPagoService } from 'src/app/services/comunicationAPI/solicitudes/cab-pago.service';
import { co } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-solicitudes-aprobadas',
  templateUrl: './solicitudes-aprobadas.component.html',
  styleUrls: ['./solicitudes-aprobadas.component.css'],
})
export class SolicitudesAprobadasComponent implements OnInit {
  //Variables para mostrar las solicitudes
  AbierTipoSol: number = 0;
  Allstate: string = '';
  //Observable de tipo de solicitud
  tipoSol: any[] = [];
  allSol: any[] = [];
  areaList: any[] = [];
  empleadoList: any[] = [];
  trckList: any[] = [];

  //Variables para condiciones
  isConsulta: boolean = false;
  isSolicitud: boolean = true;
  //Variables utilizar
  btp: number = 0;

  constructor(
    private router: Router,
    private tipoSolService: TipoSolService,
    private cabCotService: CabCotizacionService,
    private areaService: AreasService,
    private empService: EmpleadosService,
    private nivRuteoService: NivelRuteoService,
    private cabOCService: CabOrdCompraService,
    private cabPagoService: CabPagoService
  ) {}

  ngOnInit(): void {
    this.tipoSolService.getTipoSolicitud().subscribe((data) => {
      this.tipoSol = data;
    });
    this.areaService.getAreaList().subscribe((data) => {
      this.areaList = data;
    });
    this.empService.getEmpleadosList().subscribe((data) => {
      this.empleadoList = data;
    });
    this.nivRuteoService.getNivelruteo().subscribe((data) => {
      this.trckList = data;
    });
  }

  //Consultar solicitudes
  consultarSolicitudes(): void {
    this.btp = this.AbierTipoSol;
    console.log('dfgdfgr', this.Allstate);
    if (this.AbierTipoSol == 1) {
      this.cabCotService.getEstadoCotizacion(this.Allstate).subscribe({
        next: (data) => {
          console.log('COTIZACIONES', data);
          this.allSol = data;
          this.isConsulta = true;
        },
        error: (error) => {
          console.error('Error', error);
        },
        complete: () => {
          console.log('subscribe finalizada correctamente');
        },
      });
    } else if (this.AbierTipoSol == 2) {
      this.cabOCService.getEstadoOrdenC(this.Allstate).subscribe({
        next: (data) => {
          console.log('ORDENES DE COMPRA', data);
          this.allSol = data;
          this.isConsulta = true;
        },
        error: (error) => {
          console.error('Error', error);
        },
        complete: () => {
          console.log('subscribe finalizada correctamente');
        },
      });
    } else if (this.AbierTipoSol == 3) {
      this.cabPagoService.getEstadoPago(this.Allstate).subscribe({
        next: (data) => {
          console.log('PAGOS', data);
          this.allSol = data;
          this.isConsulta = true;
        },
        error: (error) => {
          console.error('Error', error);
        },
        complete: () => {
          console.log('subscribe finalizada correctamente');
        },
      });
    }
  }
  //
  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  //METODO RETORNE EL NOMBRE
  GenerarNombre(): string {
    let tipossol: string = '';
    let estado: string = '';
    let fecha: string = this.formatDateToYYYYMMDD(new Date());
    if (this.AbierTipoSol == 1) {
      tipossol = 'COT';
      if (this.Allstate == 'A') {
        estado = 'ACTIVO';
      } else if (this.Allstate == 'C') {
        estado = 'CANCELADO';
      } else if (this.Allstate == 'F') {
        estado = 'FINALIZADO';
      }
    } else if (this.AbierTipoSol == 2) {
      tipossol = 'OC';
      if (this.Allstate == 'A') {
        estado = 'ACTIVO';
      } else if (this.Allstate == 'C') {
        estado = 'CANCELADO';
      } else if (this.Allstate == 'F') {
        estado = 'FINALIZADO';
      }
    } else if (this.AbierTipoSol == 3) {
      tipossol = 'PAGO';
      if (this.Allstate == 'A') {
        estado = 'ACTIVO';
      } else if (this.Allstate == 'C') {
        estado = 'CANCELADO';
      } else if (this.Allstate == 'F') {
        estado = 'FINALIZADO';
      }
    }
    return tipossol + '_' + estado + '_' + fecha;
  }
  //Metodo para Excel
  exportexcel(): void {
    let data = document.getElementById('table-data');
    const ws : XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);
    //Obtener el rango de las celda
    const ref:any = ws['!ref']; // Almacenar el valor en una variable
    console.log('ref', ref);
  const range = XLSX.utils.decode_range(ref);
  ws['!autofilter'] = {
    ref: XLSX.utils.encode_range(range)
  };

    ws['!cols'] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];
    const wb : XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Sheet1');
    XLSX.writeFile(wb, this.GenerarNombre()+'.xlsx');
  }
}
