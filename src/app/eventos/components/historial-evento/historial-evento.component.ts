import { Component, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx-js-style';
import { ExcelExportService } from 'src/app/services/comunicationAPI/inventario/excel-export.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { FichaEventoService } from 'src/app/services/comunicationAPI/eventos/ficha-evento.service';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { AreasService } from 'src/app/services/comunicationAPI/seguridad/areas.service';
import { SectoresService } from 'src/app/services/comunicationAPI/seguridad/sectores.service';
import { GeneralControllerService } from 'src/app/services/comunicationAPI/inventario/general-controller.service';
import { AuxEventosService } from 'src/app/services/comunicationAPI/eventos/aux-eventos.service';

@Component({
  selector: 'app-historial-evento',
  templateUrl: './historial-evento.component.html',
  styleUrls: ['./historial-evento.component.css']
})
export class HistorialEventoComponent {

  displayedColumns: string[] = ['USUARIO_SOLICITANTE', 'AREA_ADMINISTRA', 'NOMBRE_EVENTO', 'SECTOR', 'FECHA_INICIO', 'FECHA_INICIO', 'AVANCE_REQ_INICIAL', 'AVANCE_REQ_NUEVO', 'ESTADO'];
  //dataSource = new MatTableDataSource<any>();

  constructor(
    private FichaEventoService: FichaEventoService,
    private empService: EmpleadosService,
    private areaService: AreasService,
    private invGeneralService: GeneralControllerService,
    private AuxEventosService: AuxEventosService
  ) {

  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  dataSourceView: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  SolicitanteList: any[] = [];
  AreaList: any[] = [];
  SectorList: any[] = [];
  FechaList: any[] = [];
  EstadoList: any[] = [];
  estadoAlertList: any[] = [];
  numEnviosList: any[] = [];

  originalData: any[] = [];
  originalDataView: any[] = [];



  filterType: number = 0;
  //almacena el valor del filtro cuando se selecciona una cadena
  filterStrContent: string = "";
  //almacena el valor del filtro cuando se selecciona una opcion de las listas
  filterTypeContent: number = 0;

  filterDateContent!: string;
  handleFilter: boolean = false;





  ngOnInit() {
    setTimeout(() => {
      this.empService.getEmpleadosList().subscribe(
        (res: any) => {
          this.SolicitanteList = _.cloneDeep(res);
        },
        (error) => {
          console.error(error);
        }
      );

      this.areaService.getAreaList().subscribe(
        (res: any) => {
          this.AreaList = _.cloneDeep(res);
        },
        (error) => {
          console.error(error);
        }
      );

      this.invGeneralService.getSectoresList().subscribe(
        (res: any) => {
          this.SectorList = _.cloneDeep(res);
        },
        (error) => {
          console.error(error);
        }
      );

      this.FichaEventoService.getFechaInicioList().subscribe(
        (res: any) => {
          this.FechaList = _.cloneDeep(res);
        },
        (error) => {
          console.error(error);
        }
      );

      this.FichaEventoService.getFechaInicioList().subscribe(
        (res: any) => {
          this.FechaList = _.cloneDeep(res);
        },
        (error) => {
          console.error(error);
        }
      );
      
      this.AuxEventosService.getEstadoFichaList().subscribe(
        (res: any) => {
          this.EstadoList = _.cloneDeep(res);
        },
        (error) => {
          console.error(error);
        }
      );
    }, 200);

    setTimeout(() => {

      this.FichaEventoService.getFichaEventoList().subscribe(
        (res: any) => {
          console.log("Alertas obtenidas: ", res);
          //this.alertEventList = _.cloneDeep(res);
          this.originalData = _.cloneDeep(res);

          this.dataSource = new MatTableDataSource<any>(res);
          //this.dataSource.paginator = this.paginator1;

        },
        (error) => {
          console.error(error);
        }
      );
    }, 300);
  }







  //establece el tipo de filtro seleccionado
  setFilterType(type: number): void {
    this.filterType = type;
    if (this.handleFilter) {
      this.handleFilter = false
      this.filterType = 0;
      this.filterStrContent = "";
      this.dataSource.data = _.cloneDeep(this.originalData);
    } else {
      this.handleFilter = true;
    }
  }




  getSolicitanteName(idSolicitante: string) {
    let sol = this.SolicitanteList.find((solicitante) => solicitante.empleadoIdNomina == idSolicitante);
    return sol ? sol.empleadoNombres + ' ' + sol.empleadoApellidos : 'Sin solicitante';
  }

  getArea(idArea: number) {
    let area = this.AreaList.find((area) => area.areaIdNomina == idArea);
    return area ? area.areaDecp: 'Sin Area';
  }

  getSector(idSector: number) {
    let sector = this.SectorList.find((sector) => sector.sectId == idSector);
    return sector ? sector.sectNombre: 'Sin Sector';
  }

  getEstado(idEstado: number) {
    let estado = this.EstadoList.find((estado) => estado.estPrId == idEstado);
    return estado ? estado.estPrDescripcion: 'Sin Estado';
  }


  sortByEvento(type: number) {
    //si es 1 ordena de forma ascendente
    if (type == 1) {
      this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => (a.fEvNombreProyecto.toLowerCase() > b.fEvNombreProyecto.toLowerCase()) ? 1 : -1);
      this.dataSourceView.data = this.dataSourceView.data.sort((a: any, b: any) => (a.fEvNombreProyecto.toLowerCase() > b.fEvNombreProyecto.toLowerCase()) ? 1 : -1);
    } else {
      this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => (a.fEvNombreProyecto.toLowerCase() < b.fEvNombreProyecto.toLowerCase()) ? 1 : -1);
      this.dataSourceView.data = this.dataSourceView.data.sort((a: any, b: any) => (a.fEvNombreProyecto.toLowerCase() < b.fEvNombreProyecto.toLowerCase()) ? 1 : -1);
    }
  }
  



  applyFilter(): void {
    if (this.filterType === 1) {
      this.dataSource.data = this.originalData.filter(item =>
        item.fEvArea == this.filterTypeContent
      );
      this.dataSourceView.data = this.originalDataView.filter(item =>
        item.fEvArea == this.filterTypeContent
      );
    } else if (this.filterType === 2) {
      this.dataSource.data = this.originalData.filter(item =>
        item.fEvNombreProyecto.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
      this.dataSourceView.data = this.originalDataView.filter(item =>
        item.fEvNombreProyecto.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
    } else if (this.filterType === 3) {
      this.dataSource.data = this.originalData.filter(item =>
        item.fEvSector == this.filterTypeContent
      );
      this.dataSourceView.data = this.originalDataView.filter(item =>
        item.fEvSector == this.filterTypeContent
      );
    } else if (this.filterType === 4) {
      this.dataSource.data = this.originalData.filter(item =>
        item.fEvFechaInicio == this.filterDateContent
      );
      this.dataSourceView.data = this.originalDataView.filter(item =>
        item.fEvFechaInicio == this.filterDateContent
      );
    } else if (this.filterType === 5) {
      this.dataSource.data = this.originalData.filter(item =>
        item.fEvFechaFin == this.filterDateContent
      );
      this.dataSourceView.data = this.originalDataView.filter(item =>
        item.fEvFechaFin == this.filterDateContent
      );
    } else if (this.filterType === 6) {
      this.dataSource.data = this.originalData.filter(item =>
        item.fEvEstadoProyecto == this.filterTypeContent
      );
      this.dataSourceView.data = this.originalDataView.filter(item =>
        item.fEvEstadoProyecto == this.filterTypeContent
      );
    }

  }



  //extrae el valor del filtro de las listas
  applyListFilter(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
      this.filterTypeContent = Number(selectElement.value);
      this.applyFilter();
    }
  }

  applyStrFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.filterStrContent = inputElement.value;
      this.applyFilter();
    }
  }

  applyDateFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.filterDateContent = new Date(inputElement.value).toLocaleString();
      console.log("Fecha seleccionada: ", this.filterDateContent);
      this.applyFilter();
    }
  }
}
