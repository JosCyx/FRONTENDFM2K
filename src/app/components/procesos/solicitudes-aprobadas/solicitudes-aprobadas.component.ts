import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';

//Services
import { TipoSolService } from 'src/app/services/comunicationAPI/solicitudes/tipo-sol.service';
import { CabCotizacionService } from 'src/app/services/comunicationAPI/solicitudes/cab-cotizacion.service';
import { AreasService } from 'src/app/services/comunicationAPI/seguridad/areas.service';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { NivelRuteoService } from 'src/app/services/comunicationAPI/seguridad/nivel-ruteo.service';
import { CabOrdCompraService } from 'src/app/services/comunicationAPI/solicitudes/cab-ord-compra.service';
import { CabPagoService } from 'src/app/services/comunicationAPI/solicitudes/cab-pago.service';
import { co } from '@fullcalendar/core/internal-common';
import { CookieService } from 'ngx-cookie-service';

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

  metodoBusq!: number;
  currentPage: number = 1;


  constructor(
    private router: Router,
    private tipoSolService: TipoSolService,
    private cabCotService: CabCotizacionService,
    private areaService: AreasService,
    private empService: EmpleadosService,
    private nivRuteoService: NivelRuteoService,
    private cabOCService: CabOrdCompraService,
    private cabPagoService: CabPagoService,
    private cookieService: CookieService
  ) { }

  //evalua que solicitudes se deben mostrar segun los niveles de los roles de usuario
  chooseSearchMethod() {
    //obtiene el nivel maximo que posee el usuario para visualizar las solicitudes
    let listaRoles = this.cookieService.get('userRolNiveles').split(',').map(Number);
    var maxNivel = Math.max(...listaRoles);
    
    if (maxNivel == 10) {
      this.metodoBusq = 1;
    } else if (maxNivel >= 20 && maxNivel <= 40) {
      this.metodoBusq = 2;
    } else if ((maxNivel >= 50 && maxNivel <= 70) || maxNivel == 70) {
      this.metodoBusq = 3;
    }
  }

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

    this.chooseSearchMethod();
  }
  //Paginacion 
  nextPage(): void {
    console.log("nextPage",this.currentPage);
    if(  this.allSol.length/10 <=10 ){
      console.log("nextPage",this.currentPage," ",this.allSol.length/10,"",this.allSol);
      this.currentPage=1;
    }else if(this.currentPage >= this.allSol.length/10){
      this.currentPage=this.currentPage;
    }else{
      this.currentPage++
    }
  }
  //decrementa el valor de la variable que controla la pagina actual que se muestra
  prevPage(): void {
    if (this.currentPage > 1) {
      console.log("prevPage",this.currentPage);
      this.currentPage--; // Disminuir currentPage en uno si no está en la primera página
    }
  }

  //Consultar solicitudes
  consultarSolicitudes(): void {
    this.btp = this.AbierTipoSol;
    this.currentPage = 1;
    if (this.AbierTipoSol == 1) {
      this.cabCotService.getEstadoCotizacion(this.Allstate).subscribe({
        next: (data) => {
          //console.log('COTIZACIONES', data);
          this.filterCotbyRol(data);
          //this.allSol = data;
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
          //console.log('ORDENES DE COMPRA', data);
          this.filterOCbyRol(data);
          //this.allSol = data;
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
          //console.log('PAGOS', data);
          this.filterPagobyRol(data);
          //this.allSol = data;
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
  filterCotbyRol(data: any): void {
    console.log('metodo de busqueda: ', this.metodoBusq);
    if(this.metodoBusq == 1){
      
      this.allSol = data.filter((sol: any) => sol.cabSolCotIdEmisor == parseInt(this.cookieService.get('userIdNomina')));
      
    } else if(this.metodoBusq == 2){
      
      this.allSol = data.filter((sol: any) => sol.cabSolCotArea == parseInt(this.cookieService.get('userArea')));
    } else if(this.metodoBusq == 3){
      
      this.allSol = data;
    }
  }
  //
  filterOCbyRol(data: any): void {
    if(this.metodoBusq == 1){
      this.allSol = data.filter((sol: any) => sol.cabSolOCIdEmisor == parseInt(this.cookieService.get('userIdNomina')));
    } else if(this.metodoBusq == 2){
      this.allSol = data.filter((sol: any) => sol.cabSolOCArea == parseInt(this.cookieService.get('userArea')));
    } else if(this.metodoBusq == 3){
      this.allSol = data;
    }
  }
  //
  filterPagobyRol(data: any): void {
    if(this.metodoBusq == 1){
      this.allSol = data.filter((sol: any) => sol.cabPagoAreaSolicitante == parseInt(this.cookieService.get('userIdNomina')));
    } else if(this.metodoBusq == 2){
      this.allSol = data.filter((sol: any) => sol.cabPagoIdEmisor == parseInt(this.cookieService.get('userArea')));
    } else if(this.metodoBusq == 3){
      this.allSol = data;
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
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);
    //Obtener el rango de las celda
    console.log('sw ref', ws['!ref']);
    const ref: any = ws['!ref']; // Almacenar el valor en una variable
    console.log('ref', ref);
    const range = XLSX.utils.decode_range(ref);
    ws['!autofilter'] = {
      ref: XLSX.utils.encode_range(range),
    };

    ws['!cols'] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];
    //formato a las celdas a la primera fila
    for (let row = range.s.r; row <= range.e.r; ++row) {
      const rowAddress = XLSX.utils.encode_row(row);
      console.log('rowAddress', rowAddress);
      for (let col = range.s.r; col <= range.e.c; ++col) {
        const colAddress = XLSX.utils.encode_col(col);
        const cellAddress = colAddress + rowAddress;
        //
        if (row === range.s.r + 0) {
          ws[cellAddress].s = { fill: { fgColor: { rgb: '4f81bd' } }, font: { bold: true } };
        } else {
          // Para las filas restantes, aplica otro color
          ws[cellAddress].s = { fill: { fgColor: { rgb: 'dce6f1' } } };
        }
      }
      const cellA = 'A' + rowAddress;
      const cellB = 'B' + rowAddress;
    }
    // ws['A1'].s = { fill: { fgColor: { rgb: '4f81bd' } } };
    // ws['B2'].s = { fill: { fgColor: { rgb: '4f81bd' } } };
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.GenerarNombre() + '.xlsx');
  }
}
