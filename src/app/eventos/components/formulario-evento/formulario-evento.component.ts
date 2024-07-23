import { Component } from '@angular/core';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { GlobalEventosService } from 'src/app/services/global-eventos.service';
import * as _ from 'lodash';
import { AreasService } from 'src/app/services/comunicationAPI/seguridad/areas.service';
import { GeneralControllerService } from 'src/app/services/comunicationAPI/inventario/general-controller.service';
import { da } from 'date-fns/locale';
import { AuxEventosService } from 'src/app/services/comunicationAPI/eventos/aux-eventos.service';

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


  subsistemasList: any[] = [];
  
  constructor(
    public GlobalEventosService: GlobalEventosService,
    private empService: EmpleadosService,
    private areaService: AreasService,
    private invGeneralService: GeneralControllerService,
    private auxEventosService: AuxEventosService
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

  //FICHA ETO
  requerimientosList: any[] = [];
  requerimiento: {req: string, obger: string, obop: string} = {req: '', obger: '', obop: ''};

  addRequerimiento(){
    this.requerimientosList.push({...this.requerimiento});
    this.clearReq();
  }

  clearReq(){
    this.requerimiento = {req: '', obger: '', obop: ''};
  }
}