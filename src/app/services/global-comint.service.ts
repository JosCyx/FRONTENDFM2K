import { Injectable } from '@angular/core';
import { SolicitudEvento } from '../comint/models/SolEvent';
import { DepartamentosService } from './comunicationAPI/seguridad/departamentos.service';
import { EmpleadosService } from './comunicationAPI/seguridad/empleados.service';
import { AlertEvent } from '../comint/models/AlertEvent';

@Injectable({
  providedIn: 'root'
})
export class GlobalComintService {

  solEventId: number | undefined = 0;//guarda el id de la solicitud de la que se va a generar el anuncio

  editMode: boolean = false;
  makeAlert: boolean = false;
  depList: any[] = [];
  empList: any[] = [];

  alertInfo: {titulo: string, lugar: string, fecha:Date, hora: string} = {
    titulo: '',
    lugar: '',
    fecha: new Date(),
    hora: ''
   };

  alertFromSol: boolean = false;

   //almacena el evento registrado als er seleccionado desde la pantalla de visualizacion
   alertEvent: AlertEvent = {
    altEvTipoAlerta: 0,
    altEvTituloAlerta: '',
    altEvImagenAlerta: '',
    altEvLugar: '',
    altEvEstado: 1,
    altEvEstadoEvento: 1,
    altEvFechaEvento: '',
    altEvHoraEvento: '00:00',
    altEvProgramacion: [],
    idImage: 0
   }

   //almacena la solicitud del evento al ser seleccionada desde la pantalla de visualizacion
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

  constructor(
    private departamentService: DepartamentosService,
    private empleadoService: EmpleadosService,
  ) { 
    setTimeout(() => {
      
      this.departamentService.getDepartamentos().subscribe(
        data => {
          this.depList = data;
        },
        error => {
          console.log("Error al consultar los departamentos:", error);
        }
      );
      this.empleadoService.getEmpleadosList().subscribe(
        data => {
          this.empList = data;
        },
        error => {
          console.log("Error al consultar los empleados:", error);
        }
      );
    }, 200);
    
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
      solEvEstadoEvento: 1,
      solEvEstado: 1,
      solEvEstadoEnvio: 5
    }

  }

  clearAlert(){
    this.alertEvent = {
      altEvTipoAlerta: 0,
      altEvTituloAlerta: '',
      altEvImagenAlerta: '',
      altEvLugar: '',
      altEvEstado: 1,
      altEvEstadoEvento: 1,
      altEvFechaEvento: '',
      altEvHoraEvento: '00:00',
      altEvProgramacion: []
    }
  }

  clearAlertInfo(){
    this.alertInfo = {
      titulo: '',
      lugar: '',
      fecha: new Date(),
      hora: ''
    }
  }
}
