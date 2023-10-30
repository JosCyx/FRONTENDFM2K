import { Component, OnInit, Input, ViewChild } from '@angular/core';
//servicios de comunicacion
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { SectoresService } from 'src/app/services/comunicationAPI/seguridad/sectores.service';
import { AreasService } from 'src/app/services/comunicationAPI/seguridad/areas.service';
import { NivelRuteoService } from 'src/app/services/comunicationAPI/seguridad/nivel-ruteo.service';
import { TrackingService } from 'src/app/services/comunicationAPI/seguridad/tracking.service';
import { CabCotizacionService } from 'src/app/services/comunicationAPI/solicitudes/cab-cotizacion.service';
import { DetCotOCService } from 'src/app/services/comunicationAPI/solicitudes/det-cot-oc.service';
import { ItemSectorService } from 'src/app/services/comunicationAPI/solicitudes/item-sector.service';

import { Observable, map, forkJoin, switchMap } from 'rxjs';
import { Detalle } from 'src/app/models/procesos/Detalle';
import { ItemSector } from 'src/app/models/procesos/ItemSector';
import { GlobalService } from 'src/app/services/global.service';
import { CabeceraCotizacion } from 'src/app/models/procesos/solcotizacion/CabeceraCotizacion';
import { DetalleCotizacion } from 'src/app/models/procesos/solcotizacion/DetalleCotizacion';
import { ItemCotizacion } from 'src/app/models/procesos/solcotizacion/ItemCotizacion';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RuteoAreaService } from 'src/app/services/comunicationAPI/seguridad/ruteo-area.service';
import { CotDocumentacionComponent } from './cot-documentacion/cot-documentacion.component';
import { PresupuestoService } from 'src/app/services/comunicationAPI/solicitudes/presupuesto.service';
import { CotProveedoresComponent } from './cot-proveedores/cot-proveedores.component';
import { NivGerenciaService } from 'src/app/services/comunicationAPI/solicitudes/niv-gerencia.service';
import { SendEmailService } from 'src/app/services/comunicationAPI/solicitudes/send-email.service';
import { CotAnulacionComponent } from './cot-anulacion/cot-anulacion.component';
import { SharedService } from 'src/app/services/shared.service';

interface RuteoArea {
  rutareaNivel: number;
  // Otras propiedades si es necesario
}

interface SolicitudData {
  cabecera: any;
  detalles: any[];
  items: any[];
}

@Component({
  selector: 'app-solicoti',
  templateUrl: './solicoti.component.html',
  styleUrls: ['./solicoti.component.css']
})
export class SolicotiComponent implements OnInit {
  cabecera!: CabeceraCotizacion;
  detalle: DetalleCotizacion[] = [];
  item: ItemCotizacion[] = [];

  solicitudEdit!: SolicitudData;


  empleado: string = '';
  inspector: string = '';
  showArea: string = '';
  areaNmco!: string;
  fecha: Date = new Date;
  private inputTimer: any;
  solNumerico!: string;
  noSolFormat!: string;


  //variables para guardar el tracking
  trTipoSolicitud: number = 1;//indica el tipo de solicitud co el que estamos trabajando, este valor cambia en cada tipo de solicitud
  trLastNoSol!: number;
  trNivelEmision: number = 10;//nivel de emision por defecto
  trIdNomEmp!: string;//id de nomina del empleado que emite la solicitud

  //variables de la cabecera
  cab_id_area!: number;
  cab_id_dpto!: number;
  cab_fecha: string = this.formatDateToYYYYMMDD(this.fecha);
  cab_asunto!: string;
  cab_proc!: string;
  cab_obsrv!: string;
  cab_adjCot: string = 'NO';
  cab_ncot: number = 0;
  cab_estado: string = 'A';//estado inicial Activo
  cab_plazo!: Date;
  cab_fechaMax!: Date;
  cab_inspector!: string;
  cab_telef_insp!: string;

  //variables del detalle
  det_id: number = 1;//se usa para el detalle y para el item por sector
  det_descp!: string;//se usa para el detalle y para el item por sector
  det_unidad: string = 'Unidad';
  det_presupuesto: number = 0;
  det_cantidad: number = 0;

  //variables del item por sector
  item_id: number = 1;
  item_cant: number = 1;
  item_sector: number = 0;

  //variables para controlar la funcionalidad de la pagina
  fechaFormat: string = this.formatDateToSpanish(this.fecha);
  changeview: string = this.serviceGlobal.solView;
  //changeview: string = 'editar';
  msjExito!: string;
  msjError!: string;
  showmsj: boolean = false;
  showmsjerror: boolean = false;
  checkDet: boolean = false;
  idToIndexMap: Map<number, number> = new Map();
  fechaSinFormato: Date = new Date();
  detType: boolean = true;

  //guarda el estado de la solicitud para controlar su acceso
  estadoSol: string = '10';

  //listas con datos de la DB
  empleadosList$!: Observable<any[]>;
  areaList$!: Observable<any[]>;
  inspectores$!: Observable<any[]>;
  detallesList$!: Observable<any[]>;
  itemxSector$!: Observable<any[]>;
  sectores$!: Observable<any[]>;
  nivelRut$!: Observable<any[]>;

  //listas locales para manejar los datos
  detalleList: Detalle[] = [];
  itemSectorList: ItemSector[] = [];
  tmpItemSect: ItemSector[] = [];
  empleados: any[] = [];
  empleadosEdit: any[] = [];
  inspectoresEdit: any[] = [];
  areas: any[] = [];
  presupuestos: any[] = [];
  //sectores: any[] = [];
  inspectores: any[] = [];
  //nivGerencias: any[] = [];

  //edicion de solicitud de cotizacion
  solID: number = this.serviceGlobal.solID;
  idDlt!: number;
  idDltDetList!: number;
  idDltDet!: number
  idNSolDlt!: number;
  idItmDlt!: number;
  idDetEdit!: number;
  det_id_edit!: number;
  det_descp_edit!: string;
  nameInspector!: string;
  // lastIDItem!: number;
  // lastIDDet!: number;

  //variables compartidas con los demas componentes
  @ViewChild(CotDocumentacionComponent) cotDocumentacion!: CotDocumentacionComponent;
  @ViewChild(CotProveedoresComponent) cotProveedores!: CotProveedoresComponent;
  @Input() sharedTipoSol: number = 1;
  @Input() sharedNoSol!: number;
  @Input() cabSolCotAsunto!: any;
  @Input() sharedDetalle: any[] = [];


  areaUserCookie: string = '';

  setMotivo: string = 'NO';
  //Variables para validacion de fecha 
  fechaminina: Date = new Date();
  fechamaxima: Date = new Date();

  fechaMin: string = '';
  fechaMax: string = '';


  constructor(private router: Router,
    private empService: EmpleadosService,
    private sectService: SectoresService,
    private areaService: AreasService,
    private nivRuteService: NivelRuteoService,
    private solTrckService: TrackingService,
    private cabCotService: CabCotizacionService,
    private detCotService: DetCotOCService,
    private itmSectService: ItemSectorService,
    private serviceGlobal: GlobalService,
    private cookieService: CookieService,
    private ruteoService: RuteoAreaService,
    private prespService: PresupuestoService,
    private nivGerenciaService: NivGerenciaService,
    private sendMailService: SendEmailService,
    private sharedService: SharedService) {
    /*  
    //se suscribe al observable de aprobacion y ejecuta el metodo enviarSolicitud
    this.sharedService.aprobar$.subscribe(() => {
      //console.log("Aprobando solicitud...");
      this.enviarSolicitud();
    });

    //se suscribe al observable de anulacion y ejecuta el codigo para anular la solicitud
    this.sharedService.anular$.subscribe(() => {
      //console.log("Anulando solicitud...");
      this.anularSolicitud();
    });

    //se suscribe al observable de no autorizacion y ejecuta el codigo para no autorizar la solicitud
    this.sharedService.noautorizar$.subscribe(() => {
      //console.log("No autorizando solicitud...");
      this.noAutorizar();
    });*/
  }

