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

@Component({
  selector: 'app-solicitud-evento-list',
  templateUrl: './solicitud-evento-list.component.html',
  styleUrls: ['./solicitud-evento-list.component.css']
})
export class SolicitudEventoListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource: any = [];
  solEventList: SolicitudEvento[] = [];

  displayedColumns: string[] = ['asunto', 'tipo', 'lugar', 'fechainicio', 'fechafin'];

  empleadosList: any[] = [];
  tipoActList: any[] = [];
  areaList: any[] = [];
  depList: any[] = [];
  estadoList: any[] = [];

  constructor(
    private solEventService: SolEventService,
    private empService: EmpleadosService,
    private auxService: AuxComintService,
    private areaService: AreasService,
    private depService: DepartamentosService
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
      
    }, 200);

    //consultar las solicitudes de evento y crear el MatTableDataSource
    setTimeout(() => {

      this.solEventService.getSolEvent().subscribe(
        (res: SolicitudEvento[]) => {
          this.solEventList = _.cloneDeep(res);;
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

  getFecha(fecha: string): string {
    return fecha.split('T')[0];
  }

  selectSolEvent(row: any){
    console.log("Solicitud seleccionada:", row);
  }
}
