import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuxComintService } from 'src/app/services/comunicationAPI/comint/aux-comint.service';
import { SolEventService } from 'src/app/services/comunicationAPI/comint/sol-event.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { SolicitudEvento } from 'src/app/comint/models/SolEvent';
import { GlobalComintService } from 'src/app/services/global-comint.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { DepartamentosService } from 'src/app/services/comunicationAPI/seguridad/departamentos.service';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { SignalRService } from 'src/app/services/comunicationAPI/comint/signal-r.service';

@Component({
  selector: 'app-solicitud-evento',
  templateUrl: './solicitud-evento.component.html',
  styleUrls: ['./solicitud-evento.component.css']
})
export class SolicitudEventoComponent {
  solEvent: SolicitudEvento = {
    solEvIdSolicitante: '',
    solEvIdAreaSolicitante: 0,
    solEvDepSolicitante: 0,
    solEvIdTipoAct: 0,
    solEvFechaInicio: '',
    solEvFechaFin: '',
    solEvAsuntoEvento: '',
    solEvDetalleEvento: '',
    solEvHoraInicio: '00:00',
    solEvHoraFin: '00:00',
    solEvLugarEvento: '',
    solEvEstadoEvento: 1,
    solEvEstado: 1,
    solEvEstadoEnvio: 5
  }

  actTypeList: any[] = [];
  empList: any[] = [];
  fechainicio!: Date;
  fechaInicioStr: string = '';
  fechafin!: Date;
  fechaFinStr: string = '';

  nameSolicitante: string = this.cookieService.get('userName');
  departamento: string = '';


  constructor(
    private cookieService: CookieService,
    private auxService: AuxComintService,
    private solEventService: SolEventService,
    private dialogService: DialogServiceService,
    public globalComintService: GlobalComintService,
    private empleadoService: EmpleadosService,
    private router: Router,
    private signalRServicee: SignalRService
  ) { }

  ngOnInit(): void {

      if(this.globalComintService.editMode){
        this.solEvent = _.cloneDeep(this.globalComintService.solEvent);
        this.fechainicio = new Date(this.solEvent.solEvFechaInicio);
        this.fechaInicioStr = new Date(this.solEvent.solEvFechaInicio).toISOString().split('T')[0];
        this.fechafin = new Date(this.solEvent.solEvFechaFin);
        this.fechaFinStr = new Date(this.solEvent.solEvFechaFin).toISOString().split('T')[0];

      } else {
        console.log("No hay solicitud en edición");
        this.departamento = this.cookieService.get('usNameDep');
        this.solEvent.solEvIdSolicitante = this.cookieService.get('userIdNomina');
        this.solEvent.solEvIdAreaSolicitante = Number(this.cookieService.get('userArea'));
        this.solEvent.solEvDepSolicitante = Number(this.cookieService.get('userDep'));
      }
      
      this.loadData();
  }

  ngOnDestroy(){
    this.clearSolicitud();
  }

  loadData() {
    this.auxService.getActivityTypes().subscribe(
      data => {
        this.actTypeList = data;
      },
      error => {
        console.log("Error al consultar las actividades:", error);
      }
    );
  }

  getActividadName(idAct: number) {
      const tipo = this.actTypeList.find(tipo => tipo.typeActId == idAct);
      return tipo ? tipo.typeActDescripcion : 'Tipo de actividad desconocida';
  }

  getDepartamentName(idDep: number) {
    const dep = this.globalComintService.depList.find(dep => dep.depIdNomina == idDep);
    return dep ? dep.depDescp : 'Departamento desconocido';
  }

  getEmpleadoName(idNomina: string) {
    const empleado = this.empList.find(emp => emp.empleadoIdNomina === idNomina);
    return (empleado.empleadoNombres + ' ' + empleado.empleadoApellidos).trim(); 
  }

  callMensaje(mensaje: string, type: boolean) {
    this.dialogService.openAlertDialog(mensaje, type);
  }

  sendSolEvent() {
    this.solEvent.solEvFechaInicio = this.fechainicio.toISOString().split('T')[0];
    this.solEvent.solEvFechaFin = this.fechafin.toISOString().split('T')[0];
    //console.log("Solicitud:", this.solEvent);

    const data = {
      solEvIdSolicitante: this.solEvent.solEvIdSolicitante,
      solEvIdAreaSolicitante: this.solEvent.solEvIdAreaSolicitante,
      solEvDepSolicitante: this.solEvent.solEvDepSolicitante,
      solEvIdTipoAct: this.solEvent.solEvIdTipoAct,
      solEvFechaInicio: this.solEvent.solEvFechaInicio,
      solEvFechaFin: this.solEvent.solEvFechaFin,
      solEvAsuntoEvento: this.solEvent.solEvAsuntoEvento,
      solEvDetalleEvento: this.solEvent.solEvDetalleEvento,
      solEvHoraInicio: this.solEvent.solEvHoraInicio,
      solEvHoraFin: this.solEvent.solEvHoraFin,
      solEvLugarEvento: this.solEvent.solEvLugarEvento,
      solEvEstado: 1,
      solEvEstadoEnvio: 5
    }

    //console.log("Data:", data);

    this.solEventService.addSolEvent(data).subscribe(
      data => {
        console.log("Solicitud enviada:", data);
        this.callMensaje('Solicitud enviada correctamente', true);
        this.clearSolicitud();
        this.router.navigate(['solevlist']);
      },
      error => {
        this.callMensaje('Error al enviar la solicitud', false);
        console.log("Error al enviar la solicitud:", error);
      }
    );
  }

  clearSolicitud() {
    this.solEvent = {
      solEvIdSolicitante: '',
      solEvIdAreaSolicitante: 0,
      solEvDepSolicitante: 0,
      solEvIdTipoAct: 0,
      solEvFechaInicio: '',
      solEvFechaFin: '',
      solEvAsuntoEvento: '',
      solEvDetalleEvento: '',
      solEvHoraInicio: '00:00',
      solEvHoraFin: '00:00',
      solEvLugarEvento: '',
      solEvEstadoEvento: 0,
      solEvEstado: 0,
      solEvEstadoEnvio: 5
    }

    this.fechainicio = this.fechainicio!;
    this.fechafin = this.fechafin!;

    this.globalComintService.editMode = false;
    this.globalComintService.clearSolicitud();
    
  }

  clearAndRedirect(){
    this.clearSolicitud();
    this.router.navigate(['solevlist']);
  }

  generateAd(){
    this.globalComintService.alertFromSol = true;//indica si se esta creando una alerta desde una solicitud
    this.globalComintService.solEventId = this.solEvent.solEvId;
    console.log("ID SOLICITUD: ", this.solEvent.solEvId);
    this.globalComintService.makeAlert = true;
    this.globalComintService.alertInfo.titulo = this.solEvent.solEvAsuntoEvento;
    this.globalComintService.alertInfo.lugar = this.solEvent.solEvLugarEvento;
    this.globalComintService.alertInfo.fecha = this.fechainicio;
    this.globalComintService.alertInfo.hora = this.solEvent.solEvHoraInicio;

    this.router.navigate(['alertev']);
  }

  /////////////////////CARGA DE NOMBRES//////////////////////////////


}