  validarNumero(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const valorIngresado = parseInt(inputElement.value, 10);

    if (valorIngresado < 1) {
      inputElement.value = '1'; // Establecer el valor mínimo si es menor que 1
    }
  }


  ngOnInit(): void {
    //fechas 
    this.fechaminina=new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
    this.fechamaxima=new Date(new Date().getFullYear(),new Date().getMonth()+6,new Date().getDate());
    this.fechaMax=this.formatDateToYYYYMMDD(this.fechamaxima);
    this.fechaMin=this.formatDateToYYYYMMDD(this.fechaminina);
    //console.log(this.cookieService.get('userRolNiveles'));
    setTimeout(()=>{
      this.areaUserCookie = this.cookieService.get('userArea');
    this.empService.getEmpleadosList().subscribe((data) => {
      this.empleadosEdit = data;
    });

    this.inspectores$ = this.empService.getEmpleadobyArea(12);//se le pasa el valor del id de nomina del area operaciones: 12
    /*this.inspectores$.subscribe((data) => {
      this.inspectoresEdit = data;
    });*/

    this.sectores$ = this.sectService.getSectoresList().pipe(
      map(sectores => sectores.sort((a, b) => a.sectNombre.localeCompare(b.sectNombre)))
    );

    this.areaService.getAreaList().subscribe((data) => {
      this.areas = data;
    });

    this.nivelRut$ = this.nivRuteService.getNivelruteo().pipe(
      map(niv => niv.sort((a, b) => a.nivel - b.nivel))
    );

    this.prespService.getPresupuestos().subscribe((data: any) => {
      this.presupuestos = data;
    });

    },100)
    if (this.changeview == 'editar') {
      this.editSolicitud();
    }

  }

  //guarda los datos de los empleados en una lista local dependiendo del tamaño de la variable de busqueda, esto se controla con un keyup
  searchEmpleado(): void {
    if (this.empleado.length > 2) {
      this.empService.getEmpleadobyArea(parseInt(this.cookieService.get('userArea'))).subscribe((data) => {
        this.empleados = data;
      });
    } else {
      this.empleados = [];
    }
  }

  searchInspector(): void {
    if (this.inspector.length > 2) {
      this.inspectores$.subscribe((data) => {
        this.inspectores = data;
      });
    } else {
      this.inspectores = [];
    }

  }

  searchInspectorEdit(): void {
    if (this.nameInspector.length > 2) {
      this.inspectores$.subscribe((data) => {
        this.inspectoresEdit = data;
      });
    } else {
      this.inspectoresEdit = [];
    }
  }

  saveIdInspector() {
    for (let insp of this.inspectoresEdit) {
      if ((insp.empleadoNombres + ' ' + insp.empleadoApellidos) == this.nameInspector) {
        //console.log(insp.empleadoIdNomina)
        this.cabecera.cabSolCotInspector = insp.empleadoIdNomina;
      }
    }
  }
  //
  verificartexto(): void {
    const patron: RegExp = /^[a-zA-Z\s]*$/;
    if (!patron.test(this.inspector)) {
      //borrar el ultimo caracter ingresado
      console.log('El inspector no puede contener el número 1',this.inspector);
      // this.inspector = this.inspector.substring(0, this.inspector.length - 1);
      this.inspector = this.inspector.replace(/[^a-zA-Z\s]/g, '');
    } 
  }
  onInputChanged(): void {
    // Cancelamos el temporizador anterior antes de crear uno nuevo
    clearTimeout(this.inputTimer);

    // Creamos un nuevo temporizador que ejecutará el método después de 1 segundo
    this.inputTimer = setTimeout(() => {
      // Coloca aquí la lógica que deseas ejecutar después de que el usuario haya terminado de modificar el input
      if (this.inspector) {
        const empleadoSeleccionado = this.inspectores.find(emp => (emp.empleadoNombres + ' ' + emp.empleadoApellidos) === this.inspector);
        this.cab_inspector = empleadoSeleccionado ? empleadoSeleccionado.empleadoIdNomina : 'XXXXXX';
        //console.log("Inspector ID", this.cab_inspector);
      } else {
        this.cab_inspector = '';
      }
    }, 500); // Retraso de 1 segundo (ajusta el valor según tus necesidades)
  }

  //guarda el nombre del area del empleado seleccionado
  selectEmpleado(): void {
    this.showArea = '';
    if (!this.empleado) {
      this.showArea = '';
    } else {
      for (let emp of this.empleados) {
        if ((emp.empleadoNombres + ' ' + emp.empleadoApellidos) == this.empleado) {
          this.trIdNomEmp = emp.empleadoIdNomina;//guarda el id de nomina del empleado utilizado para registrar el tracking
          this.cab_id_area = emp.empleadoIdArea;//guardar el area de la solicitud como int para realizar busquedas
          this.deptSolTmp = emp.empleadoIdDpto;
          this.cab_id_dpto = emp.empleadoIdDpto;//guarda el departamento de la solicitud como int para realizar busquedas
          for (let area of this.areas) {
            if (area.areaIdNomina == emp.empleadoIdArea) {
              this.showArea = area.areaDecp;//define el nombre del area para mostrarlo en el html
              this.areaNmco = area.areaNemonico.trim();//extrae el nemonico del area para generar el nombre de la solicitud
            } else if (emp.empleadoIdArea === 0) {
              this.showArea = 'El empleado no posee un area asignada.'
            }
          }
        }
      }
    }
  }

  //tranforma la fecha actual en un formato especifico "Lunes, 31 de julio de 2023"
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

  //fomatea la fecha a yyyymmdd
  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  cancelarAll(): void {
    this.clear();
    this.ngOnInit();
    try {
      this.sharedService.cotDocumentacionChange();
      this.sharedService.cotProveedoresChange();
      /*
      this.cotProveedores.RecorrerPro();
      this.cotDocumentacion.deleteAllDocs();*/

    } catch (error) {
      console.log("Error al cancelar: ", error);
    }
  }
  clear(): void {
    this.empleado = '';
    this.cab_asunto = '';
    this.det_descp = '';
    this.det_id = 1;
    this.cab_proc = '';
    this.cab_obsrv = '';
    this.cab_adjCot = '';
    this.cab_ncot = 0;
    this.cab_plazo = new Date;
    this.cab_fechaMax = new Date;
    this.inspector = '';
    this.cab_telef_insp = '';
    this.detalleList = [];
    this.itemSectorList = [];
    this.tmpItemSect = [];
  }

  getSolName(noSol: number) {
    const noSolString = noSol.toString();
    if (noSolString.length == 1) {
      this.solNumerico = "COT " + this.areaNmco + " " + this.trTipoSolicitud + "-000" + noSolString;
    } else if (noSolString.length == 2) {
      this.solNumerico = "COT " + this.areaNmco + " " + this.trTipoSolicitud + "-00" + noSolString;
    } else if (noSolString.length == 3) {
      this.solNumerico = "COT " + this.areaNmco + " " + this.trTipoSolicitud + "-0" + noSolString;
    } else if (noSolString.length == 4) {
      this.solNumerico = "COT " + this.areaNmco + " " + this.trTipoSolicitud + "-" + noSolString;
    }
  }
  //metodo para asignar numero nuevo de solicitud
  async setNoSol() {
    this.sharedNoSol = await this.getLastSol();
  }

