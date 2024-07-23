import { Component, ViewChild } from '@angular/core';
import { SolEventService } from 'src/app/services/comunicationAPI/comint/sol-event.service';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { MatPaginator } from '@angular/material/paginator';
import { SolicitudEvento } from 'src/app/comint/models/SolEvent';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { AuxComintService } from 'src/app/services/comunicationAPI/comint/aux-comint.service';
import { AreasService } from 'src/app/services/comunicationAPI/seguridad/areas.service';
import { DepartamentosService } from 'src/app/services/comunicationAPI/seguridad/departamentos.service';
import { GlobalComintService } from 'src/app/services/global-comint.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitud-evento-list',
  templateUrl: './solicitud-evento-list.component.html',
  styleUrls: ['./solicitud-evento-list.component.css']
})
export class SolicitudEventoListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource: any = [];
  solEventList: SolicitudEvento[] = [];

  displayedColumns: string[] = ['emp','asunto', 'tipo', 'lugar', 'fechainicio', 'fechafin', 'estadoenvio'];

  empleadosList: any[] = [];
  tipoActList: any[] = [];
  areaList: any[] = [];
  depList: any[] = [];
  estadoList: any[] = [];
  estadoAlertList: any[] = [];
  originalData: any[] = [];


  constructor(
    private solEventService: SolEventService,
    private empService: EmpleadosService,
    private auxService: AuxComintService,
    private areaService: AreasService,
    private depService: DepartamentosService,
    private globalComintService: GlobalComintService,
    private router: Router
  ) { }

  ngOnInit() {
    //consultar los datos al cargar el componente
    setTimeout(() => {
      this.empService.getEmpleadosList().subscribe(
        (res) => {
          this.empleadosList = _.cloneDeep(res);
        },
        (error) => {
          console.error(error);
        }
      );

      this.auxService.getActivityTypes().subscribe(
        (res) => {
          this.tipoActList = _.cloneDeep(res);
        },
        (error) => {
          console.error(error);
        }
      );

      this.auxService.getEventStatus().subscribe(
        (res) => {
          this.estadoList = _.cloneDeep(res);
        },
        (error) => {
          console.error(error);
        }
      );

      this.areaService.getAreaList().subscribe(
        (res) => {
          this.areaList = _.cloneDeep(res);
        },
        (error) => {
          console.error(error);
        }
      );

      this.depService.getDepartamentos().subscribe(
        (res) => {
          this.depList = _.cloneDeep(res);
        },
        (error) => {
          console.error(error);
        }
      );

      this.auxService.getEventStatus().subscribe(
        (res: any[]) => {
          //console.log("Estados de alertas obtenidos: ", res);
          this.estadoAlertList = _.cloneDeep(res);
        },
        (error) => {
          console.error(error);
        }
      );
      
    }, 200);

    //consultar las solicitudes de evento y crear el MatTableDataSource
    setTimeout(() => {

      this.solEventService.getSolEvent().subscribe(
        (res: SolicitudEvento[]) => {
          //console.log("Solicitudes de evento obtenidas: ", res);
          this.originalData = _.cloneDeep(res);
          this.solEventList = _.cloneDeep(res);
          this.dataSource = new MatTableDataSource<any>(res);
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error(error);
        }
      );
    }, 300);
  }

  /*getEstadoEvento(estadoinput: string): string {
    const estado = this.estadoList.find(est => est.estEvId === estadoinput);
    return estado ? estado.estEvNombre : 'Estado desconocido';
  }*/

  getTipoActividad(tipoinput: string): string {
    const tipo = this.tipoActList.find(tipo => tipo.typeActId === tipoinput);
    return tipo ? tipo.typeActDescripcion : 'Actividad desconocida';
  }

  getEmpleadoName(idEmp: string): string {
    const emp = this.empleadosList.find(emp => emp.empleadoIdNomina === idEmp);
    return emp ? emp.empleadoNombres + ' ' + emp.empleadoApellidos : 'Empleado desconocido';
  }

  getFecha(fecha: string): string {
    return fecha.split('T')[0];
  }

  selectSolEvent(row: any){
    this.globalComintService.editMode = true;
    this.globalComintService.solEvent = row;
    this.globalComintService.solEvent.empleadoName = this.getEmpleadoName(row.solEvIdSolicitante);
    //console.log("Solicitud seleccionada:", this.globalComintService.solEvent);

    this.router.navigate(['solev']);
    
  }

  getEstadoAlertaName(idEstado: number){
    let estado = this.estadoAlertList.find((est) => est.estEvId === idEstado);
    return estado?.estEvDescripcion;
  }

  ////////////////////FILTROS////////////////////////
  filterType: number = 0;
  //almacena el valor del filtro cuando se selecciona una cadena
  filterStrContent: string = "";
  //almacena el valor del filtro cuando se selecciona una opcion de las listas
  filterTypeContent: number = 0;
  handleFilter: boolean = false;


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

  applyFilter(): void {
    if (this.filterType === 1) {
      this.dataSource.data = this.originalData.filter(item =>
        item.solEvAsuntoEvento.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
    } else if (this.filterType === 2) {
      this.dataSource.data = this.originalData.filter(item =>
        item.solEvIdTipoAct == this.filterTypeContent
      );
    } else if (this.filterType === 3) {
      this.dataSource.data = this.originalData.filter(item =>
        item.solEvLugarEvento.toLowerCase().includes(this.filterStrContent.toLowerCase())
      );
    } else if (this.filterType === 4) {
      this.dataSource.data = this.originalData.filter(item =>
        item.solEvEstadoEnvio == this.filterTypeContent
      );
    }
  }

  sortByAsunto(type: number) {
    //si es 1 ordena de forma ascendente
    if (type == 1) {
      this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => (a.solEvAsuntoEvento.toLowerCase() > b.solEvAsuntoEvento.toLowerCase()) ? 1 : -1);
    } else {
      this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => (a.solEvAsuntoEvento.toLowerCase() < b.solEvAsuntoEvento.toLowerCase()) ? 1 : -1);
    }
  }
}
