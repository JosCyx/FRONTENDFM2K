import { Component, ViewChild, ViewChildren, QueryList, AfterViewInit, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { GlobalEventosService } from 'src/app/services/global-eventos.service';
import * as _ from 'lodash';
import { AreasService } from 'src/app/services/comunicationAPI/seguridad/areas.service';
import { GeneralControllerService } from 'src/app/services/comunicationAPI/inventario/general-controller.service';
import { AuxEventosService } from 'src/app/services/comunicationAPI/eventos/aux-eventos.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { CookieService } from 'ngx-cookie-service';
import { FichaEventoService } from 'src/app/services/comunicationAPI/eventos/ficha-evento.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

interface Evento {
  fechaEmision: Date,
  nombreProyecto: string,
  usuarioSolicitante: string,
  usuarioEncargado: string,
  sector: number,
  area: number,
  referencia: string,
  objetivo: string,
  alcance: string,
  detalle: string,
  fechaInicio: Date,
  horaInicio: string,
  fechaFin: Date,
  horaFin: string,
  restricciones: string,
  indicAdicionales: string,
  inversion: number | undefined,
  ingresos: number | undefined,
  estadoProceso: number,
  porcentajeTotal: number,
  porcentajeNuevos: number
  estadoValido: number,
  sttoped: number,
  justificacion: string
}

@Component({
  selector: 'app-formulario-evento',
  templateUrl: './formulario-evento.component.html',
  styleUrls: ['./formulario-evento.component.css']
})
export class FormularioEventoComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('fileReqInput') fileReqInput: any;

  riesgosList: { rsg: string, mit: string }[] = [];

  riesgoObj: { rsg: string, mit: string } = { rsg: '', mit: '' };

  fecha: Date = new Date();

  //listas de datos
  empleadosList: any[] = [];
  empleadosListFiltered: any[] = [];
  areasList: any[] = [];
  sectoresList: any[] = [];

  nombreEmpleado: string = '';
  nombreArea: string = '';
  nombreSector: string = '';

  selectedDate: Date = new Date();

  isRiskWriting: boolean = false;

  saveFichaExito: boolean = true;

  evento: Evento = {
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
    ingresos: undefined,
    estadoProceso: 1,
    porcentajeTotal: 0,
    porcentajeNuevos: 0,
    estadoValido: 1,
    sttoped: 0,
    justificacion: ''
  };

  timeList: string[] = [
    '00:00', '00:10', '00:20', '00:30', '00:40', '00:50',
    '01:00', '01:10', '01:20', '01:30', '01:40', '01:50',
    '02:00', '02:10', '02:20', '02:30', '02:40', '02:50',
    '03:00', '03:10', '03:20', '03:30', '03:40', '03:50',
    '04:00', '04:10', '04:20', '04:30', '04:40', '04:50',
    '05:00', '05:10', '05:20', '05:30', '05:40', '05:50',
    '06:00', '06:10', '06:20', '06:30', '06:40', '06:50',
    '07:00', '07:10', '07:20', '07:30', '07:40', '07:50',
    '08:00', '08:10', '08:20', '08:30', '08:40', '08:50',
    '09:00', '09:10', '09:20', '09:30', '09:40', '09:50',
    '10:00', '10:10', '10:20', '10:30', '10:40', '10:50',
    '11:00', '11:10', '11:20', '11:30', '11:40', '11:50',
    '12:00', '12:10', '12:20', '12:30', '12:40', '12:50',
    '13:00', '13:10', '13:20', '13:30', '13:40', '13:50',
    '14:00', '14:10', '14:20', '14:30', '14:40', '14:50',
    '15:00', '15:10', '15:20', '15:30', '15:40', '15:50',
    '16:00', '16:10', '16:20', '16:30', '16:40', '16:50',
    '17:00', '17:10', '17:20', '17:30', '17:40', '17:50',
    '18:00', '18:10', '18:20', '18:30', '18:40', '18:50',
    '19:00', '19:10', '19:20', '19:30', '19:40', '19:50',
    '20:00', '20:10', '20:20', '20:30', '20:40', '20:50',
    '21:00', '21:10', '21:20', '21:30', '21:40', '21:50',
    '22:00', '22:10', '22:20', '22:30', '22:40', '22:50',
    '23:00', '23:10', '23:20', '23:30', '23:40', '23:50'
  ];

  timeListFiltered1: string[] = _.cloneDeep(this.timeList);
  timeListFiltered2: string[] = _.cloneDeep(this.timeList);

  subsistemasList: any[] = [];

  //guarda el estado del proceso de la ficha de evento
  estadoFicha!: number;

  //guarda el nivel que el usuario tiene habilitado para editar la ficha de evento
  nivelFichaUsEn: number = 1;
  idReqTemp: number | undefined = 0;

  constructor(
    public GlobalEventosService: GlobalEventosService,
    private empService: EmpleadosService,
    private areaService: AreasService,
    private invGeneralService: GeneralControllerService,
    private auxEventosService: AuxEventosService,
    private dialogService: DialogServiceService,
    private cookieService: CookieService,
    private fichaEvService: FichaEventoService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      const empleados$ = this.empService.getEmpleadosList();
      const areas$ = this.areaService.getAreaList();
      const sectores$ = this.invGeneralService.getSectoresList();
      const subsistemas$ = this.auxEventosService.getSubsistemasList();

      // Usar forkJoin para esperar a que todas las observables se completen
      forkJoin([empleados$, areas$, sectores$, subsistemas$]).subscribe(
        ([empleadosData, areasData, sectoresData, subsistemasData]) => {
          this.empleadosList = _.cloneDeep(empleadosData);
          //this.empleadosListFiltered = _.cloneDeep(empleadosData);

          this.areasList = _.cloneDeep(areasData);
          this.sectoresList = _.cloneDeep(sectoresData);
          this.subsistemasList = _.cloneDeep(subsistemasData);

          // Ejecutar el if solo después de que todos los datos hayan sido cargados
          if (this.GlobalEventosService.editMode) {
            this.formatDataToView(this.GlobalEventosService.FormEv, this.GlobalEventosService.riesgos, this.GlobalEventosService.req, this.GlobalEventosService.fichaDocs, this.GlobalEventosService.reqDocs);
          } else {
            this.GlobalEventosService.clearEventoData();
            this.estadoFicha = 1;
          }
        }
      );
    }, 200);
  }

  ngOnDestroy(): void {
    this.clearEventoData();
  }

  formatDataToView(ficha: any, riesgos: any[], req: any[], fichaDocs: any[], reqDocs: any[]) {
    //console.log("Ficha:", ficha);
    //formatear datos de la ficha
    this.evento = {
      fechaEmision: ficha.fEvFechaEmision,
      nombreProyecto: ficha.fEvNombreProyecto,
      usuarioSolicitante: ficha.fEvSolicitante,
      usuarioEncargado: ficha.fEvEncargado,
      sector: ficha.fEvSector,
      area: ficha.fEvArea,
      referencia: ficha.fEvReferencia,
      objetivo: ficha.fEvObjetivoProyecto,
      alcance: ficha.fEvAlcanceProyecto,
      detalle: ficha.fEvDetalleProdFinal,
      fechaInicio: new Date(ficha.fEvFechaInicio),
      horaInicio: this.extractTimeFromDate(new Date(ficha.fEvFechaInicio)),
      fechaFin: new Date(ficha.fEvFechaFin),
      horaFin: this.extractTimeFromDate(new Date(ficha.fEvFechaFin)),
      restricciones: ficha.fEvRestricciones,
      indicAdicionales: ficha.fEvIndicAdicionales,
      inversion: ficha.fEvInversion,
      ingresos: ficha.fEvIngresos,
      estadoProceso: ficha.fEvEstadoProyecto,
      porcentajeTotal: ficha.fEvPorcentajeTotal,
      porcentajeNuevos: ficha.fEvPorcentajeNuevos,
      estadoValido: ficha.fEvEstadoActivo,
      sttoped: ficha.fEvSttoped,
      justificacion: ficha.fEvJustificacion
    };

    this.GlobalEventosService.idFichaSelected = ficha.fEvId;

    this.nombreEmpleado = this.getSolicitanteName(ficha.fEvEncargado);
    this.nombreArea = this.getAreaName(ficha.fEvArea);
    this.nombreSector = this.getSectorName(ficha.fEvSector);

    this.estadoFicha = ficha.fEvEstadoProyecto;

    //console.log('evento:', this.evento);
    //formatear los riesgos
    this.riesgosList = [];
    riesgos.forEach(riesgo => {
      this.riesgosList.push({ rsg: riesgo.rgPrDescripcion, mit: riesgo.rgPrMitigacion });
    });

    //formatear los requerimientos
    this.requerimientosList = [];
    req.forEach(requerimiento => {
      var check = false;
      var closed = false;

      if (requerimiento.reqEtoCulminado == 1) {
        check = true;
      }

      if(requerimiento.reqEtoChecked == 1){
        closed = true;
      }

      this.requerimientosList.push({
        idReq: requerimiento.reqEtoId,
        idSubs: requerimiento.reqEtoSubsistema,
        req: requerimiento.reqEtoDescripcion,
        observ: requerimiento.reqEtoObservaciones,
        fecha: new Date(requerimiento.reqEtoFechaRegistro),
        estado: requerimiento.reqEtoEstadoReq,
        prioridad: requerimiento.reqEtoPrioridad,
        motivoNuevo: requerimiento.reqEtoMotivoNuevo,
        checked: check,
        closed: closed
      });
    });

    //guardar los documentos de la ficha y de los requerimientos en las listas correspondientes
    this.saveDocFromDB(fichaDocs, reqDocs);

    //calcular el valor del porcentaje de cumplimiento de los subsistemas
    this.calculateSubsPercent();
  }

  saveDocFromDB(fichaDocs: any[], reqDocs: any[]) {
    //mapear los documentos de la ficha de la base de datos en las listas correspondientes
    fichaDocs.forEach(doc => {
      this.documentList.push({
        idDB: doc.docEvId,
        name: doc.docEvNombre,
        ruta: doc.docEvRuta,
        isNew: false
      });
    });

    reqDocs.forEach(doc => {
      this.documentListReq.push({
        idDB: doc.docReqId,
        idSubs: doc.docReqIdSubs,
        name: doc.docReqNombre,
        ruta: doc.docEvRuta,
        file: new File([], doc.docNombre),
        uploadedBy: doc.docReqUsuario,
        isNew: false
      });
    });
  }

  calculateSubsPercent() {
    // Iterar lista de subsistemas
    this.subsistemasList.forEach(subs => {
      var totalReqs: number = 0;
      var totalChecks: number = 0;

      var totalNewReqs: number = 0;
      var totalNewChecks: number = 0;

      // Filtrar los requerimientos por el subsistema actual
      // Requerimientos iniciales
      const requerimientosSubsistema = this.requerimientosList.filter(req => req.idSubs === subs.subsId && req.estado == 1);

      // Requerimientos nuevos
      const requerimientosSubsistemaNew = this.requerimientosList.filter(req => req.idSubs === subs.subsId && req.estado == 2);

      // Por cada requerimiento del subsistema actual, incrementar el número total de requerimientos
      totalReqs = requerimientosSubsistema.length;
      totalNewReqs = requerimientosSubsistemaNew.length;

      // Contar los requerimientos que están marcados como 'checked'
      requerimientosSubsistema.forEach(req => {
        if (req.checked) {
          totalChecks++;
        }
      });

      requerimientosSubsistemaNew.forEach(req => {
        if (req.checked) {
          totalNewChecks++;
        }
      });

      // Calcular el porcentaje solo si hay requerimientos para evitar división por cero
      subs.percent = totalReqs != 0 ? ((totalChecks * 100) / totalReqs).toFixed(2) + '%' : '-';
      subs.percentNew = totalNewReqs != 0 ? ((totalNewChecks * 100) / totalNewReqs).toFixed(2) + '%' : '-';
    });
  }

  returnCheckSubs(idSubs: number): boolean {
    if (this.GlobalEventosService.editMode) {
      // Verificar si existe al menos un registro en la lista de requerimientos
      return this.requerimientosList.some(item => item.idSubs === idSubs);
    }
    return false;
  }

  filterEmployedByArea() {
    //console.log("Filtrando empleados por área", this.nombreArea);
    var areaId = this.getIdArea(this.nombreArea);
    this.empleadosListFiltered = this.empleadosList.filter(emp => emp.empleadoIdArea == areaId);
  }

  clearEventoData() {
    this.GlobalEventosService.editMode = false;
    this.evento = {
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
      ingresos: undefined,
      estadoProceso: 1,
      porcentajeTotal: 0,
      porcentajeNuevos: 0,
      estadoValido: 1,
      sttoped: 0,
      justificacion: ''
    }
    this.requerimientosList = [];
    this.riesgosList = [];
    this.documentList = [];
    this.documentListReq = [];
    this.GlobalEventosService.clearEventoData();
  }

  getSolicitanteName(idSolicitante: string) {
    let sol = this.empleadosList.find((solicitante) => solicitante.empleadoIdNomina == idSolicitante.trim());
    return sol ? sol.empleadoNombres + ' ' + sol.empleadoApellidos : 'Sin solicitante';
  }

  getAreaName(idArea: number): string{
    let area = this.areasList.find((a) => a.areaIdNomina == idArea);
    return area ? area.areaDecp : 'Sin área';
  }

  getSectorName(idSector: number): string{
    let sector = this.sectoresList.find((s) => s.sectId == idSector);
    return sector ? sector.sectNombre : 'Sin sector';
  }

  extractTimeFromDate(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  }

  callMessage(message: string, type: boolean) {
    this.dialogService.openAlertDialog(message, type);
  }

  filterEmpleados(filterValue: string) {
    this.empleadosListFiltered = this.empleadosList.filter(emp =>
      (emp.empleadoNombres + ' ' + emp.empleadoApellidos).toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  updateEmpleadosListFiltered(event: any) {
    this.filterEmpleados(event.target.value);
  }

  updateHorasListFiltered(event: any, idList: number) {
    if (idList == 1) {
      this.timeListFiltered1 = this.timeList.filter(time => time.includes(event.target.value));
    } else {
      this.timeListFiltered2 = this.timeList.filter(time => time.includes(event.target.value));
    }

  }

  addRiesgo() {
    if (this.riesgoObj.rsg && this.riesgoObj.mit) {
      this.riesgosList.push({ ...this.riesgoObj });
      this.riesgoObj = { rsg: '', mit: '' };
    }
  }

  getIdEmpleado(nombre: string): string {
    const empleado = this.empleadosList.find(emp => ((emp.empleadoNombres + ' ' + emp.empleadoApellidos).trim() == nombre.trim()));
    return empleado ? empleado.empleadoIdNomina : '000000';
  }

  getIdArea(nombre: string): number {
    const area = this.areasList.find(a => ((a.areaDecp).trim() == nombre.trim()));
    return area ? area.areaIdNomina : 0;
  }

  getIdSector(nombre: string): number{
    const sector = this.sectoresList.find(s => s.sectNombre == nombre);
    return sector ? sector.sectId : 0;
  }


  onEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      this.addRiesgo();
      this.isRiskWriting = false;
    }
  }


  @ViewChildren('autoResizeTextarea') textareas!: QueryList<ElementRef<HTMLTextAreaElement>>;

  ngAfterViewInit() {
    this.textareas.forEach((textarea) => {
      this.adjustHeight(textarea.nativeElement);
    });
  }

  adjustHeight(textarea: HTMLTextAreaElement): void {
    //console.log("ejecutando adjustHeight");
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  //escucha las pulsaciones de teclado en el textarea de riesgos, si hay texto activa la bandera isRiskWriting
  listenKey(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log(value);
    value ? this.isRiskWriting = true : this.isRiskWriting = false;
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }

  async saveFicha(hasToSend: boolean) {

    //RESTRICCIONES
    //restriccion: verificar que todos los campos de la ficha esten llenos
    if (!this.GlobalEventosService.editMode && !this.verifyEmptyData(hasToSend)) {
      return; // Detener la ejecución de `saveFicha` si `verifyEmptyData` retorna `false`
    }

    //restriccion: si la fecha actual es menos a la fecha de inicio por 15 dias, no se permite guardar la ficha
    const fechaActual = new Date();
    const fechaInicio = new Date(this.evento.fechaInicio);
    const diff = Math.abs(fechaInicio.getTime() - fechaActual.getTime());
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (diffDays < 15) {
      this.callMessage(`La ficha debe ser registrada como máximo con 15 días de anticipación. Días restantes hasta el inicio del proyecto: ${diffDays}`, false);
      return;
    }

    //restriccion: verificar si no se ha terminado de escribir algún riesgo
    if (this.isRiskWriting) {
      this.callMessage(`Debe terminar de escribir el riesgo antes de guardar, presione 'Enter' para agregar el riesgo o elimine su contenido.`, false);
      return;
    }

    var op = 'guardar';
    var reqs = '';
    if (hasToSend) {
      op = 'enviar';
    }

    if (this.GlobalEventosService.editMode) {
      reqs = `\nAsegúrese de haber REGISTRADO REQUERIMIENTOS antes de ${op} la ficha de proyecto en caso de que los requiera.`;
    }
    
    const confirmDialogSubscription = this.dialogService.openMessageEvDialog(`¿Está seguro que desea ${op} la ficha de proyecto?${reqs}`).subscribe(
      async (result) => {
        confirmDialogSubscription.unsubscribe();

        if (result) {

          //formatear la fecha y hora de inicio como datetime
          await this.setFormatTime();

          var idFicha = undefined;
          if (this.GlobalEventosService.editMode) {
            idFicha = this.GlobalEventosService.idFichaSelected;
          }

          const ficha = {
            fEvID: idFicha,
            fEvFechaEmision: this.evento.fechaEmision,
            fEvEncargado: this.getIdEmpleado(this.nombreEmpleado),
            fEvSolicitante: this.cookieService.get('userIdNomina'),
            fEvArea: this.getIdArea(this.nombreArea),
            fEvSector: this.getIdSector(this.nombreSector),
            fEvNombreProyecto: this.evento.nombreProyecto,
            fEvReferencia: this.evento.referencia,
            fEvObjetivoProyecto: this.evento.objetivo,
            fEvAlcanceProyecto: this.evento.alcance,
            fEvDetalleProdFinal: this.evento.detalle,
            fEvFechaInicio: this.evento.fechaInicio,
            fEvFechaFin: this.evento.fechaFin,
            fEvEstadoProyecto: this.evento.estadoProceso,
            fEvPorcentajeTotal: this.evento.porcentajeTotal,
            fEvPorcentajeNuevos: this.evento.porcentajeNuevos,
            fEvEstadoActivo: this.evento.estadoValido,
            fEvRestricciones: this.evento.restricciones,
            fEvIndicAdicionales: this.evento.indicAdicionales,
            fEvInversion: this.evento.inversion,
            fEvIngresos: this.evento.ingresos,
            fEvSttoped: 0,
            fEvJustificacion: ''
          };

          try {
            const data = await this.fichaEvService.postFichaEvento(ficha).toPromise();
            //console.log("Ficha guardada:", data);

            await Promise.all([
              this.saveRiesgos(data.fEvId),
              this.saveRequeriments(data.fEvId),
              this.saveFichaDoc(data.fEvId),
              this.saveSubsDocs(data.fEvId)
            ]);

            if (hasToSend) {
              await this.sendFichaEvento(data.fEvId);
            } else {
              this.router.navigate(['historial-evento']);
              this.callMessage('La ficha se ha guardado exitosamente.', true);
            }
            this.clearEventoData();
            
          } catch (error: any) {
            console.log("Error:", error);
            this.callMessage(`Error al guardar la ficha de proyecto\n${error.message}`, false);
          }

        }
      }
    );


  }

  async setFormatTime() {
    const fechaInicio = new Date(this.evento.fechaInicio);
    const horaInicio = this.evento.horaInicio.split(':');
    fechaInicio.setHours(parseInt(horaInicio[0]));
    fechaInicio.setMinutes(parseInt(horaInicio[1]));
    this.evento.fechaInicio = fechaInicio;

    const fechaFin = new Date(this.evento.fechaFin);
    const horaFin = this.evento.horaFin.split(':');
    fechaFin.setHours(parseInt(horaFin[0]));
    fechaFin.setMinutes(parseInt(horaFin[1]));
    this.evento.fechaFin = fechaFin;
  }

  saveRiesgos(idFicha: number) {
    const riesgosPromises = this.riesgosList.map(item => {
      const riesgo = {
        rgPrIdFichaEv: idFicha,
        rgPrDescripcion: item.rsg,
        rgPrMitigacion: item.mit,
        rgPrEstadoActivo: 1
      };

      return this.fichaEvService.postRiesgoFichaEvento(riesgo).toPromise()
        .catch(error => {
          if (error.status == 409) {
            console.log("Requerimiento existente")
          } else {
            console.log("Error:", error);
            this.callMessage(`Error al guardar el riesgo ${item.rsg} de la ficha de proyecto\n${error.message}`, false);
            throw error;
          }
        });
    });

    return Promise.all(riesgosPromises);
  }

  saveRequeriments(idFicha: number) {
    const requerimientosPromises = this.requerimientosList.map(item => {
      const req = {
        reqEtoIdFichaEv: idFicha,
        reqEtoSubsistema: item.idSubs,
        reqEtoFechaRegistro: item.fecha,
        reqEtoDescripcion: item.req,
        reqEtoObservaciones: item.observ,
        reqEtoMotivoNuevo: '',
        reqEtoPrioridad: item.prioridad,
        reqEtoCulminado: 0,
        reqEtoEstadoReq: item.estado,
        reqEtoEstadoValido: 1
      };

      return this.fichaEvService.postRequerimentsFichaEv(req).toPromise()
        .catch(error => {
          if (error.status == 409) {
            console.log("Requerimiento existente")
          } else {
            console.log("Error:", error);
            this.callMessage(`Error al guardar el requerimiento ${item.req} de la ficha de proyecto\n${error.message}`, false);
            throw error;
          }
        });
    });

    return Promise.all(requerimientosPromises);
  }

  saveFichaDoc(idFicha: number): Promise<void> {
    //console.log("Guardando documentos de la ficha de evento");
    const fichaDocPromises = this.documentList
      .filter(doc => doc.isNew)  // Filtrar solo los documentos nuevos
      .map(doc => {
        return this.fichaEvService.postFichaDocs(doc.file, idFicha).toPromise()
          .then(() => console.log('guardando documento'))
          .catch(error => {
            console.log("Error al guardar el documento", error);
            this.callMessage(`Error al guardar el documento ${doc.name} de la ficha de proyecto\n${error.message}`, false);
            throw error;  // Lanza el error para que Promise.all lo capture
          });
      });

    // Retornar una promesa que se resuelve cuando todas las promesas en fichaDocPromises se resuelven
    return Promise.all(fichaDocPromises).then(() => {
      // Puedes realizar acciones adicionales aquí si todas las promesas se cumplen
    });
  }


  saveSubsDocs(idFicha: number) {
    const fichaDocPromises = this.documentListReq
      .filter(doc => doc.isNew)  // Filtrar solo los documentos nuevos
      .map(doc => {
        return this.fichaEvService.postSubsDocs(doc.file, idFicha, doc.idSubs, doc.uploadedBy).toPromise()
          .then(() => console.log('guardando documento del subsistema'))
          .catch(error => {
            console.log("Error al guardar el documento", error);
            this.callMessage(`Error al guardar el documento ${doc.name} de la ficha de proyecto\n${error.message}`, false);
            throw error;  // Lanza el error para que Promise.all lo capture
          });
      });

    // Retornar una promesa que se resuelve cuando todas las promesas en fichaDocPromises se resuelven
    return Promise.all(fichaDocPromises).then(() => {
      // Puedes realizar acciones adicionales aquí si todas las promesas se cumplen
    });
  }

  async sendFichaEvento(idFicha: number) {
    var nextStep = 0;

    //consultar el siguiente nivel de la ficha de evento
    await this.fichaEvService.getNextFichaStatus(idFicha).subscribe(
      (response) => {
        nextStep = response;
        //console.log("Siguiente nivel de la ficha:", nextStep);

        this.fichaEvService.updateEstadoFichaEvento(idFicha, nextStep).toPromise()
          .then((response: number) => {
            //console.log("Ficha enviada:", response);
            this.router.navigate(['historial-evento']);
            this.callMessage('La ficha se ha enviado exitosamente.', true);
          })
          .catch(error => {
            console.log("Error al enviar la ficha", error);
            this.callMessage('Error al enviar la ficha', false);
            throw error;
          });
      },
      (error) => {
        console.log("Error al consultar el siguiente nivel de la ficha", error);
      }
    );


  }

  deleteRiesgo(index: number) {
    this.riesgosList.splice(index, 1);
  }

  //FICHA ETO
  requerimientosList: { idReq?: number, idSubs: number, req: string, observ: string, fecha: Date, estado: number, prioridad: number, checked?: boolean, motivoNuevo?: string, closed?: boolean }[] = [];
  requerimiento: { idSubs: number, req: string, observ: string, fecha: Date, motivoNuevo: string } = { idSubs: 0, req: '', observ: '', fecha: new Date(), motivoNuevo: '' };
  reqPrioridad: number = 1;

  documentList: { name: string, file?: File, isNew: boolean, ruta?: string, idDB?: number }[] = [];
  documentListReq: { idSubs: number; name: string, file: File, uploadedBy: string, isNew: boolean, ruta?: string, idDB?: number }[] = [];

  addRequerimiento(subsId: number) {

    if (this.estadoFicha == 3) {
      if (this.requerimiento.req == '' || this.requerimiento.req == ' ' || this.requerimiento.motivoNuevo == '' || this.requerimiento.motivoNuevo == ' ') {
        this.callMessage('Por favor complete todos los campos antes de agregar el requerimiento', false);
        return;
      }
    } else {
      if (this.requerimiento.req == '' || this.requerimiento.req == ' ') {
        this.callMessage('Por favor complete todos los campos antes de agregar el requerimiento', false);
        return;
      }
    }


    if (this.estadoFicha < 3) {
      //si el estado de la ficha no es operativo, los requerimientos se guardan en la lista local
      const req = {
        idSubs: subsId,
        req: this.requerimiento.req.trim(),
        observ: this.requerimiento.observ.trim(),
        fecha: this.requerimiento.fecha,
        estado: 1,
        prioridad: this.reqPrioridad
      }

      this.requerimientosList.push(req);
      this.clearReq();

    } else if (this.estadoFicha == 3) {
      //restriccion: si la fecha actual es menos a la fecha de inicio por 3 dias, no se permite guardar el requerimiento
      const fechaActual = new Date();
      const fechaInicio = new Date(this.evento.fechaInicio);
      const diff = Math.abs(fechaInicio.getTime() - fechaActual.getTime());
      const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (diffDays < 3) {
        this.callMessage(`Los requerimientos deben ser registrados como máximo con 3 días de anticipación antes de la fecha de inicio del proyecto. Días restantes hasta el inicio del proyecto: ${diffDays}`, false);
        return;
      }

      //si el estado de la ficha es operativo, los requerimientos se guardan en la base de datos directamente
      const confirmDialogSubscription = this.dialogService.openMessageEvDialog(`¿Está seguro que desea guardar este requerimiento?\nEste requerimiento pertenecerá al grupo de "Requerimientos Nuevos".`).subscribe(
        (result) => {
          confirmDialogSubscription.unsubscribe();
          if (result) {
            //completar propiedades del objeto requerimiento
            const req = {
              reqEtoIdFichaEv: this.GlobalEventosService.idFichaSelected,
              reqEtoSubsistema: subsId,
              reqEtoFechaRegistro: this.requerimiento.fecha,
              reqEtoDescripcion: this.requerimiento.req,
              reqEtoObservaciones: this.requerimiento.observ,
              reqEtoMotivoNuevo: this.requerimiento.motivoNuevo,
              reqEtoPrioridad: this.reqPrioridad,
              reqEtoCulminado: 0,
              reqEtoEstadoReq: 2,
              reqEtoEstadoValido: 1
            }

            //console.log("Requerimiento nuevo a guardar:", req);

            this.fichaEvService.postRequerimentsFichaEv(req).subscribe(
              response => {
                //console.log("Nuevo requerimiento agregado:", response)
                this.updatePageInfo();
                this.clearReq();
              },
              error => {
                if (error.status != 409) {
                  console.log("Error al guardar el nuevo requerimiento", error);
                }
                console.log("Requerimiento existente", error)
              }
            );
          }
        }
      );
    }
  }

  deleteReqEto(index: number) {
    //console.log('Eliminando requerimiento de la lista local');
    this.requerimientosList.splice(index, 1);
  }

  clearReq() {
    this.requerimiento = { idSubs: 0, req: '', observ: '', fecha: new Date(), motivoNuevo: '' };
    this.reqPrioridad = 1;
  }

  findDateByEstadoReq(idSubs: number, idEstado: number): Date | undefined {
    const reqDate = this.requerimientosList.find(req => req.idSubs == idSubs && req.estado == idEstado);
    return reqDate ? reqDate.fecha : undefined;
  }

  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword'];
      const maxSize = 1000 * 1024;

      if (!validTypes.includes(selectedFile.type)) {
        this.callMessage('El formato del archivo no está permitido.', false);
        return;
      }

      if (selectedFile.size > maxSize) {
        this.callMessage('El tamaño del archivo no debe exceder 1 MB.', false);
        return;
      }

      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.documentList.push({ name: selectedFile.name, file: selectedFile, isNew: true });
        this.fileInput.nativeElement.value = '';
      };
      reader.readAsDataURL(selectedFile);
    }
  }


  onFileSelectedReq(event: any, idSubs: number): void {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword'];
      const maxSize = 1000 * 1024;

      if (!validTypes.includes(selectedFile.type)) {
        this.callMessage('El formato del archivo no está permitido.', false);
        return;
      }

      if (selectedFile.size > maxSize) {
        this.callMessage('El tamaño del archivo no debe exceder 1 MB.', false);
        return;
      }

      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.documentListReq.push({ idSubs: idSubs, name: selectedFile.name, file: selectedFile, uploadedBy: this.cookieService.get('userName'), isNew: true });
        this.fileReqInput.nativeElement.value = '';
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  // Método para eliminar un documento de la lista
  deleteDocument(index: number, doc: any, type: number): void {
    if (doc.isNew) {
      this.documentList.splice(index, 1);
    } else {
      const confirmDialogSubscription = this.dialogService.openMessageEvDialog('¿Está seguro que desea eliminar este archivo?\nEsta acción no se puede deshacer.').subscribe(
        (result) => {
          if (result) {

            confirmDialogSubscription.unsubscribe();

            //eliminar archivo de la base de datos
            this.fichaEvService.postDeleteEvFile(doc.idDB, type).subscribe(
              (result) => {
                this.callMessage('Se ha elimiando el documento.', true);
                this.updatePageInfo();
              },
              (error) => {
                console.log('Error: ', error)
                this.callMessage('Ha ocurrido un error al eliminar el documento.', false);
              }
            );

          }
        }
      );
    }
  }

  setReqPrioridad(id: number) {
    this.reqPrioridad = id;
  }

  openDoc(doc: any) {
    if (doc.isNew) {
      // Si el usuario está en la pantalla de creación, abre el documento local en una pestaña nueva
      const url = URL.createObjectURL(doc.file);
      window.open(url);
    } else {
      // Si el usuario está en edición, consulta el documento a la base de datos y lo abre en una nueva pestaña
      this.fichaEvService.getViewFileEv(doc.ruta).subscribe(
        (data) => {
          // Extraer la extensión del archivo
          const ext = doc.name.split('.').pop().toLowerCase(); // Convertir la extensión a minúsculas para simplificar la comparación
          //console.log("Extensión del archivo:", ext);

          let mimeType = '';

          // Determinar el tipo MIME según la extensión del archivo
          switch (ext) {
            case 'pdf':
              mimeType = 'application/pdf';
              break;
            case 'png':
              mimeType = 'image/png';
              break;
            case 'jpg':
              mimeType = 'image/jpeg';
              break;
            case 'jpeg':
              mimeType = 'image/jpeg';
              break;
            case 'xlsx':
              mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
              break;
            case 'docx':
              mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
              break;
            case 'doc':
              mimeType = 'application/msword'; // `application/vnd.openxmlformats-officedocument.wordprocessingml.document` también se puede usar para archivos .doc
              break;
            default:
              mimeType = 'application/octet-stream'; // Tipo MIME por defecto si no se encuentra una coincidencia
              break;
          }

          // Crear un Blob con el tipo MIME adecuado
          const file = new Blob([data], { type: mimeType });
          const urlfile = URL.createObjectURL(file);

          // Crear un elemento <a> y configurar el atributo download
          const a = document.createElement('a');
          a.href = urlfile;
          a.download = doc.name; // Establece el nombre del archivo para la descarga
          document.body.appendChild(a);
          a.click();

          // Limpiar el DOM
          document.body.removeChild(a);
          URL.revokeObjectURL(urlfile); // Libera el objeto URL cuando ya no sea necesario
        },
        (error) => {
          console.log("Error:", error);
        }
      );
    }
  }


  deleteSavedReq() {
    const confirmDialogSubscription = this.dialogService.openMessageEvDialog("¿Está seguro que desea eliminar este requerimiento?\nEsta acción no se puede deshacer.").subscribe(
      (result) => {
        confirmDialogSubscription.unsubscribe();
        if (result) {
          //console.log("Se ha eliminado el requerimiento");

          if(this.GlobalEventosService.observContent == ''){
            this.callMessage('Por favor ingrese una justificación para eliminar el requerimiento.', false);
            return;
          }

          const data = {
            idFicha: this.GlobalEventosService.idFichaSelected,
            idReq: this.idReqTemp,
            status: 3,
            observ: this.GlobalEventosService.observContent
          }

          this.fichaEvService.updateEstadoRequerimiento(data).subscribe(
            (data) => {
              console.log("Requerimiento eliminado:", data);
              this.updatePageInfo();
            },
            (error) => {
              console.log("Error:", error);
            }
          );

        } else {
          this.GlobalEventosService.observContent = '';
          this.GlobalEventosService.isReqComplete = false;
          return;
        }
      }
    );


  }

  checkSavedReq(idReq: number | undefined, event: MatCheckboxChange) {
    this.GlobalEventosService.observContent = '';
    this.GlobalEventosService.isReqComplete = false;

    //solicitar que se ingrese la justificacion para marcar el requerimiento como cumplido o no
    const confirmDialogSubscriptionJ = this.dialogService.openFinishReqDialog().subscribe(
      (resultJ) => {
        confirmDialogSubscriptionJ.unsubscribe();
        if (resultJ) {
          const confirmDialogSubscription = this.dialogService.openMessageEvDialog("¿Está seguro que desea marcar este requerimiento como cumplido?\nEsta acción no se puede deshacer.").subscribe(
            (result) => {
              confirmDialogSubscription.unsubscribe();
              if (result) {
                //restriccion: si el requerimiento esta marcado como cumplido no se solicita la justificacion, si el requerimiento no esta cumplido se solicita la justificacion obligatoriamente
                if (!this.GlobalEventosService.isReqComplete && this.GlobalEventosService.observContent == '') {
                  this.callMessage('Por favor ingrese una justificación para el requerimiento no cumplido.', false);
                  event.source.checked = false;
                  return;
                }

                const data = {
                  idFicha: this.GlobalEventosService.idFichaSelected,
                  idReq: idReq,
                  check: 1,
                  observ: this.GlobalEventosService.observContent
                }

                console.log("Data:", data);

                this.fichaEvService.updateCheckRequerimiento(data).subscribe(
                  (data) => {
                    console.log("Requerimiento culminado:", data);
                    this.updatePageInfo();
                    this.GlobalEventosService.observContent = '';
                    this.GlobalEventosService.isReqComplete = false;
                  },
                  (error) => {
                    console.log("Error:", error);
                    event.source.checked = false;
                  }
                );
              } else {
                event.source.checked = false;
                return;
              }
            }
          );
        } else {
          event.source.checked = false;
          return;
        }
      }
    );
  }


  addReqObserv() {
    
    const confirmDialogSubscription = this.dialogService.openMessageEvDialog('¿Está seguro que desea agregar esta observación al requerimiento?').subscribe(
      (result) => {
        confirmDialogSubscription.unsubscribe();
        if (result) {
          //console.log("Se ha marcado como cumplida");

          const data = {
            idFicha: this.GlobalEventosService.idFichaSelected,
            idReq: this.idReqTemp,
            observ: this.GlobalEventosService.observContent
          }

          this.fichaEvService.updateReqObserv(data).subscribe(
            (data) => {
              console.log("Observación agregada:", data);
              this.updatePageInfo();
              this.GlobalEventosService.observContent = '';
            },
            (error) => {
              console.log("Error:", error);
            }
          );

        }
      }
    );
  }

  selectIdReqTemp(id: number | undefined) {
    this.idReqTemp = id;
  }

  clearReqObserv() {
    this.GlobalEventosService.observContent = '';
    this.idReqTemp = 0;
  }

  updatePageInfo() {
    //solicitar la informacion de la ficha del evento al globalService
    this.GlobalEventosService.getFichaEvento();

    setTimeout(() => {
      this.formatDataToView(this.GlobalEventosService.FormEv, this.GlobalEventosService.riesgos, this.GlobalEventosService.req, this.GlobalEventosService.fichaDocs, this.GlobalEventosService.reqDocs);
    }, 200);

    this.fichaEvService.updateFichasPercent();
  }


  nullEvent() {
    const confirmDialogSubscription = this.dialogService.openMessageEvDialog(`¿Está seguro que desea cancelar este proyecto?\nEsta acción no se puede deshacer, si sólo desea posponerlo use la opción de "Pausar proyecto".`).subscribe(
      (result) => {
        confirmDialogSubscription.unsubscribe();
        if (result) {
          //console.log("Cancelando proyecto...");

          //setear la ficha con estado 5
          this.fichaEvService.updateEstadoFichaEvento(this.GlobalEventosService.idFichaSelected, 5).subscribe(
            (data) => {
              console.log("proyecto cancelado:", data);
              this.callMessage('El proyecto se ha cancelado correctamente.', true);

              //redireccionar a la vista de historial
              this.router.navigate(['historial-evento']);
            },
            (error) => {
              console.log("Error:", error);
              this.callMessage('Error al pausar el proyecto.', false);
            }
          );

          //guardar la justificacion de la ficha
          this.fichaEvService.updateFichaJustify(this.GlobalEventosService.idFichaSelected, this.GlobalEventosService.observContent).subscribe(
            (data) => {
              console.log("Justificación guardada:", data);
              this.GlobalEventosService.observContent = '';

            },
            (error) => {
              console.log("Error:", error);
            }
          );

        } else {
          return;
        }
      }
    );
  }

  stopEvent() {
    const confirmDialogSubscription = this.dialogService.openMessageEvDialog(`¿Está seguro que desea pausar este proyecto?\nEsta acción regresa la ficha al nivel de "Emisión" y permite reiniciar el proceso.`).subscribe(
      (result) => {
        confirmDialogSubscription.unsubscribe();
        if (result) {
          //console.log("Pausando evento...");

          //setear la ficha con estado 1 y con sttoped 1
          this.fichaEvService.updateEstadoFichaEvento(this.GlobalEventosService.idFichaSelected, 1, 1).subscribe(
            (data) => {
              console.log("Evento pausado:", data);
              this.callMessage('El proyecto se ha pausado correctamente. Ahora está disponible en el nivel "Emisión", si desea retomar el proceso deberá volver a enviar la misma ficha.', true);

              //redireccionar a la vista de historial
              this.router.navigate(['historial-evento']);
            },
            (error) => {
              console.log("Error:", error);
              this.callMessage('Error al pausar el evento.', false);
            }
          );


          //guardar la justificacion de la ficha
          this.fichaEvService.updateFichaJustify(this.GlobalEventosService.idFichaSelected, this.GlobalEventosService.observContent).subscribe(
            (data) => {
              console.log("Justificación guardada:", data);
              this.GlobalEventosService.observContent = '';
            },
            (error) => {
              console.log("Error:", error);
            }
          );

        } else {
          return;
        }
      }
    );
  }

  finallyFicha(){
    const confirmDialogSubscription = this.dialogService.openMessageEvDialog(`¿Está seguro que desea finalizar este proyecto?\nEsta acción no se puede deshacer, al finalizar el proyecto ya no podrá registrar más requerimientos ni modificar ningún dato.`).subscribe(
      (result) => {
        confirmDialogSubscription.unsubscribe();

        if(result){

          //setear la ficha con estado 4
          this.fichaEvService.updateEstadoFichaEvento(this.GlobalEventosService.idFichaSelected, 4).subscribe(
            (data) => {
              console.log("Evento finalizado:", data);
              this.callMessage('El proyecto se ha finalizado correctamente.', true);

              //redireccionar a la vista de historial
              this.router.navigate(['historial-evento']);
            },
            (error) => {
              console.log("Error:", error);
              this.callMessage('Error al finalizar el proyecto.', false);
            }
          );

        } else {
          return;
        }
      }
    );
  }

  deleteFicha(){
    const confirmDialogSubscription = this.dialogService.openMessageEvDialog(`¿Está seguro de que desea eliminar esta ficha de proyecto?\nNo podrá recuperarla y deberá ingresar todos los datos nuevamente si desea crear una nueva.`).subscribe(
    (result) => {
      confirmDialogSubscription.unsubscribe();
      if(result){
        this.fichaEvService.updateFichaEvValido(this.GlobalEventosService.idFichaSelected, 0).subscribe(
          (data) => {
            console.log("Evento finalizado:", data);
            this.callMessage('El ficha se ha eliminado correctamente.', true);

            //redireccionar a la vista de historial
            this.router.navigate(['historial-evento']);
          },
          (error) => {
            console.log("Error:", error);
            this.callMessage('Error al finalizar el proyecto.', false);
          }
        );
      } else {
        return;
      }
    }
    );
  }


  verifyEmptyData(hasToSend: boolean): boolean {
    // Iterar sobre todas las propiedades del objeto `evento`
    for (const key in this.evento) {
      if (this.evento.hasOwnProperty(key)) {
        const value = this.evento[key as keyof Evento];

        // Verificar si la propiedad está vacía o es `undefined` o `null`
        if (value === '' || value === undefined || value === null) {
          console.log(`El campo ${key} está vacío.`);
          var op = 'guardar';
          if (hasToSend) {
            op = 'enviar';
          }
          this.callMessage(`Por favor rellene todos los campos antes de ${op} la ficha.`, false);
          return false; // Detener la ejecución y retornar `false` si alguna propiedad está vacía
        }
      }
    }
    return true; // Retornar `true` si todas las propiedades están llenas
  }


}