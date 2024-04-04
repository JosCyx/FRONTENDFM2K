import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuxComintService } from 'src/app/services/comunicationAPI/comint/aux-comint.service';
import { SolEventService } from 'src/app/services/comunicationAPI/comint/sol-event.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { SolicitudEvento } from 'src/app/comint/models/SolEvent';

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
    solEvEstado: 1
  }

  actTypeList: any[] = [];
  fechainicio!: Date;
  fechafin!: Date;

  nameSolicitante: string = this.cookieService.get('userName');
  departamento: string = '';

  constructor(
    private cookieService: CookieService,
    private auxService: AuxComintService,
    private solEventService: SolEventService,
    private dialogService: DialogServiceService
  ) { }

  ngOnInit(): void {
    this.departamento = this.cookieService.get('usNameDep');
    this.solEvent.solEvIdSolicitante = this.cookieService.get('userIdNomina');
    this.solEvent.solEvIdAreaSolicitante = Number(this.cookieService.get('userArea'));
    this.solEvent.solEvDepSolicitante = Number(this.cookieService.get('userDep'));

    this.loadData();
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

  callMensaje(mensaje: string, type: boolean) {
    this.dialogService.openAlertDialog(mensaje, type);
  }

  sendSolEvent() {
    this.solEvent.solEvFechaInicio = this.fechainicio.toISOString().split('T')[0];
    this.solEvent.solEvFechaFin = this.fechafin.toISOString().split('T')[0];
    console.log("Solicitud:", this.solEvent);

    this.solEventService.addSolEvent(this.solEvent).subscribe(
      data => {
        console.log("Solicitud enviada:", data);
        this.callMensaje('Solicitud enviada correctamente', true);
        this.clearSolicitud();
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
      solEvEstado: 0
    }

    this.fechainicio = this.fechainicio!;
    this.fechafin = this.fechafin!;
  }


}

