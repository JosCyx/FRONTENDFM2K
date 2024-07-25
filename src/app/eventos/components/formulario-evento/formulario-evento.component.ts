import { Component, ViewChild } from '@angular/core';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { GlobalEventosService } from 'src/app/services/global-eventos.service';
import * as _ from 'lodash';
import { AreasService } from 'src/app/services/comunicationAPI/seguridad/areas.service';
import { GeneralControllerService } from 'src/app/services/comunicationAPI/inventario/general-controller.service';
import { da } from 'date-fns/locale';
import { AuxEventosService } from 'src/app/services/comunicationAPI/eventos/aux-eventos.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';

@Component({
  selector: 'app-formulario-evento',
  templateUrl: './formulario-evento.component.html',
  styleUrls: ['./formulario-evento.component.css']
})
export class FormularioEventoComponent {
  
  selectedForm: string = 'proyecto';
  riesgosList: { rsg: string, mit: string }[] = [];

  riesgoObj: { rsg: string, mit: string } = { rsg: '', mit: '' };

  fecha: Date = new Date();

  //listas de datos
  empleadosList: any[] = [];
  empleadosListFiltered: any[] = [];
  areasList: any[] = [];
  sectoresList: any[] = [];

  nombreEmpleado: string = '';

  selectedDate: Date = new Date();

  evento: any = {
    fechaEmision: new Date(),
    nombreProyecto: '',
    usuarioSolicitante: '',
    sector: 0,
    area: 0,
    referencia: '',
    objetivo: '',
    alcance: '',
    detalle: '',
    fechaImplementacion: new Date()
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

  subsistemasList: any[] = [];
  
  constructor(
    public GlobalEventosService: GlobalEventosService,
    private empService: EmpleadosService,
    private areaService: AreasService,
    private invGeneralService: GeneralControllerService,
    private auxEventosService: AuxEventosService,
    private dialogService: DialogServiceService
  ) { 
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.empService.getEmpleadosList().subscribe((data) => {
        this.empleadosList = _.cloneDeep(data);
        this.empleadosListFiltered = _.cloneDeep(data);
      });

      this.areaService.getAreaList().subscribe((data) => {
        this.areasList = _.cloneDeep(data);
      });

      this.invGeneralService.getSectoresList().subscribe((data) => {
        this.sectoresList = _.cloneDeep(data);
      });

      this.auxEventosService.getSubsistemasList().subscribe((data) => {
        this.subsistemasList = _.cloneDeep(data);
      });
    }, 300);
  }

  callMessage(message: string, type: boolean){
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

  addRiesgo() {
    if (this.riesgoObj.rsg && this.riesgoObj.mit) {
      this.riesgosList.push({ ...this.riesgoObj });
      this.riesgoObj = { rsg: '', mit: '' };
    }
  }

  getIdEmpleado(nombre: string): string{
    const empleado = this.empleadosList.find(emp => ((emp.empleadoNombres + ' ' + emp.empleadoApellidos).trim() == nombre.trim()));
    return empleado ? empleado.empleadoIdNomina : '000000';
  }


  onEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      this.addRiesgo();
    }
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }

  saveFicha() {
    const ficha = {
      fEvFechaEmision: this.evento.fechaEmision,
      fEvSolicitante: this.getIdEmpleado(this.nombreEmpleado),
      fEvArea: this.evento.area,
      fEvSector: this.evento.sector,
      fEvNombreProyecto: this.evento.nombreProyecto,
      fEvReferencia: this.evento.referencia,
      fEvObjetivoProyecto: this.evento.objetivo,
      fEvAlcanceProyecto: this.evento.alcance,
      fEvDetalleProdFinal: this.evento.detalle,
      fEvFechaImplementacion: this.evento.fechaImplementacion,
      fEvEstadoProyecto: 1,
      fEvPorcentajeTotal: 0,
      fEvEstadoActivo: 1,
    };
    // Lógica para enviar el formulario
    console.log("a", ficha);

    //envio a la api
  }

  saveRiesgos() {
    this.riesgosList.forEach(item => {
      const riesgo = {
        rgPrIdFichaEv: 1,
        rgPrDescripcion: item.rsg,
        rgPrMitigacion: item.mit,
        rgPrEstadoActivo: 1
      };
      
      // Lógica para enviar los riesgos
      console.log("b", riesgo);

      //envia a la api
    });
  }

  deleteRiesgo(index: number){
    this.riesgosList.splice(index, 1);
  }

  imageAlert!: { file: File, url: string };
  @ViewChild('fileInput') fileInput: any;

  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'docx', 'pdf', 'xlsx', 'doc'];
        const maxSize = 1000 * 1024; 

        if (!validTypes.includes(selectedFile.type)) {
            this.callMessage('El formato del archivo no esta permitido.', false);
            return;
        }

        if (selectedFile.size > maxSize) {
            this.callMessage('El tamanio de archivo no debe exceder 1 MB.', false);
            return;
        }

        const reader = new FileReader();

        reader.onload = (e: any) => {
            this.imageAlert = { file: selectedFile, url: e.target.result };
            this.fileInput.nativeElement.value = '';
        };
        reader.readAsDataURL(selectedFile);
    }
}

  //FICHA ETO
  requerimientosList: {idSubs: number, req: string, observ: string, fecha: Date, estado: number}[] = [];
  requerimiento: {idSubs: number, req: string, observ: string, fecha: Date} = {idSubs: 0, req: '', observ: '', fecha: new Date()};

  addRequerimiento(subsId: number){
    if(this.requerimiento.req == '' || this.requerimiento.req == ' '){
      this.callMessage('El campo requerimiento es obligatorio', false);
      return;
    }

    const req = {
      idSubs: subsId,
      req: this.requerimiento.req.trim(),
      observ: this.requerimiento.observ.trim(),
      fecha: this.requerimiento.fecha,
      estado: 1
    }

    this.requerimientosList.push(req);
    this.clearReq();
  }

  deleteReqEto(index: number){
    this.requerimientosList.splice(index, 1);
  }

  clearReq(){
    this.requerimiento = {idSubs: 0, req: '', observ: '', fecha: new Date()};
  }

  findDateByEstadoReq(idSubs: number, idEstado: number): Date  | undefined{
    const reqDate = this.requerimientosList.find(req => req.idSubs == idSubs && req.estado == idEstado);
    return reqDate ? reqDate.fecha : undefined;
  }

  openDoc(){
    console.log('open doc');
  }
}