  showDoc: boolean = false;
  async setNoSolDocumentacion() {
    await this.setNoSol();
    this.showDoc = this.showDoc ? false : true;

  }

  //obtiene el valor de la ultima solicitud registrada y le suma 1 para asignar ese numero a la solicitud nueva
  getLastSol(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.solTrckService.getLastSolicitud(this.trTipoSolicitud).subscribe(
        (resultado) => {
          if (resultado === 0) {
            //console.log('No se ha registrado ninguna solicitud de este tipo.');
            resolve(1);
          } else {
            const lastNoSol = resultado[0].solTrNumSol + 1;
            //console.log('Último valor de solicitud:', lastNoSol);
            resolve(lastNoSol);
          }
        },
        (error) => {
          console.error('Error al obtener el último valor de solicitud:', error);
          reject(error);
        }
      );
    });
  }

  guardarTrancking(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.trLastNoSol = await this.getLastSol();
        this.noSolTmp = this.trLastNoSol;

        const dataTRK = {
          solTrTipoSol: this.trTipoSolicitud,
          solTrNumSol: this.trLastNoSol,
          solTrNivel: this.trNivelEmision,
          solTrIdEmisor: this.trIdNomEmp
        };


        //console.log("1. guardando tracking: ", dataTRK);
        this.solTrckService.generateTracking(dataTRK).subscribe(
          () => {
            //console.log("Tracking guardado con éxito.");
            resolve();
          },
          (error) => {
            //console.log("Error al guardar el tracking: ", error);
            reject(error);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }



  //guarda la solicitud con estado emitido
  async generarSolicitud() {

    await this.guardarTrancking();
    this.getSolName(this.trLastNoSol);

    const dataCAB = {
      cabSolCotTipoSolicitud: this.trTipoSolicitud,
      cabSolCotIdArea: this.cab_id_area,
      cabSolCotIdDept: this.cab_id_dpto,
      cabSolCotNoSolicitud: this.trLastNoSol,
      cabSolCotSolicitante: this.trIdNomEmp,
      cabSolCotFecha: this.cab_fecha,
      cabSolCotAsunto: this.cab_asunto,
      cabSolCotProcedimiento: this.cab_proc,
      cabSolCotObervaciones: this.cab_obsrv,
      cabSolCotAdjCot: this.cab_adjCot,
      cabSolCotNumCotizacion: this.cab_ncot,
      cabSolCotEstado: this.cab_estado,
      cabSolCotEstadoTracking: this.trNivelEmision,
      cabSolCotPlazoEntrega: this.cab_plazo,
      cabSolCotFechaMaxentrega: this.cab_fechaMax,
      cabSolCotInspector: this.cab_inspector,
      cabSolCotTelefInspector: this.cab_telef_insp,
      cabSolCotNumerico: this.solNumerico,
      cabSolCotIdEmisor: this.cookieService.get('userIdNomina'),
      cabSolCotApprovedBy: 'XXXXXX',
      cabSolCotFinancieroBy: 'XXXXXX',
      cabSolCotAprobPresup: 'SI',
      cabSolCotMtovioDev: '',
    }


    //enviar datos de cabecera a la API
    //console.log("2. guardando solicitud...", dataCAB);
    await this.cabCotService.addSolCot(dataCAB).subscribe(
      response => {
        //console.log("Cabecera agregada.");
        //console.log("Solicitud", this.solNumerico);
        //console.log("Agregando cuerpo de la cabecera...");
        this.addBodySol();
        //console.log("Cuerpo agregado.");
      },
      error => {
        console.log("error al guardar la cabecera: ", error)
      }
    );

  }

  //permite crear el detalle y el item por sector y los envia a la API
  async addBodySol() {

    this.det_id = await this.getLastDetalleCot();//numero del detalle que se va a guardar


    try {
      //recorre las listas de items y detalles y los envia a la api
      this.saveDetItem();

      this.getSolName(this.trLastNoSol);
      this.showmsj = true;
      this.msjExito = `Solicitud N° ${this.solNumerico} generada exitosamente.`;


      setTimeout(() => {
        this.msjExito = "";
        this.showmsj = false;
        this.clear();
        this.router.navigate(['allrequest']);
      }, 2000);
    }
    catch (error) {
      this.showmsjerror = true;
      this.msjError = "No se ha podido generar la solicitud, intente nuevamente.";
      console.log("Error al generar la solicitud: ", error);

      setTimeout(() => {
        this.showmsjerror = false;
        this.msjError = "";
      }, 2500);
    }



  }
  IdDetalle: number = 0;
  CapturarIdDetalle(id: number): number {
    this.IdDetalle = id;
    //console.log("idDetalle", this.IdDetalle);
    return this.IdDetalle;
  }
  saveDetItem() {
    //enviar la lista detalle a la api para registrarla
    for (let detalle of this.detalleList) {//recorre la lista de detalles

      //crea el arreglo con las propiedades de detalle
      const data = {
        solCotTipoSol: this.trTipoSolicitud,
        solCotNoSol: this.trLastNoSol,
        solCotIdDetalle: detalle.det_id,
        solCotDescripcion: detalle.det_descp,
        solCotUnidad: detalle.det_unidad,
        solCotCantidadTotal: detalle.det_cantidad,
        solCotPresupuesto: detalle.det_presupuesto
      }

      //envia a la api el arreglo data por medio del metodo post
      this.detCotService.addDetalleCotizacion(data).subscribe(
        response => {
          //console.log("3. Detalle añadido exitosamente.");
        },
        error => {
          console.log("No se ha podido registrar el detalle, error: ", error);
        }
      );

    }
    //console.log(this.detalleList);

    //enviar la lista itemsector a la api
    for (let item of this.itemSectorList) {

      const data = {
        itmTipoSol: this.trTipoSolicitud,
        itmNumSol: this.trLastNoSol,
        itmIdDetalle: item.det_id,
        itmIdItem: item.item_id,
        itmCantidad: item.item_cant,
        itmSector: item.item_sector
      }

      this.itmSectService.addItemSector(data).subscribe(
        response => {
          //console.log("4. Item guardado exitosamente.");
        },
        error => {
          console.log("No se pudo guardar el item no:" + item.item_id + ", error: ", error);
        }
      );

    }
    //console.log(this.itemSectorList);
  }

  getLastDetalleCot(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.detCotService.getLastDetalleCot(this.trTipoSolicitud, this.trLastNoSol).subscribe(
        (resultado) => {
          if (resultado === 0) {
            //console.log('No se ha registrado ningun detalle para esta solicitud. Se asigna 0.');
            resolve(1);
          } else {
            const lastDetCot = resultado[0].solCotID + 1;
            //console.log('Nuevo detalle: ', lastDetCot);
            resolve(lastDetCot);
          }
        },
        (error) => {
          console.error('Error al obtener el último id de detalle:', error);
          reject(error);
        }
      );
    });
  }

  check() {
    for (let idDet of this.itemSectorList) {
      for (let det of this.detalleList) {
        if (idDet.det_id == det.det_id) {
          //console.log("El detalle para este item si existe.");
          this.checkDet = true;
        } else {
          //console.log("Error, el detalle no se ha agregado");
          this.checkDet = false;
        }
      }
    }

    if (this.checkDet == true) {
      //console.log("Añadiendo detalle...");
      this.generarSolicitud();
    } else {
      this.showmsjerror = true;
      this.msjError = "Error, asegúrese de ingresar todos los detalles antes de registrar la solicitud.";

      setTimeout(() => {
        this.showmsjerror = false;
        this.msjError = "";
      }, 2500);
    }
  }


  //agrega los detalles a la lista detalles
  addDetalle() {
    this.saveItemSect();


    const detalle = {
      det_id: this.det_id,
      det_descp: this.det_descp,
      det_unidad: this.det_unidad,
      det_cantidad: this.det_cantidad,
      det_presupuesto: this.det_presupuesto
    }

    this.detalleList.push(detalle);
    this.sharedDetalle = this.detalleList;
    this.cabSolCotAsunto = this.cab_asunto;
    /*console.log("Detalles:", this.detalleList);
    console.log("est es shared detalle", this.sharedDetalle);
    console.log("este es el asunto", this.cabSolCotAsunto);*/
    //aumenta el valor del id de detalle
    this.incrementDetID();


    //verificacion para asignar el id del item
    if (!this.detType) {
      this.item_id = 1
    }
    this.item_id = 1

    //si esta en la vista de editar, enviar los datos a las listas de la respuesta
    if (this.changeview == "editar") {
      this.saveLocaltoResponse();
      //console.log("Item a enviar a la api: ", this.item)
    }

    this.det_descp = '';
    this.det_unidad = 'Unidad';
    this.det_cantidad = 0;
    this.det_presupuesto = 0;
    this.tmpItemSect = [];



  }

  incrementDetID() {
    //aumenta el valor del id de detalle

    if (this.detalleList.length == 0) {
      this.det_id = 1;
    } else {
      for (let det of this.detalleList) {
        this.det_id = det.det_id + 1;
      }
    }


  }

  async deleteDetalle(id: number) {
    const index = this.detalleList.findIndex(detalle => detalle.det_id === id);

    //console.log(index)
    if (index !== -1) {
      //console.log("detalle eliminado")
      this.detalleList.splice(index, 1);
      this.idToIndexMap.delete(index);
    }

    for (let i = 0; i < this.detalleList.length; i++) {
      this.detalleList[i].det_id = i + 1;
      this.idToIndexMap.set(this.detalleList[i].det_id, i);
    }
    this.incrementDetID();

  }

  //agregar los items a una lista temporal 
  //se usa una lista temporal ya que hay que limpiarla cada vez que se vaya a agregar items que pertenezcan a un detalle nuevo
  addItemSector(): void {

    const tmpItemSector = {
      det_id: this.det_id,
      det_descp: this.det_descp,
      item_id: this.item_id,
      item_cant: this.item_cant,
      item_sector: this.item_sector
    }

    this.tmpItemSect.push(tmpItemSector);

    //this.det_cantidad += this.item_cant;
    this.calcularSumaItems();

    //aumenta el valor del id de los items
    for (let itm of this.tmpItemSect) {
      this.item_id = itm.item_id + 1;
    }

    this.item_cant = 1;
    this.item_sector = 0;
  }

  calcularSumaItems() {
    this.det_cantidad = 0;
    for (let itm of this.tmpItemSect) {
      if (itm.det_id === this.det_id) {
        this.det_cantidad += itm.item_cant;
      }
    }
  }


  //agregar la opcion para eliminar los items de los detalles, lista ItemSectorList

  //Icrementa el valor Item 
  incrementItemID() {
    //aumemta eL valor de los ITEM
    if (this.tmpItemSect.length == 0) {
      this.item_id = 1;
    } else {
      for (let itm of this.tmpItemSect) {
        this.item_id = itm.item_id + 1;
      }
    }
  }
  //Eliminar  Item 
  deleteItem(id: number) {
    const index = this.tmpItemSect.findIndex(item => item.item_id === id);

    //console.log(index)
    //console.log(id)
    if (index !== -1) {
      //console.log("item eliminado")
      this.tmpItemSect.splice(index, 1);
      this.idToIndexMap.delete(index);
    }
    this.calcularSumaItems();

    for (let i = 0; i < this.tmpItemSect.length; i++) {
      this.tmpItemSect[i].item_id = i + 1;
      this.idToIndexMap.set(this.tmpItemSect[i].item_id, i);
    }
    this.incrementItemID();


  }


  //agregar los items de la lista temporal a la lista definitiva
  saveItemSect(): void {

    for (let tmpitm of this.tmpItemSect) {
      const itemSector = {
        det_id: tmpitm.det_id,
        det_descp: tmpitm.det_descp,
        item_id: tmpitm.item_id,
        item_cant: tmpitm.item_cant,
        item_sector: tmpitm.item_sector
      }

      this.itemSectorList.push(itemSector);

    }

    //console.log("Items:", this.itemSectorList);

  }

  //guarda los items de la lista local a la lista ITEM que tiene la respuesta de la solicitud
  saveLocaltoResponse() {
    for (let itm of this.itemSectorList) {

      const data = {
        itmID: 0,//valor sin importancia porque lo asigna la base de datos
        itmTipoSol: this.cabecera.cabSolCotTipoSolicitud,
        itmNumSol: this.cabecera.cabSolCotNoSolicitud,
        itmIdDetalle: itm.det_id,
        itmIdItem: itm.item_id,
        itmCantidad: itm.item_cant,
        itmSector: itm.item_sector
      }

      this.item.push(data);
    }

    this.itemSectorList = [];

    for (let det of this.detalleList) {

      const data = {
        solCotID: 0,//valor sin importancia porque lo asigna la base de datos
        solCotTipoSol: this.cabecera.cabSolCotTipoSolicitud,
        solCotNoSol: this.cabecera.cabSolCotNoSolicitud,
        solCotIdDetalle: det.det_id,
        solCotDescripcion: det.det_descp,
        solCotUnidad: det.det_unidad,
        solCotCantidadTotal: det.det_cantidad,
        solCotPresupuesto: det.det_presupuesto
      }

      this.detalle.push(data);
    }

    this.detalleList = [];
  }

  /////////////////////////////////////////PETICION DE SOLICITUD SELECCIONADA/////////////////////////////////////////
  async editSolicitud() {
    this.clearSolGuardada();
    await this.getSolicitud();
    await this.saveData();
    //await this.changeView('editar');
  }

  clearSolGuardada(): void {
    this.solicitudEdit = { cabecera: {}, detalles: [], items: [] };
    this.cabecera = new CabeceraCotizacion(0);
    this.detalle = [];
    this.item = [];
  }


  async getSolicitud() {
    try {
      const data = await this.cabCotService.getCotizacionbyId(this.solID).toPromise();
      this.solicitudEdit = data;
    } catch (error) {
      console.error('Error al obtener la solicitud:', error);
    }
  }

  async saveData() {
    //guardar los datos de la lista solicitud edit en los objetos cabecera, detalle e item
    //console.log(this.solicitudEdit)
    this.cabecera = this.solicitudEdit.cabecera;
    this.cabSolCotAsunto = this.cabecera.cabSolCotAsunto;//envia la cabecera al componente de proveedores
    this.sharedTipoSol = this.cabecera.cabSolCotTipoSolicitud;
    this.sharedNoSol = this.cabecera.cabSolCotNoSolicitud;
    this.checkAprobPrep(this.cabecera.cabSolCotEstadoTracking);
    this.noSolTmp = this.cabecera.cabSolCotNoSolicitud;
    this.estadoTrkTmp = this.cabecera.cabSolCotEstadoTracking;
    this.deptSolTmp = this.cabecera.cabSolCotIdDept;

    //asigna el nivel de tracking de la solicitud a una variable para controlar la edicion
    this.estadoSol = this.cabecera.cabSolCotEstadoTracking.toString();

    for (let emp of this.empleadosEdit) {
      if (emp.empleadoIdNomina == this.cabecera.cabSolCotInspector) {
        this.nameInspector = emp.empleadoNombres + ' ' + emp.empleadoApellidos;
      }
    }

    for (let det of this.solicitudEdit.detalles) {
      this.detalle.push(det as DetalleCotizacion);
    }
    this.sharedDetalle = this.solicitudEdit.detalles;//envia los detalles al componente de proveedores

    this.detalle.sort((a, b) => a.solCotIdDetalle - b.solCotIdDetalle);
    this.det_id = this.detalle.length + 1;

    for (let itm of this.solicitudEdit.items) {
      this.item.push(itm as ItemCotizacion);
    }

    this.item.sort((a, b) => {
      if (a.itmIdDetalle === b.itmIdDetalle) {
        return a.itmIdItem - b.itmIdItem; // Si los detalles son iguales, ordenar por ID de item
      }
      return a.itmIdDetalle - b.itmIdDetalle; // Ordenar por ID de detalle
    });

    this.fechaSinFormato = this.convertirStringAFecha(this.cabecera.cabSolCotFecha);

    //formatear la fecha de la solicitud para mostrar dia de semana y fecha
    this.cabecera.cabSolCotFecha = format(parseISO(this.cabecera.cabSolCotFecha),
      'eeee, d \'de\' MMMM \'de\' yyyy', { locale: es });
    this.cabecera.cabSolCotFecha = this.cabecera.cabSolCotFecha.charAt(0)
      .toUpperCase() + this.cabecera.cabSolCotFecha.slice(1);

    // Formatear la fecha máxima de entrega en formato 'yyyy-MM-dd'
    this.cabecera.cabSolCotFechaMaxentrega = format(parseISO(this.cabecera.cabSolCotFechaMaxentrega),
      'yyyy-MM-dd');

    // Formatear el plazo de entrega en formato 'yyyy-MM-dd'
    this.cabecera.cabSolCotPlazoEntrega = format(parseISO(this.cabecera.cabSolCotPlazoEntrega),
      'yyyy-MM-dd');

    //ordena los items de la lista segun el id del detalle de menor a mayor
    this.item.sort((a, b) => a.itmIdDetalle - b.itmIdDetalle);

    this.setView();
  }

  get estadoTexto(): string {
    switch (this.cabecera.cabSolCotEstado) {
      case 'A':
        return 'Activo';
      case 'F':
        return 'Finalizado';
      case 'C':
        return 'Anulado';
      default:
        return ''; // Manejo por defecto si el valor no es A, F o C
    }
  }

  //////////////////////////////////EDICION DE SOLICITUD DE COTIZACION//////////////////////////////////

  async changeView(view: string) {
    this.changeview = view;
    this.clear();
  }

  cancelar(): void {
    this.serviceGlobal.solView = 'crear';
    this.router.navigate(['allrequest']);
    this.clear();
    this.changeView('consultar');
  }

  //ELIMINAR ITEMS Y DETALLES Y REORNDENAR LOS IDS

  confDeleteDet(idListDet: number, idDetalle: number) {
    this.idDltDetList = idListDet;
    this.idDltDet = idDetalle;
    //console.log(this.idDltDetList, this.idDltDet)
  }

  deleteDetSaved() {//elimina el item de la lista local y llama al metodo que ejecuta los cambios en la base
    const index = this.detalle.findIndex(det => det.solCotID === this.idDltDetList);
    //console.log("Detalle a eliminar numero ", index)

    if (index !== -1) {
      this.detalle.splice(index, 1);
      this.det_id--;
      /*this.reorderAndSaveItems();
      this.calcularCantDetalle();
      this.calcularIdItem();*/

      //ELIMINAR ITEMS QUE PERTENECEN AL DETALLE ELIMINADO
      for (let i = this.item.length - 1; i >= 0; i--) {
        if (this.item[i].itmIdDetalle === this.idDltDet) {
          this.item.splice(i, 1);
        }
      }

      //ACTUALIZAR EL ID DEL DETALLE DE LOS SIGUIENTES ITEMS
      for (let i = 0; i < this.item.length; i++) {
        if (this.item[i].itmIdDetalle > this.idDltDet) {
          this.item[i].itmIdDetalle = this.item[i].itmIdDetalle - 1;
        }
      }

      //ACTUALIZAR EL ID DE LOS DETALLES LUEGO DE ELIMINAR UN DETALLE
      for (let d = 0; d < this.detalle.length; d++) {
        if (this.detalle[d].solCotIdDetalle > this.idDltDet) {
          this.detalle[d].solCotIdDetalle = this.detalle[d].solCotIdDetalle - 1;
        }
      }
    }
    //console.log(this.item);
  }

  confDeleteItm(idList: number, idItem: number, idNSol: number) {//abre el modal y guarda los datos del item en variables locales
    this.idDlt = idList;
    this.idItmDlt = idItem;
    this.idNSolDlt = idNSol;
    //console.log(this.idDlt, this.idItmDlt);
  }

  deleteItemSaved() {//elimina el item de la lista local y llama al metodo que ejecuta los cambios en la base
    const index = this.item.findIndex(itm => itm.itmID === this.idDlt);

    if (index !== -1) {
      this.item.splice(index, 1);
      this.reorderAndSaveItems();
      this.calcularCantDetalle();
      this.calcularIdItem();
    }
  }

  async reorderAndSaveItems() {
    const detailItemMap: { [key: number]: number } = {};

    for (const item of this.item) {
      const detalle = item.itmIdDetalle;

      if (!detailItemMap[detalle]) {
        detailItemMap[detalle] = 1;
      }

      item.itmIdItem = detailItemMap[detalle];
      detailItemMap[detalle]++;
    }
    //console.log(this.item);
  }

  openModalItem() {
    this.item_id = 1;
  }

  //AGREGAR NUEVO ITEM A UN DETALLE SELECCIONADO
  addNewItem() {
    const data = {
      itmID: 0,//valor sin importancia porque lo asigna la base de datos
      itmTipoSol: this.cabecera.cabSolCotTipoSolicitud,
      itmNumSol: this.cabecera.cabSolCotNoSolicitud,
      itmIdDetalle: this.idDetEdit,
      itmIdItem: this.item_id,
      itmCantidad: this.item_cant,
      itmSector: this.item_sector
    }

    this.item.push(data);

    //console.log(this.item);


    this.calcularIdItem();
    this.calcularCantDetalle();
    this.item_cant = 1;
    this.item_sector = 0;
  }

  selectDet(det: DetalleCotizacion) {
    this.idDetEdit = det.solCotIdDetalle;
    this.det_descp_edit = det.solCotDescripcion;
    this.det_id_edit = det.solCotIdDetalle;
    this.calcularIdItem();
  }

  cancelarItem(): void {
    this.calcularCantDetalle();
    this.det_cantidad = 0;
    this.det_presupuesto = 0;
    this.det_descp_edit = '';
    this.item_id = 1;
    this.tmpItemSect = [];
  }

  calcularCantDetalle() {
    for (let det of this.detalle) {
      if (det.solCotIdDetalle === this.idDetEdit) {
        det.solCotCantidadTotal = 0; // Reiniciar la cantidad total del detalle
        for (let itm of this.item) {
          if (itm.itmIdDetalle === det.solCotIdDetalle) {
            det.solCotCantidadTotal += itm.itmCantidad;
          }
        }
      }
    }
    //this.det_cantidad += this.item_cant;
  }

  calcularIdItem() {
    for (let itm of this.item) {
      if (itm.itmIdDetalle === this.idDetEdit) {
        this.item_id = itm.itmIdItem + 1;
      }
    }
  }

  clearList() {
    this.itemSectorList = [];
    this.detalleList = [];
  }


  ///GUARDAR EDICION DE LA CABECERA
  convertirStringAFecha(fechaStr: string): Date {
    const fechaConvertida = new Date(fechaStr);
    return fechaConvertida;
  }

  async saveEditCabecera() {
    const dataCAB = {
      cabSolCotID: this.cabecera.cabSolCotID,
      cabSolCotTipoSolicitud: this.cabecera.cabSolCotTipoSolicitud,
      cabSolCotIdArea: this.cabecera.cabSolCotIdArea,
      cabSolCotIdDept: this.cabecera.cabSolCotIdDept,
      cabSolCotNoSolicitud: this.cabecera.cabSolCotNoSolicitud,
      cabSolCotSolicitante: this.cabecera.cabSolCotSolicitante,
      cabSolCotFecha: this.fechaSinFormato,
      cabSolCotAsunto: this.cabecera.cabSolCotAsunto,
      cabSolCotProcedimiento: this.cabecera.cabSolCotProcedimiento,
      cabSolCotObervaciones: this.cabecera.cabSolCotObervaciones,
      cabSolCotAdjCot: this.cabecera.cabSolCotAdjCot,
      cabSolCotNumCotizacion: this.cabecera.cabSolCotNumCotizacion,
      cabSolCotEstado: this.cabecera.cabSolCotEstado,
      cabSolCotEstadoTracking: this.cabecera.cabSolCotEstadoTracking,
      cabSolCotPlazoEntrega: this.cabecera.cabSolCotPlazoEntrega,
      cabSolCotFechaMaxentrega: this.cabecera.cabSolCotFechaMaxentrega,
      cabSolCotInspector: this.cabecera.cabSolCotInspector,
      cabSolCotTelefInspector: this.cabecera.cabSolCotTelefInspector,
      cabSolCotNumerico: this.cabecera.cabSolCotNumerico,
      cabSolCotAprobPresup: this.cabecera.cabSolCotAprobPresup,
      cabSolCotMtovioDev: this.cabecera.cabSolCotMtovioDev,
      cabSolCotIdEmisor: this.cookieService.get('userIdNomina'),
      cabSolCotApprovedBy: this.aprobadopor,
      cabSolCotFinancieroBy: this.financieropor
    };

    //console.log("Cabecera editada: ", this.cabecera.cabSolCotID, dataCAB);
    this.cabCotService.updateCabCotizacion(this.cabecera.cabSolCotID, dataCAB).subscribe(
      (response) => {
        //console.log('CABECERA ACTUALIZADA CORRECTAMENTE');
      },
      (error) => {
        console.log('error : ', error);
      }
    );

  }

  //GUARDAR EDICION DE LOS DETALLES
  async saveEditDetalle() {
    //eliminar todos los detalles de la solicitud
    await this.deleteAllDetails();

    //guardar los nuevos detalles de la solicitud
    for (let detalle of this.detalle) {

      const data = {
        solCotTipoSol: this.cabecera.cabSolCotTipoSolicitud,
        solCotNoSol: this.cabecera.cabSolCotNoSolicitud,
        solCotIdDetalle: detalle.solCotIdDetalle,
        solCotDescripcion: detalle.solCotDescripcion,
        solCotUnidad: detalle.solCotUnidad,
        solCotCantidadTotal: detalle.solCotCantidadTotal,
        solCotPresupuesto: detalle.solCotPresupuesto
      }
      //console.log("Nuevo detalle: ", data);
      this.detCotService.addDetalleCotizacion(data).subscribe(
        response => {
          //console.log("Nuevo detalle", detalle.solCotIdDetalle, " guardado en la base");
        },
        error => {
          console.log("No se ha podido registrar el detalle, error: ", error);
        }
      );

    }
  }

  deleteAllDetails(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.detCotService.deleteAllDetBySol(this.cabecera.cabSolCotTipoSolicitud, this.cabecera.cabSolCotNoSolicitud).subscribe(
          response => {
            //console.log("Todos los detalles eliminados");
            resolve();
          },
          error => {
            console.log("Error: ", error);
            reject(error);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  //GUARDAR EDICION DE LOS ITEMS
  async saveEditItem() {
    //eliminar todos los items de la solicitud
    await this.deleteAllItems();

    //guardar los nuevos items de la solicitud
    for (let item of this.item) {

      const data = {
        itmTipoSol: this.cabecera.cabSolCotTipoSolicitud,
        itmNumSol: this.cabecera.cabSolCotNoSolicitud,
        itmIdDetalle: item.itmIdDetalle,
        itmIdItem: item.itmIdItem,
        itmCantidad: item.itmCantidad,
        itmSector: item.itmSector
      }
      //console.log("Nuevo item: ", data);

      this.itmSectService.addItemSector(data).subscribe(
        response => {
          //console.log("Nuevo item guardado en la base, item:", item.itmIdItem, ", detalle:", item.itmIdDetalle);
        },
        error => {
          console.log("No se pudo guardar el item no:" + item.itmIdItem + ", error: ", error);
        }
      );

    }
  }

  deleteAllItems(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.itmSectService.deleteAllItemBySol(this.cabecera.cabSolCotTipoSolicitud, this.cabecera.cabSolCotNoSolicitud).subscribe(
          response => {
            //console.log("Todos los items eliminados");
            resolve();
          },
          error => {
            console.log("Error: ", error);
            reject(error);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }


  //GUARDA TODA LA EDICION DE LA SOLICITUD
  async saveEdit() {
    try {
      await this.saveEditCabecera();
      await this.saveEditDetalle();
      await this.saveEditItem();

      this.showmsj = true;
      this.msjExito = `Solicitud N° ${this.cabecera.cabSolCotNumerico} editada exitosamente.`;

      setTimeout(() => {
        this.msjExito = '';
        this.showmsj = false;
        this.clear();
        this.serviceGlobal.solView = 'crear';
        this.router.navigate(['allrequest']);
      }, 2500);

    } catch (error) {
      console.log('Error:', error);
      this.showmsjerror = true;
      this.msjError = "No se ha podido guardar la solicitud, intente nuevamente.";

      setTimeout(() => {
        this.showmsjerror = false;
        this.msjError = "";
      }, 2500);
    }
  }

  //////////////////////////////////////////////////EDICION DE PROVEEDORES///////////////////////////////////////////////////

  actionCreate: string = 'creacion';
  actionEdit: string = 'edicion';

  selectCreateAction(action: string) {
    this.actionCreate = action;
  }

  selectEditAction(action: string) {
    this.actionEdit = action;
  }

  /////////////////////////////////////////////////APROBACION PRESUPUESTARIA//////////////////////////////////////////////////
  aprobPreps: boolean = false;

  checkAprobPrep(nivel: number) {
    if (nivel >= 60) {
      this.aprobPreps = true;
    } else {
      this.aprobPreps = false;
    }
  }

  ////////////////////////////////////////////CONTROL DE VISUALIZACION SEGUN ESTADO//////////////////////////////////////////
  viewElement: boolean = false;

  setView() {
    const userNivelesCookie = this.cookieService.get('userRolNiveles');
    const userNivelesArray = userNivelesCookie.split(',').map(Number);
    if (userNivelesArray.includes(this.cabecera.cabSolCotEstadoTracking)) {
      this.viewElement = true;
    } else {
      this.viewElement = false;
    }
    //console.log('viewElement: ', this.viewElement);
  }

  ////////////////////////////////////////////ENVIO DE SOLICITUD DE COTIZACION//////////////////////////////////////////

  guardarEnviarSolNueva() {
    try {
      this.check();
      setTimeout(() => {
        this.enviarSolicitud();
      }, 500);
      //this.sendNotify();
    } catch (error) {
      console.log('Error:', error);
      this.showmsjerror = true;
      this.msjError = "No se ha podido enviar la solicitud, intente nuevamente.";

      setTimeout(() => {
        this.showmsjerror = false;
        this.msjError = "";
      }, 2500);
    }
  }

  //añadir el envio del correo a la edicion y los otros tipos de solicitud
  guardarEnviarSolEditada() {
    try {
      this.saveEdit();
      setTimeout(() => {
        this.enviarSolicitud();
      }, 500);
      //this.sendNotify();
    } catch (error) {
      console.log('Error:', error);
      this.showmsjerror = true;
      this.msjError = "No se ha podido enviar la solicitud, intente nuevamente.";

      setTimeout(() => {
        this.showmsjerror = false;
        this.msjError = "";
      }, 2500);
    }
  }

  noSolTmp: number = 0;//asegurarse que el numero de solicitud actual de la cabecera este llegando aqui
  estadoTrkTmp: number = 10;//asegurarse que el estado actual de la cabecera este llegando aqui
  deptSolTmp: number = 0;//asegurarse que el area actual de la cabecera este llegando aqui

  aprobadopor: string = 'XXXXXX';
  financieropor: string = 'XXXXXX';
  // Método que cambia el estado del tracking de la solicitud ingresada como parámetro al siguiente nivel
  async enviarSolicitud() {
    //verifica los niveles de aprobacion y financiero para asignar el usuario que envia la solicitud para guardar el empleado quien autoriza
    if (this.estadoTrkTmp == 40) {
      this.aprobadopor = this.cookieService.get('userIdNomina');
      //this.saveEditCabecera();
      this.setAprobadoPor(this.aprobadopor);
    } else if (this.estadoTrkTmp == 60) {
      this.financieropor = this.cookieService.get('userIdNomina');
      //this.saveEditCabecera();
      this.setFinancieroPor(this.financieropor);
    } 

    await this.getNivelRuteoArea();
    try {
      // Espera a que se complete getNivelRuteoArea
      let newEstado: number = 0;
      let newestadoSt: string;
      //si la solicitud ya eta en el nivel 70 se cambia su estado a FINALIZADO

      if (this.estadoTrkTmp == 70) {
        //console.log("FINALIZADO");
        try {
          //console.log("Valores de actualizacion de estado:", this.trTipoSolicitud, this.noSolTmp, newEstado);
          this.cabCotService.updateEstadoCotizacion(this.trTipoSolicitud, this.noSolTmp, 'F').subscribe(
            (response) => {
              this.cabCotService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, 0).subscribe(
                (response) => {

                  this.showmsj = true;
                  this.msjExito = `La solicitud ha sido enviada exitosamente.`;

                  setTimeout(() => {
                    this.showmsj = false;
                    this.msjExito = '';
                    this.clear();
                    this.serviceGlobal.solView = 'crear';
                    this.router.navigate(['allrequest']);
                  }, 2000);
                },
                (error) => {
                  console.log('Error al actualizar el estado: ', error);
                }
              );
            },
            (error) => {
              console.log('Error al actualizar el estado: ', error);
            }
          );


        } catch (error) {
          console.error('Error al setear el estado como finalizado: ', error);
        }

      } else {
        for (let i = 0; i < this.nivelSolAsignado.length; i++) {
          var nivel = this.nivelSolAsignado[i];
          if (nivel.rutareaNivel == this.estadoTrkTmp) {
            newEstado = this.nivelSolAsignado[i + 1].rutareaNivel;
            //extrae el tipo de proceso del nivel actual
            this.nivRuteService.getNivelInfo(newEstado).subscribe(
              (response) => {
                newestadoSt = response[0].procesoRuteo;
                //console.log("tipo de proceso de nivel: ", newestadoSt);
              },
              (error) => {
                console.log('Error al obtener el nuevo estado de tracking: ', error);
              }
            );
           
            break;
          }

        }
        //hace la peticion a la API para cambiar el estado de la solicitud
        //console.log("Valores de actualizacion de estado:", this.trTipoSolicitud, this.noSolTmp, newEstado);
        setTimeout(() => {
          this.cabCotService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, newEstado).subscribe(
            (response) => {
              //console.log("Solicitud enviada");
              this.showmsj = true;
              this.msjExito = `La solicitud ha sido enviada exitosamente.`;

              //LLAMA AL METODO DE ENVIAR CORREO Y LE ENVIA EL SIGUIENTE NIVEL DE RUTEO
              this.sendNotify(newEstado, newestadoSt);

              setTimeout(() => {
                this.showmsj = false;
                this.msjExito = '';
                this.clear();
                this.serviceGlobal.solView = 'crear';
                this.router.navigate(['allrequest']);
              }, 2000);
            },
            (error) => {
              console.log('Error al actualizar el estado: ', error);
            }
          );
        }, 500);

      }

    } catch (error) {
      console.error('Error al obtener los niveles de ruteo asignados: ', error);
    }
  }




  // Método que consulta los niveles que tiene asignado el tipo de solicitud según el área
  nivelSolAsignado: RuteoArea[] = [];
  nivelRuteotoAut: RuteoArea[] = [];
  nivelesRuteo: any[] = [];
  async getNivelRuteoArea() {
    this.nivelRut$.subscribe((response) => { this.nivelesRuteo = response; });
    try {
      const response = await this.ruteoService.getRuteosByArea(this.deptSolTmp).toPromise();
      this.nivelSolAsignado = response.filter((res: any) => res.rutareaTipoSol == this.trTipoSolicitud);
      this.nivelSolAsignado.sort((a, b) => a.rutareaNivel - b.rutareaNivel);
      this.nivelRuteotoAut = this.nivelSolAsignado;
      //console.log('Niveles de ruteo asignados: ', this.nivelSolAsignado);
    } catch (error) {
      throw error;
    }
  }

  metodo(){
    this.ruteoService.getRuteosByArea(this.deptSolTmp).subscribe(
      response => {
        console.log(response)
      },
      error => {
        console.log(error)
      }
    )
  }
  ///////////////////////////////////////////ANULACION DE SOLICITUD///////////////////////////////////////////////////

  anularSolicitud() {
    let exito: boolean = false;
    let exitotrk: boolean = false;
    let mailToNotify: string = '';

    this.empService.getEmpleadoByNomina(this.cabecera.cabSolCotSolicitante).subscribe(
      (response: any) => {
        //console.log('Empleado: ', response);
        mailToNotify = response[0].empleadoCorreo;
        //console.log("Correo enviado a: ", mailToNotify)
      },
      (error) => {
        console.log('Error al obtener el empleado: ', error);
      }
    );

    try {
      this.cabCotService.updateEstadoCotizacion(this.trTipoSolicitud, this.noSolTmp, 'C').subscribe(
        (response) => {
          //console.log('Estado actualizado exitosamente');
          exito = true;
        },
        (error) => {
          console.log('Error al actualizar el estado: ', error);
          exito = false;
        }
      );

      this.cabCotService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, 9999).subscribe(
        (response) => {
          //console.log('Estado de tracknig actualizado exitosamente');
          exitotrk = true;
        },
        (error) => {
          console.log('Error al actualizar el estado: ', error);
          exitotrk = false;
        }
      );
      setTimeout(() => {

        if (exito && exitotrk) {
          this.showmsj = true;
          this.msjExito = `La solicitud N° ${this.cabecera.cabSolCotNumerico} ha sido anulada exitosamente.`;

          //notificar al emisor de la solicitud que ha sido anulada
          this.sendMail(mailToNotify,2);

          setTimeout(() => {
            this.showmsj = false;
            this.msjExito = '';
            this.clear();
            this.serviceGlobal.solView = 'crear';
            this.router.navigate(['allrequest']);
          }, 2500);
        }
      }, 1000);

    } catch (error) {
      console.log('Error:', error);
      this.showmsjerror = true;
      this.msjError = "No se ha podido anular la solicitud, intente nuevamente.";
      setTimeout(() => {
        this.showmsjerror = false;
        this.msjError = '';
      }, 2500);
    }

  }
  ///////////////////////////////////////////NO AUTORIZAR SOLICITUD///////////////////////////////////////////////////

  async noAutorizar() {
    await this.getNivelRuteoArea();
    //console.log("Niveles de ruteo asignados: ", this.nivelRuteotoAut);


    for (let i = 0; i < this.nivelRuteotoAut.length; i++) {
      let niv = this.nivelRuteotoAut[i];
      if (niv.rutareaNivel == this.estadoTrkTmp) {
        let newEstado = this.nivelRuteotoAut[i - 1].rutareaNivel;
        let newestadoSt = '';

        //extrae el tipo de proceso del nivel actual
        this.nivRuteService.getNivelInfo(newEstado).subscribe(
          (response) => {
            newestadoSt = response[0].procesoRuteo;
            //console.log("tipo de proceso de nivel: ", newestadoSt);
          },
          (error) => {
            console.log('Error al obtener el nuevo estado de tracking: ', error);
          }
        );

        this.cabCotService.updateEstadoTRKCotizacion(this.trTipoSolicitud, this.noSolTmp, newEstado).subscribe(
          (response) => {
            //console.log('Estado de tracknig actualizado exitosamente');
            this.showmsj = true;
            this.msjExito = `La solicitud N° ${this.cabecera.cabSolCotNumerico} ha sido devuelta al nivel anterior.`;

            //notificar al nivel anterior del devolucion de la solicitud
            this.sendNotify(newEstado, newestadoSt);

            setTimeout(() => {
              this.showmsj = false;
              this.msjExito = '';
              this.clear();
              this.serviceGlobal.solView = 'crear';
              this.router.navigate(['allrequest']);
            }, 2500);
          },
          (error) => {
            console.log('Error al actualizar el estado: ', error);
            this.showmsjerror = true;
            this.msjError = "No se ha podido devolver la solicitud, intente nuevamente.";

            setTimeout(() => {
              this.showmsjerror = false;
              this.msjError = '';
            }, 2500);
          }
        );

        //console.log("Nuevo estado: ", newEstado);
        break;
      }

    }
  }


  ////////////////////////////////////NOTIFICACION AL SIGUIENTE NIVEL/////////////////////////////////////////////////


  async sendNotify(nivelStr: number, nivelStatus: string) {
    //console.log("Nivel de ruteo: ", nivelStr);

    let mailToNotify = '';
    let depToSearch = 0;

    if (nivelStatus == 'E') {
      depToSearch = this.deptSolTmp;
    } else if (nivelStatus == 'G') {
      depToSearch = 0;
    }

    setTimeout(() => {
      this.nivGerenciaService.getNivGerenciasByDep(depToSearch, nivelStr).subscribe(
        (response) => {
          //console.log('Niveles de gerencia para este nivel: ', response);
          for (let emp of response) {
            if (emp.empNivImp == 'T') {
              //buscar el correo del empleado y setear su correo en la variable maltonotify
              this.empService.getEmpleadoByNomina(emp.empNivEmpelado).subscribe(
                (response: any) => {
                  //console.log('Empleado: ', response);
                  mailToNotify = response[0].empleadoCorreo;
                  //enviar la notificacion al correo guardado en mailnotify
                  this.sendMail(mailToNotify, 1);
                  console.log("Correo enviado a: ", mailToNotify)
                },
                (error) => {
                  console.log('Error al obtener el empleado: ', error);
                }
              );
            }
          }
        },
        (error) => {
          console.log('Error al obtener los niveles de gerencia: ', error);
        }
      );
    }, 100);
  }

  emailContent: string = `Estimado,<br>Hemos recibido una nueva solicitud.<br>Para continuar con el proceso, le solicitamos que revise y apruebe esta solicitud para que pueda avanzar al siguiente nivel de ruteo.<br>Esto garantizará una gestión eficiente y oportuna en el Proceso de Compras.<br>Por favor ingrese a la app SOLICITUDES para acceder a la solicitud.`;

  emailContent2: string = `Estimado,<br>Le notificamos que la solicitud de cotización generada ha sido anulada, si desea conocer más detalles pónganse en contacto con el departamento de compras o financiero.`;

  sendMail(mailToNotify: string, type: number) {
    let contenidoMail = '';

    if(type == 1){
      contenidoMail = this.emailContent;
    } else if(type == 2){
      contenidoMail = this.emailContent2;
    }

    setTimeout(() => {
      const data = {
        destinatario: mailToNotify,
        //destinatario: 'joseguillermojm.jm@gmail.com',
        asunto: 'Nueva Solicitud Recibida - Acción Requerida',
        contenido: contenidoMail
      }

      this.sendMailService.sendMailto(data).subscribe(
        response => {
          //console.log("Exito, correo enviado");
          // this.showmsj = true;
          // this.msjExito = `Correos enviados exitosamente.`;

          // setTimeout(() => {
          //   this.showmsj = false;
          //   this.msjExito = '';
          // }, 4000)

        },
        error => {
          console.log(`Error, no se ha podido enviar el correo al proveedor.`, error)
          this.showmsjerror = true;
          this.msjError = `Error, no se ha podido enviar el correo al proveedor, intente nuevamente.`;

          setTimeout(() => {
            this.showmsjerror = false;
            this.msjError = '';
          }, 4000)
        }
      );
    }, 500);
  }


  setMotivoDev() {
    if (this.cabecera.cabSolCotAprobPresup == 'SI') {
      this.setMotivo = 'NO';
    } else {
      this.setMotivo = 'SI';
    }
    //this.setMotivo = !this.setMotivo;
  }

  setAprobadoPor(id: string) {
    this.cabCotService.updateAprobadoCotizacion(this.trTipoSolicitud, this.noSolTmp, id).subscribe(
      (response) => {
        //console.log('ACTUALIZADO CORRECTAMENTE');
      },
      (error) => {
        console.log('error : ', error);
      }
    );
  }

  setFinancieroPor(id: string) {
    this.cabCotService.updateFinancieroCotizacion(this.trTipoSolicitud, this.noSolTmp, id).subscribe(
      (response) => {
        //console.log('ACTUALIZADO CORRECTAMENTE');
      },
      (error) => {
        console.log('error : ', error);
      }
    );
  }

}