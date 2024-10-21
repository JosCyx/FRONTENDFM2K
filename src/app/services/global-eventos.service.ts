import { Injectable } from '@angular/core';
import { FichaEventoService } from './comunicationAPI/eventos/ficha-evento.service';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GlobalEventosService {

  idFichaSelected: number = 0;

  editMode: boolean = false;

  FormEv: any = {

    fEvId: 0,
    fEvFechaEmision: "",
    fEvSolicitante: "",
    fEvArea: 0,
    fEvSector: 0,
    fEvNombreProyecto: "",
    fEvReferencia: "",
    fEvObjetivoProyecto: "",
    fEvAlcanceProyecto: "",
    fEvDetalleProdFinal: "",
    fEvFechaInicio: "",
    fEvFechaFin: "",
    fEvEstadoProyecto: 0,
    fEvPorcentajeTotal: 0,
    fEvPorcentajeNuevos: 0,
    fEvEstadoActivo: 0
  }

  riesgos: any[] = [];
  req: any[] = [];
  fichaDocs: any[] = [];
  reqDocs: any[] = [];

  observContent: string = '';
  isReqComplete: boolean = false;

  
  constructor(
    private fichaEvService: FichaEventoService
  ) {
    console.log("GlobalEventosService constructor iniciado");
   }

  formatDateToSpanish(date: Date): string {
    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
      "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayOfWeek}, ${dayOfMonth} de ${month} de ${year}`;
  }

  formatDateToYYYYMMDD(date: Date | undefined): string {

    if (!date) {
      return '';
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getFichaEvento(){
    this.fichaEvService.getFichaEventoById(this.idFichaSelected).subscribe(
      (data: any) => {
        this.FormEv = data.ficha;
        this.riesgos = data.riesgos;
        this.req = data.req;
        this.editMode = true;
      },
      (error) => {
        console.log("Error al solicitar la ficha en globalService:", error);
      }
    );
  }

  clearEventoData(){
    

    this.editMode = false;

    this.FormEv = {
      fechaEmision: new Date(),
      nombreProyecto: '',
      usuarioSolicitante: '',
      usuarioEncargado: '',
      sector: 0,
      area: 0,
      referencia: '',
      objetivo: '',
      alcance: '',
      detalle: '',
      fechaInicio: new Date(),
      horaInicio: '',
      fechaFin: new Date(),
      horaFin: '',
      restricciones: '',
      indicAdicionales: '',
      inversion: undefined,
      ingresos: undefined
    };

    this.riesgos = [];
    this.req = [];
    this.fichaDocs = [];
    this.reqDocs = [];
  }
}
